import { resolveRoute } from '$app/paths';
import {db} from './index';
import { cards, deckCards } from './schema';
import { eq, sql } from 'drizzle-orm'

const MAX_COPIES=3;
const MAx_CARDS=60;

export async function addCardToDeck(cardId: number) {

    const totalInDeck=await getDeckTotalCards();

    if (totalInDeck >= MAx_CARDS) {
        return{success: false, message: `Il mazzo ha già raggiunto il massimo di ${MAx_CARDS} carte`}
    }

    const existing=await db
        .select()
        .from(deckCards)
        .where(eq(deckCards.cardId, cardId));

    if(existing.length>0){
        const currentQuantity = existing[0].quantity;

		if (currentQuantity >= MAX_COPIES) {
			return { success: false, message: `Hai già il massimo di ${MAX_COPIES} copie di questa carta` };
		}
        await db
            .update(deckCards)
            .set({quantity: existing[0].quantity+1})
            .where(eq(deckCards.cardId, cardId));
    }
    else{
        await db
            .insert(deckCards).values({cardId, quantity:1});
    }

    const newTotal=await getDeckTotalCards();

    return {success: true, total: newTotal};
    
}

export async function removeCardFromDeck(cardId: number) {
	const existing = await db
		.select()
		.from(deckCards)
		.where(eq(deckCards.cardId, cardId));

	if (existing.length === 0) {
		return; 
	}

	const newQuantity = existing[0].quantity - 1;

	if (newQuantity <= 0) {
		await db
			.delete(deckCards)
			.where(eq(deckCards.cardId, cardId));
	} else {
		await db
			.update(deckCards)
			.set({ quantity: newQuantity })
			.where(eq(deckCards.cardId, cardId));
	}
}

export async function getDeck() {
    const result=await db
        .select({
            id:deckCards.id,
            cardId:cards.id,
            name: cards.name,
            type: cards.type,
            attribute: cards.attribute,
            race:cards.race,
            level:cards.level,
            atk:cards.atk,
            def:cards.def,
            imageUrl:cards.imageUrl,
            quantity:deckCards.quantity
        })
        .from(deckCards)
        .innerJoin(cards, eq(deckCards.cardId, cards.id));

        return result;
}

export async function getDeckTotalCards(): Promise<number> {
    const result=await db
        .select({total: sql<number>`sum(${deckCards.quantity})`})
        .from(deckCards);
        
        return result[0].total ?? 0;
}