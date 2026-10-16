import {getDeck, removeCardFromDeck, moveCardToZone} from '$lib/server/db/deckService';
import {type Zone} from '$lib/deckConfig';
import { drawHand, drawOneCard, getHand } from '$lib/server/db/drawService';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({locals}) =>{
    const deck=await getDeck(locals.sessionId);
    const {hand, remaining}=await getHand(locals.sessionId);

    return {deck, hand, remaining};
};

export const actions: Actions={
    removeFromDeck : async ({request, locals})=>{
        const formData=await request.formData();
        const cardId=Number(formData.get('cardId'));
        const zone=formData.get('zone') as Zone;

        await removeCardFromDeck(locals.sessionId, cardId, zone);

        return{succes:true};
    },

    moveCard: async ({request, locals}) => {
        const formData = await request.formData();
        const cardId=Number(formData.get('cardId'));
        const fromZone=formData.get('fromZone') as Zone;
        const toZone=formData.get('toZone') as Zone;

        return await moveCardToZone(locals.sessionId, cardId, fromZone, toZone);
    }
};