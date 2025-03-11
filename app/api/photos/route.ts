import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {insertPhotos, PhotoInput} from "@/lib/dbUtils";
import {getPresignedGetUrl} from "@/lib/s3Utils";

export const runtime = "edge";

export async function POST(request: Request) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    // Expect JSON body: { photos: Array<{ name: string; folder_id: string; s3_key: string; }> }
    const body = await request.json();
    const photosArray: PhotoInput[] = body.photos;
    if (!photosArray || !Array.isArray(photosArray) || photosArray.length === 0) {
        return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }
    try {
        // Insert all photos with a single query using the helper.
        const insertedPhotos = await insertPhotos(userId, photosArray);
        const updatedPhotos = await Promise.all(
            insertedPhotos.map(async (photo) => {
                const presigned_url = await getPresignedGetUrl(photo.s3_key);
                return {
                    ...photo,
                    presigned_url,
                    owner: "You",
                    type: "photo" as const,
                };
            })
        );

        return NextResponse.json(updatedPhotos);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
