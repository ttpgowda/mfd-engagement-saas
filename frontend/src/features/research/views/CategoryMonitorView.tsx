"use client";

import React, { useEffect, useState } from 'react';
import {
    LayoutDashboard, ArrowUpDown, Info
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { researchService, CategoryMonitorResponse } from '@/services/researchService';
import { Loader2 } from 'lucide-react';

export default function CategoryMonitorView() {
    const [data, setData] = useState<CategoryMonitorResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'avgReturn3Y', direction: 'desc' });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await researchService.getCategoryMonitor();
                setData(res);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Sorting Logic
    const sortedData = React.useMemo(() => {
        if (!data) return [];
        return [...data].sort((a: CategoryMonitorResponse, b: CategoryMonitorResponse) => {
            // @ts-expect-error - dynamic key access
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            // @ts-expect-error - dynamic key access
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc',
        }));
    };

    // Heatmap Color Logic
    const getCellClass = (val: number | null | undefined) => {
        if (val === null || val === undefined) return "text-muted-foreground";
        if (val >= 20) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold";
        if (val >= 10) return "text-emerald-600 dark:text-emerald-400 font-medium";
        if (val < 0) return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
        return "text-foreground";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-emerald-500" />
                    Mutual Fund Category Monitor
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bird&#39;s-eye view of how different sectors and categories are performing.
                </p>
            </div>

            <Card className="border-border/50 shadow-md">
                <CardHeader className="pb-2 bg-muted/10 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium uppercase">Category Performance Matrix</CardTitle>
                        <Badge variant="outline" className="bg-background">
                            {data.length} Categories Tracked
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[250px] sticky left-0 bg-background z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">Category Name</TableHead>
                                    <SortableHead label="1M" sortKey="avgReturn1M" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="3M" sortKey="avgReturn3M" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="6M" sortKey="avgReturn6M" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="1Y" sortKey="avgReturn1Y" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="3Y" sortKey="avgReturn3Y" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="5Y" sortKey="avgReturn5Y" activeSort={sortConfig} onSort={handleSort} />
                                    <TableHead className="text-center w-[100px]">
                                        <div className="flex items-center justify-center gap-1">
                                            Vol.
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent>Avg Standard Deviation (Risk)</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-48 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                                            <p className="text-muted-foreground">Aggregating market data...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedData.map((cat) => (
                                        <TableRow key={cat.categoryName} className="group">
                                            <TableCell className="font-medium sticky left-0 bg-background z-10 group-hover:bg-muted/50 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                {cat.categoryName}
                                                <div className="text-[10px] text-muted-foreground font-normal">
                                                    {cat.schemeCount} Schemes
                                                </div>
                                            </TableCell>
                                            <DataCell val={cat.avgReturn1M} getStyle={getCellClass} />
                                            <DataCell val={cat.avgReturn3M} getStyle={getCellClass} />
                                            <DataCell val={cat.avgReturn6M} getStyle={getCellClass} />
                                            <DataCell val={cat.avgReturn1Y} getStyle={getCellClass} />
                                            <DataCell val={cat.avgReturn3Y} getStyle={getCellClass} bold />
                                            <DataCell val={cat.avgReturn5Y} getStyle={getCellClass} />
                                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                                {cat.avgStdDev !== undefined && cat.avgStdDev !== null
                                                    ? cat.avgStdDev.toFixed(2)
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Sub-components
interface SortableHeadProps {
    label: string;
    sortKey: string;
    activeSort: { key: string; direction: 'asc' | 'desc' };
    onSort: (key: string) => void;
}

const SortableHead = ({ label, sortKey, activeSort, onSort }: SortableHeadProps) => (
    <TableHead
        className="text-right cursor-pointer hover:bg-muted/50 transition-colors w-[100px]"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center justify-end gap-1">
            {label}
            <ArrowUpDown className={`w-3 h-3 ${activeSort.key === sortKey ? 'text-emerald-500 opacity-100' : 'opacity-20'}`} />
        </div>
    </TableHead>
);

// FIX APPLIED HERE: Added check for undefined
interface DataCellProps {
    val: number | null | undefined;
    getStyle: (val: number | null | undefined) => string;
    bold?: boolean;
}

const DataCell = ({ val, getStyle, bold }: DataCellProps) => (
    <TableCell className={`text-right font-mono text-sm border-l border-border/30 ${getStyle(val)} ${bold ? 'bg-muted/20' : ''}`}>
        {(val !== null && val !== undefined) ? `${val.toFixed(2)}%` : '-'}
    </TableCell>
);