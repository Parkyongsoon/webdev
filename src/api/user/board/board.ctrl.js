import redis from 'redis';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import qs from 'querystring';
import crypto from 'crypto';
import Joi from 'joi';
import fs from 'fs'
import { promisify } from 'util';

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';
import { fileName, fileOriginalName } from '../../../utils/fileUpload';
import { fileUnlink } from '../../../utils/fileUnlink';

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);

/**
 * boardIndex
 */

export const index = async ctx => {
  try {

    return paging(
      ctx,       
      db.tbl_eluly_board,
      {},
      'user/board/index',
      'api/board?page='
    );

  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * boardSearch
 */

export const search = async ctx => {
  try {

      switch (ctx.query.searchType) {
        case 'title':
          console.log('title')
          return elasticSearch(
            ctx,
            'board',
            ['title'],
            'user/board/index',
            'api/board/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'content':
          console.log('content')
          return elasticSearch(
            ctx,
            'board',
            ['content'],
            'user/board/index',
            'api/board/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'name':
          console.log('name')
          return elasticSearch(
            ctx,
            'board',
            ['name'],
            'user/board/index',
            'api/board/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'title_content':
          console.log('title_content')
          return elasticSearch(
            ctx,
            'board',
            ['title', 'content'],
            'user/board/index',
            'api/board/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        default:
          break;
      };
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

/**
 * customerContentView
 */

export const view = async ctx => {
  try {

    const boardView = await db.tbl_eluly_board.findOne({where:{id: ctx.params.id }});

    ctx.status = 200;

    await ctx.render('user/board/view', { 
      boardView
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};

// let pageNum = parseInt(ctx.query.page);
    // if (!pageNum) {
    //   pageNum = 1;
    // };

    // let offset = 0;
    // const limit = 10;

    // if(pageNum > 1) {
    //   offset = 10 * (pageNum - 1);
    // };

    // const pageSize = 10;
    
    // const pageStart = Math.floor((pageNum - 1) / pageSize) * pageSize + 1;

    // let pageEnd = (pageStart + pageSize) - 1;
    
    // const total = await db.tbl_eluly_board.count({});
    
    // const board = await db.tbl_eluly_board.findAll({limit: limit, offset: offset});

    // const pageTotal = Math.ceil(total / limit);

    // if (pageEnd > pageTotal) {
    //   pageEnd = pageTotal;
    // };

    // ctx.status = 200;

    // await ctx.render('user/board/index', {
    //   board,
    //   pageNum,
    //   pageSize,
    //   pageStart,
    //   pageEnd,
    //   pageTotal,
    //   pageUrl: 'api/board?page=',
    //   hits: '',
    //   searchType:'',
    // });