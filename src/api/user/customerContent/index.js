import Router from 'koa-router';

import * as customerContentCtrl from './customerContent.ctrl';
import * as customerContentEditCtrl from './customerContentEdit.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';
import { multerSetting } from '../../../utils/fileUpload';

const customerContent = new Router();

/**
 * customerContentIndexRouter
 */
customerContent.get('/', customerContentCtrl.index);
customerContent.get('/search', urlReturn, customerContentCtrl.search);

/**
 * customerContentAddRouter
 */
customerContent.get('/add', isLoggedIn, urlReturn, customerContentCtrl.addIndex);
customerContent.post('/add', isLoggedIn, urlReturn, multerSetting('contentFile', 5).array('files', 15), customerContentCtrl.add);

customerContent.post('/contentImg', isLoggedIn, urlReturn, multerSetting('contentImg', 5).array('files',15), customerContentCtrl.contentImg);

/**
 * customerContentViewRouter
 */

customerContent.get('/:id', isLoggedIn, urlReturn, customerContentCtrl.view);

/**
 * customerContentEditRouter
 */

customerContent.get('/edit/:id', isLoggedIn, urlReturn, customerContentEditCtrl.editIndex);
customerContent.get('/edit/fileView/:id', isLoggedIn, urlReturn, customerContentEditCtrl.fileView);
customerContent.put('/edit/:id', isLoggedIn, urlReturn, multerSetting('contentFile', 5).array('files', 15), customerContentEditCtrl.edit);
customerContent.post('/edit/contentImgEdit/:id', isLoggedIn, urlReturn, multerSetting('contentImg', 5).array('files',15), customerContentEditCtrl.contentImgEdit);
customerContent.post('/edit/fileDelete/:id', isLoggedIn, urlReturn, customerContentEditCtrl.fileDel);
customerContent.post('/edit/delContentImg/:id', isLoggedIn, urlReturn, customerContentEditCtrl.delContentImg);

 /**
 * customerContentDeleteRouter
 */

customerContent.delete('/delete/:id', isLoggedIn, urlReturn, customerContentCtrl.remove);

export default customerContent;