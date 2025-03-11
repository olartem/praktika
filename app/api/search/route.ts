import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders, photos } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { getPresignedGetUrl } from "@/lib/s3Utils";

export const runtime = "edge";

export async function GET(request: Request) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    if (!q) {
        return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }

    const folderResults = await db
        .select()
        .from(folders)
        .where(ilike(folders.name, `%${q}%`))
        .execute();

    const photoResults = await db
        .select()
        .from(photos)
        .where(ilike(photos.name, `%${q}%`))
        .execute();

    // Optionally, filter by ownership (here we assume only user-owned items).
    const allowedFolders = folderResults.filter((folder) => folder.owner_id === userId);
    const allowedPhotos = photoResults.filter((photo) => photo.owner_id === userId);

    const updatedPhotos = await Promise.all(
        allowedPhotos.map(async (photo) => {
            const presigned_url = await getPresignedGetUrl(photo.s3_key);
            return {
                type: "photo" as const,
                ...photo,
                presigned_url,
            };
        })
    );

    const items = [
        ...allowedFolders.map((folder) => ({ type: "folder" as const, ...folder })),
        ...updatedPhotos,
    ];

    return NextResponse.json({ items });
}
