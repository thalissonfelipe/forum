const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

class CommentsController {
    async createComment (request, response) {
        try {
            await Comment.create({
                commentBody: request.body.commentBody,
                postId: request.body.postId,
                userId: request.userid
            });
            await Post.findByIdAndUpdate(request.body.postId, {
                $inc: {
                    comments: 1
                }
            });
            await Category.findOneAndUpdate({ title: request.body.category }, {
                $inc: {
                    comments: 1
                }
            });

            response.status(200).json({ message: 'OK' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async updateComment (request, response) {
        try {
            await Comment.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true
            });
            response.status(200).json({ message: 'OK' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async showAllComments (request, response) {
        try {
            const comments = await Comment.find({});

            response.status(200).json(comments);
        } catch (err) {
            response.status(500).json({ message: err.message });
        }
    }

    async deleteComment (request, response) {
        try {
            const comment = await Comment.findByIdAndDelete(request.params.id);
            await Post.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });
            response.status(200).json({ message: 'OK' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = CommentsController;
