const BASE_URL = "https://db.ygoprodeck.com/api/v7";

type CardFilters={
    fname?:string;
    type?:string;
    level?:string;
    attribute?:string;
    race?:string;
}

export async function searchCards(filters: CardFilters) {

    const params=new URLSearchParams()

    if (filters.fname) params.set('fname', filters.fname);
    if (filters.type) params.set('type', filters.type);
    if (filters.level) params.set('level', filters.level);
    if (filters.attribute) params.set('attribute', filters.attribute);
    if (filters.race) params.set('race', filters.race);

    if ([...params].length===0){
        return [];
    }

    const res= await fetch(`${BASE_URL}/cardinfo.php?${params}`);

    if (!res.ok) {
        throw new Error('Errore nel recupero delle carte');
    }

    const data = await res.json();
    return data.data ?? [];
}
