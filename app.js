var chosenChar = 1;
const kekse = { //cookielike strukture
  id: 0, 
  name: "Error", 
  chosenOne: 1
}

modus = 0; //Kampfmodus

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

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
  window.location.href = 'sites/download.html';
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
  if (modus == 0){
    window.location.href = 'sites/erstellung.html';
  } else if (modus == 1){
    window.location.href = 'sites/kampf.html';
  }
}

function openSkilltrees() {
  if (modus == 0){
    window.location.href = 'sites/strees.html';
  } else if (modus == 1) {
    window.location.href = 'sites/fight.html?char=' + chosenChar + "&team=1";
  }
}

function openProbe(){
  if (modus == 0){
    window.location.href = 'sites/probe.html?char=' + chosenChar;
  } else if (modus == 1){
    $('#backbild').animateRotate(225, 0, 500, 'swing', function () {
      document.getElementById("btnerst").innerText = "Erstellung";
      document.getElementById("btndom").innerText = "Domänen";
      document.getElementById("btninv").innerText = "Inventar";
      document.getElementById("btnprobe").innerText = "Probe"; 
      modus = 0;
    });   
  }
}

function openInventar(){
  if (modus == 0){
    window.location.href = 'sites/inventar.html?char=' + chosenChar;
  } else if (modus == 1) {
    window.location.href = 'sites/fight.html?char=' + chosenChar + "&team=2";
  }
}

function openKampf(){
  if (modus == 0){
    $('#backbild').animateRotate(0, 225, 500, 'swing', function () {
      document.getElementById("btnerst").innerText = "SL";
      document.getElementById("btndom").innerText = "SC";
      document.getElementById("btninv").innerText = "NSC";
      document.getElementById("btnprobe").innerText = "Zurück";
      modus = 1;
        });   
    
  } else if (modus == 1){
    $('#backbild').animateRotate(225, 0, 500, 'swing', function () {
      document.getElementById("btnerst").innerText = "Erstellung";
      document.getElementById("btndom").innerText = "Domänen";
      document.getElementById("btninv").innerText = "Inventar";
      document.getElementById("btnprobe").innerText = "Probe"; 
      modus = 0;
    });   
    
  }
}

//Some jquery from internet
$.fn.animateRotate = function(start, angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: start}).animate({deg: angle}, args);
  });
};