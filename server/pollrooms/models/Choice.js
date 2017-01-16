var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChoiceSchema = Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
