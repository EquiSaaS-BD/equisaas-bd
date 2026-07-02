"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

export function CertificateQrCode({
  value,
  label,
  className = "",
  size = 168,
}) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;

    const build = async () => {
      const nextValue = String(value || "").trim();
      if (!nextValue) {
        if (active) setDataUrl("");
        return;
      }

      try {
        const generated = await QRCode.toDataURL(nextValue, {
          width: size,
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#10334f",
            light: "#ffffff",
          },
        });
        if (active) {
          setDataUrl(generated);
        }
      } catch {
        if (active) {
          setDataUrl("");
        }
      }
    };

    build();

    return () => {
      active = false;
    };
  }, [size, value]);

  if (!dataUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-3xl border border-dashed bg-background/70 text-xs text-muted-foreground",
          className,
        )}
        style={{ width: size, height: size }}
      >
        QR unavailable
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={label}
      width={size}
      height={size}
      className={cn("rounded-3xl border bg-white p-3 shadow-sm", className)}
      loading="eager"
      decoding="async"
    />
  );
}
