웹 개발 실습
=========

  ##### 공부한 내용을 토대로 하나씩 만들어보는 공간.

사용기술
======
  
  * Node.JS 14.4.0
  * Koa 2.13.0
  * Postgresql 13.1
  * Redis 3.0.2

실행
===

  * 설치   
    yarn
  
  * 실행   
    yarn start:dev

구조
===

∙   
|__ src   
|  |__ api   
|  |  |_ admin     // 각 폴더 index.js = router / *.ctrl.js = controller   
|  |  |_ designer  // 각 폴더 index.js = router / *.ctrl.js = controller   
|  |  |_ user      // 각 폴더 index.js = router / *.ctrl.js = controller   
|  |  |_ index.js  // 각 폴더 router 집합   
|  |    
|  |__ config      // Postgresql 연결 설정   
|  |    
|  |__ models   
|  |  |_ admin     // admin용 model   
|  |  |_ home      // 범용 model   
|  |  |_ index.js  // sequelize 설정   
|  |    
|  |__ public   
|  |  |_ css        // css 폴더   
|  |  |_ fonts      // font 폴더   
|  |  |_ img        // img 폴더   
|  |  |_ js         // js 폴더   
|  |  |_ uploads    // file upload 폴더   
|  |    
|  |__ utils        // 기타 기능 모듈   
|  |    
|  |__ views        // ejs template   
|  |  |_ admin   
|  |  |_ designer   
|  |  |_ user   
|  |  |_ index.html   
|  |    
|  |__ index.js     // esm 설정   
|  |    
|  |__ server.js    // server   
|   
|__ .env   
|   
|__ package-lock.json   
|   
|__ package.json   
|   
|__ Readme.md   
|   
|__ yarn.lock   