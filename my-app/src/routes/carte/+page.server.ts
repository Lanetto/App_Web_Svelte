import {searchCards} from '$lib/server/ygoApi';
import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async () => {
    const cards = await searchCards('Constellar Castor');
    
    return {
        cards
    };
};  