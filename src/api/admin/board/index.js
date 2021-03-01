import Router from 'koa-router';

import * as adminBoardCtrl from './board.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';
import { multerSetting } from '../../../utils/fileUpload';

const adminBoard = new Router();

/**
 * adminBoardIndexRouter
 */
adminBoard.get('/', adminBoardCtrl.index);
adminBoard.get('/search', urlReturn, adminBoardCtrl.search);

/**
 * adminBoardAddRouter
 */
// adminBoard.get('/add', isLoggedIn, adminBoardCtrl.addIndex);
// adminBoard.post('/add', isLoggedIn, multerSetting('contentFile', 5).array('files', 15), adminBoardCtrl.add);

// adminBoard.post('/contentImg', isLoggedIn, multerSetting('contentImg', 5).array('files',15), adminBoardCtrl.contentImg);

/**
 * adminBoardViewRouter
 */

adminBoard.get('/:id', isLoggedIn, urlReturn, adminBoardCtrl.view);

/**
 * adminBoardEditRouter
 */

 /**
 * adminBoardDeleteRouter
 */

// adminBoard.delete('/delete/:id', isLoggedIn, adminBoardCtrl.remove);

export default adminBoard;