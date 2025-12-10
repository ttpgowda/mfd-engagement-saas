'use client';

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
import { useState, useRef } from 'react';
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
    layout: z.enum(['GENERIC', 'INFOGRAPHIC', 'QUOTE']),
    // Infographic specific
    infographicTitle: z.string().optional(),
    infographicPoints: z.array(z.object({
        title: z.string(),
        description: z.string()
    })).optional(),
    illustrationUrl: z.string().optional(),
    // Quote specific
    quoteText: z.string().optional(),
    quoteAuthor: z.string().optional(),
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
    infographicTitle: '',
    infographicPoints: [{ title: '', description: '' }],
    illustrationUrl: '',
    quoteText: '',
    quoteAuthor: '',
};

export default function TemplatesPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'ALL'>('ALL');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const { fields: pointFields, append: appendPoint, remove: removePoint } = useFieldArray({
        control: form.control,
        name: "infographicPoints",
    });

    function onSubmit(values: z.infer<typeof templateFormSchema>) {
        // Construct templateData based on layout
        const templateData: any = {
            layout: values.layout,
        };

        if (values.layout === 'INFOGRAPHIC') {
            templateData.title = values.infographicTitle;
            templateData.points = values.infographicPoints;
            templateData.illustrationUrl = values.illustrationUrl;
        } else if (values.layout === 'QUOTE') {
            templateData.quote = values.quoteText;
            templateData.author = values.quoteAuthor;
        }

        const submissionData = {
            ...values,
            templateData,
        };

        if (selectedTemplate) {
            updateTemplateMutation.mutate({ id: selectedTemplate.id!, data: submissionData });
        } else {
            createTemplateMutation.mutate(submissionData);
        }
    }

    const handleEdit = (template: Template) => {
        setSelectedTemplate(template);
        const data = template.templateData || {};

        form.reset({
            name: template.name,
            description: template.description || '',
            category: template.category,
            companyName: template.companyName || '',
            phone: template.phone || '',
            email: template.email || '',
            website: template.website || '',
            address: template.address || '',
            primaryColor: template.primaryColor || '#3b82f6',
            secondaryColor: template.secondaryColor || '#8b5cf6',
            fontFamily: template.fontFamily || 'Inter',
            isPublic: template.isPublic || false,
            layout: data.layout || 'GENERIC',
            infographicTitle: data.title || '',
            infographicPoints: data.points || [{ title: '', description: '' }],
            illustrationUrl: data.illustrationUrl || '',
            quoteText: data.quote || '',
            quoteAuthor: data.author || '',
        });
        setIsDialogOpen(true);
    };

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
        };
        return colors[category];
    };

    const downloadTemplate = (template: Template) => {
        setPreviewTemplate(template);
        setIsPreviewOpen(true);
    };

    const seedTemplates = async () => {
        try {
            // Infographic Template
            await createTemplateMutation.mutateAsync({
                name: 'Why Invest in Index Funds?',
                category: TemplateCategory.INVESTMENT_TIP,
                description: 'Educational infographic about index funds',
                isPublic: true,
                templateData: {
                    layout: 'INFOGRAPHIC',
                    title: 'WHY INVEST IN INDEX FUNDS?',
                    points: [
                        { title: 'Cost Advantage', description: 'The Total Expense Ratios (TERs) of index funds are much lower than actively managed funds.' },
                        { title: 'No Fund Manager Risk', description: 'No risk of errors in judgement or human biases since index funds simply track the benchmark index.' },
                        { title: 'Simple investments', description: 'Ideal for new and seasoned investors. No need to check performance track records.' }
                    ],
                    illustrationUrl: 'https://cdn-icons-png.flaticon.com/512/2910/2910768.png'
                },
                primaryColor: '#1e3a8a',
                secondaryColor: '#f97316',
                fontFamily: 'Inter'
            } as any);

            // Quote Template
            await createTemplateMutation.mutateAsync({
                name: 'Warren Buffett Quote',
                category: TemplateCategory.SOCIAL_MEDIA,
                description: 'Motivational quote for investors',
                isPublic: true,
                templateData: {
                    layout: 'QUOTE',
                    quote: 'The stock market is designed to transfer money from the Active to the Patient.',
                    author: 'Warren Buffett'
                },
                primaryColor: '#111827',
                secondaryColor: '#ffffff',
                fontFamily: 'Playfair Display'
            } as any);

            toast({ title: 'Success', description: 'Sample templates created!' });
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
                    <Button onClick={() => {
                        setSelectedTemplate(null);
                        form.reset(defaultFormValues);
                        setIsDialogOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" /> Create Template
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setSelectedTemplate(null);
                            form.reset(defaultFormValues);
                        }
                    }}>
                        <DialogContent className="sm:max-w-[425px] lg:max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Template</DialogTitle>
                                <DialogDescription>
                                    Create a customizable template for social media sharing
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Template Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="My Investment Tip Template" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Template description..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={TemplateCategory.SOCIAL_MEDIA}>Social Media</SelectItem>
                                                        <SelectItem value={TemplateCategory.BUSINESS_CARD}>Business Card</SelectItem>
                                                        <SelectItem value={TemplateCategory.FLYER}>Flyer</SelectItem>
                                                        <SelectItem value={TemplateCategory.BANNER}>Banner</SelectItem>
                                                        <SelectItem value={TemplateCategory.INVESTMENT_TIP}>Investment Tip</SelectItem>
                                                        <SelectItem value={TemplateCategory.FUND_PERFORMANCE}>Fund Performance</SelectItem>
                                                        <SelectItem value={TemplateCategory.CUSTOM}>Custom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="layout"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Layout</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a layout" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="GENERIC">Generic</SelectItem>
                                                        <SelectItem value="INFOGRAPHIC">Infographic</SelectItem>
                                                        <SelectItem value="QUOTE">Quote</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Dynamic Fields based on Layout */}
                                    {form.watch('layout') === 'INFOGRAPHIC' && (
                                        <div className="space-y-4 border-l-2 border-primary pl-4">
                                            <h3 className="font-semibold">Infographic Details</h3>
                                            <FormField
                                                control={form.control}
                                                name="infographicTitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Main Title" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="illustrationUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Illustration URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <FormLabel>Points</FormLabel>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => appendPoint({ title: '', description: '' })}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" /> Add Point
                                                    </Button>
                                                </div>
                                                <div className="space-y-3">
                                                    {pointFields.map((field, index) => (
                                                        <div key={field.id} className="flex gap-2 items-start">
                                                            <div className="flex-1 space-y-2">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`infographicPoints.${index}.title`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input placeholder="Point Title" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`infographicPoints.${index}.description`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Textarea placeholder="Description" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removePoint(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {form.watch('layout') === 'QUOTE' && (
                                        <div className="space-y-4 border-l-2 border-primary pl-4">
                                            <h3 className="font-semibold">Quote Details</h3>
                                            <FormField
                                                control={form.control}
                                                name="quoteText"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Quote</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter the quote..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="quoteAuthor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Author</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Author Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <FormLabel>Company Logo</FormLabel>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="mt-2"
                                                />
                                                {logoFile && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Selected: {logoFile.name}
                                                    </p>
                                                )}
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="companyName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Company Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ABC Investments" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="+1234567890" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="contact@company.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="website"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Website</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://www.company.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="123 Main St, City, Country" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-4">Design Customization</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="primaryColor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Primary Color</FormLabel>
                                                        <FormControl>
                                                            <div className="flex gap-2">
                                                                <Input type="color" {...field} className="w-20 h-10" />
                                                                <Input {...field} placeholder="#3b82f6" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="secondaryColor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Secondary Color</FormLabel>
                                                        <FormControl>
                                                            <div className="flex gap-2">
                                                                <Input type="color" {...field} className="w-20 h-10" />
                                                                <Input {...field} placeholder="#8b5cf6" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="fontFamily"
                                            render={({ field }) => (
                                                <FormItem className="mt-4">
                                                    <FormLabel>Font Family</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a font" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Inter">Inter</SelectItem>
                                                            <SelectItem value="Roboto">Roboto</SelectItem>
                                                            <SelectItem value="Poppins">Poppins</SelectItem>
                                                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                                                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                                                            <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}>
                                        {createTemplateMutation.isPending || updateTemplateMutation.isPending ? 'Saving...' : selectedTemplate ? 'Update Template' : 'Create Template'}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
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
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
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
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleEdit(template)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
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
