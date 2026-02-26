// src/components/SitesImageCard.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SwiperFit } from "./ImagesSwiperSites";

export function SitesImageCard({
    imageUrl,
    alt,
    fit = "width",
}: {
    imageUrl: string;
    alt: string;
    fit?: SwiperFit;
}) {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    // ratio real (w/h) de la imagen para evitar “saltos” al cargar
    const [ratio, setRatio] = useState<number | null>(null);

    useEffect(() => {
        setLoaded(true);
        setFailed(false);
        setRatio(null);
    }, [imageUrl]);

    // fallback razonable para reservar altura antes del onLoad
    const fallbackAspect = "4 / 3";

    const aspectRatioCss = useMemo(() => {
        if (!ratio || !Number.isFinite(ratio) || ratio <= 0) return fallbackAspect;

        // CSS aspect-ratio acepta "w / h". Tomamos h=1000 para buena precisión.
        const w = Math.round(ratio * 1000);
        const h = 1000;
        return `${w} / ${h}`;
    }, [ratio]);

    // Si fit === "height", el alto lo define el contenedor padre (100%)
    const wrapperStyle: React.CSSProperties =
        fit === "height"
            ? {
                width: "100%",
                height: "100%",
                position: "relative",
            }
            : {
                width: "100%",
                aspectRatio: aspectRatioCss as any,
                position: "relative",
            };

    return (
        <div style={wrapperStyle}>
            {/* Loader overlay */}
            {!loaded && !failed && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(148,163,184,0.12)",
                        borderRadius: 8,
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            border: "2px solid rgba(226,232,240,0.35)",
                            borderTopColor: "rgba(226,232,240,0.9)",
                            animation: "spin 0.9s linear infinite",
                        }}
                    />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            )}

            {/* Imagen: absoluta, llena el wrapper, sin deformar */}
            <img
                src={imageUrl}
                alt={alt}
                className="carousel-image"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: fit === "height" ? "cover" : "contain",
                    opacity: loaded && !failed ? 1 : 0,
                    transition: "opacity 180ms ease",
                    borderRadius: 8,
                    display: "block",
                }}
                draggable={false}
                loading="lazy"
                onLoad={(e) => {
                    const img = e.currentTarget;
                    const w = img.naturalWidth;
                    const h = img.naturalHeight;

                    if (w > 0 && h > 0) setRatio(w / h);

                    setLoaded(true);
                }}
                onError={() => {
                    setFailed(true);
                    setLoaded(true);
                }}
            />
        </div>
    );
}