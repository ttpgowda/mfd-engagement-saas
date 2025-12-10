import { Template } from '@/services/templateService';
import { TemplateCustomizer } from './template-customizer';

interface TemplatePreviewProps {
    template: Template | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TemplatePreview({ template, open, onOpenChange }: TemplatePreviewProps) {
    if (!open || !template) return null;

    return (
        <TemplateCustomizer
            template={template}
            open={open}
            onClose={() => onOpenChange(false)}
        />
    );
}
