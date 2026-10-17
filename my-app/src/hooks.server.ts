import type { Handle } from "@sveltejs/kit";
import {building} from '$app/environment';
import { startScheduler } from "$lib/server/scheduler";

if (!building) {
    startScheduler();
}

export const handle: Handle = async ({event, resolve}) =>{
    let sessionId=event.cookies.get('session');

    if (!sessionId) {
        sessionId=crypto.randomUUID();
        event.cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365
        });
    }

    event.locals.sessionId=sessionId;

    return resolve(event);
}
