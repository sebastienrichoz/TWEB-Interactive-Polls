var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Promise = require('bluebird'),
    Pollroom = require('./Pollroom'),
    Choice = require('./Choice'),
    Vote = require('./Vote');

var QuestionSchema = Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'open', 'closed'], default: 'open', required: true },
    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },

    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    pollroom: { type: Schema.Types.ObjectId, ref: 'Question' },

    nb_positives_votes: { type: Number, default: 0 },
    nb_negatives_votes: { type: Number, default: 0 },
    nb_participants: { type: Number, default: 0 }
});

QuestionSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            title: ret.title,
            status: ret.status,
            creator: ret.creator,
            created_at: ret.created_at,
            answers: ret.answers,
            nb_positives_votes: ret.nb_positives_votes,
            nb_negatives_votes: ret.nb_negatives_votes,
            nb_participants: ret.nb_participants
        };
    }
});

QuestionSchema.statics.updateParticipantsCount = function(question_id) {
    return Choice
        .distinct('user')
        .count({ 'question': question_id })
        .exec()
        .then(function(count) {
            return mongoose.model('Question')
                .findByIdAndUpdate(question_id, { 'nb_participants': count })
                .exec();
        })
        .then(function(question) {
            if (question == null) {
                return Promise.resolve();
            }
            return Pollroom.updateParticipantsCount(question.pollroom);
        });
};

QuestionSchema.statics._updateVotesCount = function(question_id, up) {
    return Vote
        .distinct('user')
        .count({ 'question': question_id, 'up': up })
        .exec()
        .then(function(count) {
            var data = {};
            data[up ? 'nb_positives_votes' : 'nb_negatives_votes'] = count;

            return mongoose.model('Question')
                .findByIdAndUpdate(question_id, data)
                .exec();
        });
};

QuestionSchema.statics.updateVotesCount = function(question_id) {
    var model = mongoose.model('Question');
    return Promise
        .all([
            model._updateVotesCount(question_id, true),
            model._updateVotesCount(question_id, false)
        ]);
}

module.exports = mongoose.model('Question', QuestionSchema);
