'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MutualFundService, SchemeMaster } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudioPage() {
    const [selectedScheme, setSelectedScheme] = useState<string>('');

    const { data: schemes } = useQuery({
        queryKey: ['schemes'],
        queryFn: () => MutualFundService.getAllSchemes(),
    });

    const { data: analytics } = useQuery({
        queryKey: ['analytics', selectedScheme],
        queryFn: () => MutualFundService.getSchemeAnalytics(Number(selectedScheme)),
        enabled: !!selectedScheme,
    });

    const selectedSchemeData = schemes?.content?.find(
        (s) => s.schemeCode === Number(selectedScheme)
    );

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Content Studio</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Create Smart Content</CardTitle>
                        <CardDescription>
                            Select a fund to generate marketing assets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fund">Select Fund</Label>
                            <Select onValueChange={setSelectedScheme} value={selectedScheme}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a fund..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {schemes?.content?.slice(0, 50).map((scheme) => (
                                        <SelectItem
                                            key={scheme.schemeCode}
                                            value={String(scheme.schemeCode)}
                                        >
                                            {scheme.schemeName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {analytics && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current NAV</Label>
                                    <Input value={analytics.navCurrent} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label>1Y Return</Label>
                                    <Input value={`${analytics.return1y}%`} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label>3Y Return</Label>
                                    <Input value={`${analytics.return3y}%`} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label>5Y Return</Label>
                                    <Input value={`${analytics.return5y}%`} readOnly />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={!selectedScheme}>
                            Generate Smart Link
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedSchemeData && analytics ? (
                            <div className="rounded-xl border bg-card text-card-foreground shadow">
                                <div className="p-6 pt-0 mt-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold leading-none tracking-tight">
                                            {selectedSchemeData.schemeName}
                                        </h3>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-2xl font-bold text-green-500">
                                            {analytics.return3y}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            3Y Return
                                        </div>
                                    </div>
                                    <div className="mt-4 h-[100px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                                        Chart Preview
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                                <p className="text-sm text-muted-foreground">
                                    Select a fund to preview
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
