import Router from 'koa-router';

import * as qnaCtrl from './qna.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';

const qna = new Router();


/**
 * qnaIndexRouter
 */

qna.get('/', isLoggedIn, qnaCtrl.index);

/**
 * qnaAddRouter
 */

qna.post('/add', isLoggedIn, qnaCtrl.add);

export default qna;