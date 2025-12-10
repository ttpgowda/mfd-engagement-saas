'use client';

import Link from 'next/link';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Template, TemplateService, TemplateCategory } from '@/services/templateService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Download, Share2, Edit, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { TemplatePreview } from '@/components/template-preview';
import { toast } from '@/components/ui/use-toast';
import { useFieldArray } from 'react-hook-form';
import { X } from 'lucide-react';

const templateFormSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    category: z.nativeEnum(TemplateCategory),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    address: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    isPublic: z.boolean().optional(),
    layout: z.enum(['GENERIC', 'INFOGRAPHIC', 'QUOTE']).optional(), // Kept optional for backward compat but hidden
});

const defaultFormValues: z.infer<typeof templateFormSchema> = {
    name: "",
    description: "",
    category: TemplateCategory.SOCIAL_MEDIA,
    companyName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    fontFamily: "Inter",
    isPublic: false,
    layout: 'GENERIC',
};

export default function TemplatesPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null); // Fixed order
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'ALL'>('ALL');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: TemplateService.getAllTemplates,
        retry: false,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    });

    const createTemplateMutation = useMutation({
        mutationFn: async (data: z.infer<typeof templateFormSchema>) => {
            let logoUrl = '';
            if (logoFile) {
                logoUrl = await TemplateService.uploadLogo(logoFile);
            }
            return TemplateService.createTemplate({ ...data, logoUrl });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            setIsDialogOpen(false);
            form.reset(defaultFormValues);
            setLogoFile(null);
            toast({ title: 'Success', description: 'Template created successfully' });
        },
        onError: (error) => {
            toast({ title: 'Error', description: 'Failed to create template', variant: 'destructive' });
        }
    });

    const updateTemplateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof templateFormSchema> }) => {
            let logoUrl = selectedTemplate?.logoUrl || '';
            if (logoFile) {
                logoUrl = await TemplateService.uploadLogo(logoFile);
            }
            return TemplateService.updateTemplate(id, { ...data, logoUrl });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            setIsDialogOpen(false);
            setSelectedTemplate(null);
            setLogoFile(null);
            toast({ title: 'Success', description: 'Template updated successfully' });
        },
        onError: (error) => {
            toast({ title: 'Error', description: 'Failed to update template', variant: 'destructive' });
        }
    });

    const deleteTemplateMutation = useMutation({
        mutationFn: TemplateService.deleteTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast({ title: 'Success', description: 'Template deleted successfully' });
        },
        onError: (error) => {
            toast({ title: 'Error', description: 'Failed to delete template', variant: 'destructive' });
        }
    });

    const form = useForm<z.infer<typeof templateFormSchema>>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: defaultFormValues,
    });

    function onSubmit(values: z.infer<typeof templateFormSchema>) {
        const submissionData = { ...values };
        if (selectedTemplate) {
            updateTemplateMutation.mutate({ id: selectedTemplate.id!, data: submissionData });
        } else {
            createTemplateMutation.mutate(submissionData);
        }
    }



    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            deleteTemplateMutation.mutate(id);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const filteredTemplates = templates?.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryBadgeColor = (category: TemplateCategory) => {
        const colors: Record<TemplateCategory, string> = {
            [TemplateCategory.SOCIAL_MEDIA]: 'bg-blue-500',
            [TemplateCategory.BUSINESS_CARD]: 'bg-green-500',
            [TemplateCategory.FLYER]: 'bg-purple-500',
            [TemplateCategory.BANNER]: 'bg-orange-500',
            [TemplateCategory.INVESTMENT_TIP]: 'bg-cyan-500',
            [TemplateCategory.FUND_PERFORMANCE]: 'bg-pink-500',
            [TemplateCategory.CUSTOM]: 'bg-gray-500',
            [TemplateCategory.FESTIVAL]: 'bg-red-500',
            [TemplateCategory.QUOTE]: 'bg-yellow-500',
            [TemplateCategory.GENERIC]: 'bg-slate-500',
        };
        return colors[category] || 'bg-gray-500';
    };

    const downloadTemplate = (template: Template) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    const seedTemplates = async () => {
        try {
            // Updated Hybrid Template Seeding
            const sampleVariants = {
                SQUARE: {
                    width: 1080,
                    height: 1080,
                    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop", // Abstract Abstract
                    zones: [
                        { id: "z1", type: "LOGO", left_pct: 10, top_pct: 10, width_pct: 20, height_pct: 10 },
                        { id: "z2", type: "CONTACT_INFO", left_pct: 10, top_pct: 85, width_pct: 80, height_pct: 5, fill: "#ffffff" }
                    ]
                },
                STORY: {
                    width: 1080,
                    height: 1920,
                    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop",
                    zones: [
                        { id: "z1", type: "LOGO", left_pct: 10, top_pct: 5, width_pct: 30, height_pct: 10 },
                        { id: "z2", type: "CONTACT_INFO", left_pct: 10, top_pct: 90, width_pct: 80, height_pct: 5, fill: "#ffffff" }
                    ]
                }
            };

            await createTemplateMutation.mutateAsync({
                name: 'Hybrid Sample Template',
                category: TemplateCategory.FESTIVAL,
                description: 'A sample template compatible with the new Hybrid Customizer.',
                isPublic: true,
                templateData: {
                    variants: sampleVariants
                },
                companyName: 'WealthWeb Demo',
                primaryColor: '#1e3a8a',
                secondaryColor: '#f97316',
                fontFamily: 'Inter'
            } as any);

            toast({ title: 'Success', description: 'Hybrid Sample Template created! You can now Download/Edit it.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Failed to seed templates', variant: 'destructive' });
        }
    };

    const shareTemplate = (template: Template) => {
        console.log('Sharing template:', template.name);
        alert('Share functionality will be implemented');
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={seedTemplates}>
                        Seed Templates
                    </Button>
                    <Button onClick={() => window.location.href = '/admin/templates/create'}>
                        <Plus className="mr-2 h-4 w-4" /> Create Template (New)
                    </Button>

                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {isMounted ? (
                    <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TemplateCategory | 'ALL')}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            <SelectItem value={TemplateCategory.SOCIAL_MEDIA}>Social Media</SelectItem>
                            <SelectItem value={TemplateCategory.BUSINESS_CARD}>Business Card</SelectItem>
                            <SelectItem value={TemplateCategory.FLYER}>Flyer</SelectItem>
                            <SelectItem value={TemplateCategory.BANNER}>Banner</SelectItem>
                            <SelectItem value={TemplateCategory.INVESTMENT_TIP}>Investment Tip</SelectItem>
                            <SelectItem value={TemplateCategory.FUND_PERFORMANCE}>Fund Performance</SelectItem>
                            <SelectItem value={TemplateCategory.CUSTOM}>Custom</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="w-[200px] h-10 bg-gray-100 rounded-md animate-pulse"></div>
                )}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isMounted || isLoading ? (
                    <div className="col-span-full text-center py-12">Loading templates...</div>
                ) : filteredTemplates && filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div
                                className="h-48 bg-gradient-to-br flex items-center justify-center relative"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, ${template.primaryColor || '#3b82f6'}, ${template.secondaryColor || '#8b5cf6'})`
                                }}
                            >
                                {template.logoUrl ? (
                                    <img src={template.logoUrl} alt={template.name} className="max-h-24 max-w-24 object-contain" />
                                ) : (
                                    <div className="text-white text-4xl font-bold">
                                        {template.companyName?.charAt(0) || template.name.charAt(0)}
                                    </div>
                                )}
                                <Badge className={`absolute top-2 right-2 ${getCategoryBadgeColor(template.category)}`}>
                                    {template.category.replace('_', ' ')}
                                </Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">{template.name}</span>
                                </CardTitle>
                                {template.description && (
                                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                    {template.companyName && <p>Company: {template.companyName}</p>}
                                    {template.email && <p>Email: {template.email}</p>}
                                    {template.phone && <p>Phone: {template.phone}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => downloadTemplate(template)}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => shareTemplate(template)}
                                    >
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Share
                                    </Button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Link href={`/admin/templates/${template.id}`} className="flex-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(template.id!)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No templates found. Create your first template!</p>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}


            <TemplatePreview
                template={previewTemplate}
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
            />
        </div>
    );
}
