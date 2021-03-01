import redis from 'redis';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const { JWT_SECRET } = process.env;

export const findPasswordIndex = async ctx => {
  try {

    ctx.status = 200;
  
    await ctx.render('user/auth/findPassword', {
      errorMsg:''
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const findPassword = async ctx => {
  try {

    const { username, email } = ctx.request.body;

    const findPassword = await db.tbl_eluly_users.findOne({
      where: {
        username: username,
        email: email
      }
    });

    if(!findPassword) {

      ctx.status = 200;

      await ctx.render('user/auth/findPassword', {
        errorMsg: '이용자가 없습니다'
      });

    } else {      

      const payload = {
        username: findPassword.username
      };

      const token = jwt.sign(payload, JWT_SECRET);

      redisClient.SETEX(token, 86400, token);

      const Transport = nodemailer.createTransport({
        host: 'localhost',
        port: 3000,
        secure: false,
        service: 'Gmail',
        auth: {
          user: 'email',
          pass: 'password'
        }
      });

      const mailOptions = {
        to: findPassword.email,
        from: 'passwordreset@demo.com',
        subject: '비밀번호 재설정',
        html: '<h5>귀하 (또는 다른 사람)가 귀하의 계정에 대한 암호 재설정을 요청했기 때문에 이를 수신하고 있습니다.</h5>' +
              '<h5>다음 링크를 클릭하거나 브라우저에 붙여 넣어 과정을 완료하십시오.</h5>' +
              '<h3><a href="http://localhost:3000/api/auth/findedPassword/' + token + '">http://localhost:3000/api/auth/findedPassword/' + token + '</a></h3>' +
              '<h5>요청하지 않은 경우이 이메일을 무시하십시오. 비밀번호는 변경되지 않습니다.</h5>'
      };

      Transport.sendMail(mailOptions, (err) => {
        console.log(err)
      });

      ctx.status = 200;

      return ctx.body = '<script>' +
                          'alert("추가 지시 사항과 함께 전자 메일이 '+ findPassword.email +'로 전송되었습니다.");' +
                          'window.location.href = "http://localhost:3000/"' +
                        '</script>'
    };

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const findedPassword = async ctx => {
  try {

    const token = ctx.params.token;
    console.log(token);

    const reply = await getAsync(token);

    // const parseReply = JSON.parse(reply);
    // console.log(parseReply)
    if(token !== reply) {
      return ctx.body = '<script>' +
                          'alert("다시 확인 해봐라");' +
                          'window.location.href = "http://localhost:3000/"' +
                        '</script>'
    } else {
      ctx.status = 200;
  
      await ctx.render('user/auth/findedPassword', {
        errorMsg:'',
        token
      });
    }

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const resetPassword = async ctx => {
  try {
    const { newPassword, confirmPassword, token } = ctx.request.body;

    if(newPassword !== confirmPassword) {

      ctx.status = 200;
  
      await ctx.render('user/auth/findedPassword', {
        errorMsg:'비밀번호가 틀렸다'
      });
    } else {

      const reply = await getAsync(token);

      const payload = jwt.verify(reply, JWT_SECRET);

      const hash = await bcrypt.hash(newPassword, 12);

      await db.tbl_eluly_users.update({
        password: hash
      }, {
        where: {
          username: payload.username
        }
      });

      await delAsync(reply);

      ctx.status = 200;

      await ctx.render('user/auth/findedPassword2')
    }
  } catch (e) {
    ctx.throw(500, e);
  }
}