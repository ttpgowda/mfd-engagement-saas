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
import { useState } from 'react';

const formSchema = z.object({
    tenantId: z.string().min(1, "Tenant ID is required"),
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenantId: 'dev-tenant', // Default for convenience
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        try {
            // Pass tenantId to the backend
            const response = await api.post('/auth/login', {
                username: values.email, // Backend expects username, we use email
                password: values.password,
                tenantId: values.tenantId,
            });
            const { accessToken, refreshToken } = response.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Set cookie for middleware
            // eslint-disable-next-line react-hooks/immutability
            document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Strict`; // 1 day expiration
            // eslint-disable-next-line react-hooks/immutability
            document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Strict`; // 7 days expiration

            // Simple JWT decode to check role (in production use a library like jwt-decode)
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const permissions = payload.permissions || [];
            console.log("permissions: ", permissions);
            if (permissions.includes('TENANT_MANAGE')) {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or tenant ID');
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your tenant ID, email and password to login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tenantId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tenant ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="dev-tenant" {...field} />
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
