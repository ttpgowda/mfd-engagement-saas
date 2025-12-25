import { ShareDialog } from "@/features/share/components/ShareDialog";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";
import { SharePromotionCard } from "@/features/share/components/SharePromotionCard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ToolPageLayoutProps {
    /**
     * The slug of the tool, used for generating share links.
     */
    toolSlug: string;
    /**
     * The dynamic configuration of the tool (e.g., input values) to include in the share link.
     */
    config: Record<string, any>;
    title: string;
    description: string;
    defaultShareTitle?: string;
    defaultShareDescription?: string;
    isPublicView?: boolean;
    children: React.ReactNode;
}

/**
 * reliable layout wrapper for all calculator/tool pages.
 * Handles the logic for displaying the appropriate separate Share Card (for admins)
 * or Public Share Button (for public viewing), ensuring consistency across all tools.
 */
export function ToolPageLayout({
    toolSlug,
    config,
    title,
    description,
    defaultShareTitle,
    defaultShareDescription,
    isPublicView = false,
    children
}: ToolPageLayoutProps) {
    return (
        <div className="space-y-6">
            {/* 1. Admin/Advisor View: Prominent Full-Width Share Banner */}
            {!isPublicView && (
                <SharePromotionCard
                    toolSlug={toolSlug}
                    config={config}
                    defaultTitle={defaultShareTitle || title}
                    defaultDescription={defaultShareDescription || description}
                />
            )}

            {/* 2. Main Content Area */}
            {/* We assume the children will look like a grid or list of cards. 
                We need to handle the rendering of the standard "Input Card Header" 
                if we want to replace the old buttons there. 
                
                However, since 'children' is the whole view, we can't easily inject into the Input Card inside 'children'.
                
                Strategy: This Layout just provides the TOP banner. 
                The individual views should be updated to use a simpler Input Card Header 
                (which optionally uses `ToolInputHeader` below) OR just standard Header with NO share button.
            */}
            {children}
        </div>
    );
}

// Utility to render the standard input card header WITHOUT the large buttons, 
// or WITH the small public button if needed.
export function ToolInputHeader({ title, description, isPublicView = false }: { title: string, description: string, isPublicView?: boolean }) {
    return (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            {isPublicView && <PublicShareButton />}
            {/* We intentionally DO NOT render the ShareDialog button here for admins anymore, 
                because they have the big banner above. */}
        </CardHeader>
    );
}
