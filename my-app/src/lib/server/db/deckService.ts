import { resolveRoute } from '$app/paths';
import {db} from './index';
import { cards, deckCards } from './schema';
import { eq } from 'drizzle-orm'

const MAX_COPIES=3;

export async function addCardToDeck(cardId: number) {
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