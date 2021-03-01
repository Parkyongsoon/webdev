import Sequelize from 'sequelize';

import { db_connect } from '../config/postgresqlConfig';
import { tbl_eluly_admin } from './admin/tbl_eluly_admin'
import { tbl_eluly_users } from './home/tbl_eluly_users';
import { tbl_eluly_notice } from './home/tbl_eluly_notice';
import { tbl_eluly_board } from './home/tbl_eluly_board';
import { tbl_eluly_boardComment } from './home/tbl_eluly_boardComment';
import { tbl_eluly_content } from './home/tbl_eluly_content';
import { tbl_eluly_payment } from './home/tbl_eluly_payment';
import { tbl_eluly_qna } from './home/tbl_eluly_qna';
import { tbl_eluly_qnaComment } from './home/tbl_eluly_qnaComment';
import { tbl_eluly_popup } from './home/tbl_eluly_popup';


/**
 * connection sequelize & db
 */

export const sequelize = new Sequelize(
  db_connect.development.database,
  db_connect.development.username,
  db_connect.development.password,
  db_connect.development
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  };
})();

export const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Table generation
 */
db.tbl_eluly_admin = tbl_eluly_admin(sequelize, Sequelize);
db.tbl_eluly_users = tbl_eluly_users(sequelize, Sequelize);
db.tbl_eluly_notice = tbl_eluly_notice(sequelize, Sequelize);
db.tbl_eluly_board = tbl_eluly_board(sequelize, Sequelize);
db.tbl_eluly_boardComment = tbl_eluly_boardComment(sequelize, Sequelize);
db.tbl_eluly_content = tbl_eluly_content(sequelize, Sequelize);
db.tbl_eluly_payment = tbl_eluly_payment(sequelize, Sequelize);
db.tbl_eluly_qna = tbl_eluly_qna(sequelize, Sequelize);
db.tbl_eluly_qnaComment = tbl_eluly_qnaComment(sequelize, Sequelize);
db.tbl_eluly_popup = tbl_eluly_popup(sequelize, Sequelize);
// db.Admin = require('./admin/auth')(sequelize, Sequelize);
// db.Comment = require('./home/comment')(sequelize, Sequelize);
// db.ClientBoard = require('./home/client-board')(sequelize, Sequelize);
// db.Payment = require('./home/payment')(sequelize, Sequelize);
// db.QnA = require('./home/QnA')(sequelize, Sequelize);
// db.QnAcomment = require('./home/QnAcomment')(sequelize, Sequelize);
// db.Payment = require('./home/payment')(sequelize, Sequelize);

db.tbl_eluly_admin.hasMany(db.tbl_eluly_notice);
db.tbl_eluly_notice.belongsTo(db.tbl_eluly_admin);

db.tbl_eluly_admin.hasMany(db.tbl_eluly_popup);
db.tbl_eluly_popup.belongsTo(db.tbl_eluly_admin);

db.tbl_eluly_users.hasMany(db.tbl_eluly_board);
db.tbl_eluly_board.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_users.hasMany(db.tbl_eluly_boardComment);
db.tbl_eluly_boardComment.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_board.hasMany(db.tbl_eluly_boardComment);
db.tbl_eluly_boardComment.belongsTo(db.tbl_eluly_board);

db.tbl_eluly_users.hasMany(db.tbl_eluly_content);
db.tbl_eluly_content.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_users.hasMany(db.tbl_eluly_payment);
db.tbl_eluly_payment.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_users.hasMany(db.tbl_eluly_qna);
db.tbl_eluly_qna.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_admin.hasMany(db.tbl_eluly_qnaComment);
db.tbl_eluly_qnaComment.belongsTo(db.tbl_eluly_admin);

// db.tbl_eluly_users.hasMany(db.tbl_eluly_qnaComment);
// db.tbl_eluly_qnaComment.belongsTo(db.tbl_eluly_users);

db.tbl_eluly_qna.hasMany(db.tbl_eluly_qnaComment);
db.tbl_eluly_qnaComment.belongsTo(db.tbl_eluly_qna);

// db.Admin.hasMany(db.QnAcomment);
// db.QnAcomment.belongsTo(db.Admin);

// db.Order.hasMany(db.DetailOrder);
// db.DetailOrder.belongsTo(db.Order);

// db.User.hasMany(db.Comment);
// db.Comment.belongsTo(db.User);

// db.Auth.hasMany(db.Board);
// db.Board.belongsTo(db.Auth);

// db.User.hasMany(db.QnAcomment);
// db.QnAcomment.belongsTo(db.User);

// db.QnA.hasMany(db.QnAcomment);
// db.QnAcomment.belongsTo(db.QnA);