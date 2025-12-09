import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";

export function PublicShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        // Try native share API first (mobile friendly)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: url
                });
                return;
            } catch (err) {
                // User cancelled or not supported, fall back to copy
            }
        }

        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copied Link" : "Share Page"}
        </Button>
    );
}
