const mongoose = require('mongoose');

const postContentSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post is required']
    },
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be atleast 3 characters long']
    },
    content:{
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const postContentModel = mongoose.model('PostContent', postContentSchema);

module.exports = postContentModel;