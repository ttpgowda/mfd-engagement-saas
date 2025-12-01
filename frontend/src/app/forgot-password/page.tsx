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
import { AuthService } from '@/services/api';
import { useState } from 'react';

const formSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus('submitting');
        setMessage('');
        try {
            await AuthService.forgotPassword(values.email);
            setStatus('success');
            setMessage('If an account exists with that email, we have sent a password reset link.');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Failed to send reset email. Please try again.');
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'success' ? (
                        <div className="space-y-4">
                            <p className="text-green-600 text-sm">{message}</p>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full">Back to Login</Button>
                            </Link>
                        </div>
                    ) : (
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
                                {status === 'error' && <div className="text-red-500 text-sm">{message}</div>}
                                <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                                <div className="text-center text-sm">
                                    <Link href="/login" className="underline">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
