const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/auth');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');   
const { LinkRegExp } = require('./utils/constants');
const NotFoundError = require('./errors/not_found_err');

const cors = require('./middlewares/cors');
// const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors);
// app.use(cors());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LinkRegExp),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.get('/logout', function(req, res, next) {
  res.clearCookie('jwt').send({ message: 'Выход из профиля' });
});


// app.get('/signup', function(req, res, next) {

// //   router.get('/logout', function(req, res, next){
// //     cookie = req.cookies;
// //     for (var prop in cookie) {
// //         if (!cookie.hasOwnProperty(prop)) {
// //             continue;
// //         }    
// //         res.cookie(prop, '', {expires: new Date(0)});
// //     }
// //     res.redirect('/');
// // });

//     return res.clearCookie('token').send({ message: 'Выход' });

// });

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(3000, () => {
  console.log('Сервер запущен');
});
