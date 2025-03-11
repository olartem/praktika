"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {PhotosTable} from "@/components/ui/album/photos-table"
import {useModals} from "@/components/ui/album/modal-provider"
import {Item, useFolder} from "@/components/ui/album/folder-provider";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"


interface FolderViewProps {
    isShared?: boolean
    basePath: string // e.g., "/album/MyAlbum" or "/album/Shared"
    onItemClick?: (item: Item) => void // Optional custom click handler
}

export function FolderView({ isShared = false, basePath, onItemClick }: FolderViewProps) {
    const router = useRouter()
    const { openEditItem, openViewPhoto, openShareItem, openAddPhotos, openAddFolder } = useModals()
    const [sortColumn, setSortColumn] = useState("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [displayItems, setDisplayItems] = useState<Item[]>([])
    const { data } = useFolder();
    const items = data?.items;

    useEffect(() => {
        setDisplayItems(items!)
    }, [items])

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    // Sort items
    const sortedItems = [...displayItems].sort((a, b) => {
        // First sort by type (folders first)
        if (a.type !== b.type) {
            return a.type === "folder" ? -1 : 1
        }

        if (sortColumn === "updatedAt") {
            const aTime = new Date(a.updated_at ? a.updated_at : a.created_at).getTime();
            const bTime = new Date(b.updated_at ? b.updated_at : b.created_at).getTime();
            return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
        }

        // Then sort by the selected column
        const aValue = a[sortColumn as keyof typeof a]
        const bValue = b[sortColumn as keyof typeof b]

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return 0
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    const handleItemClick = (item: Item) => {
        if (onItemClick) {
            onItemClick(item)
            return
        }

        if (item.type === "folder") {
            router.push(`${basePath}/${item.id}`)
        } else {
            openViewPhoto(item)
        }
    }

    const handleEditItem = (item: Item) => {
        if (!isShared) {
            openEditItem(item)
        }
    }

    const handleShareItem = (item: Item) => {
        openShareItem(item)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger className="flex-1 overflow-auto w-full h-full">
                <div className="w-full h-full folder-container table-container">
                    {data!.folder.name && <h1 className="text-2xl font-bold mb-4">{data!.folder.name}</h1>}

                    <PhotosTable
                        items={sortedItems.map((item) => ({
                            ...item,
                            updatedAt: item.updated_at ? formatDate(item.updated_at) : formatDate(item.created_at),
                        }))}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onItemClick={handleItemClick}
                        onEditItem={handleEditItem}
                        onShareItem={handleShareItem}
                        isShared={isShared}
                    />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => openAddPhotos(data!.folder.name!, data!.folder.id!)}>
                    Add Photos
                </ContextMenuItem>
                <ContextMenuItem onClick={() => openAddFolder(data!.folder.name!, data!.folder.id!)}>
                    Add Folder
                </ContextMenuItem>
                <ContextMenuSeparator/>
                <ContextMenuItem>Select All</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

