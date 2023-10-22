require('dotenv').config();

const express = require("express");

const router = express.Router();


router.use((req, res, next) => {
  console.log('middleware for chatgpt!');
  next();
});
const maria = require('../db/mariadb');


// import OpenAI from 'openai';
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY
});

// const configiration = new Configuration({
//     organization:process.env.OPEN_API_KEY_OR,
//     apiKey: process.env.OPEN_API_KEY
// });

const data_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Bucket List Keywords",
  "description": "A schema for defining main keywords and their associated details for a bucket list.",
  "type": "object",
      "properties": {
        "MainKeyword": {
          "type": "object",
          "description": "Details related to MainKeyword2 for the bucket list",
          "properties": {
            "Value": { "type": "string", "description": "Main keyword2 to achieve bucket list" },
            "Detail1": { "type": "string", "description": "The first detail for MainKeyword2." },
            "Detail2": { "type": "string", "description": "The second detail for MainKeyword2." },
            "Detail3": { "type": "string", "description": "The third detail for MainKeyword2." },
            "Detail4": { "type": "string", "description": "The fourth detail for MainKeyword2." }
          },
          "required": ["Value", "Detail1","Detail2","Detail3","Detail4",]
        },
        "MainKeyword2": {
          "type": "object",
          "description": "Details related to MainKeyword2 for the bucket list",
          "properties": {
            "Value": { "type": "string", "description": "Main keyword2 to achieve bucket list" },
            "Detail1": { "type": "string", "description": "The first detail for MainKeyword2." },
            "Detail2": { "type": "string", "description": "The second detail for MainKeyword2." },
            "Detail3": { "type": "string", "description": "The third detail for MainKeyword2." },
            "Detail4": { "type": "string", "description": "The fourth detail for MainKeyword2." }
          },
          "required": ["Value", "Detail1","Detail2","Detail3","Detail4",]
        },
        "MainKeyword3": {
          "type": "object",
          "description": "Details related to MainKeyword2 for the bucket list",
          "properties": {
            "Value": { "type": "string", "description": "Main keyword2 to achieve bucket list" },
            "Detail1": { "type": "string", "description": "The first detail for MainKeyword2." },
            "Detail2": { "type": "string", "description": "The second detail for MainKeyword2." },
            "Detail3": { "type": "string", "description": "The third detail for MainKeyword2." },
            "Detail4": { "type": "string", "description": "The fourth detail for MainKeyword2." }
          },
          "required": ["Value", "Detail1","Detail2","Detail3","Detail4",]
        },
        "MainKeyword4": {
          "type": "object",
          "description": "Details related to MainKeyword2 for the bucket list",
          "properties": {
            "Value": { "type": "string", "description": "Main keyword2 to achieve bucket list" },
            "Detail1": { "type": "string", "description": "The first detail for MainKeyword2." },
            "Detail2": { "type": "string", "description": "The second detail for MainKeyword2." },
            "Detail3": { "type": "string", "description": "The third detail for MainKeyword2." },
            "Detail4": { "type": "string", "description": "The fourth detail for MainKeyword2." }
          },
          "required": ["Value", "Detail1","Detail2","Detail3","Detail4",]
        }
       
      }
}



const runGPT35 = async (prompt) => {
  try{
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "user", 
          content: prompt 
        }
      ],
      functions:[
        {
          name: "data_schema",
          description: "Using the given age, gender, occupation, and bucket list information, create four main keywords for achieving a bucket list that fits the situation, and four detailed keywords according to each main keyword",
          parameters: data_schema
        }
      ], 
      function_call:{ name: "data_schema"},
      temperature :0.7,
      top_p:1.0 ,
      frequency_penalty : 0.0,
      presence_penalty: 0.0,
      max_tokens : 500,
      
  });
  var output_schema = chatCompletion.choices[0].message.function_call.arguments;
  return output_schema;
  }
  catch(e){
    console.log(e);
    return ('Sorry, Error!');
  }
  
};



//계획 수정
router.patch("/patch/goal/change", async(req,res)=>{
  try{
    user_email = req.body.user_email;
    main_id = req.body.main_id;
    small_goal = req.body.small_goal;
    mini_num = req.body.mini_num;
    value = req.body.value;
    mini = "mini"+mini_num;
    const query = `UPDATE big_goal set ${mini} = '${value}' where user_email='${user_email}' and small_goal='${small_goal}';`
    maria.query(query,async function(err,rows,fields){
    if(err){
        console.log("big_goal 에러"+err);
        res.status(400).send(err);
        return;
    }
    console.log("성공");
    res.status(200).send("변경완료");
    });
  }catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
 
});

//계획 달성
router.patch("/patch/report/change", async(req,res)=>{
  try{
    user_email = req.body.user_email;
    main_id = req.body.main_id;
    small_goal = req.body.small_goal;
    mini_num = req.body.mini_num;
    value = req.body.value;
    mini = "cmini"+mini_num;
    const query = `UPDATE big_goal set ${mini} = ${value} where user_email='${user_email}' and small_goal='${small_goal}' and main_id='${main_id}';`
    maria.query(query,async function(err,rows,fields){
    if(err){
        console.log("big_goal 에러"+err);
        res.status(400).send(err);
        return;
    }
    console.log("성공");
    res.status(200).send("변경완료");
    });
  }
  catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
  
});


//세부 계획
router.get("/get/report/write", async(req,res)=>{
  try{
    user_email = req.query.user_email;
    main_id = req.query.main_id;
    const query = `SELECT small_goal,mini1,mini2,mini3,mini4,cmini1,cmini2,cmini3, cmini4,total
    FROM big_goal where user_email='${user_email}' and main_id=${main_id};`;
    maria.query(query,async function(err,rows,fields){
    if(err){
        console.log("big_goal 에러"+err);
        res.status(400).send(err);
        return;
    }
    var scores = 0;
    for (const row of rows) {
      scores = scores + row.total
    }
    var scores = Math.round(((scores)/16)*100);
    console.log(scores);
    res.status(200).send({result:rows, score: scores});
    });
  }
  catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
  
});


function queryAsync(sql) {
  return new Promise((resolve, reject) => {
    maria.query(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

//리스트 보기
router.get('/get/report/list', async (req, res) => {
  try{
    const user_email = req.query.user_email;
    const query = `SELECT main, id FROM main_goal where user_email='${user_email}';`;
    const jarray = [];
    var mains = [];
    try {
      const rows = await queryAsync(query);
  
      const promises = rows.map(row => {
        mains.push(row.main);
        const querys = `SELECT total, small_goal, main_id FROM big_goal where main_id=${row.id};`;
        return queryAsync(querys);
      });
  
      const results = await Promise.all(promises);
  
      var i = 0;
      for (const result of results) {
        console.log(result);
        var score = Math.round(((result[0].total + result[1].total + result[2].total + result[3].total)/16)*100);
        jarray.push({main: mains[i], main_id: result[0].main_id, small1:result[0].small_goal, small2:result[1].small_goal, small3:result[2].small_goal, small4 :result[3].small_goal, total : score})
        // jarray.push(result);
        i = i+1;
        console.log("-----------------------");
  
      }
      res.status(200).send(jarray);
    } catch (err) {
      console.log("에러: " + err);
      res.status(400).send(err);
    }
  }
  catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
  
});

// router.get("/get/report/demo", async(req,res)=>{
//   user_email = req.query.user_email;
//   const query = `SELECT main,id FROM main_goal where user_email='${user_email}';`;
//   const jarray = [];
//   maria.query(query,async function(err,rows,fields){
//   if(err){
//       console.log("big_goal 에러"+err);
//       res.status(400).send(err);
//       return;
//   }
//   for(i=0;i < rows.length;i++){
//     const querys = `SELECT small_goal FROM big_goal where main_id=${rows[i].id};`;
//     maria.query(querys, async function(err,rowss,fields){
//       if(!err){
//         jarray.push(rowss);
//         console.log(jarray[0]);
//         //res.status(200).send("완료");
//         // console.log(rowss+jarray[i].main);
       
//       }
//       else{
//         console.log("big_goal 에러"+err);
//         res.status(400).send(err);
//         return;
//       }
//     }) 
//   } 
//   });
//   console.log(jarray+"먼저실행");
//   res.status(200).send(jarray);
// });


//결과 저장
router.post("/report/demo", async(req,res)=>{
  try{
    var bucket = req.body.bucket;
    var user_email = req.body.user_email;
    var bucketlist = req.body.bucketList;
    var bucketarray = [bucketlist.MainKeyword1,bucketlist.MainKeyword2,bucketlist.MainKeyword3,bucketlist.MainKeyword4];
  
    const query = `INSERT INTO main_goal(main, user_email) values ('${bucket}','${user_email}');`;
    maria.query(query,function(err,rows,fields){
    if(!err){
        console.log("main goal 저장 완료")
        main_id = rows.insertId;
        for(i=0;i < bucketarray.length;i++){
          const query = `INSERT INTO big_goal(user_email, main_id, small_goal, mini1, mini2, mini3, mini4) 
          values ('${user_email}','${main_id}','${bucketarray[i].Value}','${bucketarray[i].Detail1}','${bucketarray[i].Detail2}','${bucketarray[i].Detail3}','${bucketarray[i].Detail4}');`;
          maria.query(query,function(err,rows,fields){
          if(err){
              console.log("big_goal 에러")
              res.status(400);
              return;
          }
          });
        };
        res.status(200).send(rows);
    }
    else{
        res.status(400).send(err);
        console.log("err : " + err);
    }
    });
    
  }
  catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
  
  
});


router.get("/gpt", async (req, res) => {
  try{
    var bucket = req.query.bucket;
    var user_email = req.query.user_email;
    var job='학생';
    var age='20';
    var gender = '여자';
    const query = `SELECT user_name, user_age, user_sex, user_job FROM person_info where user_email='${user_email}';`;
    maria.query(query,async function(err,rows,fields){
        if(!err){
            if(rows.length != 0){console.log(rows);
              job = rows[0].user_job;
              age = rows[0].user_age;
              gender = rows[0].user_sex
              if (gender=="f"){
                gender = "여자"
              }
              else{
                gender = "남자"
              }
              
            }
            else{
                res.status(404).send("no exist");
                return;
            }
            var propmt_sentence = 
              `직업: '${job}', 나이: '${age}',
              성별:'${gender}' 버킷리스트: '${bucket}'버킷리스트를 이루기 위해 
              필요한 메인 키워드 4개와 각각의 메인 키워드를 이루기 위한 
              세부 목표를 4개씩 한글로 json배열로 생성해줘`;
          
              console.log(propmt_sentence);
              
              const response = await runGPT35(propmt_sentence);
          
                if (response) {
                  const user = JSON.parse(response) // json.parse로 파싱
                  res.json(user);       
                } 
                else {
                  res.status(500).json({ error: "fail......" });
                }
            
        }
        else{
            res.status(400).send(err);
            console.log("err : " + err);
            return;
        }
    });

     
 }
 catch(e){
  console.log(e);
  res.status(400).end('Sorry, Error!');
}
    } 
  
);

router.get("/report", async (req, res) => {
    try{
      var gender = req.query.gender;
      var age = req.query.age;
      var job = req.query.job;
      var bucket = req.query.bucket;
      var user_email = req.query.user_email;
  
        var propmt_sentence = 
        `직업: '${job}', 나이: '${age}',
        성별:'${gender}' 버킷리스트: '${bucket}'버킷리스트를 이루기 위해 
        필요한 메인 키워드 4개와 각각의 메인 키워드를 이루기 위한 
        세부 목표를 4개씩 한글로 json배열로 생성해줘`;
    
        console.log(propmt_sentence);
        const response = await runGPT35(propmt_sentence);
    
          if (response) {
            // const query = `INSERT INTO big_gole(user_email, big_goal) values ('${bodys.user_eamil}','${bucket}');`;
            // maria.query(query,function(err,rows,fields){
            // if(!err){
            //     console.log("큰 목표 저장")
            //     res.status(200).json({big_id:response.big_id});
            // }
            // else{
            //     res.status(400).send(err);
            //     console.log("err : " + err);
            // }
            // });
            const user = JSON.parse(response) // json.parse로 파싱
            res.json(user);       
          } 
          else {
            res.status(500).json({ error: "fail......" });
          }
   }
   catch(e){
    console.log(e);
    res.status(400).end('Sorry, Error!');
  }
      } 
    
  );
  module.exports = router;
  // export default router;
