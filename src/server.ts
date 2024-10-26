import express from 'express';
import path from 'path'
import http from 'http';
import { auth, requiresAuth } from 'express-openid-connect';
import dotenv from 'dotenv'
import indexRoutes from './routes/indexRoutes';
import ticketsRoutes from './routes/ticketsRoutes';
import generateRoutes from './routes/generateRoutes';

dotenv.config()

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3050;
const config = {
  authRequired : false,
  idpLogout : true,
  secret: process.env.SECRET,
  baseURL: `http://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code' ,
   },
};

if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', indexRoutes);
app.use('/generate', generateRoutes);
app.use('/tickets', ticketsRoutes);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  res.status(404).render('error', {errorCode: 404, errorMessage: err.message})
});

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
