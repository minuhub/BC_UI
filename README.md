
> Belfast학기대체 인턴 당시 진행했던 프로젝트
# BC_UI
- Drag&Drop으로 간단한 블록체인을 컨트롤 할수 있는 UI
- UI서버코드 + BlockChain서버코드로 구성

![bcui](https://user-images.githubusercontent.com/37726977/70990078-23a9b180-2108-11ea-9b33-c87771769a43.png)
## 동작과정
- 왼쪽의 블록을 중앙으로 Drag&Drop하면 블록서버가 생성되고, 블록끼리 클릭해서 선으로 연결해주면 블록체인 알고리즘에 따라 체인으로 연결된다.

## WEB
- Express framework 사용.

### Drag&Drop, Line drawing
- BC_UI/UI/public/javascripts/module/page.js 코드 참고.
- SVG(scalable vector graphic)방식으로 drawing.

### CORS(Cross-Origin Resource Sharing)
- Client는 UI서버를 origin주소로 가지고 있고, Block들은 BlockChain서버를 주소로 가지고 있기 때문에 Client에서 BlockChain의 주소로 데이터를 요청할때 CORS정책을 위반한다.
- CORS허용을 위해 BlockChain서버에서 모든 클라이언트를 허용하도록 함
```
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
```


## BlockChain
- 블록을 Drag&Drop하면 해당 블록의 서버가 생성되는데, 해당 서버에 관한 코드.
