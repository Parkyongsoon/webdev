import * as faker from 'faker';

import { db } from '../../../models';

export const index = async ctx => {
  try {
    // const result = {
    //   hits: '',
    //   popup: popup
    // }
    
    // ctx.status = 200;

    // return ctx.body = result
    const popup = await db.tbl_eluly_popup.findAll({});

    ctx.status = 200;

    await ctx.render('user/index', {
      popup,
      hits:''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const generate_fake = async ctx => {
  try {
    faker.locale = 'ko';
    for(let i = 0; i < ctx.request.body.amount; i++) {
      await db.tbl_eluly_board.create({
        id: i + 1,
        title: faker.random.word(),
        name: faker.name.findName(),
        content: faker.lorem.text(),
      });
    };

    return ctx.redirect('/');
  } catch (e) {
    console.log(e);
  };
};