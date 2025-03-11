import { ModalProvider } from "@/components/ui/album/modal-provider"
import { Sidebar } from "@/components/ui/album/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import type { ReactNode } from "react"
import {UserButton} from "@clerk/nextjs";
import {FolderProvider} from "@/components/ui/album/folder-provider";
import {SearchBar} from "@/components/ui/album/searchbar";

export default function AlbumLayout({
                                        children,
                                    }: {
    children: ReactNode
}) {
    return (
        <FolderProvider>
            <ModalProvider>
                <SidebarProvider>
                    <div className="flex w-full min-h-screen">
                        <Sidebar />

                        <div className="flex-1 flex flex-col overflow-hidden">
                            <header className="border-b border-border p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <SidebarTrigger className="md:hidden" />
                                        <SearchBar />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserButton />
                                    </div>
                                </div>
                            </header>

                            <main className="flex-1 overflow-hidden p-4 w-full">{children}</main>
                        </div>
                    </div>
                </SidebarProvider>
            </ModalProvider>
        </FolderProvider>
    )
}

