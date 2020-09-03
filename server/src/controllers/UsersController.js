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
                return response.status(409).json({ message: 'Usuário já cadastrado.' });
            }

            user = await User.findOne({ email: body.email });
            if (user) {
                return response.status(409).json({ message: 'Email já cadastrado.' });
            }

            user = await User.findOne({ registry: body.registry });
            if (user) {
                return response.status(409).json({ message: 'Matrícula já cadastrada.' });
            }

            if (request.file) {
                const img = fs.readFileSync(request.file.path).toString('base64');
                body.image = Buffer.from(img, 'base64');
                body.imagetype = request.file.mimetype;
            }
            body.password = bcrypt.hashSync(body.password, 10);
            user = new User(body);
            await user.save();

            response.status(200).json({ message: 'OK' });
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

    async modify (request, response) {
        try {
            const admin = await User.findById(request.userid);

            if (admin.profile === 'admin') {
                const { id, status } = request.body;

                if (!['active', 'suspended', 'banned'].includes(status)) {
                    return response.status(400).json({ message: 'Invalid status' });
                }

                await User.findByIdAndUpdate(id, {
                    $set: {
                        status
                    }
                });
                response.status(200).json({ message: 'OK' });
            } else {
                response.status(403).json({ message: 'Not allowed' });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = UsersController;
