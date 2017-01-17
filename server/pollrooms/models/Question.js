var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Choice = require('./Choice'),
    Pollroom = require('./Pollroom');

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
            created_at: ret.created_at,
            answers: ret.answers,
            nb_positives_votes: 0,
            nb_negatives_votes: 0,
            nb_participants: 0
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

module.exports = mongoose.model('Question', QuestionSchema);
