// src/components/ImagesSwiperSites.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SitesImageCard } from "./SitesImageCard";
import { MediaLightboxModal } from "./MediaLightboxModal";

export type NavigationMode = "thumbnails" | "dots" | "numbers" | "none";
export type SwiperFit = "width" | "height";

export interface SwiperImageSites {
    id: number;
    imageUrl: string;
    imagePublicId?: string;
    index: number;
}

type MediaItem = { id: number; url: string; publicId?: string };
export type MediaMap = Record<number, MediaItem>;

export interface ImagesSwiperSitesProps {
    id?: string;
    mediaMap: MediaMap;
    navigation?: NavigationMode;

    currentSlide?: number;
    onSlideChange?: (index: number) => void;

    fit?: SwiperFit;

    // ✅ modal
    enableModal?: boolean;
    modalTitle?: string;
    modalText?: string;
}

function hasText(v: unknown): boolean {
    return typeof v === "string" && v.trim().length > 0;
}

export const ImagesSwiperSites: React.FC<ImagesSwiperSitesProps> = ({
    id,
    mediaMap,
    navigation = "thumbnails",
    currentSlide: currentSlideProp,
    onSlideChange,
    fit = "width",

    enableModal = true,
    modalTitle,
    modalText,
}) => {
    const imageArray: SwiperImageSites[] = useMemo(() => {
        const list = Object.values(mediaMap ?? {});
        list.sort((a, b) => a.id - b.id);
        return list.map((item, index) => ({
            id: item.id,
            imageUrl: item.url,
            imagePublicId: item.publicId,
            index,
        }));
    }, [mediaMap]);

    const hasImages = imageArray.length > 0;

    // ==========================
    // Controlado / no controlado
    // ==========================
    const [internalSlide, setInternalSlide] = useState(0);
    const isControlled = typeof currentSlideProp === "number";
    const currentSlide = isControlled ? (currentSlideProp as number) : internalSlide;

    const setSlide = (index: number) => {
        if (index < 0) return;

        if (imageArray.length === 0) {
            if (!isControlled) setInternalSlide(0);
            return;
        }

        const clamped = Math.max(0, Math.min(index, imageArray.length - 1));

        if (isControlled) onSlideChange?.(clamped);
        else {
            setInternalSlide(clamped);
            onSlideChange?.(clamped);
        }
    };

    useEffect(() => {
        if (imageArray.length === 0) {
            if (!isControlled) setInternalSlide(0);
            return;
        }

        const clamped = Math.max(0, Math.min(currentSlide, imageArray.length - 1));
        if (clamped !== currentSlide) setSlide(clamped);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageArray.length]);

    // ==========================
    // Medición contenedor
    // ==========================
    const [dragOffset, setDragOffset] = useState(0);

    const dragStartX = useRef<number | null>(null);
    const dragStartY = useRef<number | null>(null);
    const isHorizontalDrag = useRef(false);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const thumbnailsRef = useRef<HTMLDivElement | null>(null);

    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const updateSize = () => {
            setContainerWidth(el.clientWidth);
            setContainerHeight(el.clientHeight);
        };

        updateSize();

        const ro = new ResizeObserver(updateSize);
        ro.observe(el);

        window.addEventListener("resize", updateSize);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    // ==========================
    // Navegación
    // ==========================
    const goToSlide = (index: number) => {
        setSlide(index);
        setDragOffset(0);
    };

    const nextSlide = () => {
        if (!hasImages) return;
        setSlide(Math.min(currentSlide + 1, imageArray.length - 1));
        setDragOffset(0);
    };

    const prevSlide = () => {
        if (!hasImages) return;
        setSlide(Math.max(currentSlide - 1, 0));
        setDragOffset(0);
    };

    // ==========================
    // Drag mouse
    // ==========================
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!hasImages) return;
        if (imageArray.length <= 1 || !containerWidth) return;

        e.preventDefault();
        dragStartX.current = e.clientX;
        dragStartY.current = e.clientY;
        isHorizontalDrag.current = true;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragStartX.current === null) return;
        setDragOffset(e.clientX - dragStartX.current);
    };

    const handleMouseUp = () => {
        finalizeDrag();
        dragStartX.current = null;
        dragStartY.current = null;
        isHorizontalDrag.current = false;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // ==========================
    // Drag touch
    // ==========================
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!hasImages) return;
        if (imageArray.length <= 1 || !containerWidth) return;

        const t = e.touches[0];
        dragStartX.current = t.clientX;
        dragStartY.current = t.clientY;
        isHorizontalDrag.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (dragStartX.current === null || dragStartY.current === null) return;

        const t = e.touches[0];
        const dx = t.clientX - dragStartX.current;
        const dy = t.clientY - dragStartY.current;
        const thresh = 6;

        if (!isHorizontalDrag.current) {
            if (Math.abs(dx) < thresh && Math.abs(dy) < thresh) return;

            if (Math.abs(dx) > Math.abs(dy)) isHorizontalDrag.current = true;
            else {
                dragStartX.current = null;
                dragStartY.current = null;
                setDragOffset(0);
                return;
            }
        }

        if (isHorizontalDrag.current) setDragOffset(dx);
    };

    const handleTouchEnd = () => {
        if (!isHorizontalDrag.current) {
            dragStartX.current = null;
            dragStartY.current = null;
            setDragOffset(0);
            return;
        }

        finalizeDrag();
        dragStartX.current = null;
        dragStartY.current = null;
        isHorizontalDrag.current = false;
    };

    const finalizeDrag = () => {
        if (!hasImages) return setDragOffset(0);
        if (dragStartX.current === null) return setDragOffset(0);

        const viewport = viewportRef.current;
        if (!viewport) return setDragOffset(0);

        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;

        const slideElements = Array.from(
            viewport.querySelectorAll<HTMLElement>(".carousel-slide-item")
        );
        if (slideElements.length === 0) return setDragOffset(0);

        let bestIndex = currentSlide;
        let bestDistance = Infinity;

        slideElements.forEach((el, index) => {
            const r = el.getBoundingClientRect();
            const slideCenter = r.left + r.width / 2;
            const distance = Math.abs(slideCenter - viewportCenter);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = index;
            }
        });

        setSlide(bestIndex);
        setDragOffset(0);
    };

    // ==========================
    // Drag thumbnails (scroll)
    // ==========================
    const thumbDragStartX = useRef<number | null>(null);

    const handleThumbMouseDown = (e: React.MouseEvent) => {
        if (!hasImages) return;
        e.preventDefault();
        thumbDragStartX.current = e.clientX;
        document.addEventListener("mousemove", handleThumbMouseMove);
        document.addEventListener("mouseup", handleThumbMouseUp);
    };

    const handleThumbMouseMove = (e: MouseEvent) => {
        if (thumbDragStartX.current === null || !thumbnailsRef.current) return;
        const distance = thumbDragStartX.current - e.clientX;
        thumbnailsRef.current.scrollLeft += distance;
        thumbDragStartX.current = e.clientX;
    };

    const handleThumbMouseUp = () => {
        thumbDragStartX.current = null;
        document.removeEventListener("mousemove", handleThumbMouseMove);
        document.removeEventListener("mouseup", handleThumbMouseUp);
    };

    const handleThumbTouchStart = (e: React.TouchEvent) => {
        if (!hasImages) return;
        thumbDragStartX.current = e.touches[0].clientX;
    };

    const handleThumbTouchMove = (e: React.TouchEvent) => {
        if (thumbDragStartX.current === null || !thumbnailsRef.current) return;
        const distance = thumbDragStartX.current - e.touches[0].clientX;
        thumbnailsRef.current.scrollLeft += distance;
        thumbDragStartX.current = e.touches[0].clientX;
    };

    const handleThumbTouchEnd = () => {
        thumbDragStartX.current = null;
    };

    // ==========================
    // Navegación inferior
    // ==========================
    const renderNavigation = () => {
        if (!hasImages) return null;
        if (imageArray.length <= 1) return null;
        if (navigation === "none") return null;

        if (navigation === "thumbnails") {
            return (
                <div
                    className="carousel-thumbnails"
                    ref={thumbnailsRef}
                    onMouseDown={handleThumbMouseDown}
                    onTouchStart={handleThumbTouchStart}
                    onTouchMove={handleThumbTouchMove}
                    onTouchEnd={handleThumbTouchEnd}
                >
                    {imageArray.map((img, index) => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            alt={`Miniatura ${index + 1}`}
                            className={`thumbnail ${index === currentSlide ? "active" : ""}`}
                            onClick={() => goToSlide(index)}
                            draggable={false}
                            loading="lazy"
                        />
                    ))}
                </div>
            );
        }

        if (navigation === "dots") {
            return (
                <div className="carousel-thumbnails">
                    {imageArray.map((img, index) => (
                        <button
                            key={img.id}
                            className={`navigation-dot ${index === currentSlide ? "active" : ""}`}
                            onClick={() => goToSlide(index)}
                            type="button"
                            aria-label={`Ir a imagen ${index + 1}`}
                        >
                            <span />
                        </button>
                    ))}
                </div>
            );
        }

        return (
            <div className="carousel-thumbnails">
                {imageArray.map((img, index) => (
                    <button
                        key={img.id}
                        className={`navigation-numbers ${index === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                        type="button"
                        aria-label={`Ir a imagen ${index + 1}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        );
    };

    // ==========================
    // Fit
    // ==========================
    const effectiveWidth = containerWidth;
    const effectiveHeight = containerHeight;
    const canRender = effectiveWidth > 0 && (fit === "width" || effectiveHeight > 0);

    const trackStyle: React.CSSProperties = useMemo(() => {
        const base = hasImages ? -currentSlide * effectiveWidth : 0;
        return {
            transform: `translateX(${base + dragOffset}px)`,
            transition: dragOffset === 0 ? "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
            height: fit === "height" ? effectiveHeight : undefined,
            willChange: "transform",
        };
    }, [hasImages, currentSlide, dragOffset, effectiveWidth, effectiveHeight, fit]);

    const slideStyle: React.CSSProperties = useMemo(() => {
        return {
            width: "100%",
            minWidth: "100%",
            height: fit === "height" ? effectiveHeight : undefined,
        };
    }, [effectiveHeight, fit]);

    // ==========================
    // Modal (doble click / doble tap)
    // ==========================
    const [openModal, setOpenModal] = useState(false);

    const canOpenModal = enableModal && hasText(modalText);

    const lastTap = useRef<number>(0);
    const onViewportTouchEndForModal = () => {
        if (!canOpenModal) return;
        const now = Date.now();
        if (now - lastTap.current < 280) setOpenModal(true);
        lastTap.current = now;
    };

    return (
        <>
            <div
                id={id}
                className="inline-carousel"
                style={{
                    height: fit === "height" ? "100%" : undefined,
                }}
            >
                <div
                    className="carousel-viewport"
                    ref={viewportRef}
                    onMouseDown={hasImages ? handleMouseDown : undefined}
                    onTouchStart={hasImages ? handleTouchStart : undefined}
                    onTouchMove={hasImages ? handleTouchMove : undefined}
                    onTouchEnd={() => {
                        handleTouchEnd();
                        onViewportTouchEndForModal();
                    }}
                    onDoubleClick={() => {
                        if (canOpenModal) setOpenModal(true);
                    }}
                    style={{
                        cursor: canOpenModal
                            ? "zoom-in"
                            : hasImages && imageArray.length > 1
                                ? "grab"
                                : "default",
                        height: fit === "height" ? "100%" : undefined,
                        flex: fit === "height" ? "1 1 auto" : undefined,
                        minHeight: fit === "height" ? 0 : undefined,
                    }}
                >
                    <div
                        className="carousel-track"
                        style={!canRender ? { opacity: 0 } : { ...trackStyle, opacity: 1 }}
                    >
                        {!hasImages ? (
                            <div className="carousel-slide-item" style={slideStyle}>
                                <div style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            width: "100%",
                                            height: fit === "height" ? "100%" : 220,
                                            background: "rgba(148,163,184,0.12)",
                                            borderRadius: 8,
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            imageArray.map((img) => (
                                <div key={img.id} className="carousel-slide-item" style={slideStyle}>
                                    <div style={{ width: "100%", height: fit === "height" ? "100%" : "auto" }}>
                                        <SitesImageCard
                                            imageUrl={img.imageUrl}
                                            alt={`Imagen ${img.index + 1}`}
                                            fit={fit}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {hasImages && imageArray.length > 1 && currentSlide > 0 && (
                        <button className="nav-button prev" onClick={prevSlide} type="button" aria-label="Anterior">
                            ‹
                        </button>
                    )}

                    {hasImages && imageArray.length > 1 && currentSlide < imageArray.length - 1 && (
                        <button className="nav-button next" onClick={nextSlide} type="button" aria-label="Siguiente">
                            ›
                        </button>
                    )}
                </div>

                {renderNavigation()}
            </div>

            <MediaLightboxModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={modalTitle}
                text={modalText}
            >
                <div className="absolute inset-0 p-2">
                    <ImagesSwiperSites
                        mediaMap={mediaMap}
                        navigation="dots"
                        fit="height"
                        enableModal={false}
                        currentSlide={currentSlide}
                        onSlideChange={(i) => setSlide(i)}
                    />
                </div>
            </MediaLightboxModal>
        </>
    );
};