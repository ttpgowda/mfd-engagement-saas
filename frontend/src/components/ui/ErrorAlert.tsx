// File: src/components/ui/ErrorAlert.tsx

import React from 'react';
import { AlertCircle } from 'lucide-react'; // Ensure lucide-react is installed

interface ErrorAlertProps {
    message: string | null;
    title?: string;
}

/**
 * Renders a standardized, animated alert box for displaying calculation errors.
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
                                                          message,
                                                          title = "Calculation Failed"
                                                      }) => {
    if (!message) return null;

    return (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-1 min-w-0">
                    <h5 className="font-medium text-red-900 dark:text-red-200 text-sm truncate">
                        {title}
                    </h5>
                    {/* The main error message from the backend */}
                    <p className="text-sm text-red-700 dark:text-red-300 opacity-90 leading-relaxed break-words">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};