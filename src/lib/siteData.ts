// src/lib/siteData.ts
export type ServiceSlug =
    | "electricista"
    | "plomeria"
    | "carpinteria"
    | "herreria"
    | "durlock"
    | "reparaciones";

export type Service = {
    slug: ServiceSlug;
    title: string;
    short: string;
    description: string;
    bullets: string[];
    seoTitle: string;
    seoDescription: string;
};

export const BRAND = {
    name: "Gabriel Survila – Servicios del Hogar",
    phone: "+54 9 11 0000-0000", // CAMBIAR
    whatsappNumber: "5491100000000", // CAMBIAR (sin +, sin espacios)
    baseCity: "Quilmes",
    coverage: ["Quilmes", "Avellaneda", "Lanús", "AMBA"],
};

export const ZONES = [
    "Quilmes",
    "Avellaneda",
    "Lanús",
    "Bernal",
    "Wilde",
    "Sarandí",
    "Gerli",
    "Remedios de Escalada",
    "Banfield",
    "Lomas de Zamora",
    "Temperley",
    "Berazategui",
    "Florencio Varela",
    "CABA",
    "Zona Sur",
];

export const SERVICES: Service[] = [
    {
        slug: "electricista",
        title: "Electricista",
        short: "Instalaciones, arreglos y mantenimiento eléctrico.",
        description:
            "Trabajo prolijo y seguro para hogares y comercios. Diagnóstico claro, materiales de calidad y terminaciones cuidadas.",
        bullets: [
            "Cortocircuitos, térmicas y disyuntores",
            "Reemplazo de cables, tomas y llaves",
            "Iluminación interior / exterior",
            "Tableros y puesta a punto",
        ],
        seoTitle: "Electricista en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Electricista en Quilmes, Avellaneda y Lanús. Instalaciones, reparaciones y mantenimiento eléctrico. Presupuesto claro por WhatsApp.",
    },
    {
        slug: "plomeria",
        title: "Plomería",
        short: "Pérdidas, grifería, flexibles y conexiones.",
        description:
            "Soluciones duraderas para baños, cocinas y lavaderos. Reparo pérdidas y dejo todo funcionando sin vueltas.",
        bullets: [
            "Pérdidas y filtraciones",
            "Cambio de griferías y flexibles",
            "Desagües y sifones",
            "Conexiones de agua y ajustes",
        ],
        seoTitle: "Plomero en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Plomería en Quilmes, Avellaneda y Lanús. Pérdidas, griferías, desagües y conexiones. Presupuesto por WhatsApp.",
    },
    {
        slug: "carpinteria",
        title: "Carpintería",
        short: "Ajustes, reparaciones y mejoras en madera.",
        description:
            "Arreglo puertas, muebles y detalles que complican el día a día. Terminación prolija y materiales adecuados.",
        bullets: [
            "Puertas que rozan / cierran mal",
            "Ajuste de bisagras y herrajes",
            "Reparación de muebles",
            "Estantes y soluciones a medida",
        ],
        seoTitle: "Carpintero en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Carpintería en Quilmes, Avellaneda y Lanús. Puertas, herrajes, muebles y soluciones a medida. Trabajo confiable.",
    },
    {
        slug: "herreria",
        title: "Herrería",
        short: "Arreglos, refuerzos y trabajos en hierro.",
        description:
            "Reparaciones y mejoras para rejas, puertas y estructuras. Seguridad y terminación resistente.",
        bullets: [
            "Arreglo de rejas y portones",
            "Soldaduras y refuerzos",
            "Ajustes de bisagras y cierres",
            "Trabajos a medida",
        ],
        seoTitle: "Herrero en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Herrería en Quilmes, Avellaneda y Lanús. Rejas, portones, soldaduras y refuerzos. Trabajo prolijo y confiable.",
    },
    {
        slug: "durlock",
        title: "Colocación de durlock",
        short: "Colocación de placas de yeso, aislación termo-acústica, pintura",
        description:
            "La construcción en seco puede solucionar temas estéticos o de espacios.",
        bullets: [
            "Tabiques",
            "Gargantas",
            "Cielorraso",
            "Dar terminación a arcadas, vigas, columnas",
        ],
        seoTitle:
            "Colocación de durlock en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Colocación de durlock en Quilmes, Avellaneda y Lanús. Mantenimiento y soluciones prácticas. Presupuesto por WhatsApp.",
    },
    {
        slug: "reparaciones",
        title: "Reparaciones generales",
        short: "Arreglos, ajustes y mantenimiento del hogar.",
        description:
            "Esos problemas chicos que se acumulan: los resuelvo en una visita cuando se puede, con criterio claro y prolijidad.",
        bullets: [
            "Arreglos y ajustes varios",
            "Colocación de soportes / estantes",
            "Pequeñas reparaciones del hogar",
            "Mantenimiento general",
        ],
        seoTitle:
            "Reparaciones del hogar en Quilmes, Avellaneda y Lanús | Gabriel Survila",
        seoDescription:
            "Reparaciones generales en Quilmes, Avellaneda y Lanús. Mantenimiento y soluciones prácticas. Presupuesto por WhatsApp.",
    },
];

export function buildWhatsAppLink(message: string) {
    const base = `https://wa.me/${BRAND.whatsappNumber}`;
    const text = encodeURIComponent(message);
    return `${base}?text=${text}`;
}

export type WorkItem = {
    id: string;
    title: string;
    zone: string;
    service: string;

    // ✅ caso simple (una foto)
    image?: string;

    // ✅ caso galería (varias fotos)
    images?: string[];

    alt?: string;

    // ✅ SOLO para el modal (si no está, el modal NO se abre)
    modalDescription?: string;
};

export const WORKS: WorkItem[] = [
    {
        id: "porton-01",
        title: "Portón de garage",
        zone: "Bernal Oeste",
        service: "Herrería-carpintaría",
        images: [
            "/trabajos/herreria/porton-1.jpg",
            "/trabajos/herreria/porton-2.jpg",
            "/trabajos/herreria/porton-3.jpg",
            "/trabajos/herreria/porton-4.jpg",
            "/trabajos/herreria/porton-5.jpg",
            "/trabajos/herreria/porton-6.jpg",
        ],
        alt: "Portón de garage",
        modalDescription: `Se fabricó un portón nuevo para aplicar sin romper las paredes, dejando el marco viejo amurado. Se quitó el portón viejo irrecuperable y se montó el portón nuevo
        en una mañana para que la vivienda no quedara sin cerramiento. Luego, el cliente puede desamurar el marco viejo y arreglar los bordes de las paredes sin depender del nuevo portón.`,
    },

    {
        id: "placard-01",
        title: "Placard de melamina",
        zone: "Lanús",
        service: "Carpintería",
        images: [
            "/trabajos/carpinteria/placard.jpg",
            "/trabajos/carpinteria/placard-1.jpg",
            "/trabajos/carpinteria/placard-2.jpg",
            "/trabajos/carpinteria/placard-3.jpg",
            "/trabajos/carpinteria/placard-4.jpg",
            "/trabajos/carpinteria/placard-5.jpg",
        ],
        alt: "placard melamina",
        modalDescription: "Pacards en melamina con kit de aluminio para manijones"
    },
    {
        id: "durlock-01",
        title: "Durlock",
        zone: "Recoleta",
        service: "Durlock",
        images: [
            "/trabajos/durlock/durlock-1.jpg",
            "/trabajos/durlock/durlock-2.jpg",
            "/trabajos/durlock/durlock-3.jpg",
            "/trabajos/durlock/durlock-4.jpg",
            "/trabajos/durlock/durlock-5.jpg",
            "/trabajos/durlock/durlock-6.jpg",
            "/trabajos/durlock/durlock-7.jpg",
        ],
        alt: "durlock colocación",
        modalDescription: "Una falsa viga y un cielorraso con garganta curva"
    },
    {
        id: "deck-01",
        title: "Deck en lapacho",
        zone: "Palermo CABA",
        service: "Carpintería",
        images: [
            "/trabajos/carpinteria/deck/deck-1.jpg",
            "/trabajos/carpinteria/deck/deck-2.jpg",
            "/trabajos/carpinteria/deck/deck-3.jpg",
            "/trabajos/carpinteria/deck/deck-4.jpg",
            "/trabajos/carpinteria/deck/deck-5.jpg",
            "/trabajos/carpinteria/deck/deck-6.jpg",
            "/trabajos/carpinteria/deck/deck-7.jpg",
            "/trabajos/carpinteria/deck/deck-8.jpg",
            "/trabajos/carpinteria/deck/deck-9.jpg",
            "/trabajos/carpinteria/deck/deck-10.jpg",
        ],
        alt: "deck lapacho",
        modalDescription: `Esto es en una terraza de una casa de tres pisos. Había un deck de madera blanda que se deterioró. Entonces, se desmontó el deck para la colocación de la membrana aislante,
        y se armó un nuevo deck de lapacho. El lapacho es una madera que soporta estar a la intemperie. Hubo que respetar la forma que determinaba la pérgola.`
    },
    {
        id: "tablero-01",
        title: "Revisión de tablero y protecciones",
        zone: "Quilmes",
        service: "Electricidad",
        image: "/trabajos/electricista/tablero.jpg",
        alt: "revisión de tablero",
    },
    {
        id: "griferia-01",
        title: "Cambio de grifería y flexibles",
        zone: "Avellaneda",
        service: "Plomería",
        image: "/trabajos/plomeria/grifo.jpg",
        alt: "cambio de flexible en grifo",
    },
    {
        id: "puerta-01",
        title: "Ajuste de puerta y herrajes",
        zone: "Lanús",
        service: "Carpintería",
        image: "/trabajos/carpinteria/bisagra.jpg",
    },
    {
        id: "reja-01",
        title: "Soldadura y refuerzo de reja",
        zone: "Zona Sur",
        service: "Herrería",
        image: "/trabajos/herreria/reja.jpg",
        alt: "soldadura en reja",
    },
    {
        id: "reparacion-01",
        title: "Reparaciones generales del hogar",
        zone: "AMBA",
        service: "Reparaciones",
        image: "/trabajos/reparaciones/herramientas.jpg",
        alt: "imagen ilustrativa herramientas",
    },
    {
        id: "iluminacion-01",
        title: "Instalación de iluminación interior",
        zone: "Quilmes",
        service: "Electricidad",
        image: "/trabajos/electricista/iluminacion.jpg",
        alt: "intalación de iluminación interior",
    },
];