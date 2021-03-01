import Router from 'koa-router';

import * as adminNoticeCtrl from './notice.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';
import { multerSetting } from '../../../utils/fileUpload';

const adminNotice = new Router();

/**
 * adminNoticeIndexRouter
 */
adminNotice.get('/', adminNoticeCtrl.index);
adminNotice.get('/search', urlReturn, adminNoticeCtrl.search);

/**
 * adminNoticeAddRouter
 */
adminNotice.get('/add', isLoggedIn, adminNoticeCtrl.addIndex);
adminNotice.post('/add', isLoggedIn, multerSetting('noticeFile', 5).array('files', 15), adminNoticeCtrl.add);

// adminNotice.post('/contentImg', isLoggedIn, multerSetting('contentImg', 5).array('files',15), adminNoticeCtrl.contentImg);

/**
 * adminNoticeViewRouter
 */

adminNotice.get('/:id', isLoggedIn, urlReturn, adminNoticeCtrl.view);

/**
 * adminNoticeEditRouter
 */

 /**
 * adminNoticeDeleteRouter
 */

// adminNotice.delete('/delete/:id', isLoggedIn, adminNoticeCtrl.remove);

export default adminNotice;