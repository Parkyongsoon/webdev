import Router from 'koa-router';

import * as adminAuthCtrl from './auth.ctrl';

const adminAuth = new Router();

/**
 * registerRouter
 */
adminAuth.get('/register', adminAuthCtrl.registerIndex);
adminAuth.post('/register', adminAuthCtrl.register);

adminAuth.get('/checkId', adminAuthCtrl.checkId);

/**
 * login/LogoutRouter
 */

adminAuth.post('/login', adminAuthCtrl.login);

adminAuth.post('/logout', adminAuthCtrl.logout);

export default adminAuth;