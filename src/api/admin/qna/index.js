import Router from 'koa-router';

import * as adminQnaCtrl from './qna.ctrl';

const adminQna = new Router();

/**
 * adminQnaCtrlRouter
 */

adminQna.get('/', adminQnaCtrl.index);
adminQna.get('/search', adminQnaCtrl.search);
adminQna.get('/:id', adminQnaCtrl.view);

export default adminQna;