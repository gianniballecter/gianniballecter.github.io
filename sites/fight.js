var chosenChar = parseInt(getUrlVars()["char"]);
var team = parseInt(getUrlVars()["team"]);

var modus = 0; //0 = start-Screen, 1 = setzphase, 2 = Bewegungsphase, 3 = Kampfphase; -2 erste Bewegungsvorbereitung
var uniqueID = uuidv4() + team;

var thecanvas = document.getElementById("playerCanvas");
var rect = thecanvas.getBoundingClientRect();
thecanvas.width= rect.right - rect.left;//horizontal resolution (?) - increase for better looking text
thecanvas.height= rect.bottom - rect.top;//
var ctx = thecanvas.getContext("2d");
thecanvas.addEventListener('click', onClick, false); 
thecanvas.addEventListener('mousemove', onOver, false);

var img_bg = new Image();
img_bg.src = "../images/papier.png";

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
            //strh = uniqueID + (Date.now() / 1);  //könnte man auch verwenden
            firebase.database().ref().child("Fight").child("Chars").child(uniqueID).set(this.result);

            firebase.database().ref().child("Fight").child(uniqueID).on('value', gotData, errData); //gotData bei jedem Change ausgeführt
            
          }   
    }
 });

/*****************************************************PHASE*0*****************************************************/
/*****************************************************PHASE*0*****************************************************/


function onClick(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 1){
        if (cy < 2*thecanvas.height/5) {
            // Bewegung
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Bewegung");
            modus = 0;
            restoreMap();

        } else if (cy > 4*thecanvas.height/5) {
            //Sturmangriff
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Bewegung");
            modus = 0;
            restoreMap();
        } else {
            //keine Bewegung
            firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("Stillstand");
            modus = 0;
            restoreMap();
        } 
        
    } 
}

function onOver(event){
    var cx = event.clientX - rect.left;
    var cy = event.clientY - rect.top;

    if (modus == 1){
        ctx.fillStyle = "rgba(230, 230, 230, 0.4)";
        if (cy < 2*thecanvas.height/5) {
            //ctx.fillRect(20, 20, 150, 100);
            ctx.beginPath();
            ctx.rect(0, 0, thecanvas.width, 2*thecanvas.height/5);

        } else if (cy >= 2*thecanvas.height/5 && cy < 4*thecanvas.height/5) {
            ctx.beginPath();
            ctx.rect(0, 2*thecanvas.height/5, thecanvas.width, 2*thecanvas.height/5);

        } else if (cy >= 4*thecanvas.height/5) {
            ctx.beginPath();
            ctx.rect(0, 4*thecanvas.height/5, thecanvas.width, thecanvas.height/5);
        }  
        restoreMap(); 
    } 
}

function gotData(data) {
    if (data.val() == "Willkommen") {
        restoreMap();
        firebase.database().ref().child("Fight").child("M" + uniqueID).child(uniqueID).set("hghgh");
    } else if (data.val() == "Start") {
        modus = 1;
        console.log(modus);
        restoreMap();
    }
}

function errData(err) {
    console.log("Error");
    console.log(err);
}


/*****************************************************HILFSFUNKTIONEN****************************************************/
/*****************************************************HILFSFUNKTIONEN****************************************************/

function uuidv4() { //Einzigartigkeit nicht garantiert, weil Math.Random zweifelhaft ist.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
  
function restoreMap(){
    ctx.drawImage(img_bg, 0, 0, 850, 850, 0, 0, thecanvas.width, thecanvas.height);

    ctx.fill();
    ctx.fillStyle = "#333333";

    if (modus == 1) {
        ctx.beginPath();
        ctx.moveTo(0, 2*thecanvas.height/5);
        ctx.lineTo(thecanvas.width, 2*thecanvas.height/5);
        ctx.stroke(); 
        ctx.beginPath();
        ctx.moveTo(0, 4*thecanvas.height/5);
        ctx.lineTo(thecanvas.width, 4*thecanvas.height/5);
        ctx.stroke(); 

        if (thecanvas.width >= thecanvas.height){
            ctx.font = (thecanvas.width/20) + "px Georgia";
        } else {
            ctx.font = (thecanvas.width/12) + "px Georgia";
        }
      
        schreiben("Bewegung", thecanvas.height/5);
        schreiben("keine Bewegung", 3*thecanvas.height/5);
        schreiben("Sturmangriff", 9*thecanvas.height/10);


    }
}

function schreiben(textString, y){
    textWidth = ctx.measureText(textString).width;
    if (thecanvas.width >= thecanvas.height){
        textHeight = (thecanvas.width/28);
    } else {
        textHeight = (thecanvas.width/18);
    }
    ctx.fillText(textString, (thecanvas.width/2) - (textWidth / 2), y + (textHeight / 2));
}