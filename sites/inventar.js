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
    inventarAktualisieren();
 });

/*****************************************************ERSTELLUNG*****************************************************/
/*****************************************************ERSTELLUNG*****************************************************/
function addItem(){
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {
            this.result.inventar.push(document.getElementById("gegenstandName").value);
            storage.put(this.result);
            inventarAktualisieren();
        }
    }
}

function deleteItem(gegenstand){
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {
            this.result.inventar.splice(gegenstand, 1); 
            storage.put(this.result);
            inventarAktualisieren();
        }
    }
}

function inventarAktualisieren(){
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
    
        storage.get(chosenChar).onsuccess = function(event) {
            dataf = this.result.inventar;
            let html = "";
            var i = 0;
            dataf.forEach(function(element) {
                html += `<div class="card" onclick="javascript:deleteItem(` + i + `)">
                <h2>${element}</h2>
                </div>
                `;
                i++;
            });

            document.getElementById("inventarcontainer").innerHTML = html;
        }
      }
}

function addStandard(){
    if (database) { 
        var storage = database.transaction("data", "readwrite").objectStore("data"); 
        storage.get(chosenChar).onsuccess = function(event) {
            this.result.inventar.push("Einfache Kleidung", "Stiefel", "Rucksack", "Wasserflasche", "Reiseproviant (1)", "Taschenmesser", "Taschentuch",  
            "Schachtel Zigaretten", "Schlafsack", "Decke", "Geldbeutel mit ein paar Hellern");
            storage.put(this.result);
            inventarAktualisieren();
        }
    }
}