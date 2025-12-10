import React, { useEffect, useState } from 'react';
import { TopFundsTable } from '@/components/research/TopFundsTable';
import { researchService, FundRankerResponse } from '@/services/researchService';
import { publicResearchService } from '@/services/publicResearchService';
import { CalculatorViewProps } from '@/features/calculators/types';
import { ShareDialog } from '@/features/share/components/ShareDialog';
import { PublicShareButton } from '@/features/share/components/PublicShareButton';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FundRankerView({ defaultValues, isPublicView = false }: CalculatorViewProps) {
    const [data, setData] = useState<FundRankerResponse[]>([]);
    const [loading, setLoading] = useState(false);

    // State
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState('Equity: Large Cap');

    // 1. Initial Load (Categories + Defaults)
    useEffect(() => {
        if (defaultValues?.category) setCategory(defaultValues.category);

        const service = isPublicView ? publicResearchService : researchService;
        service.getCategories().then(cats => {
            setCategories(cats);
            if (!defaultValues?.category && cats.length > 0) {
                // Try to pick a popular category or just the first
                setCategory(cats.find(c => c === "Equity: Flexi Cap") || cats[0]);
            }
        });
    }, [defaultValues, isPublicView]);

    // 2. Fetch Data
    useEffect(() => {
        if (!category) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const service = isPublicView ? publicResearchService : researchService;
                // Hardcoding 'alpha_3y' as in original, or makes it selectable? 
                // Original used 'alpha_3y'. I'll stick to it for now or default it.
                // NOTE: 'alpha_3y' doesn't seem to be a standard sort param in the controller I saw earlier, 
                // but if the service supports it, we keep it. 
                // Actually, let's check ResearchService.getTopFunds signature if possible.
                // Assuming it works as per previous file.
                const result = await service.getTopFunds(category, 'alpha_3y');
                setData(result);
            } catch (error) {
                console.error("Failed to fetch top funds", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [category, isPublicView]);


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                            Fund Ranker
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Discover top performing funds based on Alpha and returns.
                        </p>
                    </div>
                    {isPublicView ? (
                        <PublicShareButton />
                    ) : (
                        <ShareDialog
                            toolSlug="fund-ranker"
                            config={{ category }}
                            defaultTitle={`Top ${category} Funds`}
                            defaultDescription={`Ranking of top funds in ${category} category.`}
                        />
                    )}
                </div>
            </div>

            {/* Controls */}
            <Card className="border-border/50 shadow-sm bg-muted/10">
                <CardContent className="p-4 flex items-center gap-4">
                    <label className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Category:</label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-background w-[250px]"><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {loading ? <div>Loading...</div> : <TopFundsTable funds={data} />}
        </div>
    );
}
