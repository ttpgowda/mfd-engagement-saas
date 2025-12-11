import React, { useEffect, useState } from 'react';
import { AnnualPerformanceMatrix } from '@/components/research/AnnualPerformanceMatrix';
import { researchService, AnnualReturn, SchemeDropdownDto } from '@/services/researchService';
import { publicResearchService } from '@/services/publicResearchService';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { CalculatorViewProps } from '@/features/calculators/types';
import { ShareDialog } from '@/features/share/components/ShareDialog';
import { PublicShareButton } from '@/features/share/components/PublicShareButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Calendar, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export default function AnnualReturnsView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState("");
    const [schemes, setSchemes] = useState<SchemeDropdownDto[]>([]);

    const [selectedScheme, setSelectedScheme] = useState<SchemeDropdownDto | null>(null);
    const [data, setData] = useState<AnnualReturn[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comboOpen, setComboOpen] = useState(false);

    // 1. Initial Load (Defaults + Categories)
    useEffect(() => {
        if (defaultValues?.category) setCategory(defaultValues.category);

        const service = isPublicView ? publicResearchService : researchService;
        service.getCategories().then(cats => {
            setCategories(cats);
            if (!defaultValues?.category && cats.length > 0) {
                setCategory(cats.includes("Equity") ? "Equity" : cats[0]);
            }
        });
    }, [defaultValues, isPublicView]);

    // 2. Load Schemes and Restore Selection
    useEffect(() => {
        if (!category) return;
        const service = isPublicView ? publicResearchService : researchService;
        service.getSchemesByCategory(category).then(list => {
            setSchemes(list);
            if (defaultValues?.schemeCode) {
                const match = list.find(s => s.schemeCode === defaultValues.schemeCode);
                if (match) setSelectedScheme(match);
            }
        });
    }, [category, isPublicView, defaultValues]);

    // 3. Fetch Data when Scheme Changes
    useEffect(() => {
        if (!selectedScheme) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const service = isPublicView ? publicResearchService : researchService;
                const result = await service.getAnnualReturns(selectedScheme.schemeCode);
                setData(result);
            } catch (err) {
                console.error(err);
                const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch annual returns.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedScheme, isPublicView]);


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-emerald-500" />
                            Annual Returns Matrix
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Year-wise performance breakdown of mutual fund schemes.
                        </p>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="annual-returns"
                            config={{
                                category,
                                schemeCode: selectedScheme?.schemeCode
                            }}
                            defaultTitle="Annual Returns Analysis"
                            defaultDescription={`Yearly performance review for ${selectedScheme?.schemeName || 'selected fund'}.`}
                        />
                    )}
                </div>
            </div>

            {/* Controls */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                    <CardTitle className="text-base text-blue-600">Fund Selection</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Category</label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase">Scheme</label>
                            <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between bg-background font-normal text-muted-foreground">
                                        <span className="truncate">{selectedScheme ? selectedScheme.schemeName : "Select Fund..."}</span>
                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search fund..." />
                                        <CommandEmpty>No fund found.</CommandEmpty>
                                        <CommandGroup className="max-h-[250px] overflow-auto">
                                            {schemes.map((s) => (
                                                <CommandItem
                                                    key={s.schemeCode}
                                                    value={s.schemeName}
                                                    onSelect={() => {
                                                        setSelectedScheme(s);
                                                        setComboOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedScheme?.schemeCode === s.schemeCode ? "opacity-100" : "opacity-0")} />
                                                    <span className="truncate">{s.schemeName}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ErrorAlert message={error} />

            {loading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">LOADING...</div>
            ) : (
                data && data.length > 0 && <AnnualPerformanceMatrix data={data} />
            )}
        </div>
    );
}
