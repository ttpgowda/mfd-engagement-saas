import { LucideIcon } from "lucide-react";

export interface ResearchToolItem {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    component: React.ComponentType;
}
