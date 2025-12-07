import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function RecentSales() {
    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">HDFC Top 100</p>
                    <p className="text-sm text-muted-foreground">
                        Large Cap
                    </p>
                </div>
                <div className="ml-auto font-medium">+12.5%</div>
            </div>
            <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">SBI Small Cap</p>
                    <p className="text-sm text-muted-foreground">Small Cap</p>
                </div>
                <div className="ml-auto font-medium">+24.0%</div>
            </div>
            <div className="flex items-center">
                <Avatar className="h-9 w-9">
                    <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">ICICI Bluechip</p>
                    <p className="text-sm text-muted-foreground">
                        Large Cap
                    </p>
                </div>
                <div className="ml-auto font-medium">+10.2%</div>
            </div>
        </div>
    );
}
