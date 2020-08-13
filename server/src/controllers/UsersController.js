const User = require('../models/User');

class UsersController {
    async index (request, response) {
        try {
            const user = await User.findById(request.userid);

            if (user && user.profile !== 'admin') {
                return response.status(403).send('Not allowed');
            }

            const users = await User.find({}, { password: 0 });

            response.status(200).send(users);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async show (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry }, { password: 0 });

            if (user) {
                response.status(200).send(user);
            } else {
                response.status(404).send('User not found');
            }
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
                if (user.profile === 'admin') {
                    await User.findOneAndDelete({ registry });
                    response.status(200).send('OK');
                } else {
                    response.status(403).send('Not allowed');
                }
            } else {
                response.status(404).send('User not found');
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }
}

module.exports = UsersController;
