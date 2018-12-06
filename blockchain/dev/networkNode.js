const express = require('express');
const app = express();
//import body-parser
const bodyParser = require('body-parser');
//앞에서 만든 blockchain 모듈 임포트
const Blockchain = require('./blockchain');
//동적 포트 package.json script 객체에서 2번째 방에 들어있는 데이터. (3001, 3002, 3003, 3004, 3005)
const port = process.argv[2];
//import request-promise
const rp = require('request-promise');
//device이름. (temperature, humidity...)
const name = process.argv[4];

const device = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var generateRandom = function(min, max){
    var ranNum = Math.floor(Math.random()*(max-min+1))+min;
    return ranNum;
}

//yy-mm-dd hh:mm:ss 형식으로 현재 시간 출력해주는 함수
function getTimeStamp() {
    var d = new Date();
    var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2) + '-' + leadingZeros(d.getDate(), 2) + ' ' +
        leadingZeros(d.getHours(), 2) + ':' + leadingZeros(d.getMinutes(), 2) + ':' + leadingZeros(d.getSeconds(), 2);  
    return s;
};
function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
};

//10초마다 log데이터 생성.
setInterval(function(){
    var data = null;
    if(name === 'temperature'){
        data = generateRandom(1,15) + '˚';
    }
    else if(name === 'humidity'){
        data = generateRandom(1,100) + '%';
    }
    else if(name === 'wind'){
        data = generateRandom(1,15) + 'km/h';
    }
    else if(name === 'condition'){
        data= generateRandom(1,4);
    }
    const requestOptions = {
        uri: device.currentNodeUrl + '/log/broadcast',
        method: 'POST',
        body: {data : name + " : " + data},
        json: true
    };
    return rp(requestOptions);  
}, 10000);

//블록체인 불러오기.
app.get('/blockchain', function(req, res){
    res.send(device);
});

app.post('/log', function(req, res){
    const newLog = req.body;
    //로그를 memPool에 넣어주고 로그가 들어갈 블록의 인덱스를 구함.
    const blockIndex = device.addLogToMemPool(newLog);
    res.json({note: `Log will be added in block ${blockIndex}.`});
});

//이 url로 log를 post방식으로 넘기면 memPool에 추가되고, 다른 노드들에게 알려준다.
app.post('/log/broadcast', function(req, res){
    //새 로그 생성
    const newLog = device.createNewLogs(getTimeStamp(), req.body.data);
    //생성한 새 로그를 memPool에 추가.
    device.addLogToMemPool(newLog);

    const requestPromises1 = [];
    //네트워크에있는 모든 다른 노드들에게 알린다.
    device.networkNodes.forEach(networkNodeUrl => {
        const requestOptions1 = {
            uri: networkNodeUrl + '/log',
            method: 'POST',
            body: newLog,
            json: true
        };

        //순차적으로 비동기를 실행하기 위해서 배열에 넣음.
        requestPromises1.push(rp(requestOptions1));
    });
    //순차적으로 비동기 작업 처리.
    Promise.all(requestPromises1)
    .then(data => {
        res.json({note: 'Log created and broadcast successfully.'});

        //pool에 10개의 로그가 차면 자동으로 블록을 생성해줌.
        if(device.memPool.length === 10){
            const requestOptions2 = {
                uri: device.currentNodeUrl + '/mine',
                method: 'GET',
                json: true
            };
            return rp(requestOptions2);
        };
    });
});


//웹브라우저에 get 방식으로 /mine 주소를 입력했을 때 실행
app.get('/mine', function(req,res){
    //마지막 블록을 가져온다.
    const lastBlock = device.getLastBlock();

    //마지막 블록의 해쉬값, 즉 이전 블록의 해쉬값.
    const previousBlockHash = lastBlock['hash'];

    //현재 블록의 데이터 : 미완료된 거래내역 + 블록의 index값
    const currentBlockData = {
        Logs : device.memPool,
        index : lastBlock['index'] + 1
    };

    //이전 블록 해쉬, 현재 블록 데이터를 넣고 현재 블록의 해쉬값 리턴
    const blockHash = device.hashBlock(previousBlockHash, currentBlockData);
    //previousBlockHash, blockHash값으로 새 블록 생성.
    const newBlock = device.createNewBlock(previousBlockHash, blockHash);

    const requestPromises = [];
    //네트워크에 있는 다른 모든 노드들에게 생성된 블록을 알림.
    device.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    //requestPromises 배열에 있는 모든 request 실행.
    Promise.all(requestPromises)
    .then(data => { 
        res.json({
            note : "New block mined & broadcast successfully.",
            block : newBlock
        });
    });
});

//노드에 새로 들어온 블록 등록하기.
app.post('/receive-new-block', function(req,res){
    const newBlock = req.body.newBlock;
    //받은 블록이 유효한것인지 확인한 후 유효하면 등록한다.
    //새 블록의 이전블록 해시가 블록체인 마지막블록의 해시와 동일하면 유효한것(true반환).
    const lastBlock = device.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    //새 블록이 올바른 index값을 가지고있는지도 확인. (블록체인의 마지막 인덱스 바로 다음 이어야함.)
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    
    //받은 블록이 유효하다면, 노드의 체인에 블록을 추가.
    if(correctHash && correctIndex){
        device.chain.push(newBlock);
        //블록을 추가했다면 memPool이 블록안에 들어가기때문에 비워줘야한다.
        device.memPool = [];
        res.json({
            note: "New block received and accepted.",
            newBlock: newBlock
        });
    } else{         //블록이 유효하지 않다면 등록이 실패함을 알려준다.
        res.json({
            note: "New block rejected.",
            newBlock: newBlock
        });
    }
});

//새로운 노드를 등록하고 전체 네트워크에 알림
app.post('/register-and-broadcast-node', function(req,res){
    //새로 진입한 노드 주소
    const newNodeUrl = req.body.newNodeUrl;
    //기존 네트워크에 새로 진입한 노드의 주소가 없을 경우 추가.
    if(device.networkNodes.indexOf(newNodeUrl) == -1){
        device.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];
    //기존 네트워크에 새로운 노드 정보를 등록.
    device.networkNodes.forEach(networkNodeUrl => {
        //register-node
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body:{newNodeUrl: newNodeUrl},
            json:true
        };
        //순차적으로 비동기를 실행하기 위해서 배열에 넣음
        regNodesPromises.push(rp(requestOptions));
    }); //for문 끝

    //순차적으로 비동기 작업 처리
    Promise.all(regNodesPromises)
    .then(data => {
        //새로운 노드 안에 전체 네트워크에 대한 정보 한번에 입력해주기.
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...device.networkNodes, device.currentNodeUrl]},
            json: true
        };
        //새로운 노드의 블록체인에 기존 네트워크에 있던 노드중 제일 긴 블록체인을 등록.
        const consensusOptions = {
            uri: newNodeUrl + '/consensus',
            method: 'GET',
            json: true
        }
        return (rp(bulkRegisterOptions) && rp(consensusOptions));
    })
    .then(data => {
        res.json({note: 'New node registered with network successfully.'});
    });
});

//전체 네트워크에 새로운 노드 등록
app.post('/register-node', function(req, res){
    //새로운 노드 URL
    const newNodeUrl = req.body.newNodeUrl;
    //기존 네트워크에 새로운 노드의 주소가 없다면,
    const nodeNotAlreadyPresent = device.networkNodes.indexOf(newNodeUrl) == -1;
    //현재 url이 새로운 노드 주소가 아니라면, (현재 접속한 주소와 중복되지 않는다면)
    const notCurrentNode = device.currentNodeUrl !== newNodeUrl;

    if(nodeNotAlreadyPresent && notCurrentNode){
        //전체 네트워크에 새로운 주소 등록
        device.networkNodes.push(newNodeUrl);
    }    
    res.json({note: "New node registered successfully."});
});

//네트워크에있던 기존 노드들의 주소를 새 노드에 등록.
app.post('/register-nodes-bulk', function(req, res){
    //기존 블록체인 네트워크에 있는 모든 노드들의 URL.
    const allNetworkNodes = req.body.allNetworkNodes;
    //새 노드에 기존 노드들의 주소 등록.
    allNetworkNodes.forEach(networkNodeUrl => {
        //등록하려는 노드 url이 기존에 존재하지 않다면,
        const nodeNotAlreadyPresent = device.networkNodes.indexOf(networkNodeUrl) == -1;
        //등록하려는 노드 url이 현재 url이 아니라면,
        const notCurrentNode = device.currentNodeUrl !== networkNodeUrl;
        // 새 노드에 기존 노드 등록
        if(nodeNotAlreadyPresent && notCurrentNode){
            device.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({note: 'Bulk registration successful.'});
});

//블록체인을 복사해서 유효한 체인인지검증.
app.get('/consensus', function(req,res){
    const requestPromises = [];
    device.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        //비동기작업을 위해 promise배열에넣음
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains=> { //requestPromises배열에있는 것을 실행한 후 data를 얻는데 이는 모든노드의 블록체인 배열.
        //현재노드의 블록체인 길이
        const currentChainLength = device.chain.length;
        //가장 긴 체인길이를 담을것이다. 처음에는 현재노드의 체인길이.
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newMemPool = null;
        
        //현재노드의 블록체인보다 다른노드에서 더 긴 블록체인이 나오면 긴걸로 교체.
        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newMemPool = blockchain.memPool;
            };
        });
        
        //새로운 가장긴 체인이 없거나, 새로운 가장긴체인이있지만 유효하지않다면 교체하지않는다.
        if(!newLongestChain || (newLongestChain && !device.chainIsValid(newLongestChain))){
            res.json({
                note:'Current chain has not been replaced.',
                chain: device.chain
            });
        }
        //새로운 가장긴 체인이 있고 그 체인이 유효하다면, 그 체인으로 교체된다.
        else {      //if(newLongestChain && device.chainIsValid(newLongestChain))
            device.chain = newLongestChain;
            device.memPool = newMemPool;
            res.json({
                note: 'This chain has been replaced.',
                chain: device.chain
            });
        }
    });
});

app.listen(port, function(){
    console.log(`listening on port ${port}...`)
});
