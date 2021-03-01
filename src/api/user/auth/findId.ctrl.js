import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';

const { JWT_SECRET } = process.env;

export const findIdIndex = async ctx => {
  try {

    ctx.status = 200;
  
    await ctx.render('user/auth/findId', {
      errorMsg:''
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const findId = async ctx => {
  try {

    const { name, email } = ctx.request.body;

    const findId = await db.tbl_eluly_users.findOne({
      where: {
        name: name,
        email: email
      }
    });

    if(!findId) {

      ctx.status = 200;

      await ctx.render('user/auth/findId', {
        errorMsg: '이용자가 없습니다'
      });
    } else {

      ctx.status = 200;

      await ctx.render('user/auth/findedId', {
        username: findId.username
      });

    };

  } catch (e) {
    ctx.throw(500, e);
  };
};