export const taka = (n: number) => "৳" + Math.round(n).toLocaleString("en-IN");

export const margin = (sell: number, cost: number) => (sell > 0 ? ((sell - cost) / sell) * 100 : 0);

/** Shrink an uploaded photo to a WebP (max ~1200px, usually 100–300 KB) before sending it to R2. */
export async function compressImage(file: File, max = 1200, quality = 0.82): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  let q = quality;
  let blob = await toBlob(canvas, q);
  while (blob.size > 600_000 && q > 0.45) {
    q -= 0.1;
    blob = await toBlob(canvas, q);
  }
  return blob;
}

const toBlob = (c: HTMLCanvasElement, q: number) =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Could not read image"))), "image/webp", q));
