"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileImage, Folder, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/ui/album/modal-provider";
import type { Item } from "@/components/ui/album/folder-provider";
import { useOnClickOutside } from "@/hooks/use-click-outside";

export function SearchBar() {
    const router = useRouter();
    const { openViewPhoto } = useModals();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside.
    useOnClickOutside(searchRef, () => setIsOpen(false));

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            setNoResults(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsLoading(true);

            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch search results");
                    return res.json();
                })
                .then((data) => {
                    const items = data.items || [];
                    setResults(items);
                    setNoResults(items.length === 0);
                    setIsLoading(false);
                    setIsOpen(true);
                })
                .catch((err) => {
                    console.error("Error fetching search results:", err);
                    setIsLoading(false);
                    setNoResults(true);
                });
        }, 300); // debounce delay

        return () => clearTimeout(timer);
    }, [query]);

    const handleItemClick = (item: Item) => {
        if (item.type === "photo") {
            openViewPhoto(item);
        } else {
            router.push(`/album/MyAlbum/${item.id}`);
        }
        setIsOpen(false);
        setQuery("");
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search photos and folders..."
                    className="pl-9 pr-9 bg-muted border-none rounded-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.trim() && results.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={clearSearch}
                    >
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Searching...</span>
                        </div>
                    ) : noResults ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No results found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            <div className="p-1">
                                {results.map((item) => (
                                    <button
                                        key={item.id}
                                        className="w-full text-left px-3 py-2 hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {item.type === "folder" ? (
                                            <Folder className="size-4 text-muted-foreground flex-shrink-0" />
                                        ) : (
                                            <FileImage className="size-4 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{item.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <span>{item.type === "folder" ? "Folder" : "Photo"}</span>
                                                <span>•</span>
                                                <span>{item.owner}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
