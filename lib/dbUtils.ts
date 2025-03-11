import { db } from "./db";
import {users, folders, photos} from "@/db/schema";
import {and, eq, isNull} from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import {inArray} from "drizzle-orm/sql/expressions/conditions";

export async function createNewUser(clerkUser: {
    id: string;
    emailAddresses: { emailAddress: string }[];
}) {
    await db.insert(users).values({
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        created_at: new Date().toISOString(),
    });

    const root = await createNewFolder(clerkUser.id, "My Vault", null);

    return root;
}

export async function getRootFolder(userId: string) {
    const [rootFolder] = await db
        .select()
        .from(folders)
        .where(and(eq(folders.owner_id, userId), isNull(folders.parent_id)))
        .limit(1);
    return rootFolder;
}

export async function getFolderById(folderId: string) {
    const [folder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, folderId))
        .limit(1);
    return folder;
}

export async function getFolders(folderIds: string []) {
    return db
        .select()
        .from(folders)
        .where(inArray(folders.id, folderIds));
}

export async function getChildFolders(folderId: string) {
    const childFolders = await db
        .select()
        .from(folders)
        .where(eq(folders.parent_id, folderId));
    return childFolders;
}

export async function getFolderPhotos(folderId: string) {
    const folderPhotos = await db
        .select()
        .from(photos)
        .where(eq(photos.folder_id, folderId));
    return folderPhotos;
}

export async function getUser(userId: string) {
    const [localUser] = await  db.select().from(users).where(eq(users.id, userId)).limit(1);
    return localUser;
}

export async function createNewFolder(userId: string, name: string, parent_id: string | null) {
    const id = uuidv4();
    let path = `/${id}`;

    if(parent_id) {
        const parentFolder = await getFolderById(parent_id);
        if (parentFolder) {
            path = `${parentFolder.path}${path}`;
        }
    }

    const [newFolder] = await db
        .insert(folders)
        .values({
            id,
            owner_id: userId,
            name,
            parent_id: parent_id,
            path,
            share_token: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .returning();
    return newFolder;
}

export async function updateFolderName(
    userId: string,
    folderId: string,
    newName: string
) {
    const folder = await getFolderById(folderId);
    if (!folder) {
        throw new Error("Folder not found");
    }
    if (folder.owner_id !== userId) {
        throw new Error("Not authorized to update this folder");
    }

    const parentFolder = await getFolderById(folder.parent_id!);
    const newPath = parentFolder.path.endsWith("/")
        ? `${parentFolder.path}${newName}`
        : `${parentFolder.path}/${newName}`;

    const [updatedFolder] = await db
        .update(folders)
        .set({
            name: newName,
            path: newPath,
            updated_at: new Date().toISOString(),
        })
        .where(eq(folders.id, folderId))
        .returning();

    return updatedFolder;
}

export async function deleteFolder(userId: string, folderId: string) {
    const folder = await getFolderById(folderId);
    if (!folder) {
        throw new Error("Folder not found");
    }
    if (folder.owner_id !== userId) {
        throw new Error("Not authorized to delete this folder");
    }

    await db.delete(folders).where(eq(folders.id, folderId));

    return { message: "Folder deleted successfully" };
}

export type PhotoInput = {
    name: string;
    folder_id: string;
    s3_key: string;
};

export async function insertPhotos(
    userId: string,
    photosArray: PhotoInput[]
) {
    const photosToInsert = photosArray.map((photo) => ({
        id: uuidv4(),
        owner_id: userId,
        folder_id: photo.folder_id,
        name: photo.name,
        s3_key: photo.s3_key,
        share_token: null,
        created_at: new Date().toISOString(),
    }));

    const insertedPhotos = await db
        .insert(photos)
        .values(photosToInsert)
        .returning();

    return insertedPhotos;
}

export async function getUsers(userIds: string []) {
    return db
        .select()
        .from(users)
        .where(inArray(users.id, userIds));
}

export async function getPhotoById(photoId: string) {
    const [photo] = await db
        .select()
        .from(photos)
        .where(eq(photos.id, photoId))
        .limit(1);
    return photo;
}

export async function updatePhotoName(
    userId: string,
    photoId: string,
    newName: string
) {
    const photo = await getPhotoById(photoId);
    if (!photo) {
        throw new Error("Photo not found");
    }
    if (photo.owner_id !== userId) {
        throw new Error("Not authorized to update this photo");
    }

    const [updatedPhoto] = await db
        .update(photos)
        .set({
            name: newName,
        })
        .where(eq(photos.id, photoId))
        .returning();

    return updatedPhoto;
}

export async function deletePhoto(userId: string, photoId: string) {
    const photo = await getPhotoById(photoId);
    if (!photo) {
        throw new Error("Photo not found");
    }
    if (photo.owner_id !== userId) {
        throw new Error("Not authorized to delete this photo");
    }

    await db.delete(photos).where(eq(photos.id, photoId));

    return { message: "Photo deleted successfully" };
}