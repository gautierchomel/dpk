export type StrapiArticle = {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  publishedAt: string;
  createdAt: string;
  authorName: string;
  categoryName: string;
};

type StrapiManyResponse = {
  data: Array<Record<string, unknown>>;
};

type StrapiSingleResponse = {
  data: Record<string, unknown> | null;
};

function getBaseUrl() {
  const baseUrl = import.meta.env.STRAPI_URL || import.meta.env.PUBLIC_STRAPI_URL;
  if (!baseUrl) {
    throw new Error("Missing STRAPI_URL or PUBLIC_STRAPI_URL environment variable.");
  }
  return String(baseUrl).replace(/\/$/, "");
}

function getCollection() {
  return import.meta.env.STRAPI_COLLECTION || "articles";
}

function absoluteMediaUrl(url: string) {
  if (!url) {
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${getBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

function getHeaders() {
  const token = import.meta.env.STRAPI_API_TOKEN;
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function extractAttrs(raw: Record<string, unknown>) {
  if (raw.attributes && typeof raw.attributes === "object" && raw.attributes !== null) {
    return raw.attributes as Record<string, unknown>;
  }
  return raw;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeMediaUrl(node: Record<string, unknown>, key: string) {
  const media = node[key];
  if (!media || typeof media !== "object") {
    return "";
  }

  const mediaObj = media as Record<string, unknown>;

  if (mediaObj.data && typeof mediaObj.data === "object") {
    const mediaData = mediaObj.data as Record<string, unknown>;
    const mediaAttrs = extractAttrs(mediaData);
    return absoluteMediaUrl(getString(mediaAttrs.url));
  }

  return absoluteMediaUrl(getString(mediaObj.url));
}

function normalizeRelationName(node: Record<string, unknown>, key: string) {
  const relation = node[key];
  if (!relation || typeof relation !== "object") {
    return "";
  }

  const relationObj = relation as Record<string, unknown>;
  if (relationObj.data && typeof relationObj.data === "object") {
    const relationData = relationObj.data as Record<string, unknown>;
    const attrs = extractAttrs(relationData);
    return getString(attrs.name);
  }

  return getString(relationObj.name);
}

function normalizeBody(node: Record<string, unknown>) {
  const directBody = getString(node.body);
  if (directBody) {
    return directBody;
  }

  const blocks = node.blocks;
  if (!Array.isArray(blocks)) {
    return "";
  }

  const richTexts: string[] = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") {
      continue;
    }
    const blockObj = block as Record<string, unknown>;
    const typeName = getString(blockObj.__component);
    if (typeName === "shared.rich-text") {
      const body = getString(blockObj.body);
      if (body) {
        richTexts.push(body);
      }
    }
  }

  return richTexts.join("\n\n");
}

function normalizeArticle(raw: Record<string, unknown>): StrapiArticle {
  const attrs = extractAttrs(raw);
  return {
    id: (raw.id as number | string) || (attrs.id as number | string) || "",
    slug: getString(attrs.slug),
    title: getString(attrs.title) || "Untitled",
    excerpt: getString(attrs.excerpt) || getString(attrs.description),
    body: normalizeBody(attrs),
    coverUrl: normalizeMediaUrl(attrs, "cover"),
    publishedAt: getString(attrs.publishedAt),
    createdAt: getString(attrs.createdAt),
    authorName: normalizeRelationName(attrs, "author"),
    categoryName: normalizeRelationName(attrs, "category"),
  };
}

async function fetchFromStrapi(pathWithQuery: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${pathWithQuery}`;

  const res = await fetch(url, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi request failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<StrapiManyResponse | StrapiSingleResponse>;
}

export async function fetchStrapiArticles() {
  const collection = getCollection();
  const query = [
    "sort=publishedAt:desc",
    "pagination[pageSize]=50",
    "fields[0]=title",
    "fields[1]=slug",
    "fields[2]=description",
    "fields[3]=publishedAt",
    "fields[4]=createdAt",
    "populate[cover][fields][0]=url",
    "populate[author][fields][0]=name",
    "populate[category][fields][0]=name",
  ].join("&");

  const json = await fetchFromStrapi(`/api/${collection}?${query}`);
  const data = Array.isArray(json.data) ? json.data : [];

  return data
    .map((item) => normalizeArticle(item as Record<string, unknown>))
    .filter((item) => item.slug && item.title);
}

export async function fetchStrapiArticleBySlug(slug: string) {
  const collection = getCollection();
  const query = [
    `filters[slug][$eq]=${encodeURIComponent(slug)}`,
    "pagination[pageSize]=1",
    "populate[cover][fields][0]=url",
    "populate[author][fields][0]=name",
    "populate[category][fields][0]=name",
    "populate[blocks][populate]=*",
  ].join("&");

  const json = await fetchFromStrapi(`/api/${collection}?${query}`);
  const data = Array.isArray(json.data) ? json.data : [];
  if (data.length === 0) {
    return null;
  }

  return data
    .map((item) => normalizeArticle(item as Record<string, unknown>))
    .find((item) => item.slug === slug) || null;
}
