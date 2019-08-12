var weapon =new Array(); 

weapon[0] = {
    name: "default",
    schaden: 3,
    angriff: 2,
    radius: 150, //in px
    radmaxpunkt: 0.5,
    radmacht: 0.05, //wie breit beste Stelle ist
    standardmoves: [0, 1, 2],
    wmoves: []
}

//Wahrscheinlich ist es Weise, die von 0 bis x durchzugehen ohne zu überspringen

weapon[42] = {
    name: "Trollkeule",
    schaden: 3,
    angriff: 2,
    radius: 200, //in px
    radmaxpunkt: 0.7,
    radmacht: 0.2, //wie breit beste Stelle ist
    standardmoves: [0, 1, 2],
    wmoves: []
}

/*****************************************************ANGRIFFE*****************************************************/
/*****************************************************ANGRIFFE*****************************************************/
var wmove = new Array(); 

wmove[0] = {
    name: "default",
    schaden: 3,
    angriff: 2,
}

wmove[1] = {
    name: "test1",
    schaden: 3,
    angriff: 2,
}

wmove[2] = {
    name: "test2",
    schaden: 3,
    angriff: 2,
}