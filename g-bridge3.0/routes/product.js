const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const  router = express.Router();

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'bmlee',            // DB접속 아이디
    password: 'bmlee654321',  // DB암호
    database: 'bridge'         //사용할 DB명
});

//  -----------------------------------  상품리스트 기능 -----------------------------------------

// 구매하기 버튼 기능


// 등록된 상품리스트를 브라우져로 출력합니다.
const PrintCategoryProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;
  const  query = url.parse(req.url, true).query;
       console.log('상품카테고리 조회 ' + query.category);

       if (req.session.auth)   {   // (로그인된 경우에만) 상품리스트를 출력합니다

           switch (query.category) {
               case 'fan' : search_cat = "선풍기"; break;
               case 'aircon': search_cat = "에어컨"; break;
               case 'aircool': search_cat = "냉풍기"; break;
               case 'fridge': search_cat = "냉장고"; break;
               case 'minisun': search_cat = "미니선풍기"; break;
               default: search_cat = "선풍기"; break;
           }

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT maker, pname, modelnum, rdate, price, pic, exp from u10_products where category='" + search_cat + "' order by rdate desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       'category': search_cat,
                                                        prodata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'상품검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};

// ------------ 상품 구매하기 기능 -------------
const BuyProduct = (req, res) => {
  let body = req.body;
  console.log(body.amount, body.price, body.pname);
  let totalPrice = body.amount * body.price;

  // 유저 데이터베이스에서 유저 네임에 해당하는 부분을 찾아 포인트를 차감한다.
  // 이때 포인트가 부족하면 구매 처리가 되지 않도록 디비 스키마를 수정하였습니다.
  let user_query = `UPDATE u10_users SET point = point - ${totalPrice} WHERE name='${req.session.who}'`;
  console.log("SQL: " , user_query);
  db.query(user_query, (error, results, fields) => {
     if (error) {
       console.log(error);
       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
       res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                          'warn_title':'구매 처리 오류',
                          'warn_message':'포인트가 부족합니다.',
                          'return_url':'/' }));
     } else {
      console.log(`${req.session.who}님의 ${body.amount * body.price} 포인트가 차감되었습니다.`);
     }
  });

  // 데이터베이스에서 pname이 일치하는 항목을 찾은 뒤 상품 개수를 감소시키고 매출총액을 그만큼 늘린다.
  // 이때 재고가 부족하면 구매 처리가 되지 않도록 디비 스키마를 수정하였습니다.
  let product_query = `UPDATE u10_products SET amount = amount - ${body.amount}, sales = sales + ${totalPrice} WHERE pname='${body.pname}'`;
  console.log("SQL: " , product_query);
  db.query(product_query, (error, results, fields) => {
    if (error) {
      console.log(error);
      htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
      res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                         'warn_title':'구매 처리 오류',
                         'warn_message':'재고가 부족합니다.',
                         'return_url':'/' }));
    } else {
     console.log(`${body.pname} 상품의 개수가 ${body.amount} 만큼 감소하였습니다.`);
     htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
     res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                        'warn_title':'상품 구매 처리 완료',
                        'warn_message':'상품 구매 신청이 완료되었습니다. 버튼을 누르면 돌아갑니다.',
                        'return_url':'/' }));
    }
  });


};


// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list', PrintCategoryProd);      // 상품리스트를 화면에 출력
router.post('/buy', BuyProduct);      // 상품 구매 처리


module.exports = router;
