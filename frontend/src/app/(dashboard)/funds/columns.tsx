'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SchemeAnalytics, SchemeMaster } from '@/services/api';

// We need a combined type for the table
export type FundData = SchemeMaster & Partial<SchemeAnalytics>;

export const columns: ColumnDef<FundData>[] = [
    {
        accessorKey: 'schemeName',
        header: 'Scheme Name',
    },
    {
        accessorKey: 'schemeCategory',
        header: 'Category',
    },
    {
        accessorKey: 'return1y',
        header: '1Y Return',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('return1y'));
            const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
            return <div className={`font-medium ${color}`}>{amount}%</div>;
        },
    },
    {
        accessorKey: 'return3y',
        header: '3Y Return',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('return3y'));
            const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
            return <div className={`font-medium ${color}`}>{amount}%</div>;
        },
    },
    {
        accessorKey: 'return5y',
        header: '5Y Return',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('return5y'));
            const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
            return <div className={`font-medium ${color}`}>{amount}%</div>;
        },
    },
];
