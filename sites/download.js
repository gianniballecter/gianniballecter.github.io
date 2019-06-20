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

/*****************************************************CLOUDSTUFF*****************************************************/
/*****************************************************CLOUDSTUFF*****************************************************/
openDownload();

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
   
  });  
}

var chosenToDownload = "Beispielcharakter";

function chooseThisCharacterToDownload(element){
  var x = document.getElementsByClassName("card"); var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = "";
    x[i].style.color = '#333333';
    x[i].style.textShadow = "1px 1px 4px whitesmoke";
  } 
  chosenToDownload = $(element).text();
  $(element).css('background-color', '#333333');
  $(element).css('color', 'whitesmoke');
  $(element).css('text-shadow', '0px 0px 0px whitesmoke');
  chosenToDownload = chosenToDownload.trim(); //unnötige Leerzeichen entfernen
  //chosenToDownload = chosenToDownload.replace(/\s+/g, ''); //unnötige Leerzeichen entfernen
 
}

function downloadThisCharToMyLibrary(){
  return firebase.database().ref().child("Chars").child(chosenToDownload).once('value').then(function(snapshot) {
    CharakterHinzu(snapshot.val());
    chosenToDownload = "Beispielcharakter"; //Alles auf Anfang
    var x = document.getElementsByClassName("card"); var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = "";
      x[i].style.color = '#333333';
      x[i].style.textShadow = "1px 1px 4px whitesmoke;";
    } 
  });   
}