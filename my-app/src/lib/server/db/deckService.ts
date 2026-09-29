import { resolveRoute } from '$app/paths';
import { setDefaultCACertificates } from 'tls';
import {db} from './index';
import { cards, deckCards } from './schema';
import { and, eq, sql } from 'drizzle-orm'

export type Zone= 'main'|'extra'|'side';

const MAX_COPIES=3;
const EXTRA_DECK_TYPES=['Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster'];

const LIMITS: Record<Zone, number>={main:60, extra:15, side:15};
const LABELS: Record<Zone, string>={main:'Main Deck', extra:'Extra Deck', side:'Side Deck'};

export async function getZoneTotal(zone: Zone): Promise<number> {
    const result=await db
        .select({total:sql<number>`sum(${deckCards.quantity})`})
        .from(deckCards)
        .where(eq(deckCards.zone, zone));

        return result[0].total ?? 0;
    
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

    const zoneTotal= await getZoneTotal(zone);
    if (zoneTotal>=LIMITS[zone]) {
        return {
            success:false,
            message: `${LABELS[zone]} ha già raggiunto il massimo di ${LIMITS[zone]} carte`
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
        zoneLabel: LABELS[zone],
        total:zoneTotal+1,
        limit:LIMITS[zone]
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