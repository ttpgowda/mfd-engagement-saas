import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check, Loader2, MessageCircle } from "lucide-react";
import axios from "@/lib/axios";

interface ShareDialogProps {
    toolSlug: string;
    config: Record<string, any>;
}

export function ShareDialog({ toolSlug, config }: ShareDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

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
                title,
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

    const shareOnWhatsApp = () => {
        if (generatedLink) {
            const text = encodeURIComponent(`${title || 'Check out this calculation'}: ${generatedLink}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset on close
            setGeneratedLink(null);
            setTitle("");
            setDescription("");
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
            </Button>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{generatedLink ? "Ready to Share!" : "Create Shared Link"}</DialogTitle>
                    <DialogDescription>
                        {generatedLink
                            ? "Your link has been generated. Share it directly or copy it."
                            : "Provide a title to track this link later."}
                    </DialogDescription>
                </DialogHeader>

                {!generatedLink ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input placeholder="e.g. Client Meeting Proposal" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Input placeholder="Notes for this scenario..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Input
                                readOnly
                                value={generatedLink}
                                className="bg-muted"
                            />
                            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white" onClick={shareOnWhatsApp}>
                                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                            </Button>
                            <Button variant="outline" className="w-full" onClick={copyToClipboard}>
                                <Copy className="w-4 h-4 mr-2" /> Copy Link
                            </Button>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-end">
                    {!generatedLink && (
                        <Button onClick={handleGenerate} disabled={loading || !title.trim()}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? "Generating..." : "Generate Link"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
