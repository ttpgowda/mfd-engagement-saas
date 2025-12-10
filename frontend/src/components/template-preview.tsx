import { Template } from '@/services/templateService';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { InfographicLayout } from './templates/layouts/infographic-layout';
import { GenericLayout } from './templates/layouts/generic-layout';
import { QuoteLayout } from './templates/layouts/quote-layout';
import { DynamicLayout } from './templates/layouts/dynamic-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

interface TemplatePreviewProps {
    template: Template | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TemplatePreview({ template, open, onOpenChange }: TemplatePreviewProps) {
    const previewRef = useRef<HTMLDivElement>(null);
    const [selectedVariant, setSelectedVariant] = useState<string>('SQUARE');
    const [customizations, setCustomizations] = useState<Record<string, any>>({});

    useEffect(() => {
        if (template?.templateData?.variants) {
            // Default to first available variant or SQUARE
            const variants = Object.keys(template.templateData.variants);
            if (variants.length > 0 && !variants.includes(selectedVariant)) {
                setSelectedVariant(variants[0]);
            }
        }
    }, [template]);

    const handleCustomizationChange = (zoneId: string, data: any) => {
        setCustomizations(prev => ({
            ...prev,
            [zoneId]: { ...(prev[zoneId] || {}), ...data }
        }));
    };

    const handleDownload = async () => {
        if (!previewRef.current || !template) return;

        try {
            const canvas = await html2canvas(previewRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        }
    };

    if (!template) return null;

    const renderLayout = () => {
        if (template.templateData?.variants) {
            return (
                <DynamicLayout
                    template={template}
                    variantKey={selectedVariant}
                    customizations={customizations}
                    onCustomizationChange={handleCustomizationChange}
                />
            );
        }

        const layoutType = template.templateData?.layout || 'GENERIC';

        switch (layoutType) {
            case 'INFOGRAPHIC':
                return <InfographicLayout template={template} />;
            case 'QUOTE':
                return <QuoteLayout template={template} />;
            default:
                return <GenericLayout template={template} />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>Template Preview</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-4">
                    {template.templateData?.variants && (
                        <Tabs value={selectedVariant} onValueChange={setSelectedVariant} className="w-full max-w-[400px]">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="SQUARE">Square</TabsTrigger>
                                <TabsTrigger value="PORTRAIT">Portrait</TabsTrigger>
                                <TabsTrigger value="LANDSCAPE">Landscape</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}

                    <div
                        ref={previewRef}
                        className="relative overflow-hidden rounded-lg shadow-xl bg-gray-100"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            aspectRatio: selectedVariant === 'SQUARE' ? '1/1' : selectedVariant === 'PORTRAIT' ? '9/16' : '16/9'
                        }}
                    >
                        {renderLayout()}
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={handleDownload} className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
