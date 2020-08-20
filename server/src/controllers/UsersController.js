const User = require('../models/User');

class UsersController {
    async index (request, response) {
        try {
            const user = await User.findById(request.userid);

            if (user && user.profile !== 'admin') {
                return response.status(403).json({ message: 'Not allowed' });
            }

            const users = await User.find({}, { password: 0 });

            response.status(200).send(users);
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async show (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry }, { password: 0 });

            if (user) {
                response.status(200).send(user);
            } else {
                response.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async update (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry });

            if (user) {
                const body = request.body;

                await User.findOneAndUpdate({ registry }, { $set: body });

                response.status(200).json({ message: 'OK' });
            } else {
                response.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async destroy (request, response) {
        try {
            const { registry } = request.params;
            const user = await User.findOne({ registry });

            if (user) {
                if (user.profile === 'admin') {
                    await User.findOneAndDelete({ registry });
                    response.status(200).json({ message: 'OK' });
                } else {
                    response.status(403).json({ message: 'Not allowed' });
                }
            } else {
                response.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = UsersController;
