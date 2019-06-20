var chosenChar = parseInt(getUrlVars()["char"]);

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

var ohneFrageDurchleveln = false;

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded

    var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(chosenChar).onsuccess = function(event) {
      document.getElementById("charnamefeld2").innerHTML = this.result.name;
      ansehenAktualisieren();

      document.getElementById("charbeschreibungdisplay").innerHTML = this.result.beschreibung; //Muss nicht nach unten, weil unveränderlich
    };
 });

/*****************************************************ANSEHEN*****************************************************/
/*****************************************************ANSEHEN*****************************************************/
function AddThisTree(baum){
  var baumname = "Error";
  if (baum == 1) {
    baumname = document.getElementById("CEdomaene1").value;
  } else if (baum == 2) {
    baumname = document.getElementById("CEdomaene2").value;
  } else if (baum == 3) {
    baumname = document.getElementById("CEdomaene3").value;
  }

  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 

    storage.get(chosenChar).onsuccess = function(event) {

      if(this.result.dpAusgegeben >= this.result.dpInsgesamt)
      {
          alert("Keine Domänenpunkte übrig!");
      } else {
        this.result.skilltreelist = this.result.skilltreelist + ", " + baumname;
        this.result.dpAusgegeben += 1;
        storage.put(this.result);
        ansehenAktualisieren();
      }
      
    }
  }
}

function charLeveln(){
  if (database) { 
  var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(chosenChar).onsuccess = function(event) {
      if (ohneFrageDurchleveln) {
        this.result.stufe += 1;
        this.result.ep += (this.result.stufe*2 - 1);
        this.result.epInsgesamt += (this.result.stufe*2 - 1);
        storage.put(this.result);
        ansehenAktualisieren();
      } else {
        if (confirm('Eine Stufe aufsteigen?')) {              
          this.result.stufe += 1;
          this.result.ep += (this.result.stufe*2 - 1);
          this.result.epInsgesamt += (this.result.stufe*2 - 1);

          this.result.dpInsgesamt = dpInsgesamtBerechnen(this.result);


          storage.put(this.result);
          ansehenAktualisieren();

          ohneFrageDurchleveln = true;
        } 
      } 
    }
  }
}

function charLoeschen(){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 

    storage.get(chosenChar).onsuccess = function(event) {
      if(this.result.id == 1)
      {
          alert("Du kannst den Beispielcharakter nicht löschen!");
      } else if (confirm('Möchtest du ' + this.result.name + '  wirklich löschen?')) {              
        var objectStoreRequest = storage.delete(chosenChar);
        objectStoreRequest.onsuccess = function(event) {
          storage.get(0).onsuccess = function(event) {
            this.result.chosenOne = 1;
            storage.put(this.result);
            window.location.href = '../index.html'; 
          }  
        };
      } //Alternativen:
    } 
  
  }
}


//##################################### Hilfsfähigkeit ##############################
function ansehenAktualisieren(){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    storage.get(chosenChar).onsuccess = function(event) {
      document.getElementById("charzusammenfassung").innerHTML = this.result.volk + " (" + this.result.stufe + "), " + this.result.religion + "<br>" +
      this.result.skilltreelist + "<br>" +
      this.result.skilllist + "<br>" +
      "Fähigkeitspunkte übrig: " + this.result.ep + "/" + this.result.epInsgesamt;

      document.getElementById("domainField").innerHTML = "Domänenpunkte: " + (this.result.dpInsgesamt - this.result.dpAusgegeben) + "/" + this.result.dpInsgesamt;

      //Die Selectboxen editieren
      var opt1 = document.createElement('option');
      opt1.appendChild( document.createTextNode('Legende') );
      opt1.value = 'Legende'; 
      if (this.result.stufe > 9) {document.getElementById('CEdomaene2').appendChild(opt1);}
      
    }
  }
}