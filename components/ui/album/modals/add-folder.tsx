"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/album/modals/modal"
import { Item, useFolder} from "@/components/ui/album/folder-provider";
import { useRouter} from "next/navigation";

export function AddFolderModal({
                                   isOpen,
                                   onClose,
                                   targetLocation,
                                   parentId
                               }: {
    isOpen: boolean
    onClose: () => void
    targetLocation: string
    parentId: string
}) {
    const [folderName, setFolderName] = useState("")
    const { data, setData } = useFolder();
    const router = useRouter();

    const handleCreate = async () => {
        try {
            const response = await fetch("/api/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: folderName, parent_id: parentId }),
            });
            if (!response.ok) {
                throw new Error("Failed to create folder");
            }
            if(!parentId) {
                router.push("/album/MyAlbum")
            }
            else {
                const newFolder = await response.json();
                const item: Item = {...newFolder, type: "folder", owner: "You"};

                data!.items!.push(item)
                setData(data);
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            onClose();
            setFolderName("");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Create New Folder</h2>
                <p className="text-muted-foreground mb-4">Enter a name for your new folder in {targetLocation}.</p>

                <div className="mb-4">
                    <Label className="block text-sm font-medium mb-1">Name</Label>
                    <Input
                        placeholder="My New Folder"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!folderName.trim()}>
                        Create
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

