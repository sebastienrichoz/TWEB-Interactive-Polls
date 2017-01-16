var mongoose = require('mongoose'),
    Question = require('./Question');

var PollroomSchema = mongoose.Schema({

    name: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open', required: true },

    questions: [Question.schema],

    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true }
});

PollroomSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            status: ret.status,
            questions: ret.questions,
            nb_participants: 0,
            creator: ret.creator,
            created_at: ret.created_at
        };
    }
});

module.exports = mongoose.model('Pollroom', PollroomSchema);
