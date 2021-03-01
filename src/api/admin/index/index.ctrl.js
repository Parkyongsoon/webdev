export const index = async ctx => {
  try {
    const remember = ctx.cookies.get('username');
    ctx.status = 200;
    await ctx.render('admin/index', {
      remember,
      errorMsg: ''
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const main = async ctx => {
  try {
    ctx.status = 200;
    await ctx.render('admin/main');
  } catch (e) {
    ctx.throw(500, e);
  }
};