import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios from "@/lib/axios";

interface LeadCaptureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shortCode: string;
}

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email address").optional().or(z.literal("")),
    phone: z.string().regex(/^(?:\+91|0)?[6-9]\d{9}$/, "Invalid mobile number (10 digits)"),
});

export function LeadCaptureModal({ open, onOpenChange, shortCode }: LeadCaptureModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setSubmitError(null);
        try {
            await axios.post(`/public/links/${shortCode}/leads`, values);

            // Success
            localStorage.setItem('lead_token', 'captured-' + shortCode + '-' + Date.now());
            onOpenChange(false);
            form.reset();
        } catch (err) {
            console.error(err);
            setSubmitError("Failed to submit details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Unlock Full Access</DialogTitle>
                    <DialogDescription>
                        You've been exploring for a while! Enter your details to save your progress and get a detailed report.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="9999999999" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Continue
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
