import { getSurveyBySlug, surveys } from "@/lib/surveys-registry";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for each survey
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const survey = getSurveyBySlug(slug);

    if (!survey) {
        return {
            title: 'Survey Not Found',
        };
    }

    return {
        title: `${survey.title} - WealthWeb Assessments`,
        description: survey.description,
    };
}

// Generate static params for all surveys at build time
export async function generateStaticParams() {
    return surveys.map((survey) => ({
        slug: survey.slug,
    }));
}

export default async function SurveyPage({ params }: PageProps) {
    const { slug } = await params;
    const survey = getSurveyBySlug(slug);

    if (!survey) {
        notFound();
    }

    const Component = survey.component;

    return (
        <div className="container py-8 mx-auto px-4 max-w-7xl">
            <div className="mb-6">
                <a href="/surveys" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    ← Back to All Assessments
                </a>
            </div>

            <Component />
        </div>
    );
}
