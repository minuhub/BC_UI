module.exports  = {
  range : function (what){
 return `
<div>${what}</div>
<div class="slidecontainer">
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
</div>


<style>
.slidecontainer {
    width: 30%; /* Width of the outside container */
}

/* The slider itself */
.slider {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
.slider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: #4CAF50; /* Green background */
    cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: #4CAF50; /* Green background */
    cursor: pointer; /* Cursor on hover */
}

</style>

<script>
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
</script>
            `
},

  bar : function(what){
             return `
<style type="text/css">
    #myProgress${what} {
    width: 100%;
    background-color: grey;
    }
    #myBar${what} {
    width: 1%;
    height: 30px;
    background-color: green;
    }
</style>
    <p>
    <div>${what}</div>
    <div id="myProgress${what}">
        <div id="myBar${what}"></div>
    </div>
    </p>

    <script type="text/javascript">
     var bars${what} = 10;
    function move${what}() {
    bars${what} += 10;
    var elem${what} = document.getElementById("myBar${what}"); 
    elem${what}.style.width = bars${what} + '%';
   }
    </script>
    <input type="button" value="push" onclick="move${what}();">
`;
},

  toggle : function(what){
  return`
<style>
.switch${what} {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch${what} input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider${what} {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider${what}:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider${what} {
  background-color: #2196F3;
}

input:focus + .slider${what} {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider${what}:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider${what}.round {
  border-radius: 34px;
}

.slider${what}.round:before {
  border-radius: 50%;
}
</style>

<div>
<div>${what}</div>
<div> </div>

<label class="switch${what}">
  <input type="checkbox" checked>
  <span class="slider${what} round"></span>
</label>
</div>

  `;

}
}


