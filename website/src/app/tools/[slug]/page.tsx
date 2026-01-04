import { getToolBySlug, tools } from "@/lib/tools-registry";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { CalculatorRecommendations } from "@/components/calculators/CalculatorRecommendations";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for each tool
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tool = getToolBySlug(slug);

    if (!tool) {
        return {
            title: 'Tool Not Found',
        };
    }

    return {
        title: `${tool.title} - WealthWeb Tools`,
        description: tool.description,
    };
}

// Generate static params for all tools at build time
export async function generateStaticParams() {
    return tools.map((tool) => ({
        slug: tool.slug,
    }));
}

export default async function ToolPage({ params }: PageProps) {
    const { slug } = await params;
    const tool = getToolBySlug(slug);

    if (!tool) {
        notFound();
    }

    const Component = tool.component;

    return (
        <div className="container py-8 mx-auto px-4 max-w-7xl">
            {/* 
        We don't need to render the title/description here again because 
        each Calculator Component (e.g. SipCalculator) already renders 
        a ToolPageLayout or Card structure with its own header.
        However, if we want a unified breadcrumb or back button, we can add it here.
      */}

            <div className="mb-6">
                <a href="/tools" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    ← Back to All Tools
                </a>
            </div>

            <Component isPublicView={true} />

            <div className="mt-16 border-t pt-8">
                <CalculatorRecommendations currentToolSlug={slug} category={tool.category} />
            </div>
        </div>
    );
}
