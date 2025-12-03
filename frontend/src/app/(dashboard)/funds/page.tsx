'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MutualFundService } from '@/services/api';
import { columns, FundData } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { PaginationState } from '@tanstack/react-table';

export default function FundsPage() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: schemesPage } = useQuery({
        queryKey: ['schemes', pagination.pageIndex, pagination.pageSize],
        queryFn: () => MutualFundService.getAllSchemes(pagination.pageIndex, pagination.pageSize),
        retry: false,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    });

    const schemes = schemesPage?.content || [];
    const pageCount = schemesPage?.totalPages || -1;

    // Note: Fetching analytics for the *current page* of schemes is ideal, but the API 
    // currently supports fetching *all* analytics paginated. 
    // For now, we might not be able to easily merge analytics unless we fetch analytics 
    // specifically for the scheme IDs in the current page.
    // If the backend supported fetching analytics by scheme IDs, that would be better.
    // Given the constraints, we will display scheme data primarily. 
    // If analytics are needed, we might need a separate API call per scheme or a bulk API.
    // For this demo, we'll skip merging analytics to avoid mismatch or performance issues 
    // until the backend supports "analytics by scheme codes".

    // However, to keep the table working as before (with potential missing analytics), 
    // we can try to fetch analytics for the same page, assuming they are sorted similarly (risky).
    // Or we can just show Scheme Master data for now.

    const data: FundData[] = useMemo(() => {
        return schemes.map((scheme) => ({
            ...scheme,
            // Analytics data is omitted for now as we can't efficiently fetch it for just these schemes
            // without a new backend endpoint.
        }));
    }, [schemes]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Fund Explorer</h2>
            </div>
            <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
            />
        </div>
    );
}
