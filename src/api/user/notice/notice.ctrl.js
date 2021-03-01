import redis from 'redis';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config();

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';

const { JWT_SECRET } = process.env
/**
 * noticeIndex
 */

export const index = async ctx => {
  try {
    let pageNum = parseInt(ctx.query.page) || 1;

    const perPage = 10;

    let offset = ((perPage * pageNum) - perPage);
    
    const pageStart = Math.floor((pageNum - 1) / perPage) * perPage + 1;

    let pageEnd = (pageStart + perPage) - 1;
    
    const total = await db.tbl_eluly_notice.count({
      where: { noti: false }
    });

    const list = await db.tbl_eluly_notice.findAll({
      limit: perPage,
      offset: offset,
      order: [['id', 'DESC']],
      where: { noti: false }
    });

    const noti = await db.tbl_eluly_notice.findAll({
      limit: perPage,
      offset: offset,
      order: [['id', 'DESC']],
      where: { noti: true }
    });

    const pageTotal = Math.ceil(total / perPage);

    if (pageEnd > pageTotal) {
      pageEnd = pageTotal;
    };

    // const result = {
    //   list: list,
    //   noti: noti,
    //   pageNum: pageNum,
    //   perPage: perPage,
    //   pageStart: pageStart,
    //   pageEnd: pageEnd,
    //   pageTotal: pageTotal,
    //   pageUrl: pageUrl,
    //   hits: '',
    //   searchType:'',
    // };

    ctx.status = 200;
    
    // return ctx.body = result;
    
    await ctx.render('user/notice/index', {
      list,
      noti,
      pageNum,
      perPage,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl: 'api/notice?page=',
      hits: '',
      searchType:'',
    });

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
          'notice',
          ['title'],
          'user/notice/index',
          'api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'content':
        console.log('content')
        return elasticSearch(
          ctx,
          'notice',
          ['content'],
          'user/notice/index',
          'api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'name':
        console.log('name')
        return elasticSearch(
          ctx,
          'notice',
          ['name'],
          'user/notice/index',
          'api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'title_content':
        console.log('title_content')
        return elasticSearch(
          ctx,
          'notice',
          ['title', 'content'],
          'user/notice/index',
          'api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const view = async ctx => {
  try {

    const view = await db.tbl_eluly_notice.findOne({where:{id: ctx.params.id }});

    ctx.status = 200;

    await ctx.render('user/notice/view', { 
      view
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};