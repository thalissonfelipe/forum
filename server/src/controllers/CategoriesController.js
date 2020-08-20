const Category = require('../models/Category');

class CategoriesController {
    async index (request, response) {
        try {
            const categories = await Category.find({});

            response.status(200).send(categories);
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async show (request, response) {
        try {
            const { title } = request.params;
            const category = await Category.findOne({ title });

            if (category) {
                response.status(200).send(category);
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
