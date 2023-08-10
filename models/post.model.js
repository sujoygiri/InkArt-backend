const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: [true, 'User is required']
    // },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Id is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be atleast 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [3, 'Description must be atleast 3 characters long']
    },
    image: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    },
    // likes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;