import Router from 'koa-router';

import * as adminProgressCtrl from './progress.ctrl';

const adminProgress = new Router();

/**
 * adminProgressCtrlRouter
 */

adminProgress.get('/', adminProgressCtrl.index);

export default adminProgress;