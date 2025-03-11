"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { AddFolderModal } from "@/components/ui/album/modals/add-folder"
import { AddPhotosModal } from "@/components/ui/album/modals/add-photos"
import { EditItemModal } from "@/components/ui/album/modals/edit-item"
import { ViewPhotoModal } from "@/components/ui/album/modals/view-photo"
import { ShareModal } from "@/components/ui/album/modals/share-modal"

import {Item} from "@/components/ui/album/folder-provider";

type ModalContextType = {
    openAddFolder: (location: string, parentId: string) => void
    openAddPhotos: (location: string, parentId: string) => void
    openEditItem: (item: Item) => void
    openViewPhoto: (item: Item) => void
    openShareItem: (item: Item) => void
}

const ModalContext = createContext<ModalContextType>({
    openAddFolder: () => {},
    openAddPhotos: () => {},
    openEditItem: () => {},
    openViewPhoto: () => {},
    openShareItem: () => {},
})

export const useModals = () => useContext(ModalContext)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
    const [isAddPhotosOpen, setIsAddPhotosOpen] = useState(false)
    const [isEditItemOpen, setIsEditItemOpen] = useState(false)
    const [isViewPhotoOpen, setIsViewPhotoOpen] = useState(false)
    const [isShareItemOpen, setIsShareItemOpen] = useState(false)
    const [targetLocation, setTargetLocation] = useState("")
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [parentId, setParentId] = useState("");

    const openAddFolder = (location: string, parentId: string) => {
        setParentId(parentId)
        setTargetLocation(location)
        setIsAddFolderOpen(true)
    }

    const openAddPhotos = (location: string, parentId: string) => {
        setParentId(parentId)
        setTargetLocation(location)
        setIsAddPhotosOpen(true)
    }

    const openEditItem = (item: Item) => {
        setSelectedItem(item)
        setIsEditItemOpen(true)
    }

    const openViewPhoto = (item: Item) => {
        setSelectedItem(item)
        setIsViewPhotoOpen(true)
    }

    const openShareItem = (item: Item) => {
        setSelectedItem(item)
        setIsShareItemOpen(true)
    }

    return (
        <ModalContext.Provider
            value={{
                openAddFolder,
                openAddPhotos,
                openEditItem,
                openViewPhoto,
                openShareItem,
            }}
        >
            {children}

            <AddFolderModal
                isOpen={isAddFolderOpen}
                onClose={() => setIsAddFolderOpen(false)}
                targetLocation={targetLocation}
                parentId={parentId}
            />

            <AddPhotosModal
                isOpen={isAddPhotosOpen}
                onClose={() => setIsAddPhotosOpen(false)}
                targetLocation={targetLocation}
                parentId={parentId}
            />

            <EditItemModal isOpen={isEditItemOpen} onClose={() => setIsEditItemOpen(false)} item={selectedItem} />

            <ViewPhotoModal
                isOpen={isViewPhotoOpen}
                onClose={() => setIsViewPhotoOpen(false)}
                item={selectedItem}
                onShare={() => {
                    setIsViewPhotoOpen(false)
                    setIsShareItemOpen(true)
                }}
            />

            <ShareModal isOpen={isShareItemOpen} onClose={() => setIsShareItemOpen(false)} item={selectedItem} />
        </ModalContext.Provider>
    )
}

