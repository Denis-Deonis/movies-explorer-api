const {PORT = 3000} = process.env;
const {DB_PATH = 'mongodb://127.0.0.1:27017/bitfilmsdb'} = process.env;
const {BASE_URL = 'http://localhost'} = process.env;

module.exports.PORT = PORT;
module.exports.DB_PATH = DB_PATH;
module.exports.BASE_URL = BASE_URL;