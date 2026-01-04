"use client";

import { Button, Input } from "@/components/ui/base";

export function NewsletterForm() {
    return (
        <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <Button className="w-full">Subscribe</Button>
        </form>
    );
}
