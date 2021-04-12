const fs = require("fs");
let csv = require("fast-csv");

console.log("creating string csv");

// let ws = fs.createWriteStream(__dirname + "/noPrestudyData.csv");
// let csvData = [["Wortpaar", "zugeteilte Distanz", "Distanz Klasse", "Verglichen mit gegebener Distanz", "Spieler ID", "Art des Levels", "Version der gegebenen Distanz", "Anzahl Bewertungen"]];

let ws = fs.createWriteStream(__dirname + "/completeData.csv");
let csvData = [["Wortpaar", "zugeteilte Distanz", "Distanz Klasse", "Verglichen mit gegebener Distanz", "Spieler ID", "Art des Levels", "Version der gegebenen Distanz", "Anzahl Bewertungen", "Ursprung"]];

readFiles(__dirname + "/data/", function (filename, fileContent) {

    let preStudyEntry = 0;

    // fileContent.annotation.forEach(val => {
    //     if (val.includes("vorstudie")) {
    //         preStudyEntry = 1;
    //     }
    // });

    fileContent.annotation.forEach(val => {
        // if (!val.includes("vorstudie")) {
            parseFloat(val[0]);
            let distClass = 0;
            if (val[0] <= 2) {
                distClass = 1;
            } else if (val[0] <= 4) {
                distClass = 2;
            } else {
                distClass = 3;
            }

            // csvData.push([fileContent.wordpair[0] + "-" + fileContent.wordpair[1], val[0], distClass, val[1], val[2], val[4], val[5], fileContent.annotation.length - preStudyEntry]);
            
            csvData.push([fileContent.wordpair[0] + "-" + fileContent.wordpair[1], val[0], distClass, val[1], val[2], val[4], val[5], fileContent.annotation.length - preStudyEntry, val[3]]);
        // }
    });

});

csv.write(csvData, { headers: true }).pipe(ws);


function readFiles(dirname, onFileContent) {
    let files = fs.readdirSync(dirname);
    files.forEach(element => {
        let content = fs.readFileSync(dirname + element);
        let entry = JSON.parse(content);
        onFileContent(element, entry);
    });
}