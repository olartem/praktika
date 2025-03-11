import { type Metadata } from 'next'
import {
    ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'

import { Inter } from "next/font/google"
import BlockContextMenu from "@/components/blockContextMenu";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "PhotoVault",
    description: "A modern photo album app for organizing and sharing your precious moments",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorBackground: 'hsl(223.81 0% 4%)',
                    colorPrimary: 'hsl(223.81 0% 98%)',
                    colorText: 'hsl(223.81 0% 98%)',
                    colorTextSecondary: 'hsl(223.81 0% 63%)',
                    colorTextOnPrimaryBackground: 'hsl(223.81 0% 9%)',
                    fontFamily: 'Inter',
                    colorInputText: 'hsl(223.81 0% 4%)',
                    colorNeutral: 'hsl(223.81 0% 98%)',
                    colorInputBackground: 'hsl(223.81 0% 98%)',
                },
            }}
        >
            <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} antialiased scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent`}>
            <BlockContextMenu/>
            {children}
            </body>
            </html>
        </ClerkProvider>
    )
}