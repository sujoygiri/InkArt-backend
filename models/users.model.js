const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true,'Username already taken.'],
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be atleast 3 characters long'],
        maxlength: [50, 'Username must not exceed 50 characters'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9]+[\-]{0,1}[a-zA-Z0-9]+$/.test(v);
            },
            message: props => `${props.value} may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen!`
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [3, 'Email must be atleast 3 characters long'],
        maxlength: [50, 'Email must not exceed 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePic: {
        type: String,
        default: 'user.png'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
