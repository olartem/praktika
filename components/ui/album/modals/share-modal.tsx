"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/album/modals/modal"
import { Check, Copy, Link, Mail, Share2 } from "lucide-react"

import {Item} from "@/components/ui/album/folder-provider";

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    item: Item | null
}

export function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
    const [copied, setCopied] = useState(false)
    const [email, setEmail] = useState("")

    if (!item) return null

    // Generate a mock share link
    const shareLink = `https://photovault.example.com/share/${item.id}?token=${Date.now()}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSendEmail = () => {
        console.log(`Sending share link to ${email}`)
        setEmail("")
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             flex items-center justify-center w-[400px] h-[300px] bg-muted/50 rounded-lg text-xl z-99">
                WIP NOT WORKING
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Share2 className="size-5"/>
                    <h2 className="text-xl font-semibold">Share {item.type === "folder" ? "Folder" : "Photo"}</h2>
                </div>

                <p className="text-muted-foreground mb-6">Share &quot;{item.name}&quot; with others by sending them a link or email.</p>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Share Link</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Link className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input value={shareLink} readOnly className="pl-9 pr-3 bg-muted" />
                            </div>
                            <Button variant="outline" size="icon" onClick={handleCopy} className="flex-shrink-0">
                                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Share via Email</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 pr-3"
                                />
                            </div>
                            <Button onClick={handleSendEmail} disabled={!email.trim()} className="flex-shrink-0">
                                Send
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

function Label({ children }: { children: React.ReactNode }) {
    return <div className="text-sm font-medium mb-1.5">{children}</div>
}

