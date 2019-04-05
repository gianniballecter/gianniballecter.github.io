var charsImGame = [];

var thecanvas = document.getElementById("theCanvas");
var rect = thecanvas.getBoundingClientRect();

thecanvas.width= rect.right - rect.left;//horizontal resolution (?) - increase for better looking text
thecanvas.height= rect.bottom - rect.top;//
var ctx = thecanvas.getContext("2d");
thecanvas.addEventListener('click', onDown, false); //mousedown?
thecanvas.addEventListener('mousemove', onOver, false);
var modus = 0; //0 = start-Screen, 1 = game

var img = new Image();
img.src = "../images/buttons.png";
var img_gradient = new Image();
img_gradient.src = "../images/2dfarbverlauf.png";
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
    
    
    /*
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
        storage.get(chosenChar).onsuccess = function(event) {
            //document.getElementById("bonifeld").innerHTML = "Boni des Charkters"; //hies auslesen
            
        }
      }*/
 });

/*****************************************************ERSTELLUNG*****************************************************/
/*****************************************************ERSTELLUNG*****************************************************/
function spielerContainerAktualisieren(){ 
    var i; var dataf = [];
    for (i = 0; i < charsImGame.length; i++) { 
        dataf.push(charsImGame[i].name);  
    }
    //dataf = charsImGame;
    let html = "";
    var i = 0;
    dataf.forEach(function(element) {
        html += `<div class="card" onclick="javascript:klickChar(` + i + `)">
        <h2>${element}</h2>
        </div>
        `;
        i++;
    });
    document.getElementById("spielercontainer").innerHTML = html;
}

function listTheChars(){    
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


function kampfStarten(){    
    if (charsImGame.length > 1 && modus == 0){
        //Initiative auswürfeln (vielleicht Button-Hintergrund ändern)
        for (i = 0; i < charsImGame.length; i++) { 
            charsImGame[i].initiative = charsImGame[i].attribute[1] + randn_bm()*20;  
        }
        charsImGame.sort(function(a, b) { //Die Initiative anwenden
            return parseFloat(b.initiative) - parseFloat(a.initiative);
        });
        spielerContainerAktualisieren();
        //Ersten Char starten
        currentChar = 0; //Einfach das ArrayDurchgehen

        restoreModus1();

        document.getElementById("onlybuttonhere").innerText = "Nächster";
        modus = 1;

    } else if (modus == 1){
        currentChar = (currentChar + 1) % charsImGame.length;

    } else if (modus == 2){
        currentChar = (currentChar + 1) % charsImGame.length;
    }
    highlightChar();
    
}


function onDown(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 0){
        var i;
        for (i = 0; i < startScreenButtonsID.length; i++) {
            if (database && cx >= 10 && cx <= 40 && cy >= 10 + (40*i) && cy <= 40 + (40*i)){
                var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
                storage.get(startScreenButtonsID[i]).onsuccess = function(event) {
                        charsImGame.push(transformChar(this.result));
                        spielerContainerAktualisieren();
                    }           
            } 
        }
    } else if (modus == 1){
        if (cx >= 10 && cx <= 310 && cy >= 10 && cy <= 110){
            ctx.drawImage(img_gradient, 0, 0, 1200, 1200, 0, 0, thecanvas.width, thecanvas.height);
            modus = 2; //Angriff
        } else if (cx >= 10 && cx <= 310 && cy >= 120 && cy <= 220) {
            //was anderes
        } 
    } else if (modus == 2){
        modus = 1;
        restoreModus1();
    }

}

function onOver(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 0){
        var i;
        for (i = 0; i < startScreenButtonsID.length; i++) {

            if (cx >= 10 && cx <= 40 && cy >= 10 + (40*i) && cy <= 40 + (40*i)){
                ctx.drawImage(img, 120, 0, 120, 120, 10, 10 + (40*i), 30, 30);
            } else {
                ctx.drawImage(img, 0, 0, 120, 120, 10, 10 + (40*i), 30, 30);
            }

        }
    } else if (modus == 1){
        restoreModus1();
        if (cx >= 10 && cx <= 310 && cy >= 10 && cy <= 110){   
            ctx.drawImage(img, 120, 0, 1, 1, 10, 10, 300, 100); 
            ctx.fillText("Angriff", 70, 75);
        } else if (cx >= 10 && cx <= 310 && cy >= 120 && cy <= 220) {
            ctx.drawImage(img, 120, 0, 1, 1, 10, 120, 300, 100); 
            ctx.fillText("Was Anderes", 17, 185);
        } 
    }

}


//vielleicht ist das doof, vielleicht lieber ganzen Char nehmen
function transformChar(charakter){
    var neuerChar = JSON.parse(JSON.stringify(kChar)); //sonst ist es eine Referenz leider
    neuerChar.name = charakter.name;
    neuerChar.attribute = charakter.attribute;
    neuerChar.volk = charakter.volk;
    neuerChar.religion = charakter.religion;
    neuerChar.stufe = charakter.stufe;
    neuerChar.skilltreelist = charakter.skilltreelist;
    neuerChar.skilllist = charakter.skilllist;
    return neuerChar;
}

function klickChar(iden){
    if (modus == 0){
        charsImGame.splice(iden, 1);
        spielerContainerAktualisieren();
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
    var x = document.getElementsByClassName("card");    
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "#1e46be";
    } 
    x[currentChar].style.backgroundColor = "black";
}