const User = require('../models/User');

class UsersController {
    async index (request, response) {
        try {
            const users = await User.find({});

            response.status(200).send(users);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async show (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry });

            if (user) {
                response.status(200).send(user);
            } else {
                response.status(404).send('User not found');
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async create (request, response) {
        try {
            const body = request.body;
            const user = new User(body);

            await user.save();

            response.status(200).send('OK');
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async update (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry });

            if (user) {
                const body = request.body;

                await User.findOneAndUpdate({ registry }, { $set: body });

                response.status(200).send('OK');
            } else {
                response.status(404).send('User not found');
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async destroy (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry });

            if (user) {
                await User.findOneAndDelete({ registry });

                response.status(200).send('OK');
            } else {
                response.status(404).send('User not found');
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }
}

module.exports = UsersController;
