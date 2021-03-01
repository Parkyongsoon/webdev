import Router from 'koa-router';

import * as indexCtrl from './index.ctrl';

const index = new Router();

index.get('/', indexCtrl.index);
// index.post('/', indexCtrl.generate_fake);

export default index;