"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check, Loader2, MessageCircle, Facebook, Linkedin, Send, Twitter } from "lucide-react";
import axios from "@/lib/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareDialogProps {
    toolSlug: string;
    config: Record<string, any>;
    defaultTitle?: string;
    defaultDescription?: string;
    trigger?: React.ReactNode;
}

export function ShareDialog({ toolSlug, config, defaultTitle = "", defaultDescription = "", trigger }: ShareDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Public Share Message States (What the client sees)
    const [shareTitle, setShareTitle] = useState(defaultTitle);
    const [shareMessage, setShareMessage] = useState(defaultDescription);

    // UI States
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedLink(null);
        try {
            // Fix: remove /api prefix since axios instance already has it
            const response = await axios.post('/links', {
                toolSlug,
                config,
                title: title || shareTitle, // Fallback to share title if internal name is empty
                description
            });

            const origin = window.location.origin;
            const shortCode = response.data.shortCode;
            const link = `${origin}/share/${toolSlug}/${shortCode}`;

            setGeneratedLink(link);
        } catch (error) {
            console.error("Failed to generate link", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getShareMessage = () => {
        return `*${shareTitle}*\n${shareMessage ? `${shareMessage}\n` : ''}${generatedLink}`;
    }

    const shareOnWhatsApp = () => {
        if (generatedLink) {
            const text = encodeURIComponent(getShareMessage());
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    const shareOnFacebook = () => {
        if (generatedLink) {
            // Facebook mainly uses the OG tags from the URL, but we can try passing quote
            const quote = encodeURIComponent(`${shareTitle}\n${shareMessage}`);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedLink)}&quote=${quote}`, '_blank');
        }
    }

    const shareOnX = () => {
        if (generatedLink) {
            const text = encodeURIComponent(`${shareTitle}\n${shareMessage}`);
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(generatedLink)}&text=${text}`, '_blank');
        }
    }

    const shareOnLinkedIn = () => {
        if (generatedLink) {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generatedLink)}`, '_blank');
        }
    }

    const shareOnTelegram = () => {
        if (generatedLink) {
            const text = encodeURIComponent(`${shareTitle}\n${shareMessage}`);
            window.open(`https://t.me/share/url?url=${encodeURIComponent(generatedLink)}&text=${text}`, '_blank');
        }
    }

    const shareNative = async () => {
        if (generatedLink && navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareMessage,
                    url: generatedLink
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback
            copyToClipboard();
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setGeneratedLink(null);
            setTitle("");
            setDescription("");
            setShareTitle(defaultTitle);
            setShareMessage(defaultDescription);
        } else {
            // Reset to defaults on open if empty
            if (!shareTitle) setShareTitle(defaultTitle);
            if (!shareMessage) setShareMessage(defaultDescription);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger ? (
                <div onClick={() => handleOpenChange(true)} className="inline-block cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <Button
                    onClick={() => handleOpenChange(true)}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-0.5 rounded-full px-6"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share Link</span>
                    <span className="sm:hidden">Share</span>
                </Button>
            )}
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Share2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Share & Capture Leads</DialogTitle>
                            <DialogDescription className="text-indigo-600/80 dark:text-indigo-400 font-medium">
                                Create a smart link to track interest
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!generatedLink ? (
                    <div className="space-y-6 py-2">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-foreground">1. Internal Tracking</h4>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-muted-foreground">For Your Dashboard</span>
                            </div>
                            <div className="space-y-3 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Link Name (Who are you sharing with?)</Label>
                                    <Input
                                        placeholder="e.g. WhatsApp Group A, Client John..."
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Notes (Optional)</Label>
                                    <Input
                                        placeholder="e.g. Sent after meeting..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-foreground">2. Message Preview</h4>
                                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Client Sees This</span>
                            </div>
                            <div className="space-y-3 pl-2 border-l-2 border-indigo-100 dark:border-indigo-900">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Message Title <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={shareTitle}
                                        onChange={e => setShareTitle(e.target.value)}
                                        className="h-9 font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-muted-foreground">Message Body</Label>
                                    <Input
                                        value={shareMessage}
                                        onChange={e => setShareMessage(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="mt-2 p-3 bg-muted/50 rounded-lg text-xs italic text-muted-foreground">
                                    Preview: <strong>{shareTitle}</strong> - {shareMessage} [Link]
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Link Ready!</h3>
                            <p className="text-sm text-muted-foreground max-w-[90%] mx-auto">
                                Share this message with your clients on any platform.
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 p-1 bg-muted rounded-lg border">
                            <Input
                                readOnly
                                value={generatedLink}
                                className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm font-mono"
                            />
                            <Button size="icon" variant="ghost" onClick={copyToClipboard} className="shrink-0 hover:bg-background">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                onClick={shareOnWhatsApp}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" /> Share on WhatsApp
                            </Button>

                            <div className="grid grid-cols-5 gap-2">
                                <Button variant="outline" size="icon" className="w-full hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/5" onClick={shareOnFacebook} title="Facebook">
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-full hover:text-black hover:border-black hover:bg-black/5 dark:hover:text-white dark:hover:border-white dark:hover:bg-white/5" onClick={shareOnX} title="X (Twitter)">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-full hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/5" onClick={shareOnLinkedIn} title="LinkedIn">
                                    <Linkedin className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-full hover:text-[#26A5E4] hover:border-[#26A5E4] hover:bg-[#26A5E4]/5" onClick={shareOnTelegram} title="Telegram">
                                    <Send className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="w-full hover:bg-muted" onClick={shareNative} title="More Options">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-end gap-2 pt-2">
                    {!generatedLink && (
                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !shareTitle.trim()} // Require share title at minimum
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? "Generating..." : "Generate Smart Link"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
