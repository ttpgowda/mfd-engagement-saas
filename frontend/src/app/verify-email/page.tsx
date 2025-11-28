'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Suspense } from 'react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        AuthService.verifyEmail(token)
            .then(() => {
                setStatus('success');
                setMessage('Email verified successfully. You can now login.');
            })
            .catch((err) => {
                console.error(err);
                setStatus('error');
                setMessage('Verification failed. The token may be invalid or expired.');
            });
    }, [token]);

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {status === 'verifying' && <p>Verifying your email...</p>}
                    {status === 'success' && (
                        <>
                            <p className="text-green-600 text-center">{message}</p>
                            <Link href="/login" className="w-full">
                                <Button className="w-full">Go to Login</Button>
                            </Link>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <p className="text-red-600 text-center">{message}</p>
                            <Link href="/login" className="w-full">
                                <Button variant="outline" className="w-full">Back to Login</Button>
                            </Link>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Verifying...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
