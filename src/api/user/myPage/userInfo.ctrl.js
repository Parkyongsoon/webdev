import bcrypt from 'bcryptjs';

import { db } from '../../../models';

/**
 * myPageUserInfoEditAuthCtrl
 */

export const userInfoEditAuthIndex = async ctx => {
  try {
    ctx.status = 200; 
    await ctx.render('user/myPage/userInfo/index', {
      errorMsg: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const userInfoEditAuth = async ctx => {
  try {
    const { password } = ctx.request.body;

    const passwordAuth = await db.tbl_eluly_users.findOne({where: {id: ctx.params.id}});

    const isMatch = await bcrypt.compare(password, passwordAuth.password);

    if(!isMatch) {
      ctx.status = 200;

      await ctx.render('user/myPage/userInfo/index', {
        errorMsg: '비밀번호가 틀렸습니다.'
      });
    } else {
      ctx.status = 200;

      return ctx.redirect('/api/myPage/userInfo/edit/' + ctx.params.id);
    };

  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * myPageUserInfoEditCtrl
 */

export const userInfoEditIndex = async ctx => {
  try {

    const userInfo = await db.tbl_eluly_users.findOne({where: {id: ctx.params.id}});
    
    ctx.status = 200;
    
    await ctx.render('user/myPage/userInfo/userInfoEdit', {
      userInfo,
      errorMsg: ''
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const userInfoEdit = async ctx => {
  try {

    const { name, currentPassword, newPassword, confirmPassword, email, postcode, address, detailAddress, extraAddress, phone } = ctx.request.body;
    const userInfo = await db.tbl_eluly_users.findOne({where: {id: ctx.params.id}});
    const hash = await bcrypt.hash(newPassword, 12);
    if(currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, userInfo.password);

      if(!isMatch) {
        await ctx.render('user/myPage/userInfo/userInfoEdit', {
          userInfo,
          errorMsg: '비밀번호가 일치하지 않습니다.'
        });
      } else {
        if(newPassword !== confirmPassword) {
          await ctx.render('user/myPage/userInfo/userInfoEdit', {
            userInfo,
            errorMsg: '새 비밀번호가 일치하지 않습니다.'
          });
        } else {
          await db.tbl_eluly_users.update({
            name: name,
            password: hash,
            email: email,
            postcode: postcode,
            address: address,
            detailAddress: detailAddress,
            extraAddress: extraAddress,
            phone: phone
          }, {
            where: {
              id: ctx.params.id
            }
          });

          ctx.status = 200;

          return ctx.redirect('/api/myPage/' + ctx.params.id);
        }
      };
    } else {
      await db.tbl_eluly_users.update({
        name: name,
        email: email,
        postcode: postcode,
        address: address,
        detailAddress: detailAddress,
        extraAddress: extraAddress,
        phone: phone
      }, {
        where: {
          id: ctx.params.id
        }
      });
      ctx.status = 200;

      return ctx.redirect('/api/myPage/' + ctx.params.id);
    };

  } catch (e) {
    ctx.throw(500, e);
  };
};