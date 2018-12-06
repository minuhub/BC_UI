//sha256 모듈을 가져다 쓰겠다.
const sha256 = require('sha256');
//현재 노드의 url.  package.json scripts 객체에서 3번째 방에 들어있는 데이터. (http://localhost:3001..)
const currentNodeUrl = process.argv[3];
//log의 unique id
const uuid = require('uuid/v1');

//블록체인 데이터 구조
function Blockchain(){
    this.chain = [];
    this.memPool = [];

    //현재 노드 URL
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    //제네시스 블록 - 임의의 인자값 넣어줌.
    this.createNewBlock('0','0');
};

//블록체인 프로토타입 함수의 정의
Blockchain.prototype.createNewBlock = function(previousBlockHash, hash){
    //새 블록 객체
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        logs: this.memPool,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    //풀을 비워주고 새로운 블록을 chain 배열에 추가.
    this.memPool = [];
    this.chain.push(newBlock);

    return newBlock;
};

//마지막 블록 얻기 - chain 배열에는 블록데이터가 들어간다. 맨 마지막 블록을 가져오는 함수.
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
};

//새로운 데이터 발생했을 때 작동되는 함수
//인자값으로 데이터발생 시간, 내용
Blockchain.prototype.createNewLogs = function(time, data){
    const newLog = {
        time : time,
        data : data,
        logId: uuid().split('-').join('')
    };
    return newLog;
};

//생성된 로그 객체를 받아와 블록체인의 memPool에 추가.
Blockchain.prototype.addLogToMemPool = function(logObj){
    this.memPool.push(logObj);
    // 로그가 추가될 블록의 index를 리턴.
    return this.getLastBlock()['index'] + 1;
};

//해쉬 값 리턴 함수
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData){
    const dataAsString = previousBlockHash + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
};

//체인이 유효한지 확인
Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain = true;

    //제네시스블록은 예외이므로 0이아니라 1부터시작.
    for (var i = 1; i < blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
 
        //현재블록의 previousBlockHash값과 이전블록의 hash값이 동일하면 유효.
        //값이 같지않으면 체인이 유효하지않다. 
        if(currentBlock['previousBlockHash'] !== prevBlock['hash']){
            validChain = false;
        }
    };

    //제네시스블록은 예외. 특수한블록
    const genesisBlock = blockchain[0];
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctLogs = genesisBlock['logs'].length === 0;    

    if(!correctPreviousBlockHash || !correctHash || !correctLogs){
        validChain = false;
    }
    
    //chain이 유효하면 true, 유요하지않으면 false반환
    return validChain;
};

//Blockchain 모듈화
module.exports = Blockchain;
