// src/components/CTAWhatsApp.tsx
import React from "react";
import { buildWhatsAppLink } from "../lib/siteData";

export function CTAWhatsApp({
    label = "Pedir presupuesto por WhatsApp",
    message = "Hola Gabriel, te escribo desde Google para pedir presupuesto. Estoy en Zona Sur (Quilmes/Avellaneda/Lanús).",
    className = "",
}: {
    label?: string;
    message?: string;
    className?: string;
}) {
    const href = buildWhatsAppLink(message);

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={[
                "inline-flex items-center justify-center gap-2 rounded-xl",
                "bg-emerald-600 px-6 py-3 font-bold text-white",
                "hover:bg-emerald-500 active:scale-[0.98]",
                "transition duration-200",
                "shadow-md shadow-emerald-900/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                className,
            ].join(" ")}
        >
            {/* Icono simple WhatsApp-style */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M20.52 3.48A11.77 11.77 0 0012.05 0C5.48 0 .14 5.34.14 11.91c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.64a11.84 11.84 0 005.75 1.47h.01c6.57 0 11.91-5.34 11.91-11.91a11.8 11.8 0 00-3.45-8.44zM12.06 21.5h-.01a9.6 9.6 0 01-4.89-1.34l-.35-.21-3.74.97.99-3.64-.23-.37a9.58 9.58 0 01-1.47-5.11c0-5.31 4.32-9.63 9.64-9.63a9.57 9.57 0 019.63 9.63c0 5.32-4.32 9.7-9.63 9.7zm5.27-7.24c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.12-.58.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.9-2.15-.24-.57-.48-.49-.65-.5l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.44.01 1.44 1.03 2.83 1.17 3.03.14.19 2.01 3.06 4.87 4.29.68.29 1.21.46 1.63.59.68.22 1.3.19 1.79.12.55-.08 1.71-.7 1.95-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.33z" />
            </svg>

            {label}
        </a>
    );
}