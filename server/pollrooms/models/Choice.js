var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChoiceSchema = Schema({
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
