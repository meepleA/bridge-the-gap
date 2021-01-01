
const fs = require("fs");
let express = require("express");
let csv = require("fast-csv");
// const os = require("os");
// console.log("first line" + os.EOL + "I will be printed in a new line");

// const host = 'user.informatik.uni-bremen.de/severing/cgi-bin';
// const host = 'localhost';
const port = 8080;
let server = express();
let allWordPairs = [];
let receivedFilename = [];
let usedIDs = [];

readFiles(__dirname + "/data/", function (filename, fileContent) {
    fileContent.annotation.forEach(element => {
        if (!usedIDs.includes(element[2])) {
            usedIDs.push(element[2]);
        }
    });
});


server.use(express.static(__dirname + "/.."));
server.use(express.json());

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
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

    let ws = fs.createWriteStream(__dirname + "/evaluationData.csv");
    console.log(req.body)

    let csvData = [["Wortpaar", "zugeteilte Distanz", "Verglichen mit gegebener Distanz", "Spieler ID", "Spielmodus", "Art des Levels", "Version der gegebenen Distanz"]];

    for (elem of req.body) {
        receivedFilename[0] = elem.wordpair[0] + "-" + elem.wordpair[1] + ".json";
        receivedFilename[1] = elem.wordpair[1] + "-" + elem.wordpair[0] + ".json";
        let annotationData = [elem.annotation];
        let serverFilename;
        let isNewEntry = true;
        
        // if(fs.existsSync(path)){}
        
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

            fileContent.annotation.forEach(elem => {
                let csvEntry = elem;
                csvEntry.unshift(filename.split(".")[0]);
                csvData.push(csvEntry);
            });
        });

        if (isNewEntry) {
            let csvNewEntry = elem.annotation;
            let wordpairToAdd;
            let jsonData = JSON.stringify({ wordpair: elem.wordpair, annotation: annotationData }, null, 2);

            if (serverFilename != null) {
                fs.writeFileSync(__dirname + "/data/" + serverFilename, jsonData);
                wordpairToAdd = serverFilename.split(".")[0];
            } else {
                fs.writeFileSync(__dirname + "/data/" + receivedFilename[0], jsonData);
                wordpairToAdd = receivedFilename[0].split(".")[0];
            }

                csvNewEntry.unshift(wordpairToAdd);
                csvData.push(csvNewEntry);      
        }
    }
    csv.write(csvData, { headers: true }).pipe(ws);

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