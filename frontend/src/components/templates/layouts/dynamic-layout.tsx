import { useRef, useEffect } from 'react';
import { Template } from '@/services/templateService';

interface Zone {
    id: string;
    type: 'LOGO' | 'CONTACT_INFO';
    x: number;
    y: number;
    width: number;
    height: number;
}

interface DynamicLayoutProps {
    template: Template;
    variantKey: string;
    customizations: Record<string, any>;
    onCustomizationChange: (zoneId: string, data: any) => void;
    readOnly?: boolean;
}

export function DynamicLayout({ template, variantKey, customizations, onCustomizationChange, readOnly = false }: DynamicLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const variants = template.templateData?.variants || {};
    const currentVariant = variants[variantKey];

    if (!currentVariant || !currentVariant.imageUrl) {
        return <div className="flex items-center justify-center h-full text-red-500">Variant not available</div>;
    }

    const handleDragStart = (e: React.DragEvent, zoneId: string) => {
        if (readOnly) return;
        e.dataTransfer.setData('zoneId', zoneId);
        e.dataTransfer.setData('offsetX', (e.clientX - (e.target as HTMLElement).getBoundingClientRect().left).toString());
        e.dataTransfer.setData('offsetY', (e.clientY - (e.target as HTMLElement).getBoundingClientRect().top).toString());
    };

    const handleDrop = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        const zoneId = e.dataTransfer.getData('zoneId');
        const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
        const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));

        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left - offsetX) / rect.width) * 100;
        const y = ((e.clientY - rect.top - offsetY) / rect.height) * 100;

        onCustomizationChange(zoneId, { x, y });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-white"
            onDragOver={e => !readOnly && e.preventDefault()}
            onDrop={handleDrop}
        >
            {/* Background Image */}
            <img
                src={currentVariant.imageUrl}
                alt="Template Background"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Zones */}
            {currentVariant.zones?.map((zone: Zone) => {
                const custom = customizations[zone.id] || {};
                const x = custom.x !== undefined ? custom.x : zone.x;
                const y = custom.y !== undefined ? custom.y : zone.y;

                return (
                    <div
                        key={zone.id}
                        draggable={!readOnly}
                        onDragStart={e => handleDragStart(e, zone.id)}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            width: `${zone.width}%`, // Fixed size for now, or customizable
                            height: `${zone.height}%`,
                            cursor: readOnly ? 'default' : 'move',
                            border: readOnly ? 'none' : '1px dashed rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}
                    >
                        {zone.type === 'LOGO' ? (
                            template.logoUrl ? (
                                <img
                                    src={template.logoUrl}
                                    alt="Logo"
                                    className="max-w-full max-h-full object-contain"
                                    style={{ pointerEvents: 'none' }}
                                />
                            ) : (
                                <div className="text-xs bg-gray-200 p-1 opacity-50">Logo Placeholder</div>
                            )
                        ) : (
                            <div className="text-white font-bold text-sm drop-shadow-md text-center p-1" style={{ pointerEvents: 'none' }}>
                                <div>{template.phone || '+91 98765 43210'}</div>
                                <div>{template.email || 'contact@example.com'}</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
