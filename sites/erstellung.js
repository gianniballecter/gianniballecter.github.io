//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded
 });

/*****************************************************ERSTELLUNG*****************************************************/
/*****************************************************ERSTELLUNG*****************************************************/
function changeWert(wert, boolpositiv){
  var minWert = 2;
  var maxWert = 8;
  var akWert = 0;
  var neuWert = 0;
  var punkte = parseInt(document.getElementById("CEuPunkte").innerHTML);
  //wert in Array der Volksmodifikatoren einsetzen und min max ändern

  if (wert == 1){akWert = parseInt(document.getElementById("CEza").innerHTML)}
  else if (wert == 2){akWert = parseInt(document.getElementById("CEsi").innerHTML)}
  else if (wert == 3){akWert = parseInt(document.getElementById("CEge").innerHTML)}
  else if (wert == 4){akWert = parseInt(document.getElementById("CEkr").innerHTML)}
  else if (wert == 5){akWert = parseInt(document.getElementById("CEwi").innerHTML)}
  else if (wert == 6){akWert = parseInt(document.getElementById("CEag").innerHTML)}
  else if (wert == 7){akWert = parseInt(document.getElementById("CEle").innerHTML)}
  else if (wert == 8){akWert = parseInt(document.getElementById("CEch").innerHTML)}

  //Die ganznormalen Punkt drauf runter Buttons
  if (wert >= 1 && wert <= 7) {
    if (boolpositiv && akWert < maxWert && punkte > 0) 
    {
      neuWert = akWert + 1;
      document.getElementById("CEuPunkte").innerHTML = punkte - 1;
    } else if (!boolpositiv && akWert > minWert)
    {
      neuWert = akWert - 1;
      document.getElementById("CEuPunkte").innerHTML = punkte + 1;
    } else {neuWert = akWert;}

    if (wert == 1){document.getElementById("CEza").innerHTML = neuWert;}
    else if (wert == 2){document.getElementById("CEsi").innerHTML = neuWert;}
    else if (wert == 3){document.getElementById("CEge").innerHTML = neuWert;}
    else if (wert == 4){document.getElementById("CEkr").innerHTML = neuWert;}
    else if (wert == 5){document.getElementById("CEwi").innerHTML = neuWert;}
    else if (wert == 6){document.getElementById("CEag").innerHTML = neuWert;}
    else if (wert == 7){document.getElementById("CEle").innerHTML = neuWert;}
  }
  
  

  //Den +5er
  if (wert == 100 && punkte >= 7) {
    document.getElementById("CEza").innerHTML = parseInt(document.getElementById("CEza").innerHTML) + 1;
    document.getElementById("CEsi").innerHTML = parseInt(document.getElementById("CEsi").innerHTML) + 1;
    document.getElementById("CEge").innerHTML = parseInt(document.getElementById("CEge").innerHTML) + 1;
    document.getElementById("CEkr").innerHTML = parseInt(document.getElementById("CEkr").innerHTML) + 1;
    document.getElementById("CEwi").innerHTML = parseInt(document.getElementById("CEwi").innerHTML) + 1;
    document.getElementById("CEag").innerHTML = parseInt(document.getElementById("CEag").innerHTML) + 1;
    document.getElementById("CEle").innerHTML = parseInt(document.getElementById("CEle").innerHTML) + 1;
    document.getElementById("CEuPunkte").innerHTML = punkte - 7;
  } else if (wert == 100 && punkte >= 1) {
    for (i = 0; i < punkte; i++){
      if (parseInt(document.getElementById("CEza").innerHTML) < 8){
        document.getElementById("CEza").innerHTML = parseInt(document.getElementById("CEza").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      } 
      if (parseInt(document.getElementById("CEsi").innerHTML) < 8){
        document.getElementById("CEsi").innerHTML = parseInt(document.getElementById("CEsi").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }
      if (parseInt(document.getElementById("CEge").innerHTML) < 8){
        document.getElementById("CEge").innerHTML = parseInt(document.getElementById("CEge").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }  
      if (parseInt(document.getElementById("CEkr").innerHTML) < 8){
        document.getElementById("CEkr").innerHTML = parseInt(document.getElementById("CEkr").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }  
      if (parseInt(document.getElementById("CEwi").innerHTML) < 8){
        document.getElementById("CEwi").innerHTML = parseInt(document.getElementById("CEwi").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }  
      if (parseInt(document.getElementById("CEag").innerHTML) < 8){
        document.getElementById("CEag").innerHTML = parseInt(document.getElementById("CEag").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }  
      if (parseInt(document.getElementById("CEle").innerHTML) < 8){
        document.getElementById("CEle").innerHTML = parseInt(document.getElementById("CEle").innerHTML) + 1;
        punkte -= 1;
        if (punkte < 1) {break;}
      }
    }
    document.getElementById("CEuPunkte").innerHTML = punkte;
    
  }

}

function CETrySpeichern(){
  //Hier fehlende Felder Abfangen
  CESpeichern();
}

function CESpeichern(){
  //window.indexedDB.deleteDatabase("indexed-db");  database = undefined; //löscht die Datenbank
  var addchar = leerChar;

  addchar.name = document.getElementById("CEname").value;
  addchar.volk = document.getElementById("CEvolk").value;
  addchar.initialen = document.getElementById("CEnick").value;

  addchar.rohattribute[0] = parseInt(document.getElementById("CEza").innerHTML);
  addchar.rohattribute[1] = parseInt(document.getElementById("CEsi").innerHTML);
  addchar.rohattribute[2] = parseInt(document.getElementById("CEge").innerHTML);
  addchar.rohattribute[3] = parseInt(document.getElementById("CEkr").innerHTML);
  addchar.rohattribute[4] = parseInt(document.getElementById("CEwi").innerHTML);
  addchar.rohattribute[5] = parseInt(document.getElementById("CEag").innerHTML);
  addchar.rohattribute[6] = parseInt(document.getElementById("CEle").innerHTML);
  addchar.rohattribute[7] = 0;

  addchar.religion = document.getElementById("CEreligion").value ;
  addchar.stufe = parseInt(document.getElementById("CEstufe").value);
  addchar.beschreibung = document.getElementById("CEbeschreibung").value;
  
  //Verrechnung zu den Attributen 
  for (i = 0; i < 7; i++) {
    if (addchar.rohattribute[i] == 0){
      addchar.attribute[i] = 12.5;
    } else if (addchar.rohattribute[i] == 1){
      addchar.attribute[i] = 22.5;
    } else if (addchar.rohattribute[i] == 2){
      addchar.attribute[i] = 32.5;
    } else if (addchar.rohattribute[i] == 3){
      addchar.attribute[i] = 42.5;
    } else if (addchar.rohattribute[i] == 4){
      addchar.attribute[i] = 52.5;
    } else if (addchar.rohattribute[i] == 5){
      addchar.attribute[i] = 60;
    } else if (addchar.rohattribute[i] == 6){
      addchar.attribute[i] = 70;
    } else if (addchar.rohattribute[i] == 7){
      addchar.attribute[i] = 77.5;
    } else if (addchar.rohattribute[i] == 8){
      addchar.attribute[i] = 85;
    } else if (addchar.rohattribute[i] == 9){
      addchar.attribute[i] = 92.5;
    } else if (addchar.rohattribute[i] == 10){
      addchar.attribute[i] = 97.5;
    } 
  } 

  addchar.dpInsgesamt = dpInsgesamtBerechnen(addchar); //Müsste hier in Abhängikeit von Lehre eigentlich
  addchar.dpAusgegeben = 0;
  addchar.epInsgesamt = 5 + Math.pow(addchar.stufe, 2);
  addchar.ep = addchar.epInsgesamt;

  
  addchar.waffen.push(weapon[0]);
  for (i = 0; i < addchar.waffen[0].standardmoves.length; i++) {
    addchar.waffen[0].wmoves.push(wmove[addchar.waffen[0].standardmoves[i]]);
  }
  

  CharakterHinzu(addchar);
  alert(addchar.name + " hinzugefügt!");
}

/*****************************************************HILFE*****************************************************/
