import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { roleService, Role, Permission } from '@/services/roleService';
import { useToast } from '@/components/ui/use-toast';

interface RoleFormProps {
    role?: Role;
    onSuccess: () => void;
    onCancel: () => void;
}

export function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        role?.permissions.map((p) => p.id) || []
    );
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const { toast } = useToast();

    const loadPermissions = useCallback(async () => {
        try {
            const data = await roleService.getAllPermissions();
            setAllPermissions(data);
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to load permissions',
                variant: 'destructive',
            });
        }
    }, [toast]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPermissions();
    }, [loadPermissions]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const roleData = {
            name,
            description,
            permissions: selectedPermissions.map((id) => ({ id } as Permission)),
        };

        try {
            if (role) {
                await roleService.updateRole(role.id, roleData);
                toast({ title: 'Success', description: 'Role updated successfully' });
            } else {
                await roleService.createRole(roleData);
                toast({ title: 'Success', description: 'Role created successfully' });
            }
            onSuccess();
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save role',
                variant: 'destructive',
            });
        }
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 border p-4 rounded-md max-h-60 overflow-y-auto">
                    {allPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`perm-${permission.id}`}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                            />
                            <Label htmlFor={`perm-${permission.id}`} className="text-sm font-normal cursor-pointer">
                                {permission.name} - <span className="text-muted-foreground text-xs">{permission.description}</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
}
