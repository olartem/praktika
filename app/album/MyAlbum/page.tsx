"use client";

import {Suspense, useEffect, useState} from "react";
import { FolderView } from "@/components/ui/album/folder-view";
import {TableSkeleton} from "@/components/ui/album/table-skeleton";
import {FolderData, FolderProvider, Item, useFolder} from "@/components/ui/album/folder-provider";

export default function MyAlbumPage() {
    const { setData } = useFolder();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/folders")
            .then((res) => res.json())
            .then((data: FolderData) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching album data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <TableSkeleton />;

    return <FolderView basePath="/album/MyAlbum" />;

}