import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Medal } from 'lucide-react';

interface FundRankerResponse {
    schemeCode: number;
    schemeName: string;
    category: string;
    alpha3y: number;
    beta3y: number;
    return3y: number;
    sparklineData: number[];
}

interface TopFundsTableProps {
    funds: FundRankerResponse[];
}

export function TopFundsTable({ funds }: TopFundsTableProps) {
    const getRankIcon = (index: number) => {
        if (index === 0) return <Medal className="w-5 h-5 text-yellow-500" />;
        if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
        if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
        return <span className="text-muted-foreground font-medium w-5 text-center">{index + 1}</span>;
    };

    return (
        <Card className="w-full backdrop-blur-md bg-white/80 dark:bg-black/80">
            <CardHeader>
                <CardTitle>Top Performing Funds</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Rank</TableHead>
                            <TableHead>Scheme Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Alpha (3Y)</TableHead>
                            <TableHead className="text-right">Return (3Y)</TableHead>
                            <TableHead className="w-[150px]">Trend (1Y)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {funds.map((fund, index) => (
                            <TableRow key={fund.schemeCode}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center justify-center">
                                        {getRankIcon(index)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{fund.schemeName}</TableCell>
                                <TableCell>{fund.category}</TableCell>
                                <TableCell className="text-right text-green-600 font-medium">
                                    {fund.alpha3y}%
                                </TableCell>
                                <TableCell className="text-right">
                                    {fund.return3y}%
                                </TableCell>
                                <TableCell>
                                    <div className="h-[40px] w-[120px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={fund.sparklineData.map((val, i) => ({ val, i }))}>
                                                <Line
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke="#10B981"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
