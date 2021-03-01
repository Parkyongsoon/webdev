import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { registerValidator, loginValidator } from '../../../utils/validator';

const { JWT_SECRET } = process.env

/**
 * registerCtrl
 */

export const registerIndex = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('admin/auth/register');
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const register = async ctx => {
  try {
    const { username, password, name, email, phone } = ctx.request.body;
    const hash = await bcrypt.hash(password, 12);
    const result = registerValidator.validate(ctx.request.body);

    if(result.error) {
     //  const error = {
     //    username: username,
     //    password: password,
     //    name: name,
     //    phone:phone,
     //    errors: result.error.details
     //  }
     // ctx.status = 400;
     // ctx.body = error;
     console.log(result.error.details);
     ctx.status = 400;
     await ctx.render('admin/auth/register', {
       username,
       password,
       name,
       email,
       phone,
       errors : result.error.details
     });
    } else {
      await db.tbl_eluly_admin.create({
        username,
        password: hash,
        name,
        email,
        phone,
        isAdmin: true
      });
      ctx.status = 200;
      return ctx.redirect('/admin');
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const checkId = async ctx => {
  try {
    const username = ctx.query.username;
    const result = await db.tbl_eluly_admin.findOne({where: {username: username}});
   
    ctx.status = 200;
    return ctx.body = ({
      result: result
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * login/logOutCtrl
 */

export const login = async ctx => {
  try {
    const{ username, password, rememberUsername } = ctx.request.body;

    if(rememberUsername !== undefined) {
      ctx.cookies.set('username', username);
    } else {
      ctx.cookies.set('username', '');
    };

    const admin = await db.tbl_eluly_admin.findOne({
      where:{
        username: username
      }
    });

    if(!admin) {
      const remember = ctx.cookies.get('username');

      ctx.status = 200;
      // ctx.body = {
      //   errorMsg: '이용자가 없습니다.'
      // };
      // return ctx.redirect('/api/auth/login');
      await ctx.render('admin/index', {
        remember,
        errorMsg: '이용자가 없습니다.'
      })
    } else {
      const isMatch = await bcrypt.compare(password, admin.password);

      if(isMatch) {
        const payload = {
          userId: admin.id,
          userName: admin.name,
          isAdmin: admin.isAdmin
        };

        if(admin.isAdmin !== true) {
          const remember = ctx.cookies.get('username');

          await ctx.render('admin/index', {
            remember,
            errorMsg: '관리자가 아닙니다.'
          });

        } else {
          const accessToken = jwt.sign(payload, JWT_SECRET);

          ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

          ctx.status = 200;

          return ctx.redirect('/admin/main');
        };
      } else {
        const remember = ctx.cookies.get('username');
        
        ctx.status = 200;
        // ctx.body = {
        //   errorMsg: '비밀번호가 틀렸습니다.'
        // };
        // return ctx.redirect('/api/auth/login');
        await ctx.render('admin/index', {
          remember,
          errorMsg: '비밀번호가 틀렸습니다.'
        })
      }
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const logout = async ctx => {
  try {
    ctx.cookies.set('token', '');

    ctx.status = 200;

    return ctx.redirect('/admin');
  } catch (e) {
    ctx.throw(500, e);
  };
};