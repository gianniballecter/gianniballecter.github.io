var chosenChar = 1;
const kekse = { //cookielike strukture
  id: 0, 
  name: "Error", 
  chosenOne: 1
}

var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("upgradeneeded", function(event) {     
    var storage = this.result.createObjectStore("data", {keyPath: "id", autoIncrement: true}); // create a new object store called data
    //objectStore.createIndex("title", "title", {unique: false}); //Zeile von woanders zum Suchen per Index
    storage.add(kekse); //Cookies hinzufügen
    storage.add(leerChar); //Einen Adden
    alert("Willkommen!");
});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded

    var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(0).addEventListener("success", function(event) {
      chosenChar= this.result.chosenOne; //Den gewählten Char herausfinden
      storage.get(chosenChar).addEventListener("success", function(event) {
          document.getElementById("charnamefeld").innerHTML = this.result.name;
          //this.result.beschreibung = "lololol";
          //storage.put(this.result); //unnötig
      });
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
  chosenToDownload = chosenToDownload.trim(); //unnötige Leerzeichen entfernen
  //chosenToDownload = chosenToDownload.replace(/\s+/g, ''); //unnötige Leerzeichen entfernen
 
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
          chosenChar = alleIDs[1];
        } else if (!boolpositiv && aktuelleNummer == 1)
        {
          chosenChar = alleIDs[alleIDs.length - 1];
        } else if (boolpositiv){
          chosenChar = alleIDs[aktuelleNummer + 1];
        } else {
          chosenChar = alleIDs[aktuelleNummer - 1];
        }

        storage.get(chosenChar).onsuccess = function(event) {
          document.getElementById("charnamefeld").innerHTML = this.result.name;}
        storage.get(0).onsuccess = function(event) {
            this.result.chosenOne = chosenChar;
            storage.put(this.result);}  
      }
    };
  }
}

/*****************************************************LINKS*****************************************************/
/*****************************************************LINKS*****************************************************/
function openAnsehen(){
  window.location.href = 'sites/ansehen.html?char=' + chosenChar;
}

function openErstellung(){
  window.location.href = 'sites/erstellung.html';
}

function openSkilltrees() {
  window.location.href = 'sites/strees.html';
}

function openProbe(){
  window.location.href = 'sites/probe.html?char=' + chosenChar;
}

function openInventar(){
  window.location.href = 'sites/inventar.html?char=' + chosenChar;
}

function openKampf(){
  window.location.href = 'sites/kampf.html';
}