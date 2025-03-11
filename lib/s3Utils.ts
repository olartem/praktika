// lib/s3Helpers.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

/**
 * Generates a presigned URL for uploading a file.
 * @param fileName - The original file name.
 * @param fileType - The MIME type of the file.
 * @param expiresIn - Expiration time in seconds (default 3600 seconds).
 * @returns An object containing the presigned upload URL and the generated key.
 */
export async function getPresignedUploadUrl(
    fileName: string,
    fileType: string,
    expiresIn = 3600
): Promise<{ uploadUrl: string; key: string }> {
    const key = `photos/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });
    return { uploadUrl, key };
}

/**
 * Generates a presigned URL for retrieving an object.
 * @param s3Key - The S3 key of the object.
 * @param expiresIn - Expiration time in seconds (default 3600 seconds).
 * @returns The presigned URL string.
 */
export async function getPresignedGetUrl(
    s3Key: string,
    expiresIn = 3600
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
    });
    return await getSignedUrl(s3, command, { expiresIn });
}
