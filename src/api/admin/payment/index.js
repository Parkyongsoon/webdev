import Router from 'koa-router';

import * as adminPaymentCtrl from './payment.ctrl';

const adminPayment = new Router();

/**
 * adminPaymentCtrlRouter
 */

adminPayment.get('/', adminPaymentCtrl.index);
adminPayment.get('/search', adminPaymentCtrl.search);
adminPayment.post('/cancel/:id', adminPaymentCtrl.cancel);

export default adminPayment;