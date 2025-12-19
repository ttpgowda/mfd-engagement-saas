import { useEffect, useRef, useState, useCallback } from 'react';
import axios from '@/lib/axios';
import { useSearchParams } from 'next/navigation';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const LEAD_CAPTURE_TRIGGER = 60000; // 60 seconds
const DEBOUNCE_DELAY = 1000; // 1 second for interaction debouncing

const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useAnalytics = (shortCode: string | undefined, toolSlug?: string) => {
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const sessionIdRef = useRef<string>('');
    const params = useSearchParams();
    const parentShortCode = params?.get('ref') || undefined;

    // Interaction Tracking Refs
    const interactionCountRef = useRef(0);
    const pendingInteractionRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!shortCode) return;

        // Initialize Session ID
        let sid = localStorage.getItem('analytics_session_id');
        if (!sid) {
            sid = generateSessionId();
            localStorage.setItem('analytics_session_id', sid);
        }
        sessionIdRef.current = sid;

        // Initial View Event
        sendEvent(shortCode, sid, 0, 'VIEW', parentShortCode);

        // Heartbeat Interval
        const intervalId = setInterval(() => {
            const currentSid = localStorage.getItem('analytics_session_id') || sessionIdRef.current;
            sendEvent(shortCode, currentSid, HEARTBEAT_INTERVAL / 1000, 'HEARTBEAT', undefined);
        }, HEARTBEAT_INTERVAL);

        // Lead Capture Timer
        const timeoutId = setTimeout(() => {
            const hasLeadToken = localStorage.getItem('lead_token');
            const surveyTools = ['financial-health-check', 'risk-profiler', 'goal-readiness', 'retirement-prep'];
            const isSurvey = surveyTools.includes(toolSlug || '');

            if (!isSurvey && !hasLeadToken) {
                setShowLeadCapture(true);
            }
        }, LEAD_CAPTURE_TRIGGER);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [shortCode, parentShortCode, toolSlug]);

    const sendEvent = async (code: string, sid: string, duration: number, listType: string, parent?: string) => {
        try {
            await axios.post('/public/analytics/heartbeat', {
                shortCode: code,
                toolSlug: toolSlug,
                sessionId: sid,
                durationDelta: duration,
                eventType: listType,
                parentShortCode: parent
            });
        } catch (e) {
            console.error("Analytics failed", e);
        }
    };

    const trackInteraction = useCallback(() => {
        if (!shortCode) return;

        if (pendingInteractionRef.current) {
            clearTimeout(pendingInteractionRef.current);
        }

        pendingInteractionRef.current = setTimeout(() => {
            interactionCountRef.current += 1;
            const currentSid = localStorage.getItem('analytics_session_id') || sessionIdRef.current;
            sendEvent(shortCode, currentSid, 0, 'INTERACTION', undefined);
        }, DEBOUNCE_DELAY);
    }, [shortCode, toolSlug]);

    const trackConversion = useCallback((label?: string) => {
        if (!shortCode) return;
        const currentSid = localStorage.getItem('analytics_session_id') || sessionIdRef.current;
        sendEvent(shortCode, currentSid, 0, 'CONVERSION', undefined);
    }, [shortCode, toolSlug]);

    return { showLeadCapture, setShowLeadCapture, trackInteraction, trackConversion };
};
