"use client";

import { useEffect } from "react";

interface ClientPageTitleProps {
    title: string;
}

export function ClientPageTitle({ title }: ClientPageTitleProps) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}
