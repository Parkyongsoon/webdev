import { db } from '../../../models';

import { paging } from '../../../utils/pagination';
import { myPageSearch } from '../../../utils/search';

/**
 * myPageMyQnACtrl
 */

export const myQnaIndex = async ctx => {
  try {

    return paging(
      ctx,       
      db.tbl_eluly_qna,
      { tblElulyUserId: ctx.params.id },
      'user/myPage/myQna/index',
      'api/myPage/myQna/' + ctx.params.id + '?page='
    );

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myQnaSearch = async ctx => {
  try {
    switch (ctx.query.searchType) {
      case 'title':
        console.log('title')
        return myPageSearch(
          ctx,
          'qna',
          ['title'],
          ['tblelulyuserid'],
          'user/myPage/myQna/index',
          'api/myPage/myQna/search/' + ctx.params.id + '?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'content':
        console.log('content')
        return myPageSearch(
          ctx,
          'qna',
          ['content'],            
          ['tblelulyuserid'],
          'user/myPage/myQna/index',
          'api/myPage/myQna/search/' + ctx.params.id + '?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'title_content':
        console.log('title_content')
        return myPageSearch(
          ctx,
          'qna',
          ['title', 'content'],
          ['tblelulyuserid'],
          'user/myPage/myQna/index',
          'api/myPage/myQna/search/' + ctx.params.id + '?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const myQnaView = async ctx => {
  try {
    const myQnaView = await db.tbl_eluly_qna.findOne({where: {id: ctx.params.myQnaId, tblElulyUserId: ctx.params.id}});
    const myQnaComment = await db.tbl_eluly_qnaComment.findAll({where: {tblElulyQnaId: ctx.params.myQnaId}});

    ctx.status = 200;

    await ctx.render('user/myPage/myQnA/view', {
      myQnaView,
      myQnaComment
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myQnaEditIndex = async ctx => {
  try {
    const edit = await db.tbl_eluly_qna.findOne({where: {id: ctx.params.myQnAId, tblElulyUserId: ctx.params.id}});
    
    ctx.status = 200;

    await ctx.render('user/myPage/myQnA/edit', {
      edit
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myQnaEdit = async ctx => {
  try {
    const { title, content } = ctx.request.body;

    await db.tbl_eluly_qna.update({
      title: title,
      content: content
    }, { where: {
        id: ctx.params.myQnAId
       }
    });

    ctx.status = 200;

    return ctx.redirect('/myPage/myQnA/' + ctx.params.id +'/' + req.params.myQnAId);
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myQnaDelete = async ctx => {
  try {
    await db.tbl_eluly_qna.destroy({
      where: { 
        id: req.params.myQnAId 
      }, force: true});

      ctx.status = 200;

      return ctx.redirect('/myPage//myQnA/' + ctx.params.id);
  } catch (e) {
    ctx.throw(500, e);
  };
};