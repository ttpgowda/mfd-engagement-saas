'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeadService } from '@/services/leadService';
import { UserService } from '@/services/api';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const leadFormSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).optional(),
});

export default function LeadsPage() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: LeadService.getAllLeads,
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: UserService.getAllUsers, // Ensure UserService is imported
    });

    const createLeadMutation = useMutation({
        mutationFn: LeadService.createLead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            setIsOpen(false);
            form.reset();
        },
    });

    const assignLeadMutation = useMutation({
        mutationFn: ({ leadId, userId }: { leadId: number; userId: number }) =>
            LeadService.assignLead(leadId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            setAssignDialogOpen(false);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ leadId, status }: { leadId: number; status: string }) =>
            LeadService.updateStatus(leadId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            setStatusDialogOpen(false);
        },
    });

    const form = useForm<z.infer<typeof leadFormSchema>>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            source: '',
            status: 'NEW',
        },
    });

    function onSubmit(values: z.infer<typeof leadFormSchema>) {
        createLeadMutation.mutate(values);
    }

    // Event Listeners
    if (typeof window !== 'undefined') {
        window.addEventListener('open-assign-lead', (e: any) => {
            setSelectedLead(e.detail);
            setAssignDialogOpen(true);
        });
        window.addEventListener('open-update-status', (e: any) => {
            setSelectedLead(e.detail);
            setSelectedStatus(e.detail.status);
            setStatusDialogOpen(true);
        });
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Lead
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Lead</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1234567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Source</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Website, Referral, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={createLeadMutation.isPending}>
                                    {createLeadMutation.isPending ? 'Creating...' : 'Create Lead'}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Captured Leads</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div>Loading leads...</div>
                    ) : (
                        <DataTable columns={columns} data={leads || []} />
                    )}
                </CardContent>
            </Card>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Lead: {selectedLead?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select User</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">Select a user...</option>
                                {users?.map((user: any) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName || user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => {
                                if (selectedLead && selectedUserId) {
                                    assignLeadMutation.mutate({
                                        leadId: selectedLead.id,
                                        userId: parseInt(selectedUserId),
                                    });
                                }
                            }}
                            disabled={assignLeadMutation.isPending || !selectedUserId}
                        >
                            {assignLeadMutation.isPending ? 'Assigning...' : 'Assign'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Status Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status: {selectedLead?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="QUALIFIED">QUALIFIED</option>
                                <option value="CONVERTED">CONVERTED</option>
                                <option value="LOST">LOST</option>
                            </select>
                        </div>
                        <Button
                            className="w-full"
                            onClick={() => {
                                if (selectedLead && selectedStatus) {
                                    updateStatusMutation.mutate({
                                        leadId: selectedLead.id,
                                        status: selectedStatus,
                                    });
                                }
                            }}
                            disabled={updateStatusMutation.isPending}
                        >
                            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
