"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/album/modals/modal"

import {Item, Photo, useFolder} from "@/components/ui/album/folder-provider";

interface EditItemModalProps {
    isOpen: boolean
    onClose: () => void
    item: Item | null
}

export function EditItemModal({ isOpen, onClose, item }: EditItemModalProps) {
    const [editName, setEditName] = useState("")
    const { data, setData } = useFolder();

    useEffect(() => {
        if (item) {
            setEditName(item.name)
        }
    }, [item])

    const handleSaveEdit = async () => {
        if (!item) return;

        try {
            // Determine endpoint based on item type
            const endpoint = item.type === "folder" ? "folders" : "photos";
            const response = await fetch(`/api/${endpoint}/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newName: editName }),
            });
            if (!response.ok) {
                throw new Error("Failed to update item");
            }
            const updatedItem = await response.json();

            setData({
                ...data!,
                items: data!.items!.map((i) =>
                    i.id === updatedItem.id ? { ...i, name: updatedItem.name } : i
                ),
            });
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            onClose();
        }
    };

    if (!item) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Edit {item.type === "folder" ? "Folder" : "Photo"}</h2>
                <p className="text-muted-foreground mb-4">Make changes to your {item.type}.</p>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="item-name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="item-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="col-span-3 rounded-lg"
                        />
                    </div>

                    {item.type === "photo" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Preview</Label>
                            <div className="col-span-3">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                                    <Image
                                        src={(item as Photo).presigned_url!}
                                        alt="Photo preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    )
}

