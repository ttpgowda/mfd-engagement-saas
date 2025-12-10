'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateService, Template } from '@/services/templateService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Edit, Trash2, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default function AdminTemplatesPage() {
    const queryClient = useQueryClient();

    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: TemplateService.getAllTemplates,
        retry: false,
    });

    const deleteMutation = useMutation({
        mutationFn: TemplateService.deleteTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            toast({ title: 'Deleted', description: 'Template deleted successfully' });
        },
        onError: () => {
            toast({ title: 'Error', description: 'Failed to delete template', variant: 'destructive' });
        }
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Templates</h2>
                    <p className="text-muted-foreground">Create and manage marketing templates for your tenants.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/admin/templates/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create New
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>All Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Preview</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading templates...
                                    </TableCell>
                                </TableRow>
                            ) : templates && templates.length > 0 ? (
                                templates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>{template.id}</TableCell>
                                        <TableCell>
                                            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border">
                                                {template.previewImageUrl ? (
                                                    <img src={template.previewImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{template.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{template.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{template.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {/* Fallback if createdAt is missing usually handled by DB default but nice to have safely */}
                                            {template.createdAt ? format(new Date(template.createdAt), 'MMM d, yyyy') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/templates/${template.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                                    onClick={() => handleDelete(template.id!)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No templates found. Create one to get started!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
