var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Choice = require('./Choice');

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

AnswerSchema.statics.updateResponsesCount = function(question, answer) {
    return Choice
        .count({
            'question': question,
            'answer': answer
        })
        .exec()
        .then(function(count) {
            return mongoose.model('Answer')
                .findByIdAndUpdate(answer, { 'nb_responses': count })
                .exec();
        })
};

module.exports = mongoose.model('Answer', AnswerSchema);
