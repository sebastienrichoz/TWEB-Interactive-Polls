var rp = require('request-promise');

const GAMIFICATION_TOKEN = process.env.GAMIFICATION_TOKEN;
const GAMIFICATION_BASE_PATH = process.env.GAMIFICATION_URI;

var eventtypesMap = new Map();

function initEventtypes() {

    // Get eventtypes id
    var options = {
        method: 'GET',
        uri: GAMIFICATION_BASE_PATH + '/eventtypes/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': GAMIFICATION_TOKEN
        }
    };

    rp(options)
        .then(function(eventtypes){
            return eventtypes;
        })
        .then(function(eventtypes){
            var types = JSON.parse(eventtypes);
            for (var eventtype of types) {
                eventtypesMap.set(eventtype.name, eventtype.id);
            }
        })
        .catch(function(err){
            console.log("Error while associating eventtypes");
            console.log(err);
        });
}

module.exports = {
    getEventtypeMap: function() {
        return eventtypesMap;
    },
    initEventtypes: function() {
        initEventtypes();
    }
};