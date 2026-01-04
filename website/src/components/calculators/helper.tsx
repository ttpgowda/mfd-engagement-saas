import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    subtext?: string;
    icon: LucideIcon;
    colorClass: string;
}

export const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: StatCardProps) => (
    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-full bg-white ${colorClass}`}><Icon className="w-4 h-4" /></div>
            <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

export const CurrencyFormatter = (value?: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
