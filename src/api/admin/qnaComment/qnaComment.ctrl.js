import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';

const { JWT_SECRET } = process.env

export const add = async ctx => {
  try {
    const { content, qnaId } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    await db.tbl_eluly_qnaComment.create({
      name: payload.userName,
      content,
      tblElulyQnaId: qnaId,
      tblElulyAdminId: payload.userId
    });

    await db.tbl_eluly_qna.update({
      answer: true
    }, {
      where: {
        id: qnaId
      }
    });

    ctx.status = 200;

    return ctx.redirect('/admin/api/qna/' + qnaId);
    
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const edit = async ctx => {
  try {
    const { content, qnaId } = ctx.request.body;

    await db.tbl_eluly_qnaComment.update({
      content: content
    }, {
      where: {
        id: ctx.params.id
      }
    });

    ctx.status = 200;

    return ctx.redirect('/admin/api/qna/' + qnaId);
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const remove = async ctx => {
  try {
    const { qnaId } = ctx.request.body;

    await db.tbl_eluly_qna.update({
      answer: false
    }, {
      where: {
        id: qnaId
      }
    })
    await db.tbl_eluly_qnaComment.destroy({
      where:{
        id: ctx.params.id
      }, force: true});

    ctx.status = 200;
  
    return ctx.redirect('/admin/api/qna/' + qnaId);
  } catch (e) {
    ctx.throw(500, e);
  };
};