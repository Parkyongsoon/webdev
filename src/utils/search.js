import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export const elasticSearch = async (ctx, index, fields, renderPage, pageUrl) => {
  try {
    let pageNum = parseInt(ctx.query.page);
    if (!pageNum || undefined) {
      pageNum = 1;
    };

    let offset = 0;
    const limit = 10;

    if(pageNum > 1) {
      offset = 10 * (pageNum - 1);
    };

    
    await client.indices.refresh({ 
      index: index
    });
    
    const { body } = await client.search({
      index: index,
      from: offset,
      size: limit, 
      body: {
        query: {
          query_string: {
            query: ctx.query.search,
            fields: fields
          }
        },
        sort: [
          {
            id: 'desc'
          }
        ]
      }
    });

    console.log(body.hits.hits);
    
    const total = body.hits.total;
    
    const pageSize = 10;
    const pageStart = Math.floor((pageNum - 1) / pageSize) * pageSize + 1;
    
    let pageEnd = (pageStart + pageSize) - 1; 

    const pageTotal = Math.ceil(total / limit);

    if (pageEnd > pageTotal) {
      pageEnd = pageTotal;
    };

    ctx.status = 200;

    await ctx.render(renderPage, {
      pageNum,
      pageSize,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl,
      searchType: ctx.query.searchType,
      hits: body.hits.hits
    });

    // const result = {
    //   pageNum: pageNum,
    //   pageSize: pageSize,
    //   pageStart: pageStart,
    //   pageEnd: pageEnd,
    //   pageTotal:pageTotal,
    //   pageUrl: pageUrl,
    //   searchType: ctx.query.searchType,
    //   hits: body.hits.hits
    // }

    // return ctx.body = result
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const myPageSearch = async (ctx, index, fields1, fields2, renderPage, pageUrl) => {
  try {
    let pageNum = parseInt(ctx.query.page);
    if (!pageNum || undefined) {
      pageNum = 1;
    };

    let offset = 0;
    const limit = 10;

    if(pageNum > 1) {
      offset = 10 * (pageNum - 1);
    };

    
    await client.indices.refresh({ 
      index: index
    });
    
    const { body } = await client.search({
      index: index,
      from: offset,
      size: limit, 
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                    query: ctx.query.search,
                    analyze_wildcard: true,
                    fields: fields1
                }
              },
              {
                query_string: {
                    query: ctx.params.id,
                    analyze_wildcard: true,
                    fields: fields2
                }
              }
            ]
          }
        },
        sort: [
          {
            id: 'desc'
          }
        ]
      }
    });

    console.log(body.hits.hits);
    
    const total = body.hits.total;
    
    const pageSize = 10;
    const pageStart = Math.floor((pageNum - 1) / pageSize) * pageSize + 1;
    
    let pageEnd = (pageStart + pageSize) - 1; 

    const pageTotal = Math.ceil(total / limit);

    if (pageEnd > pageTotal) {
      pageEnd = pageTotal;
    };

    ctx.status = 200;

    await ctx.render(renderPage, {
      pageNum,
      pageSize,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl,
      searchType: ctx.query.searchType,
      hits: body.hits.hits
    });

    // const result = {
    //   pageNum: pageNum,
    //   pageSize: pageSize,
    //   pageStart: pageStart,
    //   pageEnd: pageEnd,
    //   pageTotal:pageTotal,
    //   pageUrl: pageUrl,
    //   searchType: ctx.query.searchType,
    //   hits: body.hits.hits
    // }

    // return ctx.body = result
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};

export const designerSearch = async (ctx, index, fields1, fields2, renderPage, pageUrl) => {
  try {
    console.log(ctx.query)
    let pageNum = parseInt(ctx.query.page);
    if (!pageNum || undefined) {
      pageNum = 1;
    };

    let offset = 0;
    const limit = 10;

    if(pageNum > 1) {
      offset = 10 * (pageNum - 1);
    };

    
    await client.indices.refresh({ 
      index: index
    });
    
    const { body } = await client.search({
      index: index,
      from: offset,
      size: limit, 
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                    query: ctx.query.search,
                    analyze_wildcard: true,
                    fields: fields1
                }
              },
              {
                query_string: {
                    query: ctx.query.role,
                    analyze_wildcard: true,
                    fields: fields2
                }
              }
            ]
          }
        },
        sort: [
          {
            id: 'desc'
          }
        ]
      }
    });

    console.log(body.hits.hits);
    
    const total = body.hits.total;
    
    const pageSize = 10;
    const pageStart = Math.floor((pageNum - 1) / pageSize) * pageSize + 1;
    
    let pageEnd = (pageStart + pageSize) - 1; 

    const pageTotal = Math.ceil(total / limit);

    if (pageEnd > pageTotal) {
      pageEnd = pageTotal;
    };

    ctx.status = 200;

    await ctx.render(renderPage, {
      pageNum,
      pageSize,
      pageStart,
      pageEnd,
      pageTotal,
      pageUrl,
      searchType: ctx.query.searchType,
      hits: body.hits.hits
    });

    // const result = {
    //   pageNum: pageNum,
    //   pageSize: pageSize,
    //   pageStart: pageStart,
    //   pageEnd: pageEnd,
    //   pageTotal:pageTotal,
    //   pageUrl: pageUrl,
    //   searchType: ctx.query.searchType,
    //   hits: body.hits.hits
    // }

    // return ctx.body = result
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};