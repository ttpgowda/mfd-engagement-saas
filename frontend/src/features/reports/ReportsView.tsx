'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DataTable } from '@/components/ui/data-table';
import { ReportService, LinkReportItem, TrafficLog } from '@/services/reportService';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';

// --- Columns Definition ---
const linkColumns: ColumnDef<LinkReportItem>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'toolSlug', header: 'Tool' },
    { accessorKey: 'views', header: 'Views' },
    { accessorKey: 'leads', header: 'Leads' },
    {
        accessorKey: 'conversionRate',
        header: 'Conv. Rate',
        cell: ({ row }) => `${row.getValue<number>('conversionRate').toFixed(2)}%`,
    },
    {
        accessorKey: 'avgEngagementTime',
        header: 'Avg Time (s)',
        cell: ({ row }) => row.getValue<number>('avgEngagementTime').toFixed(1),
    },
    {
        accessorKey: 'lastActive',
        header: 'Last Active',
        cell: ({ row }) => format(new Date(row.getValue<string>('lastActive')), 'MMM dd, HH:mm'),
    },
];

const logColumns: ColumnDef<TrafficLog>[] = [
    {
        accessorKey: 'timestamp',
        header: 'Time',
        cell: ({ row }) => format(new Date(row.getValue<string>('timestamp')), 'MMM dd, HH:mm:ss'),
    },
    { accessorKey: 'toolSlug', header: 'Tool' },
    { accessorKey: 'linkTitle', header: 'Link Title' },
    {
        accessorKey: 'durationSeconds',
        header: 'Duration',
        cell: ({ row }) => `${row.getValue<number>('durationSeconds').toFixed(1)}s`,
    },
    { accessorKey: 'city', header: 'Location' },
];

export function ReportsView() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const [linksPagination, setLinksPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [logsPagination, setLogsPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [activeTab, setActiveTab] = useState('links');
    const [sortOption, setSortOption] = useState('latest');

    // Helper to format date for API
    const getDates = () => {
        if (!date?.from) return { start: '', end: '' }; // Should not happen with default
        return {
            start: date.from.toISOString(),
            end: (date.to || date.from).toISOString(),
        };
    };

    const { start, end } = getDates();

    const getSortParam = () => {
        if (sortOption === 'latest') return 'createdAt,desc';
        if (sortOption === 'oldest') return 'createdAt,asc';
        if (sortOption === 'duration') return 'durationSeconds,desc';
        return 'createdAt,desc';
    };

    const { data: linksData, isLoading: isLoadingLinks } = useQuery({
        queryKey: ['detailed-links', start, end, linksPagination.pageIndex, linksPagination.pageSize, sortOption],
        queryFn: () => ReportService.getDetailedLinksReport(start, end, linksPagination.pageIndex, linksPagination.pageSize, getSortParam()),
        enabled: !!start && !!end && activeTab === 'links',
    });

    const { data: logsData, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['traffic-logs', start, end, logsPagination.pageIndex, logsPagination.pageSize, sortOption],
        queryFn: () => ReportService.getTrafficLogs(start, end, logsPagination.pageIndex, logsPagination.pageSize, getSortParam()),
        enabled: !!start && !!end && activeTab === 'logs',
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Detailed Reports</h2>
                <div className="flex items-center space-x-2">
                    <Select
                        value={sortOption}
                        onValueChange={(val) => {
                            setSortOption(val);
                            setLinksPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            setLogsPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            {activeTab === 'logs' && (
                                <SelectItem value="duration">Duration (High-Low)</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <DatePickerWithRange date={date} setDate={setDate} />
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(val) => {
                    setActiveTab(val);
                    setSortOption('latest');
                    setLinksPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    setLogsPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="space-y-4"
            >
                <TabsList>
                    <TabsTrigger value="links">Link Performance</TabsTrigger>
                    <TabsTrigger value="logs">Traffic Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="links" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shared Link Performance</CardTitle>
                            <CardDescription>
                                Detailed breakdown of views, leads, and engagement for shared links in selected period.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingLinks ? (
                                <div className="flex h-24 items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <DataTable
                                    columns={linkColumns}
                                    data={linksData?.content || []}
                                    pageCount={linksData?.totalPages || 0}
                                    pagination={linksPagination}
                                    onPaginationChange={setLinksPagination}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Raw Traffic Logs</CardTitle>
                            <CardDescription>
                                Individual session records for granular analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingLogs ? (
                                <div className="flex h-24 items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <DataTable
                                    columns={logColumns}
                                    data={logsData?.content || []}
                                    pageCount={logsData?.totalPages || 0}
                                    pagination={logsPagination}
                                    onPaginationChange={setLogsPagination}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
