const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

class PostsController {
    async createPost (request, response) {
        try {
            const newPost = await new Post({ ...request.body, userId: request.userid }).save();

            await Category.findOneAndUpdate({ title: request.body.category }, {
                $push: {
                    topics: newPost._id
                }
            });
            await User.findByIdAndUpdate(request.userid, {
                $inc: {
                    posts: 1
                }
            });

            response.status(200).json({ message: 'OK' });
        } catch (err) {
            response.status(500).json({ message: err.message });
        }
    }

    async updatePost (request, response) {
        try {
            const post = await Post.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true
            });

            response.status(200).json({
                status: 'Success',
                data: {
                    post: post
                }
            });
        } catch (err) {
            response.status(500).json({
                status: 'Fail',
                message: err
            });
        }
    }

    async showAllPosts (request, response) {
        try {
            const posts = await Post.find({});
            const body = [];

            for (let i = 0; i < posts.length; i++) {
                const user = await User.findById(posts[i].userId);

                body.push({
                    _id: posts[i]._id,
                    category: posts[i].category,
                    title: posts[i].title,
                    body: posts[i].body,
                    userId: posts[i].userId,
                    profile: user.profile,
                    userImage: user.image,
                    userImageType: user.imagetype,
                    createdAt: posts[i].createdAt,
                    author: user.name,
                    visits: posts[i].visits,
                    comments: posts[i].comments
                });
            }

            response.status(200).json(body);
        } catch (err) {
            response.status(500).json({
                message: err.message
            });
        }
    }

    async deletePost (request, response) {
        try {
            await Post.findByIdAndDelete(request.params.id);
            await User.findByIdAndUpdate(request.body.id, { $inc: { posts: -1 } });
            const deletedCount = (await Comment.deleteMany({ postId: request.params.id })).deletedCount;

            const categories = await Category.find({});
            let postId = null;
            let categoryName;
            for (let i = 0; i < categories.length; i++) {
                postId = categories[i].topics.find(topicId => topicId && topicId.toString() === request.params.id);

                if (postId) {
                    categoryName = categories[i].title;
                    break;
                };
            }
            const category = await Category.findOne({ title: categoryName });
            category.comments -= deletedCount;
            category.topics = category.topics.filter(topicId => topicId.toString() !== postId.toString());
            await category.save();

            response.status(200).json({ message: 'OK' });
        } catch (err) {
            response.status(500).json({ message: err.message });
        }
    }

    async getPost (request, response) {
        try {
            const post = await Post.findByIdAndUpdate(request.params.id, { $inc: { visits: 1 } });

            if (!post) {
                return response.status(404).json({ message: 'Post not found' });
            }

            const user = await User.findById(post.userId);
            const comments = await Comment.find({ postId: request.params.id });

            const data = {
                post: {
                    title: post.title,
                    body: post.body,
                    createdAt: post.createdAt,
                    category: post.category,
                    user: {
                        name: user.name,
                        posts: user.posts,
                        createdAt: user.created_at,
                        userImage: user.image,
                        userImageType: user.imagetype,
                        profile: user.profile,
                        id: user._id
                    }
                },
                comments: []
            };

            for (let i = 0; i < comments.length; i++) {
                const userInfo = await User.findById(comments[i].userId);

                data.comments.push({
                    body: comments[i].commentBody,
                    createdAt: comments[i].created_at,
                    id: comments[i]._id,
                    user: {
                        name: userInfo.name,
                        posts: userInfo.posts,
                        createdAt: userInfo.created_at,
                        userImage: userInfo.image,
                        userImageType: userInfo.imagetype,
                        profile: userInfo.profile,
                        id: userInfo._id
                    }
                });
            }

            response.status(200).json(data);
        } catch (err) {
            if (err.kind === 'ObjectId') {
                return response.status(400).json({ message: 'Invalid ID' });
            }
            response.status(500).json({ message: err.message });
        }
    }
}

module.exports = PostsController;
