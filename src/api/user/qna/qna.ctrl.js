import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { db } from '../../../models';

dotenv.config();

const { JWT_SECRET } = process.env

/**
 * qnaCtrl
 */

export const index = async ctx => {
  try {

    ctx.status = 200;

    await ctx.render('user/qna/index');

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const add = async ctx => {
  try {
    const { title, content } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    await db.tbl_eluly_qna.create({
      title,
      name: payload.userName,
      content,
      tblElulyUserId: payload.userId
    });

    ctx.status = 200;

    return ctx.redirect('/api/myPage/myQna/' + payload.userId);
  } catch (e) {
    ctx.throw(500, e);
  };
};