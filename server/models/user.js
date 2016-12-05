var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = mongoose.Schema({

    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },

    created_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    created_rooms: [{ type: ObjectId, ref: 'Room' }],
    joined_rooms: [{ type: ObjectId, ref: 'Room' }]

});

UserSchema.pre('save', function(next) {
    var user = this;
    var saltRounds = 10; // TODO : fichier de config

    if (user.isModified('password')) {
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    }
});

module.exports = mongoose.model('User', UserSchema);
