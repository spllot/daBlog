var mongodb = require('./db');
/*
var settings = require('../settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var mongodb = new Db(settings.db, new Server(settings.host, 27017));
*/

function User(user){
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;


User.prototype.save = function(callback) {//存储用户信息
  //要存入数据库的用户文档
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
 

  /////////////////////////
/*
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
  console.log("create connection........");
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //将用户数据插入 users 集合
      collection.insert(user,{safe: true}, function(err, user){
        mongodb.close();
        callback(err, user);//成功！返回插入的用户信息
      });
    });
  });*/
///////////////////////////

  //打开数据库
  mongodb.open(function(err, db){
   
    if(err){
      db.close();
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
         if(err){
         db.close();
         return callback(err);
         }
         //将用户数据插入 users 集合
  collection.insert(user,{safe: true}, function(err, user){
         db.close();
         callback(err, user);//成功！返回插入的用户信息
         });
   

      
    });
  });
};

User.get = function(name, callback){//读取用户信息
   
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
    	db.close();
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.findOne({
        name: name
      },function(err, doc){
        db.close();
        if(doc){
          var user = new User(doc);
          callback(err, user);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};