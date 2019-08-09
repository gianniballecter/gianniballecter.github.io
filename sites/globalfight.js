var charsImGame = [];


//Hier wird im wesentlichen die Karte beschrieben
var thecanvas = document.getElementsByClassName("leinwand")[0]; //Die erste (und einzige!) Canvas
//var thecanvas = document.getElementById("leinwand");
var rect = thecanvas.getBoundingClientRect();
thecanvas.width= rect.right - rect.left;//horizontal resolution (?) - increase for better looking text
thecanvas.height= rect.bottom - rect.top;//
var ctx = thecanvas.getContext("2d");

dragndrop = -1; //-1 = aus, Nummer = currentChar
dragndropx = 0; //Versatz beim dragndrop
dragndropy = 0;

var img_bg = new Image();
img_bg.src = "../images/papier.png";

var globalGespeicherteZeichenketten = []; //Was in den Optionen steht, ist gespeichert zum replizieren nach mouseover

function optionenInMap(mymodus, felderanzahl, contentZeichenketten){
    ctx.drawImage(img_bg, 0, 0, 850, 850, 0, 0, thecanvas.width, thecanvas.height);

    ctx.fill();
    ctx.fillStyle = "#333333";
    if (contentZeichenketten != null) {globalGespeicherteZeichenketten = contentZeichenketten;}

    if (mymodus == 11) {
        ctx.beginPath();
        ctx.moveTo(0, 2*thecanvas.height/5);
        ctx.lineTo(thecanvas.width, 2*thecanvas.height/5);
        ctx.stroke(); 
        ctx.beginPath();
        ctx.moveTo(0, 4*thecanvas.height/5);
        ctx.lineTo(thecanvas.width, 4*thecanvas.height/5);
        ctx.stroke(); 

       
      
        schreiben("aktiv", thecanvas.height/5, 0.5); //Bewegung
        schreiben("passiv", 3*thecanvas.height/5, 0.5); //keine Bewegung
        schreiben("Sturmangriff", 9*thecanvas.height/10, 0.5);


    } else if (mymodus == 13) {
        ctx.beginPath(); //erste Linie
        ctx.moveTo(0, 100);
        ctx.lineTo(thecanvas.width, 100);
        ctx.stroke(); 
        for (i23 = 0; i23 < felderanzahl; i23++) {
            ctx.beginPath();
            ctx.moveTo(0, i23*(thecanvas.height-100)/felderanzahl + 100);
            ctx.lineTo(thecanvas.width, i23*(thecanvas.height-100)/felderanzahl + 100);
            ctx.stroke(); 
            schreiben(globalGespeicherteZeichenketten[i23], (1+i23*2)*(thecanvas.height-100)/(2*felderanzahl) + 100, 0.5); 
        }  
    }
}

function MausOver(mausx, mausy, mymodus, felderanzahl){
    ctx.fillStyle = "rgba(230, 230, 230, 0.4)";
    if (mymodus == 11){
        if (mausy < 2*thecanvas.height/5) {
            ctx.beginPath();
            ctx.rect(0, 0, thecanvas.width, 2*thecanvas.height/5);

        } else if (mausy >= 2*thecanvas.height/5 && mausy < 4*thecanvas.height/5) {
            ctx.beginPath();
            ctx.rect(0, 2*thecanvas.height/5, thecanvas.width, 2*thecanvas.height/5);

        } else if (mausy >= 4*thecanvas.height/5) {
            ctx.beginPath();
            ctx.rect(0, 4*thecanvas.height/5, thecanvas.width, thecanvas.height/5);
        }  
        optionenInMap(11, 3); 
    } else if (mymodus == 13){
        for (i24 = 0; i24 < felderanzahl; i24++) {
            if (mausy >= i24*(thecanvas.height-100)/felderanzahl+100 && mausy < ((i24+1)*(thecanvas.height-100))/felderanzahl + 100) {
                ctx.beginPath();
                ctx.rect(0, i24*(thecanvas.height-100)/felderanzahl + 100, thecanvas.width, (thecanvas.height-100)/felderanzahl);
            }
        }
        optionenInMap(13, felderanzahl); 
    }
    
}

//Leben und Ausdauer zeichnen
function lp_und_ernergie_zeichnen(){
    if (dragndrop != -1){ 
        for (i2 = 0; i2 < Math.floor(charsImGame[dragndrop].lp_now); i2++) {
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.arc(20 + 40 * i2, 20, 15, 0, 2 * Math.PI)
            ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(20 + 40 * i2, 20, 15, 0, 2 * Math.PI * (charsImGame[dragndrop].lp_now % 1)) //Letzter Kreis
        ctx.fill();
        for (j2 = 0; j2 < Math.floor(charsImGame[dragndrop].energie_now); j2++) {
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.arc(20 + 40 * j2, 60, 15, 0, 2 * Math.PI)
            ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.moveTo(20 + 40 * j2, 60); //Damit es Kuchenstücke sind
        ctx.arc(20 + 40 * j2, 60, 15, 0, 2 * Math.PI * (charsImGame[dragndrop].energie_now % 1))
        ctx.closePath();
        ctx.fill();
    }
}

function schreiben(textString, y, xpercent){
    if (thecanvas.width >= thecanvas.height){
        ctx.font = (thecanvas.width/20) + "px Georgia";
    } else {
        ctx.font = (thecanvas.width/12) + "px Georgia";
    }

    textWidth = ctx.measureText(textString).width;
    if (thecanvas.width >= thecanvas.height){
        textHeight = (thecanvas.width/28);
    } else {
        textHeight = (thecanvas.width/18);
    }
    ctx.fillText(textString, (thecanvas.width * xpercent) - (textWidth / 2), y + (textHeight / 2));
}

/*****************************************************NichtsMitDerMap*****************************************************/
/*****************************************************NichtsMitDerMap*****************************************************/

function errData(err) {
    console.log("Error");
    console.log(err);
}