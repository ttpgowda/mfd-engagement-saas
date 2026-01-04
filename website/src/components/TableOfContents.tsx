"use client";

import { useEffect, useState } from "react";
import { cn, slugify } from "@/lib/utils";

interface TableOfContentsProps {
    headings: { text: string; level: number }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headings.forEach((heading) => {
            const id = slugify(heading.text);
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
                <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    On this page
                </h4>
                <nav className="flex flex-col space-y-2">
                    {headings.map((heading) => {
                        const id = slugify(heading.text);
                        return (
                            <a
                                key={id}
                                href={`#${id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(id)?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                                    setActiveId(id);
                                }}
                                className={cn(
                                    "text-sm hover:text-indigo-600 transition-colors block border-l-2 pl-4",
                                    activeId === id
                                        ? "border-indigo-600 text-indigo-600 font-medium"
                                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                                )}
                                style={{
                                    paddingLeft: heading.level === 3 ? "1.5rem" : "1rem"
                                }}
                            >
                                {heading.text}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
