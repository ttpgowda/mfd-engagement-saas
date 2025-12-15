
import React, { useEffect, useState } from 'react';
import { adminAnalyticsService } from '@/services/adminAnalyticsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitCommit, ArrowRight, Loader2 } from "lucide-react";

interface PatternData {
    sourceTool: string;
    targetTool: string;
    count: number;
}

export function UserJourneyPatterns() {
    const [patterns, setPatterns] = useState<PatternData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const data = await adminAnalyticsService.getPatterns();
                setPatterns(data);
            } catch (error) {
                console.error("Failed to fetch patterns", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatterns();
    }, []);

    // Grouping patterns by sourceTool
    const groupedPatterns = patterns.reduce((acc, curr) => {
        if (!acc[curr.sourceTool]) {
            acc[curr.sourceTool] = [];
        }
        acc[curr.sourceTool].push(curr);
        return acc;
    }, {} as Record<string, PatternData[]>);

    if (loading) {
        return (
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitCommit className="h-5 w-5 text-primary" />
                        User Journey Patterns
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 md:col-span-2 shadow-sm border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <GitCommit className="h-5 w-5 text-primary" />
                            User Journey Patterns
                        </CardTitle>
                        <CardDescription>
                            Navigation paths from source calculators.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {Object.keys(groupedPatterns).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No patterns detected yet.
                    </div>
                ) : (
                    <div className="relative w-full overflow-hidden min-h-[200px]">
                        <div className="flex items-start -space-x-12 overflow-x-auto pb-8 pt-4 px-4 no-scrollbar hover:space-x-6 transition-all duration-500 ease-out">
                            {Object.entries(groupedPatterns).map(([source, paths], i) => (
                                <div key={i}
                                    className="relative shrink-0 w-[320px] border border-border/60 rounded-xl p-5 bg-background/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/40 hover:-translate-y-2 hover:z-30"
                                    style={{ zIndex: Object.keys(groupedPatterns).length - i }}
                                >
                                    <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary shadow-inner">
                                                {i + 1}
                                            </div>
                                            <div className="font-bold text-base capitalize text-foreground/90">
                                                {source.replace(/-/g, ' ')}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded-full">
                                            {paths.reduce((s, p) => s + p.count, 0)} users
                                        </div>
                                    </div>

                                    <div className="group flex flex-col gap-2 pl-2">
                                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Navigated To</div>
                                        <div className="flex items-center -space-x-3 overflow-x-auto pb-2 no-scrollbar hover:space-x-2 transition-all duration-500 ease-out">
                                            {paths.map((pattern, j) => (
                                                <div key={j}
                                                    className="relative shrink-0 flex items-center gap-2 text-xs bg-background/95 backdrop-blur-sm border border-border/80 shadow-sm px-3 py-1.5 rounded-lg hover:shadow-md hover:border-primary/50 hover:bg-primary/5 hover:scale-105 hover:z-20 transition-all duration-300 cursor-default"
                                                    style={{ zIndex: paths.length - j }}
                                                >
                                                    <ArrowRight className="w-3 h-3 text-muted-foreground/70" />
                                                    <span className="capitalize text-foreground font-medium whitespace-nowrap">
                                                        {pattern.targetTool.replace(/-/g, ' ')}
                                                    </span>
                                                    <div className="ml-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary/10 px-1 text-[9px] font-bold text-primary">
                                                        {pattern.count}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
