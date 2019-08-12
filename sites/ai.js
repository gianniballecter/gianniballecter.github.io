function minion_bewegung(nummer){
    charsImGame[nummer].information[0] = 2;
    document.getElementsByClassName("card2")[nummer].style.backgroundColor = "#333333"; //auf erledigt setzen
}

function minion_kampfmoves(nummer, feinde){
    //charsImGame[nummer].information[0] = 2;
    if (feinde == "Chillen") {
        //hf
    } else {
        console.log(feinde);
    }
    document.getElementsByClassName("card2")[nummer].style.backgroundColor = "#333333"; //auf erledigt setzen
}