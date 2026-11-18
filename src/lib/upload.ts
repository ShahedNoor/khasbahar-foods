"use client";
import { auth } from "./firebase";
import { compressImage } from "./format";

async function token() {
  const u = auth().currentUser;
  if (!u) throw new Error("Please sign in again.");
  return u.getIdToken();
}

/** Compresses the photo and uploads it to Cloudflare R2 via /api/upload. Returns the public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const body = new FormData();
  body.append("file", new File([blob], "photo.webp", { type: "image/webp" }));
  const res = await fetch("/api/upload", { method: "POST", body, headers: { Authorization: `Bearer ${await token()}` } });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? `Upload failed (${res.status})`);
  return json.url;
}

/** Best-effort cleanup of a photo we no longer use. */
export async function deleteProductImage(url: string) {
  if (!url || !url.startsWith(process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "\u0000")) return;
  try {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {}
}
