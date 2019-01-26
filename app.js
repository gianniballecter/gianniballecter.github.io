var chosenChar = 1;
const leerChar = {
  id: 1, 
  name: "Beispielcharakter", 
  volk: "Darnländer", 
  si: 10,
  vt: 10,
  at: 10,
  ge: 10,
  religion: "Materistentum",
  stufe: 1,
  beschreibung: "",
  skilltreelist: "Allgemein",
  skilllist: ""
}

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("upgradeneeded", function(event) {     
    var storage = this.result.createObjectStore("data", {keyPath: "id", autoIncrement: true}); // create a new object store called data
    //objectStore.createIndex("title", "title", {unique: false}); //Zeile von woanders zum Suchen per Index
    storage.add(leerChar); //Einen Adden
    alert("Creating a new database!");
});


idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded

    var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(chosenChar).addEventListener("success", function(event) {
        document.getElementById("charnamefeld").innerHTML = this.result.name;
        //this.result.beschreibung = "lololol";
        //storage.put(this.result); //unnötig
    });
    console.log("Successfully opened database!");
 });

/*****************************************************CLOUDSTUFF*****************************************************/
/*****************************************************CLOUDSTUFF*****************************************************/
 //Der gesamte UserID-Stuff fehlt. Die Datenbank ist ungesichtert
function uploadThisChar(){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    storage.get(chosenChar).onsuccess = function(event) {
      if (confirm('Möchtest du ' + this.result.name + ' hochladen?')) {              
        firebase.database().ref().child("Chars").child(this.result.name).set(this.result);
      } //Alternativen:
    }   //firebase.database().ref().child("Text").set("usernamename");
  }     //firebase.database().ref().child("Text").set({Name: "John", Alter: 24,}); 
}

function openDownload(){
  return firebase.database().ref().child("Chars").once('value').then(function(snapshot) {
    //var userData = snapshot.val(); //console.log(userData.Text.Name);
  
    dataf = Object.keys(snapshot.val());
    let html = "";
    dataf.forEach(function(element) {
      html += `<div class="card" onclick="javascript:chooseThisCharacterToDownload(this)">
      <h2>${element}</h2>
      </div>
      `;
    });

    document.getElementById("dlcharcontainer").innerHTML = html;
    window.location.hash = 'pageCharDownload';
  });  
}

var chosenToDownload = "Beispielcharakter";

function chooseThisCharacterToDownload(element){
  var x = document.getElementsByClassName("card"); var i;
  for (i = 0; i < x.length; i++) {x[i].style.backgroundColor = "#1e46be";} //andere Hintergründe blau
  chosenToDownload = $(element).text();
  $(element).css('background-color', '#000000');
  chosenToDownload = chosenToDownload.replace(/\s+/g, ''); //unnötige Leerzeichen entfernen
}

function downloadThisCharToMyLibrary(){
  return firebase.database().ref().child("Chars").child(chosenToDownload).once('value').then(function(snapshot) {
    CharakterHinzu(snapshot.val());
    chosenToDownload = "Beispielcharakter"; //Alles auf Anfang
    var x = document.getElementsByClassName("card"); var i;
    for (i = 0; i < x.length; i++) {x[i].style.backgroundColor = "#1e46be";} //andere Hintergründe blau
  });   
}

/*****************************************************PFEILE*****************************************************/
/*****************************************************PFEILE*****************************************************/
function changeChar(boolpositiv){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    var aktuelleNummer = 0;
    var alleIDs = [];

    storage.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) { //indexedDBs iterator
        if (cursor.value.id == chosenChar) {aktuelleNummer = alleIDs.length;}
        alleIDs.push(cursor.value.id)
        cursor.continue();
      } else {
        //console.log(alleIDs);
        //alleIDs
        if (boolpositiv && aktuelleNummer == (alleIDs.length - 1))
        {
          chosenChar = alleIDs[0];
        } else if (!boolpositiv && aktuelleNummer == 0)
        {
          chosenChar = alleIDs[alleIDs.length - 1];
        } else if (boolpositiv){
          chosenChar = alleIDs[aktuelleNummer + 1];
        } else {
          chosenChar = alleIDs[aktuelleNummer - 1];
        }

        storage.get(chosenChar).onsuccess = function(event) {
          document.getElementById("charnamefeld").innerHTML = this.result.name;}
      }
    };
  }
}

/*****************************************************SKILLTREES*****************************************************/
/*****************************************************SKILLTREES*****************************************************/
var mySkilltreepage = $("#skilltreepage");
var scrollto = ((1000 - mySkilltreepage.width()) / 2);
mySkilltreepage.animate({ scrollLeft:  scrollto}); //richtig scrollen


function openSkilltrees() {
  document.getElementById('TreeIFrame').contentWindow.location.reload(); //Eventuell müssen wir beim rausgehen reloaden nicht hier?
  document.getElementById('TreeIFrame').addEventListener('load', function() {
    var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(chosenChar).onsuccess = function(event) {
      $("#TreeIFrame").contents().find("#TreesFromApp").val(this.result.skilltreelist); 
      $("#TreeIFrame").contents().find("#InputFromApp").val(this.result.skilllist); 
      $('#TreeIFrame').contents().find("#InputFromApp").trigger('change');
      window.location.hash = 'skilltreepage';
    }
  });
}

function SaveTree(){
  var inputfromiframe = $('#TreeIFrame').contents().find('#OutputFromApp').val()

  if(inputfromiframe === "")
  {
    alert("empty");
  } else {
    var stringskills = inputfromiframe.split(", ");
    var trenner = stringskills[0].split(".");
    var skillz = trenner[0];
    var talentpunkte = parseInt(trenner[1]);
    var i;
    for (i = 1; i < stringskills.length; i++) {
      trenner = stringskills[i].split(".");
      skillz = skillz + ", " + trenner[0];
      talentpunkte += parseInt(trenner[1]);
    } 
    document.getElementById("testTxt").textContent = talentpunkte;
   
    if (database) { 
      var storage = database.transaction("data", "readwrite").objectStore("data"); 

      storage.get(chosenChar).onsuccess = function(event) {
        this.result.skilllist = skillz;
        storage.put(this.result);
      }
    }
  }
}

/*****************************************************ANSEHEN*****************************************************/
/*****************************************************ANSEHEN*****************************************************/
function openAnsehen(){
  var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
  storage.get(chosenChar).onsuccess = function(event) {
      document.getElementById("charnamefeld2").innerHTML = this.result.name;
      document.getElementById("charzusammenfassung").innerHTML = this.result.volk + " (" + this.result.stufe + "), " + this.result.religion + "<br>" +
      this.result.skilltreelist + "<br>" +
      this.result.skilllist + "<br>" +
      "SI:" + this.result.si;
      document.getElementById("charbeschreibungdisplay").innerHTML = this.result.beschreibung;
  };
    window.location.hash = 'pageAnsehen';
}

function AddThisTree(){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 

    storage.get(chosenChar).onsuccess = function(event) {
      this.result.skilltreelist = this.result.skilltreelist + ", " + document.getElementById("CEdomaene").value;
      storage.put(this.result);
      openAnsehen();
    }
  }
}

/*****************************************************ERSTELLUNG*****************************************************/
/*****************************************************ERSTELLUNG*****************************************************/
function openErstellung(){
  window.location.hash = 'pageErstellen';
}

function CESpeichern(){
  //window.indexedDB.deleteDatabase("indexed-db");  database = undefined; //löscht die Datenbank
  var addchar = leerChar;

  addchar.name = document.getElementById("CEname").value ;
  addchar.volk = document.getElementById("CEvolk").value;

  addchar.si = parseInt(document.getElementById("CEsi").value);
  addchar.vt = parseInt(document.getElementById("CEvt").value);
  addchar.at = parseInt(document.getElementById("CEat").value);
  addchar.ge = parseInt(document.getElementById("CEge").value);

  addchar.religion = document.getElementById("CEreligion").value ;
  addchar.stufe = parseInt(document.getElementById("CEstufe").value);
  addchar.beschreibung = document.getElementById("CEbeschreibung").value ;

  CharakterHinzu(addchar);
  alert(addchar.name + " hinzugefügt!");
}


/*****************************************************ALLGEMEIN*****************************************************/
/*****************************************************ALLGEMEIN*****************************************************/
/*****************************************************ALLGEMEIN*****************************************************/
/*****************************************************ALLGEMEIN*****************************************************/

function CharakterHinzu(addthischar){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    var i = 1;
    var alleIDs = [];
    addthischar.id = 1;

    storage.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) { //indexedDBs iterator
        alleIDs.push(cursor.value.id)
        cursor.continue();
      } else {
        while (addthischar.id == 1) {
          if (alleIDs[i] > (i + 1) || alleIDs[i]  === undefined) {
            addthischar.id = (i + 1);
          }
          i++;
        }
        storage.add(addthischar);
      }
    };

    //window.indexedDB.deleteDatabase("indexed-db");  database = undefined; //löscht die Datenbank
    /*
    var countRequest = objectStore.count();
    countRequest.onsuccess = function() {
      console.log(countRequest.result);

    }*/
  }

}