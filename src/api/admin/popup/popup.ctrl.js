import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';
import { fileName, fileOriginalName } from '../../../utils/fileUpload';
import { fileUnlink } from '../../../utils/fileUnlink';
import { ENOENT } from 'constants';

const { JWT_SECRET } = process.env

/**
 * adminPopupIndex
 */

export const index = async ctx => {
  try {

    return paging(
      ctx,       
      db.tbl_eluly_popup,
      {},
      'admin/popup/index',
      'admin/api/popup?page='
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
          'popup',
          ['title'],
          'admin/popup/index',
          'admin/api/popup/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'name':
        console.log('name')
        return elasticSearch(
          ctx,
          'popup',
          ['name'],
          'admin/popup/index',
          'admin/api/popup/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
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
 * adminPopupAdd
 */

export const addIndex = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('admin/popup/add');
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const add = async ctx => {
  try {
   const { title, width, height, comment } = ctx.request.body;
   console.log(ctx.request.body)
   const token = ctx.cookies.get('token');
   const payload = jwt.verify(token, JWT_SECRET);

   await db.tbl_eluly_popup.create({
     title,
     width,
     height,
     comment,
     name: payload.userName,
     files: fileName(ctx.files),
     filesOriginalName: fileOriginalName(ctx.files),
     tblElulyAdminId: payload.userId
   });

   return ctx.status = 200;

  } catch (e) {
    ctx.throw(500, e);
  };
};


/**
 * adminPopupView
 */

export const view = async ctx => {
  try {

    const view = await db.tbl_eluly_popup.findOne({
      where: { id: ctx.params.id }
    });

    ctx.status = 200;

    await ctx.render('admin/popup/view', { 
      view
    }); 
  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * adminPopupEdit
 */

export const editIndex = async ctx => {
  try {
    const editView = await db.tbl_eluly_popup.findOne({where: {id: ctx.params.id}});

    ctx.status = 200;

    await ctx.render('admin/popup/edit', {
      editView
    });

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const fileView = async ctx => {
  try {
    const popup = await db.tbl_eluly_popup.findOne({where:{id: ctx.params.id }});
    const files = popup.files;
    let result = [];
    for(let i = 0; i < files.length; i++) {
      const { size } = fs.statSync('/Users/park-yongsoon/Documents/eluly/backend/src/public/uploads/popupFile/' + files[i]);
      result.push({name: files[i], size: size});
    };

    ctx.status = 200;

    return ctx.body = result;
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const edit = async ctx => {
  try {
    const { title, width, height, comment } = ctx.request.body;
    let filename = ctx.request.body.filename;
    console.log(filename)
    const popup = await db.tbl_eluly_popup.findOne({where:{id: ctx.params.id }});
    if(ctx.files === undefined) {
      console.log('1')
      console.log(filename)
      await db.tbl_eluly_popup.update({
        title: title,
        width: width,
        height: height,
        comment: comment,
        files: filename
      }, {
        where: {
          id: ctx.params.id
        }
      });
    } else {
      console.log('2')
      ctx.files.map( f => {
        filename = filename.replace(f.originalname, f.filename)
      });

      await db.tbl_eluly_popup.update({
        title: title,
        width: width,
        height: height,
        comment: comment,
        files: filename.split(',')
      }, {
        where: {
          id: ctx.params.id
        }
      });
    }

    ctx.status = 200;

    return ctx.redirect('/admin/api/popup/' + ctx.params.id);

  } catch (e) {
    ctx.throw(500, e);
  };
};

/**
 * adminPopupDelete
 */

export const remove = async ctx => {
  try {
    const filePath = '/Users/park-yongsoon/Documents/eluly/backend/src/public/uploads';
    const popup = await db.tbl_eluly_popup.findOne({ where: {id: ctx.params.id}});
    const popupFile = popup.files;

    fileUnlink(popupFile.length, filePath, '/popupFile/', popupFile);
    db.tbl_eluly_popup.destroy({ where: { id: ctx.params.id}, force: true});

    ctx.status = 200;

    return ctx.redirect('/admin/api/popup');
  } catch (e) {
    ctx.throw(500, e);
  }
}