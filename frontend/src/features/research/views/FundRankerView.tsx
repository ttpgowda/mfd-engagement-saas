"use client";

import React, { useEffect, useState } from 'react';
import { TopFundsTable } from '@/components/research/TopFundsTable';
import { researchService, FundRankerResponse } from '@/services/researchService';

export default function FundRankerView() {
    const [data, setData] = useState<FundRankerResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('Equity');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await researchService.getTopFunds(category, 'alpha_3y');
                setData(result);
            } catch (error) {
                console.error("Failed to fetch top funds", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [category]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg flex gap-4 items-center">
                <p className="text-sm text-muted-foreground">Category:</p>
                <select
                    className="p-2 border rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Equity">Equity</option>
                    <option value="Debt">Debt</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
            <TopFundsTable funds={data} />
        </div>
    );
}
