import { NextResponse } from "next/server";
import {auth, currentUser} from "@clerk/nextjs/server";
import {
    createNewFolder,
    createNewUser,
    getChildFolders,
    getFolderPhotos,
    getRootFolder,
    getUser
} from "@/lib/dbUtils";
import {getPresignedGetUrl} from "@/lib/s3Utils";

export const runtime = "edge";

export async function POST(request: Request) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    // Expect JSON body: { name: string, parent_id?: string }
    const body = await request.json();
    const { name, parent_id } = body;
    if (!name) {
        return NextResponse.json({ error: "Missing folder name" }, { status: 400 });
    }
    let id = parent_id;
    if(parent_id === "") {
        id = await getRootFolder(userId).then((folder) => {return folder.id});
    }

    const newFolder = await createNewFolder(userId, name, id);
    console.log(newFolder);

    return NextResponse.json(newFolder);
}

export async function GET() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    // Check if the local user exists.
    const localUser = await getUser(userId);
    if (!localUser) {
        const clerkUser = await currentUser();
        if (!clerkUser) return redirectToSignIn();
        const rootFolder = await createNewUser(clerkUser);
        return NextResponse.json({ folder: rootFolder, items: [], breadcrumbData: [] });
    }

    const currentFolder = await getRootFolder(userId);
    if (!currentFolder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const childFolders = await getChildFolders(currentFolder.id);
    const folderPhotos = await getFolderPhotos(currentFolder.id);

    const currentFolderWithOwner = { ...currentFolder, owner: "You" };
    const updatedChildFolders = childFolders.map((folder) => ({
        type: "folder" as const,
        ...folder,
        owner: "You",
    }));
    const updatedFolderPhotos = await Promise.all(
        folderPhotos.map(async (photo) => {
            const presigned_url = await getPresignedGetUrl(photo.s3_key);
            return {
                type: "photo" as const,
                ...photo,
                owner: "You",
                presigned_url,
            };
        })
    );
    const items = [...updatedChildFolders, ...updatedFolderPhotos];

    return NextResponse.json({ folder: currentFolderWithOwner, items, breadcrumbData: [] });
}
