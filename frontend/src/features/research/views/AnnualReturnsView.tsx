"use client";

import React, { useEffect, useState } from 'react';
import { AnnualPerformanceMatrix } from '@/components/research/AnnualPerformanceMatrix';
import { researchService, AnnualReturn } from '@/services/researchService';

export default function AnnualReturnsView() {
    const [data, setData] = useState<AnnualReturn[]>([]);
    const [loading, setLoading] = useState(true);
    const [schemeCode, setSchemeCode] = useState(101);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await researchService.getAnnualReturns(schemeCode);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch annual returns", error);
                const msg = err.response?.data?.message || "An unexpected error occurred. Please verify dates and try again.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [schemeCode]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Select Scheme (Demo)</p>
                <select
                    className="p-2 border rounded"
                    value={schemeCode}
                    onChange={(e) => setSchemeCode(Number(e.target.value))}
                >
                    <option value={101}>Scheme 101</option>
                    <option value={102}>Scheme 102</option>
                </select>
            </div>
            <AnnualPerformanceMatrix data={data} />
        </div>
    );
}
