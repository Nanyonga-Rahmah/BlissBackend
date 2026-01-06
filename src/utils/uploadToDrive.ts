import { drive } from "./googleDrive";
import { Readable } from "stream";


import dotenv from "dotenv";
dotenv.config();

export async function uploadImageToDrive(
  buffer: Buffer,
  filename: string,
  mimetype: string
) {
  const fileStream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: mimetype,
      body: fileStream,
    },
  });

  const fileId = response.data.id!;

  // Make public
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}
