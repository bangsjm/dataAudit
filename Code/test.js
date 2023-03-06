const audit = require('./audit');
const bloomFilter = require('./bloomFilter');
const web3 = require('web3');
//const BloomFilter = require('bloom-filter')
const { wait, get, flag } = require('./blockchain');

const jsSHA = require("jssha") //commonjs
const CryptoJs = require ('crypto-js');

const path = require('path');
const express = require('express');
var router = express.Router();

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// const upload = multer({dest: 'upload/'})

// const upload = multer({
//     // 文件上传的位置
//     // dest: path.join(__dirname, "../public/uploads"),
//     fileFilter(req, file, callback) {
//       // 解决中文名乱码的问题 latin1 是一种编码格式
//       file.originalname = Buffer.from(file.originalname, "latin1").toString(
//         "utf8"
//       );
//       callback(null, true);
//     },
//     storage: multer.diskStorage({
//       //上传文件的目录
//       destination: path.join(__dirname, '/upload/'),//上传的相对路径
//       //上传文件的名称
//       filename: function (req, file, cb) {
//         cb(null, decodeURI(file.originalname))
//       }
//     })
//   });

const fs = require('fs')

const shaObj = new jsSHA("SHA-512","TEXT",{encoding:"UTF8"})


test=express();
let bodyParser = require("body-parser")
// 是否进行url解码
 // 将数据转换为json格式
test.use(bodyParser.json())
// test.use(bodyParser.urlencoded({extended:true})) 

this.token ={
    transactionHash: "",
    time: new Date(),
    LastTransactionHash: "0x63ad4a5943d129ba5b38bafca8c7047e99dae2be6c8bbe0506001b918b363ecb"//放在最后一项
}
this.tokenHex=web3.utils.toHex(this.token);

async function getHistoryTokenByTransactionHash(transactionHash){
    console.log("-------------------getHistoryTokenByTransactionHash----------------------")
    this.transactionHash=transactionHash;
    //var flag=1;
    let dataMap = new  Map();        //创建数组并指定长度
    while(this.transactionHash!=''){
        await audit.getTokenByTransactionHash(this.transactionHash).then(function(data){
            //console.log("test:"+data);
            // var index=data.lastIndexOf("LastTransactionHash");
            dataMap.set(this.transactionHash,data);
            // this.transactionHash=data.substring(index+22,data.length-2);
            this.transactionHash=data.LastTransactionHash;
            //console.log("test-transactionHash:"+this.transactionHash);
            // if(flag==3){
            //     this.transactionHash='';
            // }
            // flag=flag+1;
        });
    }
    console.log("HistoryToken:");
    let resArray=new Array(dataMap.size);
    let i=0;
    dataMap.forEach((data)=>{
        // console.log(data);
        resArray[i++]=data;
    });
    
    // console.log(resArray)
    console.log("-------------------success----------------------")
    return resArray;
}

async function uploadData(from,to,reqToken,contenHash,Name){
    console.log("-------------------uploadData----------------------")
    var token =audit.createToken(reqToken.OperationType,reqToken.transactionHash,contenHash,reqToken.ContentHash,reqToken.ServiceName,Name);
    // this.tokenHex=web3.utils.toHex(token);
    // token.CertificateHash=this.tokenHex;
    token=audit.signToken(token);
    bloomFilter.addToAddFilter(token);
    //audit.verityToken(token);
    var transactionHash="";
    var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
    await audit.uploadData(from,to,tokenHex,token).then(function(data){
        transactionHash=data;
    });
    console.log("transactionHash:"+transactionHash);
    console.log("-------------------success----------------------");
    var resMap=new Map();
    resMap.set("transactionHash",transactionHash);
    resMap.set("token",token);
    return resMap;
}


// function uploadData(from,to,LastTransactionHash){
//     console.log("-------------------uploadData----------------------")
//     var token =audit.createToken("",LastTransactionHash);
//     // this.tokenHex=web3.utils.toHex(token);
//     // token.CertificateHash=this.tokenHex;
//     audit.signToken(token);
//     //audit.verityToken(token);
//     var transactionHash="";
//     var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
//     return audit.uploadData(from,to,tokenHex,token);
//     console.log("transactionHash:"+transactionHash);
//     console.log("-------------------success----------------------")
//     return transactionHash;
// }

async function getTokenByTransactionHash(transactionHash){
    console.log("-------------------getTokenByTransactionHash----------------------")
    this.transactionHash=transactionHash;
    //var flag=1;
    let dataMap = new  Map();
    await audit.getTokenByTransactionHash(this.transactionHash).then(function(data){
        //console.log("test:"+data);
        // var index=data.lastIndexOf("LastTransactionHash");
        dataMap.set(this.transactionHash,data);
        //console.log("test-transactionHash:"+this.transactionHash);
        // if(flag==3){
        //     this.transactionHash='';
        // }
        // flag=flag+1;
    });
    console.log("Token--"+transactionHash+"--:");
    dataMap.forEach((data)=>{
        console.log(data);
    });
    console.log("-------------------success----------------------")
    return dataMap.get(transactionHash);
}

async function validToken(token){
    console.log("---------validToken---------");
    var begin=new Date();

    // console.log(token);
    if(token.ExpirationTime<Date.parse(new Date())){
        return false;
    }
    var flag=await bloomFilter.queryDelFilter(token);
    if(flag){
        return false;
    }
    flag=await bloomFilter.queryAddFilter(token);
    var end=new Date();
    console.log("有效性时间："+end-begin);

    return flag;
}

function changeToToken(token){
    var lastToken ={
        version: 1,
        ServiceName:token.ServiceName,
        Name:token.Name,
        ContentHash:token.ContentHash,
        LastContentHash:token.LastContentHash,
        HashAlgorithm:token.HashAlgorithm,
        SignatureAlgorithm:token.SignatureAlgorithm,
        OperationType:token.LastOperationType,
        ExpirationTime:parseInt(token.ExpirationTime),
        CertificateHash:token.CertificateHash,
        SignatureValue:token.SignatureValue,
        time: parseInt(token.time),
        //transactionHash: "",
        LastTransactionHash: token.LastTransactionHash//放在最后一项
    }
    return lastToken;
}

var to=audit.createToken("","");

// uploadData('0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006','0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8',"0xd5a066a5c23728397bc32b818a184171987834a5af96896abe52f04f777c8282");

// getHistoryTokenByTransactionHash("0x0d41beeaba255a9b98b93ad3817defb3866fe74fcb884d81999a2e1406b9d63d");

// getTokenByTransactionHash("0xc97b701cf194c6cfacf00138cdc40d1f0971cea97e666707eae3cc4652aa53be");

// bloomFilter.addToAddFilter(to);

// bloomFilter.queryAddFilter(to);

// audit.regesterService("vedio");
// audit.regesterService("vedio");

//验证旧token是否加入到DelFilter
// getTokenByTransactionHash("0xeddfba0a4cdf45af0120e2e2fc4c7768c997a155bb417da1fdfaa0421fac4b8a").then(function(res){
//     bloomFilter.queryDelFilter(res).then(function(res1){
//         console.log(res1);
//     });
// })


// //console.log(to);
// var toSign=audit.signToken(to);
// //console.log(toSign);
// //console.log(this.tokenHex);
// toSign.ServiceName="1";
// audit.verityToken(toSign);
// //console.log(toSign);




test.post('/uploadData', function(req,res,next) {
    uploadData('0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006','0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8',req.body)
    .then(function(data){
        // var rmap=new Map();
        // rmap.set("transactionHash",data.get('transactionHash'));
        // rmap.set("token",data.get('token'));
        
        // console.log(rmap);
        res.send({ 
            transactionHash : data.get('transactionHash'), 
            token: data.get('token')
            // data:rmap,
        });
    });
    
  });

  test.get('/getTokenByTransactionHash', function(req,res,next) {
    //check to make sure the query string has 'username'
    getTokenByTransactionHash(req.query.transactionHash).then(function(data){
        res.send({ 
            token : data,
        });
    });
  });

  
  test.post('/uploadStream',upload.single('dict'), function(req,res,next) {
    // const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    // const path = '/upload/' + fileName
    // console.log(path);

    // var conten=req.file.buffer.toString("base64");
    // // console.log(req.file.buffer.toString("base64"));
    // shaObj.update(conten);
    // conten=shaObj.getHash("HEX");
    // console.log(conten);
    // console.log(req.body.ServiceName);
    var begin=new Date();
    if(req.body.OperationType=="上传"){
        var conten=Buffer.from(req.file.buffer, "latin1").toString();
        contenHash=CryptoJs.MD5(conten).toString();
        var fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        req.body.transactionHash="";
        uploadData('0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006','0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8',req.body,contenHash,fileName)
        .then(function(data){
            // var rmap=new Map();
            // rmap.set("transactionHash",data.get('transactionHash'));
            // rmap.set("token",data.get('token'));
            
            // console.log(rmap);
            res.send({ 
                transactionHash : data.get('transactionHash'), 
                token: data.get('token'),
                flag:true
                // data:rmap,
            });
        });
    }else{
        // var conten1=Buffer.from(req.files[0].buffer, "latin1").toString();
        // var conten2=Buffer.from(req.files[1].buffer, "latin1").toString();
        // console.log("conten1:"+conten1);
        // console.log("conten2:"+conten2);
        // contenHash1=CryptoJs.MD5(conten1).toString();
        // contenHash2=CryptoJs.MD5(conten2).toString();
        // if(contenHash1!=req.body.LastContentHash){
        //     res.send({ 
        //         data : false,
        //     });
        // }
        // console.log(contenHash);
        var conten=Buffer.from(req.file.buffer, "latin1").toString();
        contenHash=CryptoJs.MD5(conten).toString();
        var fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        // console.log(req.body);
        var lastToken=changeToToken(req.body);
        validToken(lastToken).then(function(resFlag){
            //console.log("validToken:"+resFlag);
            if(!resFlag){
                res.send({ 
                    flag: false
                    // data:rmap,
                });
            }else{
                bloomFilter.addToDelFilter(lastToken);
                uploadData('0x3e987639Ae018b1172eBBfa2711bAa60Dc6D2006','0x35AB91Cc3f327a1742A09789F7Ff3b4D72d3B0f8',req.body,contenHash,fileName)
                .then(function(data){
                    // var rmap=new Map();
                    // rmap.set("transactionHash",data.get('transactionHash'));
                    // rmap.set("token",data.get('token'));
                    
                    // console.log(rmap);
                    res.send({ 
                        transactionHash : data.get('transactionHash'), 
                        token: data.get('token'),
                        flag: true
                        // data:rmap,
                    });
                });
            }
            });

    }
    // shaObj.update(conten);
    // conten=shaObj.getHash();
    var end=new Date();
    console.log("审计时间："+(end-begin));

  });

  
  test.post('/getHistoryToken', function(req,res,next) {
    // console.log("de");
    console.log(req.query.data);
    getHistoryTokenByTransactionHash(req.query.data)
    .then(function(data){
        // var rmap=new Map();
        // rmap.set("transactionHash",data.get('transactionHash'));
        // rmap.set("token",data.get('token'));
        
        // console.log(rmap);
        res.send({ 
            token: data
            // data:rmap,
        });
    });
    
  });

  
  test.post('/regesterService', function(req,res,next) {
    // console.log("de");
    var begin=new Date();
    console.log(req.query.data);
    var data =audit.regesterService(req.query.data);
    res.send({ 
        data: data,
        // data:rmap,
    });
    var end=new Date();
    console.log(end-begin);
  });

  
  test.post('/QueryService', function(req,res,next) {
    // console.log("de");
    
    var data =audit.QueryService(req.query.data);
    res.send({ 
        data: data,
        // data:rmap,
    });
    
  });
  test.listen(8010);