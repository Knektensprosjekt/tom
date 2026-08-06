/* Ordbank for ordklasse-øvelsen.
   Utkast: kun VERB-verdenen.

   Alle ord er valgt slik at ordklassen er entydig i den formen som vises.
   Ord som kan være flere ordklasser (leke, tur, spill, løp) er holdt utenfor
   nybegynnernivåene, og brukes bare bevisst i ekspertoppgaver senere. */

const ORDBANK = {
    /* Verb i infinitiv, med bøyde former til tidsprøven.
       na = presens ("I dag ..."), for = preteritum ("I går ...") */
    verb: [
        { ord: 'hoppe',   na: 'hopper',   for: 'hoppet' },
        { ord: 'sove',    na: 'sover',    for: 'sov' },
        { ord: 'spise',   na: 'spiser',   for: 'spiste' },
        { ord: 'drikke',  na: 'drikker',  for: 'drakk' },
        { ord: 'lese',    na: 'leser',    for: 'leste' },
        { ord: 'skrive',  na: 'skriver',  for: 'skrev' },
        { ord: 'synge',   na: 'synger',   for: 'sang' },
        { ord: 'svømme',  na: 'svømmer',  for: 'svømte' },
        { ord: 'klatre',  na: 'klatrer',  for: 'klatret' },
        { ord: 'sykle',   na: 'sykler',   for: 'syklet' },
        { ord: 'tegne',   na: 'tegner',   for: 'tegnet' },
        { ord: 'bygge',   na: 'bygger',   for: 'bygde' },
        { ord: 'kaste',   na: 'kaster',   for: 'kastet' },
        { ord: 'gråte',   na: 'gråter',   for: 'gråt' },
        { ord: 'snakke',  na: 'snakker',  for: 'snakket' },
        { ord: 'tenke',   na: 'tenker',   for: 'tenkte' },
        { ord: 'vaske',   na: 'vasker',   for: 'vasket' },
        { ord: 'rydde',   na: 'rydder',   for: 'ryddet' },
        { ord: 'grave',   na: 'graver',   for: 'gravde' },
        { ord: 'hviske',  na: 'hvisker',  for: 'hvisket' },
        { ord: 'smile',   na: 'smiler',   for: 'smilte' },
        { ord: 'vinke',   na: 'vinker',   for: 'vinket' },
        { ord: 'klippe',  na: 'klipper',  for: 'klippet' },
        { ord: 'glemme',  na: 'glemmer',  for: 'glemte' },
        { ord: 'hjelpe',  na: 'hjelper',  for: 'hjalp' },
        { ord: 'lete',    na: 'leter',    for: 'lette' },
        { ord: 'kjøpe',   na: 'kjøper',   for: 'kjøpte' },
        { ord: 'vente',   na: 'venter',   for: 'ventet' },
        { ord: 'krype',   na: 'kryper',   for: 'krøp' },
        { ord: 'hoste',   na: 'hoster',   for: 'hostet' }
    ],

    /* Ord som IKKE er verb. Klassen står her fordi forklaringen ved feil
       skal kunne si hva ordet faktisk er. */
    ikkeVerb: [
        { ord: 'hund',     klasse: 'substantiv' },
        { ord: 'sykkel',   klasse: 'substantiv' },
        { ord: 'skole',    klasse: 'substantiv' },
        { ord: 'vindu',    klasse: 'substantiv' },
        { ord: 'banan',    klasse: 'substantiv' },
        { ord: 'jakke',    klasse: 'substantiv' },
        { ord: 'lærer',    klasse: 'substantiv' },
        { ord: 'stol',     klasse: 'substantiv' },
        { ord: 'sekk',     klasse: 'substantiv' },
        { ord: 'venn',     klasse: 'substantiv' },
        { ord: 'sommer',   klasse: 'substantiv' },
        { ord: 'kanin',    klasse: 'substantiv' },
        { ord: 'blyant',   klasse: 'substantiv' },
        { ord: 'brød',     klasse: 'substantiv' },
        { ord: 'fjell',    klasse: 'substantiv' },
        { ord: 'blå',      klasse: 'adjektiv' },
        { ord: 'stor',     klasse: 'adjektiv' },
        { ord: 'glad',     klasse: 'adjektiv' },
        { ord: 'sur',      klasse: 'adjektiv' },
        { ord: 'rask',     klasse: 'adjektiv' },
        { ord: 'tung',     klasse: 'adjektiv' },
        { ord: 'myk',      klasse: 'adjektiv' },
        { ord: 'kald',     klasse: 'adjektiv' },
        { ord: 'gul',      klasse: 'adjektiv' },
        { ord: 'sterk',    klasse: 'adjektiv' },
        { ord: 'liten',    klasse: 'adjektiv' },
        { ord: 'morsom',   klasse: 'adjektiv' }
    ],

};

/* Reserveløsning hvis ordklasser-setninger.js ikke er lastet. Den store
   setningsbanken ligger der. Formatet er likt: verbIndeks og subjektIndeks
   peker på plassen til ordet når setningen deles på mellomrom. */
const RESERVESETNINGER = [
    { tekst: 'Hunden løper etter ballen.',        verb: ['løper'],            verbIndeks: [1],    subjekt: 'Hunden', subjektIndeks: 0, niva: 1 },
    { tekst: 'Emma sykler til skolen.',           verb: ['sykler'],           verbIndeks: [1],    subjekt: 'Emma',   subjektIndeks: 0, niva: 1 },
    { tekst: 'Katten sover på stolen.',           verb: ['sover'],            verbIndeks: [1],    subjekt: 'Katten', subjektIndeks: 0, niva: 2 },
    { tekst: 'Barna bygger en hytte i skogen.',   verb: ['bygger'],           verbIndeks: [1],    subjekt: 'Barna',  subjektIndeks: 0, niva: 2 },
    { tekst: 'Vi spiser den varme suppa.',        verb: ['spiser'],           verbIndeks: [1],    subjekt: 'Vi',     subjektIndeks: 0, niva: 3 },
    { tekst: 'Anna tegner en grønn drage.',       verb: ['tegner'],           verbIndeks: [1],    subjekt: 'Anna',   subjektIndeks: 0, niva: 3 },
    { tekst: 'I dag baker mamma boller.',         verb: ['baker'],            verbIndeks: [2],    subjekt: 'mamma',  subjektIndeks: 3, niva: 4 },
    { tekst: 'Jonas løper ut og hopper over gjerdet.', verb: ['løper', 'hopper'], verbIndeks: [1, 4], subjekt: 'Jonas', subjektIndeks: 0, niva: 5 }
];

/* Huskeregelen. Ett bilde, to spørsmål, én sjekk. Samme tekst vises overalt:
   i banekartet, bak hjelpeknappen og hver gang eleven svarer feil.
   Ingen fagord - eleven skal kunne bruke setningene høyt for seg selv. */
const HUSKEREGEL_VERB = {
    kort: 'Verb er det som skjer.',
    sporsmal: 'Spør deg selv: <b>Hva skjer her?</b> Eller: <b>Hvem gjør noe — og hva gjør de?</b>',
    tid: 'Sjekk med tid: I dag <b>___</b>. I går <b>___</b>. Passer ordet i begge, er det et verb.',
    felle: 'Noen verb er ikke bevegelse: sove, tenke, hete, være, like. De er verb likevel — de skjer inni deg.'
};
