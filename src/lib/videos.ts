// Catálogo manual de videos que querés mostrar en SHS.
// No se conecta al canal ni publica automáticamente sus nuevos videos.
// Para agregar otro, copiá un bloque dentro de VIDEOS y cambiá los datos.
// URLs admitidas: youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...

export type SiteVideo = {
    url: string;
    title: string;
    description: string;
    category?: string;
};

export const VIDEOS: SiteVideo[] = [
    //{
    //    url: "https://www.youtube.com/watch?v=rFYwK8NyNk0",
    //    title: "Quién soy y qué hago en SHS",
    //    description:
    //        "Me presento y cuento qué servicios ofrezco para hogares y comercios en Zona Sur.",
    //    category: "Presentación",
    //},

    // Ejemplo: descomentá este bloque y reemplazá los datos con un video real de SHS.
    {
        url: "https://youtube.com/shorts/_bT79ziO0rs",
        title: "Parrilla",
        description: "Una parrilla fácilmente desarmable con sube-baja. Sistema de guia que no se traba.",
        category: "Herrería",
    },
    {
        url: "https://youtube.com/shorts/08Be_nVklQU",
        title: "Esterillas",
        description: "Reemplazo de esterillas rotas por un asiento fuerte y estético de multilaminado.",
        category: "Carpintería-restauración",
    },
    {
        url: "https://youtu.be/i1sLIlk5ey4",
        title: "Portón de garage",
        description: "Fabricación de un portón de garage para reemplazar uno que ya no soportaba reparación.",
        category: "Herrería-carpintería",
    },
    {
        url: "https://youtube.com/shorts/SvJWEZe2WXc",
        title: "Vestidor",
        description: "Armado de vestidor en pequeña habitación.",
        category: "Carpintería-colocación",
    },
];

// Convertimos una URL de YouTube en su identificador para el reproductor.
// Una URL inválida genera un error durante el build: así no se publica una tarjeta rota.
export function getYouTubeId(url: string): string {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        throw new Error(`URL de video inválida: ${url}`);
    }

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        throw new Error(`El video debe utilizar una URL HTTP(S): ${url}`);
    }

    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const segments = parsed.pathname.split("/").filter(Boolean);
    let id: string | null = null;

    if (host === "youtu.be") {
        id = segments[0] ?? null;
    } else if (
        host === "youtube.com" ||
        host === "m.youtube.com" ||
        host === "music.youtube.com" ||
        host === "youtube-nocookie.com"
    ) {
        if (segments[0] === "watch") {
            id = parsed.searchParams.get("v");
        } else if (["shorts", "embed", "live"].includes(segments[0] ?? "")) {
            id = segments[1] ?? null;
        }
    }

    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
        throw new Error(`No se pudo identificar el video de YouTube: ${url}`);
    }
    return id;
}
