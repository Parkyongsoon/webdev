import bcrypt from 'bcryptjs';

import { db } from '../../../models';

/**
 * myPageMemberDeleteCtrl
 */

export const memberDeleteAuthIndex = async ctx => {
  try {
    ctx.status = 200;

    await ctx.render('user/myPage/memberDelete/index', {
     errorMsg: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const memberDeleteAuth = async ctx => {
 try {
   const { password } = ctx.request.body;

   const passwordAuth = await db.tbl_eluly_users.findOne({where: {id: ctx.params.id}});

   const isMatch = await bcrypt.compare(password, passwordAuth.password);

   if(!isMatch) {
     ctx.status = 200;

     await ctx.render('user/myPage/memberDelete/index', {
       errorMsg: '비밀번호가 틀렸습니다.'
     });
   } else {
     ctx.status = 200;

     return ctx.redirect('/api/myPage/memberDelete/' + ctx.params.id);
   };

 } catch (e) {
   ctx.throw(500, e);
 };
};

export const memberDeleteIndex = async ctx => {
 try {
   ctx.status = 200;

   await ctx.render('user/myPage/memberDelete/memberDelete');
 } catch (e) {
   ctx.throw(500, e);
 };
};

export const memberDelete = async ctx => {
 try {
   await db.tbl_eluly_users.destroy({ where: { id: ctx.params.id}, force: true});

   ctx.cookies.set('token', '');
   
   ctx.status = 200;

   return ctx.redirect('/');
 } catch (e) {
   ctx.throw(500, e);
 };
};