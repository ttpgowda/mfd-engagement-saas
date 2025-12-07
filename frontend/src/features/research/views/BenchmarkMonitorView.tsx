"use client";

import React, { useEffect, useState } from 'react';
import {
    ArrowUpDown, Info, Activity
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
import { researchService, BenchmarkMonitorResponse } from '@/services/researchService';
import { Loader2 } from 'lucide-react';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function BenchmarkMonitorView() {
    const [data, setData] = useState<BenchmarkMonitorResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'return1Y', direction: 'desc' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await researchService.getBenchmarkMonitor();
                setData(res);
            } catch (err: unknown) {
                console.error(err);
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);

            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const sortedData = React.useMemo(() => {
        if (!data) return [];
        return [...data].sort((a: BenchmarkMonitorResponse, b: BenchmarkMonitorResponse) => {
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

    const getCellClass = (val: number | null | undefined) => {
        if (val === null || val === undefined) return "text-muted-foreground";
        if (val >= 15) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold";
        if (val >= 0) return "text-emerald-600 dark:text-emerald-400 font-medium";
        if (val < 0) return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
        return "text-foreground";
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    Benchmark Monitor
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Track the performance of major market indices and benchmarks.
                </p>
            </div>

            <ErrorAlert message={error} />

            <Card className="border-border/50 shadow-md">
                <CardHeader className="pb-2 bg-muted/10 border-b border-border/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium uppercase">Market Indices Matrix</CardTitle>
                        <Badge variant="outline" className="bg-background">
                            {data.length} Indices
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[300px] sticky left-0 bg-background z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">Benchmark</TableHead>
                                    <SortableHead label="1 Year" sortKey="return1Y" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="3 Year" sortKey="return3Y" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="5 Year" sortKey="return5Y" activeSort={sortConfig} onSort={handleSort} />
                                    <SortableHead label="Since Inc." sortKey="returnInception" activeSort={sortConfig} onSort={handleSort} />

                                    <TableHead className="text-center w-[100px]">
                                        <div className="flex items-center justify-center gap-1">
                                            Vol.
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent>Standard Deviation (Volatility)</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-center w-[100px]">Sharpe</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                                            <p className="text-muted-foreground">Loading indices...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedData.map((b) => (
                                        <TableRow key={b.benchmarkName} className="group">
                                            <TableCell className="font-medium sticky left-0 bg-background z-10 group-hover:bg-muted/50 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                {b.benchmarkName}
                                                {b.nseSymbol && (
                                                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                                        {b.nseSymbol}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <DataCell val={b.return1Y} getStyle={getCellClass} />
                                            <DataCell val={b.return3Y} getStyle={getCellClass} />
                                            <DataCell val={b.return5Y} getStyle={getCellClass} />
                                            <DataCell val={b.returnInception} getStyle={getCellClass} />

                                            <TableCell className="text-center font-mono text-sm text-muted-foreground border-l border-border/30">
                                                {b.stdDev !== null ? b.stdDev.toFixed(2) : '-'}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-sm text-muted-foreground border-l border-border/30">
                                                {b.sharpeRatio !== null ? b.sharpeRatio.toFixed(2) : '-'}
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

interface SortableHeadProps {
    label: string;
    sortKey: string;
    activeSort: { key: string; direction: 'asc' | 'desc' };
    onSort: (key: string) => void;
}

const SortableHead = ({ label, sortKey, activeSort, onSort }: SortableHeadProps) => (
    <TableHead
        className="text-right cursor-pointer hover:bg-muted/50 transition-colors w-[110px]"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center justify-end gap-1">
            {label}
            <ArrowUpDown className={`w-3 h-3 ${activeSort.key === sortKey ? 'text-emerald-500 opacity-100' : 'opacity-20'}`} />
        </div>
    </TableHead>
);

interface DataCellProps {
    val: number | null | undefined;
    getStyle: (val: number | null | undefined) => string;
}

const DataCell = ({ val, getStyle }: DataCellProps) => (
    <TableCell className={`text-right font-mono text-sm border-l border-border/30 ${getStyle(val)}`}>
        {(val !== null && val !== undefined) ? `${val.toFixed(2)}%` : '-'}
    </TableCell>
);