// import gptRouter from './routes/gpt.js';
const gptRouter = require("./routes/gpt.js");

const express = require("express")

var app = express()
const maria = require('./db/mariadb');
const axios = require('axios');

maria.connect(function(err){
    if (err) throw err;
    console.log("db connected");
});
const cors = require("cors")

app.use(cors());
app.use(express.json());

app.use('/ask', gptRouter);

app.get('/get/userinfo',function(req,res){
    try{
        var user_email = req.query.user_email;
    const query = `SELECT user_name, user_age, user_sex, user_job FROM person_info where user_email='${user_email}';`;
    maria.query(query,function(err,rows,fields){
        if(!err){
            if(rows.length != 0){console.log(rows);
                res.status(200).json({user_name: rows[0].user_name, user_eamil:rows[0].user_email, user_sex:rows[0].user_sex,
            user_age : rows[0].user_age, userjob:rows[0].user_job});}
            else{
                res.status(404).send("no exist");
            }
            
        }
        else{
            res.status(400).send(err);
            console.log("err : " + err);
            return;
        }
    });

    }catch(e){
        console.log(e);
        res.status(400).end('Sorry, Error!');
    }
    


});

app.post('/register', function (req, res) {
    const bodys = req.body;
    const query = `INSERT INTO person_info(user_name, user_email, user_age, user_sex, user_job, kakao_id) values ('${bodys.user_name}','${bodys.user_email}' ,'${bodys.user_age}','${bodys.user_sex}','${bodys.user_job}','${bodys.kakao_id}');`;
    maria.query(query,function(err,rows,fields){
        if(!err){
            console.log("회원가입 완료")
            res.status(200).json({"user_name": bodys.user_name, "user_eamil":bodys.user_email});
        }
        else{
            res.status(400).send(err);
            console.log("err : " + err);
        }
    });
});



app.get('/api/auth/kakao', async (req, res) => {
    const code = req.query.code;
    try { 
        // Access token 가져오기
        const res1 = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params:{
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                code,
                // redirect_uri: (CONFIG.PRODUCT ? "https://" : 'http://') + req.headers.host + '/api/auth/kakao'
                redirect_uri: 'http://'
                 + req.headers.host + '/api/auth/kakao'
            }
        });

        // Access token을 이용해 정보 가져오기
        const res2 = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'Bearer ' + res1.data.access_token
            }
        });
        //console.log(res2.data);

        const data = res2.data;
        const ququ = `select * from person_info where user_email='${data.kakao_account.email}';`;
        maria.query(ququ,async function(err,rows,fields){
            if (rows.length != 0) {
                console.log(rows);
                // 회원가입된 유저
                //req.session.userId = rows.id;
                //req.session.save(() => { });
                res.redirect('http://localhost:3000/write');
                return;     
             } 
             else{
                console.log("회원가입이 되어있지 않은 사용자 입니다!");
                res.redirect('http://localhost:3000/userinfo?'
                + (data.properties && data.properties.nickname ? '&user_name=' + encodeURIComponent(data.properties.nickname) : '')
                + (data.kakao_account && data.kakao_account.email ? '&user_email=' + data.kakao_account.email : '')
                + (data.id ? '$kakao_id=' + data.id : '' ));
             }    
        });
        // const row = maria.query(`select * from person_info where user_email='${data.kakao_account.email}';`);
        // if (row) {
        //     console.log(row);
        //     // 회원가입된 유저
        //     //req.session.userId = row.id;
        //     //req.session.save(() => { });
        //     res.redirect('http://localhost:3000/write');
        //     return;
        // }   
        //     console.log("회원가입이 되어있지 않은 사용자 입니다!");
        //     res.redirect('http://localhost:3000/userinfo?'
        //     + (data.properties && data.properties.nickname ? '&user_name=' + encodeURIComponent(data.properties.nickname) : '')
        //     + (data.kakao_account && data.kakao_account.email ? '&user_email=' + data.kakao_account.email : '')
        //     + (data.id ? '$kakao_id=' + data.id : '' ));
        //     // res.json({nickname:data.properties.nickname, email:data.kakao_account.email})
        }
     catch(e) {
        console.log(e);
        res.status(400).end('Sorry, Login Error!');
    }
}); 

app.listen(3080,()=>{
    console.log("!!!!!!!devecean ggomtle sever start!!!!!!!");

})