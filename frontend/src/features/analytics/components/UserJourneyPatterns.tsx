
import React, { useEffect, useState } from 'react';
import { adminAnalyticsService } from '@/services/adminAnalyticsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitCommit, ArrowRight, Loader2 } from "lucide-react";
import axios from '@/lib/axios';

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
                    <div className="space-y-4">
                        {Object.entries(groupedPatterns).map(([source, paths], i) => (
                            <div key={i} className="border rounded-lg p-3 bg-background/50 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {i + 1}
                                        </div>
                                        <div className="font-semibold text-sm capitalize text-foreground">
                                            {source.replace(/-/g, ' ')}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {paths.reduce((s, p) => s + p.count, 0)} users
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pl-8">
                                    {paths.map((pattern, j) => (
                                        <div key={j} className="inline-flex items-center gap-1.5 text-xs bg-muted/50 border border-border px-2 py-1 rounded-md hover:border-primary/30 transition-colors">
                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                            <span className="capitalize text-foreground/80 font-medium">
                                                {pattern.targetTool.replace(/-/g, ' ')}
                                            </span>
                                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                                {pattern.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
