import {getDeck, removeCardFromDeck, moveCardToZone} from '$lib/server/db/deckService';
import {type Zone} from '$lib/deckConfig';
import { request } from 'http';
import type { PageServerLoad, Actions } from './$types';
import { form } from '$app/server';

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
    },

    moveCard: async ({request}) => {
        const formData = await request.formData();
        const cardId=Number(formData.get('cardId'));
        const fromZone=formData.get('fromZone') as Zone;
        const toZone=formData.get('toZone') as Zone;

        return await moveCardToZone(cardId, fromZone, toZone);
    }
};