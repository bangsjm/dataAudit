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

3.安装Express
=========================================
（1）npm -v<br>
（2）npm install -g express-generator<br>
（3）express --version<br>


4.安装Web3.js
=========================================
（1）npm -v<br>
（2）npm install web3<br>


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


7.配置环境
===============================
（1）运行Ganache<br>
（2）选取区块链两个账号的ADRESS和PRIVATE KEY<br>
（3）
