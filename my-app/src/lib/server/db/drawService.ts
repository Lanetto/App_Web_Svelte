import {db} from './index';
import {cards, deckCards, drawStates} from './schema';
import { eq, inArray } from 'drizzle-orm';
import { randomInt } from 'node:crypto';
import { groupOf } from '$lib/deckConfig';

const HAND_SIZE=5;

function shuffle<T>(array: T[]): T[]{
    const copy= [...array];
    for(let i=copy.length-1; i>0; i--){
        const j=randomInt(i+1);
        [copy[i], copy[j]]=[copy[j], copy[i]];
    }

    return copy;
}

async function shuffleMainDeck(sessionId: string): Promise<number[]> {
    const rows=await db
        .select()
        .from(deckCards)
        .where(eq(deckCards.sessionId, sessionId));

    const ids: number[]=[];

    for(const row of rows){
        if(groupOf(row.zone)!=='main') continue;
        for(let i=0; i<row.quantity; i++){
            ids.push(row.cardId);
        }
    }

    return shuffle(ids);

}

async function saveState(sessionId: string, hand: number[], library: number[]) {
    await db
        .insert(drawStates)
        .values({sessionId, hand, library})
        .onConflictDoUpdate({target: drawStates.sessionId, set: {hand, library}});
}

export async function drawHand(sessionId: string) {
    const library=await shuffleMainDeck(sessionId);

    if (library.length===0) {
        return {success:false, message: 'Il Main Deck è vuoto'};
    }

    await saveState(sessionId, library.slice(0, HAND_SIZE), library.slice(HAND_SIZE));
    return {success:true};
}

export async function drawOneCard(sessionId: string) {
    const state=await db
        .select()
        .from(drawStates)
        .where(eq(drawStates.sessionId, sessionId));

    const hand=state.length>0 ? state[0].hand :[];
    const library=state.length>0 ? state[0].library : await shuffleMainDeck(sessionId);

    if (library.length===0) {
        return {success: false, message: 'Non ci sono più carte nel Mazzo'};
    }

    await saveState(sessionId, [...hand, library[0]], library.slice(1));
    return {success: true};
}

export async function getHand(sessionId: string) {
    const state=await db
        .select()
        .from(drawStates)
        .where(eq(drawStates.sessionId, sessionId));
    
    if (state.length === 0 || state[0].hand.length===0) {
        return {hand: [], remaining: 0};
    }

    const ids= state[0].hand;
    const found=await db
        .select()
        .from(cards)
        .where(inArray(cards.id, [...new Set(ids)]));
    const byId=new Map(found.map((card)=>[card.id, card]));

    return {
        hand: ids.flatMap((id)=>byId.get(id)??[]),
        remaining: state[0].library.length
    };
}