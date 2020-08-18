const Post = require('../models/Post');
const APIFeatures = require('../utils/apiFeatures');

class PostsController {

    async createPost (request, response) {
        try{
            const newPost = await Post.create(request.body);
    
            response.status(201).json({
    
                status: "Success",
                data:{
                    post:newPost
                }
            });
        }
        catch(err){
            response.status(400).json({
                status: "Fail",
                message: err
            });
        }
    }
    async updatePost (request, response) {
        try{
            const post = await Post.findByIdAndUpdate(request.params.id,request.body,{
                new: true,
                runValidators: true
            });
            response.status(200).json({
                status : "Success",
                data: {
                    post : post
                }
            });
        }
        catch (err){
            response.status(404).json({
                status: "Fail",
                message: err
            });
        }
        
    }
    async showAllPosts(request, response){
        try{
            // EXECUTE QUERY
            const features = new APIFeatures(Post.find(),request.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
            const posts = await features.query;
            // SEND RESPONSE
            response.status(200).json({
                status: "Success",
                requestedAt : request.requestTime,
                results: posts.length,
                data: {
                    tours : posts
                }
            });
        }
        catch (err){
            response.status(404).json({
                status: "Fail",
                message: err
            });
        }

    }
    async deletePost (request, response) {

        try{
            await Post.findByIdAndDelete(request.params.id);
            response.status(200).json({
                status : "Success",
                data: null
            });
        }
        catch (err){
            response.status(404).json({
                status: "Fail",
                message: err
            });
        }
    }
}

module.exports = PostsController;
