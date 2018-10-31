import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import jwt from 'jsonwebtoken';

import subscriptionsData from './subscriptionsData.json';
import users from './loginData.json';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// This should be moved to config
const jwtsecret = "This is very secret";

router.route('/login').post((req, res) => {
     let filteredUsers = users.filter(user => {
       if (user.loginEmail === req.body.loginEmail && user.password === req.body.password) {
         return user;
       }
     });
     if (filteredUsers.length) {
       let user = filteredUsers[0];
       const token = jwt.sign({content: user.id}, jwtsecret);
       let body = {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token: 'login-token'
       };
       return res.status(200).send(body);
     } else {
       return res.status(400).send({ error: { message: 'Username or password is incorrect' } });
     }
});

router.route('/subscriptions').get((req, res) => {
  console.log(req.headers);

    if(req.headers.hasOwnProperty('authorization') && req.headers.authorization === 'Bearer login-token') {
      return res.status(200).send(subscriptionsData);
    } else {
      return res.status(401).send({error: { message: 'Not authorised' } });
    }
  });
app.use('/', router);

app.listen(4000, () => console.log('Express server running on port 4000'));