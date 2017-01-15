var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({

    label: { type: String, required: true },
    nb_responses: { type: Number, default: 0, required: true }

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
