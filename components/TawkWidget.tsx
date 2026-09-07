"use client";

import { useEffect } from "react";

export default function TawkWidget() {
  const property =
    process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "6a9efa9658d80e344281f5aa";
  const widget =
    process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1k1ug5n0l";

  useEffect(() => {
    if (!property || !widget) return;
    if (document.getElementById("tawk-script")) return;

    const w = window as unknown as {
      Tawk_API?: Record<string, unknown>;
      Tawk_LoadStart?: Date;
    };
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    const s = document.createElement("script");
    s.id = "tawk-script";
    s.async = true;
    s.src = `https://embed.tawk.to/${property}/${widget}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, [property, widget]);

  return null;
}
