import { notFound } from "next/navigation";
import { getResearchTool, RESEARCH_TOOLS } from "@/features/research/registry";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { shuffleArray } from "@/utils/array";

interface PageProps {
    params: Promise<{
        tool: string;
    }>;
}

import { ClientPageTitle } from "@/components/utils/ClientPageTitle";

// ... previous imports

export default async function ResearchToolPage(props: PageProps) {
    const params = await props.params;
    const tool = getResearchTool(params.tool);

    if (!tool) {
        return notFound();
    }

    const ActiveComponent = tool.component;

    const availableCalculators = RESEARCH_TOOLS.filter(c => c.id !== params.tool);
    const shuffledCalculators = shuffleArray(availableCalculators);
    const otherTools = shuffledCalculators.slice(0, 6);

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title={tool.title} />
            {/* 1. Header */}
            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <tool.icon className="h-6 w-6" />
                        </div>
                        {tool.title}
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">{tool.description}</p>
                </div>
            </div>

            {/* 2. Main Tool UI */}
            <ActiveComponent />

            {/* 3. Recommended Tools Section */}
            <div className="pt-12 mt-12 border-t border-border/40">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    Explore Other Research Tools
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {otherTools.map((t) => (
                        <Link href={`/research/${t.id}`} key={t.id} className="group">
                            <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 cursor-pointer bg-muted/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-2 bg-background rounded-md shadow-sm group-hover:text-primary transition-colors">
                                            <t.icon className="h-5 w-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                    <CardTitle className="text-base">{t.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs">
                                        {t.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
