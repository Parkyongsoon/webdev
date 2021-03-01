import Router from 'koa-router';

import * as adminMemberCtrl from './member.ctrl';

const adminMember = new Router();

/**
 * adminMemberCtrlRouter
 */

adminMember.get('/', adminMemberCtrl.index);
adminMember.get('/search', adminMemberCtrl.search);
adminMember.delete('/delete/:id', adminMemberCtrl.memberDelete);

export default adminMember;