const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

class AuthController {
    async authenticate (request, response) {
        try {
            const { username, password } = request.body;

            const user = await User.findOne({ username });

            if (!user) {
                return response.status(401).json('Invalid username');
            }

            if (!await bcrypt.compare(password, user.password)) {
                return response.status(401).json('Invalid password');
            }

            const token = jwt.sign({ id: user._id }, config.getJwtSecret(), {
                expiresIn: config.getJwtExpires()
            });

            response.cookie('jwt', token, { httpOnly: true });
            return response.json({ token });
        } catch (error) {
            return response.json(error.message);
        }
    }

    async create (request, response) {
        try {
            const body = request.body;
            let user = await User.findOne({ username: body.username });

            if (user) {
                response.status(409).send('Username already exists');
            } else {
                body.password = bcrypt.hashSync(body.password, 10);
                user = new User(body);
                await user.save();

                response.status(200).send('OK');
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async logout (request, response) {
        response.cookie('jwt', '', { expires: new Date(0) });
        response.status(200).send('OK');
    }
}

module.exports = AuthController;
