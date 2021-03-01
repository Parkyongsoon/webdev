import Router from 'koa-router';

import * as authCtrl from './auth.ctrl';
import * as findIdCtrl from './findId.ctrl';
import * as findPasswordCtrl from './findPassword.ctrl';

import { urlReturn } from '../../../utils/urlReturn';

const auth = new Router();

/**
 * registerRouter
 */
auth.get('/register', authCtrl.registerIndex);
auth.post('/register', urlReturn, authCtrl.register);

auth.get('/checkId', urlReturn, authCtrl.checkId);

/**
 * localLogin/LogoutRouter
 */

auth.get('/login', authCtrl.loginIndex);
auth.post('/login', urlReturn, authCtrl.login);

auth.post('/logout', urlReturn, authCtrl.logout);

/**
 * kakaoLogin/LogoutRouter
 */

auth.get('/oauth', urlReturn, authCtrl.kakaoLogin);
auth.post('/kakaoLogout', urlReturn, authCtrl.kakaoLogout);

 /**
 * naverLogin/LogoutRouter
 */

auth.get('/naver_oauth', urlReturn, authCtrl.naverLogin);
auth.post('/naverLogout', urlReturn, authCtrl.naverLogout);

/**
 * firstSocialLoginUserInfoRouter
 */

 auth.get('/userInfo/:id', urlReturn, authCtrl.userInfoIndex);
 auth.put('/userInfo/:id', urlReturn, authCtrl.userInfo);

 /**
  * find Id / Password
  */

 auth.get('/findId', findIdCtrl.findIdIndex);
 auth.post('/findId', urlReturn, findIdCtrl.findId);

 auth.get('/findPassword', findPasswordCtrl.findPasswordIndex);
 auth.post('/findPassword', urlReturn, findPasswordCtrl.findPassword);

 auth.get('/findedPassword/:token', findPasswordCtrl.findedPassword);
 auth.put('/resetPassword', urlReturn, findPasswordCtrl.resetPassword);

export default auth;