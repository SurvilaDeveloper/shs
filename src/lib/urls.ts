// src/lib/urls.ts
export function assetUrl(path: string | undefined | null): string {
    const BASE = import.meta.env.BASE_URL || "/";
    const p = String(path ?? "").trim();
    if (!p) return "";

    // externos o data-uri
    if (
        p.startsWith("http://") ||
        p.startsWith("https://") ||
        p.startsWith("data:") ||
        p.startsWith("blob:")
    ) {
        return p;
    }

    // normalizar: "/trabajos/x.jpg" o "trabajos/x.jpg" => `${BASE}trabajos/x.jpg`
    const clean = p.replace(/^\//, "");
    return `${BASE}${clean}`;
}