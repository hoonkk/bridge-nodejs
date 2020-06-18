const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   crypto = require('crypto');
const   router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'bmlee',            // DB접속 아이디
    password: 'bmlee654321',  // DB암호
    database: 'bridge'         //사용할 DB명
});

//  -----------------------------------  회원가입기능 -----------------------------------------
// 회원가입 입력양식을 브라우져로 출력합니다.
const PrintRegistrationForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/reg_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel':req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

// 회원가입 양식에서 입력된 회원정보를 신규등록(DB에 저장)합니다.
const HandleRegistration = (req, res) => {  // 회원가입
let body = req.body;
let htmlstream='';
let hashpwd= '';

    // 임시로 확인하기 위해 콘솔에 출력해봅니다.
    console.log('회원가입 입력정보 :%s, %s, %s',body.uid, body.pw1, body.uname);

    if (body.uid == '' || body.pw1 == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('<meta charset="utf-8">데이터가 입력되지 않아 가입을 할 수 없습니다');
    }
    else {
      // 3.0 version에서 point, phone 추가
      // crypto 모듈을 이용한 암호화 추가
      // 비밀번호를 hash로 암호화하게 되면서 데이터의 길이가 길어지면서 u10_users 테이블의 pass 컬럼의 스키마를 변경하였습니다.
      // varchar(64) ==> varchar(128)로 변경(비밀번호를 너무 길게 입력하면 data too long 에러가 발생할 수 있음)

       // 입력받은 비밀번호를 crypto 모듈을 이용하여 암호화한다.
       hashpwd = crypto.createHash('sha512').update(body.pw1).digest('base64');

       // 데이터베이스에는 암호화된 비밀번호가 저장된다.
       db.query('INSERT INTO u10_users (uid, pass, name, point, phone) VALUES (?, ?, ?, ?, ?)', [body.uid, hashpwd, body.uname, body.point, body.phone], (error, results, fields) => {
          if (error) {
            console.log(error);
            htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
            res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                               'warn_title':'회원가입 오류',
                               'warn_message':'이미 회원으로 등록되어 있습니다. 바로 로그인을 하시기 바랍니다.',
                               'return_url':'/' }));
          } else {
           console.log("회원가입에 성공하였으며, DB에 신규회원으로 등록하였습니다.!");
           res.redirect('/');
          }
       });

    }
};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/reg', PrintRegistrationForm);   // 회원가입화면을 출력처리
router.post('/reg', HandleRegistration);   // 회원가입내용을 DB에 등록처리
router.get('/', function(req, res) { res.send('respond with a resource 111'); });

// ------------------------------------  로그인기능 --------------------------------------

// 로그인 화면을 웹브라우져로 출력합니다.
const PrintLoginForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/login_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

// 로그인을 수행합니다. (사용자인증처리)
const HandleLogin = (req, res) => {
  let body = req.body;
  let userid, userpass, username;
  let sql_str;
  let htmlstream = '';
  let hashpwd = '';
      console.log('로그인 입력정보: %s, %s', body.uid, body.pass);
      if (body.uid == '' || body.pass == '') {
         console.log("아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.");
         res.status(562).end('<meta charset="utf-8">아이디나 암호가 입력되지 않아서 로그인할 수 없습니다.');
      }
      else {
       console.log("입력한 비밀번호" + body.pass + "를 암호화한 값으로 데이터베이스에서 검색합니다.");
       //로그인 폼에서 입력한 비밀번호를 암호화하여 hashpwd에 넣어준다.
       hashpwd = crypto.createHash('sha512').update(body.pass).digest('base64');
       //암호화된 값인 hasspwd로 디비에서 검색한다.
       sql_str = "SELECT uid, pass, name from u10_users where uid ='"+ body.uid +"' and pass='" + hashpwd + "';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("Login Fail as No id in DB!"); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)
                  htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'로그인 오류',
                                     'warn_message':'등록된 계정이나 암호가 틀립니다.',
                                     'return_url':'/' }));
             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  userid = item.uid;
                  userpass = item.pass;
                  username = item.name;
                  console.log("DB에서 로그인성공한 ID/암호:%s/%s", userid, userpass);
                  if (body.uid == userid && hashpwd == userpass) { // 암호화한 값과 디비에 저장되있는 암호화된 비밀번호 값을 비교하여 판별한다.
                     req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                     req.session.who = username; // 인증된 사용자명 확보 (로그인후 이름출력용)
                     if (body.uid == 'admin')    // 만약, 인증된 사용자가 관리자(admin)라면 이를 표시
                          req.session.admin = true;
                     res.redirect('/');
                  }
                }); /* foreach */
              } // else
            }  // else
       });
   }
}


// REST API의 URI와 핸들러를 매핑합니다.
//  URI: http://xxxx/users/auth
router.get('/auth', PrintLoginForm);   // 로그인 입력화면을 출력
router.post('/auth', HandleLogin);     // 로그인 정보로 인증처리

// ------------------------------  로그아웃기능 --------------------------------------

const HandleLogout = (req, res) => {
       req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결
       res.redirect('/');         // 로그아웃후 메인화면으로 재접속
}

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/logout', HandleLogout);       // 로그아웃 기능


// --------------- 정보변경 기능을 개발합니다 --------------------
// 3.0 version에서 추가로 개발된 부분
const PrintProfile = (req, res) => {
  let    htmlstream = '';
       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/profile.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
       res.end(ejs.render(htmlstream,  { 'title' : '회원정보',
                                         'logurl': '/users/logout',
                                         'loglabel': '로그아웃',
                                         'regurl': '/users/profile',
                                         'reglabel': req.session.who }));
};

// 회원 정보 양식에서 변경한 내용(비밀번호, 핸드폰번호)를 데이터베이스에 반영합니다.
const HandleChangeProfile = (req, res) => {
let body = req.body;
let htmlstream='';
let hashpwd= '';
let query_str = '';
console.log(body.username);
    // 변경한 내용을 임시로 확인하기 위해 콘솔에 출력해봅니다.
    console.log('변경하고자 하는 입력 정보 :%s, %s',body.phone, body.pw1);

    if (body.phone == '' || body.pw1 == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('<meta charset="utf-8">데이터가 입력되지 않아 가입을 할 수 없습니다');
    }
    else {
       // 이제 변경된 핸드폰번호와 비밀번호를 데이터베이스에 반영합니다.
       // 위와 마찬가지로 변경할 비밀번호도 암호화하여 디비에 저장합니다.
       hashpwd = crypto.createHash('sha512').update(body.pw1).digest('base64');

       // profile 양식에서 전달받은 reglabel을 통하여 사용자의 name을 추출하고 이를 통하여 디비에서 해당 name을 가진 회원의 정보를 수정한다.
       // 이때 수정할 내용은 핸드폰번호와 암호화된 암호로 이전 양식에서 전달된 값이다.
       query_str = `UPDATE u10_users SET phone=${body.phone}, pass='${hashpwd}' WHERE name='${body.username}'`;
       console.log('SQL: ' + query_str);
       db.query(query_str, (error, results, fields) => {
          if (error) {
            console.log(error);
            htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
            res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                               'warn_title':'회원정보 변경 오류',
                               'warn_message':'존재하지 않는 회원의 정보 변경을 시도하였습니다.',
                               'return_url':'/' }));
          } else {
           console.log("회원정보 변경에 성공하였으며, DB에 반영되었습니다.");
           res.redirect('/');
          }
       });

    }
};

router.get('/profile', PrintProfile);     // 정보변경화면을 출력
router.post('/profile/change', HandleChangeProfile);     // 정보변경화면을 출력

module.exports = router;
