// Comprobaciones del HTML estático generado por `npm run build`.
// Sin dependencias: ejecutar `npm run check:seo`.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const site = "https://shs.com.ar";
const dist = join(process.cwd(), "dist");
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (path) => readFileSync(path, "utf8");

if (!existsSync(join(dist, "index.html"))) {
    console.error("Falta dist/index.html. Ejecutá primero: npm run build");
    process.exit(1);
}

function findHtml(dir) {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return findHtml(path);
        return entry === "index.html" ? [path] : [];
    });
}

function attr(tag, key) {
    return tag.match(new RegExp(`(?:^|\\s)${key}="([^"]*)"`, "i"))?.[1] ?? null;
}

function tagWithAttr(html, tagName, key, value) {
    const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
    return tags.find((tag) => attr(tag, key) === value) ?? "";
}

const pages = findHtml(dist);
assert(pages.length >= 10, `Se encontraron solo ${pages.length} páginas: esperábamos inicio, servicios y 8 fichas.`);
for (const file of pages) {
    const rel = relative(dist, file).split(sep).join("/");
    const path = rel === "index.html" ? "/" : `/${rel.slice(0, -"index.html".length)}`;
    const expected = `${site}${path}`;
    const html = read(file);
    const name = `[${path}]`;
    const canonical = attr(tagWithAttr(html, "link", "rel", "canonical"), "href");
    const ogUrl = attr(tagWithAttr(html, "meta", "property", "og:url"), "content");
    const description = attr(tagWithAttr(html, "meta", "name", "description"), "content");
    const ogImage = attr(tagWithAttr(html, "meta", "property", "og:image"), "content");
    assert(canonical === expected, `${name} canonical incorrecta: ${canonical}`);
    assert(ogUrl === expected, `${name} og:url incorrecta: ${ogUrl}`);
    assert(description?.trim(), `${name} falta meta description`);
    assert(ogImage?.startsWith(`${site}/`), `${name} og:image no es absoluta del dominio`);
    assert((html.match(/<h1\b/gi) ?? []).length === 1, `${name} debe haber un solo H1`);
    assert((html.match(/<title>/gi) ?? []).length === 1, `${name} debe haber un solo title`);
    const schema = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)?.[1];
    if (!schema) {
        errors.push(`${name} no tiene datos estructurados JSON-LD`);
    } else {
        try {
            const graph = JSON.parse(schema)["@graph"] ?? [];
            const page = graph.find((entity) => entity["@type"] === "WebPage");
            const business = graph.find((entity) => entity["@type"] === "HomeAndConstructionBusiness");
            assert(page?.url === expected, `${name} WebPage.url no coincide con canonical`);
            assert(business?.["@id"] === `${site}/#business`, `${name} identidad LocalBusiness no coincide`);
            if (path.startsWith("/servicios/") && path !== "/servicios/") {
                const service = graph.find((entity) => entity["@type"] === "Service");
                assert(service?.url === expected, `${name} Service.url incorrecta`);
                assert(service?.provider?.["@id"] === `${site}/#business`, `${name} Service.provider incorrecto`);
            }
        } catch (error) {
            errors.push(`${name} JSON-LD inválido: ${error.message}`);
        }
    }
    if (path === "/servicios/armado/") {
        assert(html.includes("Armado de muebles importados en Quilmes, Avellaneda y Lanús | Gabriel Survila"),
            `${name} no utiliza seoTitle`);
    }
}

const robots = join(dist, "robots.txt");
assert(existsSync(robots), "No se generó robots.txt");
if (existsSync(robots)) {
    assert(read(robots).includes(`${site}/sitemap-index.xml`), "robots.txt no anuncia el sitemap correcto");
}
const sitemapIndex = join(dist, "sitemap-index.xml");
assert(existsSync(sitemapIndex), "No se generó sitemap-index.xml");
const sitemap0 = join(dist, "sitemap-0.xml");
assert(existsSync(sitemap0), "No se generó sitemap-0.xml");
if (existsSync(sitemap0)) {
    const xml = read(sitemap0);
    assert(xml.includes(`${site}/servicios/armado/`), "El sitemap no incluye armado de muebles");
}

if (errors.length) {
    console.error(`SEO: ${errors.length} error(es) encontrado(s):`);
    for (const issue of errors) console.error(`  - ${issue}`);
    process.exit(1);
}
console.log(`SEO OK: ${pages.length} páginas, canonical, metadatos, JSON-LD y sitemap comprobados.`);
