// URL canónica absoluta sin parámetros ni fragmentos.
// Astro.site apunta al dominio de producción incluso al trabajar en localhost.
export function getCanonicalUrl(pathname: string, site: URL): string {
    const path = pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
    return new URL(path, site).toString();
}

// El AMBA es una región, no una ciudad.
export function getServiceAreas(coverage: readonly string[]) {
    return coverage.map((name) => ({
        "@type": name === "AMBA" ? "AdministrativeArea" : "City",
        name,
    }));
}
