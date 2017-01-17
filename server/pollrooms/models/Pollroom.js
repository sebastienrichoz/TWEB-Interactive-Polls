var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Question = require('./Question');

var PollroomSchema = Schema({
    name: { type: String, required: true },
    identifier: { type: Number, required: true},
    status: { type: String, enum: ['open', 'closed'], default: 'open', required: true },
    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },

    questions: [Question.schema]
});

PollroomSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            identifier: ret.identifier,
            status: ret.status,
            questions: ret.questions,
            nb_participants: 0,
            creator: ret.creator,
            created_at: ret.created_at
        };
    }
});

module.exports = mongoose.model('Pollroom', PollroomSchema);
