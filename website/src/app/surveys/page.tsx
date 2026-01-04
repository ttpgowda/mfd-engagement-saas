import { surveys } from "@/lib/surveys-registry";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/base";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Financial Surveys & Assessments - WealthWeb',
    description: 'Assess your risk profile, financial health, and investment readiness with our expert surveys.',
};

export default function SurveysIndexPage() {
    // Group surveys by category
    const categories = Array.from(new Set(surveys.map(t => t.category)));

    return (
        <div className="container py-10 mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-gray-100">Financial Assessments</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Discover your investment personality and financial health with our interactive surveys.
                </p>
            </div>

            <div className="space-y-12">
                {categories.map((category) => (
                    <div key={category}>
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200 border-b dark:border-gray-800 pb-2">
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {surveys.filter(t => t.category === category).map((survey) => {
                                const Icon = survey.icon;
                                return (
                                    <Link key={survey.slug} href={`/surveys/${survey.slug}`} className="block h-full group transition-all duration-200 hover:-translate-y-1">
                                        <Card className="h-full border-gray-200 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
                                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {survey.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                                    {survey.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
