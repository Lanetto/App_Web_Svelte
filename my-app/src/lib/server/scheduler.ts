import {syncCards, getSyncState} from './db/syncService';

const WEEK_MS=7*24*60*60*1000;
const CHECK_EVERY_MS=60*60*1000;

async function maybeSync() {
    const state= await getSyncState();
    const last= state?.lastSyncAt?.getTime() ?? 0;

    if (Date.now()-last >= WEEK_MS) {
        console.log('[sync] avvio sincronizzazione automatica');
        const result= await syncCards();
        console.log('[sync]', result.message);
    }
}

export function startScheduler() {
    const g= globalThis as {__syncSchedulerStarted?: boolean};
    if (g.__syncSchedulerStarted) {
        return g.__syncSchedulerStarted = true;
    }

    maybeSync().catch(console.error);
    setInterval(() => maybeSync().catch(console.error), CHECK_EVERY_MS);
}