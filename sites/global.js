const leerChar = {
  id: 1, 
  name: "Beispielcharakter", 
  initialen: "Bsp",
  volk: "Darnländer", 
  rohattribute: [ 
    ZA = 11, //3 bis // 0 bis 7
    SI = 10,
    GE = 10,
    KR = 10,
    WI = 10,
    AG = 10,
    LE = 10,
    CH = 0 //0= ohne // steigt nur in Geraden werten
  ],
  attribute: [ZA = 50, SI = 50, GE = 50, KR = 50, WI = 50, AG = 50, LE = 50, CH = 50],
  religion: "Materistentum",
  stufe: 1,

  dpAusgegeben: 0,
  dpInsgesamt: 2,
  ep: 6,
  epInsgesamt: 6,
  beschreibung: "",
  skilltreelist: "Allgemein",
  skilllist: "",
  luck: 50,
  angriff: 50,
  inventar: [],

  lp: 3,
  vert: 3,
  attack: 3,
  energie: 3,
  menKraft: 3,
  tempo: 3
}

/*
const kChar = {
  id: 1, 
  name: "Beispielcharakter", 
  volk: "Darnländer", 
  attribute: [ZA = 50, SI = 50, GE = 50, KR = 50, WI = 50, AG = 50, LE = 50, CH = 50],
  religion: "Materistentum",
  stufe: 1,
  skilltreelist: "Allgemein",
  skilllist: "",
  //luck: 50,
  //angriff: 50,
  initiative: 50,
  inventar: []
}*/

/*****************************************************FUNKTIONEN*****************************************************/
/*****************************************************FUNKTIONEN*****************************************************/
function CharakterHinzu(addthischar){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    var i = 1;
    var alleIDs = [];
    addthischar.id = 1;

    storage.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) { //indexedDBs iterator
        alleIDs.push(cursor.value.id);
        cursor.continue();
      } else {
        while (addthischar.id == 1) {
          if (alleIDs[i] > i || alleIDs[i]  === undefined) {
            addthischar.id = i;
          }
          i++;
        }
        storage.put(addthischar); //put oder add ist wohl egal weil er ne neue ID wählt
        storage.get(0).onsuccess = function(event) {
          this.result.chosenOne = addthischar.id;
          storage.put(this.result);
        };  
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

function dpInsgesamtBerechnen(charakter){
  var bonusDP = 0;
  if (charakter.volk == "WerdenWirSehen") {bonusDP = 1;} //Ja kein Plan ecetuell auch === oder sowas?
  var grundDP = Math.round(1.75+ (0.4*charakter.attribute[6]+5)*(1+1.5*Math.pow(charakter.stufe, 0.8))/100);
  return (grundDP + bonusDP);
  
}

//Aus dem Internet Box-Mueller Normalverteilung
function randn_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function navigiere(ziel) {
  var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(0).addEventListener("success", function(event) {
      if (ziel == 0){
        window.location.href = '../index.html';
      } else if (ziel == 1){
        window.location.href = 'inventar.html?char=' + this.result.chosenOne;
      } else if (ziel == 2){
        window.location.href = 'probe.html?char=' + this.result.chosenOne;
      } else if (ziel == 3){
        window.location.href = 'strees.html';
      } else if (ziel == 4){
        window.location.href = 'ansehen.html?char=' + this.result.chosenOne;
      } 
  }); 

  

}