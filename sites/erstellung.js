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
  var minWert = 3;
  var maxWert = 25;
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
  if (wert == 100 && punkte >= 21) {
    document.getElementById("CEza").innerHTML = parseInt(document.getElementById("CEza").innerHTML) + 3;
    document.getElementById("CEsi").innerHTML = parseInt(document.getElementById("CEsi").innerHTML) + 3;
    document.getElementById("CEge").innerHTML = parseInt(document.getElementById("CEge").innerHTML) + 3;
    document.getElementById("CEkr").innerHTML = parseInt(document.getElementById("CEkr").innerHTML) + 3;
    document.getElementById("CEwi").innerHTML = parseInt(document.getElementById("CEwi").innerHTML) + 3;
    document.getElementById("CEag").innerHTML = parseInt(document.getElementById("CEag").innerHTML) + 3;
    document.getElementById("CEle").innerHTML = parseInt(document.getElementById("CEle").innerHTML) + 3;
    document.getElementById("CEuPunkte").innerHTML = punkte - 21;
  } else if (wert == 100 && punkte >= 7) {
    document.getElementById("CEza").innerHTML = parseInt(document.getElementById("CEza").innerHTML) + 1;
    document.getElementById("CEsi").innerHTML = parseInt(document.getElementById("CEsi").innerHTML) + 1;
    document.getElementById("CEge").innerHTML = parseInt(document.getElementById("CEge").innerHTML) + 1;
    document.getElementById("CEkr").innerHTML = parseInt(document.getElementById("CEkr").innerHTML) + 1;
    document.getElementById("CEwi").innerHTML = parseInt(document.getElementById("CEwi").innerHTML) + 1;
    document.getElementById("CEag").innerHTML = parseInt(document.getElementById("CEag").innerHTML) + 1;
    document.getElementById("CEle").innerHTML = parseInt(document.getElementById("CEle").innerHTML) + 1;
    document.getElementById("CEuPunkte").innerHTML = punkte - 7;
  }
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
  //addchar.rohattribute[7] = parseInt(document.getElementById("CEch").innerHTML);
  addchar.rohattribute[7] = 0;

  addchar.religion = document.getElementById("CEreligion").value ;
  addchar.stufe = parseInt(document.getElementById("CEstufe").value);
  addchar.beschreibung = document.getElementById("CEbeschreibung").value;
  
  //Verrechnung zu den Attributen 
  var i;
  var zwischenwert;
  for (i = 0; i < 7; i++) {
    zwischenwert = addchar.rohattribute[i] - 10;
    zwischenwert = 210*Math.sqrt(Math.PI)*erf(zwischenwert+(3/5)) + 12*zwischenwert*Math.abs(zwischenwert) + 12*Math.pow(zwischenwert, 2)-840*zwischenwert;
    addchar.attribute[i] = (-zwischenwert/175) + 51.5;
  } 
  
  addchar.dpInsgesamt = dpInsgesamtBerechnen(addchar); //Müsste hier in Abhängikeit von Lehre eigentlich
  addchar.dpAusgegeben = 0;
  addchar.epInsgesamt = 5 + Math.pow(addchar.stufe, 2);
  addchar.ep = addchar.epInsgesamt;

  CharakterHinzu(addchar);
  alert(addchar.name + " hinzugefügt!");
}

/*****************************************************HILFE*****************************************************/
//Gaußsche Fehlerfunktion
function erf(x) {
  var z;
  const ERF_A = 0.147; 
  var the_sign_of_x;
  if(0==x) {
      the_sign_of_x = 0;
      return 0;
  } else if(x>0){
      the_sign_of_x = 1;
  } else {
      the_sign_of_x = -1;
  }

  var one_plus_axsqrd = 1 + ERF_A * x * x;
  var four_ovr_pi_etc = 4/Math.PI + ERF_A * x * x;
  var ratio = four_ovr_pi_etc / one_plus_axsqrd;
  ratio *= x * -x;
  var expofun = Math.exp(ratio);
  var radical = Math.sqrt(1-expofun);
  z = radical * the_sign_of_x;
  return z;
}