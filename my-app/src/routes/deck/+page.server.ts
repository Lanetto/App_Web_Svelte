import {getDeck, getZoneTotal, removeCardFromDeck, type Zone} from '$lib/server/db/deckService';
import { request } from 'http';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () =>{
    const deck=await getDeck();

    return {deck};
};

export const actions: Actions={
    removeFromDeck : async ({request})=>{
        const formData=await request.formData();
        const cardId=Number(formData.get('cardId'));
        const zone=formData.get('zone') as Zone;

        await removeCardFromDeck(cardId, zone);

        return{succes:true};
    }
};