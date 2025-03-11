"use client";

import {createContext, useContext, useMemo, useState} from "react";
import {BreadcrumbItemType} from "@/app/album/MyAlbum/layout";

export interface Folder {
    id: string
    name: string
    parent_id: string | null
    share_token?: string
    created_at: string
    updated_at: string
    owner?: string // For display purposes
}

export interface Photo {
    id: string
    folder_id: string
    name: string
    share_token?: string
    created_at: string
    updated_at?: string // For display purposes
    owner?: string // For display purposes
    presigned_url?: string
}

export type Item = (Folder | Photo) & { type: "folder" | "photo" }

export type FolderData = {
    folder: Folder;
    items: Array<Item> | null;
    breadcrumbData: BreadcrumbItemType[];
};

export type FolderContextType = {
    data: FolderData | null;
    setData: (data: FolderData | null) => void;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const useFolder = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderProvider");
    }
    return context;
};

export function FolderProvider({
                                   children,
                                   initialData = null,
                               }: {
    children: React.ReactNode;
    initialData?: FolderData | null;
}) {
    const [data, setData] = useState<FolderData | null>(initialData);

    const value = useMemo(() => ({ data, setData }), [data]);

    return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>;
}
