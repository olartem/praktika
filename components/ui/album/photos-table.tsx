"use client"

import {FileImage, Folder, FolderIcon, MoreHorizontal} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { ChevronUp, ChevronDown, Share2 } from "lucide-react"
import {Item, useFolder} from "@/components/ui/album/folder-provider";

interface PhotosTableProps {
    items: any[]
    sortColumn: string
    sortDirection: "asc" | "desc"
    onSort: (column: string) => void
    onItemClick: (item: any) => void
    onEditItem: (item: any) => void
    onShareItem: (item: any) => void
    isShared?: boolean
}

export function PhotosTable({
                                items,
                                sortColumn,
                                sortDirection,
                                onSort,
                                onItemClick,
                                onEditItem,
                                onShareItem,
                                isShared = false,
                            }: PhotosTableProps) {
    const {data, setData} = useFolder();
    const renderSortIcon = (column: string) => {
        if (sortColumn !== column) return null

        return sortDirection === "asc" ? <ChevronUp className="size-4 ml-1" /> : <ChevronDown className="size-4 ml-1" />
    }

    const handleDeleteItem = async (item: Item) => {
        if (!item) return;

        try {
            // Determine endpoint based on item type
            const endpoint = item.type === "folder" ? "folders" : "photos";
            const response = await fetch(`/api/${endpoint}/${item.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to update item");
            }

            setData({
                ...data!,
                items: data!.items!.filter((i) => i.id !== item.id),
            });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    return (
        (items.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-4">
                    <div className="bg-muted/30 rounded-full p-6 mb-6">
                        <FolderIcon className="size-12 text-muted-foreground"/>
                    </div>
                    <h3 className="text-xl font-medium mb-2">This folder is empty</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                        {isShared
                            ? "There are no items shared in this folder yet."
                            : "Add photos or create folders to organize your content."}
                    </p>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col">
                    <div
                        className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent h-full">
                        <Table>
                            <TableHeader className="sticky top-0 bg-card z-10">
                                <TableRow className="border-b border-border">
                                    <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
                                        <div className="flex items-center">
                                            Name
                                            {renderSortIcon("name")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => onSort("owner")}>
                                        <div className="flex items-center">
                                            Owner
                                            {renderSortIcon("owner")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => onSort("updatedAt")}>
                                        <div className="flex items-center">
                                            Last Updated
                                            {renderSortIcon("updatedAt")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        onClick={() => onItemClick(item)}
                                        className="cursor-pointer group hover:bg-muted/30 transition-colors"
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {item.type === "folder" ? (
                                                    <Folder className="size-5 text-muted-foreground"/>
                                                ) : (
                                                    <FileImage className="size-5 text-muted-foreground"/>
                                                )}
                                                <span>{item.name}</span>
                                                {item.share_token && <Share2 className="size-4 text-muted-foreground"/>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.owner}</TableCell>
                                        <TableCell>{item.updatedAt}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"
                                                            onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="size-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {!isShared && (
                                                        <DropdownMenuItem
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                onEditItem(item)
                                                            }}
                                                        >
                                                            Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onShareItem(item)
                                                        }}
                                                    >
                                                        Share
                                                    </DropdownMenuItem>
                                                    {!isShared && (
                                                        <>
                                                            <DropdownMenuSeparator/>
                                                            <DropdownMenuItem className="text-destructive"
                                                                              onClick={(e) => {
                                                                                  e.stopPropagation()
                                                                                  handleDeleteItem(item)
                                                                              }}>
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )
    )
}

