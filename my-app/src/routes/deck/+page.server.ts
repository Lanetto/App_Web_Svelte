import {getDeck, removeCardFromDeck} from '$lib/server/db/deckService';
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

        await removeCardFromDeck(cardId);

        return{succes:true};
    }
};