"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/album/modals/modal"
import { MoreHorizontal, Share2, Download } from "lucide-react"

import {Item, Photo} from "@/components/ui/album/folder-provider";

interface ViewPhotoModalProps {
    isOpen: boolean
    onClose: () => void
    item: Item | null
    onShare?: () => void
}

export function ViewPhotoModal({ isOpen, onClose, item, onShare }: ViewPhotoModalProps) {
    if (!item || item.type !== "photo") return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-0 overflow-hidden sm:max-w-[800px]">
                <div className="relative w-full aspect-video">
                    <Image src={(item as Photo).presigned_url!} alt={item.name} fill className="object-contain" />
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on {formatDate(item.created_at)}</p>
                        {item.owner !== "You" && <p className="text-sm text-muted-foreground">Shared by {item.owner}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" title="Download">
                            <Download className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="Share" onClick={onShare}>
                            <Share2 className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" title="More options">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

