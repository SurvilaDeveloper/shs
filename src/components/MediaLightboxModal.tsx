// src/components/MediaLightboxModal.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function MediaLightboxModal({
    open,
    title,
    text,
    onClose,
    children,
}: {
    open: boolean;
    title?: string;
    text?: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const portalTarget = useMemo(() => {
        if (typeof document === "undefined") return null;
        return document.body;
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open || !portalTarget) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-9999"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            onTouchStart={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            style={{
                background: "rgba(0,0,0,0.9)",
                backdropFilter: "blur(8px)",
            }}
        >
            <div
                className="mx-auto flex h-full w-full max-w-5xl flex-col p-3 sm:p-6"
                style={{ maxHeight: "100dvh" }}
            >
                {/* ✅ header con botón a la derecha */}
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 hover:bg-slate-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ✅ contenido ocupa TODO el ancho siempre */}
                <div className="mt-3 flex items-center justify-center w-full flex-1 min-h-0 flex-col">
                    {/* IMAGEN / SWIPER */}
                    <div className="relative max-w-lg w-full flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-700 bg-black/50">
                        {children}
                    </div>

                    {/* Texto abajo */}
                    {(title || text) ? (
                        <div className="mt-2 w-full">
                            {title ? (
                                <p className="truncate text-base font-extrabold text-slate-50">
                                    {title}
                                </p>
                            ) : null}

                            {text ? (
                                <p className="mt-1 text-sm text-slate-200/90">
                                    {text}
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>,
        portalTarget
    );
}