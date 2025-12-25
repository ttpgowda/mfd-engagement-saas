"use client";

import React, { useEffect, useState } from 'react';
import {
    ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown,
    Calendar, Info, Loader2
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { researchService, TopFundsRequest, TopFundsResponse } from '@/services/researchService';
import { publicResearchService } from '@/services/publicResearchService';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

import { ToolPageLayout } from "@/features/calculators/components/ToolPageLayout";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";

interface TopPerformingFundsViewProps {
    defaultValues?: Partial<TopFundsRequest>;
    isPublicView?: boolean;
}

export default function TopPerformingFundsView({ defaultValues, isPublicView = false }: TopPerformingFundsViewProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Query State
    const [request, setRequest] = useState<TopFundsRequest>({
        category: defaultValues?.category || '',
        page: 0,
        size: 15,
        sortBy: 'return_3y',
        sortDirection: 'DESC',
        ...defaultValues
    });

    const [data, setData] = useState<TopFundsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Service Selection
    const service = isPublicView ? publicResearchService : researchService;

    // 1. Load Categories
    useEffect(() => {
        service.getCategories().then(cats => {
            setCategories(cats);
            if (cats.length > 0 && !request.category) {
                // Default to Equity if available, else first category
                const defaultCat = cats.includes('Equity') ? 'Equity' : cats[0];
                setRequest(prev => ({ ...prev, category: defaultCat }));
            }
        });
    }, [isPublicView]); // Re-run if mode changes (unlikely) or on mount

    // 2. Fetch Data
    useEffect(() => {
        if (!request.category) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await service.getTopPerformingFunds(request);
                setData(res);
            } catch (err: unknown) {
                console.error("Failed to fetch top funds", err);
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [request, isPublicView]);

    const handleSort = (field: string) => {
        setRequest(prev => ({
            ...prev,
            sortBy: field as TopFundsRequest['sortBy'],
            sortDirection: prev.sortBy === field && prev.sortDirection === 'DESC' ? 'ASC' : 'DESC'
        }));
    };

    // Helper for coloring returns
    const ReturnCell = ({ value }: { value: number | null }) => {
        if (value === null || value === undefined) return <span className="text-muted-foreground">-</span>;
        const color = value >= 20 ? 'text-emerald-600 dark:text-emerald-400 font-bold' :
            value >= 10 ? 'text-emerald-600/80 dark:text-emerald-400/80' :
                value < 0 ? 'text-red-500' : 'text-foreground';
        return <span className={`font-mono ${color}`}>{value.toFixed(2)}%</span>;
    };

    return (
        <ToolPageLayout
            toolSlug="top-performing-funds"
            config={request}
            title="Top Performing Funds"
            description="Based on annualized returns (CAGR)."
            isPublicView={isPublicView}
        >
            <div className="space-y-6 animate-in fade-in duration-700 pb-10">
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Top Performing Funds
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Based on annualized returns (CAGR).</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Data as on {data?.dataAsOn || '...'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full md:w-auto">
                        {/* Added min-w-0 to prevent flex overflow issues */}
                        <div className="w-full md:w-[280px] min-w-0 space-y-1.5 flex-1">

                            <Select
                                value={request.category}
                                onValueChange={(v) => setRequest(prev => ({ ...prev, category: v, page: 0 }))}
                            >
                                <SelectTrigger className="h-10 bg-card border-input/60 shadow-sm w-full">
                                    {/* TRUNCATION FIX: Wraps text to prevent layout breaking on mobile */}
                                    <span className="truncate text-left block w-full pr-2">
                                        <SelectValue placeholder="Select Category" />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {isPublicView && (
                            <div className="mb-0.5">
                                <PublicShareButton />
                            </div>
                        )}
                    </div>
                </div>

                <ErrorAlert message={error} />
                {/* --- Comparison Cards --- */}
                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category Avg Card */}
                        <Card className="bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/10 dark:to-card border-blue-100 dark:border-blue-900/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Category Average ({request.category})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end pt-2">
                                    <StatBox label="1 Year" value={data.categoryAverage.return1y} />
                                    <StatBox label="3 Year" value={data.categoryAverage.return3y} border />
                                    <StatBox label="5 Year" value={data.categoryAverage.return5y} border />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benchmark Card */}
                        <Card className="bg-gradient-to-br from-slate-50/50 to-background dark:from-slate-900/10 dark:to-card border-slate-100 dark:border-slate-800">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                    Benchmark
                                </CardTitle>
                                {data.benchmark && <Badge variant="secondary" className="text-[10px] h-5">{data.benchmark.name}</Badge>}
                            </CardHeader>
                            <CardContent>
                                {data.benchmark ? (
                                    <div className="flex justify-between items-end pt-2">
                                        <StatBox label="1 Year" value={data.benchmark.return1y} />
                                        <StatBox label="3 Year" value={data.benchmark.return3y} border />
                                        <StatBox label="5 Year" value={data.benchmark.return5y} border />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[52px] text-sm text-muted-foreground italic">
                                        Benchmark data not available
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* --- Main Data Table --- */}
                <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4 w-[35%] min-w-[250px]">Scheme Name</th>
                                    <SortHeader label="1Y" field="return_1y" req={request} onClick={handleSort} />
                                    <SortHeader label="3Y" field="return_3y" req={request} onClick={handleSort} />
                                    <SortHeader label="5Y" field="return_5y" req={request} onClick={handleSort} />
                                    <SortHeader label="Inception" field="return_inception" req={request} onClick={handleSort} />
                                    <th className="px-6 py-4 text-center">Vol. (StdDev)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                                <span>Analyzing Funds...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : !data?.funds.length ? (
                                    <tr>
                                        <td colSpan={6} className="h-32 text-center text-muted-foreground">No funds found in this category.</td>
                                    </tr>
                                ) : (
                                    data.funds.map((fund) => (
                                        <tr key={fund.schemeCode} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors cursor-pointer">
                                                    {fund.schemeName}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">Code: {fund.schemeCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right"><ReturnCell value={fund.return1y} /></td>
                                            <td className="px-6 py-4 text-right bg-muted/20 font-medium"><ReturnCell value={fund.return3y} /></td>
                                            <td className="px-6 py-4 text-right"><ReturnCell value={fund.return5y} /></td>
                                            <td className="px-6 py-4 text-right"><ReturnCell value={fund.returnInception} /></td>
                                            <td className="px-6 py-4 text-center text-muted-foreground">
                                                {fund.stdDev ? fund.stdDev.toFixed(2) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Pagination Footer --- */}
                    {data && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/10">
                            <div className="text-xs text-muted-foreground">
                                Showing {Math.min((request.page * request.size) + 1, data.totalElements)} - {Math.min((request.page + 1) * request.size, data.totalElements)} of {data.totalElements}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="sm"
                                    disabled={request.page === 0}
                                    onClick={() => setRequest(p => ({ ...p, page: p.page - 1 }))}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-xs font-medium px-2">Page {request.page + 1} of {data.totalPages}</span>
                                <Button
                                    variant="outline" size="sm"
                                    disabled={request.page >= data.totalPages - 1}
                                    onClick={() => setRequest(p => ({ ...p, page: p.page + 1 }))}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </ToolPageLayout>
    );
}

// Sub-components for cleaner code
function StatBox({ label, value, border }: { label: string, value: number | undefined, border?: boolean }) {
    return (
        <div className={`text-center flex-1 ${border ? 'border-l border-border' : ''}`}>
            <p className="text-[10px] uppercase text-muted-foreground mb-1">{label}</p>
            <p className="text-lg font-bold tracking-tight">
                {value ? `${value.toFixed(2)}%` : '-'}
            </p>
        </div>
    );
}

interface SortHeaderProps {
    label: string;
    field: string;
    req: TopFundsRequest;
    onClick: (field: string) => void;
}

function SortHeader({ label, field, req, onClick }: SortHeaderProps) {
    const isActive = req.sortBy === field;
    return (
        <th
            className="px-6 py-4 text-right cursor-pointer hover:text-emerald-500 transition-colors select-none group"
            onClick={() => onClick(field)}
        >
            <div className="flex items-center justify-end gap-1">
                {label}
                <div className={`flex flex-col ${isActive ? 'text-emerald-500' : 'text-muted-foreground/30'}`}>
                    {isActive && req.sortDirection === 'ASC' ? <ArrowUp className="w-3 h-3" /> :
                        isActive && req.sortDirection === 'DESC' ? <ArrowDown className="w-3 h-3" /> :
                            <ArrowUpDown className="w-3 h-3" />}
                </div>
            </div>
        </th>
    );
}