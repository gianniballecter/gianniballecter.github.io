var chosenChar = 0;
var TreesFA = "Error";
var InputFA = "Error";
var alleTrees = [];
var aktuelleNummer = 0;

var globalSkilllist;
var globalEP;
var charLegal = true; //Ist der Char speicherbar

//var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
//if(isAndroid) { document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');} //resizing

//var scrollto = ((1000 - $(window).width()) / 2);
//document.getElementById("hauptmenu").animate({ scrollLeft:  scrollto}); //richtig scrollen

$('#hauptmenu').animate({ scrollLeft: ((1000 - $(window).width()) / 2) },  0);

/*****************************************************INDEXEDDB*****************************************************/
/*****************************************************INDEXEDDB*****************************************************/
var database, idb_request;
idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) { alert("Could not open Indexed DB due to error: " + this.errorCode);});

idb_request.addEventListener("success", function(event) {
    database = this.result;// store the database for later use //oder muss das bei onupdateneeded

    var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
    storage.get(0).addEventListener("success", function(event) {
      chosenChar= this.result.chosenOne; //Den gewählten Char herausfinden
      skillz_installieren();
    }); 
 });

/*****************************************************SKILLTREES*****************************************************/
/*****************************************************SKILLTREES*****************************************************/

function skillz_installieren() {
  history.replaceState(null, null, ' ');  //Seite wieder auf den Anfang setzen
  var storage = database.transaction("data", "readwrite").objectStore("data"); //use  data 
  storage.get(chosenChar).onsuccess = function(event) {
    TreesFA = this.result.skilltreelist;
    InputFA = this.result.skilllist;

	  alleTrees = TreesFA.split(", "); //Alle besessenen Trees in den Arbeitsspeicher
	  document.getElementById("skilltreename").textContent = alleTrees[aktuelleNummer];

	  disableTheStyles();
	  document.getElementById("Allgemein").disabled = false;
	  document.getElementById("Allgemein").href += "";

	  var dieserCharakter = CharakterSkillTreeList; //Das aus der externen Datei skillTreeList
	  if(InputFA !== ""){ //Falls wir schon Skillz im Charakter haben
		  var stringskills = InputFA.split(", ");
		  var i;
		  for (i = 0; i < stringskills.length; i++) {
			  dieserCharakter.skills[stringskills[i] - 1].points = 1; //Ändere die Konstante
		  } 
	  }
	  (function($, ko, data){
		  $(function(){  //Create and bind the viewmodel; das ist gekürzt aus der Vorlage
			  var vm = new tft.skilltree.Calculator(data);
			  ko.applyBindings(vm);
		  });
	  })
    (window.jQuery, window.ko, dieserCharakter);

    EPUpdaten(); 
  }
}

//Die Pfeile
function switch_style(boolpositiv)
{
	if (boolpositiv && aktuelleNummer == (alleTrees.length - 1))
  {
		aktuelleNummer = 0;
  } else if (!boolpositiv && aktuelleNummer == 0)
  {
		aktuelleNummer = alleTrees.length - 1;
  } else if (boolpositiv){
    aktuelleNummer += 1;
  } else {
    aktuelleNummer -= 1;
	}
	document.getElementById("skilltreename").textContent = alleTrees[aktuelleNummer]; 

	/*
	var stylesheet = document.styleSheets[1];
	if (stylesheet.disabled == false) {stylesheet.disabled = true; document.styleSheets[2].disabled = false;}
	else if (stylesheet.disabled == true) {stylesheet.disabled = false; document.styleSheets[2].disabled = true;}*/
	disableTheStyles();
	document.getElementById(alleTrees[aktuelleNummer]).disabled = false; //Hier wird der Skilltree mit der id die dem value bei Ansehen/Domänen entspricht angeschaltet
	document.getElementById(alleTrees[aktuelleNummer]).href += "";
}

function SaveTree(){
  var inputfromiframe = document.getElementById("OutputFromApp").value;

  if(inputfromiframe === "")
  {
    alert("empty");
  } else if (charLegal == false) {
    alert("nicht ausreichend Punkte");
  } else {
    if (database) { 
      var storage = database.transaction("data", "readwrite").objectStore("data"); 

      storage.get(chosenChar).onsuccess = function(event) {
        this.result.skilllist = globalSkilllist; //Fähigkeiten eintragen
        this.result.ep = this.result.epInsgesamt - globalEP; //"EP übrig" eintragen
        storage.put(this.result);
      }
    }
  }
}

function EPUpdaten(){
  var inputfromiframe = document.getElementById("OutputFromApp").value;

  var talentpunkte = "0";
  if(inputfromiframe !== "") {
    var stringskills = inputfromiframe.split(", ");
    var trenner = stringskills[0].split(".");
    var skillz = trenner[0];

    talentpunkte = parseInt(trenner[1]);
    var i;
    for (i = 1; i < stringskills.length; i++) {
      trenner = stringskills[i].split(".");
      skillz = skillz + ", " + trenner[0];
      talentpunkte += parseInt(trenner[1]);
    } 

    globalSkilllist = skillz;
    globalEP = talentpunkte;
  
  }
  
  if (database) { 
    var storage = database.transaction("data", "readwrite").objectStore("data"); 
    storage.get(chosenChar).onsuccess = function(event) {
      document.getElementById("testTxt").textContent = talentpunkte + "/" + this.result.epInsgesamt;
      if (talentpunkte > this.result.epInsgesamt){
        charLegal = false;
      } else {charLegal = true;}
    }
  }
}

//Hilfsfunktion
function disableTheStyles(){
	var i;
	for (i = 2; i < document.styleSheets.length; i++) {
		document.styleSheets[i].disabled = true;
	}
}