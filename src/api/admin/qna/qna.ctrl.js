import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';

const { JWT_SECRET } = process.env

/**
 * qnaCtrl
 */

export const index = async ctx => {
  try {
    return paging(
      ctx,       
      db.tbl_eluly_qna,
      {},
      'admin/qna/index',
      'admin/api/qna?page='
    );
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const search = async ctx => {
  try {

    switch (ctx.query.searchType) {
      case 'title':
        console.log('title')
        return elasticSearch(
          ctx,
          'qna',
          ['title'],
          'admin/qna/index',
          'admin/api/qna/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'content':
        console.log('content')
        return elasticSearch(
          ctx,
          'qna',
          ['content'],
          'admin/qna/index',
          'admin/api/qna/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'name':
        console.log('name')
        return elasticSearch(
          ctx,
          'qna',
          ['name'],
          'admin/qna/index',
          'admin/api/qna/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'title_content':
        console.log('title_content')
        return elasticSearch(
          ctx,
          'qna',
          ['title_content'],
          'admin/qna/index',
          'admin/api/qna/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
  }
}

export const view = async ctx => {
  try {

    const qnaView = await db.tbl_eluly_qna.findOne({ where: { id: ctx.params.id }});
    const qnaComment = await db.tbl_eluly_qnaComment.findAll({where: { tblElulyQnaId: ctx.params.id}, include: [db.tbl_eluly_qna]});
    
    ctx.status = 200;

    await ctx.render('admin/qna/view', {
      qnaView,
      qnaComment
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};