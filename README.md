# dataAudit
1.安装Node.js
========================================
（1）wget https://nodejs.org/dist/v14.15.1/node-v14.15.1-linux-x64.tar.xz<br>
（2）tar -xvf node-v10.13.0-linux-x64.tar.xz<br>
（3）mv node-v10.13.0-linux-x64 nodejs  <br>
（4）mv /root/nodejs/ /usr/sbin/<br>
（5）ln -s /usr/sbin/nodejs/bin/node /usr/local/bin/<br>
（6）ln -s /usr/sbin/nodejs/bin/npm /usr/local/bin/<br>
（7）node -v<br>
（8）npm -version<br>

2.安装npm
========================================

(1)先配置npm的全局模块的存放路径以及cache的路径<br>
例如希望将以上两个文件夹放在NodeJS的主目录下，便在NodeJs下建立"node_global"及"node_cache"两个文件夹。<br>
(2)启动cmd，输入<br>
npm config set prefix "C:\Program Files\nodejs\node_global"<br>
npm config set cache "C:\Program Files\nodejs\node_cache"<br>
(3)进入环境变量对话框，在系统变量下新建" NODE_PATH"，输入” C:\Program Files\nodejs\node_global\node_modules“。<br>

3.安装express
=========================================
（1）npm -v<br>
（2）npm install -g express-generator<br>
（3）express --version<br>


4.安装web3.js
=========================================
（1）npm -v<br>
（2）npm install web3<br>


5.安装ganache
===========================================
（1）下载地址为：https://trufflesuite.com/ganache//<br>
（2）使用安装包安装即可。<br>


6.安装Redis
========================
（1）下载连接 https://github.com/tporadowski/redis/releases<br>
（2）双击redis-server.exe启动服务端<br>
（3）双击redis-cli.exe启动客户端连接服务端<br>
（4）在客户端输入 “ping”，出现“PONG”，即证明连接成功<br>



