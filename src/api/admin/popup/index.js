import Router from 'koa-router';

import * as adminPopupCtrl from './popup.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';
import { multerSetting } from '../../../utils/fileUpload';

const adminPopup = new Router();

/**
 * adminPopupIndexRouter
 */
adminPopup.get('/', adminPopupCtrl.index);
adminPopup.get('/search', urlReturn, adminPopupCtrl.search);

/**
 * adminPopupAddRouter
 */
adminPopup.get('/add', isLoggedIn, adminPopupCtrl.addIndex);
adminPopup.post('/add', isLoggedIn, multerSetting('popupFile', 5).array('files', 15), adminPopupCtrl.add);

/**
 * adminPopupViewRouter
 */

adminPopup.get('/:id', isLoggedIn, urlReturn, adminPopupCtrl.view);

/**
 * adminPopupEditRouter
 */

adminPopup.get('/edit/:id', isLoggedIn, urlReturn, adminPopupCtrl.editIndex);
adminPopup.get('/edit/fileView/:id', isLoggedIn, urlReturn, adminPopupCtrl.fileView);
adminPopup.put('/edit/:id', isLoggedIn, urlReturn, multerSetting('popupFile', 5).array('files', 15), adminPopupCtrl.edit);

 /**
 * adminPopupDeleteRouter
 */

adminPopup.delete('/delete/:id', isLoggedIn, adminPopupCtrl.remove);

export default adminPopup;