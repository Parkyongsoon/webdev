import Router from 'koa-router';

import * as adminIndexCtrl from './index.ctrl';

const adminIndex = new Router();

adminIndex.get('/', adminIndexCtrl.index);
adminIndex.get('/main', adminIndexCtrl.main);

export default adminIndex;