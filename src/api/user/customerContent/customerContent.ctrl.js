import fs from 'fs';
import redis from 'redis';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';
import { elasticSearch } from '../../../utils/search';
import { paging } from '../../../utils/pagination';
import { fileName, fileOriginalName } from '../../../utils/fileUpload';
import { fileUnlink } from '../../../utils/fileUnlink';

const { JWT_SECRET } = process.env

const redisClient = redis.createClient();
const setexAsync = promisify(redisClient.setex).bind(redisClient);
const rpushAsync = promisify(redisClient.rpush).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

/**
 * customerContentIndex
 */

 export const index = async ctx => {
   try {

    return paging(
      ctx,       
      db.tbl_eluly_content,
      {},
      'user/customerContent/index',
      'api/customerContent?page='
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
            'content',
            ['title'],
            'user/customerContent/index',
            'api/customerContent/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'content':
          console.log('content')
          return elasticSearch(
            ctx,
            'content',
            ['content'],
            'user/customerContent/index',
            'api/customerContent/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'name':
          console.log('name')
          return elasticSearch(
            ctx,
            'content',
            ['name'],
            'user/customerContent/index',
            'api/customerContent/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
          );

        case 'title_content':
          console.log('title_content')
          return elasticSearch(
            ctx,
            'content',
            ['title', 'content'],
            'user/customerContent/index',
            'api/customerContent/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
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
 * customerContentAdd
 */

 export const addIndex = async ctx => {
   try {
     ctx.status = 200;
     await ctx.render('user/customerContent/add');
   } catch (e) {
     ctx.throw(500, e);
   }
 };

 export const add = async ctx => {
   try {
    const { title, term, price, content } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    const reply = await lrangeAsync(payload.userName, 0, -1);

    await db.tbl_eluly_content.create({
      title,
      term,
      price,
      content,
      name: payload.userName,
      files: fileName(ctx.files),
      filesOriginalName: fileOriginalName(ctx.files),
      contentImg: reply,
      tblElulyUserId: payload.userId
    });
    
    redisClient.DEL(payload.userName);

    return ctx.status = 200;

   } catch (e) {
     ctx.throw(500, e);
   }
 };

 export const contentImg = async ctx => {
  try {
    console.log(ctx.request.body)
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    const fileName = ctx.files;
    let url = [];
    
    for(let i in fileName) {
      url.push("/uploads/contentImg/" + fileName[i].filename);
      redisClient.RPUSH(payload.userName, fileName[i].filename);
    };

    ctx.status = 200;

    return ctx.body = url;
  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * customerContentView
 */

export const view = async ctx => {
  try {

    const customerContentView = await db.tbl_eluly_content.findOne({where:{id: ctx.params.id }});

    ctx.status = 200;

    await ctx.render('user/customerContent/view', { 
      customerContentView
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};

 /**
 * customerContentDelete
 */

export const remove = async ctx => {
  try {
    const filePath = '/Users/park-yongsoon/Documents/eluly/backend/src/public/uploads';
    const customerContent = await db.tbl_eluly_content.findOne({ where: {id: ctx.params.id}});
    const contentFile = customerContent.files;
    const contentImg = customerContent.contentImg;

    if(customerContent.files !== null && customerContent.contentImg.length === 0) {

      fileUnlink(contentFile.length, filePath, '/contentFile/', contentFile);
      db.tbl_eluly_content.destroy({ where: { id: ctx.params.id}, force: true});

    } else if(customerContent.files === null && customerContent.contentImg.length !== 0) {

      fileUnlink(contentImg.length, filePath, '/contentImg/', contentImg);
      db.tbl_eluly_content.destroy({ where: { id: ctx.params.id}, force: true});

    } else if(customerContent.files !== null && customerContent.contentImg.length !== 0) {

      fileUnlink(contentFile.length, filePath, '/contentFile/', contentFile);
      fileUnlink(contentImg.length, filePath, '/contentImg/', contentImg);
      db.tbl_eluly_content.destroy({ where: { id: ctx.params.id}, force: true});

    } else {
      db.tbl_eluly_content.destroy({where: { id: ctx.params.id }, force: true});
    };

    ctx.status = 200;

    return ctx.redirect('/api/customerContent');

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
    
    // const total = await db.tbl_eluly_content.count({});

    // const customerContent = await db.tbl_eluly_content.findAll();

    // const pageTotal = Math.ceil(total / limit);

    // if (pageEnd > pageTotal) {
    //   pageEnd = pageTotal;
    // };

    // ctx.status = 200;

    // await ctx.render('user/customerContent/index', {
    //   customerContent,
    //   pageNum,
    //   pageSize,
    //   pageStart,
    //   pageEnd,
    //   pageTotal,
    //   pageUrl: 'api/customerContent?page=',
    //   hits: '',
    //   searchType:''
    // });

    //  export const Search = async ctx => {
//   try {

//     await client.indices.refresh({ index: 'content' });

//     if(ctx.request.body.searchType === 'title') {
//       console.log('title')
//       const { body } = await client.search({
//         index: 'content',
//         body: {
//           query: {
//             match: {
//               title: ctx.request.body.search,
//             }
//           }
//         }
//       });
//       console.log(body.hits.hits);
//       ctx.status = 200;

//       await ctx.render('user/customerContent/index', {
//        hits: body.hits.hits,
//        searchType: ctx.request.body.searchType
//       });
//     } else if(ctx.request.body.searchType === 'content') {
//       console.log('content')
//       const { body } = await client.search({
//         index: 'content',
//         body: {
//           query: {
//             match: {
//               content: ctx.request.body.search,
//             }
//           }
//         }
//       });
//       console.log(body.hits.hits);
//       ctx.status = 200;

//       await ctx.render('user/customerContent/index', {
//        hits: body.hits.hits,
//        searchType: ctx.request.body.searchType
//       });
//     } else if(ctx.request.body.searchType === 'name') {
//       console.log('name')
//       const { body } = await client.search({
//         index: 'content',
//         body: {
//           query: {
//             match: {
//               name: ctx.request.body.search,
//             }
//           }
//         }
//       });
//       console.log(body.hits.hits);
//       ctx.status = 200;

//       await ctx.render('user/customerContent/index', {
//        hits: body.hits.hits,
//        searchType: ctx.request.body.searchType
//       });
//     } else {
//       console.log('title,content')
//       const { body } = await client.search({
//         index: 'content',
//         body: {
//           query: {
//             multi_match: {
//               query: ctx.request.body.search,
//               fields:['title', 'content']
//             }
//           }
//         }
//       });
//       console.log(body.hits.hits);
//       ctx.status = 200;

//       await ctx.render('user/customerContent/index', {
//        hits: body.hits.hits,
//        searchType: ctx.request.body.searchType
//       });
//     }
//   } catch (e) {
//     console.log(e)
//   }
// }