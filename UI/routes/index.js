var express = require('express');
var router = express.Router();
var tpl = require('../public/javascripts/module/list.js');
var url = require('url');
var fs = require('fs');

var http = require('http');

var qs = require('querystring');
var ctr = require('../public/javascripts/module/ctr.js');
var tpl = require('../public/javascripts/module/list.js');
var page = require('../public/javascripts/module/page.js');

var _url = "";
var queryData = "";
var pathname = "";
var ext = "";
/* GET home page. */
router.get('/', function(request, response, next) { 
console.log("inside") ;
/** 현재 실행한 파일의 이름과 Path*/
console.log('finaname : ' + __filename);
 
/** 현재 실행한 파일의 Path */
console.log('dirname : ' + __dirname);
var abc = process.cwd();
console.log(abc);

	_url = request.url;
console.log(_url);
	queryData = url.parse(_url, true).query;
	//console.log("here qD : ",queryData.id);
      if(queryData.id === undefined){
        //Page : Main _ index page
        fs.readdir('./public/data', function(error, filelist){
console.log("herezzz") ;
/** 현재 실행한 파일의 이름과 Path*/
console.log('finaname : ' + __filename);
 
/** 현재 실행한 파일의 Path */
console.log('dirname : ' + __dirname);
          var title = '';
          var description = 'Device is not chosen';
          console.log("filelist is : "+filelist);
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
        fs.readdir('../public/data', function(error, filelist){
          fs.readFile(`../public/data/${queryData.id}`, 'utf8', function(err, description){
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

module.exports = router;
