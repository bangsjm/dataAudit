const audit = require('./audit');
const web3 = require('web3');
const { wait, get, flag } = require('./blockchain');
const Bloom = require('bloom-redis');
const express = require('express');
const redis = require('redis');


client = redis.createClient(6379,'127.0.0.1');

addFilter = new Bloom.BloomFilter({ 
    client    : client, //make sure the Bloom module uses our newly created connection to Redis
    key       : 'add-bloom-filter', //the Redis key
    
    //calculated size of the Bloom filter.
    //This is where your size / probability trade-offs are made
    //http://hur.st/bloomfilter?n=100000&p=1.0E-6
    size      : 2875518, // ~350kb
    numHashes : 20
  });

deleteFilter = new Bloom.BloomFilter({ 
client    : client, //make sure the Bloom module uses our newly created connection to Redis
key       : 'delete-bloom-filter', //the Redis key

//calculated size of the Bloom filter.
//This is where your size / probability trade-offs are made
//http://hur.st/bloomfilter?n=100000&p=1.0E-6
size      : 2875518, // ~350kb
numHashes : 20
});

class bloomFilter{

    constructor(){
    }

    addToAddFilter(token){
        console.log("---------addToAddFilter---------");
        console.log(token);
        var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
        addFilter.add(tokenHex,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Token add success at add-bloom-filter!");
            }
        });
    }


    addToDelFilter(token){
        console.log("---------addToDelFilter---------");
        // console.log(token);
        var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
        // console.log(tokenHex);  
        deleteFilter.add(tokenHex,function(err){
            if(err){
                console.log(err);
                return false;
            }else{
                console.log("Token add success at delete-bloom-filter!");
                return true;
            }
        });
    }


    queryAddFilter(token){
        // console.log(token);
        var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
        return new Promise((resolve,reject)=>{
            addFilter.contains(tokenHex,function(err,res){
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        }) 
        //return flag;
    }

    queryDelFilter(token){
        var tokenHex=web3.utils.toHex(token);//签完名以后的摘要，即完整的token;
        // console.log("queryDelFilter:"+tokenHex);  
        return  new Promise((resolve,reject)=>{
            deleteFilter.contains(tokenHex,function(err,res){
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        }) 
    }
}

module.exports = new bloomFilter();