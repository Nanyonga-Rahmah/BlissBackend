import { Dropbox } from "dropbox";
import { Agent, fetch as undiciFetch } from "undici";
import { v4 as uuidv4 } from "uuid";

const ipv4Agent = new Agent({
  connect: {
    family: 4, // 👈 force IPv4 sockets
  },
});

const customFetch = (url: any, options: any = {}) =>
  undiciFetch(url, { ...options, dispatcher: ipv4Agent });

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN!, // keep your env check if you want
  fetch: customFetch as any,
});

function logDropboxError(where: string, e: any) {
  console.error(`Dropbox error at ${where}`);
  console.error("name:", e?.name);
  console.error("status:", e?.status);
  console.error("message:", e?.message);
  console.error("error:", JSON.stringify(e?.error, null, 2));
  console.error("body:", e?.response?.body);
}

export async function uploadImageToDropbox(file: Express.Multer.File) {
  try {
    if (!file?.buffer)
      throw new Error("No file.buffer (use multer.memoryStorage())");
    if (file.size > 150 * 1024 * 1024)
      throw new Error("File too large (>150MB). Use upload sessions.");

    const fileName = `services/${uuidv4()}-${file.originalname}`;
    const path = `/${fileName}`;

    let uploadRes;
    try {
      uploadRes = await dbx.filesUpload({
        path,
        contents: file.buffer,
        mode: { ".tag": "overwrite" },
      });
    } catch (e) {
      logDropboxError("filesUpload", e);
      throw e;
    }

    const lower = uploadRes.result.path_lower!;
    let url = "";

    try {
      const linkRes = await dbx.sharingCreateSharedLinkWithSettings({
        path: lower,
      });
      url = linkRes.result.url;
    } catch (e) {
      logDropboxError("sharingCreateSharedLinkWithSettings", e);

      try {
        const existing = await dbx.sharingListSharedLinks({
          path: lower,
          direct_only: true,
        });
        url = existing.result.links[0]?.url ?? "";
      } catch (e2) {
        logDropboxError("sharingListSharedLinks", e2);
        throw e2;
      }
    }

    if (!url)
      throw new Error("Uploaded but could not create/find a shared link.");
    return url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("&dl=0", "");
  } catch (err) {
    console.error("Upload pipeline failed:", err);
    throw err;
  }
}
