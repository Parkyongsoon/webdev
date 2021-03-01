import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';

const { JWT_SECRET } = process.env

/**
 * memberCtrl
 */

export const index = async ctx => {
  try {
    return paging(
      ctx,       
      db.tbl_eluly_users,
      {},
      'admin/member/index',
      'admin/api/member?page='
    );
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const search = async ctx => {
  try {

    switch (ctx.query.searchType) {
      case 'name':
        console.log('name')
        return elasticSearch(
          ctx,
          'user',
          ['name'],
          'admin/member/index',
          'admin/api/member/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'major':
        console.log('major')
        return elasticSearch(
          ctx,
          'user',
          ['major'],
          'admin/member/index',
          'admin/api/member/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'role':
        console.log('role')
        return elasticSearch(
          ctx,
          'user',
          ['role'],
          'admin/member/index',
          'admin/api/member/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
  }
}

export const memberDelete = async ctx => {
  try {
    await db.tbl_eluly_users.destroy({ where: { id: ctx.params.id}, force: true});
    
    ctx.status = 200;

    return ctx.redirect('/admin/api/member');
  } catch (e) {
    ctx.throw(500, e);
  };
};

// await client.indices.refresh({ index: 'user' });

    // if(ctx.request.body.searchType === 'name') {
    //   console.log('name')
    //   const { body } = await client.search({
    //     index: 'user',
    //     body: {
    //       query: {
    //         match: {
    //           name: ctx.request.body.search,
    //         }
    //       }
    //     }
    //   });
    //   console.log(body.hits.hits);
    //   ctx.status = 200;

    //   await ctx.render('admin/member/index', {
    //    hits: body.hits.hits,
    //    searchType: ctx.request.body.searchType
    //   });
    // } else if(ctx.request.body.searchType === 'major'){
    //   console.log('major')
    //   const { body } = await client.search({
    //     index: 'user',
    //     body: {
    //       query: {
    //         match: {
    //           major: ctx.request.body.search,
    //         }
    //       }
    //     }
    //   });
    //   console.log(body.hits.hits);
    //   ctx.status = 200;

    //   await ctx.render('admin/member/index', {
    //    hits: body.hits.hits,
    //    searchType: ctx.request.body.searchType
    //   });
    // } else {
    //   console.log('role')
    //   const { body } = await client.search({
    //     index: 'user',
    //     body: {
    //       query: {
    //         match: {
    //           role: ctx.request.body.search,
    //         }
    //       }
    //     }
    //   });
    //   console.log(body.hits.hits);
    //   ctx.status = 200;

    //   await ctx.render('admin/member/index', {
    //    hits: body.hits.hits,
    //    searchType: ctx.request.body.searchType
    //   });
    // }