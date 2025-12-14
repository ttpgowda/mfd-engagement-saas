import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'mfd_survey_session_id';

export function useSession() {
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        let sid = localStorage.getItem(SESSION_KEY);
        if (!sid) {
            sid = uuidv4();
            localStorage.setItem(SESSION_KEY, sid!);
        }
        setSessionId(sid!);
    }, []);

    return sessionId;
}
