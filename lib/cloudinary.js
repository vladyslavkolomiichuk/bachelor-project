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

  const publicId = `${folder}/${hash}`;

  const mime = image.type;
  const encoding = "base64";
  const base64Data = buffer.toString("base64");
  const fileUri = `data:${mime};${encoding},${base64Data}`;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      public_id: publicId,
      overwrite: false,
      folder,
      resource_type: "image",
    });

    return result.secure_url;
  } catch (error) {
    if (error.http_code === 409) {
      return `https://res.cloudinary.com/${
        cloudinary.config().cloud_name
      }/${publicId}`;
    }
    throw error;
  }
}
