import dotenv from 'dotenv';

dotenv.config();

import { db } from '../../../models';

const { JWT_SECRET } = process.env

/**
 * progressCtrl
 */

export const index = async ctx => {
  try {
    const progress = await db.tbl_eluly_content.findAll({});

    let choice = null;

    progress.map(p => {
      choice += p.choice;
    });

    const choiceDesigner = await db.tbl_eluly_users.findOne({ where: {id: choice}});

    ctx.status = 200;

    await ctx.render('admin/progress/index', {
      progress,
      choiceDesigner,
      hits: '',
      searchType:''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};