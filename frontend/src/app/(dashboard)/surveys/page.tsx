"use client";

import { SURVEY_TOOLS } from "@/features/surveys/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";

export default function SurveysPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title="Surveys" />

            <div className="pb-6 border-b border-border/40">
                <h1 className="text-3xl font-bold">Surveys & Assessments</h1>
                <p className="text-muted-foreground mt-1">
                    Engage your clients with interactive financial assessments.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SURVEY_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Card key={tool.id} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary/80">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{tool.title}</CardTitle>
                                <CardDescription className="min-h-[40px]">{tool.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/surveys/${tool.id}`}>
                                    <Button className="w-full group">
                                        Open Tool
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
