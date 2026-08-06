/* Ordklasser - øvelse for 6. trinn. Utkast: VERB-verdenen.

   Bevisste valg:
   - Vanlig script, ikke ES-modul, slik at sida også virker når fila åpnes
     direkte fra disk (file://). Moduler blokkeres av nettleseren der.
   - Egen lagring, uavhengig av storage.js i resten av appen.
   - Ingen dra-og-slipp. Alt løses med trykk/klikk, så det virker likt på
     mobil, nettbrett og Chromebook.
   - Alt eleven trenger for å svare står på skjermen. Huskeregelen er alltid
     ett trykk unna, og koster ingenting. */

(function () {
    'use strict';

    var LAGRINGSNOKKEL = 'ordklasser.v1';

    /* ---------- Baner ---------- */

    var BANER = [
        {
            id: 'verb-1',
            navn: 'Verb eller ikke?',
            undertittel: 'Er ordet noe du gjør?',
            type: 'jaNei',
            antall: 10
        },
        {
            id: 'verb-2',
            navn: 'Tidsprøven',
            undertittel: 'I dag ___. I går ___.',
            type: 'tidsprove',
            antall: 10
        },
        {
            id: 'verb-3',
            navn: 'Finn verbet',
            undertittel: 'Trykk på verbet i setningen',
            type: 'finnISetning',
            antall: 8
        },
        {
            id: 'verb-4',
            navn: 'Rydd kurven',
            undertittel: 'Merk alle verbene',
            type: 'rydd',
            antall: 5
        },
        {
            id: 'verb-5',
            navn: 'Bossbane',
            undertittel: 'Alt om hverandre',
            type: 'blandet',
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
            /* Privat nettlesing eller fullt lager. Spillet skal virke
               ferdig ut økta uansett - eleven mister bare framgangen. */
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

    function el(tag, klasse, tekst) {
        var e = document.createElement(tag);
        if (klasse) e.className = klasse;
        if (tekst !== undefined) e.textContent = tekst;
        return e;
    }

    function tom(node) { while (node.firstChild) node.removeChild(node.firstChild); }

    /* ---------- Oppgavegenerering ---------- */

    function lagJaNei() {
        var erVerb = Math.random() < 0.5;
        if (erVerb) {
            var v = trekk(ORDBANK.verb, 1)[0];
            return {
                type: 'jaNei',
                sporsmal: 'Er dette et verb?',
                ord: v.ord,
                fasit: true,
                forklaring: '<b>' + v.ord + '</b> er et verb. I dag ' + v.na +
                    ' jeg. I går ' + v.for + ' jeg.'
            };
        }
        var i = trekk(ORDBANK.ikkeVerb, 1)[0];
        return {
            type: 'jaNei',
            sporsmal: 'Er dette et verb?',
            ord: i.ord,
            fasit: false,
            forklaring: '<b>' + i.ord + '</b> er ikke et verb. Det er et ' +
                i.klasse + '. Du kan ikke si «I dag ' + i.ord + ' jeg».'
        };
    }

    function lagTidsprove() {
        var erVerb = Math.random() < 0.5;
        if (erVerb) {
            var v = trekk(ORDBANK.verb, 1)[0];
            return {
                type: 'tidsprove',
                sporsmal: 'Passer ordet i tidsprøven?',
                ord: v.ord,
                fasit: true,
                forklaring: 'Ja! I dag <b>' + v.na + '</b> jeg. I går <b>' +
                    v.for + '</b> jeg. Ordet endrer seg med tiden, altså er ' +
                    v.ord + ' et verb.'
            };
        }
        var i = trekk(ORDBANK.ikkeVerb, 1)[0];
        return {
            type: 'tidsprove',
            sporsmal: 'Passer ordet i tidsprøven?',
            ord: i.ord,
            fasit: false,
            forklaring: 'Nei. «I dag <b>' + i.ord + '</b> jeg» blir tull. ' +
                i.ord.charAt(0).toUpperCase() + i.ord.slice(1) + ' er et ' +
                i.klasse + ', ikke et verb.'
        };
    }

    function lagFinnISetning() {
        var s = trekk(ORDBANK.setninger, 1)[0];
        return {
            type: 'finnISetning',
            sporsmal: 'Trykk på verbet i setningen',
            setning: s.tekst,
            fasit: s.fasit,
            forklaring: '<b>' + s.fasit + '</b> er verbet. Det er handlingen ' +
                'i setningen — det noen gjør.'
        };
    }

    function lagRydd() {
        var antallVerb = 3 + Math.floor(Math.random() * 2);   // 3 eller 4
        var verb = trekk(ORDBANK.verb, antallVerb).map(function (v) { return v.ord; });
        var andre = trekk(ORDBANK.ikkeVerb, 8 - antallVerb).map(function (i) { return i.ord; });
        return {
            type: 'rydd',
            sporsmal: 'Merk alle verbene, og trykk Sjekk',
            ord: bland(verb.concat(andre)),
            fasit: verb,
            forklaring: 'Verbene var: <b>' + verb.join(', ') + '</b>.'
        };
    }

    function lagOppgave(type) {
        if (type === 'jaNei') return lagJaNei();
        if (type === 'tidsprove') return lagTidsprove();
        if (type === 'finnISetning') return lagFinnISetning();
        if (type === 'rydd') return lagRydd();
        /* blandet */
        var typer = ['jaNei', 'tidsprove', 'finnISetning', 'finnISetning', 'rydd'];
        return lagOppgave(typer[Math.floor(Math.random() * typer.length)]);
    }

    /* ---------- Skjermer ---------- */

    var rot;

    function visKart() {
        okt = null;
        tom(rot);

        var topp = el('div', 'topplinje');
        topp.appendChild(el('span', 'xp', '⭐ ' + tilstand.xp + ' XP'));
        var lydKnapp = el('button', 'lyd-knapp', tilstand.innstillinger.lyd ? '🔊' : '🔇');
        lydKnapp.setAttribute('aria-label', 'Slå lyd av eller på');
        lydKnapp.onclick = function () {
            tilstand.innstillinger.lyd = !tilstand.innstillinger.lyd;
            lagre();
            lydKnapp.textContent = tilstand.innstillinger.lyd ? '🔊' : '🔇';
        };
        topp.appendChild(lydKnapp);
        rot.appendChild(topp);

        var kort = el('section', 'regelkort');
        kort.innerHTML =
            '<h2>Verb</h2>' +
            '<p class="regel">' + HUSKEREGEL_VERB.kort + '</p>' +
            '<p class="prove">' + HUSKEREGEL_VERB.prove + '</p>';
        rot.appendChild(kort);

        var liste = el('ol', 'baneliste');
        BANER.forEach(function (bane, i) {
            var apen = erApen(i);
            var st = baneStatus(bane.id);

            var li = el('li', 'bane' + (apen ? '' : ' laast'));
            var knapp = el('button', 'bane-knapp');
            knapp.disabled = !apen;

            var venstre = el('div', 'bane-tekst');
            venstre.appendChild(el('span', 'bane-navn', (i + 1) + '. ' + bane.navn));
            venstre.appendChild(el('span', 'bane-under', apen ? bane.undertittel : 'Klarer du forrige bane, åpner denne seg'));
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

        if (!lagringVirker) rot.appendChild(lagringsvarsel());
    }

    function startOkt(bane) {
        var oppgaver = [];
        for (var i = 0; i < bane.antall; i++) oppgaver.push(lagOppgave(bane.type));
        okt = {
            bane: bane,
            oppgaver: oppgaver,
            n: 0,
            feil: 0,
            rekke: 0,
            besteRekke: 0,
            xpDenneOkta: 0,
            forsoktPaaNaa: false
        };
        visOppgave();
    }

    function visOppgave() {
        if (okt.n >= okt.oppgaver.length) return visResultat();

        var o = okt.oppgaver[okt.n];
        okt.forsoktPaaNaa = false;
        tom(rot);

        /* Framdrift */
        var topp = el('div', 'okt-topp');
        var tilbake = el('button', 'tilbake', '‹ Kart');
        tilbake.onclick = visKart;
        topp.appendChild(tilbake);

        var bar = el('div', 'framdrift');
        var fyll = el('div', 'framdrift-fyll');
        fyll.style.width = (okt.n / okt.oppgaver.length * 100) + '%';
        bar.appendChild(fyll);
        topp.appendChild(bar);
        topp.appendChild(el('span', 'teller', (okt.n + 1) + '/' + okt.oppgaver.length));
        rot.appendChild(topp);

        if (okt.rekke >= 3) {
            rot.appendChild(el('div', 'rekke', '🔥 ' + okt.rekke + ' på rad'));
        }

        rot.appendChild(el('h2', 'sporsmal', o.sporsmal));

        var omraade = el('div', 'oppgave');
        rot.appendChild(omraade);
        tegnOppgave(o, omraade);

        /* Hjelp: alltid tilgjengelig, ingen straff */
        var hjelp = el('details', 'hjelp');
        var sammendrag = el('summary', null, '💡 Huskeregel');
        hjelp.appendChild(sammendrag);
        var innhold = el('div', 'hjelp-innhold');
        innhold.innerHTML = '<p>' + HUSKEREGEL_VERB.kort + '</p><p>' +
            HUSKEREGEL_VERB.prove + '</p><p class="felle">' + HUSKEREGEL_VERB.felle + '</p>';
        hjelp.appendChild(innhold);
        rot.appendChild(hjelp);

        var svarfelt = el('div', 'svarfelt');
        rot.appendChild(svarfelt);
    }

    function tegnOppgave(o, omraade) {
        if (o.type === 'jaNei') {
            omraade.appendChild(el('div', 'stort-ord', o.ord));
            var valg = el('div', 'valg');
            [['Ja, verb', true], ['Nei', false]].forEach(function (par) {
                var b = el('button', 'valg-knapp', par[0]);
                b.onclick = function () { svar(o, par[1], omraade); };
                valg.appendChild(b);
            });
            omraade.appendChild(valg);
            return;
        }

        if (o.type === 'tidsprove') {
            /* Ordet står for seg selv, og hullene er tomme. Vi skriver aldri
               den ubøyde formen inn i setningen - «I dag hoste jeg» er ikke
               norsk, og eleven skal ikke lese feil språk. */
            omraade.appendChild(el('div', 'stort-ord', o.ord));
            var ramme = el('div', 'ramme');
            ramme.innerHTML =
                '<p class="ramme-ledetekst">Passer ordet her?</p>' +
                '<p>I dag <span class="hull tom">&nbsp;</span> jeg.</p>' +
                '<p>I går <span class="hull tom">&nbsp;</span> jeg.</p>';
            omraade.appendChild(ramme);
            var valg2 = el('div', 'valg');
            [['Ja, det passer', true], ['Nei, det blir tull', false]].forEach(function (par) {
                var b = el('button', 'valg-knapp', par[0]);
                b.onclick = function () { svar(o, par[1], omraade); };
                valg2.appendChild(b);
            });
            omraade.appendChild(valg2);
            return;
        }

        if (o.type === 'finnISetning') {
            var setning = el('p', 'setning');
            o.setning.split(' ').forEach(function (bit) {
                var rent = bit.replace(/[.,!?:;]/g, '');
                var b = el('button', 'ordknapp', bit);
                b.onclick = function () { svar(o, rent, omraade); };
                setning.appendChild(b);
                setning.appendChild(document.createTextNode(' '));
            });
            omraade.appendChild(setning);
            return;
        }

        if (o.type === 'rydd') {
            var valgte = [];
            var rutenett = el('div', 'rutenett');
            o.ord.forEach(function (ord) {
                var b = el('button', 'brikke', ord);
                b.setAttribute('aria-pressed', 'false');
                b.onclick = function () {
                    var i = valgte.indexOf(ord);
                    if (i === -1) { valgte.push(ord); b.classList.add('valgt'); b.setAttribute('aria-pressed', 'true'); }
                    else { valgte.splice(i, 1); b.classList.remove('valgt'); b.setAttribute('aria-pressed', 'false'); }
                };
                rutenett.appendChild(b);
            });
            omraade.appendChild(rutenett);

            var sjekk = el('button', 'sjekk-knapp', 'Sjekk');
            sjekk.onclick = function () {
                var riktig = valgte.length === o.fasit.length &&
                    o.fasit.every(function (v) { return valgte.indexOf(v) !== -1; });
                svar(o, riktig ? o.fasit : valgte, omraade, riktig);
            };
            omraade.appendChild(sjekk);
        }
    }

    /* ---------- Svarhåndtering ---------- */

    function svar(o, gitt, omraade, overstyrRiktig) {
        var riktig = overstyrRiktig !== undefined ? overstyrRiktig : (gitt === o.fasit);

        /* Lås oppgaveflata så eleven ikke rekker å dobbeltsvare */
        Array.prototype.forEach.call(omraade.querySelectorAll('button'), function (b) {
            b.disabled = true;
            if (o.type === 'finnISetning' && b.textContent.replace(/[.,!?:;]/g, '') === o.fasit) {
                b.classList.add('fasit');
            }
        });

        var svarfelt = document.querySelector('.svarfelt');
        tom(svarfelt);

        if (riktig) {
            pip(true);
            okt.rekke++;
            if (okt.rekke > okt.besteRekke) okt.besteRekke = okt.rekke;
            tilstand.statistikk.riktig++;

            if (!okt.forsoktPaaNaa) {
                var poeng = 10 + (okt.rekke >= 3 ? 5 : 0);
                okt.xpDenneOkta += poeng;
                tilstand.xp += poeng;
            }

            var boks = el('div', 'tilbakemelding riktig');
            boks.innerHTML = '<strong>Riktig!</strong> ' + o.forklaring;
            svarfelt.appendChild(boks);

            var neste = el('button', 'neste-knapp', 'Neste →');
            neste.onclick = function () { okt.n++; lagre(); visOppgave(); };
            svarfelt.appendChild(neste);
            neste.focus();
            return;
        }

        /* Feil: ingen straff, ingen liv som forsvinner. Regelen kommer fram,
           eleven prøver samme oppgave om igjen med en gang. */
        pip(false);
        okt.rekke = 0;
        if (!okt.forsoktPaaNaa) {
            okt.feil++;
            tilstand.statistikk.feil++;
            okt.forsoktPaaNaa = true;
            /* Oppgaven kommer én gang til seinere i økta. Vi bytter ut en
               oppgave lenger fram i køa i stedet for å legge til en ny, slik
               at eleven aldri ser at det blir flere oppgaver igjen av å svare
               feil. */
            var tidligst = okt.n + 2;
            if (tidligst < okt.oppgaver.length) {
                var plass = tidligst + Math.floor(Math.random() * (okt.oppgaver.length - tidligst));
                okt.oppgaver[plass] = o;
            }
        }

        var boks2 = el('div', 'tilbakemelding feil');
        boks2.innerHTML = '<strong>Ikke helt.</strong> ' + o.forklaring +
            '<p class="minne">' + HUSKEREGEL_VERB.prove + '</p>';
        svarfelt.appendChild(boks2);

        var igjen = el('button', 'neste-knapp', 'Prøv igjen');
        igjen.onclick = function () {
            tom(omraade);
            tom(svarfelt);
            tegnOppgave(o, omraade);
        };
        svarfelt.appendChild(igjen);
        igjen.focus();
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
        var v = el('p', 'varsel');
        v.textContent = 'Nettleseren lagrer ikke framgangen din nå ' +
            '(privat vindu?). Du kan spille som vanlig, men stjernene ' +
            'forsvinner når du lukker sida.';
        return v;
    }

    function visLagringsvarsel() {
        if (document.querySelector('.varsel')) return;
        rot.insertBefore(lagringsvarsel(), rot.firstChild);
    }

    /* ---------- Start ---------- */

    document.addEventListener('DOMContentLoaded', function () {
        rot = document.getElementById('spill');
        visKart();
    });
})();
