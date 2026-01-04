"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/base";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { tools } from "@/lib/tools-registry";

interface CalculatorRecommendationsProps {
    currentToolSlug: string;
    category: 'Investment' | 'Planning' | 'Analysis';
}

export function CalculatorRecommendations({ currentToolSlug, category }: CalculatorRecommendationsProps) {
    // Get other tools in the same category
    const relatedTools = tools
        .filter((t) => t.category === category && t.slug !== currentToolSlug)
        .slice(0, 3);

    return (
        <div className="space-y-8 mt-12 pb-8">


            {/* 2. Related Tools */}
            {relatedTools.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">More {category} Tools</h3>
                        <Link href="/tools" className="text-indigo-600 font-medium hover:text-indigo-700 text-sm flex items-center gap-1">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group h-full block">
                                    <Card className="h-full hover:shadow-md transition-all duration-200 border-gray-200 hover:border-indigo-200">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <CardTitle className="text-base">{tool.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {tool.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
