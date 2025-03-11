"use client";

import React, {useRef, useState} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { Modal } from "@/components/ui/album/modals/modal";
import {useFolder} from "@/components/ui/album/folder-provider";

export function AddPhotosModal({
                                   isOpen,
                                   onClose,
                                   targetLocation,
                                   parentId,
                               }: {
    isOpen: boolean;
    onClose: () => void;
    targetLocation: string;
    parentId: string;
}) {
    const [files, setFiles] = useState<
        { id: string; name: string; preview: string; type: string }[]
    >([]);
    const { data, setData } = useFolder();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map((file) => ({
                id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                preview: URL.createObjectURL(file),
                type: file.type,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
                id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                preview: URL.createObjectURL(file),
                type: file.type,
            }));
            setFiles((prev) => [...prev, ...newFiles]);
            e.dataTransfer.clearData();
        }
    };

    const handleNameChange = (id: string, newName: string) => {
        setFiles((prev) =>
            prev.map((file) =>
                file.id === id ? { ...file, name: newName } : file
            )
        );
    };

    const handleRemoveFile = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const handleUpload = async () => {
        try {
            // For each file, request a presigned URL and upload to S3
            const uploadPromises = files.map(async (file) => {
                // Get presigned URL
                const presignedResponse = await fetch("/api/upload-photos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                    }),
                });
                if (!presignedResponse.ok) {
                    throw new Error(`Failed to get presigned URL for ${file.name}`);
                }
                const { uploadUrl, key } = await presignedResponse.json();

                // Upload file directly to S3 using the presigned URL
                // Fetch the file blob from the preview URL
                const fileBlob = await fetch(file.preview).then((res) => res.blob());
                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: fileBlob,
                });
                if (!uploadRes.ok) {
                    throw new Error(`Failed to upload ${file.name} to S3`);
                }
                // Return data for metadata insertion
                return { name: file.name, folder_id: parentId, s3_key: key };
            });

            const uploadedPhotos = await Promise.all(uploadPromises);

            // Save photo metadata by calling the /api/photos endpoint.
            const metaResponse = await fetch("/api/photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photos: uploadedPhotos }),
            });
            if (!metaResponse.ok) {
                throw new Error("Failed to save photo metadata");
            }
            const newPhotos = await metaResponse.json();

            // Update FolderContext data with new photos.
            setData({
                ...data!,
                items: [
                    ...data!.items!,
                    ...newPhotos.map((photo: any) => ({ type: "photo" as const, ...photo })),
                ],
            });
        } catch (error) {
            console.error("Error uploading photos:", error);
        } finally {
            onClose();
            setFiles([]);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => setFiles([]), 300);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">Upload Photos</h2>
                <p className="text-muted-foreground mb-4">
                    Select photos to upload to {targetLocation}.
                </p>
                <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center mb-4"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your photos here or click to browse
                    </p>
                    <label className="cursor-pointer block">
                        <Button variant="outline" size="sm" type="button" onClick={handleClick}>
                            Select Files
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                {files.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">
                            Selected Photos ({files.length})
                        </h3>
                        <div
                            className="border rounded-xl max-h-[200px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-2 p-2 border-b last:border-b-0">
                                <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                                        <img
                                            src={file.preview || "/placeholder.svg"}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Input
                                        value={file.name}
                                        onChange={(e) => handleNameChange(file.id, e.target.value)}
                                        className="flex-1 h-8 rounded-lg"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => handleRemoveFile(file.id)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={files.length === 0}>
                        Upload All
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
