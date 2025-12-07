import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface AnnualReturn {
    year: number;
    returnPercentage: number;
}

interface AnnualPerformanceMatrixProps {
    data: AnnualReturn[];
}

export function AnnualPerformanceMatrix({ data }: AnnualPerformanceMatrixProps) {
    const isConsistent = data.every(item => item.returnPercentage > 0);

    const getBackgroundColor = (value: number) => {
        if (value > 20) return 'bg-green-600 text-white';
        if (value > 0) return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-100';
        if (value < -10) return 'bg-red-600 text-white';
        return 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100';
    };

    return (
        <Card className="w-full backdrop-blur-md bg-white/80 dark:bg-black/80">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Annual Performance Matrix</CardTitle>
                {isConsistent && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium dark:bg-yellow-900/30 dark:text-yellow-100">
                        <Trophy className="w-4 h-4" />
                        Consistent Performer
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {data.map((item) => (
                        <div
                            key={item.year}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[100px] p-4 rounded-lg transition-all hover:scale-105",
                                getBackgroundColor(item.returnPercentage)
                            )}
                        >
                            <span className="text-sm font-medium opacity-80">{item.year}</span>
                            <span className="text-xl font-bold">{item.returnPercentage}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
