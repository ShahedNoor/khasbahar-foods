import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
export const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "").replace(/\/$/, "");

export const r2Ready = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_URL);

let client: S3Client | undefined;
function r2() {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY! },
  });
  return client;
}

export async function putImage(key: string, body: Uint8Array, contentType: string) {
  await r2().send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

/** Deletes an image we uploaded earlier (ignores links that aren't ours). */
export async function deleteImageByUrl(url: string) {
  if (!R2_PUBLIC_URL || !url.startsWith(R2_PUBLIC_URL + "/")) return;
  const key = url.slice(R2_PUBLIC_URL.length + 1);
  if (!key.startsWith("products/")) return;
  await r2().send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
