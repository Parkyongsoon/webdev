import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { designerSearch } from '../../../utils/search';

export const index = async ctx => {
  try {

    return paging(
      ctx,       
      db.tbl_eluly_users,
      { role: 'designer' },
      'user/designerProfile/index',
      'api/designerProfile?page='
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
        return designerSearch(
          ctx,
          'user',
          ['name'],
          ['role'],
          'user/designerProfile/index',
          'api/designerProfile/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'major':
        console.log('major')
        return designerSearch(
          ctx,
          'user',
          ['major'],
          ['role'],
          'user/designerProfile/index',
          'api/designerProfile/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const detailProfile = async ctx => {
  try {
    const designerProfile = await db.tbl_eluly_users.findOne({where: { id: ctx.params.id, role: 'designer'}});

    ctx.status = 200;

    await ctx.render('user/designerProfile/detailProfile', {
      designerProfile
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};