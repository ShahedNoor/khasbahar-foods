import { deleteImageByUrl, putImage, r2Ready } from "@/lib/server/r2";
import { verifyAdmin } from "@/lib/server/verifyAdmin";

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

/** Upload a product photo to Cloudflare R2. Admins only. Body: multipart form with `file`. */
export async function POST(req: Request) {
  if (!r2Ready) return Response.json({ error: "Image storage (R2) is not configured on the server." }, { status: 503 });
  if (!(await verifyAdmin(req))) return Response.json({ error: "Not allowed" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Only WebP, JPEG or PNG images" }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Image is larger than 2 MB" }, { status: 413 });

  const key = `products/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const url = await putImage(key, new Uint8Array(await file.arrayBuffer()), file.type);
  return Response.json({ url });
}

/** Remove an old product photo from R2. Admins only. Body: { url } */
export async function DELETE(req: Request) {
  if (!r2Ready) return Response.json({ ok: true });
  if (!(await verifyAdmin(req))) return Response.json({ error: "Not allowed" }, { status: 401 });
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (url) await deleteImageByUrl(url);
  return Response.json({ ok: true });
}
