const crypto = require('crypto');
// const nodemailer = require('nodemailer');
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
                return response.status(401).json({ message: 'Invalid username' });
            }

            if (!await bcrypt.compare(password, user.password)) {
                return response.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user._id }, config.getJwtSecret(), {
                expiresIn: config.getJwtExpires()
            });

            response.cookie('jwt', token, { httpOnly: true });
            return response.status(200).json({ token, profile: user.profile, registry: user.registry });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async logout (request, response) {
        response.cookie('jwt', '', { expires: new Date(0) });
        response.status(200).send('OK');
    }

    async forgot (request, response) {
        try {
            const user = await User.findOne({ email: request.body.email });

            if (!user) {
                return response.status(404).send({ message: 'User not found' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 day

            await user.save();

            // TODO: Enviar email para o usuário com o link para trocar de senha
            // const transporter = nodemailer.createTransport({
            //     host: 'smtp.ethereal.email',
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: config.getEmail(),
            //         pass: config.getPassword()
            //     }
            // });
            // const mailOptions = {
            //     from: 'passwordreset@uniquorum.com',
            //     to: user.email,
            //     subject: 'Resetar Senha',
            //     text: 'Você está recebendo esse email porque você (ou outra pessoa) solicitou resetar a senha da sua conta.\n\n' +
            //         'Por favor, clique no link a seguir para realizar o processo:\n\n' +
            //         'http://' + request.headers.host + '/reset/' + token + '\n\n' +
            //         'Se você solicitou isso, ignore esse email.\n',
            //     html: '<p><b>Hello</b> to myself!</p>'
            // };

            // transporter.sendMail(mailOptions);

            response.status(200).send({ resetPasswordLink: 'http://' + request.headers.host + '/reset/' + token });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    async resetScreen (request, response) {
        const user = await User.findOne({
            resetPasswordToken: request.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return response.redirect('/web/public/login.html');
        }

        return response.redirect('/web/public/reset_password.html?token=' + request.params.token);
    }

    async resetPassword (request, response) {
        try {
            let user;
            if (request.params.token) {
                user = await User.findOne({
                    resetPasswordToken: request.params.token,
                    resetPasswordExpires: { $gt: Date.now() }
                });

                if (!user) {
                    return response.status(401).send({ message: 'Token expired' });
                }
            } else if (request.userid) {
                user = await User.findById(request.userid);
            }

            user.password = bcrypt.hashSync(request.body.password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            response.status(200).send({ message: 'Password updated' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = AuthController;
