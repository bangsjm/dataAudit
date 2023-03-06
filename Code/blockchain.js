
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const ethereumjs_common = require ('ethereumjs-common').default;
const util = require('ethereumjs-util');

class blockchain {
    constructor(){
        this.initFlag=0;
        this.accounts = [
            '0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006',
            '0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8'
        ]
        this.keys = [
            Buffer.from('004defbfd31c121f3500f0787d3ae2bc3cc94f028633fd45843c2c5c16579490', 'hex'),
            Buffer.from('bc10b4cc7103b30a2d8e59e93a236b491ca311342b800bff1eb9b4dbaaa56d50', 'hex')
        ]
        this.txCountsMap = new Map();
        this.common = ethereumjs_common.forCustomChain (
            'ropsten', { 
                networkId: 15, 
                chainId: 15,
                name: 'geth' 
            }, 
            'muirGlacier'
        );
        this.flag = true;

        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            // web3 = new Web3(new Web3.providers.HttpProvider("http://82.156.185.139:8080"));
            this.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
        }

        // this.accounts.forEach((account)=>{
        //     let count=0;
        //     this.web3.eth.getTransactionCount(account).then((count)=>{this.txCountsMap.set(account, count);});
            
        // })

        //this.init();

        // function* initGen(params) {
        //     let count;
        //     count=yield this.web3.eth.getTransactionCount(account);
        //     this.txCountsMap.set(account, count);
        //     return count;
        // }

        // this.accounts.forEach((account)=>{
        //     initGen(account);
        // })
    }

    // async init(){
    //     let count;
    //     for(let account of this.accounts ){
    //         count=await this.web3.eth.getTransactionCount(account);
    //         this.txCountsMap.set(account, count);
    //     }
    // }

    sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
        // console.log('休眠后：' + new Date().getTime());
    }

    init(){
        this.accounts.forEach((account)=>{
            this.web3.eth.getTransactionCount(account).then((res)=>
                {this.txCountsMap.set(account, res),
                console.log(account,res),
                ++this.initFlag,
                console.log(this.initFlag)
                },
            );
        });
        this.sleep(10000);
    }

    async initAcount(account){
        // this.web3.eth.getTransactionCount(account).then((res)=>{
        //     this.txCountsMap.set(account, res);
        // })
        // this.sleep(3000);

        // if(this.txCountsMap.has(account)){
        //     return;
        // }
        if(this.txCountsMap.has(account)){
            return;
        }
        let count=0;
        count= await this.web3.eth.getTransactionCount(account);
        console.log("initAcount:"+account,count);
        this.txCountsMap.set(account, count);
    }

    //并行传输时候,会导致交易没来得及处理，这时候getTransactionCount得到的仍然是上个交易的值，所以改成手动加一
    getTxCount(account) {
        let map = this.txCountsMap;
        if (map.has(account)) {
            var count = map.get(account);
            map.set(account, count + 1);
            return count;
        } else {
            // let count=0;
            // count=await this.web3.eth.getTransactionCount(account);
            // map.set(account,count+1);
            // return count;
        }
    }

    getTxCountTest(account,nonce) {
        let map = this.txCountsMap;
        if (map.has(account)) {
            var count = map.get(account);
            map.set(account, count + 1);
            return count;
        } else {
            map.set(account,nonce+1);
            return nonce;
        }
    }

    upload(from, to, key, dataHex,data, port, callback) {
        let web3 = this.web3;
        // var nonceNow=0;
        // nonceNow= await this.web3.eth.getTransactionCount(from);
        // console.log("nonceNow", nonceNow);

        //this.wait(100000000);
        var txObject = {
            //nonce:    web3.utils.toHex(this.getTxCount(from)),
            nonce:    web3.utils.toHex(this.getTxCount(from)),
            to:       to,
            value:    web3.utils.toHex(web3.utils.toWei(port, 'wei')),
            gasLimit: web3.utils.toHex(210000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: dataHex
        }
        //console.log("txOnce", txObject.nonce);
        const tx = new Tx(txObject, {'common': this.common});
        tx.sign(key);
        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');
        return web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            if (err) console.log('error: ' + err);
            else  {
                // console.log('txHash', txHash);
            }
        }).then(function(successData){
            if(successData){
                data.transactionHash=successData.transactionHash;
            }
            //console.log("transactionHash:"+data.transactionHash+" "+data.time);
            return data.transactionHash;
        })

    }

    getTokenByTransactionHash(transactionHash){
        let web3 = this.web3;
        let input ="";
        return web3.eth.getTransaction(transactionHash)
            .then(function(data){
                // let input;
                if(data){
                    input=data.input;
                }
                input=web3.utils.hexToUtf8(input);
                input=JSON.parse(input);
                //console.log(input);
                return input;
            });
        return input;
    }

    uploadAsyn(from, to, key, data, port, callback) {
        if(this.txCountsMap.has(from)){
            console.log("txOnce",this.txCountsMap.get(from));
            this.uploadRequest(from,to,key,data,port,this.txCountsMap.get(from));
            this.txCountsMap.set(from,this.txCountsMap.get(from)+1);
        }else{
            this.web3.eth.getTransactionCount(from).then((res)=>{
                this.txCountsMap.set(from,res+1);
                console.log("txOnce",res);
                this.uploadRequest(from,to,key,data,port,res);
            });
        }
        
    }

    uploadRequest(from, to, key, data, port,nonce){
        let web3 = this.web3;
        // var nonceNow=0;
        // nonceNow= await this.web3.eth.getTransactionCount(from);
        // console.log("nonceNow", nonceNow);

        //this.wait(100000000);
        var txObject = {
            //nonce:    web3.utils.toHex(this.getTxCount(from)),
            nonce:    web3.utils.toHex(nonce),
            to:       to,
            value:    web3.utils.toHex(web3.utils.toWei(port, 'wei')),
            gasLimit: web3.utils.toHex(210000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            data: data
        }
        const tx = new Tx(txObject, {'common': this.common});
        tx.sign(key);
        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');
        web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            if (err) console.log('error: ' + err);
            else  {
                // console.log('txHash', txHash);
            }
        })
    }

    subscribe = function(account, callback){
        const subscription = this.web3.eth.subscribe('pendingTransactions', (error, result) => {
            if (error) console.log(error)
        })
        .on('data', async (txHash) => {
            //第一次订阅会收到上次的一笔交易，移除
            if (this.flag) {
                this.flag = false;
                return;
            }
            try {
                const trx = await this.web3.eth.getTransaction(txHash)
                // console.log(trx);
                if(trx.from.toString().toLowerCase() !== account.toLowerCase()) {
                    var buf = util.toBuffer(trx.input);
                    var port = parseInt(trx.value);
                    callback(port, buf);
                }
            }
            catch (error) {
                console.log(error)
            }
        })
    }
}
module.exports = new blockchain();