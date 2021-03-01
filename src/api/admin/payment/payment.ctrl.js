import axios from 'axios';

import { db } from '../../../models';
import { paging } from '../../../utils/pagination';
import { elasticSearch } from '../../../utils/search';

/**
 * paymentCtrl
 */

export const index = async ctx => {
  try {
    return paging(
      ctx,       
      db.tbl_eluly_payment,
      {},
      'admin/payment/index',
      'admin/api/payment?page='
    );
  } catch (e) {
    ctx.throw(500, e);
  };
};

export const search = async ctx => {
  try {

    switch (ctx.query.searchType) {
      case 'title':
        return elasticSearch(
          ctx,
          'payment',
          ['title'],
          'admin/payment/index',
          'admin/api/payment/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      case 'name':
        return elasticSearch(
          ctx,
          'payment',
          ['name'],
          'admin/payment/index',
          'admin/api/payment/search?searchType='+ ctx.query.searchType +'&search=' + ctx.query.search + '&page=',
        );

      default:
        break;
    };
  } catch (e) {
    console.log(e)
  }
}

// 결제 취소
export const cancel = async ctx => {
  try {    
    /* 액세스 토큰(access token) 발급 */
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { 
        "Content-Type": "application/json" 
      },
      data: {
        imp_key: "7117648523459069", // [아임포트 관리자] REST API키
        imp_secret: "BjVJrrubAETh5HQl4iV0lAUuiuhz1sjCMeldGQphvjyA0oW5HR52s0wKuOkwhD83SuhylGPQ0nq1Mn6t" // [아임포트 관리자] REST API Secret
      }
    });    

    const { access_token } = getToken.data.response; // 엑세스 토큰

    /* 결제정보 조회 */

    const { merchant_uid, reason, cancel_request_amount } = ctx.request.body;

    const paymentInfo = await db.tbl_eluly_payment.findOne({ where: { merchantUid: merchant_uid }});

    const { impUid } = paymentInfo;

    const getCancelData = await axios ({
      url: "https://api.iamport.kr/payments/cancel",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        reason: reason, // 가맹점 클라이언트로부터 받은 환불사유
        imp_uid: impUid, // imp_uid를 환불 고유번호로 입력
        amount: cancel_request_amount
      }
    });

    const { response } = getCancelData.data; // 환불 결과

    /* 환불 결과 동기화 */

    // const { merchant_uid } = response; // 환불 결과에서 주문정보 추출

    const payment = await db.tbl_eluly_payment.update({ 
      payment: false 
    }, {
      where: { 
        merchantUid: response.merchant_uid
      }
    });

    ctx.body = payment; // 가맹점 클라이언트로 환불 결과 반환
  } catch (e) {
    console.log(e)
    ctx.throw(400, e);
  };
};