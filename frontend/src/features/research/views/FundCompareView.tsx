"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Plus, X, Info, Loader2
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogTrigger,
} from "@/components/ui/dialog";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { researchService, FundCompareResponse, FundRowDto } from '@/services/researchService';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export default function FundCompareView() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Data State
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [data, setData] = useState<FundCompareResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // UI State
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // STATE RETENTION FIX: Keep the category state in the Parent
    const [lastCategory, setLastCategory] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    // 1. Sync State with URL
    useEffect(() => {
        const schemesParam = searchParams.get('schemes');
        if (schemesParam) {
            const ids = schemesParam.split(',').map(Number).filter(n => !isNaN(n));
            setSelectedIds(ids);
        }
    }, [searchParams]);

    // 2. Fetch Comparison Data
    useEffect(() => {
        if (selectedIds.length === 0) {
            setData(null);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await researchService.getFundComparison({ schemeCodes: selectedIds });
                setData(res);

                // Optional: If we have data and no category is selected yet,
                // set it to the first fund's category to be helpful.
                // But we respect the user's manual selection if 'lastCategory' is already set.
                if (!lastCategory && res.funds.length > 0) {
                    setLastCategory(res.funds[0].category);
                }
            } catch (err) {
                console.error("Comparison fetch failed", err);
                const msg = err.response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedIds]); // Removed 'lastCategory' from dependency to avoid loops

    // 3. Handlers
    const addScheme = (id: number) => {
        if (selectedIds.includes(id)) return;
        if (selectedIds.length >= 5) {
            alert("You can compare up to 5 funds.");
            return;
        }
        const newIds = [...selectedIds, id];
        updateUrl(newIds);
        setIsSelectorOpen(false);
    };

    const removeScheme = (id: number) => {
        const newIds = selectedIds.filter(x => x !== id);
        updateUrl(newIds);
    };

    const updateUrl = (ids: number[]) => {
        const params = new URLSearchParams();
        if (ids.length > 0) params.set('schemes', ids.join(','));
        router.push(`?${params.toString()}`);
        setSelectedIds(ids);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        Fund Comparison
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Compare up to 5 mutual funds side-by-side.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md hover:shadow-lg transition-all">
                                <Plus className="w-4 h-4" /> Add Fund
                            </Button>
                        </DialogTrigger>
                        {/* We keep the content mounted or pass state to ensure retention.
                           Here we pass 'lastCategory' and 'setLastCategory'
                        */}
                        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-background">
                            <FundSelector
                                onSelect={addScheme}
                                currentlySelected={selectedIds}
                                activeCategory={lastCategory}
                                onCategoryChange={setLastCategory}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Active Filters */}
            {data?.funds && data.funds.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-muted/30 p-3 rounded-xl border border-border/50">

                    {/* Label: Full width on mobile, auto on desktop */}
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                        COMPARING ({data.funds.length}/5):
                    </span>

                    {/* Badges Container: Wraps nicely below label on mobile */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {data.funds.map(f => (
                            <Badge
                                key={f.schemeCode}
                                variant="secondary"
                                className="pl-2 pr-1 py-1 gap-2 bg-background border border-border hover:bg-background h-7"
                            >
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {f.schemeName}
                    </span>
                                <button
                                    onClick={() => removeScheme(f.schemeCode)}
                                    className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}

                        {data.funds.length < 5 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[11px] font-medium text-muted-foreground h-7 border border-dashed border-border hover:border-emerald-500 hover:text-emerald-600 px-2"
                                onClick={() => setIsSelectorOpen(true)}
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <ErrorAlert message={error} />
            {/* Main Content */}
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    <p>Fetching comparison data...</p>
                </div>
            ) : !data || data.funds.length === 0 ? (
                <EmptyState onAdd={() => setIsSelectorOpen(true)} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Table */}
                    <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                            <CardTitle className="text-lg">Performance Metrics</CardTitle>
                            <CardDescription>Data as of {data.dataAsOn}</CardDescription>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3 min-w-[180px]">Metric</th>
                                    {data.funds.map(f => (
                                        <th key={f.schemeCode} className="px-4 py-3 min-w-[140px] font-semibold text-foreground">
                                            <div className="line-clamp-2" title={f.schemeName}>{f.schemeName}</div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                <tr className="bg-muted/5"><td className="px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider" colSpan={data.funds.length + 1}>Basic Info</td></tr>
                                <DataRow label="Category" funds={data.funds} field="category" />
                                <DataRow label="Benchmark" funds={data.funds} field="benchmarkName" />
                                <DataRow label="Fund House" funds={data.funds} field="fundHouse" />

                                <tr className="bg-muted/5"><td className="px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider" colSpan={data.funds.length + 1}>Returns (%)</td></tr>
                                <DataRow label="1 Year" funds={data.funds} field="return1y" isReturn />
                                <DataRow label="3 Year" funds={data.funds} field="return3y" isReturn highlight />
                                <DataRow label="5 Year" funds={data.funds} field="return5y" isReturn />
                                <DataRow label="Inception" funds={data.funds} field="returnInception" isReturn />

                                <tr className="bg-muted/5"><td className="px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider" colSpan={data.funds.length + 1}>Risk Ratios</td></tr>
                                <DataRow label="Vol. (StdDev)" funds={data.funds} field="stdDev" formatter={(v: number) => v?.toFixed(2)} />
                                <DataRow label="Alpha (3Y)" funds={data.funds} field="alpha3y" formatter={(v: number) => v?.toFixed(2)} />
                                <DataRow label="Beta (3Y)" funds={data.funds} field="beta3y" formatter={(v: number) => v?.toFixed(2)} />
                                <DataRow label="Sharpe Ratio" funds={data.funds} field="sharpeRatio" formatter={(v: number) => v?.toFixed(2)} />
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Right: Charts */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium uppercase tracking-wide">3Y Return Comparison</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.funds} layout="vertical" margin={{ left: 0, right: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="schemeName" type="category" width={100} tick={{fontSize: 10}} hide />
                                        <Tooltip
                                            cursor={{fill: 'transparent'}}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-popover border border-border p-2 rounded shadow-lg text-xs">
                                                            <p className="font-bold mb-1">{d.schemeName}</p>
                                                            <p className="text-emerald-500 font-mono">{d.return3y?.toFixed(2)}%</p>
                                                        </div>
                                                    )
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="return3y" radius={[0, 4, 4, 0]} barSize={30}>
                                            {data.funds.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                            <CardContent className="p-4 flex gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                    <p className="font-semibold mb-1">Comparison Tip</p>
                                    Compare Alpha (Skill) vs Beta (Risk). Higher Alpha with lower Beta indicates a fund manager generating returns with better risk management.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Sub-Components ---

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <Card className="border-dashed border-2 border-border/60 bg-muted/10 h-64 flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-lg font-semibold mb-1">No Funds Selected</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Select funds to analyze their performance side-by-side.
            </p>
            <Button onClick={onAdd} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Select Funds
            </Button>
        </Card>
    );
}

function DataRow({ label, funds, field, isReturn, highlight, formatter }: any) {
    return (
        <tr className={highlight ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "hover:bg-muted/20"}>
            <td className="px-4 py-3 font-medium text-muted-foreground">{label}</td>
            {funds.map((f: any) => {
                const val = f[field];
                return (
                    <td key={f.schemeCode} className="px-4 py-3">
                        {isReturn ? (
                            <span className={`font-mono font-medium ${val >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                {val !== null ? `${val.toFixed(2)}%` : '-'}
                            </span>
                        ) : (
                            <span className="text-foreground">
                                {formatter ? formatter(val) : val || '-'}
                            </span>
                        )}
                    </td>
                );
            })}
        </tr>
    );
}

// --- UPDATED FUND SELECTOR ---
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check } from 'lucide-react';

interface FundSelectorProps {
    onSelect: (id: number) => void;
    currentlySelected: number[];
    activeCategory: string; // Controlled by parent
    onCategoryChange: (c: string) => void; // Update parent
}

function FundSelector({ onSelect, currentlySelected, activeCategory, onCategoryChange }: FundSelectorProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [funds, setFunds] = useState<FundRowDto[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Initial Load of Categories
    useEffect(() => {
        researchService.getCategories().then(cats => {
            setCategories(cats);

            // Only set default if parent hasn't set one yet
            if (!activeCategory && cats.length > 0) {
                const defaultCat = cats.includes("Equity") ? "Equity" : cats[0];
                onCategoryChange(defaultCat);
            }
        });
    }, []); // Run once on mount

    // 2. Fetch Funds when Category (from props) or Page changes
    useEffect(() => {
        if (!activeCategory) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await researchService.getTopPerformingFunds({
                    category: activeCategory,
                    page,
                    size: 10,
                    sortBy: 'return_3y',
                    sortDirection: 'DESC'
                });
                setFunds(res.funds);
                setTotalPages(res.totalPages);
            } catch (err) {
                console.error(err);
                const msg = err.response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [activeCategory, page]);

    // Handle Category Switch
    const handleCategoryChange = (val: string) => {
        onCategoryChange(val); // Update parent state
        setPage(0); // Reset local pagination
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <DialogHeader className="px-6 py-4 border-b border-border flex-none">
                <DialogTitle>Select Fund to Compare</DialogTitle>
            </DialogHeader>

            {/* Filter Bar */}
            <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row gap-4 flex-none items-center">

                {/* Category Select - Fixed Truncation */}
                <div className="w-full sm:w-[250px] min-w-0">
                    <Select value={activeCategory} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="bg-background border-input/60 shadow-sm w-full">
                            {/* TRUNCATION FIX:
                    The span + truncate ensures text doesn't overflow on mobile
                */}
                            <span className="truncate text-left block w-full pr-2">
                    <SelectValue placeholder="Select Category" />
                </span>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Input - Improved Alignment */}
                {/*<div className="flex-1 w-full relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search funds..."
                        disabled
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input/60 bg-background text-sm text-muted-foreground placeholder:text-muted-foreground/50 opacity-60 cursor-not-allowed shadow-sm focus:outline-none"
                    />
                </div>*/}
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-0 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
                    </div>
                ) : null}

                <table className="w-full text-sm text-left">
                    <thead className="bg-muted sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-6 py-3 font-semibold text-muted-foreground bg-muted">Scheme Name</th>
                        <th className="px-4 py-3 text-right font-semibold text-muted-foreground bg-muted">3Y Return</th>
                        <th className="px-4 py-3 text-center font-semibold text-muted-foreground bg-muted">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                    {funds.map(f => {
                        const isSelected = currentlySelected.includes(f.schemeCode);
                        return (
                            <tr key={f.schemeCode} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-3 font-medium text-foreground">
                                    {f.schemeName}
                                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{activeCategory}</div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                    {f.return3y?.toFixed(2)}%
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Button
                                        size="sm"
                                        variant={isSelected ? "secondary" : "outline"}
                                        disabled={isSelected}
                                        onClick={() => onSelect(f.schemeCode)}
                                        className={`h-8 w-24 ${isSelected ? '' : 'hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`}
                                    >
                                        {isSelected ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                        {isSelected ? "Added" : "Add"}
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-border flex justify-between items-center bg-muted/10 flex-none">
                <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
            </div>
        </div>
    );
}