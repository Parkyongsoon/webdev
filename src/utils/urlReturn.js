export const urlReturn = async (ctx, next) => {
  try {
    const url = ctx.request.headers['referer'];
    console.log(url)
    if(url === undefined) {
      return ctx.body = '<script>' +
                          'alert("정상적으로 들어와라!");'+
                          'window.location.href = "http://localhost:3000/"'+
                        '</script>'
    } else {
      await next();
    };
  } catch (e) {
    ctx.throw(500, e);
  };
};