const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be atleast 3 characters long'],
        maxlength: [50, 'Name must not exceed 50 characters']
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
