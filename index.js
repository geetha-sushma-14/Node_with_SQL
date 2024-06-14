const { faker } = require('@faker-js/faker');
const express=require("express");
const app=express();
const path=require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// import mysql from 'mysql2/promise';
const mysql=require('mysql2');

let getRandomUser= ()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sush_data',
  password: 'Sushma@123'
});


app.get("/",(req,res)=>{
  let q='SELECT COUNT(*) FROM user';
  try{
  connection.query(q,(err, results)=> {
    if(err) throw err;
      let count =results[0]['COUNT(*)'];
      res.render("home.ejs",{count});
    }
  );
  }catch{
    console.log(err);
    res.send("error");
  }
});

app.get("/user",(req,res)=>{
  let q='SELECT * FROM user';
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
        let users=results;
        res.render("showusers.ejs",{users});
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id = '${id}'`;
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
      let user=results[0];
      res.render("edit.ejs",{user});
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id = '${id}'`;
  let{username:newuser,password:formpass}=req.body;
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
      let user=results[0];
      if(user.password!=formpass){
        res.send("Password is wrong");
      }else{
        let q2=`UPDATE user SET username='${newuser}' WHERE id = '${id}'`;
          connection.query(q2,(err, results)=> {
            if(err) throw err;
              res.redirect("/user");
            }
          ); 
      }
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});
app.get("/user/new",(req,res)=>{
  res.render("newuser.ejs");
});
app.post("/user/new",(req,res)=>{
  let {username,email,password}=req.body;
  let id=uuidv4();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
        res.redirect("/user");
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});
app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id = '${id}'`;
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
      let user=results[0];
      res.render("delete.ejs",{user});
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});
app.delete("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id = '${id}'`;
  let{password}=req.body;
  try{
    connection.query(q,(err, results)=> {
      if(err) throw err;
      let user=results[0];
      if(user.password!=password){
        res.send("Password is wrong");
      }else{
        let q2=`DELETE FROM user WHERE id = '${id}'`;
          connection.query(q2,(err, results)=> {
            if(err) throw err;
              res.redirect("/user");
            }
          );
      }
      }
    );
    }catch{
      console.log(err);
      res.send("error");
    }
});
app.listen(8080,()=>{
  console.log("server is listening to 8080");
});

// let q="INSERT INTO user (id,username,email,password) VALUES ?";
// try{
//   connection.query(q,[data],(err, results)=> {
//     if(err) throw err;
//       console.log(results); // results contains rows returned by server
//       // console.log(fields); // fields contains extra meta data about results, if available
//     }
//   );
// }catch{
//   console.log(err);
// }
// connection.end();