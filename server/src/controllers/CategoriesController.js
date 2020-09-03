const Category = require('../models/Category');
const Post = require('../models/Post');
const User = require('../models/User');

class CategoriesController {
    async index (request, response) {
        try {
            const categories = await Category.find({});
            const body = [];

            for (let i = 0; i < categories.length; i++) {
                const lastPostId = categories[i].topics.pop();
                let lastPost = null;
                if (lastPostId) {
                    const { title, userId, createdAt, _id } = await Post.findById(lastPostId);
                    const user = await User.findById(userId);
                    lastPost = {
                        title,
                        author: user.name ? user.name : 'Admin',
                        createdAt,
                        id: _id
                    };
                }

                body.push({
                    title: categories[i].title,
                    description: categories[i].description,
                    topics: [...categories[i].topics, lastPostId],
                    comments: categories[i].comments,
                    lastPost
                });
            }

            response.status(200).send(body);
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async show (request, response) {
        try {
            const category = await Category.findOne({ title: request.params.title });

            if (category) {
                const body = {
                    title: category.title,
                    description: category.description,
                    posts: []
                };

                for (let i = 0; i < category.topics.length; i++) {
                    const { title, _id, userId, visits, comments } = await Post.findById(category.topics[i]);
                    const { name } = await User.findById(userId);
                    body.posts.push({
                        title,
                        id: _id,
                        author: name,
                        visits,
                        comments
                    });
                }

                response.status(200).send(body);
            } else {
                response.status(404).json({ message: 'Category not found' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async create (request, response) {
        try {
            const body = request.body;
            let category = await Category.findOne({ title: body.title });

            if (category) {
                response.status(409).json({ message: 'Category already exists' });
            } else {
                category = new Category(body);
                await category.save();

                response.status(200).json({ message: 'OK' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    // async update (request, response) {
    //     try {
    //         const { registry } = request.params;
    //         const user = await User.findOne({ registry });

    //         if (user) {
    //             const body = request.body;

    //             await User.findOneAndUpdate({ registry }, { $set: body });

    //             response.status(200).json({ message: 'OK' });
    //         } else {
    //             response.status(404).json({ message: 'User not found' });
    //         }
    //     } catch (error) {
    //         response.status(500).json({ message: error.message });
    //     }
    // }

    // async destroy (request, response) {
    //     try {
    //         const { registry } = request.params;
    //         const user = await User.findOne({ registry });

    //         if (user) {
    //             if (user.profile === 'admin') {
    //                 await User.findOneAndDelete({ registry });
    //                 response.status(200).json({ message: 'OK' });
    //             } else {
    //                 response.status(403).json({ message: 'Not allowed' });
    //             }
    //         } else {
    //             response.status(404).json({ message: 'User not found' });
    //         }
    //     } catch (error) {
    //         response.status(500).json({ message: error.message });
    //     }
    // }
}

module.exports = CategoriesController;
