var mongoose = require('mongoose');

var RoomSchema = mongoose.Schema({

    name: { type: String, required: true },
    opened: { type: Boolean, default: false },

    questions: [{

        label: { type: String, required: true },
        opened: { type: Boolean, default: false },

        answers: [{

            label: { type: String, required: true },
            correct: { type: Boolean, default: true }

        }]

    }],

    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    creator: [{ type: Schema.Types.ObjectId, ref: 'User' }], // TODO : nécessaire ?
    auditors: [{ type: Schema.Types.ObjectId, ref: 'User' }] // TODO : nécessaire ?
});

module.exports = mongoose.model('Room', RoomSchema);
