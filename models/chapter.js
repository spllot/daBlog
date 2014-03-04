var mongodb = require('./db');

function Chapter(chapter){
    this.title   = chapter.title || "";
    this.content = chapter.content || "";
    this.author  = chapter.author || "";
    this.tags    = chapter.tags || "";
    this.cid     = chapter.cid || "";
    this.cname   = chapter.cname || "";
    this.createtime = chapter.createtime || "";
    this.lastmodify = chapter.lastmodify || "";
};

module.exports = Chapter;

//新增一篇文章
Chapter.add = function(callback) {//存储用户信息
    //要存入数据库的用户文档
    var chapter = {
        title: this.title,
        content: this.content,
        author: this.author,
        tags: this.tags,
        cname: this.cname,
        cid: this.cid,
        createtime: this.createtime,
        lastmodify: this.lastmodify
    };

    //打开数据库
    mongodb.open(function(err, db){
        if(err){
          db.close();
          return callback(err);
        }
        //读取 chapter 集合
        db.collection('chapter', function(err, collection){
            if(err){
                db.close();
                return callback(err);
            }
            //将文章数据插入 chapter 集合
            collection.insert(chapter,{safe: true}, function(err, chapter){
                db.close();
                callback(err, chapter);//成功！返回插入的文章信息
            });
        });
    });
};

// //按文章内容来搜索文章
// Chapter.prototype.search = function(content, callback){
//     //打开数据库
//     mongodb.open(function(err, db){
//         if(err){
//           db.close();
//           return callback(err);
//         }
//         //读取 chapter 集合
//         db.collection('chapter', function(err, collection){
//             if(err){
//               db.close();
//               return callback(err);
//             }
//             //根据文章内容搜索文章列表
//             collection.find({
//                 content: {
//                   $regex: content,
//                   $options: 'i'
//                 }
//             },function(err, ch){
//                 db.close();
//                 if(ch && ch.length > 0){
//                   //var chapter = new Chapter(ch);
//                   callback(err, ch);//成功！返回查询的文档信息
//                 } else {
//                   callback(err, null);//失败！返回null
//                 }
//             });
//         });
//     });
// };

//获取文章列表
Chapter.getAll = function(query, callback){
    query = query ? query : {};
    //打开数据库
    mongodb.open(function(err, db){
        if(err){
          db.close();
          return callback(err);
        }
        //读取 chapter 集合
        db.collection('chapter', function(err, collection){
            if(err){
              db.close();
              return callback(err);
            }
            //根据文章内容搜索文章列表
            collection.find(query).sort({
               time: -1
            }).toArray(function(err, chs){
                mongodb.close();
                if(err){
                  callback(err, null);
                }
                var chapters = [];
                chs.forEach(function(ch, index){
                  var chapter = new Chapter({
                      title: ch.title,
                      content: ch.content,
                      author: ch.author,
                      tags: ch.tags,
                      cname: ch.cname,
                      cid: ch.cid,
                      createtime: ch.createtime,
                      lastmodify: ch.lastmodify
                  });
                  chapters.push(chapter);
                });
                callback(null, chapters);
            });
        });
    });
};