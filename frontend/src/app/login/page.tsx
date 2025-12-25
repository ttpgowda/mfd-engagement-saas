'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { TenantService } from '@/services/api';
import { useState, useEffect } from 'react';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

const workspaceSchema = z.object({
    workspace: z.string().min(3, "Workspace name must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        try {
            // TenantID is now handled by axios interceptor via X-Tenant-ID header
            // extracted from subdomain
            const response = await api.post('/auth/login', {
                username: values.email,
                password: values.password,
                // tenantId no longer manually sent here, handled by header
            });
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Set cookie for middleware
            // eslint-disable-next-line react-hooks/immutability
            document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict`; // 1 day expiration
            // eslint-disable-next-line react-hooks/immutability
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Strict`; // 7 days expiration

            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const permissions = payload.permissions || [];
            if (permissions.includes('TENANT_MANAGE')) {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid credentials');
        }
    }

    const [checkingDomain, setCheckingDomain] = useState(true);
    const [isRootDomain, setIsRootDomain] = useState(false);

    // Workspace Form
    const workspaceForm = useForm<z.infer<typeof workspaceSchema>>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: { workspace: '' },
    });

    useEffect(() => {
        const checkDomain = () => {
            const host = window.location.hostname;
            const parts = host.split('.');
            let isRoot = false;

            if (host === 'localhost') {
                isRoot = true;
            } else if (host.endsWith('localhost')) {
                // e.g. foo.localhost -> parts length 2. root if parts length 1 (unlikely with split) or parts[0] is www
                // actually 'localhost' split is ['localhost'] length 1.
                // 'foo.localhost' split is ['foo', 'localhost'] length 2.
                if (parts.length === 1 || (parts.length === 2 && parts[0] === 'www')) {
                    isRoot = true;
                }
            } else {
                // Production: domain.com (2 parts) is root. sub.domain.com (3 parts) is tenant.
                // Adjustable based on TLD (e.g. co.uk). Assuming standard 2-part TLD or explicitly handling www.
                if (parts.length === 2 || (parts.length === 3 && parts[0] === 'www')) {
                    isRoot = true;
                }
            }

            setIsRootDomain(isRoot);
            setCheckingDomain(false);
        };
        checkDomain();
    }, []);

    const onWorkspaceSubmit = async (values: z.infer<typeof workspaceSchema>) => {
        const subdomain = values.workspace.toLowerCase();

        try {
            // Validate workspace exists before redirecting
            await TenantService.getPublicTenant(subdomain);

            // If valid, proceed with redirect
            const host = window.location.hostname;
            const protocol = window.location.protocol;
            const port = window.location.port ? `:${window.location.port}` : '';

            let newUrl = '';
            if (host.includes('localhost')) {
                // Handle localhost logic
                if (host.endsWith('localhost')) {
                    newUrl = `${protocol}//${subdomain}.localhost${port}/login`;
                }
            } else {
                // Production logic
                const rootDomain = host.startsWith('www.') ? host.substring(4) : host;
                newUrl = `${protocol}//${subdomain}.${rootDomain}${port}/login`;
            }

            window.location.href = newUrl;
        } catch (err: any) {
            console.error("Workspace validation error:", err);
            // Assume 404 means not found
            if (err.response?.status === 404) {
                workspaceForm.setError('workspace', {
                    type: 'manual',
                    message: 'Workspace not found. Please check the name and try again.'
                });
            } else {
                workspaceForm.setError('workspace', {
                    type: 'manual',
                    message: 'Unable to verify workspace. Please try again later.'
                });
            }
        }
    };

    if (checkingDomain) return null; // Or a loader

    if (isRootDomain) {
        return (
            <div className="flex h-screen w-full items-center justify-center px-4 bg-muted/10">
                <Card className="w-full max-w-sm shadow-xl border-border/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Find your Workspace</CardTitle>
                        <CardDescription>
                            Enter your workspace URL to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...workspaceForm}>
                            <form onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)} className="space-y-4">
                                <FormField
                                    control={workspaceForm.control}
                                    name="workspace"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Workspace URL</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input placeholder="your-company" {...field} className="rounded-r-none border-r-0 focus-visible:ring-0" />
                                                    <div className="h-10 px-3 bg-muted border border-l-0 border-input rounded-r-md flex items-center text-sm text-muted-foreground whitespace-nowrap">
                                                        {window.location.hostname.replace('www.', '').replace(window.location.hostname.split('.')[0] + '.', '.')}
                                                        {window.location.hostname === 'localhost' ? '.localhost' : (window.location.hostname.includes('localhost') ? '.localhost' : '.' + window.location.hostname.replace('www.', ''))}
                                                    </div>
                                                    {/* The above suffix logic is complex to get right dynamically for visual placeholder. Simpler: */}
                                                </div>
                                            </FormControl>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                You will be redirected to your workspace login page.
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Continue
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default Login View (Subdomain)
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
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
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="text-right">
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
