'use client';

import { RESEARCH_TOOLS } from "@/features/research/registry";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";

export default function ResearchIndex() {
    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <ClientPageTitle title="Research Tools" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Research Tools</h1>
                    <p className="text-muted-foreground mt-1">Advanced analytics and calculators for mutual fund analysis.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESEARCH_TOOLS.map((tool) => (
                    <Link href={`/research/${tool.id}`} key={tool.id}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                        <tool.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">{tool.title}</CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
