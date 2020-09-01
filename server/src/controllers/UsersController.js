const fs = require('fs');
const bcrypt = require('bcrypt');
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

    async create (request, response) {
        try {
            const body = request.body;
            let user = await User.findOne({ username: body.username });

            if (user) {
                response.status(409).json({ message: 'Username already exists' });
            } else {
                if (request.file) {
                    const img = fs.readFileSync(request.file.path).toString('base64');
                    body.image = Buffer.from(img, 'base64');
                    body.imagetype = request.file.mimetype;
                }
                body.password = bcrypt.hashSync(body.password, 10);
                user = new User(body);
                await user.save();

                response.status(200).json({ message: 'OK' });
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
