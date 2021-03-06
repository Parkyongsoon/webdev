import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'querystring';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { registerValidator } from '../../../utils/validator';

const { KAKAO_ID, NAVER_ID, NAVER_SECRET, JWT_SECRET } = process.env

/**
 * registerCtrl
 */

export const registerIndex = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('user/auth/register');
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const register = async ctx => {
  try {
    const { username, password, name, email, postcode, address, detailAddress, extraAddress, phone } = ctx.request.body;
    const hash = await bcrypt.hash(password, 12);
    const result = registerValidator.validate(ctx.request.body);

    if(result.error) {
     //  const error = {
     //    status: 400,
     //    username: username,
     //    password: password,
     //    name: name,
     //    email: email,
     //    postcode: postcode,
     //    address: address,
     //    detailAddress: detailAddress,
     //    extraAddress: extraAddress,
     //    phone:phone,
     //    errors: result.error.details
     //  }
     // ctx.status = 400;
     // ctx.body = error;
     console.log(result.error.details);
     ctx.status = 400;
     await ctx.render('user/auth/register', {
       username,
       password,
       name,
       email,
       postcode,
       address,
       detailAddress,
       extraAddress,
       phone,
       errors : result.error.details
     });
    } else {
      await db.tbl_eluly_users.create({
        username,
        password: hash,
        name,
        email,
        postcode,
        address,
        detailAddress,
        extraAddress,
        phone,
        provider: 'local',
        role: 'customer'
      });
      ctx.status = 200;
      return ctx.redirect('/api/auth/login');
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const checkId = async ctx => {
  try {
    const username = ctx.query.username;
    const result = await db.tbl_eluly_users.findOne({where: {username: username}});
   
    ctx.status = 200;
    return ctx.body = ({
      result: result
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * loginCtrl
 */

export const loginIndex = async ctx => {
  try {
    const remember = ctx.cookies.get('username');
    let state = crypto.randomBytes(20).toString('hex');
    const callbackURL = 'http://localhost:3000/api/auth/oauth'
    const naver_callbackURL = 'http://localhost:3000/api/auth/naver_oauth'

    ctx.status = 200;

    await ctx.render('user/auth/login', {
      remember,
      state,
      naver_callbackURL,
      callbackURL,
      apiKey: KAKAO_ID,
      naverKey: NAVER_ID,
      errorMsg: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

// localLogin/LogoutCtrl

export const login = async ctx => {
  try {
    const{ username, password, rememberUsername } = ctx.request.body;
    let state = crypto.randomBytes(20).toString('hex');
    const callbackURL = 'http://localhost:3000/api/auth/oauth'
    const naver_callbackURL = 'http://localhost:3000/api/auth/naver_oauth'

    if(rememberUsername !== undefined) {
      ctx.cookies.set('username', username);
    } else {
      ctx.cookies.set('username', '');
    };

    const user = await db.tbl_eluly_users.findOne({
      where:{
        username: username
      }
    });

    if(!user) {
      const remember = ctx.cookies.get('username');

      ctx.status = 200;
      // ctx.body = {
      //   errorMsg: '이용자가 없습니다.'
      // };
      // return ctx.redirect('/api/auth/login');
      await ctx.render('user/auth/login', {
        remember,
        state,
        naver_callbackURL,
        callbackURL,
        apiKey: KAKAO_ID,
        naverKey: NAVER_ID,
        errorMsg: '이용자가 없습니다.'
      })
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if(isMatch) {
        const payload = {
          userId: user.id,
          userName: user.name,
          provider: user.provider,
          role: user.role
        };

        if(user.role !== 'customer') {
          const remember = ctx.cookies.get('username');

          await ctx.render('user/auth/login', {
            remember,
            state,
            naver_callbackURL,
            callbackURL,
            apiKey: KAKAO_ID,
            naverKey: NAVER_ID,
            errorMsg: '커스터머가 아닙니다.'
          });

        } else {
          const accessToken = jwt.sign(payload, JWT_SECRET);

          ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

          ctx.status = 200;

          return ctx.redirect('/');
        };
      } else {
        const remember = ctx.cookies.get('username');
        
        ctx.status = 200;
        // ctx.body = {
        //   errorMsg: '비밀번호가 틀렸습니다.'
        // };
        // return ctx.redirect('/api/auth/login');
        await ctx.render('user/auth/login', {
          remember,
          state,
          naver_callbackURL,
          callbackURL,
          apiKey: KAKAO_ID,
          naverKey: NAVER_ID,
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

    return ctx.redirect('/');
  } catch (e) {
    ctx.throw(500, e);
  };
};

// kakaoLogIn/LogoutCtrl

export const kakaoLogin = async ctx => {
  try {
    const { code } = ctx.query;

    const data = {
      grant_type: 'authorization_code',
      client_id: KAKAO_ID,
      redirect_uri: 'http://localhost:3000/api/auth/oauth',
      code: code,
    };

    const getToken = await axios({
      url: 'https://kauth.kakao.com/oauth/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: qs.stringify(data)
    });
    
    const { access_token } = getToken.data;

    const profile = await axios({
      url: 'https://kapi.kakao.com/v2/user/me',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token}
    });

    const { id, properties, kakao_account } = profile.data;

    const user = await db.tbl_eluly_users.findOne({where: {snsId: id.toString(), provider: 'kakao'}})
    
    if(!user) {
      const userAdd = await db.tbl_eluly_users.create({        
        name: properties.nickname,
        email: kakao_account.email,
        snsId: id.toString(),
        provider: 'kakao',
        role: 'customer'
      });

      const user2 = await db.tbl_eluly_users.findOne({ where: {snsId: userAdd.snsId, provider: 'kakao'}});
      
      const payload = {
        userId: user2.id,
        userName: user2.name,
        provider: user2.provider,
        role: user2.role
      };

      const accessToken = jwt.sign(payload, JWT_SECRET);

      ctx.cookies.set('kakao_token', access_token);
      ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

      ctx.ststus = 200;
      return ctx.redirect('/api/auth/userInfo/' + user2.id);
    } else {

      const payload = {
        userId: user.id,
        userName: user.name,
        provider: user.provider,
        role: user.role
      };

      const accessToken = jwt.sign(payload, JWT_SECRET);
      
      ctx.cookies.set('kakao_token', access_token);
      ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

      ctx.status = 200;
      return ctx.redirect('/');
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const kakaoLogout = async ctx => {
  try {
    const getStatus = await axios({
      url: 'https://kapi.kakao.com/v1/user/unlink',
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + ctx.cookies.get('kakao_token')}
    });

    if(getStatus.status === 200) {

      ctx.cookies.set('kakao_token', '');
      ctx.cookies.set('token', '');

      ctx.status = 200;

      return ctx.redirect('/');
    };

  } catch (e) {
    ctx.throw(500, e);
  };
};

// naverLogIn/LogoutCtrl

export const naverLogin = async ctx => {
  try {
    const { code, state } = ctx.query;

    const naverCallbackURL = 'http://localhost:3000/api/auth/naver_oauth';
    
    const apiUrl = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='+ NAVER_ID + '&client_secret=' + NAVER_SECRET + '&redirect_uri=' + naverCallbackURL + '&code=' + code + '&state=' + state;

    const getToken = await axios({
      url: apiUrl,
      method: 'POST',
      headers: {'X-Naver-Client-Id':NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET}
    });

    const { access_token } = getToken.data;

    const profile = await axios({
      url: 'https://openapi.naver.com/v1/nid/me',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token}
    });    

    const { id, nickname, email } = profile.data.response;

    const user = await db.tbl_eluly_users.findOne({where: {snsId: id, provider: 'naver'}});

    if(!user) {
      
      const userAdd = await db.tbl_eluly_users.create({        
        name: nickname,
        email: email,
        snsId: id,
        provider: 'naver',
        role: 'customer'
      });

      const user2 = await db.tbl_eluly_users.findOne({ where: {snsId: userAdd.snsId, provider: 'naver'}});

      const payload = {
        userId: user2.id,
        userName: user2.name,
        provider: user2.provider,
        role: user2.role
      };

      const accessToken = jwt.sign(payload, JWT_SECRET);

      ctx.cookies.set('naver_token', access_token);
      ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

      ctx.status = 200;

      return ctx.redirect('/api/auth/userInfo/' + user2.id);
    } else {

      const payload = {
        userId: user.id,
        userName: user.name,
        provider: user.provider,
        role: user.role
      };

      const accessToken = jwt.sign(payload, JWT_SECRET);

      ctx.cookies.set('naver_token', access_token);
      ctx.cookies.set('token', accessToken, { expiresIn: '1d' });

      ctx.status = 200;

      return ctx.redirect('/');
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const naverLogout = async ctx => {
  try {
    const apiUrl = 'https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id='+ NAVER_ID + '&client_secret=' + NAVER_SECRET + '&access_token=' + ctx.cookies.get('naverToken') + '&service_provider=NAVER';

    const getStatus = await axios({
      url: apiUrl,
      method: 'POST'
    });

    if(getStatus.status === 200) {

      ctx.cookies.set('naver_token', '');
      ctx.cookies.set('token', '');

      ctx.status = 200;

      return ctx.redirect('/');
    };
  } catch (e) {
    console.log(e);
  };
};

export const userInfoIndex = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('user/auth/userInfo', {
      errorMsg:''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const userInfo = async ctx => {
  try {

    const { name, password, confirmPassword, email, postcode, address, detailAddress, extraAddress, phone } = ctx.request.body;
    const userInfo = await db.tbl_eluly_users.findOne({where: {id: ctx.params.id}});
    const hash = await bcrypt.hash(password, 12);    

    if(password !== confirmPassword) {
      await ctx.render('user/auth/userInfo', {
        errorMsg: '비밀번호가 일치하지 않습니다.'
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

      return ctx.redirect('/');
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};