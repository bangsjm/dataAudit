# dataAudit
1.安装Node.js
========================================
（1）下载地址http://nodejs.cn/download/<br>
（2）双击安装包，一直点击下一步<br>
（3）在键盘按下【win+R】键，输入cmd，然后回车，打开命令行界面<br>
（4）node -v        显示安装的nodejs版本<br>
（5）npm -v        显示安装的npm版本<br>

2.安装Npm
========================================

（1）先配置npm的全局模块的存放路径以及cache的路径<br>
      例如希望将以上两个文件夹放在NodeJS的主目录下，便在NodeJs下建立"node_global"及"node_cache"两个文件夹。<br>
（2）启动cmd，输入<br>
      npm config set prefix "C:\Program Files\nodejs\node_global"<br>
      npm config set cache "C:\Program Files\nodejs\node_cache"<br>
（3）进入环境变量对话框，在系统变量下新建" NODE_PATH"，输入” C:\Program Files\nodejs\node_global\node_modules“。<br>
（4）在系统变量的Path下新增C:\Program Files\nodejs<br>
（5）在用户变量的Path下新增 C:\Program Files\nodejs\node_global<br>

3.安装Express
=========================================
（1）npm -v<br>
（2）npm install -g express-generator<br>
（3）express --version<br>


4.安装Web3.js
=========================================
（1）npm -v<br>
（2）npm install -g web3 <br>


5.安装Ganache
===========================================
（1）下载地址为：https://trufflesuite.com/ganache//<br>
（2）使用安装包安装即可。<br>


6.安装Redis
========================
（1）下载连接 https://github.com/tporadowski/redis/releases<br>
（2）双击redis-server.exe启动服务端<br>
（3）双击redis-cli.exe启动客户端连接服务端<br>
（4）在客户端输入 “ping”，出现“PONG”，即证明连接成功<br>

7.安装依赖库
================================================
（1）npm install -g bloom-redis --save <br>
（2）npm install -g redis --save <br>
（3）npm install -g crypto-js <br>
（4）npm install -g multer <br>


8.配置环境
===============================
（1）运行Ganache<br>
（2）选取两个区块链账号的ADRESS和PRIVATE KEY<br>
（3）将blockchain.js的this.accounts和this.keys复制选取的区块链账号和私钥，如下图：<br>
![image](https://user-images.githubusercontent.com/31236015/223599912-e86db708-39c5-4e37-8d25-e9f0334619d0.png)<br>
（4）audit.js的this.from，this.to，this.keyFrom，this.keyTo替换为选取的区块链账号和私钥，如下图：<br>
![image](https://user-images.githubusercontent.com/31236015/223608262-cfa47b63-9bc6-4952-a38f-63c21e7685ba.png)<br>
（5）在Ganache查看区块链的运行端口,如下图为HTTP://localhost:7545<br>
![image](https://user-images.githubusercontent.com/31236015/223607684-0e596e1f-d79c-47a7-86f7-5433d2a1d521.png)<br>
（6）将blockchain.js的地址替换为步骤（5）中的地址，如下图所示<br>
![image](https://user-images.githubusercontent.com/31236015/223607941-80804b3a-9a13-4d9b-9de9-047963e5d0a1.png)<br>

9.运行系统
=======================================
（1）打开Code文件夹所在目录，输入node demo.js<br>
（2）打开Vue/audit文件夹所在目录，首先运行 npm install ，然后运行npm run dev

