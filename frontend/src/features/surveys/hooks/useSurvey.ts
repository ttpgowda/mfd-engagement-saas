import { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';

interface SurveyConfig {
    surveyType: string;
    sharedCode?: string;
}

export function useSurvey({ surveyType, sharedCode }: SurveyConfig) {
    const sessionId = useSession();
    const [responseId, setResponseId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const startTime = useRef(Date.now());

    // Debounced save helper (simplified for now)
    const saveProgress = async (data: unknown, metadata: Record<string, unknown> = {}) => {
        if (!sessionId) return;

        setIsSaving(true);
        try {
            const payload = {
                surveyType,
                sessionId,
                sharedCode: sharedCode || 'demo',
                responseData: data,
                metadata: {
                    ...metadata,
                    userAgent: navigator.userAgent,
                    timeSpentSeconds: Math.floor((Date.now() - startTime.current) / 1000),
                    url: window.location.href
                }
            };

            const res = await axios.post('/public/surveys/submit', payload);
            setResponseId(res.data);
            return res.data;
        } catch (error) {
            console.error("Auto-save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    const submitLead = async (leadDetails: { name: string; email: string; phone: string }) => {
        if (!responseId) {
            console.error("Cannot link lead without a response ID. Ensure progress is saved first.");
            // Try to save first if ID is missing? For now, we assume saveProgress was called at 'Report' step.
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...leadDetails,
                surveyType // redundant but helpful context
            };
            const res = await axios.post(`/public/surveys/${responseId}/link-lead`, payload);
            localStorage.setItem('lead_token', 'captured-survey-' + Date.now());
            toast.success("Profile Saved!");
            return res.data; // Lead ID
        } catch (error) {
            console.error(error);
            toast.error("Failed to link lead.");
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        sessionId,
        responseId,
        isSaving,
        saveProgress,
        submitLead
    };
}
