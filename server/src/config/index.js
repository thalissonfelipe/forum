const config = require('./config');

module.exports = {
    getAPIAddress: function () {
        return config.API && config.API.address ? config.API.address : '127.0.0.1';
    },
    getAPIPort: function () {
        return config.API && config.API.port ? config.API.port : 3000;
    }
};
