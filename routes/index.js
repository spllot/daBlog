
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app){
	//routes
	app.get('/', function(req, res){
	
  		Post.get(null, function(err, posts){
  			if(err){
  				posts = [];
  			}
  			res.render('index',{
  				title: 'ICBU Center',
  				name: 'blog' ,
  				user: req.session.user,
  				username: (req.session.user || {name:'null'}).name,
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				posts: posts
  			});
  		});
	});
	
	app.get('/register',checkNotLogin);
	app.get('/register',function(req, res){
		res.render('register',{
			title: '用户注册',
			user: req.session.user,
			username: (req.session.user || {name:'null'}).name,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/register',checkNotLogin);
	app.post('/register',function(req,res){
		//检查两次密码
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error','两次口令不一致');
			return res.redirect('/register');
		}
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		
		
		var newUser = new User({
			name : req.body.username,
			password : password
		});

		//检查用户存在
		User.get(newUser.name, function(err, user){
			if(user){
				err = '用户名已经存在.';
			}
			if(err){
				req.flash('error',err);
				return res.redirect('/register');
			}
			//用户不存在，添加用户
			newUser.save(function(err){
				if(err){
					req.flash('error', err);
					return res.redirect('/register');
				}
				req.session.user = newUser;
				//为success赋值
				req.flash('success', '注册成功');
				res.redirect('/');


			});
		});
		

	});
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			title: '用户登录',
			user: req.session.user,
			username: (req.session.user || {name:'null'}).name,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username, function(err, user){
			if(!user){
				req.flash('error','用户名不存在');
				return res.redirect('/login');
			}
			if(user.password != password){
				req.flash('error','密码错误');
				return res.redirect('/login');
			}
			//if success
			req.session.user = user;
			req.flash('success','登录成功');
			res.redirect('/my');

		});
	});
	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','登出成功');
		res.redirect('/');
	});
	app.get('/post',checkLogin);
	app.get('/post', function(req, res){
		
		res.render('post',{
			title : '发表',
			user: req.session.user,
			username: (req.session.user || {name:'null'}).name,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/post',checkLogin);
	app.post('/post', function(req,res){
		var currentUser = req.session.user;
		
		var post = new Post(currentUser.name, req.body.title, req.body.post);
	
		post.save(function (err) {
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功！');
			res.redirect('/my');
		});
	});
	app.get('/time', function(req,res){});

	function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error','用户已经登录');
			return  res.redirect('/');
		}
		next();
	}
	function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash('error','用户未登录');
			return  res.redirect('/login');
		}
		next();
	}
	app.get('/my', checkLogin);
	app.get('/my', function(req, res){
  		Post.get(null, function(err, posts){
  			if(err){
  				posts = [];
  			}
  			res.render('my',{
  				title: '文章浏览',
  				user: req.session.user,
  				username: (req.session.user || {name:'null'}).name,
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				posts: posts
  			});
  		});
	});
	
};


