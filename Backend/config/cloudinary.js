import { v2 as cloudinary } from "cloudinary";

const clean = (v) => (typeof v === "string" ? v.trim().replace(/^"(.*)"$/, "$1") : v);

const connectCloudinary = async () => {
  const cloud_name = clean(process.env.CLOUDINARY_NAME);
  const api_key = clean(process.env.CLOUDINARY_API_KEY);
  const api_secret =
    clean(process.env.CLOUDINARY_SECRET_KEY) || clean(process.env.CLOUDINARY_API_SECRET);

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary env missing. Required: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY (or CLOUDINARY_API_SECRET)."
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

  // Verify credentials/connectivity. This produces a clearer error than uploader.upload()
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary connected");
  } catch (err) {
    console.error("Cloudinary ping failed:", {
      message: err?.message,
      name: err?.name,
      http_code: err?.http_code,
      error: err?.error,
    });
    throw new Error(
      err?.error?.message ||
        err?.message ||
        "Cloudinary ping failed (check CLOUDINARY_* env and network access)"
    );
  }
};

export default connectCloudinary;