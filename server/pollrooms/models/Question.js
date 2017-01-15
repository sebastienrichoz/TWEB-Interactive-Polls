var mongoose = require('mongoose'),
    Answer = require('./Answer'),
    Pollroom = require('./Pollroom');

var QuestionSchema = mongoose.Schema({

    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'open', 'closed'], default: 'pending', required: true },

    nb_positives_votes: { type: Number, default: 0, required: true },
    nb_negatives_votes: { type: Number, default: 0, required: true },
    nb_participants: { type: Number, default: 0, required: true },

    answers: [Answer.schema],

    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true }

});

QuestionSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            title: ret.email,
            status: ret.status,
            nb_positives_votes: ret.nb_positives_votes,
            nb_negatives_votes: ret.nb_negatives_votes,
            nb_participants: ret.nb_participants,
            answers: ret.answers,
            creator: ret.creator,
            created_at: ret.created_at
        };
    }
});

/**
 * Return a Json object of the question, not a model instance.
 */
QuestionSchema.statics.find = function(id, callback) {
    this.model('Pollroom').findOne({'questions._id': id}, {'questions.$': 1}, function(err, pollroom) {
        if (err || pollroom == null) {
            callback(err, null);
        }
        else {
            callback(null, pollroom.questions[0]); // findParentPollroom return only the question
        }
    });
};

QuestionSchema.statics.update = function(id, data, callback) {
    var update = {};
    for (var k in data) {
        update['questions.$.' + k] = data[k];
    }
    this.model('Pollroom').update({'questions._id': id}, { '$set': update }, callback);
};

module.exports = mongoose.model('Question', QuestionSchema);
