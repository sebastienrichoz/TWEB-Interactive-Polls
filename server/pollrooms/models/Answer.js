var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = Schema({
    label: { type: String, required: true }
});

AnswerSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            label: ret.label,
            nb_responses: 0
        };
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);
