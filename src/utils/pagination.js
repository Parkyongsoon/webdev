export const paging = async (ctx, tableName, column, renderPage, pageUrl) => {
  try {
    let pageNum = parseInt(ctx.query.page) || 1;

    const perPage = 10;

    let offset = ((perPage * pageNum) - perPage);
    
    const pageStart = Math.floor((pageNum - 1) / perPage) * perPage + 1;

    let pageEnd = (pageStart + perPage) - 1;
    
    const total = await tableName.count({});

    const list = await tableName.findAll({
      limit: perPage,
      offset: offset,
      order: [['id', 'DESC']],
      where: column
    });

    const pageTotal = Math.ceil(total / perPage);

    if (pageEnd > pageTotal) {
      pageEnd = pageTotal;
    };

    // const result = {
    //   list: list,
    //   pageNum: pageNum,
    //   perPage: perPage,
    //   pageStart: pageStart,
    //   pageEnd: pageEnd,
    //   pageTotal: pageTotal,
    //   pageUrl: pageUrl,
    //   hits: '',
    //   searchType:'',
    // };

    
    // return ctx.body = result;
    
    ctx.status = 200;
    
    await ctx.render(renderPage, {
      list,
      pageNum,
      perPage,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl,
      hits: '',
      searchType:'',
    });
  } catch (e) {
    console.log(e);
    ctx.throw(500, e);
  }
}