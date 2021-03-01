import Router from 'koa-router';

import * as adminQnaCommentCtrl from './qnaComment.ctrl';

const adminQnaComment = new Router();

/**
 * adminQnaCommentCtrlRouter
 */

adminQnaComment.post('/add', adminQnaCommentCtrl.add);
adminQnaComment.put('/edit/:id', adminQnaCommentCtrl.edit);
adminQnaComment.delete('/delete/:id', adminQnaCommentCtrl.remove);

export default adminQnaComment;