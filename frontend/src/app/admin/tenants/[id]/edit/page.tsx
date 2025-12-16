'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Image, Loader2, Save } from 'lucide-react';
import { LogoUpload } from '@/components/admin/LogoUpload';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { TenantService, Tenant } from '@/services/api';
import { toast } from 'sonner';

const formSchema = z.object({
    // Tenant Details
    tenantId: z.string(), // Required for update
    tenantName: z.string().min(3, "Name must be at least 3 characters"),
    contactEmail: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    subDomain: z.string().optional(),
    website: z.string().optional(),

    // Branding
    logoUrl: z.string().optional(),
    faviconUrl: z.string().optional(),
    darkLogoUrl: z.string().optional(),
    mobileLogoUrl: z.string().optional(),
});

export default function EditTenantPage() {
    const router = useRouter();
    const params = useParams();
    const tenantId = Number(params.id); // 'id' from folder [id]
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenantId: '',
            tenantName: '',
            contactEmail: '',
            phone: '',
            subDomain: '',
            website: '',
            logoUrl: '',
            faviconUrl: '',
            darkLogoUrl: '',
            mobileLogoUrl: '',
        },
    });

    useEffect(() => {
        if (!tenantId) return;

        const fetchTenant = async () => {
            try {
                // We need to fetch the tenant by ID. 
                // The current API Service has getCurrentTenant(tenantId string)
                // But getAllTenants returns the list.
                // We might need a method to get by numeric ID or find from list.
                // Let's assume we can use the list and find it for now, 
                // OR better, specific endpoint. 
                // Checking api.ts: getCurrentTenant takes string (tenantId like 'acme').
                // But updateTenant takes number (id).
                // Let's try to fetch all and find, or assume we need a new endpoint.
                // Re-reading api.ts: There is no getById(number).
                // Let's use getAllTenants and filter. Ideally we add getById.
                const tenants = await TenantService.getAllTenants();
                const tenant = tenants.find(t => t.id === tenantId);

                if (tenant) {
                    form.reset({
                        tenantId: tenant.tenantId,
                        tenantName: tenant.name,
                        contactEmail: tenant.contactEmail,
                        phone: tenant.phone || '',
                        subDomain: tenant.subDomain || '',
                        website: tenant.website || '',
                        logoUrl: tenant.logoUrl || '',
                        faviconUrl: tenant.faviconUrl || '',
                        darkLogoUrl: tenant.darkLogoUrl || '',
                        mobileLogoUrl: tenant.mobileLogoUrl || '',
                    });
                } else {
                    toast.error("Tenant not found");
                    router.push('/admin/dashboard');
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load tenant");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, [tenantId, form, router]);

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Map form values to Tenant object (partial)
            const updateData: any = {
                ...values,
                name: values.tenantName, // Map back
                id: tenantId,
                tenantId: form.getValues('tenantId'), // Ensure tenantId is passed back
            };

            await TenantService.updateTenant(tenantId, updateData);
            toast.success("Tenant updated successfully");
            router.push('/admin/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Failed to update tenant");
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 md:p-8">
            <Card className="mx-auto w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Tenant</CardTitle>
                    <CardDescription>
                        Update branding and details for this workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Section 1: Tenant Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg text-foreground">Organization Details</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="tenantName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tenant Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Corp" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="info@acme.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="subDomain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subdomain</FormLabel>
                                            <FormControl>
                                                <div className="flex">
                                                    <Input placeholder="acme" className="rounded-r-none" {...field} />
                                                    <div className="flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                                                        .thewealthweb.in
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section 2: Branding */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <Image asIcon className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg text-foreground">Branding & Style</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="logoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <LogoUpload
                                                        label="Primary Logo (Light Theme)"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        helperText="Recommended: 512x512px"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="darkLogoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <LogoUpload
                                                        label="Dark Theme Logo"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        helperText="Recommended: 512x512px, White/Light text"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mobileLogoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <LogoUpload
                                                        label="Mobile Logo (Icon)"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        helperText="Small square icon, 64x64px"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="faviconUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <LogoUpload
                                                        label="Favicon"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        helperText=".ico format, 32x32px"
                                                        maxSizeMB={0.5}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
