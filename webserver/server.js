
const fs = require("fs");
let express = require("express");

const host = 'localhost';
const port = 8000;
let server = express();
let allWordPairs = [];
let receivedFilename = [];
let usedIDs = [];

// allWordPairs.push(["Kochtopf", "Tee", "1"]);
// allWordPairs.push(["Geschirrtuch", "Tisch", "1"]);
// allWordPairs.push(["Schere", "Papier", "1"]);
// allWordPairs.push(["Tasse", "Topfdeckel", "4"]);
// allWordPairs.push(["Kerze", "Feuerzeug", "1"]);
// allWordPairs.push(["Lampe", "Kabel", "1"]);
// allWordPairs.push(["Bleistift", "Papiertaschentuch", "3"]);
// allWordPairs.push(["Plastikverpackung", "Klebeband", "2"]);
// allWordPairs.push(["Schwamm", "Spülmittel", "1"]);
// allWordPairs.push(["Korken", "Kugelschreiber", "6"]);
// allWordPairs.push(["Holzbrett", "Bleistift", "4"]);
// allWordPairs.push(["Spülmittel", "Gemüsemesser", "1"]);
// allWordPairs.push(["Nadel", "Faden", "1"]);
// allWordPairs.push(["Streichholz", "Schere", "6"]);
// allWordPairs.push(["Kochlöffel", "Kochtopf", "1"]);
// allWordPairs.push(["Glas", "Geschirrtuch", "1"]);
// allWordPairs.push(["Papiertaschentuch", "Teller", "3"]);
// allWordPairs.push(["Hemd", "Wäscheklammer", "2"]);
// allWordPairs.push(["Weinflasche", "Korken", "1"]);
// allWordPairs.push(["Hemd", "Bügeleisen", "1"]);
// allWordPairs.push(["Toilettenpapier", "Bleistift", "3"]);
// allWordPairs.push(["Tasse", "Streichholz", "6"]);
// allWordPairs.push(["Teller", "Kochtopf", "2"]);
// allWordPairs.push(["Faden", "Seife", "6"]);
// allWordPairs.push(["Weinflasche", "Topfdeckel", "5"]);
// allWordPairs.push(["Toilettenpapier", "Klebeband", "2"]);
// allWordPairs.push(["Kugelschreiber", "Klebeband", "5"]);
// allWordPairs.push(["Tee", "Tasse", "1"]);
// allWordPairs.push(["Waschmaschine", "Hemd", "1"]);
// allWordPairs.push(["Wäscheklammer", "Geschirrtuch", "1"]);
// allWordPairs.push(["Kochtopf", "Schwamm", "1"]);
// allWordPairs.push(["Bügeleisen", "Tisch", "3"]);
// allWordPairs.push(["Kaffeemaschine", "Kaffee", "1"]);
// allWordPairs.push(["Schwamm", "Waschmaschine", "4"]);
// allWordPairs.push(["Feuerzeug", "Plastikverpackung", "5"]);
// allWordPairs.push(["Kopfhörer", "Kabel", "2"]);
// allWordPairs.push(["Papiertaschentuch", "Waschmaschine", "6"]);
// allWordPairs.push(["Kaffee", "Glas", "2"]);
// allWordPairs.push(["Wäscheklammer", "Papiertaschentuch", "6"]);
// allWordPairs.push(["Topfdeckel", "Kochtopf", "1"]);
// allWordPairs.push(["Tee", "Kerze", "1"]);
// allWordPairs.push(["Tisch", "Teller", "1"]);
// allWordPairs.push(["Kaffeemaschine", "Kabel", "1"]);
// allWordPairs.push(["Geschirrtuch", "Nadel", "3"]);
// allWordPairs.push(["Gemüsemesser", "Holzbrett", "1"]);
// allWordPairs.push(["Gemüsemesser", "Feuerzeug", "6"]);
// allWordPairs.push(["Lampe", "Kochlöffel", "6"]);
// allWordPairs.push(["Seife", "Schwamm", "1"]);

// // { wordpair: [word1, word2], annotation: [distance, error, playerID, mode, bonus, distVersion] }
// allWordPairs.forEach(element => {
//     let data = { wordpair: [element[0], element[1]], annotation: [[element[2], "0", "0", "vorstudie", "0", "0"]] }
//     let jsonData = JSON.stringify(data, null, 2);
//     fs.writeFileSync(__dirname + "/data/" + element[0] + "-" + element[1] + ".json", jsonData);
// });

readFiles(__dirname + "/data/", function (filename, fileContent) {
    fileContent.annotation.forEach(element => {
        if (!usedIDs.includes(element[2])) {
            usedIDs.push(element[2]);
        }
    });
});


server.use(express.static(__dirname + "/.."));
server.use(express.json());

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

server.post("/getPlayerID", (req, res) => {
    const data = req.body;
    console.log(data);

    let rand = Math.floor(Math.random() * 999) + 100;
    while (usedIDs.includes(rand)) {
        rand = Math.floor(Math.random() * 999) + 100;
    }
    usedIDs.push(rand);

    res.json(rand);
});

server.post("/wordPairs", (req, res) => {
    allWordPairs = [];
    const data = req.body;
    console.log(data);

    // sync
    readFiles(__dirname + "/data/", function (filename, fileContent) {
        let average = 0;
        fileContent.annotation.forEach(element => {
            average += parseFloat(element[0]);
        });
        average = average / fileContent.annotation.length;
        console.log(filename + " : " + average);
        allWordPairs.push([fileContent.wordpair[0], fileContent.wordpair[1], average, fileContent.annotation.length]);
    });

    let jsonArray = { "array": allWordPairs };
    res.json(jsonArray);
});

server.post("/levelResult", (req, res) => {
    // req.body = [{ wordpair: [word1, word2], annotation: [distance, error, playerID, mode, bonus, distVersion] }, {}, ...]
    // save json files, TODO: ip checken auf vorhandene einträge

    console.log(req.body)

    for (elem of req.body) {
        receivedFilename[0] = elem.wordpair[0] + "-" + elem.wordpair[1] + ".json";
        receivedFilename[1] = elem.wordpair[1] + "-" + elem.wordpair[0] + ".json";
        let annotationData = [elem.annotation];
        let serverFilename;
        let isNewEntry = true;

        readFiles(__dirname + "/data/", function (filename, fileContent) {
            if (filename == receivedFilename[0] || filename == receivedFilename[1]) {
                fileContent.annotation.forEach(annotElem => {
                    if (annotElem[2] == elem.annotation[2]) {
                        isNewEntry = false;
                    } else {
                        annotationData.push(annotElem);
                        serverFilename = filename;
                        console.log(annotElem);
                    }
                });
            }
        });

        if (isNewEntry) {
            let jsonData = JSON.stringify({ wordpair: elem.wordpair, annotation: annotationData }, null, 2);
            if (serverFilename != null) {
                fs.writeFileSync(__dirname + "/data/" + serverFilename, jsonData);
            } else {
                fs.writeFileSync(__dirname + "/data/" + receivedFilename[0], jsonData);
            }
        }
    }

    res.json({ finished: "oh yeah" });
});


// sync
function readFiles(dirname, onFileContent) {
    let files = fs.readdirSync(dirname);
    files.forEach(element => {
        let content = fs.readFileSync(dirname + element);
        let entry = JSON.parse(content);
        onFileContent(element, entry);
    });
}

// async
// readFiles(__dirname + "/data/", function (filename, content) {
//     // TODO: Durchschnitt berechnen
//     let entry = JSON.parse(content);
//     allWordPairs.push([entry.wordpair[0], entry.wordpair[1], entry.annotation[0]]);
// }, function (err) {
//     throw err;
// });

// async
// function readFiles(dirname, onFileContent, onError) {
//     fs.readdir(dirname, function (err, filenames) {
//         if (err) {
//             onError(err);
//             return;
//         }
//         filenames.forEach(function (filename) {
//             fs.readFile(dirname + filename, 'utf-8', function (err, content) {
//                 if (err) {
//                     onError(err);
//                     return;
//                 }
//                 onFileContent(filename, content);
//             });
//         });
//     });
// }