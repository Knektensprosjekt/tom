/* Ordklasser - øvelse for 6. trinn. Utkast: VERB.

   Bevisste valg:
   - Vanlig script, ikke ES-modul, slik at sida også virker når fila åpnes
     direkte fra disk (file://). Moduler blokkeres av nettleseren der.
   - Laget for PC først: bredt oppsett, tastatursnarveier, tydelig
     hover-tilbakemelding. Faller sammen til én kolonne på mobil.
   - Ingen dra-og-slipp. Alt løses med trykk/klikk, så det virker likt overalt.
   - Ingen fagord i eleven sitt grensesnitt. Vi spør «Hva skjer her?», ikke
     «Hva er predikatet?».
   - Alt eleven trenger for å svare står på skjermen. Huskeregelen er alltid
     ett trykk unna, og koster ingenting. */

(function () {
    'use strict';

    var LAGRINGSNOKKEL = 'ordklasser.v1';

    /* ---------- Baner ---------- */

    var BANER = [
        {
            id: 'verb-1',
            navn: 'Skjer det noe?',
            undertittel: 'Ett ord om gangen',
            type: 'jaNei',
            antall: 10
        },
        {
            id: 'verb-2',
            navn: 'I dag og i går',
            undertittel: 'Kan ordet flytte seg i tid?',
            type: 'idagIgaar',
            antall: 10
        },
        {
            id: 'verb-3',
            navn: 'Hva skjer her?',
            undertittel: 'Finn ordet som forteller hva som skjer',
            type: 'hvaSkjer',
            nivaer: [1, 2, 3],
            antall: 10
        },
        {
            id: 'verb-4',
            navn: 'Hvem gjør noe?',
            undertittel: 'Først hvem — så hva de gjør',
            type: 'hvemGjor',
            nivaer: [2, 3, 4],
            antall: 8
        },
        {
            id: 'verb-5',
            navn: 'Rydd kurven',
            undertittel: 'Merk alle ordene som skjer',
            type: 'rydd',
            antall: 5
        },
        {
            id: 'verb-6',
            navn: 'Bossbanen',
            undertittel: 'Alt om hverandre, og litt vanskeligere',
            type: 'blandet',
            nivaer: [3, 4, 5],
            antall: 12
        }
    ];

    /* ---------- Tilstand ---------- */

    var tomTilstand = {
        versjon: 1,
        xp: 0,
        baner: {},
        innstillinger: { lyd: true },
        statistikk: { riktig: 0, feil: 0 }
    };

    var tilstand = les();
    var okt = null;      // aktiv økt, null når vi er på kartet
    var lagringVirker = true;
    var rot;

    function les() {
        try {
            var raa = localStorage.getItem(LAGRINGSNOKKEL);
            if (!raa) return kopi(tomTilstand);
            var lagret = JSON.parse(raa);
            if (lagret.versjon !== tomTilstand.versjon) return kopi(tomTilstand);
            return lagret;
        } catch (e) {
            lagringVirker = false;
            return kopi(tomTilstand);
        }
    }

    function lagre() {
        try {
            localStorage.setItem(LAGRINGSNOKKEL, JSON.stringify(tilstand));
        } catch (e) {
            /* Privat nettlesing eller fullt lager. Spillet skal virke ferdig
               ut økta uansett - eleven mister bare framgangen. */
            if (lagringVirker) {
                lagringVirker = false;
                visLagringsvarsel();
            }
        }
    }

    function kopi(o) { return JSON.parse(JSON.stringify(o)); }

    function baneStatus(id) {
        return tilstand.baner[id] || { stjerner: 0, forsok: 0 };
    }

    function erApen(indeks) {
        if (indeks === 0) return true;
        return baneStatus(BANER[indeks - 1].id).stjerner > 0;
    }

    /* ---------- Småverktøy ---------- */

    function bland(liste) {
        var a = liste.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function trekk(liste, antall) { return bland(liste).slice(0, antall); }
    function ett(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

    function el(tag, klasse, tekst) {
        var e = document.createElement(tag);
        if (klasse) e.className = klasse;
        if (tekst !== undefined) e.textContent = tekst;
        return e;
    }

    function tom(node) { while (node.firstChild) node.removeChild(node.firstChild); }

    function rent(ord) { return ord.replace(/[.,!?:;»«"]/g, ''); }

    function stor(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    /* Setningsbanken ligger i ordklasser-setninger.js. Faller tilbake på et
       lite utvalg hvis fila ikke er lastet, slik at sida aldri står tom. */
    function setningsbank() {
        if (typeof SETNINGER !== 'undefined' && SETNINGER.length) return SETNINGER;
        return RESERVESETNINGER;
    }

    function setningerPaaNiva(niva) {
        var treff = setningsbank().filter(function (s) { return s.niva === niva; });
        return treff.length ? treff : setningsbank();
    }

    /* ---------- Oppgavegenerering ---------- */

    function lagJaNei() {
        if (Math.random() < 0.5) {
            var v = ett(ORDBANK.verb);
            return {
                type: 'jaNei',
                sporsmal: 'Er dette noe som skjer?',
                ord: v.ord,
                fasit: true,
                forklaring: 'Ja. <b>' + v.ord + '</b> er et verb. I dag ' + v.na +
                    ' jeg. I går ' + v.for + ' jeg.'
            };
        }
        var i = ett(ORDBANK.ikkeVerb);
        return {
            type: 'jaNei',
            sporsmal: 'Er dette noe som skjer?',
            ord: i.ord,
            fasit: false,
            forklaring: 'Nei. <b>' + i.ord + '</b> er et ' + i.klasse +
                '. Det skjer ikke noe — det bare er der.'
        };
    }

    function lagIdagIgaar() {
        if (Math.random() < 0.5) {
            var v = ett(ORDBANK.verb);
            return {
                type: 'idagIgaar',
                sporsmal: 'Passer ordet i begge setningene?',
                ord: v.ord,
                fasit: true,
                forklaring: 'Ja! I dag <b>' + v.na + '</b> jeg. I går <b>' + v.for +
                    '</b> jeg. Ordet forandrer seg når tiden forandrer seg. Da er det et verb.'
            };
        }
        var i = ett(ORDBANK.ikkeVerb);
        return {
            type: 'idagIgaar',
            sporsmal: 'Passer ordet i begge setningene?',
            ord: i.ord,
            fasit: false,
            forklaring: 'Nei. «I dag <b>' + i.ord + '</b> jeg» blir tull. ' +
                stor(i.ord) + ' er et ' + i.klasse + '.'
        };
    }

    function lagHvaSkjer(niva) {
        var s = ett(setningerPaaNiva(niva));
        return {
            type: 'hvaSkjer',
            sporsmal: 'Hva skjer her?',
            hint: s.verb.length > 1 ? 'Det er to ting som skjer — trykk på begge' : null,
            setning: s,
            niva: s.niva,
            forklaring: s.verb.length > 1
                ? 'Her skjer det to ting: <b>' + s.verb.join('</b> og <b>') + '</b>.'
                : '<b>' + s.verb[0] + '</b> er det som skjer. Det er verbet.'
        };
    }

    function lagHvemGjor(niva) {
        var s = ett(setningerPaaNiva(niva));
        return {
            type: 'hvemGjor',
            steg: 1,
            sporsmal: 'Hvem eller hva gjør noe?',
            setning: s,
            niva: s.niva,
            forklaring: '<b>' + s.subjekt + '</b> er den som gjør noe, og ' +
                '<b>' + s.verb.join(' ') + '</b> er det de gjør.'
        };
    }

    function lagRydd() {
        var antallVerb = 3 + Math.floor(Math.random() * 2);   // 3 eller 4
        var verb = trekk(ORDBANK.verb, antallVerb).map(function (v) { return v.ord; });
        var andre = trekk(ORDBANK.ikkeVerb, 8 - antallVerb).map(function (i) { return i.ord; });
        return {
            type: 'rydd',
            sporsmal: 'Merk alle ordene som skjer, og trykk Sjekk',
            ord: bland(verb.concat(andre)),
            fasit: verb,
            forklaring: 'Verbene var: <b>' + verb.join(', ') + '</b>.'
        };
    }

    function lagOppgave(type, niva) {
        if (type === 'jaNei') return lagJaNei();
        if (type === 'idagIgaar') return lagIdagIgaar();
        if (type === 'hvaSkjer') return lagHvaSkjer(niva);
        if (type === 'hvemGjor') return lagHvemGjor(niva);
        if (type === 'rydd') return lagRydd();
        return lagOppgave(ett(['jaNei', 'idagIgaar', 'hvaSkjer', 'hvaSkjer', 'hvemGjor', 'rydd']), niva);
    }

    /* ---------- Kartet ---------- */

    function visKart() {
        okt = null;
        tom(rot);

        var topp = el('div', 'topplinje');
        topp.appendChild(el('span', 'xp', '⭐ ' + tilstand.xp + ' XP'));
        var lydKnapp = el('button', 'lyd-knapp', tilstand.innstillinger.lyd ? '🔊' : '🔇');
        lydKnapp.setAttribute('aria-label', 'Slå lyd av eller på');
        lydKnapp.title = 'Lyd av/på';
        lydKnapp.onclick = function () {
            tilstand.innstillinger.lyd = !tilstand.innstillinger.lyd;
            lagre();
            lydKnapp.textContent = tilstand.innstillinger.lyd ? '🔊' : '🔇';
        };
        topp.appendChild(lydKnapp);
        rot.appendChild(topp);

        if (!lagringVirker) rot.appendChild(lagringsvarsel());

        var kort = el('section', 'regelkort');
        kort.innerHTML =
            '<h2>Verb</h2>' +
            '<p class="regel">' + HUSKEREGEL_VERB.kort + '</p>' +
            '<p class="prove">' + HUSKEREGEL_VERB.sporsmal + '</p>';
        rot.appendChild(kort);

        var liste = el('ol', 'baneliste');
        BANER.forEach(function (bane, i) {
            var apen = erApen(i);
            var st = baneStatus(bane.id);

            var li = el('li', 'bane');
            var knapp = el('button', 'bane-knapp');
            knapp.disabled = !apen;

            var venstre = el('div', 'bane-tekst');
            venstre.appendChild(el('span', 'bane-navn', (i + 1) + '. ' + bane.navn));
            venstre.appendChild(el('span', 'bane-under', apen
                ? bane.undertittel
                : 'Klarer du forrige bane, åpner denne seg'));
            knapp.appendChild(venstre);

            var stjerner = el('span', 'stjerner');
            stjerner.textContent = apen
                ? '★★★'.slice(0, st.stjerner) + '☆☆☆'.slice(0, 3 - st.stjerner)
                : '🔒';
            knapp.appendChild(stjerner);

            knapp.onclick = function () { startOkt(bane); };
            li.appendChild(knapp);
            liste.appendChild(li);
        });
        rot.appendChild(liste);
    }

    /* ---------- Økt ---------- */

    function startOkt(bane) {
        okt = {
            bane: bane,
            total: bane.antall,
            n: 0,
            feil: 0,
            rekke: 0,
            besteRekke: 0,
            xpDenneOkta: 0,
            niva: bane.nivaer ? bane.nivaer[0] : 1,
            rettPaaRad: 0,
            repriser: [],
            naa: null,
            forsoktPaaNaa: false
        };
        nesteOppgave();
    }

    /* Vanskegraden følger eleven: tre riktige på rad løfter nivået, en feil
       senker det. Eleven ser aldri tallet - bare at setningene endrer seg. */
    function justerNiva(riktig) {
        var trapp = okt.bane.nivaer;
        if (!trapp) return;
        var plass = trapp.indexOf(okt.niva);
        if (riktig) {
            okt.rettPaaRad++;
            if (okt.rettPaaRad >= 3 && plass < trapp.length - 1) {
                okt.niva = trapp[plass + 1];
                okt.rettPaaRad = 0;
            }
        } else {
            okt.rettPaaRad = 0;
            if (plass > 0) okt.niva = trapp[plass - 1];
        }
    }

    function nesteOppgave() {
        if (okt.n >= okt.total) return visResultat();

        /* En oppgave eleven bommet på kommer tilbake seinere i økta. Vi legger
           den inn i stedet for en ny oppgave, slik at eleven aldri ser at det
           blir flere oppgaver igjen av å svare feil. */
        if (okt.repriser.length && okt.repriser[0].fra <= okt.n) {
            okt.naa = okt.repriser.shift().oppgave;
            if (okt.naa.type === 'hvemGjor') okt.naa.steg = 1;
        } else {
            okt.naa = lagOppgave(okt.bane.type, okt.niva);
        }
        okt.forsoktPaaNaa = false;
        visOppgave();
    }

    function visOppgave() {
        var o = okt.naa;
        tom(rot);

        var topp = el('div', 'okt-topp');
        var tilbake = el('button', 'tilbake', '‹ Kart');
        tilbake.onclick = visKart;
        topp.appendChild(tilbake);

        var bar = el('div', 'framdrift');
        var fyll = el('div', 'framdrift-fyll');
        fyll.style.width = (okt.n / okt.total * 100) + '%';
        bar.appendChild(fyll);
        topp.appendChild(bar);
        topp.appendChild(el('span', 'teller', (okt.n + 1) + ' / ' + okt.total));
        if (okt.rekke >= 3) topp.appendChild(el('span', 'rekke', '🔥 ' + okt.rekke));
        rot.appendChild(topp);

        rot.appendChild(el('h2', 'sporsmal', o.sporsmal));
        if (o.hint) rot.appendChild(el('p', 'hint', o.hint));

        var omraade = el('div', 'oppgave');
        rot.appendChild(omraade);
        tegnOppgave(o, omraade);

        /* Hjelp: alltid tilgjengelig, ingen straff */
        var hjelp = el('details', 'hjelp');
        hjelp.appendChild(el('summary', null, '💡 Hjelp meg å huske'));
        var innhold = el('div', 'hjelp-innhold');
        innhold.innerHTML =
            '<p class="stor-regel">' + HUSKEREGEL_VERB.kort + '</p>' +
            '<p>' + HUSKEREGEL_VERB.sporsmal + '</p>' +
            '<p>' + HUSKEREGEL_VERB.tid + '</p>' +
            '<p class="felle">' + HUSKEREGEL_VERB.felle + '</p>';
        hjelp.appendChild(innhold);
        rot.appendChild(hjelp);

        rot.appendChild(el('div', 'svarfelt'));
    }

    function tegnOppgave(o, omraade) {
        if (o.type === 'jaNei') {
            omraade.appendChild(el('div', 'stort-ord', o.ord));
            omraade.appendChild(toValg(['Ja', 'Nei'], function (ja) {
                svar(o, ja, omraade);
            }));
            return;
        }

        if (o.type === 'idagIgaar') {
            /* Ordet står for seg selv, og hullene er tomme. Vi skriver aldri
               den ubøyde formen inn i setningen - «I dag hoste jeg» er ikke
               norsk, og eleven skal ikke lese feil språk. */
            omraade.appendChild(el('div', 'stort-ord', o.ord));
            var ramme = el('div', 'ramme');
            ramme.innerHTML =
                '<p>I dag <span class="hull tom">&nbsp;</span> jeg.</p>' +
                '<p>I går <span class="hull tom">&nbsp;</span> jeg.</p>';
            omraade.appendChild(ramme);
            omraade.appendChild(toValg(['Ja, det passer', 'Nei, det blir tull'], function (ja) {
                svar(o, ja, omraade);
            }));
            return;
        }

        if (o.type === 'hvaSkjer') {
            var valgte = [];
            var flere = o.setning.verb.length > 1;
            omraade.appendChild(tegnSetning(o.setning, function (indeks, knapp) {
                if (!flere) { svar(o, [indeks], omraade); return; }
                var p = valgte.indexOf(indeks);
                if (p === -1) { valgte.push(indeks); knapp.classList.add('valgt'); }
                else { valgte.splice(p, 1); knapp.classList.remove('valgt'); }
                if (valgte.length === o.setning.verb.length) svar(o, valgte.slice(), omraade);
            }));
            return;
        }

        if (o.type === 'hvemGjor') {
            omraade.appendChild(tegnSetning(o.setning, function (indeks) {
                svar(o, indeks, omraade);
            }));
            return;
        }

        if (o.type === 'rydd') {
            var merket = [];
            var rutenett = el('div', 'rutenett');
            o.ord.forEach(function (ord, i) {
                var b = el('button', 'brikke');
                b.appendChild(el('span', 'tast', String(i + 1)));
                b.appendChild(el('span', 'brikke-ord', ord));
                b.setAttribute('aria-pressed', 'false');
                b.onclick = function () {
                    var p = merket.indexOf(ord);
                    if (p === -1) {
                        merket.push(ord); b.classList.add('valgt');
                        b.setAttribute('aria-pressed', 'true');
                    } else {
                        merket.splice(p, 1); b.classList.remove('valgt');
                        b.setAttribute('aria-pressed', 'false');
                    }
                };
                rutenett.appendChild(b);
            });
            omraade.appendChild(rutenett);

            var sjekk = el('button', 'sjekk-knapp', 'Sjekk');
            sjekk.onclick = function () {
                var riktig = merket.length === o.fasit.length &&
                    o.fasit.every(function (v) { return merket.indexOf(v) !== -1; });
                svar(o, merket.slice(), omraade, riktig);
            };
            omraade.appendChild(sjekk);
        }
    }

    /* To store valgknapper med tastatursnarvei 1 og 2 */
    function toValg(tekster, nar) {
        var boks = el('div', 'valg');
        tekster.forEach(function (tekst, i) {
            var b = el('button', 'valg-knapp');
            b.appendChild(el('span', 'tast', String(i + 1)));
            b.appendChild(el('span', null, tekst));
            b.onclick = function () { nar(i === 0); };
            boks.appendChild(b);
        });
        return boks;
    }

    function tegnSetning(s, nar) {
        var boks = el('p', 'setning');
        s.tekst.split(' ').forEach(function (bit, i) {
            var b = el('button', 'ordknapp', bit);
            b.dataset.indeks = String(i);
            b.onclick = function () { nar(i, b); };
            boks.appendChild(b);
            boks.appendChild(document.createTextNode(' '));
        });
        return boks;
    }

    /* ---------- Svarhåndtering ---------- */

    function likeLister(a, b) {
        return a.length === b.length && a.slice().sort().every(function (v, i) {
            return v === b.slice().sort()[i];
        });
    }

    function svar(o, gitt, omraade, overstyrRiktig) {
        var riktig;

        if (overstyrRiktig !== undefined) riktig = overstyrRiktig;
        else if (o.type === 'hvaSkjer') riktig = likeLister(gitt, o.setning.verbIndeks);
        else if (o.type === 'hvemGjor' && o.steg === 1) riktig = gitt === o.setning.subjektIndeks;
        else if (o.type === 'hvemGjor') riktig = o.setning.verbIndeks.indexOf(gitt) !== -1;
        else riktig = gitt === o.fasit;

        /* Steg 1 av «Hvem gjør noe?»: riktig svar går videre til steg 2 i
           stedet for å avslutte oppgaven. */
        if (riktig && o.type === 'hvemGjor' && o.steg === 1) {
            pip(true);
            merkOrd(omraade, [o.setning.subjektIndeks], 'funnet');
            o.steg = 2;
            o.sporsmal = 'Hva gjør ' + rent(o.setning.subjekt).toLowerCase() + '?';
            document.querySelector('.sporsmal').textContent = o.sporsmal;
            if (o.setning.verb.length > 1) {
                var h = document.querySelector('.hint');
                if (!h) { h = el('p', 'hint'); document.querySelector('.sporsmal').after(h); }
                h.textContent = 'Trykk på ett av ordene som forteller hva som skjer';
            }
            return;
        }

        laasOppgave(o, omraade);
        var svarfelt = document.querySelector('.svarfelt');
        tom(svarfelt);

        if (riktig) {
            pip(true);
            okt.rekke++;
            if (okt.rekke > okt.besteRekke) okt.besteRekke = okt.rekke;
            tilstand.statistikk.riktig++;
            justerNiva(true);

            if (!okt.forsoktPaaNaa) {
                var poeng = 10 + (okt.rekke >= 3 ? 5 : 0);
                okt.xpDenneOkta += poeng;
                tilstand.xp += poeng;
            }

            var boks = el('div', 'tilbakemelding riktig');
            boks.innerHTML = '<strong>Riktig!</strong> ' + o.forklaring;
            svarfelt.appendChild(boks);

            var neste = el('button', 'neste-knapp', 'Neste');
            neste.onclick = function () { okt.n++; lagre(); nesteOppgave(); };
            svarfelt.appendChild(neste);
            neste.focus();
            return;
        }

        /* Feil: ingen straff, ingen liv som forsvinner. Regelen kommer fram,
           eleven prøver samme oppgave om igjen med en gang. */
        pip(false);
        okt.rekke = 0;
        justerNiva(false);
        if (!okt.forsoktPaaNaa) {
            okt.feil++;
            tilstand.statistikk.feil++;
            okt.forsoktPaaNaa = true;
            if (okt.n + 2 < okt.total) {
                okt.repriser.push({ fra: okt.n + 2, oppgave: o });
            }
        }

        var boks2 = el('div', 'tilbakemelding feil');
        boks2.innerHTML = '<strong>Ikke helt.</strong> ' + o.forklaring +
            '<p class="minne">' + HUSKEREGEL_VERB.sporsmal + '</p>';
        svarfelt.appendChild(boks2);

        var igjen = el('button', 'neste-knapp', 'Prøv igjen');
        igjen.onclick = function () {
            if (o.type === 'hvemGjor') { o.steg = 1; o.sporsmal = 'Hvem eller hva gjør noe?'; }
            visOppgave();
        };
        svarfelt.appendChild(igjen);
        igjen.focus();
    }

    function merkOrd(omraade, indekser, klasse) {
        Array.prototype.forEach.call(omraade.querySelectorAll('.ordknapp'), function (b) {
            if (indekser.indexOf(Number(b.dataset.indeks)) !== -1) b.classList.add(klasse);
        });
    }

    function laasOppgave(o, omraade) {
        if (o.setning) merkOrd(omraade, o.setning.verbIndeks, 'fasit');
        Array.prototype.forEach.call(omraade.querySelectorAll('button'), function (b) {
            b.disabled = true;
        });
    }

    /* ---------- Resultat ---------- */

    function visResultat() {
        var stjerner = okt.feil === 0 ? 3 : (okt.feil <= 2 ? 2 : 1);
        var forrige = baneStatus(okt.bane.id);
        tilstand.baner[okt.bane.id] = {
            stjerner: Math.max(stjerner, forrige.stjerner),
            forsok: forrige.forsok + 1
        };
        lagre();

        tom(rot);
        var boks = el('section', 'resultat');
        boks.appendChild(el('h2', null, okt.bane.navn + ' er ferdig'));
        boks.appendChild(el('div', 'store-stjerner',
            '★★★'.slice(0, stjerner) + '☆☆☆'.slice(0, 3 - stjerner)));

        var linjer = el('ul', 'resultatliste');
        linjer.appendChild(el('li', null, '+' + okt.xpDenneOkta + ' XP'));
        linjer.appendChild(el('li', null, 'Beste rekke: ' + okt.besteRekke + ' på rad'));
        linjer.appendChild(el('li', null, okt.feil === 0
            ? 'Ingen feil. Sterkt!'
            : okt.feil + (okt.feil === 1 ? ' oppgave' : ' oppgaver') + ' du måtte prøve to ganger'));
        boks.appendChild(linjer);

        var igjen = el('button', 'neste-knapp', 'Spill banen igjen');
        igjen.onclick = function () { startOkt(okt.bane); };
        boks.appendChild(igjen);

        var kart = el('button', 'sekundaer-knapp', 'Tilbake til kartet');
        kart.onclick = visKart;
        boks.appendChild(kart);

        rot.appendChild(boks);
        igjen.focus();
    }

    /* ---------- Tastatur (PC) ---------- */

    function tastatur(e) {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === 'h' || e.key === 'H') {
            var hjelp = document.querySelector('.hjelp');
            if (hjelp) {
                hjelp.open = !hjelp.open;
                e.preventDefault();
            }
            return;
        }

        if (!/^[1-9]$/.test(e.key)) return;
        var nr = Number(e.key);

        var valg = document.querySelectorAll('.valg-knapp:not([disabled])');
        if (valg.length && nr <= valg.length) { valg[nr - 1].click(); e.preventDefault(); return; }

        var brikker = document.querySelectorAll('.brikke:not([disabled])');
        if (brikker.length && nr <= brikker.length) { brikker[nr - 1].click(); e.preventDefault(); }
    }

    /* ---------- Lyd ---------- */

    var lydKontekst = null;

    function pip(riktig) {
        if (!tilstand.innstillinger.lyd) return;
        try {
            if (!lydKontekst) {
                var AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                lydKontekst = new AC();
            }
            var osc = lydKontekst.createOscillator();
            var gain = lydKontekst.createGain();
            osc.frequency.value = riktig ? 880 : 220;
            gain.gain.value = 0.06;
            osc.connect(gain);
            gain.connect(lydKontekst.destination);
            osc.start();
            osc.stop(lydKontekst.currentTime + 0.12);
        } catch (e) { /* lyd er pynt, aldri en feil som stopper spillet */ }
    }

    /* ---------- Lagringsvarsel ---------- */

    function lagringsvarsel() {
        return el('p', 'varsel', 'Nettleseren lagrer ikke framgangen din nå ' +
            '(privat vindu?). Du kan spille som vanlig, men stjernene forsvinner ' +
            'når du lukker sida.');
    }

    function visLagringsvarsel() {
        if (document.querySelector('.varsel')) return;
        rot.insertBefore(lagringsvarsel(), rot.firstChild);
    }

    /* ---------- Start ---------- */

    document.addEventListener('DOMContentLoaded', function () {
        rot = document.getElementById('spill');
        document.addEventListener('keydown', tastatur);
        visKart();
    });
})();
