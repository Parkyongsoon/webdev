import Router from 'koa-router';

import * as paymentCtrl from './payment.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';

const payment = new Router();

/**
 * customerPaymentIndex
 */

payment.get('/payment/:id', isLoggedIn, urlReturn, paymentCtrl.index);
payment.post('/payment/complete/:id', isLoggedIn, urlReturn, paymentCtrl.paymentComplete);

export default payment;