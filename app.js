const express = require('express');
const chalk = require('chalk');
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');

const app = express();
const port = process.env.port || 3000;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/css', express.static(path.join(__dirname, 'public', 'js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));

});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});