import axios from 'axios';

import { db } from '../../../models';

/**
 * paymentIndexCtrl
 */

 export const index = async ctx => {
   try {
     const payment = await db.tbl_eluly_payment.findOne({where: { tblElulyUserId: ctx.params.id}, include: [db.tbl_eluly_users]});

     if(!payment) {
       ctx.status = 500;
       return ctx.redirect('/');
     }

     ctx.status = 200;

     await ctx.render('user/customerPayment/index', {
       payment
     });
   } catch (e) {
     ctx.throw(500, e);
   };
 };

 export const paymentComplete = async ctx => {
   try {
     const { impUid, merchantUid, title, price, name, phone, cardName, payMethod } = ctx.request.body;
    // 액세스 토큰(access token) 발급 받기
    await db.tbl_eluly_payment.update({
      impUid: impUid,
      merchantUid: merchantUid,
      title: title,
      price: price,
      name: name,
      phone: phone,
      cardName: cardName,
      payMethod: payMethod
    }, {
      where: {
        tblElulyUserId: ctx.params.id
      }
    });

    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: "7117648523459069", // REST API키
        imp_secret: "BjVJrrubAETh5HQl4iV0lAUuiuhz1sjCMeldGQphvjyA0oW5HR52s0wKuOkwhD83SuhylGPQ0nq1Mn6t" // REST API Secret
      }
    });
    
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
    });
    
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    
    const order = await db.tbl_eluly_payment.findOne({where:{merchantUid: paymentData.merchant_uid}});

    const amountToBePaid = parseInt(order.price); // 결제 되어야 하는 금액
     // 결제 검증하기
     const { amount, apply_num, card_code, card_name, currency, status } = paymentData;
     if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
       await db.tbl_eluly_payment.update({
         price: amount.toString(),
         applyNum: apply_num,
         cardCode: card_code,
         cardName: card_name,
         currency: currency,
         status: status,
         payment: true
        }, {
          where: { 
            merchantUid: paymentData.merchant_uid
          }
        }); // DB에 결제 정보 저장
       switch (status) {
        //  case "ready": // 가상계좌 발급
        //    // DB에 가상계좌 발급 정보 저장
        //    const { vbank_num, vbank_date, vbank_name } = paymentData;
        //    await db.tbl_eluly_users.update("/* 고객 id */", { $set: { vbank_num, vbank_date, vbank_name }});
        //    // 가상계좌 발급 안내 문자메시지 발송
        //    SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num}, ${vbank_date}, ${vbank_name}`});
        //    ctx.body = ({ status: "vbankIssued", message: "가상계좌 발급 성공" });
        //    break;
         case "paid": // 결제 완료
           ctx.body = ({ status: "success", message: "일반 결제 성공" });
           break;
       }
     } else { // 결제 금액 불일치. 위/변조 된 결제
       throw { status: "forgery", message: "위조된 결제시도" };
     }
  } catch (e) {
    console.log(e)
    ctx.throw(400, e);
  };
};