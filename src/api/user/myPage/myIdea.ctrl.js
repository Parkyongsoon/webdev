import { db } from '../../../models';

/**
 * myPageMyIdeaCtrl
 */

export const myIdeaPending = async ctx => {
  try {

    const myIdea = await db.tbl_eluly_content.findAll({ where: {tblElulyUserId: ctx.params.id, action: false}});

    ctx.status = 200;
    await ctx.render('user/myPage/myIdea/pending', {
      myIdea,
      hits: '',
      searchType: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myIdeaPendingView = async ctx => {
  try {

    const myIdeaView = await db.tbl_eluly_content.findOne({ where: {id: ctx.params.myIdeaId, tblElulyUserId: ctx.params.id}});

    let list = [];

    if(myIdeaView.apply !== null) {

      let apply = myIdeaView.apply;

      for(let i = 0; i < apply.length; i++) {

        let designer = await db.tbl_eluly_users.findOne({ where: {id: apply[i] }});
  
        list.push(designer.dataValues);

      }
    }

    ctx.status = 200; 
    await ctx.render('user/myPage/myIdea/view', {
      myIdeaView,
      list
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const Choice = async ctx => {
  try {
    const { title, name, term, price, designerName, action, paymentProgress } = ctx.request.body;

      await db.tbl_eluly_payment.create({
        title,
        name,
        term,
        price,
        designerName,
        action,
        tblElulyUserId: ctx.params.id
      });
  
      await db.tbl_eluly_content.update({
        action: true,
        choice: ctx.params.designerId
      }, {
        where: {
          id: ctx.params.myIdeaId
        }
      });

      return ctx.status = 200;

  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myIdeaConfirm = async ctx => {
  try {

    const myIdea = await db.tbl_eluly_content.findAll({ where: {tblElulyUserId: ctx.params.id, action: true}});
    
    let choice = null;
    myIdea.map(mi => {
      choice += mi.choice;
    });

    const choiceDesigner = await db.tbl_eluly_users.findOne({ where: {id: choice}});

    ctx.status = 200;

    await ctx.render('user/myPage/myIdea/confirm', {
      myIdea,
      choiceDesigner,
      hits: '',
      searchType: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const Cancel = async ctx => {
  try {

    await db.tbl_eluly_content.update({
      action: false,
      choice: null
    }, {
      where: {
        id: ctx.params.myIdeaId
      }
    });

    ctx.status = 200;
    return ctx.redirect('/api/myPage/myIdea/confirm/' + ctx.params.id);
  } catch (e) {
    ctx.throw(500, e);
  };
};