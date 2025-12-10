import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkPerformance } from '@/services/adminAnalyticsService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LinksTableProps {
    data: LinkPerformance[];
}

export function LinksTable({ data }: LinksTableProps) {
    const [page, setPage] = useState(1);
    const pageSize = 5; // Reduced default size for better fit
    const totalPages = Math.ceil(data.length / pageSize);

    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Recent Shared Links</CardTitle>
            </CardHeader>
            <CardContent>
                <div className=" overflow-x-auto">
                    <Table>
                        {/* Table Header ... */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Tool</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Leads</TableHead>
                                <TableHead className="text-right">Conv. Rate</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No shared links yet.
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.map((link) => (
                                <TableRow key={link.linkId}>
                                    {/* ... Row Content ... */}
                                    <TableCell className="font-medium">
                                        {link.title || 'Untitled'}
                                        <div className="text-xs text-muted-foreground">{link.shortCode}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {link.toolSlug.replace(/-/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{link.views}</TableCell>
                                    <TableCell className="text-right">{link.leads}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={link.conversionRate > 0 ? 'text-green-600 font-medium' : ''}>
                                            {link.conversionRate.toFixed(1)}%
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {link.lastActive ? new Date(link.lastActive).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/share/${link.toolSlug}/${link.shortCode}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {data.length > pageSize && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm font-medium">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
