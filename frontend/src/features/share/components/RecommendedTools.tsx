import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useSearchParams } from "next/navigation";
import { CALCULATOR_META } from "@/features/calculators/metadata";
import { RESEARCH_TOOL_META } from "@/features/research/metadata";
import { useEffect, useState } from "react";

interface RecommendedToolsProps {
    currentToolSlug: string;
    currentShortCode?: string;
    onRecommendationClick?: (toolSlug: string) => void;
}

// Helper to get random items
const getRandomItems = <T extends { id: string }>(items: T[], count: number, excludeId: string) => {
    return items
        .filter(item => item.id !== excludeId)
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
};

export function RecommendedTools({ currentToolSlug, currentShortCode, onRecommendationClick }: RecommendedToolsProps) {
    const params = useParams();
    const searchParams = useSearchParams();
    const shortCode = currentShortCode || (params?.id as string);

    // We use state to ensure hydration match (randomness needs to be consistent after mount)
    const [calculators, setCalculators] = useState<typeof CALCULATOR_META>([]);
    const [researchTools, setResearchTools] = useState<typeof RESEARCH_TOOL_META>([]);

    useEffect(() => {
        setCalculators(getRandomItems(CALCULATOR_META, 3, currentToolSlug));
        setResearchTools(getRandomItems(RESEARCH_TOOL_META, 3, currentToolSlug));
    }, [currentToolSlug]);

    const renderToolCard = (tool: { id: string, title: string, description: string, icon: any }) => {
        let refParam = shortCode;
        if (shortCode === 'demo') {
            const parentRef = searchParams.get('ref');
            // If current page is demo, try to preserve the original parent ref
            if (parentRef && parentRef !== 'demo' && parentRef !== 'demo_internal') {
                refParam = parentRef;
            } else {
                refParam = 'demo_internal';
            }
        }

        return (
            <Link
                key={tool.id}
                href={`/share/${tool.id}/demo?utm_source=recommendation&utm_medium=internal&ref=${refParam}`}
                onClick={() => onRecommendationClick?.(tool.id)}
                className="block"
            >
                <div className="group flex items-start gap-4 p-4 rounded-lg border bg-card hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer h-full">
                    <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="font-medium leading-none group-hover:text-primary transition-colors">{tool.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
            </Link>
        );
    };

    if (calculators.length === 0 && researchTools.length === 0) {
        return null; // Don't render empty state
    }

    return (
        <div className="space-y-6 mt-8">
            <Card className="border-dashed border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Top Calculators
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {calculators.map(renderToolCard)}
                </CardContent>
            </Card>

            <Card className="border-dashed border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Research Tools
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {researchTools.map(renderToolCard)}
                </CardContent>
            </Card>
        </div>
    );
}
