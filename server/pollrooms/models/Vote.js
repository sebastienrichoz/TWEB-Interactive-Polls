var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoteSchema = Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    up: { type: Boolean, required: true },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Vote', VoteSchema);
