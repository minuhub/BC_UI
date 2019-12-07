# BC_UI
Drag&Drop으로 간단한 블록체인을 컨트롤 할수 있는 UI

> Belfast학기대체 인턴 당시 진행했던 프로젝트


## 사용방법

## BlockChain
## WEB
### Drag&Drop, Line drawing
onclick = "dragFunction()"
CANVAS, SVG(scalable vector graphic)

### CORS(Cross-Origin Resource Sharing)ㅊ
```
//networkNode.js
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
```
CORS허용을 위해 모든 클라이언트를 허용하도록 함
