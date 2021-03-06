module.exports = {
template_Page_Group:function(tem1,tem2,tem3){
  return `
  <!DOCTYPE HTML>
    <html>
      <head> 
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <link type="text/css" href="./public/stylesheets/Button.css" rel="stylesheet" />
        <style>
          a:link  { text-decoration: none; color: #000}
          a:visited  { text-decoration: none; color: #000}
            #Head {
            padding: 30px;
            background-color: #4e9474;

            text-align: center; 
            font-size: 2.4em;
            text-shadow: 3px 3px #000;
            }
          #div1 {width:1000px;height:700px;padding:10px;background-color:gray;border:px solid #999;}
          #setgrid{
          margin : 10px;
          display : grid;
          grid-template-columns: 200px 800px 800px;
          grid-gap: 10px; 
          }
          .setlistgrid{
          //margin : 10px;
          display : grid;
          grid-template-columns: 10px 1fr 10px;
          }
.chainLine{
  border : 3px solid black;
}
        </style>
        
        <script>
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//Drag and Drop
        var group = '';
        function allowDrop(ev) {
            ev.preventDefault();
        }
        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }
        function drop(ev) {
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
//console.log(data);
          //변수를 jquery에 넣는방법.. '#'+변수명
          var tempID = document.getElementById(data).id;
          //alert(tempID);
          //alert($('#'+tempID).attr("style"));

          var sx = $('#'+tempID).width()/2;
          var sy = $('#'+tempID).height()/2;
          //alert(sx+'+'+sy);
          //alert(event.pageX+'+'+event.pageY);
          
          var xx = event.offsetX-sx;
          var yy = event.offsetY-sy;
          $('#'+tempID).attr("style","position : absolute; top:"+yy+"px; left:"+xx+"px");
          
          var withrect = document.getElementById(data);
          //alert(withrect);
          //var withrect2 = '<g><g>'+withrect+'</g><rect rx="3" ry="3 " width="10" height="10"></rect></g>';
          // var aaa = <rect rx="3" ry="3" width="10" height="10">;
          ev.target.appendChild(withrect);
          
          group += data + " ";
        }

        function change(){
          document.getElementById("qwer").value=group;
          document.getElementById("forstatus").value = document.getElementById("div1").innerHTML;
        }

//         function dblclick(thiss){
//           //var s = ev.id;
//           console.log("GRNAME? "+this);

// //window.location.href
//         }

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//line drawing

        var start_point_x= 0.0;
        var start_point_y= 0.0;

 var started = 0;
 var startpoint = '';
        function line_start(nodename){
           started = 1;
           startpoint = nodename;

          start_point_x = event.pageX;
          start_point_y = event.pageY;
        }

var linecount = 1;

        function line_end(point){
        let endpoint =  "end"+point;
          if(started == 1){
            var tp = document.getElementById("div1");
            var elemRect = tp.getBoundingClientRect()
            //div1의 왼쪽위 점의 값을 구한다.
            var tpx = elemRect.left
            var tpy = elemRect.top;
            //alert(tpx);

            //pageX는 전체문서에 대한값이고
            //<line>태그의 좌표는 해당 태그를 감싸고있는 태그를 기준으로 좌표이므로
            //전체문서에서의 좌표 - 감싸고있는태그의 좌표를 해준 좌표를 써야 함.
            var x1 = start_point_x - tpx;
            var y1 = start_point_y - tpy;
            var x2 = event.pageX - tpx;
            var y2 = event.pageY - tpy;
            

            var s ="";
            var temps ="";
            temps += endpoint;
            temps += " ";
            temps += startpoint;
            console.log(temps);
            //s += "<line id="+linecount +" x1="+x1 + " y1=" + y1 + " x2=" + x2 + " y2=" + y2 + " stroke="+"'orange'" +" stroke-width="+"\'3\'"+"></line>";
            s += \` <line id="\${linecount}" x1="\${x1}" y1="\${y1}" x2="\${x2}" y2="\${y2}" stroke="orange"></line> \`;
            
            document.getElementById("svg1").innerHTML+= s;
//console.log(document.getElementById("svg1").innerHTML);
            var t1 = document.getElementById(linecount);
            t1.classList.add(endpoint);
            t1.classList.add(startpoint);
            started = 0;
            linecount ++;

//@@@@!@!@!@#!@#!@#
            //for blockchain
            let url = "Node_connecting/" +point ; 
            fetch(url).then();
            return false;
          }       

        }

        function isChanged(linename){
          var i=0,j=0;
          console.log('end'+linename);
          var endname = document.getElementsByClassName('end'+linename)[i];
          var startname = document.getElementsByClassName('start'+linename)[i];

//공통사용
          var tp = document.getElementById("div1");
          var elemRect = tp.getBoundingClientRect()
          //div1의 왼쪽위 점의 값을 구한다.
          var tpx = elemRect.left
          var tpy = elemRect.top;

//end부분에 연결선 있을때
          while(endname != undefined){
            var tx2 = event.pageX - tpx-96;
            var ty2 = event.pageY - tpy;
            endname.setAttribute('x2',tx2);
            endname.setAttribute('y2',ty2);

            i++;
            console.log("i is " + i);
            endname = document.getElementsByClassName('end'+linename)[i];
            console.log(endname);
          }
//start부분에 연결선 있을때
          while(startname != undefined){
            var tx1 = event.pageX - tpx+96;
            var ty1 = event.pageY - tpy;
            startname.setAttribute('x1',tx1);
            startname.setAttribute('y1',ty1);

            j++;
            console.log("j is " + j);
            startname = document.getElementsByClassName('start'+linename)[j];
            console.log(startname);
          }
        }

function startNode(nodeName){
    let url = "Node_setting/" +nodeName ;
    fetch(url).then();
    return false;
}

function replacer_for_chain(key, value) {
  if (key == "memPool" || key == "currentNodeUrl" || key == "networkNodes") {
    return undefined;
  }

  if (key == 'index'){
    const a ="cccccccccccccccccccccc";
    const b = a + value;
    return b;
  }

  if (key == 'previousBlockHash'){
    const a ="cccccccccccccccccccccc";
    const b = value + a;
    return b;
  }
  return value;
}

function replacer_erase_(key, value) {
  if (key === "chain") {
    return undefined;
  }
  return value;
}

function replacer_each(key, value) {
  if (key === "chain") {
    return undefined;
  }
  return value;
}

function cuttingFunc(data){
  let i = 0;
  let rest = '<div class="aaa">';
//let rest =\` <div class='aaa'>\`;
  while(data.chain[i] != undefined){
    rest += "-------------------------------" + '<br>';
    rest += JSON.stringify(data.chain[i],null,4);
    i++;
    rest += '<br>' + "-------------------------------" + '<br>';
  }
    rest +="</div>" + "               |" +"<br>"+ "               |" +"<br>"+ "               |" +"<br>";
  return rest;
}

function chainData(){
let obj = "";
let rest = "";
let ttt = ""; 
    fetch('http://localhost:3001/blockchain').then(function(response){
    response.json().then(function(data){
      console.log(data.chain);
      console.log(data.memPool);
      //obj = JSON.parse(data);
      //$('#arti').val(JSON.stringify(obj, null, 4));
      //alert(Object.values(obj));

      rest = cuttingFunc(data);

      //rest = JSON.stringify(data,replacer_for_chain,4);
      console.log(rest);

      document.getElementById('arti').innerHTML = "<pre><code>"+rest+"</code></pre>";
    })
  })
}



// fetch('http://localhost:3001/blockchain').then(function(response){
//     ttt = response.body;
//     rest = JSON.parse(ttt);
//     obj = JSON.stringify(obj,null,6);
//     document.querySelector('article').innerHTML = obj;
//   })

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
           


        </script>
      </head>
      <body>
        <header id="Head"><a href="/" style="color:white">Blockchain Manager</a></header>
        <div id="setgrid">
          <div >
            <h2>1.Device</h2>
            ${tem1}
            <h2>2.Group</h2>
            ${tem2}


          </div>

          <div>
            <svg id = "svg1" width="800" height="400" xmlns="http://w3.org/2000/svg"version="1.1"viewbox="0 0 800 400">

                    <foreignobject>
                    <div 
                     id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
                    ${tem3}
                    </div>
                    </foreignobject>
            </svg>
          </div>   

          <div>
            <h2>3.Information</h2>
            <div id="arti">
            </div>
            <input type="button" value="fetch" onclick="chainData()">

<form action="Node_setting" id="frm">
  <input type="hidden" id="nN" value="">
</form>
          </div>
        </div>
      </body>
    </html>
`;
},

template_Page_Main:function(title, list,modify, body, control,glst){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    
    <link type="text/css" href="./public/stylesheets/Button.css" rel="stylesheet" />

    <style>    
    form{
      sytle="display: inline"
    }
     a:link  { text-decoration: none; color: #000}
     a:visited  { text-decoration: none; color: #000}

    #Head {
    padding: 30px;
    background-color: #4e9474;

    text-align: center; 
    font-size: 2.4em;
    text-shadow: 3px 3px #000;
    }
    #grid{
      border : 3px solid gray;
      display : grid;
      grid-template-columns: 200px 1fr;
    }
    .setgrid{
      display : grid;
      grid-template-columns: 80px 1fr;
    }
    #dgrid{
      display : grid;
      grid-template-columns: 100px 100px 100px 100px;
      grid-gap: 10px;
    }
    #deletegrid{
      border : 3px solid white;
    }
    #right{
      padding-left : 5px;
    }
    .rightgrid{
      padding-bottom :5px;
      border-bottom : 1px solid gray;
    }
    .leftgrid{
      border : 1px solid gray;
    }

    </style>
  </head>
  <body>
    <header id="Head"><a href="/" style="color:white">blockchain Management</a></header>
    <div id="grid">
    <div class="leftgrid">
      <h2>1.Device</h2>
      ${list}
      <h2>2.Group</h2>
      ${glst}
    </div >
    <div id="right">
      <div class="rightgrid">
        <h2>3.Add,Update,Delete Device</h2>
        ${modify}
      </div>
      <div class="rightgrid">
        <h2>4.Device Status</h2>
        ${body}
      </div>
      <div >
      <h2>5.Device Control</h2>
      ${control}
      </div>
    </div>
    </div>
  </body>
  </html>
  `;
}

}