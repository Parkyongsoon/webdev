import Router from 'koa-router';

import * as myPageIndexCtrl from './myPageIndex.ctrl';
import * as nameAuthCtrl from './nameAuth.ctrl'
import * as userInfoCtrl from './userInfo.ctrl';
import * as myIdeaCtrl from './myIdea.ctrl';
import * as myPaymentCtrl from './myPayment.ctrl';
import * as myQnaCtrl from './myQna.ctrl';
import * as memberDeleteCtrl from './memberDelete.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';

const myPage = new Router();


/**
 * myPageIndexRouter
 */

myPage.get('/:id', isLoggedIn, urlReturn, myPageIndexCtrl.myPageIndex);

/**
 * myPageNameAuthRouter
 */

myPage.get('/nameAuth/:id', isLoggedIn, urlReturn, nameAuthCtrl.index);
myPage.post('/nameAuth/:id', isLoggedIn, urlReturn, nameAuthCtrl.nameAuthNumber);
myPage.post('/nameAuth/confirm/:id', isLoggedIn, urlReturn, nameAuthCtrl.confirmAuthNumber);

/**
 * myPageProfileEditRouter
 */


/**
 * myPageUserInfoEditRouter
 */

myPage.get('/userInfo/auth/:id', isLoggedIn, userInfoCtrl.userInfoEditAuthIndex);
myPage.post('/userInfo/auth/:id', isLoggedIn, userInfoCtrl.userInfoEditAuth);

myPage.get('/userInfo/edit/:id', isLoggedIn, urlReturn, userInfoCtrl.userInfoEditIndex);
myPage.put('/userInfo/edit/:id', isLoggedIn, urlReturn, userInfoCtrl.userInfoEdit);

/**
 * myPageMyIdeaRouter
 */

myPage.get('/myIdea/pending/:id', isLoggedIn, myIdeaCtrl.myIdeaPending);
myPage.get('/myIdea/pending/view/:id/:myIdeaId', isLoggedIn, myIdeaCtrl.myIdeaPendingView);
myPage.post('/myIdea/choice/:id/:myIdeaId/:designerId', isLoggedIn, urlReturn, myIdeaCtrl.Choice);
myPage.get('/myIdea/confirm/:id', isLoggedIn, myIdeaCtrl.myIdeaConfirm);
myPage.put('/myIdea/cancel/:id/:myIdeaId', isLoggedIn, urlReturn, myIdeaCtrl.Cancel);

/**
 * myPageMyPaymentRouter
 */

myPage.get('/myPayment/pending/:id', isLoggedIn, myPaymentCtrl.myPaymentPending);
myPage.get('/myPayment/confirm/:id', isLoggedIn, myPaymentCtrl.myPaymentConfirm);

/**
 * myPageMyQnARouter
 */

myPage.get('/myQna/:id', isLoggedIn, myQnaCtrl.myQnaIndex);
myPage.get('/myQna/search/:id', isLoggedIn, urlReturn, myQnaCtrl.myQnaSearch);
myPage.get('/myQna/:id/:myQnaId', isLoggedIn, myQnaCtrl.myQnaView);

/**
 * myPageMemberDeleteRouter
 */

myPage.get('/memberDelete/auth/:id', isLoggedIn, memberDeleteCtrl.memberDeleteAuthIndex);
myPage.post('/memberDelete/auth/:id', isLoggedIn, memberDeleteCtrl.memberDeleteAuth);

myPage.get('/memberDelete/:id', isLoggedIn, urlReturn, memberDeleteCtrl.memberDeleteIndex);
myPage.delete('/memberDelete/:id', isLoggedIn, urlReturn, memberDeleteCtrl.memberDelete);

export default myPage;