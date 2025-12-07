'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';
import { RecentSales } from '@/components/dashboard/recent-sales';



export default function DashboardPage() {


    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Links Shared
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Clicks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,231</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversion Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5%</div>
                        <p className="text-xs text-muted-foreground">
                            +4% from last week
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Top Performing Funds</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentSales />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
