"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, ChevronDown, FolderOpen, Home, Share2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Sidebar as SidebarComponent,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useModals } from "@/components/ui/album/modal-provider"

export function Sidebar() {
    const pathname = usePathname()
    const { openAddFolder, openAddPhotos } = useModals()
    const [activeView, setActiveView] = useState<"home" | "my-albums" | "shared">("my-albums")

    // Update active view based on the current path
    useEffect(() => {
        if (pathname.includes("/MyAlbum")) {
            setActiveView("my-albums")
        } else if (pathname.includes("/Shared")) {
            setActiveView("shared")
        } else if (pathname.includes("/Home")) {
            setActiveView("home")
        }
    }, [pathname])

    return (
        <SidebarComponent className="border-r border-border">
            <SidebarHeader className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Camera className="size-6" />
                    <span className="text-lg font-bold">PhotoVault</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="size-4" />
                  <span>New</span>
                </span>
                                <ChevronDown className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openAddFolder("My Vault", "")}>Add Folder</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAddPhotos("My Vault", "")}>Add Photos</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <SidebarMenu className="p-2 pr-4">
                    <SidebarMenuItem>
                        <Link href="/album/Home" className="w-full">
                            <SidebarMenuButton
                                className={`flex items-center gap-2 rounded-lg w-full hover:bg-secondary ${activeView === "home" ? "bg-secondary" : ""}`}>
                                <Home className="size-4" />
                                <span>Home</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/album/MyAlbum" className="w-full">
                            <SidebarMenuButton
                                className={`flex items-center gap-2 rounded-lg w-full hover:bg-secondary ${activeView === "my-albums" ? "bg-secondary" : ""}`}
                            >
                                <FolderOpen className="size-4" />
                                <span>My Vault</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link href="/album/Shared" className="w-full">
                            <SidebarMenuButton
                                className={`flex items-center gap-2 rounded-lg w-full hover:bg-secondary ${activeView === "shared" ? "bg-secondary" : ""}`}
                            >
                                <Share2 className="size-4" />
                                <span>Shared</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </SidebarComponent>
    )
}

