const BASE_URL = "https://db.ygoprodeck.com/api/v7";

export async function searchCards(name: string) {
    const res= await fetch(`${BASE_URL}/cardinfo.php?fname=${name}`);

    if (!res.ok) {
        throw new Error('Errore nel recupero delle carte');
    }

    const data = await res.json();
    return data.data ?? [];
}
