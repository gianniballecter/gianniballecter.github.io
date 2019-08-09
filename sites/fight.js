var chosenChar = parseInt(getUrlVars()["char"]);
var team = parseInt(getUrlVars()["team"]);

var modus = 0; //10 = leer, 11 = Bewegung, 13 Kampfentscheidung
var uniqueID = "Error7" + team;

thecanvas.addEventListener('click', onClick, false); 
thecanvas.addEventListener('mousemove', onOver, false);

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded
    
    //spielerContainerAktualisieren();
    //listTheChars();
    
    
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {         
            uniqueID = this.result.uniqueID + team;
            firebase.database().ref().child("Fight").child("Chars").child(uniqueID).set(this.result); //Anmeldung

            firebase.database().ref().child("Fight").child(uniqueID).on('value', gotData, errData); //gotData bei jedem Change ausgeführt
            
          }   
    }
 });

/*****************************************************DATEN*****************************************************/
/*****************************************************DATEN*****************************************************/
var angriffsoptionen = []; 
var feinde = []; 
var chosenFeind = 0;
var answerBuilder = []; //Das wird unsere Antwort auf die Angriffe
Array.prototype.isArray = true; //Nur die Liste der Gegner wäre als Array gespeichert, so können wir unteb ein Array unabhängig vom Inhalt erkennen
function gotData(data) {
    
    if (data.val() == "Willkommen") {
        optionenInMap(10, 0);
        //firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("hghgh");
    } else if (data.val() == "Start") {
        modus = 11;
        optionenInMap(11, 3);
    } else if (data.val() == null) {
         //Do nothing
    }else if (data.val().isArray) {
        angriffsoptionen = []; 
        answerBuilder = [];
        chosenFeind = 0;
        feinde = data.val();
        modus = 13;
        if (database) { 
            var storage = database.transaction("data", "readwrite").objectStore("data"); 
            storage.get(chosenChar).onsuccess = function(event) {      
                for (i22 = 0; i22 < this.result.waffen[this.result.chosenWaffe].wmoves.length; i22++) {
                    angriffsoptionen.push(this.result.waffen[this.result.chosenWaffe].wmoves[i22].name);
                } //alle möglichen Moves aufschreiben
                optionenInMap(13, angriffsoptionen.length, angriffsoptionen);   
                schreiben(feinde[chosenFeind],50, 0.5);     
              }   
        }
    } else {
        console.log(data.val());
    }
}

/*****************************************************MAUS*****************************************************/
/*****************************************************MAUS*****************************************************/



function onClick(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 11){
        if (cy < 2*thecanvas.height/5) {
            // Bewegung
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Bewegung");
        } else if (cy > 4*thecanvas.height/5) {
            //Sturmangriff
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Bewegung");
        } else {
            //keine Bewegung
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Stillstand");
        }
        modus = 10;
        optionenInMap(10, 0);
    } else if (modus == 13){
        //TODO wir wollen hier auch einen Vektor an Angriffsantworten zurückgeben
        for (i29 = 0; i29 < angriffsoptionen.length; i29++) {
            if (cy >= i29*(thecanvas.height-100)/angriffsoptionen.length +100 && cy < ((i29+1)*(thecanvas.height-100))/angriffsoptionen.length + 100) {
                answerBuilder.push(feinde[chosenFeind] + "#trenner#" + angriffsoptionen[i29]);
                if (answerBuilder.length == feinde.length) { //Wenn wir für alle eine Antworten haben gehts ab.
                    firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set(answerBuilder); //Erst bei der letzten Antwort
                    modus = 10;
                    optionenInMap(10, 0);
                } else {chosenFeind+=1;}
            }
        }
        
    }
}

function onOver(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 11){ MausOver(cx, cy, 11, 0)} else if (modus == 13){ 
        MausOver(cx, cy, 13, angriffsoptionen.length)
        schreiben(feinde[chosenFeind],50, 0.5); 
    }
}




