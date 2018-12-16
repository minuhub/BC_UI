
module.exports = {
 template_List_Device : function(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    if(filelist[i].substr(0,4) !='GR__' && filelist[i] !='.DS_Store'){
      list = list + `<button type="button" class="btn-gradient cyan large" 
      onclick="location.href='/?id=${filelist[i]}'">${filelist[i]}</button>`;
    }
    i = i + 1;
  }

  list = list+'</ul>';
  return list;
},

 template_List_Group : function(filelist){
  var list = '<ul>';
  var i = 0;
  var temp ='';
  while(i < filelist.length){
    temp = filelist[i].substr(4,filelist.length);
    if(filelist[i].substr(0,4)=='GR__'&& filelist[i] !='.DS_Store'){
      list = list + `<button type="button" class="btn-gradient orange large" 
      onclick="location.href='/?id=${filelist[i]}'">`+temp+`</button>`;
    }
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
},
template_List_Set_Device : function(filelist){
  var list = '';
  var i = 0;
  var temp ='';
  while(i < filelist.length){
    if(filelist[i].substr(0,4)!='GR__'&& filelist[i] !='.DS_Store'){
      list = list + `
      <div id="${filelist[i]}" draggable="true" ondragstart="drag(event)" 
      ondragend="isChanged('${filelist[i]}')"  
      //start Node_Server
      ondblclick="startNode('${filelist[i]}')" >
          <div class="setlistgrid">
            <div style="background-color : blue" 
              onmouseup="line_end('${filelist[i]}')" ></div>
            <div style="position: static; top: 11px; left: 11px;  "class="btn-gradient cyan large" >${filelist[i]}</div>
            <div style="background-color : blue"
              onclick="line_start('start${filelist[i]}')"></div>
          </div>
      </div>
      `
    }
    i = i + 1;
  }
  return list;
},



template_List_Set_Group : function(filelist){
  var list = '';
  var i = 0;
  var temp ='';
  while(i < filelist.length){
    temp = filelist[i].substr(4,filelist.length);
    if(filelist[i].substr(0,4)=='GR__'&& filelist[i] !='.DS_Store'){
      list = list + `<div style="position: static; top: 11px; left: 11px; "
  class="btn-gradient orange large" id="${filelist[i]}" 
  draggable="true" ondragstart="drag(event)"  
  ondblclick="location.href='/status/?id=${filelist[i]}'">`+temp+`</div>`
    }
    i = i + 1;
  }
  // list = list+'</ul>';
  return list;
}
}
