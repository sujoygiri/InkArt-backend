const crypto = require('node:crypto')
const mongoose = require('mongoose')
const dns = require("node:dns");
const urlPreview = require('link-preview-js');


const postModel = require('../../models/post.model');
const postContentModel = require('../../models/postContent.model');
const parseHtml = require('../../util/parseHtml');

const HOST = 'localhost';
const PORT = 8080;

const postControllerObj = {};

postControllerObj.uploadImage = (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        let imageUrl = req.file.path.split("\\")[2];
        let responseData = {
            "success": 1,
            "file": {
                "url": `http://${HOST}:${PORT}/images/${imageUrl}`,
            }
        };
        res.json(responseData);
        next();
    } else {
        let imageUrl = req.body.url;
        if (imageUrl) {
            let responseData = {
                "success": 1,
                "file": {
                    "url": imageUrl,
                }
            };
            res.json(responseData);
        } else {
            let responseData = {
                "success": 0,
                "file": {
                    "url": null,
                }
            };
            res.json(responseData);
        }
        next();
    }
};

postControllerObj.linkPreview = async (req, res, next) => {
    let invalidUrlResponse = {
        "success": 0,
        "meta": {
            "title": null,
            "description": null,
            "image": {
                "url": null
            }
        }
    };
    let url = req.query.url;
    if (url !== '') {
        try {
            let linkPreviewData = await urlPreview.getLinkPreview(url, {
                resolveDNSHost: async (url) => {
                    return new Promise((resolve, reject) => {
                        const hostname = new URL(url).hostname;
                        dns.lookup(hostname, (err, address, family) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(address); // if address resolves to localhost or '127.0.0.1' library will throw an error
                        });
                    });
                }
            });
            let responseData = {
                "success": 1,
                "meta": {
                    "title": linkPreviewData.title || linkPreviewData.sitename || linkPreviewData.url,
                    "description": linkPreviewData.description || 'Description not available for this link',
                    "image": {
                        "url": linkPreviewData.images[0] || `http://${HOST}:${PORT}/static/images/image-not-found.svg`
                    }
                }
            };
            res.json(responseData);
        } catch (error) {
            res.json(invalidUrlResponse);
        }
        next();
    } else {
        res.json(invalidUrlResponse);
        next();
    }
};


postControllerObj.fetchPost = async (req, res, next) => {
    let posts = await postModel.find({},{_id:0}).sort({createdAt: -1}).limit(10);
    let responseData = {
        "success": 1,
        "posts": posts
    };
    res.json(responseData);
    next();
};

postControllerObj.postContent = async (req, res, next) => {

    if(req.params.postId && req.params.postId !== ''){
        let postId = req.params.postId;
        let postContent = await postContentModel.findOne({_id: postId},{_id:0,__v:0});
        let responseData = {
            "success": 1,
            "post": postContent
        };
        res.json(responseData);
    }else{
        let responseData = {
            "success": 0,
            "post": null
        };
        res.json(responseData);
    }
    next();
};

postControllerObj.savePost = async (req, res, next) => {
    if(req.body.postData && req.body.postData !== ''){
        let rawData = JSON.parse(req.body.postData);
        let parsedData = parseHtml(rawData);
        let randomString = crypto.randomBytes(12).toString("hex");
        let postId = new mongoose.Types.ObjectId(randomString);
        let postTitle = parsedData.title;
        let titleSlug =  postTitle.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().trim().replace(/\s+/g, "-");
        let postLink = titleSlug + '-' + postId;
        let postObj = {
            // userId: req.session.userId,
            _id: postId,
            title: parsedData.title,
            description: parsedData.description,
            image: parsedData.thumbnail,
            link: postLink
        }
        let postContentObj = {
            _id: postId,
            title: parsedData.title,
            content: parsedData.content
        }
        let postInfo = await postModel.create(postObj)
        let postContentInfo = await postContentModel.create(postContentObj)

        // console.log(postInfo);
        // console.log(postInfo + '\n' + postContentInfo);

        if(postInfo && postContentInfo){
            let responseData = {
                "success": 1,
                "message": "Post saved successfully"
            };
            res.json(responseData);
        }else{
            let responseData = {
                "success": 0,
                "message": "Post not saved"
            };
            res.json(responseData);
        }
        next();
    }
};

postControllerObj.getPost = async (req, res, next) => {};

postControllerObj.updatePost = async (req, res, next) => {};

postControllerObj.deletePost = async (req, res, next) => {};



module.exports = postControllerObj;