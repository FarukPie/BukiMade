"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/app/admin/actions";
import { ghostButtonClass } from "./ui";

const MAX_SIDE = 1800;

/** Büyük telefon fotoğraflarını tarayıcıda küçültüp WebP'ye çevirir (hızlı yükleme, küçük dosya). */
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function ImageUpload({
  folder,
  onUploaded,
  label = "Resim yükle",
  disabled,
}: {
  folder: "products" | "categories";
  onUploaded: (path: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setError(undefined);
    setBusy(true);
    try {
      const blob = await shrink(file);
      const fd = new FormData();
      fd.append("folder", folder);
      fd.append("file", blob, file.name);
      const result = await uploadImageAction(fd);
      if (result.path) onUploaded(result.path);
      else setError(result.error ?? "Yüklenemedi.");
    } catch {
      setError("Yüklenemedi. Dosya çok büyük olabilir veya bağlantı koptu.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} onChange={(e) => handle(e.target.files?.[0])} />
      <button type="button" disabled={busy || disabled} onClick={() => input.current?.click()} className={ghostButtonClass}>
        {busy ? "Yükleniyor…" : label}
      </button>
      {error && <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
