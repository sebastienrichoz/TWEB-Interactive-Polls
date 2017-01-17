var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChoiceSchema = Schema({
    pollroom: { type: Schema.Types.ObjectId, ref: 'Pollroom' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
