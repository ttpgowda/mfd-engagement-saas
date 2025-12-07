"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Plus, X, Info, Loader2, Check, Search, ArrowUpDown
} from 'lucide-react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
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
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // STATE RETENTION FIX: Keep the category state in the Parent
    const [lastCategory, setLastCategory] = useState<string>("");

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
            } catch (err: unknown) {
                console.error(err);
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "An unexpected error occurred.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIds]);

    const handleAddFund = (schemeCode: number) => {
        if (selectedIds.includes(schemeCode)) return;
        if (selectedIds.length >= 5) return; // Max 5

        const newIds = [...selectedIds, schemeCode];
        setSelectedIds(newIds);
        updateUrl(newIds);
        setIsSelectorOpen(false);
    };

    const handleRemoveFund = (schemeCode: number) => {
        const newIds = selectedIds.filter(id => id !== schemeCode);
        setSelectedIds(newIds);
        updateUrl(newIds);
    };

    const updateUrl = (ids: number[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (ids.length > 0) {
            params.set('schemes', ids.join(','));
        } else {
            params.delete('schemes');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ArrowUpDown className="w-6 h-6 text-emerald-500" />
                    Fund Comparison
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Compare up to 5 mutual funds side-by-side.
                </p>
            </div>

            <ErrorAlert message={error} />

            {/* Selection Bar */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-4 flex flex-wrap gap-3 items-center">
                    {data?.funds.map((f, i) => (
                        <Badge key={f.schemeCode} variant="secondary" className="pl-2 pr-1 py-1 h-8 text-sm border border-border bg-background hover:bg-muted flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="truncate max-w-[200px]" title={f.schemeName}>{f.schemeName}</span>
                            <button onClick={() => handleRemoveFund(f.schemeCode)} className="hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}

                    {selectedIds.length < 5 && (
                        <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-dashed border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-500">
                                    <Plus className="w-3 h-3 mr-1" /> Add Fund
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
                                <FundSelector
                                    onSelect={handleAddFund}
                                    currentlySelected={selectedIds}
                                    initialCategory={lastCategory}
                                    onCategoryChange={setLastCategory}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </CardContent>
            </Card>

            {/* Comparison Content */}
            {data && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Performance Chart */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase">Performance Comparison (3 Year Returns)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.funds} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="schemeName" tick={false} axisLine={false} />
                                    <YAxis tickFormatter={(val) => `${val}%`} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div className="bg-background border border-border p-2 rounded shadow-lg text-xs">
                                                        <p className="font-bold mb-1">{d.schemeName}</p>
                                                        <p>3Y Return: <span className="font-mono text-emerald-600">{d.return3y?.toFixed(2)}%</span></p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="return3y" radius={[4, 4, 0, 0]}>
                                        {data.funds.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detailed Table */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/30 text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-6 py-4 w-[200px]">Metric</th>
                                        {data.funds.map((f, i) => (
                                            <th key={f.schemeCode} className="px-6 py-4 min-w-[150px]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                    <span className="line-clamp-2" title={f.schemeName}>{f.schemeName}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    <tr className="hover:bg-muted/5">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">Category</td>
                                        {data.funds.map(f => <td key={f.schemeCode} className="px-6 py-3">{f.category}</td>)}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">1Y Return</td>
                                        {data.funds.map(f => <td key={f.schemeCode} className="px-6 py-3 font-mono text-emerald-600">{f.return1y?.toFixed(2)}%</td>)}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">3Y Return</td>
                                        {data.funds.map(f => <td key={f.schemeCode} className="px-6 py-3 font-mono text-emerald-600">{f.return3y?.toFixed(2)}%</td>)}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="px-6 py-3 font-medium text-muted-foreground">5Y Return</td>
                                        {data.funds.map(f => <td key={f.schemeCode} className="px-6 py-3 font-mono text-emerald-600">{f.return5y?.toFixed(2)}%</td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

// --- Sub-Component: Fund Selector ---
function FundSelector({
    onSelect, currentlySelected, initialCategory, onCategoryChange
}: {
    onSelect: (schemeCode: number) => void;
    currentlySelected: number[];
    initialCategory: string;
    onCategoryChange: (cat: string) => void;
}) {
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [funds, setFunds] = useState<FundRowDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Load Categories
    useEffect(() => {
        researchService.getCategories().then(cats => {
            setCategories(cats);
            if (!activeCategory && cats.length > 0) {
                const defaultCat = cats.includes("Equity") ? "Equity" : cats[0];
                setActiveCategory(defaultCat);
                onCategoryChange(defaultCat);
            }
        });
    }, []);

    // Load Funds when Category/Page changes
    useEffect(() => {
        if (!activeCategory) return;
        setLoading(true);
        researchService.getTopPerformingFunds({
            category: activeCategory,
            page: page,
            size: 10,
            sortBy: 'return_1y',
            sortDirection: 'DESC'
        }).then(res => {
            setFunds(res.funds);
            setTotalPages(res.totalPages);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory, page]);

    const handleCategoryChange = (val: string) => {
        setActiveCategory(val);
        onCategoryChange(val);
        setPage(0); // Reset to page 0 on category change
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
                            <span className="truncate text-left block w-full pr-2">
                                <SelectValue placeholder="Select Category" />
                            </span>
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
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