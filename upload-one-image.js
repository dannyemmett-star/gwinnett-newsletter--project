const fs = require("fs");
const path = require("path");

const root = __dirname;
const config = JSON.parse(fs.readFileSync(path.join(root, "cloudinary-config.json"), "utf8"));
const [fileArgument, publicId] = process.argv.slice(2);

if (!fileArgument || !publicId) {
  throw new Error("Usage: node upload-one-image.js <image-path> <public-id>");
}

const filePath = path.resolve(root, fileArgument);
const extension = path.extname(filePath).toLowerCase();
const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function main() {
  if (!fs.existsSync(filePath)) throw new Error(`Missing image: ${filePath}`);
  const mimeType = mimeTypes[extension];
  if (!mimeType) throw new Error(`Unsupported image type: ${extension}`);

  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(filePath)], { type: mimeType }), path.basename(filePath));
  form.append("upload_preset", config.uploadPreset);
  form.append("folder", config.folder);
  form.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`,
    { method: "POST", body: form }
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || `Upload failed: ${response.status}`);
  console.log(result.secure_url);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
