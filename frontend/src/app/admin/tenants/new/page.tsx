'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Building2, UserCircle2, Loader2 } from 'lucide-react'; // Assuming you have lucide-react (standard in shadcn)

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
import { TenantService } from '@/services/api';

const formSchema = z.object({
    tenantId: z.string().min(3, "ID must be at least 3 characters"),
    tenantName: z.string().min(3, "Name must be at least 3 characters"),
    contactEmail: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    subDomain: z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    userEmail: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(2, "Name is required"),
});

export default function OnboardTenantPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenantId: '',
            tenantName: '',
            contactEmail: '',
            phone: '',
            subDomain: '',
            username: '',
            userEmail: '',
            password: '',
            fullName: '',
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        try {
            await TenantService.onboardTenant(values);
            router.push('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to onboard tenant. Please check the inputs or try again.');
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 md:p-8">
            <Card className="mx-auto w-full max-w-2xl shadow-lg border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Onboard New Tenant</CardTitle>
                    <CardDescription>
                        Create a new organization workspace and assign an administrator.
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
                                        name="tenantId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tenant ID (Unique)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="acme-corp" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+91 9535593024" {...field} />
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
                                            <FormDescription className="text-xs">
                                                Optional custom access URL.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section 2: Admin Details */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <UserCircle2 className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg text-foreground">Administrator Account</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="admin_acme" {...field} autoComplete="nope" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="userEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Admin Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="admin@acme.com" {...field} autoComplete="nope" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="new-password" {...field} autoComplete="off" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Onboarding...
                                    </>
                                ) : (
                                    "Complete Onboarding"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}