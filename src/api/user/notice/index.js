import Router from 'koa-router';

import * as noticeCtrl from './notice.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';

const notice = new Router();

/**
 * noticeIndexRouter
 */
notice.get('/', noticeCtrl.index);
notice.get('/search', urlReturn, noticeCtrl.search);

/**
 * noticeViewRouter
 */

notice.get('/:id', isLoggedIn, urlReturn, noticeCtrl.view);

export default notice;