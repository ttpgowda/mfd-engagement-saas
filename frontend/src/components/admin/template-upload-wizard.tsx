"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateService, TemplateCategory } from '@/services/templateService';
import { useRouter } from 'next/navigation';
import * as fabric from 'fabric';
import { initCanvas, setBackground, addZoneRect, addZoneText, serializeCanvas, toPercent } from '@/utils/fabric-utils';

interface VariantData {
    file: File | null;
    imageUrl: string | null;
    canvasData: any | null; // Serialized Fabric JSON
    zones: any[]; // Store explicit relative zones for DB
}

interface Variants {
    SQUARE: VariantData;    // 1:1
    PORTRAIT: VariantData;  // 4:5
    STORY: VariantData;     // 9:16
    LANDSCAPE: VariantData; // 16:9
}

export function AdminTemplateUpload({ templateId }: { templateId?: number }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<TemplateCategory>(TemplateCategory.FESTIVAL);
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const [variants, setVariants] = useState<Variants>({
        SQUARE: { file: null, imageUrl: null, canvasData: null, zones: [] },
        PORTRAIT: { file: null, imageUrl: null, canvasData: null, zones: [] },
        STORY: { file: null, imageUrl: null, canvasData: null, zones: [] },
        LANDSCAPE: { file: null, imageUrl: null, canvasData: null, zones: [] },
    });

    const [activeTab, setActiveTab] = useState<keyof Variants>('SQUARE');

    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    // Load Template Data for Editing
    useEffect(() => {
        if (!templateId) return;

        const loadTemplate = async () => {
            try {
                const template = await TemplateService.getTemplateById(templateId);
                setName(template.name);
                setCategory(template.category);
                setSubCategory(template.subCategory || '');

                if (template.templateData && template.templateData.variants) {
                    const loadedVariants = template.templateData.variants;
                    const newVariants = { ...variants };

                    (Object.keys(loadedVariants) as (keyof Variants)[]).forEach(key => {
                        if (loadedVariants[key]) {
                            newVariants[key] = {
                                ...newVariants[key],
                                imageUrl: loadedVariants[key].imageUrl,
                                zones: loadedVariants[key].zones || [],
                                // If we had stored canvasData, we would load it here.
                                // Since we only stored zones/imageUrl, we rely on the editor to re-render them.
                                // For full re-editability, we might need to reconstruct Fabric objects from Zones.
                            };
                        }
                    });
                    setVariants(newVariants);
                }
                setDataLoaded(true);
            } catch (error) {
                console.error("Failed to load template", error);
                alert("Failed to load template for editing");
            }
        };

        loadTemplate();
    }, [templateId]);


    // Reconstruct Canvas from Zones on Tab Change (or Initial Load)
    // We modify the existing useEffect initialization to handle re-hydration
    useEffect(() => {
        if (!canvasRef.current) return;

        // Cleanup
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.dispose();
            fabricCanvasRef.current = null;
        }

        // Define dimensions based on variant type (scaled down for UI)
        let width = 500;
        let height = 500;

        if (activeTab === 'PORTRAIT') {
            width = 400; // 4:5 ratio
            height = 500;
        } else if (activeTab === 'STORY') {
            width = 281; // 9:16 ratio
            height = 500;
        } else if (activeTab === 'LANDSCAPE') {
            width = 500;
            height = 281; // 16:9 ratio
        }

        // Initialize Fabric Canvas
        const canvas = initCanvas(canvasRef.current.id, width, height);
        fabricCanvasRef.current = canvas;

        const currentVariant = variants[activeTab];

        // 1. Load Background
        if (currentVariant.imageUrl) {
            setBackground(canvas, currentVariant.imageUrl, width, height).then(() => {
                // 2. Load Zones (Reconstruct objects from saved zones if no raw canvasData)
                if (!currentVariant.canvasData && currentVariant.zones.length > 0) {
                    currentVariant.zones.forEach((zone: any) => {
                        if (zone.type === 'TEXT') {
                            addZoneText(canvas, {
                                id: zone.id,
                                type: zone.type,
                                left: (zone.left_pct / 100) * width,
                                top: (zone.top_pct / 100) * height,
                                width: (zone.width_pct / 100) * width,
                                height: (zone.height_pct / 100) * height,
                                text: 'Edit Me' // We lose original text if not saved, assume placeholder
                            });
                        } else {
                            addZoneRect(canvas, {
                                id: zone.id,
                                type: zone.type,
                                left: (zone.left_pct / 100) * width,
                                top: (zone.top_pct / 100) * height,
                                width: (zone.width_pct / 100) * width,
                                height: (zone.height_pct / 100) * height
                            });
                        }
                    });
                }
            });
        }

        // 3. Load existing raw canvas data (priority over zones reconstruction if available)
        if (currentVariant.canvasData) {
            canvas.loadFromJSON(currentVariant.canvasData, canvas.renderAll.bind(canvas));
        }

        return () => {
            fabricCanvasRef.current?.dispose();
        };
    }, [activeTab, variants[activeTab].imageUrl, dataLoaded]); // Re-run when dataLoaded changes (for Edit mode)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: keyof Variants) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);

            setVariants(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    file: file,
                    imageUrl: objectUrl,
                    canvasData: null
                }
            }));
        }
    };

    const handleAddZone = (type: 'LOGO' | 'CONTACT_INFO' | 'TEXT') => {
        if (!fabricCanvasRef.current) return;
        const id = Math.random().toString(36).substr(2, 9);

        if (type === 'TEXT') {
            addZoneText(fabricCanvasRef.current, {
                id, type, left: 50, top: 50, width: 200, height: 50, text: 'Edit Me'
            });
        } else {
            addZoneRect(fabricCanvasRef.current, {
                id, type, left: 50, top: 50, width: type === 'LOGO' ? 100 : 300, height: type === 'LOGO' ? 100 : 50
            });
        }
    };

    const saveCurrentCanvasState = () => {
        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const json = serializeCanvas(canvas);

        // Extract Relatives Zones
        const zones = canvas.getObjects()
            .filter((obj: any) => obj.zoneType) // Only designated zones
            .map((obj: any) => {
                const relative = toPercent(canvas, obj);
                return {
                    id: obj.id,
                    type: obj.zoneType,
                    ...relative
                };
            });

        setVariants(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                canvasData: json,
                zones: zones
            }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            saveCurrentCanvasState();

            // Allow state to settle logic omitted for brevity, taking current state directly if needed
            // But relying on state for 'uploadedVariants' construction

            // Construct payload
            const uploadedVariants: any = {};
            const keys: (keyof Variants)[] = ['SQUARE', 'PORTRAIT', 'STORY', 'LANDSCAPE'];

            // Need to ensure we capture the Latest State of the Active Tab 
            // because setState is async and we just called saveCurrentCanvasState
            let currentTabZones: any[] = [];
            if (fabricCanvasRef.current) {
                const canvas = fabricCanvasRef.current;
                currentTabZones = canvas.getObjects()
                    .filter((obj: any) => obj.zoneType)
                    .map((obj: any) => {
                        const relative = toPercent(canvas, obj);
                        return { id: obj.id, type: obj.zoneType, ...relative };
                    });
            }

            for (const key of keys) {
                const variant = variants[key];
                // Use current data if active
                const zones = key === activeTab ? currentTabZones : variant.zones;

                // Dimensions per type
                let w = 1080, h = 1080;
                if (key === 'PORTRAIT') { w = 1080; h = 1350; }
                if (key === 'STORY') { w = 1080; h = 1920; }
                if (key === 'LANDSCAPE') { w = 1920; h = 1080; }

                if (variant.file) {
                    const logoUrl = await TemplateService.uploadLogo(variant.file);

                    uploadedVariants[key] = {
                        width: w,
                        height: h,
                        imageUrl: logoUrl,
                        zones: zones
                    };
                } else if (variant.imageUrl) {
                    // Keep existing URL
                    uploadedVariants[key] = {
                        width: w,
                        height: h,
                        imageUrl: variant.imageUrl,
                        zones: zones
                    };
                }
            }

            if (Object.keys(uploadedVariants).length === 0) {
                // If editing, we might not have 'uploaded' anything new, but we have existing data.
                // However, the loop above reconstructs 'uploadedVariants' from CURRENT state (active or stored zones).
                // So if variants are valid in state, this object should be populated.
                if (!templateId) {
                    alert("Please configure at least one variant.");
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                name,
                category,
                subCategory,
                templateData: { variants: uploadedVariants },
                previewImageUrl: (Object.values(uploadedVariants)[0] as any)?.imageUrl,
                isPublic: true
            };

            if (templateId) {
                await TemplateService.updateTemplate(templateId, payload);
                alert("Template updated successfully!");
            } else {
                await TemplateService.createTemplate(payload);
                alert("Template created successfully!");
            }

            router.push('/admin/templates');

            alert("Template created successfully!");
            router.push('/admin/templates');

        } catch (error) {
            console.error("Error creating template", error);
            alert("Failed to create template");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card>
                <CardHeader><CardTitle>{templateId ? 'Edit Template' : 'Create New Template (Hybrid)'}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Diwali Greeting" />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v: TemplateCategory) => setCategory(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.values(TemplateCategory).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sub Category</Label>
                            <Input value={subCategory} onChange={e => setSubCategory(e.target.value)} placeholder="e.g. Diwali" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Design Variants</CardTitle></CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => {
                        saveCurrentCanvasState();
                        setActiveTab(v as keyof Variants);
                    }}>
                        <TabsList>
                            <TabsTrigger value="SQUARE">Square (1:1)</TabsTrigger>
                            <TabsTrigger value="PORTRAIT">Portrait (4:5)</TabsTrigger>
                            <TabsTrigger value="STORY">Story (9:16)</TabsTrigger>
                            <TabsTrigger value="LANDSCAPE">Landscape (16:9)</TabsTrigger>
                        </TabsList>

                        <div className="mt-6 flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 space-y-6">
                                <div className="space-y-2">
                                    <Label>1. Upload Background</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, activeTab)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>2. Add Zones</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Button onClick={() => handleAddZone('LOGO')} variant="outline">+ Logo Zone</Button>
                                        <Button onClick={() => handleAddZone('CONTACT_INFO')} variant="outline">+ Contact Zone</Button>
                                        <Button onClick={() => handleAddZone('TEXT')} variant="outline">+ Text Zone</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 bg-gray-100 flex items-center justify-center p-4">
                                <canvas id="admin-canvas" ref={canvasRef} />
                            </div>
                        </div>
                    </Tabs>

                    <div className="mt-8 flex justify-end border-t pt-4">
                        <Button onClick={handleSubmit} disabled={loading} size="lg">
                            {loading ? 'Saving...' : 'Create & Publish'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
