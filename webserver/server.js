const http = require("http");
const fs = require("fs").promises;
let express = require("express");

const host = 'localhost';
const port = 8000;
let server = express();
let allWordPairs = [];
// TODO: aus files zusammenstellen
allWordPairs.push(["Kochtopf", "Tee", "0"]);
allWordPairs.push(["Geschirrtuch", "Tisch", "0"]);
allWordPairs.push(["Schere", "Papier", "0"]);
allWordPairs.push(["Tasse", "Topfdeckel", "3"]);
allWordPairs.push(["Kerze", "Feuerzeug", "0"]);
allWordPairs.push(["Lampe", "Kabel", "0"]);
allWordPairs.push(["Bleistift", "Papiertaschentuch", "2"]);
allWordPairs.push(["Plastikverpackung", "Klebeband", "1"]);
allWordPairs.push(["Schwamm", "Spülmittel", "0"]);
allWordPairs.push(["Korken", "Kugelschreiber", "5"]);
allWordPairs.push(["Holzbrett", "Bleistift", "3"]);
allWordPairs.push(["Spülmittel", "Gemüsemesser", "0"]);
allWordPairs.push(["Nadel", "Faden", "0"]);
allWordPairs.push(["Streichholz", "Schere", "5"]);
allWordPairs.push(["Kochlöffel", "Kochtopf", "0"]);
allWordPairs.push(["Glas", "Geschirrtuch", "0"]);
allWordPairs.push(["Papiertaschentuch", "Teller", "2"]);
allWordPairs.push(["Hemd", "Wäscheklammer", "1"]);
allWordPairs.push(["Weinflasche", "Korken", "0"]);
allWordPairs.push(["Hemd", "Bügeleisen", "0"]);
let jsonArray = {"array": allWordPairs};


server.use(express.static(__dirname + "/.."));
server.use(express.json());

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

server.post("/api", (req, res) => {
    const data = req.body;
    console.log(data);
    res.json(jsonArray);
});
