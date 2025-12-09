import { useEffect, useRef, useState } from 'react';
import axios from '@/lib/axios';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const LEAD_CAPTURE_TRIGGER = 60000; // 60 seconds

const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useAnalytics = (shortCode: string | undefined) => {
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const sessionIdRef = useRef<string>('');
    const startTimeRef = useRef<number>(Date.now());

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
        sendHeartbeat(shortCode, sid, 0);

        // Heartbeat Interval
        const intervalId = setInterval(() => {
            const currentSid = localStorage.getItem('analytics_session_id') || sessionIdRef.current;
            sendHeartbeat(shortCode, currentSid, HEARTBEAT_INTERVAL / 1000);
        }, HEARTBEAT_INTERVAL);

        // Lead Capture Timer
        const timeoutId = setTimeout(() => {
            const hasLeadToken = localStorage.getItem('lead_token');
            if (!hasLeadToken) {
                setShowLeadCapture(true);
            }
        }, LEAD_CAPTURE_TRIGGER);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [shortCode]);

    const sendHeartbeat = async (code: string, sid: string, duration: number) => {
        try {
            // Use configured axios instance to ensure X-Tenant-ID header and Auth tokens are sent
            const response = await axios.post('/public/analytics/heartbeat', {
                shortCode: code,
                sessionId: sid,
                durationDelta: duration
            });
        } catch (e) {
            console.error("Heartbeat failed", e);
        }
    };

    return { showLeadCapture, setShowLeadCapture };
};
