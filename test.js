var haze = require('node-sghaze');
var fs = require('fs');

function fetchNewHazeData() {
    haze.retrieveDataLegacy(function(error, data) {
        if (!error) {
            fs.writeFile("./data/haze.json", JSON.stringify(data), function(err) {
                if(err) {
                    return console.log(err);
                } else {
                    console.log("[fetchNewHazeData] The file was saved!");
                }
            });
        } else {
            console.log('[fetchNewHazeData]: ' + error);
        }
    });
}

fetchNewHazeData();
