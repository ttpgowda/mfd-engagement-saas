import { notFound } from "next/navigation";
import { getCalculator, CALCULATORS } from "@/features/calculators/registry"; // Import the full list
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface PageProps {
    params: Promise<{
        type: string;
    }>;
}

export default async function CalculatorPage(props: PageProps) {
    const params = await props.params;
    const calculator = getCalculator(params.type);

    if (!calculator) {
        return notFound();
    }

    const ActiveComponent = calculator.component;

    // Filter out the current calculator to find recommendations
    const relatedCalculators = CALCULATORS.filter(c => c.id !== params.type).slice(0, 6);

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            {/* 1. Header */}
            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <calculator.icon className="h-6 w-6" />
                        </div>
                        {calculator.title}
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">{calculator.description}</p>
                </div>
            </div>

            {/* 2. Main Calculator UI */}
            <ActiveComponent />

            {/* 3. Recommended Tools Section */}
            <div className="pt-12 mt-12 border-t border-border/40">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    Explore Other Tools
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedCalculators.map((calc) => (
                        <Link href={`/calculators/${calc.id}`} key={calc.id} className="group">
                            <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 cursor-pointer bg-muted/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-2 bg-background rounded-md shadow-sm group-hover:text-primary transition-colors">
                                            <calc.icon className="h-5 w-5" />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                    <CardTitle className="text-base">{calc.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-xs">
                                        {calc.description}
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