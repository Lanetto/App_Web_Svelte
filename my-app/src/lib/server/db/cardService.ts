import {db} from './index';
import {cards} from './schema';
import {eq, and, like, gte, lte} from 'drizzle-orm';

type CardFilters={
    name?: string;
    type?: string;
    attribute?: string;
    race?: string;
    levelMin?: number;
    levelMax?: number;
    atkMin?: number;
    atkMax?: number;
    defMin?: number;
    defMax?: number;
}
    
export async function searchCards(filters: CardFilters) {
    
    const conditions= [];

    if (filters.name) {
        conditions.push(like(cards.name, `%${filters.name}%`));
    }
    if (filters.type) {
        conditions.push(eq(cards.type, filters.type));
    }
    if (filters.attribute) {
        conditions.push(eq(cards.attribute, filters.attribute));
    }
    if (filters.race) {
        conditions.push(eq(cards.race, filters.race));
    }
    if (filters.levelMin !== undefined) {
        conditions.push(gte(cards.level, filters.levelMin));
    }
    if (filters.levelMax !== undefined) {
        conditions.push(lte(cards.level, filters.levelMax));
    }
    if (filters.atkMin !== undefined) {
        conditions.push(gte(cards.atk, filters.atkMin));
    }
    if (filters.atkMax !== undefined) {
        conditions.push(lte(cards.atk, filters.atkMax));
    }
    if (filters.defMin !== undefined) {
        conditions.push(gte(cards.def, filters.defMin));
    }
    if (filters.defMax !== undefined) {
        conditions.push(lte(cards.def, filters.defMax));
    }

    const LIMIT=50;

    const result=await db
        .select()
        .from(cards)
        .where(conditions.length >0 ? and(...conditions): undefined)
        .limit(LIMIT);
        
    return result;
}