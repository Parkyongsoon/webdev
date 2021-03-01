import Router from 'koa-router';

import * as designerProfileCtrl from './designerProfile.ctrl';

import { isLoggedIn } from '../../../utils/isLoggedIn';
import { urlReturn } from '../../../utils/urlReturn';

const designerProfile = new Router();

/**
 * designerProfileIndexRouter
 */
designerProfile.get('/', designerProfileCtrl.index);
designerProfile.get('/search', urlReturn, designerProfileCtrl.search);

/**
 * designerProfileDetailRouter
 */
designerProfile.get('/:id', isLoggedIn, urlReturn, designerProfileCtrl.detailProfile);

export default designerProfile;