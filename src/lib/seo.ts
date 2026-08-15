type SeoInput = {
  title: string;
  description: string;
  path?: string;
};

const defaultTitle = "Tan Li An | Portfolio + Blog";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export function applySeo({ title, description, path = "" }: SeoInput) {
  const siteUrl = window.location.origin;
  document.title = title === defaultTitle ? title : `${title} | Tan Li An`;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: `${siteUrl}${path}` });
}

export { defaultTitle };
