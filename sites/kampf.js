var modus = 0; //0 = start-Screen, 1 = setzphase, 2 = Bewegungsphase, 3 = Kampfentscheidung; 4 = Kampfphase; -2 erste Bewegungsvorbereitung
//11 Alle durchgehen, die über PC gesteuert sind!             

thecanvas.addEventListener('click', onClick, false); //mousedown?
thecanvas.addEventListener('mousedown', onDown, false); //mousedown?
thecanvas.addEventListener('mouseup', onUp, false); //mousedown?
thecanvas.addEventListener('mousemove', onOver, false);

//Bildquellen
var img = new Image(); img.src = "../images/buttons.png";
var img_grey= new Image(); img_grey.src = "../images/c_enemy.png";
var img_red = new Image(); img_red.src = "../images/c_nsc.png";
var img_blue = new Image(); img_blue.src = "../images/c_sc.png";

var startScreenButtonsID = [];
currentChar = 0;

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing


/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded
    
    spielerContainerAktualisieren();
    listTheChars();

    firebase.database().ref().child("Fight").remove();
    firebase.database().ref().child("Fight").child("Chars").on('value', newChar, errData); //gotData bei jedem Change ausgeführt

    /*if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {
        }
    }*/
 });

function listTheChars(){   //Wird gleich bei der IndexedDB ausgeführt 
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 

        ctx.font = "25px Georgia";
        var ibonus = 0;

        storage.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) { //indexedDBs iterator
                if (cursor.value.id != 0){
                    ctx.drawImage(img, 0, 0, 120, 120, 10, 10 + (40*ibonus), 30, 30); //img.onload = function(){ctx.drawImage(img, 0, 0, 120, 120, 100, 100, 120, 120);}
                    ctx.fillText(cursor.value.name, 50, 35 + (40*ibonus));  //eventuell Problem wenn untererer Bildschirmrand erreicht wird
                    startScreenButtonsID.push(cursor.value.id);
                    ibonus++;
                }
                cursor.continue();
            } 
        };  
    }
}

function klickChar(iden){
    if (modus == 0){
        charsImGame.splice(iden, 1);
        spielerContainerAktualisieren();
    }
}

/*****************************************************BUTTON*****************************************************/
/*****************************************************BUTTON*****************************************************/
/*****************************************************BUTTON*****************************************************/
/*****************************************************BUTTON*****************************************************/
/*****************************************************BUTTON*****************************************************/
var listeDerHandelnden = []; //Für die Bewegung

function kampfStarten(){  
    if (charsImGame.length > 1)  
    {
    switch(modus) {
        case 0: //Von Ganz am Anfang in Vorherbewegung
            modus = -2;
            restoreMap();
            break;
        case -2: //Von Vorherbewegung In Wählphase
            anAlleSchicken("Start");
            //Alle Minions auf erledigt setzen
            for (i = 0; i < charsImGame.length; i++) {
                if (charsImGame[i].type == 3){minion_bewegung(i);}  //AI-Verhalten
            } 

            modus = 1;
            restoreMap("Bewegung"); ctx.font = "50px Georgia"; ctx.fillText("Wähle deine Haltung!", 20, 100);
            break;
        case 1: //Bewegung beginnen (Von Wählphase in Bewegungsphase)            
            charsImGame = initiative(charsImGame); 
            spielerContainerAktualisieren(); currentChar = 0; //initative auch anzeigen
            listeDerHandelnden = []; //leeren
            for (k = 0; k < charsImGame.length; k++) {
                if (charsImGame[k].information[0] > 1) {listeDerHandelnden.push(k);}
            }
        
            currentChar = listeDerHandelnden[0]; //Einfach das ArrayDurchgehen //Mit dem ersten Char starten
            highlightChar(); //Jetzt wieder alle blau außer Handelden
            modus = 2;
            restoreMap("Nächster");
            break;
        case 2: //Nächster in der Bewegung / Kampf beginnen
            Loop1: //Nächsten in der Liste auswählern
            while (currentChar < charsImGame.length) {
                currentChar = currentChar + 1;
                for (l = 0; l < listeDerHandelnden.length; l++) {
                    if (listeDerHandelnden[l] === currentChar) {break Loop1;} 
                } 
            }

            
            if (listeDerHandelnden[listeDerHandelnden.length - 2] == currentChar) //Noch ein Char
                {restoreMap("Letzter"); highlightChar();} 
            else if (listeDerHandelnden[listeDerHandelnden.length - 1] == currentChar) //Alle haben sich bewegt
                {restoreMap("Weiter"); highlightChar();} 
            else if (charsImGame.length == currentChar) { //Von Bewegung zu Kampfentscheidung
                currentChar = 0; //anAlleSchicken("Kampf");
                kampf(); //Angriffe erkennen und Infos senden
                
                /*
                for (i = 0; i < charsImGame.length; i++) {
                    if (charsImGame[i].type == 3){document.getElementsByClassName("card2")[i].style.backgroundColor = "#333333";}
                } */

                modus = 3;
                restoreMap("Kampf"); ctx.font = "50px Georgia"; ctx.fillText("Wähle deine Aktion!", 20, 100);
            } else { //Einfach normal weiter
                highlightChar();
            }
            
            break;
        case 3: //Von Kampfentscheidung in Kampf
            restoreMap("(Nächste Runde)");
            nextAttack();
            if (document.getElementById("onlybuttonhere").innerText == "Nächste Runde") {modus = 4;}
            break;
        case 4:  //Von Kampf in Wählphase
            anAlleSchicken("Start");

            highlightNobody();
            for (j = 0; j < charsImGame.length; j++) {
                if (charsImGame[j].type == 3){document.getElementsByClassName("card2")[j].style.backgroundColor = "#333333";}
            } 
            modus = 1;
            restoreMap("Bewegung"); ctx.font = "50px Georgia"; ctx.fillText("Wähle deine Haltung!", 20, 100);
            break;
    } 
    }
    
}

/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/

function newChar(data) { //Neuer Char registriert sich!
    if (data.val() != null && modus == 0)
    {
        tunnel = Object.keys(data.val());
        nCgefunden = false;

        for  (i37 = 0; i37 < tunnel.length; i37++) {
            //if (tunnel[i].slice(-12) > tunnel[i - 1].slice(-12)) {}
            nCgefunden = false;
            for  (j = 0; j < charsImGame.length; j++) {
                if (tunnel[i37] == charsImGame[j].spieler) {nCgefunden = true;}   
            }
            if (nCgefunden == false) {
                return firebase.database().ref().child("Fight").child("Chars").child(tunnel[i37]).once('value').then(function(snapshot) {
                    charsImGame.push(transformChar(snapshot.val(), tunnel[i37].slice(-1)));
                    charsImGame[charsImGame.length-1].spieler = tunnel[i37]; //Dies ist unnötig jetzt, man könnte einfach .uniqueID nehmen
                    spielerContainerAktualisieren();
                    firebase.database().ref().child("Fight").child(tunnel[i37]).set("Willkommen"); //Spricht auf dem UniqueID
                    firebase.database().ref().child("Fight").child("M" + tunnel[i37]).on('value', gotData, errData); //Listener für den Kanal MUniqueID
                }); 
            }
        }
    }
}

Array.prototype.isArray = true; 
function gotData(data) { //Daten vom Char bekommen!
    if (data.val() != null){
        uID = Object.keys(data.val())[0]
        console.log("Ich bekam Daten von " + uID);
        return firebase.database().ref().child("Fight").child("M" + uID).child(uID).once('value').then(function(snapshot) {
            if (snapshot.val() == "Bewegung") {
                document.getElementsByClassName("card2")[findByUID(uID)].style.backgroundColor = "#333333";
                charsImGame[findByUID(uID)].information[0] = 2;
            }
            else if (snapshot.val() == "Stillstand") {
                document.getElementsByClassName("card2")[findByUID(uID)].style.backgroundColor = "#333333"; 
                charsImGame[findByUID(uID)].information[0] = 1;
            }
            else if (snapshot.val().isArray) {
                document.getElementsByClassName("card2")[findByUID(uID)].style.backgroundColor = "#333333"; 
                charsImGame[findByUID(uID)].information = [];
                charsImGame[findByUID(uID)].information = snapshot.val();
                console.log(charsImGame[findByUID(uID)].information);
            } else {console.log(snapshot.val());}
            firebase.database().ref().child("Fight").child("M" + uID).child(uID).set(null); //sinnlos?
        }); 
    } 
}



/*****************************************************MAUS*****************************************************/
/*****************************************************MAUS*****************************************************/
/*****************************************************MAUS*****************************************************/
/*****************************************************MAUS*****************************************************/
/*****************************************************MAUS*****************************************************/

function onClick(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 0){
        var i;
        for (i = 0; i < startScreenButtonsID.length; i++) {
            if (database && cx >= 10 && cx <= 40 && cy >= 10 + (40*i) && cy <= 40 + (40*i)){
                var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
                storage.get(startScreenButtonsID[i]).onsuccess = function(event) {
                        charsImGame.push(transformChar(this.result, 3));
                        charsImGame[charsImGame.length - 1].information[0] = 2; //Könnte auch vorher this.result ändern...
                        charsImGame[charsImGame.length - 1].spieler = 0;
                        spielerContainerAktualisieren();
                    }           
            } 
        }
    } 
}

originalx = 0; //Um die Entfernung eines Weges zu kalkulieren
originaly = 0;
originalenergie = 1;

function onDown(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == -2 || modus == 2){
        for (i = 0; i < charsImGame.length; i++) {
            if (cx >= (charsImGame[i].x - charsImGame[i].size) && cx <= (charsImGame[i].x + charsImGame[i].size) && cy >= (charsImGame[i].y - charsImGame[i].size) && cy <= (charsImGame[i].y + charsImGame[i].size)) {
                if (modus == -2 || (modus == 2 && i == currentChar)) {
                    dragndrop = i;
                    dragndropx = cx - charsImGame[i].x - charsImGame[i].size;
                    dragndropy = cy - charsImGame[i].y - charsImGame[i].size;
                    originalx = cx;
                    originaly = cy;
                    originalenergie = charsImGame[i].energie_now;
                    restoreMap();
                    lp_und_ernergie_zeichnen();
                } 
            }
        }
    } 
}

function onUp(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == -2 || modus == 2){
        if (dragndrop != -1){
            charsImGame[dragndrop].x = cx - dragndropx - charsImGame[dragndrop].size;
            charsImGame[dragndrop].y = cy - dragndropy - charsImGame[dragndrop].size;
            dragndrop = -1;
            restoreMap();
            
            //Kosten wenn modus 2
        }
    } 
}

function onOver(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 0 ){
        var i;
        for (i = 0; i < startScreenButtonsID.length; i++) {

            if (cx >= 10 && cx <= 40 && cy >= 10 + (40*i) && cy <= 40 + (40*i)){
                ctx.drawImage(img, 120, 0, 120, 120, 10, 10 + (40*i), 30, 30);
            } else {
                ctx.drawImage(img, 0, 0, 120, 120, 10, 10 + (40*i), 30, 30);
            }

        }
    } else if (modus == -2 || modus == 2){
        if (dragndrop != -1){
            charsImGame[dragndrop].x = cx - dragndropx - charsImGame[dragndrop].size;
            charsImGame[dragndrop].y = cy - dragndropy - charsImGame[dragndrop].size;
            restoreMap();
            lp_und_ernergie_zeichnen();
        }
    }

}

/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/

function restoreMap(titel){
    if (titel != null)
    {document.getElementById("onlybuttonhere").innerText = titel;}

    ctx.drawImage(img_bg, 0, 0, 850, 850, 0, 0, thecanvas.width, thecanvas.height);
    
    if (dragndrop != -1){
        kreis_malen(dragndrop);
        if (modus == 2){
            ctx.beginPath();
            ctx.moveTo(originalx, originaly);
            ctx.lineTo(charsImGame[dragndrop].x, charsImGame[dragndrop].y);
            ctx.fillStyle = "black";
            ctx.stroke(); 
            charsImGame[dragndrop].energie_now = originalenergie - 0.001*Math.sqrt((Math.pow((originalx - charsImGame[dragndrop].x), 2) + Math.pow((originaly - charsImGame[dragndrop].y), 2)));
        }
    }

    if (modus >= 3){
        for (i = 0; i < charsImGame.length; i++) {
            kreis_malen(i);
        }
    }

    for (i = 0; i < charsImGame.length; i++) {
        ctx.font = (charsImGame[i].size * 0.8) + "px Georgia";
        ctx.fillStyle = "rgba(10, 10, 10, 1)";
        if (charsImGame[i].type == 1) {
            ctx.drawImage(img_blue, 0, 0, 400, 400, charsImGame[i].x - charsImGame[i].size, charsImGame[i].y - charsImGame[i].size, charsImGame[i].size*2, charsImGame[i].size*2); 
        } else if (charsImGame[i].type == 2) {
            ctx.drawImage(img_red, 0, 0, 400, 400, charsImGame[i].x - charsImGame[i].size, charsImGame[i].y - charsImGame[i].size, charsImGame[i].size*2, charsImGame[i].size*2); 
        } else if (charsImGame[i].type == 3) {
            ctx.drawImage(img_grey, 0, 0, 700, 700, charsImGame[i].x - charsImGame[i].size, charsImGame[i].y - charsImGame[i].size, charsImGame[i].size*2, charsImGame[i].size*2); 
        }
        
        ctx.fillText(charsImGame[i].initialen, charsImGame[i].x - charsImGame[i].initialen.length *14, charsImGame[i].y + 20);
    }

}

//Liste an der Seite erstellen
function spielerContainerAktualisieren(){ 
    var i; var dataf = [];
    for (i = 0; i < charsImGame.length; i++) { 
        dataf.push(charsImGame[i].name);  
    }
    let html = "";
    var i = 0;
    dataf.forEach(function(element) {
        html += `<div class="card2" onclick="javascript:klickChar(` + i + `)">
        <h2>${element}</h2>
        </div>
        `;
        i++;
    });
    document.getElementById("spielercontainer").innerHTML = html;
}


function highlightChar(){
    var x = document.getElementsByClassName("card2");    
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "#1e46be";
    } 
    x[currentChar].style.backgroundColor = "#333333";
}

function highlightNobody(){
    var x = document.getElementsByClassName("card2");   
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "#1e46be";
    } 
}


function findByUID(uid) {
    for (i = 0; i < charsImGame.length; i++){
        if (uid == charsImGame[i].spieler) {
            return i;
        }
    }
}

function anAlleSchicken(msg) {
    for (i = 0; i < charsImGame.length; i++){
        if (charsImGame[i].spieler != 0) {
            firebase.database().ref().child("Fight").child(charsImGame[i].spieler).set(msg); 
        }
    }
}