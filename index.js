const express = require("express")
var app = express()
const maria = require('./db/mariadb');
maria.connect(function(err){
    if (err) throw err;
    console.log("db connected");
});
const cors = require("cors")

app.use(cors());
app.use(express.json());


app.get('/idcheck',function(req,res){
    var user_name = req.query,user_name;
    maria.query(`select * from person_info where user_name=${user_name}`, function(err, rows, fields){
        if (rows== 0){
            console.log("사용할 수 있는 아이디입니다");
            res.status(200).json({"check":true});
        }
        else{
            console.log("이미 있는 아이디 입니다");
            res.json({"check":false})
        }
    });


});
app.post('/register', function (req, res) {
    const bodys = req.body;
    const query = `INSERT INTO person_info(user_name, user_password) values ('${bodys.name}','${bodys.password}')`;
    maria.query(query,function(err,rows,fields){
        if(!err){
            console.log("회원가입 완료")
            res.status(200).json({"user_name": bodys.name, "user_password":bodys.password});
        }
        else{
            res.send(err);
            console.log("err : " + err);
        }
    });
});

app.get('/login', function (req, res) {
    const user_name = req.query.user_name;
    const user_password = req.query.user_password;

    maria.query(`select * from person_info where user_name='${user_name}' and user_password='${user_password}';`, function(err, rows, fields){
        if(rows.length >= 1 && !err){
            console.log("success");
            res.status(200).json(rows[0]);
        }else{
            if (rows.length == 0){
                res.status(400).send("아이디 또는 비밀번호가 틀렸습니다");
                console.log("아이디 또는 비밀번호가 틀렸습니다");
                return;
            }
            console.log("err : " + err);
            res.send(err)
        }
    });
});



app.get("/",(req,res)=>{
    res.send("sever start, hello!");
})

app.listen(3080,()=>{
    console.log("!!!!!!!devecean ggomtle sever start!!!!!!!");

})