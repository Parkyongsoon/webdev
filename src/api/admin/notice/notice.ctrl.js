import redis from 'redis';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config();

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';
import { fileName, fileOriginalName } from '../../../utils/fileUpload';
import { fileUnlink } from '../../../utils/fileUnlink';

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
const { JWT_SECRET } = process.env
/**
 * adminNoticeIndex
 */

export const index = async ctx => {
  try {
    let pageNum = parseInt(ctx.query.page) || 1;

    const perPage = 10;

    let offset = ((perPage * pageNum) - perPage);
    
    const pageStart = Math.floor((pageNum - 1) / perPage) * perPage + 1;

    let pageEnd = (pageStart + perPage) - 1;
    
    const total = await db.tbl_eluly_notice.count({where: {noti: false}});

    const list = await db.tbl_eluly_notice.findAll({
      limit: perPage,
      offset: offset,
      order: [['id', 'DESC']],
      where: {noti: false}
    });

    const noti = await db.tbl_eluly_notice.findAll({
      limit: perPage,
      offset: offset,
      order: [['id', 'DESC']],
      where: {noti: true}
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
    
    await ctx.render('admin/notice/index', {
      list,
      noti,
      pageNum,
      perPage,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl: 'admin/api/notice?page=',
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
          'admin/notice/index',
          'admin/api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'content':
        console.log('content')
        return elasticSearch(
          ctx,
          'notice',
          ['content'],
          'admin/notice/index',
          'admin/api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'name':
        console.log('name')
        return elasticSearch(
          ctx,
          'notice',
          ['name'],
          'admin/notice/index',
          'admin/api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'title_content':
        console.log('title_content')
        return elasticSearch(
          ctx,
          'notice',
          ['title', 'content'],
          'admin/notice/index',
          'admin/api/notice/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const addIndex = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('admin/notice/add');
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const add = async ctx => {
  try {
   const { title, noti, content } = ctx.request.body;
   console.log(ctx.request.body)
   const token = ctx.cookies.get('token');
   const payload = jwt.verify(token, JWT_SECRET);

   const reply = await lrangeAsync(payload.userName, 0, -1);

   await db.tbl_eluly_notice.create({
     title,
     noti,
     content,
     name: payload.userName,
     files: fileName(ctx.files),
     filesOriginalName: fileOriginalName(ctx.files),
     contentImg: reply,
     tblElulyAdminId: payload.userId
   });
   
   redisClient.DEL(payload.userName);

   return ctx.status = 200;

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const view = async ctx => {
  try {

    const view = await db.tbl_eluly_notice.findOne({where:{id: ctx.params.id }});

    ctx.status = 200;

    await ctx.render('admin/notice/view', { 
      view
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};