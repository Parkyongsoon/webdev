import Router from 'koa-router';

import * as searchCtrl from './search.ctrl';

import { urlReturn } from '../../../utils/urlReturn';

const search = new Router();

search.get('/', urlReturn, searchCtrl.search);

export default search;