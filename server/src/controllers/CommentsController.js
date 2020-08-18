const Comment = require('../models/Comment');
const APIFeatures = require('../utils/apiFeatures');

class CommentsController {

    async createComment (request, response) {
            try{
                const newComment = await Comment.create(request.body);
        
                response.status(201).json({
        
                    status: "Success",
                    data:{
                        comment:newComment
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
    async updateComment (request, response) {
        try{
            const comment = await Comment.findByIdAndUpdate(request.params.id,request.body,{
                new: true,
                runValidators: true
            });
            response.status(200).json({
                status : "Success",
                data: {
                    comment : comment
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
    async showAllComments(request, response){
        try{
            // EXECUTE QUERY
            const features = new APIFeatures(Comment.find(),request.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
            const comments = await features.query;
            // SEND RESPONSE
            response.status(200).json({
                status: "Success",
                requestedAt : request.requestTime,
                results: comments.length,
                data: {
                    tours : comments
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

    async deleteComment (request, response) {

        try{
            await Comment.findByIdAndDelete(request.params.id);
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

module.exports = CommentsController;
