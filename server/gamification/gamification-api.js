var rp = require('request-promise'),
    Promise = require('bluebird'),
    eventtypesMap = require('./eventtypes');

const GAMIFICATION_TOKEN = process.env.GAMIFICATION_TOKEN;
const GAMIFICATION_BASE_PATH = process.env.GAMIFICATION_URI;

function getUser(user_id) {
    // convert user id which is an UUID into a unique integer
    user_id = hashCode(user_id);

    var options = {
        uri: GAMIFICATION_BASE_PATH + '/' + user_id,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': GAMIFICATION_TOKEN
        }
    };

    return rp(options)
        .then(function(user){
            return new Promise.is(user);
        })
        .catch(function(err){
            return new Promise.rejected(err);
        });
}

function getLeaderboard() {
    var options = {
        uri: GAMIFICATION_BASE_PATH + '/lederboards/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': GAMIFICATION_TOKEN
        }
    };

    return rp(options)
        .then(function(leaderboard){
            return new Promise.is(leaderboard);
        })
        .catch(function(err){
            return new Promise.rejected(err);
        });
}

function postEvent(event) {
    var user_id = hashCode(event.user);

    var options = {
        method: 'POST',
        uri: GAMIFICATION_BASE_PATH + '/events/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': GAMIFICATION_TOKEN
        },
        json: {
            user_id: user_id,
            eventtype_id: event.id
        },
        resolveWithFullResponse: true
    };

    return rp(options)
        .then(function(response){
            return new Promise.is(response.statusCode.toString());
        })
        .catch(function(err){
            return new Promise.rejected(err);
        });
}

function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 100000000);
}

module.exports = {
    getUser: function(user_id) {
        return getUser(user_id);
    },

    getLeaderboard: function() {
        return getLeaderboard();
    },

    postEvent: function(event) {
        return postEvent(event);
    }
};