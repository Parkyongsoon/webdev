export const isLoggedIn = async (ctx, next) => {
  try {
    if(ctx.state.isAuthenticate) {
      await next();
    } else {
      return ctx.body = '<script>' +
                   'alert("로그인이 필요합니다");' +
                   'window.location.href = "http://localhost:3000/api/auth/login"' +
                 '</script>'
      // return ctx.redirect('/api/auth/login');
    }
  } catch (e) {
    ctx.throw(500, e);
  }
}