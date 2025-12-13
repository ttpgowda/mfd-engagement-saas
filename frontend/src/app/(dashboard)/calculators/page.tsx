import { CALCULATORS } from "@/features/calculators/registry";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import {ClientPageTitle} from "@/components/utils/ClientPageTitle";

export default function CalculatorsIndex() {
    return (
        <div className="p-6">
            <ClientPageTitle title="Calculators" />
            <h1 className="text-3xl font-bold mb-6">Financial Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CALCULATORS.map((calc) => (
                    <Link href={`/calculators/${calc.id}`} key={calc.id}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <calc.icon className="h-8 w-8 text-primary" />
                                    <CardTitle>{calc.title}</CardTitle>
                                </div>
                                <CardDescription>{calc.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}