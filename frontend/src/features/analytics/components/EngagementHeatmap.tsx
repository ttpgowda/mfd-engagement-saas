import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface HeatmapData {
    dayOfWeek: number; // 0-6 (Sun-Sat) or 1-7 depending on backend
    hourOfDay: number; // 0-23
    intensity: number;
}

interface EngagementHeatmapProps {
    data?: HeatmapData[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function EngagementHeatmap({ data }: EngagementHeatmapProps) {
    if (!data) return null;

    // Normalize data into a lookup map
    const intensityMap = new Map<string, number>();
    let maxIntensity = 1;

    data.forEach(d => {
        // Adjust backend 1-based ISO day (Mon=1 ... Sun=7) or similar if needed.
        // Assuming Backend uses Postgres EXTRACT(DOW) -> 0=Sun, 6=Sat
        const key = `${d.dayOfWeek}-${d.hourOfDay}`;
        intensityMap.set(key, d.intensity);
        if (d.intensity > maxIntensity) maxIntensity = d.intensity;
    });

    const getColor = (value: number) => {
        if (value === 0) return 'bg-muted/20'; // Empty
        const intensity = value / maxIntensity;
        if (intensity < 0.25) return 'bg-green-100 dark:bg-green-900/30';
        if (intensity < 0.50) return 'bg-green-300 dark:bg-green-700/50';
        if (intensity < 0.75) return 'bg-green-500 dark:bg-green-600';
        return 'bg-green-700 dark:bg-green-500';
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Engagement Heatmap</CardTitle>
                <CardDescription>Peak activity times (interaction intensity)</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-1">
                        {/* Header Row: Hours */}
                        <div className="h-6"></div> {/* Spacer for layout */}
                        {HOURS.map(h => (
                            <div key={h} className="text-xs text-center text-muted-foreground h-6">
                                {h}
                            </div>
                        ))}

                        {/* Rows: Days */}
                        {DAYS.map((day, dayIndex) => (
                            <React.Fragment key={day}>
                                <div className="text-xs font-medium text-muted-foreground flex items-center pr-2 h-8">
                                    {day}
                                </div>
                                {HOURS.map(hour => {
                                    // Postgres DOW: 0=Sun, 6=Sat. JS: 0=Sun. Match directly.
                                    const val = intensityMap.get(`${dayIndex}-${hour}`) || 0;
                                    return (
                                        <div
                                            key={`${dayIndex}-${hour}`}
                                            className={`rounded-sm h-8 w-full transition-colors hover:ring-2 hover:ring-ring ${getColor(val)}`}
                                            title={`${day} @ ${hour}:00 - ${val} interactions`}
                                        />
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
