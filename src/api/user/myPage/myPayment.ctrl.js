import { db } from '../../../models';

/**
 * myPageMyPaymentCtrl
 */

export const myPaymentPending = async ctx => {
  try {

    const myPayment = await db.tbl_eluly_payment.findAll({where: { tblElulyUserId: ctx.params.id }});

    ctx.status = 200;
    await ctx.render('user/myPage/myPayment/pending', {
      myPayment,
      hits:'',
      searchType:''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const myPaymentConfirm = async ctx => {
  try {

    const myPayment = await db.tbl_eluly_payment.findAll({where: { tblElulyUserId: ctx.params.id, payment: true }});

    ctx.status = 200;
    await ctx.render('user/myPage/myPayment/confirm', {
      myPayment,
      hits:'',
      searchType:''
    });
  } catch (e) {
    ctx.throw(500, e);
  };
};