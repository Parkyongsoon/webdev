import Router from 'koa-router';

import * as boardCtrl from './board.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';
import { multerSetting } from '../../../utils/fileUpload';

const board = new Router();

/**
 * boardIndexRouter
 */
board.get('/', boardCtrl.index);
board.get('/search', urlReturn, boardCtrl.search);

/**
 * boardAddRouter
 */
// board.get('/board/add', isLoggedIn, boardCtrl.addIndex);
// board.post('/board/add', isLoggedIn, multerSetting('contentFile', 5).array('files', 15), boardCtrl.add);

// board.post('/board/contentImg', isLoggedIn, multerSetting('contentImg', 5).array('files',15), boardCtrl.contentImg);

/**
 * boardViewRouter
 */

board.get('/:id', isLoggedIn, urlReturn, boardCtrl.view);

/**
 * boardEditRouter
 */

 /**
 * boardDeleteRouter
 */

// board.delete('/board/delete/:id', isLoggedIn, boardCtrl.remove);

export default board;