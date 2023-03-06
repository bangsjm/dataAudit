const blockchain = require('./blockchain');
const web3 = require('web3');
const { wait, get } = require('./blockchain');
const bloomFilter = require('./bloomFilter');
const EC = require('elliptic').ec;
 

this.from='0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006';
this.to='0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8';
this.keyFrom= Buffer.from('004defbfd31c121f3500f0787d3ae2bc3cc94f028633fd45843c2c5c16579490', 'hex');
this.keyTo= Buffer.from('bc10b4cc7103b30a2d8e59e93a236b491ca311342b800bff1eb9b4dbaaa56d50', 'hex');
// var token ={
//     transactionHash: "",
//     time: new Date(),

// }
// this.data=web3.utils.toHex(token);


// console.log('data', this.data);


class audit{
    constructor(){
        this.countKeyMap = new Map();
        this.serviceNameMap=new Map();
        this.curve = new EC('secp256k1');
        this.privateKey = '278a5de700e29f22aae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f';//签名token的私钥
        this.curveKey = this.curve.keyFromPrivate(this.privateKey);//签名Token的对象
        this.publicKey = this.curve.keyFromPrivate(this.privateKey).getPublic(true,"hex");
        this.publicKeyObject = this.curve.keyFromPublic(this.publicKey,"hex");
        this.setCountKeyMap();
    }

    setCountKeyMap(){
        this.countKeyMap.set('0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006',
            Buffer.from('004defbfd31c121f3500f0787d3ae2bc3cc94f028633fd45843c2c5c16579490', 'hex'));
        this.countKeyMap.set('0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8',
            Buffer.from('bc10b4cc7103b30a2d8e59e93a236b491ca311342b800bff1eb9b4dbaaa56d50', 'hex'));
    }

    uploadData(from,to,transDataHex,transData){
        return blockchain.initAcount(from).then(()=>{
           return blockchain.upload(from,to,this.countKeyMap.get(from),transDataHex,transData,'1');
        })
    }

    getTokenByTransactionHash(transactionHash){
        let res="";
        return blockchain.getTokenByTransactionHash(transactionHash);
       
    //    console.log(res);
    //    return res;
    }

    signToken(token){
        var tokenHex=web3.utils.toHex(token);//这个tokenHex!=CertificateHash,CertificateHash是没有添加CertificateHash时的token摘要.
                                            //tokenHex是添加了CertificateHash时的token摘要,用于生成SignatureValue
        var signed = this.curveKey.sign(tokenHex, this.privateKey);
        var derSign = signed.toDER('hex');
        token.SignatureValue=derSign;
        // console.log(derSign);
        return token;
    }
    
    verityToken(token){
        var signed=token.SignatureValue;
        token.SignatureValue="";
        var tokenHex=web3.utils.toHex(token);
        var check = this.curveKey.verify(tokenHex, signed);
        token.SignatureValue=signed;
        console.log(check);
        return check;
    }

    createToken(operationType,lastTransactionHash,contenHash,LastContentHash,ServiceName,Name){
        var days=Math.ceil(Math.random() * 30)+30;
        var token ={
            version: 1,
            ServiceName:ServiceName,
            Name:Name,
            ContentHash:contenHash,
            LastContentHash:LastContentHash,
            HashAlgorithm:"",
            SignatureAlgorithm:"",
            OperationType:operationType,
            ExpirationTime:"",
            CertificateHash:"",
            SignatureValue:"",
            time: Date.parse(new Date()),
            //transactionHash: "",
            LastTransactionHash: lastTransactionHash//放在最后一项
        }
        token.ExpirationTime=token.time+days*86400000;
        var tokenHex=web3.utils.toHex(token);
        token.CertificateHash=tokenHex;
        return token;
    }

    createUploadToken(LastTransactionHash){
        return this.createToken("Upload",LastTransactionHash);
    }

    createUpdateToken(LastTransactionHash){
        return this.createToken("Update",LastTransactionHash);
    }

    createDeleteToken(LastTransactionHash){
        return this.createToken("Delete",LastTransactionHash);
    }

    getStr(cfg){
        if(cfg === undefined) cfg = {}
        const getValue = (s, d) => {
            if([undefined, null].includes(s)) return d
            else return s
        }
        cfg = {
            split:  getValue(cfg.split, ''),    // 分割字符 
            splitNum: parseInt(cfg.splitNum) || 0,   // 分隔个数
            num: parseInt(cfg.num) || 16,             // 字符个数 默认16
            char: getValue(cfg.char, 'dAa') ,        // d数字 A大写的字符 a小写的字符
            append: getValue(cfg.append, '@*!+-=*&[()`?.') , // 支持数组[]和字符串 一般指特殊字符@*!+-=*&[()`?.
            ignore: getValue(cfg.ignore, '')                       // 支持数组[]和字符串 优先级最高 
        }
        // console.log(cfg)
        let set = new Set()
        const getChars = (str) => {
            for(const s of str) set.add(s)
        }
        // 1、先取出append特殊字符的编码
        getChars(cfg.append)
        // 2、获取char中的字符集
        const number = "0123456789"
        const bigChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const smallChars = "abcdefghijklmnopqrstuvwxyz"
        for(const s of cfg.char) {
            if(s === 'd') getChars(number)
            else if (s === 'A') getChars(bigChars)
            else if (s === 'a') getChars(smallChars)
            // 其他的字符 自动忽略
        }
        // 3. 排除ignore忽略的元素
        for(const s of cfg.ignore) set.delete(s)
        // 4. 生成数组
        const arr = Array.from(set)
        // console.log(arr)
        // 5. 打乱集合 
        const swap = (firstIndex, secondIdex) => {
            const t = arr[firstIndex]
            arr[firstIndex] = arr[secondIdex]
            arr[secondIdex] = t
        }
        const size = arr.length
        for(let i = 0; i < cfg.num; i++) swap(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
        // 6、生成随机字符串
        let re = ""
        for(let i = 0; i < cfg.num; i++) {
            if(i % cfg.splitNum === 0 && i !== 0) re += cfg.split
            re += arr[Math.floor(Math.random() * size)]
        }
        return re
    }

    regesterService(serviceName){
        console.log("--------------------regesterService----------------------");
        console.log("regester:"+serviceName);
        if(this.serviceNameMap.has(serviceName)){
            console.log("already regester!");
            let resArray=new Array(1);
            resArray[0]= this.serviceNameMap.get(serviceName);
            return resArray;
        }
        var service={
            ServiceName:serviceName,
            Str:this.getStr(),
            time: Date.parse(new Date()),
        }
        this.serviceNameMap.set(serviceName,service);
        let resArray=new Array(1);
        resArray[0]= service;
        console.log("key:"+service.Str);
        console.log("--------------------success----------------------");
        return resArray;
    }

    QueryService(serviceName){
        if(serviceName==""){
            let resArray=new Array(this.serviceNameMap.size);
            let i=0;
            this.serviceNameMap.forEach((data)=>{
                // console.log(data);
                resArray[i++]=data;
            });
            return resArray;
        }else{
            let resArray=new Array(1);
            resArray[0]= this.serviceNameMap.get(serviceName);
            return resArray;
        }
    }

    // verifyIdentity(r,c,serviceName){
    //     var str=this.serviceNameMap.get(serviceName).Str;
    //     var c2=getPromise(r,str);
    //     if(c==c2){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
}

//blockchain.init();



// async function test(){
//     for(var i=1;i<10;++i){
//         await blockchain.upload(this.from,this.to,this.keyFrom,this.data,"1");
//     }
// }
// test()

// blockchain.getTokenByTransactionHash('0xfc2879030afafdf1092bfbdba2ba92ad82f75ddd230d7b0fafa699a785692443');

// blockchain.initAcount(this.from).then(()=>{
//     for(var i=1;i<10;++i){
//         blockchain.upload(this.from,this.to,this.keyFrom,this.data,"1");
//     }
// });



// while(true){
//     if(parseInt(blockchain.initFlag)==2){
//         for(var i=1;i<10;++i){
//             blockchain.upload(this.from,this.to,this.keyFrom,this.data,"1");
//         }
//         break;
//     }
// }

module.exports = new audit();