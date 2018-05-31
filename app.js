const express = require('express');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('app');

const app = express();
const port = process.env.port || 3000;

app.use(morgan(tiny));
app.use(express.static(path.join(__dirname, public)));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'ja')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));

});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});