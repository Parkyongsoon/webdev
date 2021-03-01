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
const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
const rpushAsync = promisify(redisClient.rpush).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
const zrangeAsync = promisify(redisClient.zrange).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

/**
 * customerContentEdit
 */

export const editIndex = async ctx => {
  try {
    const editView = await db.tbl_eluly_content.findOne({where: {id: ctx.params.id}});

    ctx.status = 200;

    await ctx.render('user/customerContent/edit', {
      editView
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const edit = async ctx => {
  try {
    const { title, term, price, content } = ctx.request.body;
    let filename = ctx.request.body.filename;

    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const delReply = await zrangeAsync('delFile' + payload.userId, 0, -1);
    const delContentImgReply = await zrangeAsync('delContentImg' + payload.userId, 0, -1);
    const editReply = await zrangeAsync('editFile' + payload.userId, 0, -1);

    const filePath = '/Users/park-yongsoon/Documents/eluly/backend/src/public/uploads';

    let fileOriginalName = [];

    if(delReply) {
      await fileUnlink(delReply.length, filePath, '/contentFile/', delReply);
      await delAsync('delFile' + payload.userId);
    };

    if(delContentImgReply) {
      console.log(delContentImgReply)
      await fileUnlink(delContentImgReply.length, filePath, '/contentImg/', delContentImgReply);
      await delAsync('delContentImg' + payload.userId);
    };

    if(ctx.files === undefined) {

      console.log(!editReply.length)
      console.log(editReply.length !== 0)
      // let fileOriginalName = [];

      filename.map(f => {
        console.log(f.substring(f.indexOf('_') + 1))
        fileOriginalName.push(f.substring(f.indexOf('_') + 1))
      });

      if(editReply.length !== 0) {
        console.log('1')
        await db.tbl_eluly_content.update({
          title: title,
          term: term,
          price: price,
          content: content,
          files: filename,
          filesOriginalName: fileOriginalName,
          contentImg: editReply
        }, {
          where: {
            id: ctx.params.id
          }
        });

        await delAsync('editFile' + payload.userId);

      } else {
        console.log('2')
        await db.tbl_eluly_content.update({
          title: title,
          term: term,
          price: price,
          content: content,
          files: filename,
          filesOriginalName: fileOriginalName
        }, {
          where: {
            id: ctx.params.id
          }
        });
      };

    } else {
      
      // let fileOriginalName = [];

      ctx.files.map(f => {
        filename = filename.replace(f.originalname, f.filename)
        // console.log(filename)
      });

      let fn = filename.split(',');

      fn.map(fn => {
        fileOriginalName.push(fn.substring(fn.indexOf('_') + 1))
      });

      if(editReply.length !== 0) {
        console.log('3')
        await db.tbl_eluly_content.update({
          title: title,
          term: term,
          price: price,
          content: content,
          files: fn,
          filesOriginalName: fileOriginalName,
          contentImg: editReply
        }, {
          where: {
            id: ctx.params.id
          }
        });
        await delAsync('editFile' + payload.userId);
      } else {
        console.log('4')
        await db.tbl_eluly_content.update({
          title: title,
          term: term,
          price: price,
          content: content,
          files: fn,
          filesOriginalName: fileOriginalName
        }, {
          where: {
            id: ctx.params.id
          }
        });
      };
    };

    ctx.status = 200;

    return ctx.redirect('/api/customerContent/' + ctx.params.id);

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const fileView = async ctx => {
  try {
    const content = await db.tbl_eluly_content.findOne({where:{id: ctx.params.id }});
    const files = content.files;
    let result = [];
    for(let i = 0; i < files.length; i++) {
      const { size } = fs.statSync('/Users/park-yongsoon/Documents/eluly/backend/src/public/uploads/contentFile/' + files[i]);
      result.push({name: files[i], size: size});
    };

    ctx.status = 200;

    return ctx.body = result;

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const contentImgEdit = async ctx => {
  try {
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    const fileName = ctx.files;
    const currentFile = ctx.request.body.filename;
    // console.log(currentFile)
    let url = [];
    
    for(let i in fileName) {
      url.push("/uploads/contentImg/" + fileName[i].filename);
      await zaddAsync('editFile' + payload.userId, 10, fileName[i].filename);
    };

    for(let i in currentFile) {
      await zaddAsync('editFile' + payload.userId, 10, currentFile[i]);
    }
    
    // console.log(url)

    ctx.status = 200;

    return ctx.body = url;
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const fileDel = async ctx => {
  try {
    const { filename } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);

    const result = await zaddAsync('delFile' + payload.userId, 20, filename);

    ctx.status = 200;

    return ctx.body = result;
    
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const delContentImg = async ctx => {
  try {
    const { filename } = ctx.request.body;
    const token = ctx.cookies.get('token');
    const payload = jwt.verify(token, JWT_SECRET);
    
    await zaddAsync('delContentImg' + payload.userId, 30, filename);

    ctx.status = 200;
  } catch (e) {
    ctx.throw(500, e);
  };
};