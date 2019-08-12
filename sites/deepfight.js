var Angriffe = []; //1 = beidseitig, 2 SC, 3 NSC
var AngriffSC = [];
var AngriffNSC = [];
var aktuellerAngriff = 0;

function initiative(charsImGameInput) {
    //Initiative auswürfeln (vielleicht Button-Hintergrund ändern)
    charsImGame = charsImGameInput;
    for (i = 0; i < charsImGame.length; i++) { 
        if (charsImGame[i].initiative != 1000) {charsImGame[i].initiative = 0;} //Sturmangriff
        charsImGame[i].initiative += charsImGame[i].attribute[1] + randn_bm()*20;  
        
    }
    charsImGame.sort(function(a, b) { //Die Initiative anwenden
        return parseFloat(b.initiative) - parseFloat(a.initiative);
    });

    return charsImGame;
    
}

function kampf() { 
    Angriffe = [];
    AngriffSC = [];
    AngriffNSC = [];
    //Alle Kampfe erkennen Alle SCs durchgehen
    for (i = 0; i < charsImGame.length; i++) { //Die Reihenfolge in der Ini festhalten
        charsImGame[i].initiative = i;  //!!!! In dieser Funktion wird die initiative benutzt um die ids zu speichern
    }
    SCs = charsImGame.filter(element => element.type == 1);
    NSCs = charsImGame.filter(element => element.type != 1);
    for (i = 0; i < SCs.length; i++) { 
        for (j = 0; j < NSCs.length; j++) { 
            abstand = Math.sqrt((Math.pow((SCs[i].x - NSCs[j].x), 2) + Math.pow((SCs[i].y - NSCs[j].y), 2)));
            if ((abstand - NSCs[j].size) <  SCs[i].radius) { //(SCs Angriff)
                //console.log(SCs[i].name + "s Angriff auf " + NSCs[j].name);
                AngriffSC.push(SCs[i].initiative); //initiative ist hier das i in charsImGame
                AngriffNSC.push(NSCs[j].initiative); //initiative ist hier das i in charsImGame
                if ((abstand - SCs[i].size) <  NSCs[j].radius) { //console.log("beidseitig");
                    Angriffe.push(1); } else { Angriffe.push(2);} //beidseitiger Angriff vs. SCs Angriff
            } else if ((abstand - SCs[i].size) <  NSCs[j].radius) { //NSCs Angriff
                //console.log(NSCs[j].name + "s Angriff auf " + SCs[i].name);
                AngriffSC.push(SCs[i].initiative); //initiative ist hier das i in charsImGame
                AngriffNSC.push(NSCs[j].initiative); //initiative ist hier das i in charsImGame
                Angriffe.push(3);
                
            }
            
        }
    }
    //Die Nachrichten an alle schicken
    for (i = 0; i < charsImGame.length; i++) { 
        messageBuilder = [];
        for (k = 0; k < Angriffe.length; k++) { 
            if (charsImGame[i].type == 1 && Angriffe[k] != 3 && AngriffSC[k] == i) {messageBuilder.push(charsImGame[AngriffNSC[k]].initialen);}
            if (charsImGame[i].type >= 2 && Angriffe[k] != 2 && AngriffNSC[k] == i) {messageBuilder.push(charsImGame[AngriffSC[k]].initialen);}
        }
        if (messageBuilder.length < 1) {messageBuilder = "Chillen";} //Jetzt nochmal durchgehen, wer frei steht

        if (charsImGame[i].type <= 2) {
            firebase.database().ref().child("Fight").child(charsImGame[i].uniqueID + charsImGame[i].type).set(messageBuilder);  //Abschicken
        } else if (charsImGame[i].type == 3) {
            minion_kampfmoves(i, messageBuilder);
        }
    }
    aktuellerAngriff = 0;
}

function nextAttack(){
    if (Angriffe.length > 0) {
        //Some recursive Code Angriffe[aktuellerAngriff] vs. Verteidigungen[aktuellerAngriff]
       
        schreiben(charsImGame[AngriffSC[aktuellerAngriff]].initialen, 100, 0.2);
        schreiben(charsImGame[AngriffNSC[aktuellerAngriff]].initialen, 100, 0.8);
        if (Angriffe[aktuellerAngriff] == 1) { schreiben("beidseitig", 100, 0.5); }
        document.getElementById("onlybuttonhere").innerText = "Weiter!";

        aktuellerAngriff += 1;
    } else {
        console.log("Keine Angriffe gefunden");
    }
    
    if ((aktuellerAngriff + 1) > Angriffe.length) { //Rekursionsanker
        document.getElementById("onlybuttonhere").innerText = "Nächste Runde";
    } //else {nextAttack();}
}

/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/

//Kreis aussen rum
function kreis_malen(charnum){
    //wir brauchen noch den Punkt maximaler Schlagkraft
    //und die beweglichkeit
    ctx.beginPath();
    calcx = charsImGame[charnum].x;
    calcy = charsImGame[charnum].y;

    gradient = ctx.createRadialGradient(calcx , calcy, 0, calcx, calcy, charsImGame[charnum].radius); //inner und outerRadius
    gradient.addColorStop(0, "rgba(230, 230, 230, 0.3)");

    gradient.addColorStop(charsImGame[charnum].radmaxpunkt - charsImGame[charnum].radmacht, "rgba(130, 130, 130, 0.4)");
    gradient.addColorStop(charsImGame[charnum].radmaxpunkt + charsImGame[charnum].radmacht, "rgba(130, 130, 130, 0.4)");
    gradient.addColorStop(1, "rgba(230, 230, 230, 0.4)");

    ctx.fillStyle = gradient;
    ctx.arc(calcx, calcy, charsImGame[charnum].radius, 0, 2 * Math.PI)
    ctx.fill();
        //ctx.stroke(); 
}

//Charakter aus dem Speicher zu Kampcharakter machen
function transformChar(charakter, typus){

    neuerChar = charakter;
    neuerChar.lp_now = neuerChar.lp;
    neuerChar.energie_now = neuerChar.energie;

    neuerChar.radius = neuerChar.waffen[neuerChar.chosenWaffe].radius;
    neuerChar.radmaxpunkt = neuerChar.waffen[neuerChar.chosenWaffe].radmaxpunkt;
    neuerChar.radmacht = neuerChar.waffen[neuerChar.chosenWaffe].radmacht;

    //Falls die Grenzen vom Maxpunkt getroffen wurden, muss dieser entsprechend radMacht verschoben werden
    if (neuerChar.radmaxpunkt < neuerChar.radmacht) {
        neuerChar.radmaxpunkt += neuerChar.radmacht;
    } else if (1 - neuerChar.radmaxpunkt < neuerChar.radmacht) {
        neuerChar.radmaxpunkt -= neuerChar.radmacht;
    }

    neuerChar.size = 50; //Eigenradius
    neuerChar.x = (charsImGame.length % 4) * 150 + neuerChar.size;
    neuerChar.y = Math.floor(charsImGame.length / 4) * 150 + neuerChar.size;

    neuerChar.type = typus; //1= SC; 2=NSC; 3=Minion; 0=Environmet !!Charaktere brauchen ein Kürzel um dargestellpt zu werden: zwei Buchstaben in einem Kreis
    neuerChar.information = [0]; //Was er grade machen will (kämpfen, bewegen, etc.)
    neuerChar.spieler = 0; //0 ist der Host-PC, ansonsten kommt hier die ID rein.

    //initialen doppelt abfangen
    for (i = 0; i < charsImGame.length; i++) { 
        if (charsImGame[i].initialen == neuerChar.initialen) {
            var nummerhinten = 2;
            gleichenCharGefunden = false;
            while (gleichenCharGefunden == false) {
                gleichenCharGefunden = true;
                for (j = 0; j < charsImGame.length; j++) { 
                    if (charsImGame[j].initialen == neuerChar.initialen + nummerhinten) {gleichenCharGefunden = false; nummerhinten += 1;}
                }
            }
            neuerChar.initialen += nummerhinten;
            neuerChar.name += nummerhinten;
        }
    }
    return neuerChar;
}