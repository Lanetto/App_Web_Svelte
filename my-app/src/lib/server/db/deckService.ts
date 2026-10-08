import { resolveRoute } from '$app/paths';
import { setDefaultCACertificates } from 'tls';
import {db} from './index';
import { cards, deckCards } from './schema';
import { and, eq, sql } from 'drizzle-orm'
import { type Zone, type ZoneGroup, EXTRA_DECK_TYPES, GROUP_LABELS, GROUP_LIMITS, groupOf } from '$lib/deckConfig';

const MAX_COPIES=3;

export async function GetGroupTotal(group:ZoneGroup): Promise<number> {
    const rows=await db
        .select({zone: deckCards.zone, quantity: deckCards.quantity})
        .from(deckCards);

    return rows
        .filter((row)=>groupOf(row.zone)===group)
        .reduce((sum, row)=>sum+row.quantity, 0);
}


export async function addCardToDeck(cardId: number, target?: string) {

    const found=await db
        .select()
        .from(cards)
        .where(eq(cards.id, cardId));

    let zone: Zone;
    if (target=== 'side'){
        zone='side';
    }
    else {
        zone=EXTRA_DECK_TYPES.includes(found[0].type) ? 'extra' : 'main';
    }

    const group=groupOf(zone);
    const groupTotal=await GetGroupTotal(group);

    if (groupTotal>=GROUP_LIMITS[group]) {
        return {
            success:false,
            message: `${GROUP_LABELS[group]} ha già raggiunto il massimo di ${GROUP_LIMITS[group]} carte`
        };
    }

    const rows= await db
    .select()
    .from(deckCards)
    .where(eq(deckCards.cardId, cardId));

    const totalCopies=rows.reduce((sum, row)=> sum+row.quantity, 0);

    if (totalCopies>=MAX_COPIES) {
        return{
            success: false,
            message: `Hai già il massimo di ${MAX_COPIES} copie di questa carta`
        }
    }

    const existingInZone=rows.find((row)=> row.zone===zone);

    if (existingInZone) {
        await db
            .update(deckCards)
            .set({ quantity: existingInZone.quantity+1 })
            .where(eq(deckCards.id, existingInZone.id));
    }
    else {
        await db
            .insert(deckCards)
            .values({cardId, quantity:1, zone});
    }

    return{
        success:true,
        zoneLabel: GROUP_LABELS[group],
        total:groupTotal+1,
        limit:GROUP_LIMITS[group]
    };
}



export async function removeCardFromDeck(cardId: number, zone: Zone) {
	const existing = await db
		.select()
		.from(deckCards)
		.where(and(eq(deckCards.cardId, cardId), eq(deckCards.zone, zone)));

	if (existing.length === 0) {
		return; 
	}

	const newQuantity = existing[0].quantity - 1;

	if (newQuantity <= 0) {
		await db
			.delete(deckCards)
			.where(eq(deckCards.id, existing[0].id));
	} else {
		await db
			.update(deckCards)
			.set({ quantity: newQuantity })
			.where(eq(deckCards.id, existing[0].id));
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
            quantity:deckCards.quantity,
            zone: deckCards.zone
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

export async function moveCardToZone(cardId: number, fromZone: Zone, toZone: Zone) {
    if (fromZone===toZone){
        return {success: true};
    }

    const found = await db
        .select()
        .from(cards)
        .where(eq(cards.id, cardId));
    
    if (found.length===0) {
        return {success: false, message: 'Carta non trovata'};
    }

    const isExtraDeckCard=EXTRA_DECK_TYPES.includes(found[0].type);
    const fromGroup=groupOf(fromZone);
    const toGroup=groupOf(toZone);

    if (toGroup==='main' && isExtraDeckCard){
        return {success: false, message: 'Questa carta appartiene all\'Extra Deck'};
    }

    if (toGroup==='extra' && !isExtraDeckCard){
        return{success: false, message:'Questa carta appartiene al Main Deck'};
    }

    const sourceRows=await db
        .select()
        .from(deckCards)
        .where(and(eq(deckCards.cardId, cardId), eq(deckCards.zone, fromZone)));

        if (sourceRows.length===0) {
            return {success: false, message: 'Carta non trovata in quella zona'};
        }

        if(toGroup!==fromGroup){
            const targetTotal=await GetGroupTotal(toGroup);

            if(targetTotal>=GROUP_LIMITS[toGroup]){
                return{
                    success:false,
                    message:  `${GROUP_LABELS[toGroup]} ha già raggiunto il massimo di ${GROUP_LIMITS[toGroup]} carte`
                };
            }
        }

        const sourceRow=sourceRows[0];
        if (sourceRow.quantity<=1) {
            await db
                .delete(deckCards)
                .where(eq(deckCards.id, sourceRow.id));
        }
        else{
            await db
                .update(deckCards)
                .set({quantity: sourceRow.quantity-1})
                .where(eq(deckCards.id, sourceRow.id));
        }

        const targetRows= await db
            .select()
            .from(deckCards)
            .where(and(eq(deckCards.cardId, cardId), eq(deckCards.zone, toZone)));

        if (targetRows.length>0) {
            await db
                .update(deckCards)
                .set({quantity: targetRows[0].quantity+1})
                .where(eq(deckCards.id, targetRows[0].id));
        }
        else {
            await db
                .insert(deckCards)
                .values({cardId, quantity: 1, zone: toZone});
        }

        return {success: true};
}