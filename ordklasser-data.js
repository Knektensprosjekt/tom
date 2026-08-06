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

    /* Setninger med nøyaktig ETT verb. fasit må stå ordrett slik ordet
       skrives i setningen (uten skilletegn). */
    setninger: [
        { tekst: 'Hunden løper etter ballen.',            fasit: 'løper' },
        { tekst: 'Jeg leser en spennende bok.',           fasit: 'leser' },
        { tekst: 'Emma sykler til skolen.',               fasit: 'sykler' },
        { tekst: 'Katten sover på stolen.',               fasit: 'sover' },
        { tekst: 'Vi spiser middag klokka fem.',          fasit: 'spiser' },
        { tekst: 'Læreren skriver på tavla.',             fasit: 'skriver' },
        { tekst: 'Mamma vasker den røde bilen.',          fasit: 'vasker' },
        { tekst: 'Bestefar synger en gammel sang.',       fasit: 'synger' },
        { tekst: 'Barna bygger en hytte i skogen.',       fasit: 'bygger' },
        { tekst: 'Hesten hopper over det høye gjerdet.',  fasit: 'hopper' },
        { tekst: 'Anna tegner en grønn drage.',           fasit: 'tegner' },
        { tekst: 'Fuglene flyr sørover om høsten.',       fasit: 'flyr' },
        { tekst: 'Vi rydder klasserommet etter timen.',   fasit: 'rydder' },
        { tekst: 'Jonas kaster en stor snøball.',         fasit: 'kaster' },
        { tekst: 'Klassen svømmer i det kalde vannet.',   fasit: 'svømmer' },
        { tekst: 'Bestemor strikker en varm lue.',        fasit: 'strikker' },
        { tekst: 'Gutten klatrer opp i det store treet.', fasit: 'klatrer' },
        { tekst: 'Naboen graver et dypt hull i hagen.',   fasit: 'graver' }
    ]
};

/* Huskeregelen. Én regel, én prøve. Den samme teksten vises overalt:
   i banekartet, på hjelpeknappen og ved feil. */
const HUSKEREGEL_VERB = {
    kort: 'Verb er noe du gjør — eller er.',
    prove: 'Tidsprøven: I dag <b>___</b>. I går <b>___</b>. Passer ordet i begge, er det verb.',
    felle: 'Noen verb er ikke bevegelse: sove, tenke, hete, være. De består likevel tidsprøven.'
};
