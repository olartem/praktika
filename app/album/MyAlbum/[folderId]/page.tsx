"use client"

import {useState, useEffect, use} from "react"
import { FolderData, useFolder,} from "@/components/ui/album/folder-provider"
import {TableSkeleton} from "@/components/ui/album/table-skeleton";
import {FolderView} from "@/components/ui/album/folder-view";


export default function MyAlbumFolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = use(params);
    const { setData } = useFolder();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/folders/" + folderId)
            .then((res) => res.json())
            .then((data: FolderData) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching album data:", error);
                setLoading(false);
            });
    });

    if (loading) return <TableSkeleton />;

    return <FolderView basePath="/album/MyAlbum" />;
}

