var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Promise = require('bluebird'),
    Choice = require('./Choice'),
    Question = require('./Question');

var AnswerSchema = Schema({
    label: { type: String, required: true },

    question: { type: Schema.Types.ObjectId, ref: 'Question' },

    nb_responses: { type: Number, default: 0 }
});

AnswerSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            label: ret.label,
            nb_responses: ret.nb_responses
        };
    }
});

AnswerSchema.statics.updateResponsesCount = function(answer_id) {
    return Choice
        .count({ 'answer': answer_id })
        .exec()
        .then(function(count) {
            return mongoose.model('Answer')
                .findByIdAndUpdate(answer_id, { 'nb_responses': count })
                .exec();
        })
        .then(function(answer) {
            if (answer == null) {
                return Promise.resolve();
            }
            return Question.updateParticipantsCount(answer.question);
        });
};

module.exports = mongoose.model('Answer', AnswerSchema);
