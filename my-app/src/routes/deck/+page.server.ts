import {getDeck} from '$lib/server/db/deckService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () =>{
    const deck=await getDeck();

    return {deck};
};