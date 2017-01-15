var mongoose = require('mongoose'),
    Question = require('./Question');

var PollroomSchema = mongoose.Schema({

    name: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open', required: true },

    questions: [Question.schema],

    nb_participants: { type: Number, default: 0, required: true },

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
            nb_participants: ret.nb_participants,
            creator: ret.creator,
            created_at: ret.created_at
        };
    }
});

module.exports = mongoose.model('Pollroom', PollroomSchema);
