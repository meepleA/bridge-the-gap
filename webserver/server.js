const http = require("http");
const fs = require("fs");
let express = require("express");

const host = 'localhost';
const port = 8000;
let server = express();
let allWordPairs = [];
let receivedFilename = [];
let annotationData;
// TODO: aus files zusammenstellen
// allWordPairs.push(["Kochtopf", "Tee", "0"]);
// allWordPairs.push(["Geschirrtuch", "Tisch", "0"]);
// allWordPairs.push(["Schere", "Papier", "0"]);
// allWordPairs.push(["Tasse", "Topfdeckel", "3"]);
// allWordPairs.push(["Kerze", "Feuerzeug", "0"]);
// allWordPairs.push(["Lampe", "Kabel", "0"]);
// allWordPairs.push(["Bleistift", "Papiertaschentuch", "2"]);
// allWordPairs.push(["Plastikverpackung", "Klebeband", "1"]);
// allWordPairs.push(["Schwamm", "Spülmittel", "0"]);
// allWordPairs.push(["Korken", "Kugelschreiber", "5"]);
// allWordPairs.push(["Holzbrett", "Bleistift", "3"]);
// allWordPairs.push(["Spülmittel", "Gemüsemesser", "0"]);
// allWordPairs.push(["Nadel", "Faden", "0"]);
// allWordPairs.push(["Streichholz", "Schere", "5"]);
// allWordPairs.push(["Kochlöffel", "Kochtopf", "0"]);
// allWordPairs.push(["Glas", "Geschirrtuch", "0"]);
// allWordPairs.push(["Papiertaschentuch", "Teller", "2"]);
// allWordPairs.push(["Hemd", "Wäscheklammer", "1"]);
// allWordPairs.push(["Weinflasche", "Korken", "0"]);
// allWordPairs.push(["Hemd", "Bügeleisen", "0"]);

// allWordPairs.push(["Kochtopf", "Tee", "1"]);
// allWordPairs.push(["Geschirrtuch", "Tisch", "1"]);
// allWordPairs.push(["Schere", "Papier", "1"]);
// allWordPairs.push(["Tasse", "Topfdeckel", "2"]);
// allWordPairs.push(["Kerze", "Feuerzeug", "1"]);
// allWordPairs.push(["Lampe", "Kabel", "1"]);
// allWordPairs.push(["Bleistift", "Papiertaschentuch", "2"]);
// allWordPairs.push(["Plastikverpackung", "Klebeband", "1"]);
// allWordPairs.push(["Schwamm", "Spülmittel", "1"]);
// allWordPairs.push(["Korken", "Kugelschreiber", "3"]);
// allWordPairs.push(["Holzbrett", "Bleistift", "2"]);
// allWordPairs.push(["Spülmittel", "Gemüsemesser", "1"]);
// allWordPairs.push(["Nadel", "Faden", "1"]);
// allWordPairs.push(["Streichholz", "Schere", "3"]);
// allWordPairs.push(["Kochlöffel", "Kochtopf", "1"]);
// allWordPairs.push(["Glas", "Geschirrtuch", "1"]);
// allWordPairs.push(["Papiertaschentuch", "Teller", "2"]);
// allWordPairs.push(["Hemd", "Wäscheklammer", "1"]);
// allWordPairs.push(["Weinflasche", "Korken", "1"]);
// allWordPairs.push(["Hemd", "Bügeleisen", "1"]);


// allWordPairs.forEach(element => {
//     let data = { wordpair: [element[0], element[1]], annotation: [[element[2], "0", "0", "vorstudie", "0"]] }
//     let jsonData = JSON.stringify(data, null, 2);
//     fs.writeFileSync(__dirname + "/data/" + element[0] + "-" + element[1] + ".json", jsonData);
// });



server.use(express.static(__dirname + "/.."));
server.use(express.json());

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
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
        allWordPairs.push([fileContent.wordpair[0], fileContent.wordpair[1], average]);
    });

    let jsonArray = { "array": allWordPairs };
    res.json(jsonArray);
});

server.post("/levelResult", (req, res) => {
    // req.body = [{ wordpair: [word1, word2], annotation: [distance, error, playerID, mode, bonus] }, {}, ...]
    // save json files, TODO: ip checken auf vorhandene einträge

    console.log(req.body)

    for (elem of req.body) {
        receivedFilename[0] = elem.wordpair[0] + "-" + elem.wordpair[1] + ".json";
        receivedFilename[1] = elem.wordpair[1] + "-" + elem.wordpair[0] + ".json";
        annotationData = [elem.annotation];
        let serverFilename;

        readFiles(__dirname + "/data/", function (filename, fileContent) {
            if (filename == receivedFilename[0] || filename == receivedFilename[1]) {
                fileContent.annotation.forEach(element => {
                    annotationData.push(element);
                    serverFilename = filename;
                });
            }
        });
        let jsonData = JSON.stringify({ wordpair: elem.wordpair, annotation: annotationData }, null, 2);
        if (serverFilename != null) {
            fs.writeFileSync(__dirname + "/data/" + serverFilename, jsonData);
        } else {
            fs.writeFileSync(__dirname + "/data/" + receivedFilename[0], jsonData);
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