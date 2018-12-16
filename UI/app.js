var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var rp = require('request-promise');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var ctr = require('./public/javascripts/module/ctr.js');
var tpl = require('./public/javascripts/module/list.js');
var page = require('./public/javascripts/module/page.js');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 여기 밑에 5개는 뭐지?
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // MiddleWare
// app.get('*', function(request, response, next){
//   fs.readdir('./data', function(error, filelist){
//     request.list = filelist;
//     next();
//   });
// });

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// 공통부분.. 이렇게?
var _url = "";
var queryData = "";
var pathname = "";
var ext = "";

app.use('/public/stylesheets/', function(request, response, next){
	_url = request.url;
console.log("url : "+_url);
	queryData = url.parse(_url, true).query;
console.log(" qD : ",queryData.id);
	pathname = url.parse(_url, true).pathname;
console.log("pn : "+pathname);
	ext = path.extname(pathname);
    //css sheets사용
    console.log(ext);
    if(ext){
        if(ext === ".css"){
            response.writeHead(200, {"Content-Type": "text/css"});
              response.write(fs.readFileSync("./public/stylesheets/Button.css", "utf8"));
              response.end();
        }
      }
});

app.get('/', function(request, response) { 
  _url = request.url;
console.log("url : "+_url);
	queryData = url.parse(_url, true).query;

	//console.log("here qD : ",queryData.id);
      if(queryData.id === undefined){
        //Page : Main _ index page
        fs.readdir('./public/data', function(error, filelist){
        	console.log("fl is : "+filelist);
          var title = '';
          var description = 'Device is not chosen';
          var list = tpl.template_List_Device(filelist);
          var glist = tpl.template_List_Group(filelist);
          var template = page.template_Page_Main(title, list,
            `<button type="button" class="btn-gradient yellow " 
             onclick="location.href='/create'">create</button>
             <button type="button" class="btn-gradient red " 
             onclick="location.href='/setting'">Setting</button>`,
            `<h3>${title}</h3>${description}`,'Device is not chosen',
            glist

          );
          response.writeHead(200);
          response.end(template);
        });
      }
      //Page : Main _ Device selected 
      else {
        fs.readdir('./public/data', function(error, filelist){
          fs.readFile(`public/data/${queryData.id}`, 'utf8', function(err, description){
            var core = JSON.parse(description);
            var title = queryData.id;
            var list = tpl.template_List_Device(filelist);
            var glist = tpl.template_List_Group(filelist);

            //Controll buttons
            var ON_OFF = '';
            var Brightness = '';
            var Temperature = '';
            if(core.ON_OFF ==='on'){
              ON_OFF = ctr.toggle('ON_OFF');
            }
            if(core.Brightness ==='on'){
              Brightness = ctr.range('Brightness');
            }
            if(core.Temperature ==='on'){
              Temperature = ctr.bar('Temperature');
            }

            var template = page.template_Page_Main(title, list,
              ` 
              <div id="dgrid">
              <button  type="button" class="btn-gradient yellow" 
             onclick="location.href='/create'">create</button>
              <button type="button" class="btn-gradient red " 
             onclick="location.href='/setting'">Setting</button>
              <button  type="button" class="btn-gradient blue " 
             onclick="location.href='/update?id=${title}'">update</button>
                <form action="delete_process" method="post" >
              <button  type="submit" class="btn-gradient green">delete</button>
                  <input type="hidden" name="id" value="${title}">
                </form>
                </div>`,
              `<h3>Name : ${title}</h3><h4>Group Member : ${core.consist} </h4> <div></div>Descrition : ${core.description}`,
              `${ON_OFF} ${Brightness} ${Temperature}`,
              glist
            );
            response.writeHead(200);
            response.end(template);
          });
        });
      }

});

//to see inside group node
app.get('/status', function(request, response) { 
        fs.readdir('./public/data', function(error, filelist){
          fs.readFile(`public/data/${queryData.id}`, 'utf8', function(err, description){
            var core = JSON.parse(description);
           //console.log(core.status);

            var i = 1;
            var tem1 ='';
            var tem2 ='';

            tem1 += tpl.template_List_Set_Device(filelist);
            tem2 += tpl.template_List_Set_Group(filelist);
            var docsetting = page.template_Page_Group(tem1,tem2,core.status);

            response.writeHead(200);
            response.end(docsetting);
          });
        });
});

app.use('/Node_setting/:nodeName', function(request, response) { 
  let filteredName = path.parse(request.params.nodeName).base; 
  //console.log("here is Node_setting");
  //console.log(filteredName);

let abc = process.cwd();
console.log("here abc is " +abc);
let tp = `  osascript -e 'tell application "Terminal" to do script "cd ${abc}/../blockchain;npm run ${filteredName}"'`;


  //let commandString = "\"npm run " + filteredName + "\"";
//let commandString = "../blockchain/";
  var exec = require('child_process').exec;
// exec("open -a terminal " + tp, function (err, stdout, stderr) {
  exec(tp, function (err, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (err !== null) {
          console.log('error: ' + err);
      }
  })
});

app.use('/Node_connecting/:nodeName', function(request, response) { 
  let filteredName = path.parse(request.params.nodeName).base; 
  console.log("here fileterName : "+filteredName);
  let portNum ="3001";

  switch(filteredName){
    case "temperature":
      portNum = "3001";
      break;
    case "humidity":
      portNum = "3002";
      break;
    case "wind":
      portNum = "3003";
      break;
    case "condition":
      portNum = "3004";
  }
  
  // if(filteredName === "humidity"){
  //   portNum = "3002";
  // }
  // else if(filteredName === "wind"){
  //   portNum = "3003";
  // }
  // else if(filteredName === "condition"){
  //   portNum = "3004";
  // }
  console.log("portNum is : "+portNum);
  console.log("newNodeURL : "+`http://localhost:${portNum}`);

const requestOptions = {
            uri: "http://localhost:3001/register-and-broadcast-node",
            method: 'POST',
            body: { newNodeUrl: `http://localhost:${portNum}`},
            json: true
        };
       rp(requestOptions);

});



app.get('/setting', function(request, response) { 
      fs.readdir('./public/data', function(error, filelist){
      var i = 1;
      var tem1 ='';
      var tem2 ='';

      tem1 += tpl.template_List_Set_Device(filelist);
      tem2 += tpl.template_List_Set_Group(filelist);
      var docsetting = page.template_Page_Group(tem1,tem2,"");

      response.writeHead(200);
      response.end(docsetting);
      });
});
app.post('/setting_process', function(request, response) { 

      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){

          var post = qs.parse(body);
          var temppost = JSON.stringify(post);
          var title = 'GR__'+post.groupname;
          var description2 = post.description;
          console.log("1111\n");
          console.log(body);
          console.log("2222\n");
          console.log(post);
          console.log("3333\n");
          console.log(title);
          console.log("4444\n");
          console.log(description2);
          fs.writeFile(`public/data/${title}`, temppost, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
});
app.get('/create', function(request, response) { 
      fs.readdir('./public/data', function(error, filelist){
        var title = 'WEB - create';
        var list = tpl.template_List_Device(filelist);
        var template = page.template_Page_Main(title, list, 
          `
          <form action="/create_process" method="post">
           <fieldset>
            <legend><h2>New Device</h2></legend>
              <p>Name : <input type="text" name="title" placeholder="title"></p>
              <div class="setgrid">
              <div>Descrition : </div>
                <div><textarea name="description" placeholder="description"></textarea></div>
              </div>
                <p>
                  <input type="checkbox" id="switch" name="ON_OFF">ON_OFF</input>
                  <input type="checkbox" id="bright" name="Brightness">Brightness</input>
                  <input type="checkbox" id="temperature" name="Temperature">Temperature</input>
                </p>
              <p>
                <input type="submit">
              </p>
            </fieldset>
              </form>
        `,'','','');
        response.writeHead(200);
        response.end(template);
      });
});
app.post('/create_process', function(request, response) { 
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){

          var post = qs.parse(body);
          var temppost = JSON.stringify(post);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`./public/data/${title}`, temppost, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
});
app.get('/update', function(request, response) { 
      fs.readdir('./public/data', function(error, filelist){
        fs.readFile(`./public/data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = tpl.template_List_Device(filelist);
          var template = page.template_Page_Main(title, list,
            `
            <form action="/update_process" method="post">
              <fieldset>
                <legend><h2>Update Device</h2></legend>
                  <input type="hidden" name="id" value="${title}">
                  <p>Name : <input type="text" name="title" placeholder="title" value="${title}"></p>
                  <div class="setgrid">
                    <div>Descrition : </div>
                    <div><textarea name="description" placeholder="description"></textarea></div>
                  </div>
                  <p>
                    <input type="checkbox" id="switch" name="ON_OFF">ON_OFF</input>
                    <input type="checkbox" id="bright" name="Brightness">Brightness</input>
                    <input type="checkbox" id="temperature" name="Temperature">Temperature</input>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
              </fieldset>
            </form>
            `,'',
            '','');

          response.writeHead(200);
          response.end(template);
        });
      });
});
app.post('/update_process', function(request, response) { 
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var temppost = JSON.stringify(post);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`./public/data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`./public/data/${title}`, temppost, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
});
app.post('/delete_process', function(request, response) { 
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          fs.unlink(`./public/data/${id}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
});

// app.get('/', function(request, response) { 
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
