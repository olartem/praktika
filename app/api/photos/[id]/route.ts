import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {deletePhoto, updatePhotoName} from "@/lib/dbUtils";

export const runtime = "edge";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const { id } = await params;
    const body = await request.json();
    const { newName } = body;
    if (!newName) {
        return NextResponse.json({ error: "Missing new folder name" }, { status: 400 });
    }

    try {
        const updatedPhoto = await updatePhotoName(userId, id, newName);
        return NextResponse.json(updatedPhoto);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// This doesn't delete images from s3, since we rely on client to upload them directly to s3 and send metadata back
// If client fails to send the metadata those images should be deleted out of edge functions context
// Since we have to track those metadata errors anyway, we can safely remove only metadata
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const { id } = await params;
    try {
        const result = await deletePhoto(userId, id);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}