export const ZONES=[
    'main', 'engine', 'extender', 'starter', 'boardbreaker', 'handtrap', 'misc', 'extra', 'side'
] as const;

export type Zone=(typeof ZONES)[number];
export type ZoneGroup='main' | 'extra' | 'side';

export const EXTRA_DECK_TYPES=['Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster'];

export function groupOf(zone: Zone): ZoneGroup{
    if (zone==='extra') return 'extra';
    if (zone==='side') return 'side';
    return 'main';
}

export const GROUP_LIMITS: Record<ZoneGroup, number> = {main: 60, extra: 15, side: 15};
export const GROUP_LABELS: Record<ZoneGroup, string>= {
    main: 'Main Deck',
    extra: 'Extra Deck',
    side: 'Side Deck'
};

export const ZONE_LABELS: Record<Zone, string> = {
    main: 'Main Deck',
    engine: 'Engine Requirement',   
    extender: 'Extender',
    starter: 'Starter',
    boardbreaker: 'Boardbreaker',
    handtrap: 'HandTrap',
    misc: 'Misc',
    extra: 'Extra Deck',
    side: 'Side Deck'
};