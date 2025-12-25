import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Sparkles } from "lucide-react";
import { ShareDialog } from "./ShareDialog";

interface SharePromotionCardProps {
    toolSlug: string;
    config: Record<any, any>;
    defaultTitle?: string;
    defaultDescription?: string;
}

export function SharePromotionCard({ toolSlug, config, defaultTitle, defaultDescription }: SharePromotionCardProps) {
    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border-indigo-100 dark:border-indigo-900 shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                Pro Feature
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
                                Generate Leads with this Tool
                            </h3>
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                                Don&apos;t just share a screenshot. Create a <strong>Smart Link</strong> for this calculator and share it on any social platform — WhatsApp, Facebook, Instagram, X, or forums. When someone uses it prompts interested users to share their contact details, helping you capture leads.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Track Views
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Capture Name & Phone
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                Get Notified
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <ShareDialog
                            toolSlug={toolSlug}
                            config={config}
                            defaultTitle={defaultTitle}
                            defaultDescription={defaultDescription}
                            trigger={
                                <Button size="lg" className="h-14 px-8 text-lg gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 rounded-xl transition-all hover:scale-105 active:scale-95">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="font-semibold">Create Smart Link</div>
                                        <div className="text-xs font-normal opacity-90">Start capturing leads</div>
                                    </div>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
