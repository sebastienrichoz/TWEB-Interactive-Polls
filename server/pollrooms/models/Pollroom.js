var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollroomSchema = Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open', required: true },
    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },

    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

PollroomSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            status: ret.status,
            questions: ret.questions,
            nb_participants: 0,
            created_at: ret.created_at
        };
    }
});

module.exports = mongoose.model('Pollroom', PollroomSchema);
