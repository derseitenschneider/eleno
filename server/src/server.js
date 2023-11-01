const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({
  path: `./config.env`,
});

const port = 3333;
app.listen(port, () => {
  console.log('Server running');
});
