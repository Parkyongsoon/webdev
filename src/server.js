import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import methodOverride from 'koa-methodoverride';
import cors from '@koa/cors';
import logger from 'koa-logger';
import render from 'koa-ejs';
import "reflect-metadata";
import redis from 'redis';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

import { sequelize } from './models';

import api from './api/index';

const app = new Koa();

const { PORT } = process.env;

const client = redis.createClient(6379, 'localhost');

/**
 * db connection(postgresql & redis)
 */

sequelize.sync();

client.on('ready', function() {
  console.log("Redis is ready");
});

client.on('error', function() {
  console.log("Error in Redis");
});

/**
 * Views Engine
 */

render(app,{
  root: path.join(__dirname, 'views'),
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debut: true
});

/**
 * Middlewares
 */
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(serve(__dirname + '/public'));
app.use(cors());
app.use(methodOverride('_method'));
app.use(helmet.hidePoweredBy())
   .use(helmet.hsts({
     maxAge: 5184000,
     includeSubDomains: true
   }));

app.use( async (ctx, next) => {
  const token = ctx.cookies.get('token');  

  if(token === undefined) {
    await next();
  } else {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    ctx.state.isAuthenticate = payload;

    await next();
  }
});

app.use( async (ctx, next) => {
  ctx.state.moment = moment;
  await next();
})

/**
 * Routes
 */

app.use(api.routes())
   .use(api.allowedMethods());

app.listen(PORT, () => {
  console.log('server running success')
});

// import index from './api/home/index';
// import auth from './api/home/auth';
// import search from './api/home/search';
// import board from './api/user/board/index';
// import customerContent from './api/home/customerContent';
// import designerProfile from './api/home/designerProfile';
// import customerQna from './api/home/customerQna';
// import customerMypage from './api/home/customerMypage';
// import customerPayment from './api/home/customerPayment';

// import designerIndex from './api/home/designerIndex';
// import designerAuth from './api/home/designerAuth';
// import designerCustomerContent from './api/home/designerCustomerContent';

// import adminIndex from './api/admin/index';
// import adminAuth from './api/admin/auth';
// import adminMember from './api/admin/member';
// import adminProgress from './api/admin/progress';
// import adminPayment from './api/admin/payment';
// import adminQna from './api/admin/qna';
// import adminQnaComment from './api/admin/qnaComment';

// router.use('/', api.routes());
// router.use('/', index.routes());
// router.use('/api', auth.routes());
// router.use('/api', search.routes());
// router.use('/api', board.routes());
// router.use('/api', customerContent.routes());
// router.use('/api', designerProfile.routes());
// router.use('/api', customerQna.routes());
// router.use('/api', customerMypage.routes());
// router.use('/api', customerPayment.routes());

// router.use('/designer', designerIndex.routes());
// router.use('/designer/api', designerAuth.routes());
// router.use('/designer/api', designerCustomerContent.routes());

// router.use('/admin', adminIndex.routes());
// router.use('/admin/api', adminAuth.routes());
// router.use('/admin/api', adminMember.routes());
// router.use('/admin/api', adminProgress.routes());
// router.use('/admin/api', adminPayment.routes());
// router.use('/admin/api', adminQna.routes());
// router.use('/admin/api', adminQnaComment.routes());