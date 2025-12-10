"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Save } from 'lucide-react';
import * as fabric from 'fabric';
import { initCanvas, setBackground, fromPercent, toPercent } from '@/utils/fabric-utils';
import { Template, TemplateService } from '@/services/templateService';
import { UserService, api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { toast } from '@/components/ui/use-toast';

interface TemplateCustomizerProps {
    template: Template | null;
    open: boolean;
    onClose: () => void;
}

export function TemplateCustomizer({ template, open, onClose }: TemplateCustomizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string>('SQUARE');
    const [downloading, setDownloading] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        UserService.getCurrentUser().then(user => setUserData(user))
            .catch(err => console.error("Failed to load user", err));
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !template || !userData) return;

        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.dispose();
            fabricCanvasRef.current = null;
        }

        console.log("Customizer Template Data:", template);

        if (!template.templateData?.variants) {
            console.warn("No variants found in template data", template.templateData);
            return;
        }

        const variant = template.templateData?.variants?.[selectedVariant];
        if (!variant) {
            console.warn("Selected variant not found:", selectedVariant);
            return;
        }

        // UI Display Dimensions
        let width = 500, height = 500;
        if (selectedVariant === 'PORTRAIT') { width = 400; height = 500; }
        else if (selectedVariant === 'STORY') { width = 281; height = 500; }
        else if (selectedVariant === 'LANDSCAPE') { width = 500; height = 281; }

        const canvas = initCanvas(canvasRef.current.id, width, height);
        fabricCanvasRef.current = canvas;

        if (variant.imageUrl) {
            setBackground(canvas, variant.imageUrl, width, height);
        }

        // Hydrate Zones from Relative Coordinates
        if (variant.zones) {
            variant.zones.forEach((zone: any) => {
                // Convert % to Absolute for current canvas size
                const abs = fromPercent(width, height, zone);

                if (zone.type === 'LOGO') {
                    // Logic: If user logo exists, add Image, else placeholder Rect
                    if (userData.logoUrl) {
                        // Ideally fabric.Image.fromURL(userData.logoUrl)...
                        // Mocking with Blue Rect for MVP but labeled "User Logo"
                        const rect = new fabric.Rect({
                            left: abs.left, top: abs.top, width: abs.width, height: abs.height,
                            fill: 'rgba(0,0,255,0.2)', stroke: 'blue', strokeWidth: 1,
                            // @ts-ignore
                            zoneType: 'LOGO'
                        });
                        canvas.add(rect);
                        // In real impl, we'd load the image and scale it to fit `abs.width/height`
                    } else {
                        // Placeholder
                        const rect = new fabric.Rect({
                            left: abs.left, top: abs.top, width: abs.width, height: abs.height,
                            fill: '#ccc',
                            // @ts-ignore
                            zoneType: 'LOGO'
                        });
                        canvas.add(rect);
                    }
                } else if (zone.type === 'CONTACT_INFO' || zone.type === 'TEXT') {
                    const content = zone.type === 'CONTACT_INFO'
                        ? `${userData.phone || '+91...'}\n${userData.email || 'email@...'}`
                        : (zone.text || 'Custom Text');

                    const text = new fabric.IText(content, {
                        left: abs.left, top: abs.top,
                        fontSize: (abs.height < 30) ? 14 : 20, // heuristic
                        fill: zone.fill || '#000',
                        // @ts-ignore
                        zoneType: zone.type
                    });
                    canvas.add(text);
                }
            });
        }

        return () => { fabricCanvasRef.current?.dispose(); };
    }, [template, selectedVariant, userData]);

    const handleSaveFrame = async () => {
        if (!fabricCanvasRef.current) return;
        // Logic: Get current positions, convert to %, save to Backend (User Preferences)
        const canvas = fabricCanvasRef.current;
        const relativeObjects = canvas.getObjects()
            .filter((obj: any) => obj.zoneType)
            .map((obj: any) => ({
                id: obj.id,
                zoneType: obj.zoneType,
                ...toPercent(canvas, obj),
                // text content for text zones? Yes, if allowed
                text: (obj as any).text
            }));

        console.log("Saving Frame for", selectedVariant, relativeObjects);
        // Call API to save...
        alert("Frame configuration saved!");
    };

    const handleDownload = async () => {
        if (!fabricCanvasRef.current || !template) return;
        setDownloading(true);
        try {
            const canvas = fabricCanvasRef.current;
            const variant = template.templateData?.variants?.[selectedVariant];

            // Construct Payload for Node Renderer
            // 1. Absolute Real Dimensions
            const realWidth = variant.width;
            const realHeight = variant.height;

            // 2. Objects normalized to Real Dimensions
            // We iterate current objects (which may have been moved by user)
            // Convert them to % then to Real Abs
            const objects = canvas.getObjects().map((obj: any) => {
                const pct = toPercent(canvas, obj);

                // If it's pure image/text, we send specific type
                // Here we simplify by sending a generic "Object Scheme" the renderer understands
                // or specific types. 
                // Let's send specific types as requested by Render API spec

                const abs = {
                    left: (pct.left_pct / 100) * realWidth,
                    top: (pct.top_pct / 100) * realHeight,
                    width: (pct.width_pct / 100) * realWidth,
                    height: (pct.height_pct / 100) * realHeight,
                    angle: pct.angle,
                    scaleX: pct.scaleX,
                    scaleY: pct.scaleY,
                    fill: obj.fill,
                    fontSize: obj.fontSize ? (obj.fontSize * (realWidth / canvas.width!)) : undefined // Scale font?
                };

                if (obj.type === 'i-text' || obj.type === 'text') {
                    return {
                        type: 'text',
                        text: obj.text,
                        ...abs
                    };
                } else if (obj.zoneType === 'LOGO') {
                    // Send Image Type
                    return {
                        type: 'image',
                        url: userData.logoUrl || 'https://via.placeholder.com/150', // Fallback
                        ...abs
                    };
                }

                return null;
            }).filter(Boolean);

            const response = await fetch('/api/render-template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    width: realWidth,
                    height: realHeight,
                    backgroundImage: variant.imageUrl,
                    objects: objects
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `template-${selectedVariant}.png`;
                link.click();
            } else {
                const err = await response.json();
                console.error(err);
                alert("Server rendering failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error downloading");
        } finally {
            setDownloading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-5xl w-full h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-black">Customize Template (Hybrid)</h2>
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </div>

                {!template?.templateData?.variants && (
                    <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                        Warning: This template does not appear to have the new hybrid format (variants).
                        It might be a legacy template. Please create a new template via the Admin Wizard.
                    </div>
                )}

                <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="w-1/4 space-y-4">
                        {/* Brand Logo Section */}
                        <div className="p-4 bg-white border rounded shadow-sm">
                            <h3 className="font-semibold mb-2">My Brand Logo</h3>
                            {userData?.logoUrl ? (
                                <div className="mb-2 relative w-20 h-20 border rounded overflow-hidden">
                                    <img src={userData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 mb-2">No logo set</div>
                            )}
                            <div className="relative">
                                <Button variant="outline" size="sm" className="w-full">
                                    {userData?.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                try {
                                                    const url = await TemplateService.uploadLogo(e.target.files[0]);
                                                    setUserData({ ...userData, logoUrl: url });
                                                    toast({ title: "Logo Updated", description: "Your brand logo has been updated." });
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Failed to upload logo");
                                                }
                                            }
                                        }}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border rounded">
                            <h3 className="font-semibold mb-2">Variant</h3>
                            <div className="flex flex-wrap gap-2">
                                {['SQUARE', 'PORTRAIT', 'STORY', 'LANDSCAPE'].map(v => (
                                    <Button
                                        key={v}
                                        variant={selectedVariant === v ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedVariant(v)}
                                    >
                                        {v}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-100 flex items-center justify-center border relative">
                        <canvas id="user-canvas" ref={canvasRef} />
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={handleSaveFrame}>
                        <Save className="mr-2 h-4 w-4" /> Save Frame Defaults
                    </Button>
                    <Button onClick={handleDownload} disabled={downloading}>
                        <Download className="mr-2 h-4 w-4" />
                        {downloading ? 'Rendering...' : 'Download High-Res'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
