var rp = require('request-promise');

const GAMIFICATION_SERVER = process.env.GAMIFICATION_SERVER;
const GAMIFICATION_PORT = process.env.GAMIFICATION_PORT;
const GAMIFICATION_PATH = process.env.GAMIFICATION_PATH;
const GAMIFICATION_TOKEN = process.env.GAMIFICATION_TOKEN;
const GAMIFICATION_BASE_PATH = GAMIFICATION_SERVER + GAMIFICATION_PORT + GAMIFICATION_PATH;

var eventtypesMap = new Map();

function associateEventtypes() {

    // Get eventtypes id
    var options = {
        method: 'GET',
        uri: GAMIFICATION_BASE_PATH + '/eventtypes/',
        headers: {
            'Authorization': GAMIFICATION_TOKEN
        }
    };

    rp(options)
        .then(function(eventtypes){
            return eventtypes;
        })
        .then(function(eventtypes){
            for (var eventtype in eventtypes) {
                eventtypes.set(eventtype.name, eventtypes.id);
            }
        })
        .catch(function(err){
            console.log("Error while associating eventtypes");
            console.log(err);
        });
}

module.exports = eventtypesMap;