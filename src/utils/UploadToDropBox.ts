import { Dropbox } from "dropbox";
import { Agent, fetch as undiciFetch } from "undici";
import { v4 as uuidv4 } from "uuid";

/* ---------------- IPv4-only fetch ---------------- */
const ipv4Agent = new Agent({
  connect: { family: 4 },
});

const customFetch = (url: any, options: any = {}) =>
  undiciFetch(url, { ...options, dispatcher: ipv4Agent });

/* ---------------- Logging ---------------- */
function logDropboxError(where: string, e: any) {
  console.error(`Dropbox error at ${where}`);
  console.error("name:", e?.name);
  console.error("status:", e?.status);
  console.error("message:", e?.message);
  console.error("error:", JSON.stringify(e?.error, null, 2));
  console.error("body:", e?.response?.body);
}

/* ---------------- Token Refresh ---------------- */
async function refreshDropboxAccessToken(): Promise<string> {
  const res = await customFetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.DROPBOX_APP_KEY}:${process.env.DROPBOX_APPSECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN!,
    }).toString(),
  });

  const data:any = await res.json();

  if (!data?.access_token) {
    throw new Error("Failed to refresh Dropbox access token");
  }

  return data.access_token;
}

/* ---------------- Dropbox Factory ---------------- */
async function getDropboxClient(): Promise<Dropbox> {
  const accessToken = await refreshDropboxAccessToken();

  return new Dropbox({
    accessToken,
    fetch: customFetch as any,
  });
}

/* ---------------- Upload ---------------- */
export async function uploadImageToDropbox(file: Express.Multer.File) {
  try {
    if (!file?.buffer) {
      throw new Error("No file.buffer (use multer.memoryStorage())");
    }

    if (file.size > 150 * 1024 * 1024) {
      throw new Error("File too large (>150MB). Use upload sessions.");
    }

    const dbx = await getDropboxClient();

    const fileName = `services/${uuidv4()}-${file.originalname}`;
    const path = `/${fileName}`;

    /* -------- Upload -------- */
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

    /* -------- Share link -------- */
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

    if (!url) {
      throw new Error("Uploaded but could not create/find a shared link.");
    }

    /* -------- Convert to direct URL -------- */
    return url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("&dl=0", "");
  } catch (err) {
    console.error("Upload pipeline failed:", err);
    throw err;
  }
}
