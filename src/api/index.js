import Router from 'koa-router';

import index from './user/index/index';
import search from './user/search/index';
import auth from './user/auth/index';
import notice from './user/notice/index';
import board from './user/board/index';
import customerContent from './user/customerContent/index';
import designerProfile from './user/designerProfile/index';
import qna from './user/qna/index';
import payment from './user/payment/index';
import myPage from './user/myPage/index';

import adminIndex from './admin/index/index';
import adminAuth from './admin/auth/index';
import adminMember from './admin/member/index';
import adminNotice from './admin/notice/index';
import adminBoard from './admin/board/index';
import adminProgress from './admin/progress/index';
import adminPayment from './admin/payment/index';
import adminQna from './admin/qna/index';
import adminQnaComment from './admin/qnaComment/index';
import adminPopup from './admin/popup/index'

const api = new Router();

/**
 * userRouter
 */

api.use('/', index.routes());
api.use('/api/search', search.routes());
api.use('/api/auth', auth.routes());
api.use('/api/notice', notice.routes());
api.use('/api/board', board.routes());
api.use('/api/customerContent', customerContent.routes());
api.use('/api/designerProfile', designerProfile.routes());
api.use('/api/qna', qna.routes());
api.use('/api/payment', payment.routes());
api.use('/api/myPage', myPage.routes());

/**
 * designerRouter
 */

/**
 * adminRouter
 */

api.use('/admin', adminIndex.routes());
api.use('/admin/api/auth', adminAuth.routes());
api.use('/admin/api/member', adminMember.routes());
api.use('/admin/api/notice', adminNotice.routes());
api.use('/admin/api/board', adminBoard.routes());
api.use('/admin/api/progress', adminProgress.routes());
api.use('/admin/api/payment', adminPayment.routes());
api.use('/admin/api/qna', adminQna.routes());
api.use('/admin/api/qnaComment', adminQnaComment.routes());
api.use('/admin/api/popup', adminPopup.routes());


export default api;