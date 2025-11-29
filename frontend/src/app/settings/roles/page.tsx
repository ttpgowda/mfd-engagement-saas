'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { roleService, Role } from '@/services/roleService';
import { RoleForm } from '@/components/roles/role-form';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
    const { toast } = useToast();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await roleService.getAllRoles();
            setRoles(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load roles',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        try {
            await roleService.deleteRole(id);
            toast({ title: 'Success', description: 'Role deleted successfully' });
            loadRoles();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete role',
                variant: 'destructive',
            });
        }
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        setEditingRole(undefined);
        loadRoles();
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Role Management</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingRole(undefined)}>
                            <Plus className="mr-2 h-4 w-4" /> Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingRole ? 'Edit Role' : 'Create New Role'}
                            </DialogTitle>
                        </DialogHeader>
                        <RoleForm
                            role={editingRole}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.description}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.map((p) => (
                                            <span
                                                key={p.id}
                                                className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                                            >
                                                {p.name}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(role)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => handleDelete(role.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
