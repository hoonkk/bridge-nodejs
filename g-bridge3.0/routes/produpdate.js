
const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'bmlee',            // DB접속 아이디
    password: 'bmlee654321',  // DB암호
    database: 'bridge'         //사용할 DB명
});

//  -----------------------------------  상품수정 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const PrintUpdateForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/update_form.ejs','utf8'); // 괸리자메인화면

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'구매자조회기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 구매자조회 권한이 없습니다.',
                            'return_url':'/' }));
       }

};


// REST API의 URI와 핸들러를 매핑합니다.
router.get('/', PrintUpdateForm);      // 상품리스트를 화면에 출력

// const HanldleAddProduct = (req, res) => {  // 상품등록
//   let    body = req.body;
//   let    htmlstream = '';
//   let    datestr, y, m, d, regdate;
//   let    prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
//   let    picfile = req.file;
//   let    result = { originalName  : picfile.originalname,
//                    size : picfile.size     }
//
//        console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).
//
//        if (req.session.auth && req.session.admin) {
//            if (body.itemid == '' || datestr == '') {
//              console.log("상품번호가 입력되지 않아 DB에 저장할 수 없습니다.");
//              res.status(561).end('<meta charset="utf-8">상품번호가 입력되지 않아 등록할 수 없습니다');
//           }
//           else {
//
//               prodimage = prodimage + picfile.filename;
//               regdate = new Date();
//               db.query('INSERT INTO u10_products (itemid, category, maker, pname, modelnum,rdate,price,dcrate,amount,event,pic,exp, sales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, 0)',
//                     [body.itemid, body.category, body.maker, body.pname, body.modelnum, regdate,
//                      body.price, body.dcrate, body.amount, body.event, prodimage, body.exp], (error, results, fields) => {
//                if (error) {
//                    console.log(error);
//                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
//                                  'warn_title':'상품등록 오류',
//                                  'warn_message':'상품으로 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
//                                  'return_url':'/' }));
//                 } else {
//                    console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
//                    res.redirect('/adminprod/list');
//                 }
//            });
//        }
//       }
//      else {
//          htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//          res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
//                             'warn_title':'상품등록기능 오류',
//                             'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
//                             'return_url':'/' }));
//        }
// };



module.exports = router;
