import {env} from '$env/dynamic/private';
import {fail} from '@sveltejs/kit'
import {syncCards, getSyncState} from '$lib/server/db/syncService';
import type { PageServerLoad, Actions } from '../carte/$types';

export const load: PageServerLoad = async () => {
    return {state: await getSyncState()};
};

export const actions: Actions = {
    sync: async({request}) => {
        const formData = await request.formData();
        const password = formData.get('password')?.toString() ?? ''; 

        if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
        return fail(403, {success: false, message: 'Password non valida'});
    }

    return await syncCards({force: true});

    }

};