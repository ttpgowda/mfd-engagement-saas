'use client';

import { RESEARCH_TOOLS } from "@/features/research/registry";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";

export default function ResearchIndex() {
    return (
        <div className="p-6">
            <ClientPageTitle title="Research Tools" />
            <h1 className="text-3xl font-bold mb-6">Mutual Fund Research Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RESEARCH_TOOLS.map((tool) => (
                    <Link href={`/research/${tool.id}`} key={tool.id}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer h-full backdrop-blur-md bg-white/80 dark:bg-black/80">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <tool.icon className="h-8 w-8" />
                                    </div>
                                    <CardTitle>{tool.title}</CardTitle>
                                </div>
                                <CardDescription>{tool.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
