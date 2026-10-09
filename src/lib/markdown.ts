import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Convierte Markdown en HTML seguro. El HTML crudo que escriba un editor se descarta:
 * solo sobreviven las etiquetas de texto de la lista blanca.
 */
export function renderMarkdown(source: string): string {
  const raw = marked.parse(source ?? "", { async: false, gfm: true, breaks: true }) as string;
  return sanitizeHtml(raw, {
    allowedTags: ["p", "br", "strong", "em", "b", "i", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "hr", "table", "thead", "tbody", "tr", "th", "td", "code"],
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "");
        return {
          tagName,
          attribs: { ...attribs, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) },
        };
      },
    },
  });
}

/** Texto plano (para resúmenes, búsqueda y metadatos). */
export function stripMarkdown(source: string): string {
  return (source ?? "")
    .replace(/[#>*_`~\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
