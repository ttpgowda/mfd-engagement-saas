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
            <ActiveComponent />
        </div>
    );
}
