"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Label } from "@/components/ui/base";

export default function LoginPage() {
    const [workspace, setWorkspace] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [domainSuffix, setDomainSuffix] = useState(".thewealthweb.in");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Dynamic suffix based on current environment
        const host = window.location.hostname;
        if (host.includes("localhost")) {
            setDomainSuffix(".localhost");
        } else {
            // Remove 'www.' if present to get the root domain
            setDomainSuffix(`.${host.replace(/^www\./, '')}`);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation: Min 3 chars, lowercase letters, numbers, hyphens
        const workspaceRegex = /^[a-z0-9-]+$/;
        if (!workspace || workspace.length < 3) {
            setError("Workspace name must be at least 3 characters");
            return;
        }
        if (!workspaceRegex.test(workspace)) {
            setError("Only lowercase letters, numbers, and hyphens are allowed");
            return;
        }

        setIsLoading(true);

        const subdomain = workspace.toLowerCase();
        const host = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';

        let newUrl = '';
        if (host.includes('localhost')) {
            if (host.endsWith('localhost')) {
                // e.g. localhost -> workspace.localhost
                newUrl = `${protocol}//${subdomain}.localhost${port}/login`;
            }
        } else {
            // Production logic
            const rootDomain = host.startsWith('www.') ? host.substring(4) : host;
            newUrl = `${protocol}//${subdomain}.${rootDomain}${port}/login`;
        }

        // Simulate a brief delay for UX (like the product potentially would accessing API)
        // or just redirect immediately.
        console.log("Redirecting to", newUrl);
        window.location.href = newUrl;
    };

    return (
        <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center px-4 bg-gray-50/50">
            <Card className="w-full max-w-sm shadow-xl border-gray-200">
                <CardHeader>
                    <CardTitle className="text-2xl">Find your Workspace</CardTitle>
                    <CardDescription>
                        Enter your workspace URL to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="workspace">Workspace URL</Label>
                            <div className="flex items-center rounded-md">
                                <Input
                                    id="workspace"
                                    name="workspace"
                                    placeholder="your-company"
                                    value={workspace}
                                    onChange={(e) => setWorkspace(e.target.value)}
                                    className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 z-10 relative"
                                />
                                <div className="h-10 px-3 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md flex items-center text-sm text-gray-500 whitespace-nowrap">
                                    {domainSuffix}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                You will be redirected to your workspace login page.
                            </div>
                            {error && (
                                <p className="text-sm font-medium text-red-500">{error}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Locating..." : "Continue"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
