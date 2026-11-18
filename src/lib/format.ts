export const taka = (n: number) => "৳" + Math.round(n).toLocaleString("en-IN");

export const margin = (sell: number, cost: number) => (sell > 0 ? ((sell - cost) / sell) * 100 : 0);

/** Shrink an uploaded photo to a small WebP data URL so it can live inside Firestore (no paid Storage needed). */
export async function compressImage(file: File, max = 900, quality = 0.78): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  let q = quality;
  let url = canvas.toDataURL("image/webp", q);
  while (url.length > 350_000 && q > 0.4) {
    q -= 0.1;
    url = canvas.toDataURL("image/webp", q);
  }
  return url;
}
