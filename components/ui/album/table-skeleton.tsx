import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TableSkeleton() {
    return (
        <div className="w-full h-full flex flex-col">
            <Skeleton className="h-6 w-[120px] mb-3 mt-3"/>
            <div
                className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent h-full">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="border-b border-border">
                            <TableHead className="cursor-pointer">
                                <div className="flex items-center">
                                    Name
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer">
                                <div className="flex items-center">
                                    Owner
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer">
                                <div className="flex items-center">
                                    Last Updated
                                </div>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({length: 6}).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-2 h-10">
                                        <Skeleton className="size-5 rounded-md"/>
                                        <Skeleton className="h-4 w-[130px]"/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-[60px]"/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-[180px]"/>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end">
                                        <Skeleton className="size-8 rounded-md"/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
