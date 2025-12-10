'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { UserService, AuthService } from '@/services/api';

export function UserNav() {
    const router = useRouter();
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: UserService.getCurrentUser,
        retry: false, // Don't retry on 401 errors
        enabled: typeof window !== 'undefined' && (!!localStorage.getItem('token') || document.cookie.includes('token=')), // Fetch if token exists in storage or cookie
    });

    const handleLogout = async () => {
        try {
            if (user?.username) {
                await AuthService.logout(user.username);
            }
        } catch (e) {
            console.error("Logout failed", e);
        }

        // Clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Redirect to login
        router.push('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@admin" />
                        <AvatarFallback>{user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName || user?.username || 'Admin'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || 'admin@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                        {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    {/*<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>*/}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
