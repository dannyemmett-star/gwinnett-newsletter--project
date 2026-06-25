const fs = require("fs");
const path = require("path");

const root = __dirname;
const configPath = path.join(root, "cloudinary-config.json");
const dataPath = path.join(root, "newsletter-data.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

if (!config.cloudName || !config.uploadPreset ||
    config.uploadPreset === "REPLACE_WITH_UNSIGNED_UPLOAD_PRESET") {
  throw new Error("Add the unsigned Cloudinary upload preset to cloudinary-config.json.");
}

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function uploadImage(filePath, publicId) {
  const extension = path.extname(filePath).toLowerCase();
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
  if (!response.ok) {
    throw new Error(result.error?.message || `Cloudinary upload failed with status ${response.status}`);
  }
  return result.secure_url;
}

async function main() {
  const footerPaths = [1, 2, 3, 4, 5].map((number) =>
    path.join(root, "dist", "assets", `around-gwinnett-${number}.jpg`)
  );
  const cartoonPath = path.join(root, "dist", "assets", "2026-07-08-cooling-expert.jpg");

  for (const filePath of [...footerPaths, cartoonPath]) {
    if (!fs.existsSync(filePath)) throw new Error(`Missing image: ${filePath}`);
  }

  const footerUrls = [];
  for (let index = 0; index < footerPaths.length; index += 1) {
    const url = await uploadImage(footerPaths[index], `footers/around-gwinnett-${index + 1}`);
    footerUrls.push(url);
    console.log(`Uploaded footer ${index + 1}`);
  }

  const cartoonUrl = await uploadImage(cartoonPath, "cartoons/2026-07-08-cooling-expert");
  console.log("Uploaded current cartoon");

  data.footerImages = footerUrls;
  data.cartoon.imageUrl = cartoonUrl;
  fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("Updated newsletter-data.json with public Cloudinary URLs");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
