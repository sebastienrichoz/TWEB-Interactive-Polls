var mongoose = require('mongoose');

var AnswerSchema = mongoose.Schema({

    label: { type: String, required: true },

    responses: [{
        answerer: {type: String, required: true}
    }]
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
