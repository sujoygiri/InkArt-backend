const postRouter = require('express').Router();
const crypto = require('node:crypto');
const multer = require('multer');

const { uploadImage, linkPreview, savePost, fetchPost, postContent } = require('../controller/post/post.controller');

const supportedImageType = ['apng', 'avif', 'gif', 'jpeg', 'png', 'svg+xml', 'webp', 'jpg'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        let randomString = crypto.randomBytes(6).toString('hex');
        let uniqueSuffix = randomString + '-' + Math.round(Math.random() * 1E9);
        let array = file.originalname.split('.');
        let fileExtension = array[array.length - 1];
        // req.imageUrl = uniqueSuffix + '.' + fileExtension;
        cb(null, uniqueSuffix + '.' + fileExtension);
    }
});

function fileFilter(req, file, cb) {
    let fileType = file.mimetype.split('/')[1];
    if (supportedImageType.includes(fileType)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

postRouter.get('/fetch-post', fetchPost);
postRouter.get('/post-content/:postId', postContent);
postRouter.post('/save-post', savePost);
postRouter.post('/upload-image', multer({ storage: storage, fileFilter: fileFilter }).single('image'), uploadImage);
postRouter.get('/link-preview', linkPreview);

module.exports = postRouter;

// =======================================================================================
// if(req.imageUrl){
//     let imageUrl = req.imageUrl
//     let responseData = {
//         "link" : `http://${HOST}:${PORT}/images/${imageUrl}`
//     }
//     res.json(responseData);
//     next()
// }else{
//     let imageUrl = req.body.url
//     if(imageUrl){
//         let responseData = {
//             "link" : imageUrl
//         }
//         res.json(responseData);
//     }else{
//         let responseData = {
//             "error": {
//                 "message": "The image upload failed"
//             }
//         }
//         res.json(responseData)
//     }
//     next()
// }
// =======================================================================================