import { ColumnDef } from '@tanstack/react-table';
import { Lead } from '@/services/leadService';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        accessorKey: 'assignedToName',
        header: 'Assigned To',
        cell: ({ row }) => row.getValue('assignedToName') || 'Unassigned',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            let variant: "default" | "secondary" | "destructive" | "outline" = "default";
            switch (status) {
                case 'NEW': variant = 'default'; break;
                case 'CONTACTED': variant = 'secondary'; break;
                case 'QUALIFIED': variant = 'outline'; break;
                case 'CONVERTED': variant = 'default'; break; // Greenish usually
                case 'LOST': variant = 'destructive'; break;
            }
            return (
                <Badge variant={variant}>
                    {status}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const lead = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(lead.id?.toString() || '')}
                        >
                            Copy Lead ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('open-assign-lead', { detail: lead }))}>
                            Assign Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('open-update-status', { detail: lead }))}>
                            Update Status
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
