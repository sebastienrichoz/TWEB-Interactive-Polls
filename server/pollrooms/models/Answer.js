var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Answer', AnswerSchema);
