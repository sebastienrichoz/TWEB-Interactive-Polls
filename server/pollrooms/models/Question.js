var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'open', 'closed'], default: 'open', required: true },
    creator: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },

    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],

    nb_positives_votes: { type: Number, default: 0 },
    nb_negatives_votes: { type: Number, default: 0 },
    nb_participants: { type: Number, default: 0 }
});

QuestionSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            title: ret.title,
            status: ret.status,
            created_at: ret.created_at,
            answers: ret.answers,
            nb_positives_votes: 0,
            nb_negatives_votes: 0,
            nb_participants: 0
        };
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
