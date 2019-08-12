const leerChar = {
  id: 1, 
  uniqueID: 0,
  name: "Beispielcharakter", 
  initialen: "Bsp",
  volk: "Darnländer", 
  rohattribute: [ 
    ZA = 5, 
    SI = 5,
    GE = 5,
    KR = 5,
    WI = 4,
    AG = 5,
    LE = 5,
    CH = 0 //0= ohne // steigt nur in Geraden werten
  ],
  attribute: [ZA = 60, SI = 60, GE = 60, KR = 60, WI = 52.5, AG = 60, LE = 60, CH = 0],
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
 /* waffen: [{
              name: "default",
              angriff: 2,
              standardmoves: [0, 1, 2],
              wmoves: [{name: "default", schaden: 3, angriff: 2}, {name: "test1", schaden: 3, angriff: 2}, {name: "test2", schaden: 3, angriff: 2}]
          }],*/
  waffen: [],
  chosenWaffe: 0,
  chilloptionen: ["Verteidigung", "Item", "SPEZIAL"], //im falle keines Angriffs

  lp: 5,
  energie: 5,
  
  vert: 3,
  attack: 3,
  menKraft: 3,
  tempo: 3
}

/*****************************************************FUNKTIONEN*****************************************************/
/*****************************************************FUNKTIONEN*****************************************************/
function CharakterHinzu(addthischar){
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    var i = 1;
    var alleIDs = [];
    addthischar.id = 1;
    if (addthischar.uniqueID == 0) {addthischar.uniqueID = uuidv4();}

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

function uuidv4() { //Einzigartigkeit nicht garantiert, weil Math.Random zweifelhaft ist.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}