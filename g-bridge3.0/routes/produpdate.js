const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const upload = multer({dest: __dirname + '/../public/images/uploads/products'});  // 업로드 디렉터리를 설정한다.
const   router = express.Router();
const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'bmlee',            // DB접속 아이디
    password: 'bmlee654321',  // DB암호
    database: 'bridge'         //사용할 DB명
});

// ------------------------------------ 상품 수정 기능 ------------------------------------
const PrintUpdateForm = (req, res) => {
  let    htmlstream = '';
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/update_form.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who,
                                             'itemid': query.itemid}));
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'구매자조회기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 구매자조회 권한이 없습니다.',
                            'return_url':'/' }));
       }

};

router.get('/update', PrintUpdateForm);      // 상품리스트를 화면에 출력


// ---------------------------- 상품 수정 페이지에서 받아온 데이터를 db에 적용하기 ------------------
const HandleUpdateProduct = (req, res) => {  // 상품등록
  let    body = req.body;
  let    htmlstream = '';
  let    datestr, y, m, d, regdate;
  let    prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
  let    picfile = req.file;
  let    result = { originalName  : picfile.originalname,
                   size : picfile.size     }


       if (req.session.auth && req.session.admin) {
           if (body.itemid == '' || datestr == '') {
             console.log("상품번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">상품번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {

              prodimage = prodimage + picfile.filename;
              regdate = new Date();


              // update 구문으로 itemid가 일치하는 상품의 디비에 update_form으로부터 입력받은 값을 반영한다.
              db.query('UPDATE u10_products SET itemid=?, category=?, maker=?, pname=?, modelnum=?, rdate=?, price=?, dcrate=?,amount=?,event=?,pic=?,exp=? where itemid=?',
                    [body.itemid, body.category, body.maker, body.pname, body.modelnum, regdate,
                     body.price, body.dcrate, body.amount, body.event, prodimage, body.exp, body.itemid], (error, results, fields) => {
               if (error) {
                   console.log(error);
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상품수정 오류',
                                 'warn_message':'상품 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   console.log("상품수정에 성공하였으며, DB에 성공적으로 반영되었습니다!.!");
                   res.redirect('/adminprod/list?page=1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상품등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
router.post('/clear', upload.single('photo'),HandleUpdateProduct);      // 상품리스트를 화면에 출력

// ---------------------------- 상품 삭제 기능 ------------------
const HandleDeleteProduct = (req, res) => {  // 상품 삭제
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  const itemid = query.itemid;

  db.query(`DELETE FROM u10_products where itemid='${itemid}'`, (error, results, fields) => {
   if (error) {
       console.log(error);
       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
       res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                     'warn_title':'상품수정 오류',
                     'warn_message':'상품 삭제할때 DB 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                     'return_url':'/' }));
    } else {
       console.log("상품삭제에 성공하였으며, DB에 성공적으로 반영되었습니다!.!");
       res.redirect('/adminprod/list?page=1');
    }
});

};
router.get('/delete', HandleDeleteProduct);      // 상품리스트를 화면에 출력

module.exports = router;
