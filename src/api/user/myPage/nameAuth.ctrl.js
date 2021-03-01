import redis from 'redis';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { setTimeout } from 'timers';

const { JWT_SECRET, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

const redisClient = redis.createClient();

const setexAsync = promisify(redisClient.setex).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);


export const index = async ctx => {
  try {
  ctx.status = 200;
  
  await ctx.render('user/myPage/nameAuth/index', {
    errorMsg: ''
  });
  
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const nameAuthNumber = async ctx => {
  try {
    const { phone } = ctx.request.body;
    const confirm = await db.tbl_eluly_users.findOne({
      where: {
        phone: phone
      }});

    if(!confirm) {
      
      ctx.status = 200;

      return ctx.body = {
        trueOrFalse: false,
        errorMsg: '일치하는 번호가 없다'
      }
    } else {
      const token = ctx.cookies.get('token');
      const payload = jwt.verify(token, JWT_SECRET);
      const accountSid = TWILIO_ACCOUNT_SID;
      const authToken = TWILIO_AUTH_TOKEN;
      // const client = twilio(accountSid, authToken);
      const client = require('twilio')(accountSid, authToken)

      let result = Math.floor(Math.random() * 1000000); // 인증번호생성

      await setexAsync('nameAuth' + payload.userId, 300, result.toString()); // 인증번호 redis 저장(5분)
      
      // twilio 인증문자 전송
      // client.messages
      //   .create({
      //      body: `인증 번호 [${result}] 입력`,
      //      from: '+19375193604',
      //      to: `+82${confirm.phone}`
      //    })
      //   .then(message => console.log(message.sid))
      //   .catch(e => console.log(e));
      
      ctx.status = 200;

      return ctx.body = {
        trueOrFalse: true
      };
    };
  } catch (e) {
    console.log(500, e);
  };
};

export const confirmAuthNumber = async ctx => {
  try {
    const { authNumber } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);
    const reply = await getAsync('nameAuth' + payload.userId);

    if(authNumber !== reply) {

      ctx.status = 200;
      
      return ctx.body = {
        trueOrFalse: false,
        errorMsg: '번호 틀림 다시 입력'
      };
    } else {

      await delAsync('nameAuth' + payload.userId);

      ctx.status = 200;

      return ctx.body = {
        trueOrFalse: true
      };
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};