'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Lead } from '@/services/api';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'source',
        header: 'Source',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={status === 'NEW' ? 'default' : 'secondary'}>
                    {status}
                </Badge>
            );
        },
    },
];
