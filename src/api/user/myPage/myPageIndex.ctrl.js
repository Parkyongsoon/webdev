/**
 * myPageIndexCtrl
 */

export const myPageIndex = async ctx => {
  try {
    ctx.status = 200; 
    await ctx.render('user/myPage/index');
  } catch (e) {
    ctx.throw(500, e);
  };
};