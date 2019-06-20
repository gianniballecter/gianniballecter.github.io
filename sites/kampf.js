var charsImGame = [];
var spielerinformationen = [];
var listeDerHandelnden = []; //Für die Bewegung

var thecanvas = document.getElementById("theCanvas");
var rect = thecanvas.getBoundingClientRect();

thecanvas.width= rect.right - rect.left;//horizontal resolution (?) - increase for better looking text
thecanvas.height= rect.bottom - rect.top;//
var ctx = thecanvas.getContext("2d");
thecanvas.addEventListener('click', onClick, false); //mousedown?
thecanvas.addEventListener('mousedown', onDown, false); //mousedown?
thecanvas.addEventListener('mouseup', onUp, false); //mousedown?
thecanvas.addEventListener('mousemove', onOver, false);
var modus = 0; //0 = start-Screen, 1 = setzphase, 2 = Bewegungsphase, 3 = Kampfphase; -2 erste Bewegungsvorbereitung
//11 Alle durchgehen, die über PC gesteuert sind!
//31 Alle durchgehen, die über PC gesteuert sind!

//Bildquellen
var img = new Image();
img.src = "../images/buttons.png";
var img_bg = new Image();
img_bg.src = "../images/papier.png";
var img_gradient = new Image();
img_gradient.src = "../images/2dfarbverlauf.png";

var img_grey= new Image();
img_grey.src = "../images/c_enemy.png";
var img_red = new Image();
img_red.src = "../images/c_nsc.png";
var img_blue = new Image();
img_blue.src = "../images/c_sc.png";

var startScreenButtonsID = [];
currentChar = 0;
dragndrop = -1; //-1 = aus, Nummer = currentChar/kampfindex
dragndropx = 0; //Versatz beim dragndrop
dragndropy = 0;
originalx = 0; //Um die Entfernung eines Weges zu kalkulieren
originaly = 0;
//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

var fremdgesteuert = [];
var fremdid = [];


/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded
    
    spielerContainerAktualisieren();
    listTheChars();
    
    //firebase.database().ref().child("Fight").child("Chars").remove();
    firebase.database().ref().child("Fight").remove();

    firebase.database().ref().child("Fight").child("Chars").on('value', newChar, errData); //gotData bei jedem Change ausgeführt


    /*if (database) { 

        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {
        }
    }*/
 });

/*****************************************************PHASE*0*****************************************************/
/*****************************************************PHASE*0*****************************************************/

function spielerContainerAktualisieren(){ 
    var i; var dataf = [];
    for (i = 0; i < charsImGame.length; i++) { 
        dataf.push(charsImGame[i].name);  
    }
    //dataf = charsImGame;
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

function kampfStarten(){  
    if (charsImGame.length > 1)  
    {
    if (modus == 0){
        //Initiative auswürfeln (vielleicht Button-Hintergrund ändern)
        for (i = 0; i < charsImGame.length; i++) { 
            charsImGame[i].initiative = charsImGame[i].attribute[1] + randn_bm()*20;  
        }
        /*charsImGame.sort(function(a, b) { //Die Initiative anwenden
            return parseFloat(b.initiative) - parseFloat(a.initiative);
        });*/
        spielerContainerAktualisieren();

        currentChar = 0; 
        restoreMap();
        modus = -2;

    } else if (modus == -2){ //Vorbereitung
        //Allen verbundenen Bescheid geben
        for (j = 0; j < fremdgesteuert.length; j++) {firebase.database().ref().child("Fight").child(fremdgesteuert[j]).set("Start"); }

        document.getElementById("onlybuttonhere").innerText = "Nächste Phase";
        modus = 1;
        ctx.font = "50px Georgia";
        ctx.fillText("Wähle deine Aktion!", 20, 100);
    }else if (modus == 1){ //Vorphase
        document.getElementById("onlybuttonhere").innerText = "Nächster";
        //restoreModus1();
        restoreMap();

        //Ersten Char starten
        listeDerHandelnden = [];
        for (k = 0; k < charsImGame.length; k++) {
            if (spielerinformationen[k] > 1) 
            {listeDerHandelnden.push(k);}
        }

        currentChar = listeDerHandelnden[0]; //Einfach das ArrayDurchgehen
        highlightChar();
        modus = 2;
    } else if (modus == 2){ //Bewegungsphase
        //currentChar = (currentChar + 1) % charsImGame.length;

        Loop1: 
        while (currentChar < charsImGame.length) {
            currentChar = currentChar + 1;
            for (l = 0; l < listeDerHandelnden.length; l++) {
                if (listeDerHandelnden[l] === currentChar) {        
                    break Loop1;
                } 
            } 
        }

        if (listeDerHandelnden[listeDerHandelnden.length - 2] == currentChar)
        {    document.getElementById("onlybuttonhere").innerText = "Letzter";}
        else if (listeDerHandelnden[listeDerHandelnden.length - 1] == currentChar)
        {     document.getElementById("onlybuttonhere").innerText = "Nächste Phase"; }
        else if (charsImGame.length == currentChar)
        {
            currentChar = 0;
            document.getElementById("onlybuttonhere").innerText = "Nächste Runde";
            modus = 3;
            restoreMap();
            for (j = 0; j < fremdgesteuert.length; j++) {firebase.database().ref().child("Fight").child(fremdgesteuert[j]).set("Kampf"); }
        }
        highlightChar();
        //document.getElementById("onlybuttonhere").innerText = "Nächste Phase";
    } else if (modus == 3){ //Kampfphase
        modus = 1;
        restoreMap();
        document.getElementById("onlybuttonhere").innerText = "Nächste Phase";
        ctx.font = "50px Georgia";
        ctx.fillText("Wähle deine Aktion!", 20, 100);
        for (j = 0; j < fremdgesteuert.length; j++) {firebase.database().ref().child("Fight").child(fremdgesteuert[j]).set("Start"); }
        highlightNobody();
    }
    
    
    }
    
}

/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/
/*****************************************************KOMMUNIKATION*****************************************************/

function newChar(data) {
    if (data.val() != null && modus == 0)
    {
        tunnel = Object.keys(data.val());
        gefunden = false;

        for  (i = 0; i < tunnel.length; i++) {
            //if (tunnel[i].slice(-12) > tunnel[i - 1].slice(-12)) {}
            gefunden = false;
            for  (j = 0; j < fremdgesteuert.length; j++) {
                if (tunnel[i] == fremdgesteuert[j]) {gefunden = true;}   
            }
            if (gefunden == false) {
                fremdgesteuert.push(tunnel[i]);
                fremdid.push(charsImGame.length);
                return firebase.database().ref().child("Fight").child("Chars").child(tunnel[i]).once('value').then(function(snapshot) {
                    charsImGame.push(transformChar(snapshot.val(), tunnel[i].slice(-1)));
                    spielerinformationen.push(0);
                    spielerContainerAktualisieren();
                    firebase.database().ref().child("Fight").child(tunnel[i]).set("Willkommen");
                    firebase.database().ref().child("Fight").child("M" + tunnel[i]).on('value', gotData, errData); 
                }); 
            }
        }
    }
}

function gotData(data) {
    if (data.val() != null){
        uID = Object.keys(data.val())[0]
        console.log(uID);
        return firebase.database().ref().child("Fight").child("M" + uID).child(uID).once('value').then(function(snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() == "Bewegung") {
                document.getElementsByClassName("card2")[findByUID(uID)].style.backgroundColor = "#333333";
                spielerinformationen[findByUID(uID)] = 2;
            }
            if (snapshot.val() == "Stillstand") {
                document.getElementsByClassName("card2")[findByUID(uID)].style.backgroundColor = "#333333"; 
                spielerinformationen[findByUID(uID)] = 1;  
            }
            firebase.database().ref().child("Fight").child("M" + uID).child(uID).set(null); //sinnlos?
        }); 
    } 
}

function errData(err) {
    console.log("Error");
    console.log(err);
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
                        spielerinformationen.push(2);
                        spielerContainerAktualisieren();
                    }           
            } 
        }

    } else if (modus == 31){
        if (cx >= 10 && cx <= 310 && cy >= 10 && cy <= 110){
            //ctx.drawImage(img_gradient, 0, 0, 1200, 1200, 0, 0, thecanvas.width, thecanvas.height);
            //modus = 2; //Angriff
        } else if (cx >= 10 && cx <= 310 && cy >= 120 && cy <= 220) {
            //was anderes
        } 
    } /*else if (modus == 2){
        modus = 1;
        restoreModus1();
    }*/

}

function onDown(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == -2 || modus == 2){
        for (i = 0; i < charsImGame.length; i++) {
            if (cx >= charsImGame[i].x && cx <= (charsImGame[i].x + 100) && cy >= charsImGame[i].y && cy <= (charsImGame[i].y + 100)) {
                if (modus == -2 || (modus == 2 && i == currentChar)) {
                    dragndrop = i;
                    dragndropx = cx - charsImGame[i].x;
                    dragndropy = cy - charsImGame[i].y;
                    originalx = cx;
                    originaly = cy;
                    restoreMap();
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
            charsImGame[dragndrop].x = cx - dragndropx;
            charsImGame[dragndrop].y = cy - dragndropy;
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
    } else if (modus == 31){
        restoreModus1();
        if (cx >= 10 && cx <= 310 && cy >= 10 && cy <= 110){   
            ctx.drawImage(img, 120, 0, 1, 1, 10, 10, 300, 100); 
            ctx.fillText("Angriff", 70, 75);
        } else if (cx >= 10 && cx <= 310 && cy >= 120 && cy <= 220) {
            ctx.drawImage(img, 120, 0, 1, 1, 10, 120, 300, 100); 
            ctx.fillText("Was Anderes", 17, 185);
        } 
    } else if (modus == -2 || modus == 2){
        if (dragndrop != -1){
            charsImGame[dragndrop].x = cx - dragndropx;
            charsImGame[dragndrop].y = cy - dragndropy;
            restoreMap();
        }
    }

}

/*****************************************************HILFSFUNKTIONEN*****************************************************/
/*****************************************************HILFSFUNKTIONEN*****************************************************/

function restoreMap(){
    ctx.drawImage(img_bg, 0, 0, 850, 850, 0, 0, thecanvas.width, thecanvas.height);
    
    if (dragndrop != -1){
        kreis_malen(dragndrop);
    }

    if (modus == 3){
        for (i = 0; i < charsImGame.length; i++) {
            kreis_malen(i);
        }
    }

    for (i = 0; i < charsImGame.length; i++) {
        ctx.font = "40px Georgia";
        ctx.fillStyle = "rgba(10, 10, 10, 1)";
        if (charsImGame[i].type == 1) {
            ctx.drawImage(img_blue, 0, 0, 400, 400, charsImGame[i].x, charsImGame[i].y, 100, 100); 
        } else if (charsImGame[i].type == 2) {
            ctx.drawImage(img_red, 0, 0, 400, 400, charsImGame[i].x, charsImGame[i].y, 100, 100); 
        } else if (charsImGame[i].type == 3) {
            ctx.drawImage(img_grey, 0, 0, 700, 700, charsImGame[i].x, charsImGame[i].y, 100, 100); 
        }
        
        ctx.fillText(charsImGame[i].initialen, charsImGame[i].x + 50 - charsImGame[i].initialen.length *14, charsImGame[i].y + 70);
    }

}


function restoreModus1(){
    ctx.drawImage(img, 180, 60, 1, 1, 0, 0, thecanvas.width, thecanvas.height);

    ctx.font = "50px Georgia";
    ctx.drawImage(img, 119, 0, 1, 1, 10, 10, 300, 100); 
    ctx.fillText("Angriff", 70, 75);
    ctx.drawImage(img, 119, 0, 1, 1, 10, 120, 300, 100); 
    ctx.fillText("Was Anderes", 17, 185);
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

function transformChar(charakter, typus){
    /*var neuerChar = JSON.parse(JSON.stringify(kChar)); //sonst ist es eine Referenz leider
    neuerChar.name = charakter.name;
    neuerChar.attribute = charakter.attribute;
    neuerChar.volk = charakter.volk;
    neuerChar.religion = charakter.religion;
    neuerChar.stufe = charakter.stufe;
    neuerChar.skilltreelist = charakter.skilltreelist;
    neuerChar.skilllist = charakter.skilllist;*/
    
    neuerChar = charakter;
    //neuerChar.kampfindex = charsImGame.length;

    neuerChar.type = typus; //1= SC; 2=NSC; 3=Minion; 0=Environmet !!Charaktere brauchen ein Kürzel um dargestellpt zu werden: zwei Buchstaben in einem Kreis

    neuerChar.x = (charsImGame.length % 4) * 150;
    neuerChar.y = Math.floor(charsImGame.length / 4) * 150;

    neuerChar.lp_now = 30;

    neuerChar.radius = 150;
    neuerChar.radmaxpunkt = 0.5;
    neuerChar.radmacht = 0.05;
    return neuerChar;
}

var gradient;
var calcx = 0;
var calcy = 0;

function kreis_malen(charnum){
    //wir brauchen noch den Punkt maximaler Schlagkraft
    //und die beweglichkeit
    ctx.beginPath();
    calcx = charsImGame[charnum].x + 50;
    calcy = charsImGame[charnum].y + 50;

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

function findByUID(uid) {
    for (i = 0; i < fremdgesteuert.length; i++){
        if (uid == fremdgesteuert[i]) {
            return fremdid[i];
        }
    }
}