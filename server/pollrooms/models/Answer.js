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

AnswerSchema.statics.select = function(id, answerer, callback) {
    // this.model('Pollroom').update({
    //     'questions.answers._id': id,
    //     'questions.answers.$.responses.answerer': {$ne: answerer}
    // }, {
    //     $addToSet: {
    //         'questions.answers.$.responses': {
    //             'answerer': answerer
    //         }
    //     }
    // }, callback);
};

AnswerSchema.statics.deselect = function(id, answerer, callback) {
    // this.model('Pollroom').update({
    //     'questions.answers._id': id,
    //     'questions.answers.$.responses.answerer': answerer
    // }, {
    //     $pull: {
    //         'questions.answers.$.responses': {
    //             'answerer': answerer
    //         }
    //     }
    // }, callback);
};

module.exports = mongoose.model('Answer', AnswerSchema);
