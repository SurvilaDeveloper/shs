// src/components/SitesImageWithModal.tsx
"use client";

import React, { useRef, useState } from "react";
import { MediaLightboxModal } from "./MediaLightboxModal";

export function SitesImageWithModal({
    imageUrl,
    alt,
    title,
    text,
    className,
    enableModal = true,
}: {
    imageUrl: string;
    alt: string;
    title?: string;
    text?: string;
    className?: string;
    enableModal?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const canOpen = enableModal && Boolean((text ?? "").trim());

    // Double-tap para mobile
    const lastTap = useRef<number>(0);
    const onTouchEnd = () => {
        if (!canOpen) return;
        const now = Date.now();
        if (now - lastTap.current < 280) setOpen(true);
        lastTap.current = now;
    };

    return (
        <>
            {/* Wrapper anti-overflow */}
            <div className="w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={alt}
                    className={className}
                    loading="lazy"
                    draggable={false}
                    onDoubleClick={() => {
                        if (canOpen) setOpen(true);
                    }}
                    onTouchEnd={onTouchEnd}
                    style={{
                        userSelect: "none",
                        cursor: canOpen ? "zoom-in" : undefined,

                        // ✅ evita overflow en mobile
                        display: "block",
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                    }}
                />
            </div>

            <MediaLightboxModal
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                text={text}
            >
                <div className="absolute inset-0 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={alt}
                        draggable={false}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                        }}
                    />
                </div>
            </MediaLightboxModal>
        </>
    );
}