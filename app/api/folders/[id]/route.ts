import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
    deleteFolder,
    getChildFolders,
    getFolderById,
    getFolderPhotos,
    getFolders,
    getUsers,
    updateFolderName
} from "@/lib/dbUtils";
import {getPresignedGetUrl} from "@/lib/s3Utils";

export const runtime = "edge";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const { id } = await params;
    const body = await request.json();
    const { newName } = body;
    if (!newName) {
        return NextResponse.json({ error: "Missing new folder name" }, { status: 400 });
    }

    try {
        const updatedFolder = await updateFolderName(userId, id, newName);
        return NextResponse.json(updatedFolder);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function DELETE(request: Request,{ params }: { params: Promise<{ id: string }> }) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const { id } = await params;
    try {
        const result = await deleteFolder(userId, id);
        return NextResponse.json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }
) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const { id } = await params;

    // Fetch the current folder.
    const currentFolder = await getFolderById(id);
    if (!currentFolder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Fetch child folders and photos.
    const childFolders = await getChildFolders(id);
    const folderPhotos = await getFolderPhotos(id);

    // Gather owner IDs.
    const ownerIdsSet = new Set<string>();
    ownerIdsSet.add(currentFolder.owner_id);
    childFolders.forEach((folder) => ownerIdsSet.add(folder.owner_id));
    folderPhotos.forEach((photo) => ownerIdsSet.add(photo.owner_id));
    const ownerIds = Array.from(ownerIdsSet);

    // Get owner records.
    const owners = await getUsers(ownerIds);
    const ownerMap: Record<string, string> = {};
    owners.forEach((u) => {
        ownerMap[u.id] = u.id === userId ? "You" : u.email;
    });

    // Attach owner info.
    const currentFolderWithOwner = { ...currentFolder, owner: ownerMap[currentFolder.owner_id] || "" };
    const updatedChildFolders = childFolders.map((folder) => ({
        type: "folder" as const,
        ...folder,
        owner: ownerMap[folder.owner_id] || "",
    }));
    const updatedFolderPhotos = await Promise.all(
        folderPhotos.map(async (photo) => {
            const presigned_url = await getPresignedGetUrl(photo.s3_key);
            return {
                type: "photo" as const,
                ...photo,
                owner: ownerMap[photo.owner_id] || "",
                presigned_url,
            };
        })
    );

    const items = [...updatedChildFolders, ...updatedFolderPhotos];

    // Build breadcrumbs from current folder's path.
    const folderIds = currentFolderWithOwner.path.replace(/^\/|\/$/g, "").split("/");
    // Remove the first element (the root folder ID).
    folderIds.shift();
    const foldersData = await getFolders(folderIds);
    const breadcrumbData = folderIds
        .map((id) => {
            const folder = foldersData.find((f) => f.id === id);
            return folder ? { id: folder.id, name: folder.name } : null;
        })
        .filter(Boolean) as { id: string; name: string }[];

    const response = { folder: currentFolderWithOwner, items, breadcrumbData };
    return NextResponse.json(response);
}