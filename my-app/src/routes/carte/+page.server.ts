import {searchCards} from '$lib/server/db/cardService';
import type {PageServerLoad, Actions} from './$types';
import { addCardToDeck } from '$lib/server/db/deckService';

/* Ricerca carta: load riceve l'URL dal quale estrae il parametro di ricerca q
    se non è presente, restituisce un array vuoto. Ritorniamo anche la query così
    da poterla visualizzare nella pagina*/
export const load: PageServerLoad = async ({url}) => {

    const name = url.searchParams.get('name') ?? '';
    const type = url.searchParams.get('type') ?? '';
    const attribute = url.searchParams.get('attribute') ?? '';
    const race = url.searchParams.get('race') ?? '';

    const levelMinRaw = url.searchParams.get('levelMin') ?? '';
    const levelMaxRaw = url.searchParams.get('levelMax') ?? '';
    const atkMinRaw = url.searchParams.get('atkMin') ?? '';
    const atkMaxRaw = url.searchParams.get('atkMax') ?? '';
    const defMinRaw = url.searchParams.get('defMin') ?? '';
    const defMaxRaw = url.searchParams.get('defMax') ?? '';

    const levelMin = levelMinRaw ? Number(levelMinRaw) : undefined;
    const levelMax = levelMaxRaw ? Number(levelMaxRaw) : undefined;
    const atkMin = atkMinRaw ? Number(atkMinRaw) : undefined;
    const atkMax = atkMaxRaw ? Number(atkMaxRaw) : undefined;
    const defMin = defMinRaw ? Number(defMinRaw) : undefined;
    const defMax = defMaxRaw ? Number(defMaxRaw) : undefined;

    const cards= await searchCards({ 
        name,
        type,
        attribute,
        race,
        levelMin,
        levelMax,
        atkMin,
        atkMax,
        defMin,
        defMax
    });

    const filters = {
        name,
        type,
        attribute,
        race,
        levelMin: levelMinRaw,
        levelMax: levelMaxRaw,
        atkMin: atkMinRaw,
        atkMax: atkMaxRaw,
        defMin: defMinRaw,
        defMax: defMaxRaw
    };

    
    return {
        cards, filters
    };
};  

export const actions: Actions={
    addToDeck: async ({request})=>{
        const formData=await request.formData();
        const cadrId=Number(formData.get('cardId'));

        const result=await addCardToDeck(cadrId);

        return result;
    }
}