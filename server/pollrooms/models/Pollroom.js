var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Choice = require('./Choice');

var PollroomSchema = Schema({
    name: { type: String, required: true },
    identifier: { type: Number, required: true},
    status: { type: String, enum: ['open', 'closed'], default: 'open', required: true },
    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },

    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],

    nb_participants: { type: Number, default: 0 }
});

PollroomSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            identifier: ret.identifier,
            status: ret.status,
            creator: ret.creator,
            created_at: ret.created_at,
            questions: ret.questions,
            nb_participants: ret.nb_participants
        };
    }
});


PollroomSchema.statics.updateParticipantsCount = function(pollroom_id) {
    return Choice
        .distinct('user')
        .count({ 'pollroom': pollroom_id })
        .exec()
        .then(function(count) {
            return mongoose.model('Pollroom')
                .findByIdAndUpdate(pollroom_id, { 'nb_participants': count })
                .exec();
        })
};

module.exports = mongoose.model('Pollroom', PollroomSchema);
