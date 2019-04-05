function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var chosenChar = parseInt(getUrlVars()["char"]);

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
        storage.get(chosenChar).onsuccess = function(event) {
            document.getElementById("bonifeld").innerHTML = "Boni des Charkters"; //hies auslesen
        }
      }
 });

/*****************************************************ERSTELLUNG*****************************************************/
/*****************************************************ERSTELLUNG*****************************************************/
function probeMachen(wert){
    var Mittelwert = 1000;
    var Standardabweichung = 1;

    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
        storage.get(chosenChar).onsuccess = function(event) {
            if (wert < 8){Mittelwert = this.result.attribute[wert]}
            else if (wert == 8){Mittelwert = 50} //Glück
            else if (wert == 9){Mittelwert = 50} //Angriff

            Standardabweichung = 20;
          
            document.getElementById("probenfeld").innerHTML = Math.round((Mittelwert + randn_bm()*Standardabweichung)*100)/100;
        }
      }
}

