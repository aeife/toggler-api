var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.pre('save', function(callback) {
    var user = this;

    if (!user.isModified('password')) {
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);
