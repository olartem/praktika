"use client"
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb"
import Link from "next/link"
import {ChevronRight, FolderOpen} from "lucide-react"
import React, {ReactNode, useEffect, useState} from "react"
import {useFolder} from "@/components/ui/album/folder-provider";

export interface BreadcrumbItemType {
    id: string;
    name: string;
}

export default function MyAlbumLayout({
                                          children,
                                      }: {
    children: ReactNode
}) {
    const { data } = useFolder();
    return (
        <div className="space-y-4 h-full">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/album/MyAlbum"
                              className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <FolderOpen className="size-4"/>
                            <span>My Vault</span>
                        </Link>
                    </BreadcrumbItem>
                    {data?.breadcrumbData.map(item => (
                        <React.Fragment key={item.id}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={`/album/MyAlbum/${item.id}`}
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                >
                                    <FolderOpen className="size-4" />
                                    <span>{item.name}</span>
                                </Link>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            {children}
        </div>
)
}

