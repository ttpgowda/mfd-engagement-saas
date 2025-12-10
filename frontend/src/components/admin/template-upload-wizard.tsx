"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateService, TemplateCategory } from '@/services/templateService';
import { useRouter } from 'next/navigation';

type ZoneType = 'LOGO' | 'CONTACT_INFO';

interface Zone {
    id: string;
    type: ZoneType;
    x: number; // Percentage
    y: number; // Percentage
    width: number; // Percentage
    height: number; // Percentage
}

interface Variant {
    file: File | null;
    imageUrl: string | null;
    zones: Zone[];
}

interface Variants {
    SQUARE: Variant;
    PORTRAIT: Variant;
    LANDSCAPE: Variant;
}

export function AdminTemplateUpload() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<TemplateCategory>(TemplateCategory.FESTIVAL);
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const [variants, setVariants] = useState<Variants>({
        SQUARE: { file: null, imageUrl: null, zones: [] },
        PORTRAIT: { file: null, imageUrl: null, zones: [] },
        LANDSCAPE: { file: null, imageUrl: null, zones: [] },
    });

    const [activeTab, setActiveTab] = useState<keyof Variants>('SQUARE');
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: keyof Variants) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Upload logo/image to get URL - In a real app we might upload all at the end, 
            // but here we need a URL to preview. Re-using uploadLogo for now or just object URL for preview.
            const objectUrl = URL.createObjectURL(file);

            setVariants(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    file: file,
                    imageUrl: objectUrl
                }
            }));
        }
    };

    const addZone = (type: ZoneType) => {
        const newZone: Zone = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: 10,
            y: 10,
            width: type === 'LOGO' ? 20 : 60,
            height: type === 'LOGO' ? 20 : 10,
        };

        setVariants(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                zones: [...prev[activeTab].zones, newZone],
            },
        }));
    };

    const updateZone = (zoneId: string, updates: Partial<Zone>) => {
        setVariants(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                zones: prev[activeTab].zones.map(z => z.id === zoneId ? { ...z, ...updates } : z)
            }
        }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Upload all images and get real URLs
            const uploadedVariants: any = {};

            for (const [key, variant] of Object.entries(variants)) {
                if (variant.file) {
                    const logoUrl = await TemplateService.uploadLogo(variant.file); // Reusing uploadLogo as generic upload
                    uploadedVariants[key] = {
                        imageUrl: logoUrl,
                        zones: variant.zones
                    };
                }
            }

            if (Object.keys(uploadedVariants).length === 0) {
                alert("Please upload at least one template variant.");
                setLoading(false);
                return;
            }

            // 2. Create Template
            await TemplateService.createTemplate({
                name,
                category,
                subCategory,
                templateData: {
                    variants: uploadedVariants
                },
                previewImageUrl: Object.values(uploadedVariants)[0]?.imageUrl, // Use first variant as preview
                isPublic: true
            });

            alert("Template created successfully!");
            router.push('/admin/templates'); // Assuming this route exists
        } catch (error) {
            console.error("Error creating template", error);
            alert("Failed to create template");
        } finally {
            setLoading(false);
        }
    };

    // Simple Draggable implementation
    const handleDragStart = (e: React.DragEvent, zoneId: string) => {
        e.dataTransfer.setData('zoneId', zoneId);
        // Clean drag image or custom
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const zoneId = e.dataTransfer.getData('zoneId');
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Center the drop? For now just place top-left at cursor approx
        updateZone(zoneId, { x, y });
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Template Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Diwali Greeting 2025" />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v: TemplateCategory) => setCategory(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TemplateCategory).map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
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
                <CardHeader>
                    <CardTitle>Upload Variants & Define Zones</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as keyof Variants)}>
                        <TabsList>
                            <TabsTrigger value="SQUARE">Square (1:1)</TabsTrigger>
                            <TabsTrigger value="PORTRAIT">Portrait (9:16)</TabsTrigger>
                            <TabsTrigger value="LANDSCAPE">Landscape (16:9)</TabsTrigger>
                        </TabsList>

                        {['SQUARE', 'PORTRAIT', 'LANDSCAPE'].map((tab) => (
                            <TabsContent key={tab} value={tab} className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <Input type="file" onChange={(e) => handleFileChange(e, tab as keyof Variants)} accept="image/*" />
                                    <Button onClick={() => addZone('LOGO')} variant="outline">Add Logo Zone</Button>
                                    <Button onClick={() => addZone('CONTACT_INFO')} variant="outline">Add Contact Zone</Button>
                                </div>

                                <div
                                    ref={canvasRef}
                                    className="relative border-2 border-dashed bg-gray-50 overflow-hidden mt-4"
                                    style={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        aspectRatio: tab === 'SQUARE' ? '1/1' : tab === 'PORTRAIT' ? '9/16' : '16/9',
                                    }}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    {variants[tab as keyof Variants].imageUrl ? (
                                        <img
                                            src={variants[tab as keyof Variants].imageUrl!}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Upload an image</div>
                                    )}

                                    {variants[tab as keyof Variants].zones.map(zone => (
                                        <div
                                            key={zone.id}
                                            draggable
                                            onDragStart={e => handleDragStart(e, zone.id)}
                                            style={{
                                                position: 'absolute',
                                                left: `${zone.x}%`,
                                                top: `${zone.y}%`,
                                                width: `${zone.width}%`,
                                                height: `${zone.height}%`,
                                                border: '2px solid blue',
                                                cursor: 'move',
                                                backgroundColor: zone.type === 'LOGO' ? 'rgba(0,0,255,0.2)' : 'rgba(0,255,0,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {zone.type}
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Create Template'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
