// Deklarisanje globalnih promenljivih//

let brzina, // brzina loptice 
    racunarBrzina, // brzina reketa racunara 
    reket1,
    reket2,
    loptica,
    poljeZaIgru,
    rezultat1,
    rezultat2,
    ukupanBrojPoena,
    naServisu, // 0 - igrac na servisu   1 - igrac2 na servisu
    stopMoving = 0,  // kad je jednako 1 zaustavlja pomeranje reketa igraca
    promenaUglaLoptice,// promenljiva kojom cemo da menjamo ugao pod kojim ce se loptica kretati u poenu
    smerX, smerY, // smer u x i y pozicijama
    lopticaX, lopticaY, // x i y pozicija loptice
    igracY, // y pozicija reketa igraca(x pozicija se ne menja)
    racunarY, // y pozicija reketa racunara(x pozicije se ne menja)
    interval, // varijabla za interval 
    brojUdaraca,
    faktorBrzineLoptice = 1;

//pre pocetka igre dugme "Servis" je disable dok se ne izabere nivo
document.getElementById("start").disabled = true;

//pozivanje funkcija za nivoe racunara na klik pre pocetka 
document.getElementById("pocetni").addEventListener("click", pocetni);

document.getElementById("srednji").addEventListener("click", srednji);

document.getElementById("ekspert").addEventListener("click", ekspert);

// na dugme "Servis" pocinjemo svaki poen
document.getElementById("start").addEventListener("click", Start);

// IIFE Funkcija u kojoj stavljamo pocetne vrednosti promenjivih //

(function () {

    reket1 = document.getElementById('reket1');
    reket2 = document.getElementById('reket2');
    loptica = document.getElementById('loptica');
    poljeZaIgru = document.getElementById('poljeZaIgru');
    rezultat1Display = document.getElementById('rezultat1');
    rezultat2Display = document.getElementById('rezultat2');
    set1Display = document.getElementById("set1");
    set2Display = document.getElementById("set2");
    pocetni = document.getElementById("Pocetni");
    srednji = document.getElementById("Srednji");
    ekspert = document.getElementById("Ekspert");
    audio1 = new Audio("audio/269718__michorvath__ping-pong-ball-hit.wav");// audio prilikom udarca reketa u lopticu
    audio2 = new Audio("audio/209792__alterr__applause-mono-24bit-48khz.wav"); // aplauz posle odigranog poena
    audio3 = new Audio("audio/we-are-the-champions-copia.mp3");// pesma posle pobede jednog od igraca
    ukupanBrojPoena = 0;
    naServisu = 1; // na pocetku na servisu je racunar
    rezultat1 = 0;
    rezultat2 = 0;
    set1 = 0;
    set2 = 0;
    // default nivo racunara je pocetni
    document.getElementById("pocetni").style.backgroundColor = "blue";
    brzina = 2.8,
    racunarBrzina = 3.2,
    racunarY = 250;// pozicija reketa racunara po Y osi
    igracY = 250;// pozicija reketa igraca po Y osi
    smerX = smerY = brzina;

    //pozivamo funkciju u kojoj su definisane vrednosti promenljivih pre pocetka svakog poena//
    pocniPoen();
})();


//funkcija kojom ispisujemo rezultat i kada jedan od igraca skupi 5 poena dodaje mu se set i krece zatim novi
function ispisRezultata() {

    if (rezultat1 == 5) {
        rezultat1 = 0;
        rezultat2 = 0;
        set1 += 1;
        ispisSetova();
        pobednik();
    }

    if (rezultat2 == 5) {
        rezultat1 = 0;
        rezultat2 = 0;
        set2 += 1;
        ispisSetova();
        pobednik();

    }

    rezultat1Display.innerHTML = rezultat1;
    rezultat2Display.innerHTML = rezultat2;
    stopMoving = 1;
    poljeZaIgru.onmousemove = 0;
}

//funkcija kojom ispisujemo setove
function ispisSetova() {

    set1Display.innerHTML = set1;
    set2Display.innerHTML = set2;

}




//funkcija kojom definisemo poziciju loptice i boju naslova igraca kada serviraju
function igracNaServisu() {
    if (naServisu == 0) // igrac
    {
        lopticaX = 50; //pozicija loptice kada je igrac na servisu po x i y osi
        lopticaY = 280;
        document.getElementById("igrac").style.color = "#42f4e8";// kada je igrac na servisu ime "igrac" dobija plavu boju
        document.getElementById("racunar").style.color = "white";// "racunar" za to vreme ostaje bele boje

        // menjanje smera loptice, ako servira igrac, loptica mora da ide u desno, tj brzina treba da bude u plusu

    } else // racunar
    {
        lopticaX = 723;// pozicija loptice kada je racunar na servisu
        lopticaY = 280;
        document.getElementById("racunar").style.color = "#42f4e8";//"racunar" kada je na servisu dobija plavu boju
        document.getElementById("igrac").style.color = "white";// "igrac" ostaje bele boje
    }
}

//funkcija kojom definisemo u kom slucaju je jedan od igraca pobednik i to se ispisuje u alertu a kasnije i pesmom
function pobednik() {
    if (set1 == 3) { //igra se do 3 dobijena seta i ovo je slucaj kada igrac pobedjuje
        alert("Igrac je pobedio!!!")
        audio3.play();
    }
    if (set2 == 3) { // kada racunar pobedjuje
        alert("Racunar je pobedio!!!")
        audio3.play();
    }
}


function pocniPoen() {



    document.getElementById("start").disabled = false;
    // definisemo ukupan broj poena kao zbir oba rezultata
    ukupanBrojPoena = rezultat2 + rezultat1;
    brojUdaraca = 0;
    faktorBrzineLoptice = 1;

    naServisu = redosledServiranja(ukupanBrojPoena);
    igracNaServisu(); // postavlja poziciju loptice u zavisnoti ko je na servisu

    racunarY = 250; // pozicija reketa igraca i racunara
    igracY = 250;
    reket1.style.left = 20 + 'px';
    reket1.style.top = igracY + 'px';
    reket2.style.left = poljeZaIgru.offsetWidth - (20 + reket2.offsetWidth) + 'px';
    reket2.style.top = racunarY + 'px';
    loptica.style.left = lopticaX + 'px';
    loptica.style.top = lopticaY + 'px';

}

//funkcija za random broj koju koristimo za menjanje ugla i brzine loptice u poenu
function randomBroj(x, y) {
    return Math.floor(Math.random() * (y - x)) + x;
}

function redosledServiranja(brojPoena) { // funkcija za serviranje kojom definisemo da svaki igrac ima po 2 servisa
    if (brojPoena % 4 == 0 || brojPoena % 4 == 1) {
        return 1;
    } else {
        return 0;
    }
}

// funkcija GameLoop koja se neprestano ponavlja
function GameLoop() {


    // pomeranje loptice
    lopticaX += faktorBrzineLoptice * smerX;
    lopticaY += faktorBrzineLoptice * promenaUglaLoptice * smerY;

    // definisanje pozicije loptice u pikselima
    loptica.style.left = lopticaX + 'px';
    loptica.style.top = lopticaY + 'px';


    // proveravamo da li je loptica prosla pored reketa igraca

    if (lopticaX <= 0) {

        rezultat2 += 1;
        ispisRezultata();
        clearInterval(interval); //brisemo interval da bi poceo novi poen
        pocniPoen();
        audio2.play();

    }

    // proveravamo da li je loptica prosla pored reketa racunara

    if ((lopticaX + loptica.offsetWidth) > poljeZaIgru.offsetWidth) {
        rezultat1 += 1;
        ispisRezultata();
        clearInterval(interval);
        pocniPoen();
        audio2.play();
    }

    // definisanje sudara loptice sa reketom ili zidom(gornjim ili donjim)

    // provera ako loptica udari u donji ili gornji zid
    if (lopticaY <= 0 || ((lopticaY + loptica.offsetHeight) >= poljeZaIgru.offsetHeight)) {
        smerY = -smerY;
    }

    // ako loptica udari u reket igraca
    if ((lopticaX) < (reket1.offsetLeft + reket1.offsetWidth - 5)) {

        if (((lopticaY) >= igracY) && (lopticaY + 20 <= (igracY + reket1.offsetHeight))) {

            // ako loptica udari u cosak reketa menjamo ugao odbitka random
            if (((lopticaY) <= igracY + 20) || (lopticaY + 40 >= (igracY + reket1.offsetHeight))) {
                promenaUglaLoptice = (randomBroj(60, 150)) / 100;
            }


            smerX = -smerX;
            lopticaX += 8;


            audio1.play();

            //posle 5 udaraca povecavamo brzinu loptice 
            brojUdaraca++;
            if (brojUdaraca == 5)
                faktorBrzineLoptice = 1.15;
            if (brojUdaraca == 10)
                faktorBrzineLoptice = 1.25;

            if (brojUdaraca == 15) {
                faktorBrzineLoptice = 1.35;
            }
            if (brojUdaraca == 20) {
                faktorBrzineLoptice = 1.45;
                racunarBrzina += 1;
            }
            if (brojUdaraca == 25) {
                faktorBrzineLoptice = 1.55;
            }
            if (brojUdaraca == 30) {
                faktorBrzineLoptice = 1.65;
            }

        }

    }

    // ako loptica udari u reket racunara
    if ((lopticaX + loptica.offsetWidth) >= (reket2.offsetLeft)) {
        if (((lopticaY + loptica.offsetHeight) >= racunarY) && (lopticaY <= (racunarY + reket2.offsetHeight))) {
            smerX = -smerX;

            audio1.play();
            lopticaX -= 10;

            //u slucaju racunara povecavamo brzinu loptice ali i brzinu reketa racunara da bi bi racunar mogao da vraca te brze loptice
            brojUdaraca++;
            if (brojUdaraca == 5)
                faktorBrzineLoptice = 1.15;
            if (brojUdaraca == 10)
                faktorBrzineLoptice = 1.25;
            if (brojUdaraca == 15) {
                faktorBrzineLoptice = 1.35;
            }
            if (brojUdaraca == 20) {
                faktorBrzineLoptice = 1.45;
                racunarBrzina += 1;
            }
            if (brojUdaraca == 25) {
                faktorBrzineLoptice = 1.55;
            }
            if (brojUdaraca == 30) {
                faktorBrzineLoptice = 1.65;
            }

        }

    }


    // pomeranje reketa racunara
    // reket se pomera samo u slucaju da loptica ide ka reketu racunara
    if (smerX > 0) {
        if ((racunarY + (reket2.offsetHeight)) > (lopticaY + loptica.offsetHeight)) {

            if (racunarY > 0) {
                racunarY -= racunarBrzina;
                reket2.style.top = racunarY + 'px';
            }
        }
        else {
            racunarY += racunarBrzina;
            reket2.style.top = racunarY + 'px';
        }

    }

}

// pomeranje reketa igraca sa misem
function pomeranjeReketa(e) {

    var pozicija = (e.clientY - (poljeZaIgru.offsetTop - document.documentElement.scrollTop));

    if (pozicija > (poljeZaIgru.offsetHeight - reket1.offsetHeight)) {
        pozicija = (poljeZaIgru.offsetHeight - reket1.offsetHeight);

    }

    igracY = pozicija;
    reket1.style.top = pozicija + 'px';
    if (stopMoving == 1) {
        e.preventDefault();
    }
}
// START GAME funkcija kojom pocinje igra i koja se pokrece na SERVIS dugme
function Start() {



    // postavljamo funkciju za pomeranje reketa igraca
    poljeZaIgru.onmousemove = pomeranjeReketa;


    stopMoving = 0; // dozvoljavamo kretanje reketa igraca

    //menjamo ugao loptice pomocu random funkcije,tako da ce random od poena do poena loptica ici u razlicitim uglovima 
    promenaUglaLoptice = (randomBroj(60, 150)) / 100;
    
    //zatim smerovima dodeljujemo vrednosti dobijene brzine

    if (naServisu == 1) // ako je racunar na servisu brzina treba da bude negativna
    {
        if (brzina >= 0)
            smerX = -brzina;
        else smerX = brzina;
    }
    else        // ako je igracna servisu brzina treba da bude pozitivna
    {
        if (brzina >= 0)
            smerX = brzina;
        else smerX = -brzina;
    }

    smerY = brzina;


    // pozivamo funkciju GameLoop svakih 10 milisekundi
    interval = setInterval('GameLoop()', 10);

    //onemogucujemo klik na dugme "Servis" u toku poena,samo pre svakog poena
    document.getElementById("start").disabled = true;

}


//nivoi racunara koji se biraju pre same igre
function pocetni() {
    racunarBrzina = 3.2;
    brzina = 2.8;
    document.getElementById("ekspert").style.backgroundColor = "#f44262";
    document.getElementById("pocetni").style.backgroundColor = "blue";
    document.getElementById("srednji").style.backgroundColor = "#f44262";

//onemogucujemo klik na druge nivoe kada je jedan od ponudjenuh izabran,u sva tri slucaja radmo istu stvar
    
    document.getElementById("srednji").disabled = true;
    document.getElementById("ekspert").disabled = true;
   

}
function srednji() {
    racunarBrzina = 4.2;
    brzina = 3.6;
    document.getElementById("ekspert").style.backgroundColor = "#f44262";
    document.getElementById("srednji").style.backgroundColor = "blue";
    document.getElementById("pocetni").style.backgroundColor = "#f44262";

    document.getElementById("pocetni").disabled = true;
    document.getElementById("srednji").disabled = true;
    document.getElementById("ekspert").disabled = true;
    

}
function ekspert() {
    racunarBrzina = 6;
    brzina = 4.5;
    document.getElementById("ekspert").style.backgroundColor = "blue";
    document.getElementById("srednji").style.backgroundColor = "#f44262";
    document.getElementById("pocetni").style.backgroundColor = "#f44262";
  
    document.getElementById("pocetni").disabled = true;
    document.getElementById("srednji").disabled = true;
    document.getElementById("ekspert").disabled = true;
}





