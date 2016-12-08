var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var RoomSchema = mongoose.Schema({

    name: { type: String, required: true, index: { unique: true } },
    opened: { type: Boolean, default: false },

    questions: [{

        label: { type: String, required: true },
        opened: { type: Boolean, default: false },

        answers: [{

            label: { type: String, required: true },

            respondents: [{ type: ObjectId, ref: 'User' }]
        }]

    }],

    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    creator: { type: ObjectId, ref: 'User' },
    auditors: [{ type: ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('Room', RoomSchema);
