import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// folder: 'nextjs-notbook/users-image',
export async function uploadImage(image, folder) {
  const imageData = await image.arrayBuffer();
  const buffer = Buffer.from(imageData);

  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  // Змінюємо створення publicId, щоб уникнути дублювання шляху
  const publicId = hash; // Просто використовуємо хеш як publicId

  const mime = image.type;
  const encoding = "base64";
  const base64Data = buffer.toString("base64");
  const fileUri = `data:${mime};${encoding},${base64Data}`;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folder, // Cloudinary автоматично створить правильний шлях
      public_id: publicId,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImage(imageUrl) {
  // Check if URL is from Cloudinary
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
    return;
  }

  // Update default image URL check
  const defaultImageUrl =
    "https://res.cloudinary.com/dwh8rsn66/image/upload/v1748401770/nextjs-notbook/users-image/e8vjaqactpe22k8gvtz8.png";

  if (imageUrl === defaultImageUrl) return;

  try {
    // Get public_id from URL by removing the cloudinary base URL and version
    const baseUrl = "https://res.cloudinary.com/dwh8rsn66/image/upload/";
    const pathWithVersion = imageUrl.replace(baseUrl, "");
    const pathParts = pathWithVersion.split("/");

    // Remove version number (e.g., v1748401770)
    pathParts.shift();

    // Join remaining parts to get the full public_id
    const publicId = pathParts.join("/").split(".")[0];

    await cloudinary.uploader.destroy(publicId);
    console.log("Previous image deleted successfully");
  } catch (error) {
    console.error("Error deleting previous image:", error);
  }
}
