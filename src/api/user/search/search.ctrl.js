import { elasticSearch } from '../../../utils/search';

export const search = async ctx => {
  try {
    return elasticSearch(
      ctx,
      ['user', 'board', 'content', 'qna'],
      ['title', 'content', 'name', 'major'],
      'user/index',
      'api/search?search=' + ctx.query.search + '&page=',
    );
  } catch (e) {
    console.log(e)
    ctx.throw(500, e);
  };
};