"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();

    if (!pathname) return null;

    const segments = pathname.split("/").filter((item) => item !== "");

    if (segments.length === 0) return null;

    return (
        <Breadcrumb className={cn("mb-4 px-2", className)}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.length > 0 && <BreadcrumbSeparator />}

                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    // Check for UUID
                    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment);

                    // Capitalize and formatting
                    let title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

                    if (isUuid) {
                        title = "Details";
                    }

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold text-primary">{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href} className="hover:text-primary transition-colors">{title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
