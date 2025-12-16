"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axiosPublic from "axios";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    helperText?: string;
    maxSizeMB?: number; // default 2MB
}

export function LogoUpload({
    label,
    value,
    onChange,
    className,
    helperText = "Recommended: 512x512px, PNG/JPG",
    maxSizeMB = 2
}: LogoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | undefined>(value);

    // Sync preview with external value if changed
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`File too large. Max size is ${maxSizeMB}MB.`);
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'].includes(file.type)) {
            toast.error("Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Use axiosPublic to avoid auth interceptor issues for this public endpoint if needed,
            // or standard axios if we implemented auth correctly.
            // Using /api/public/upload as implemented in backend.
            const apiClient = axiosPublic.create({
                baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
            });

            const res = await apiClient.post("/api/public/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const url = res.data.url;
            // If URL is relative, ensure we handle it correctly in rendering. 
            // Backend returns relative "/uploads/filename".

            onChange(url);
            setPreview(url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange("");
        setPreview(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const imageUrl = preview && preview.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${preview}`
        : preview;

    return (
        <div className={cn("space-y-2", className)}>
            <Label>{label}</Label>

            <div className="relative">
                {preview ? (
                    <div className="relative border-2 border-solid border-border rounded-xl overflow-hidden aspect-video w-full max-w-[200px]">
                        <img
                            src={imageUrl}
                            alt={label}
                            className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 px-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-1" /> Change
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label
                        className={cn(
                            "flex flex-col items-center justify-center h-32 w-full max-w-[200px] cursor-pointer",
                            "border-2 border-dashed rounded-xl transition-all duration-200",
                            "hover:border-primary/50 hover:bg-muted/30",
                            uploading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="text-center p-4">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
                            ) : (
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            )}
                            <span className="text-xs text-muted-foreground block font-medium">
                                {uploading ? "Uploading..." : "Click to upload"}
                            </span>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                    </label>
                )}

                {/* Hidden input for the 'Change' button case since it's outside the label now */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />
            </div>
            {helperText && <p className="text-[10px] text-muted-foreground">{helperText}</p>}
        </div>
    );
}
