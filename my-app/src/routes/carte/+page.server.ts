import {searchCards} from '$lib/server/ygoApi';
import type {PageServerLoad} from './$types';


/* Ricerca carta: load riceve l'URL dal quale estrae il parametro di ricerca q
    se non è presente, restituisce un array vuoto. Ritorniamo anche la query così
    da poterla visualizzare nella pagina*/
export const load: PageServerLoad = async ({url}) => {

    const filters= {
        fname: url.searchParams.get('fname') ?? '',
        type: url.searchParams.get('type') ?? '',
        level: url.searchParams.get('level') ?? '',
        attribute: url.searchParams.get('attribute') ?? '',
        race: url.searchParams.get('race') ?? '',
        archetype: url.searchParams.get('archetype') ?? '',
        cardset: url.searchParams.get('cardset') ?? ''
    }

    const cards = await searchCards(filters);
    
    return {
        cards, filters
    };
};  