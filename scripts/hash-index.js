const path = require('path');
const fs = require('fs');

const htmlPath = path.resolve(__dirname, '../app/dist/index.html');

fs.renameSync(
  path.resolve(__dirname, '../app/dist/index.html'),
  path.resolve(__dirname, `../app/dist/index.${Date.now()}.html`)
);
