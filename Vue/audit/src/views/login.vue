<template>
  <div class="login">
    <el-row :gutter="20">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="platform-title">
            <div class="title">数据审计系统</div>
            <!-- <div>(药品)</div> -->
          </div>
        </el-col>
      </el-row>
      <el-col :span="8" :offset="15">
        <div class="login-content">
          <div class="main">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
              <h2 class="title">欢迎登录</h2>
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" @focus="isUsername=true" @blur="isUsername=false" placeholder="用户名">
                  <!-- <svg-icon slot="prefix" icon-class="user" v-bind:class="{'color-class':isUsername}" class=" input-icon " /> -->
                  <img src="../assets/image/user.png" slot="prefix" class="user">
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @focus="isPassword=true" @blur="isPassword=false" @keyup.enter.native="handleLogin">
                  <!-- <svg-icon slot="prefix" icon-class="password" v-bind:class="{'color-class':isPassword}" class="el-input__icon input-icon " /> -->
                  <img src="../assets/image/pwd.png" slot="prefix" class="user">
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%;height:46px" @keyup.enter.native="handleLogin">
                  <img src="../assets/image/code.png" slot="prefix" class="input-icon">
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </el-form-item>
              <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;color:#fff">记住密码</el-checkbox>
              <el-form-item style="width:100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%; background: linear-gradient(to bottom, #0083ff, #0b53ff);font-size:16px;" @click.native.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>© 2021 All Rights Reserved<br> 晋ICP备2020003903号 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAMAAAC3SZ14AAACBFBMVEVHcEzknkbrvFL04pfow2v//9apiXD/5K3ks1Pq0o736ajt3I3w5MDRq3bn0o7t7bfoxmTy56Tw26b256jqy3vbo1HgrV/v4LH0u1HpwHm+lnP36cv05admSVDcqV+WcVFsW2KIgHjZol/48cPfo1DOkEXdp0/MilTpwGzlrVLpwFjjr1zqzIbduX3msVjTmmXltFLr2HzkvmDt2YHw3HbjuGTz3HjgsFJfPEHqxXHisHOldFrPsYn10WfXvJfw4oh0cXVcRVmFeG/bwZulgWmsjGGmbkHNrH1SOVjywWLfs27vqkndr3Hxy5yMgXXrvlnouFQhI3MbHHjhpkrsx1/enUfVHBXXjD7ttlPTJRl3dnrIRSXXLBfosk3pwV7lvGP10mH0ylzZRiTXZy3ghz/npEEXC2LXVCjrbzLhTyLnu1vs0Wrpx2bzw1boqk+pkmTzyGi7qnaRZUTWlVGzHhcoD1mdCBn3NRPbeTvjkz5tYmnWOB+xo3vPBwS6VSvLVCTQFg7Xr2RseosiFGceKYotQozuezTalUbtwVmTWDPr22zgMxq3llZgHkuKemeFiI1EAEBuJ0rhfDPZEQ3Xu3DZbjjUXDBVV3RcAz2+Lh+il3WpCh21Li7FYT/pZi/dbjCzn2m9pm3kol5pV1rrXB/aBwgTDXO/sIaVhHqxl3aggFekcEYg5SEkAAAAc3RSTlMA/PqN3gbRBP4VKVE9xiQO53lZZuL+2078sKIuQ/vj/v395zXYqst0wuT0z5xi4zrsytiM7OPw+vnN0tuk8IWv+vjqgN7w76/6sX/trDbr///////////////////////////////////////////////+NgsVowAAAXJJREFUGNNjYAACdk4eZzY2Ox5OVgYoYBeXsnYrknd1kRKHiUmzWXTWpc8vzpdlkwYLsCq7yxYlh1UnxaTMUrDhAqlT5vVYPKk7LLK6IWZRlCMvF9Agbr8g+SWTI8PCImvnzQp04mZn8PVUDFqduTQyKSmmNnNhoIM9D4OX94qgVW0N0eHBFTFtCwIVbZkZfBhXtiik1kcnV0xN8a8KqpGQZFCqbGxtrstIj56WnjG3uXVKqhiDUnhE07Ky8sz65Izy2WlN/oxiDLyMictbJpSVlMyMnjMjsLCAQ5LBKjSvoD8wrbR3YmlaUFRIBIclg4hoMWN8YV9Ufk/V9KjG1FAOEQZBFtHwFImExNyIkK6OynZzFmEGfmEBjvBQoIh/QkJeaDyLECsDuxBLSBaHf1xcSEAwR06OKdBDnMxm2fFZAQH+AcHBAXHZJsycDOxcxkYGTEyxsbEB/loChoJ87MDQ4dRXV1VT0dTT1tDR5eNnYAAAHI5j3PTE3yIAAAAASUVORK5CYII=" alt=""></span>
    </div> -->
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
const CryptoJS = require("crypto-js"); //引用AES源码js
export default {
  name: "Login",
  data() {
    return {
      isUsername: false,
      isPassword: false,
      isValidCode: false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        console.log(res);
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", {
              username: this.encrypt(this.loginForm.username),
              password: this.encrypt(this.loginForm.password),
              rememberMe: this.loginForm.rememberMe,
              code: this.loginForm.code,
              uuid: this.loginForm.uuid,
            })
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    // 加密
    encrypt(str) {
      var key = CryptoJS.enc.Utf8.parse("cBssbHfxdA==HaaT");
      var encryptedData = CryptoJS.AES.encrypt(str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encryptedData.toString();
    },
    // 解密
    aesDecode(encryptedStr) {
      var encryptedHexStr = CryptoJS.enc.Base64.parse(encryptedStr);
      var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decryptedData.toString(CryptoJS.enc.Utf8);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0d1d30;
  background: url("../assets/image/back.png") no-repeat;
  position: relative;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  // background-size: cover;
  // -webkit-background-size: cover;
  // -o-background-size: cover;
  // background-position: center -100px;
  .platform-title {
    // margin-right: 100px;
    // position: absolute;
    padding-top: 9%;
    padding-left: 20%;
    color: #fff;
    text-align: center;
    font-size: 50px;
    text-align: left;
    // left: ;
    // top: ;
    .title {
      margin-bottom: 20px;
    }
  }
}

.login-content {
  // padding: 0 0 0 120px;
}
.main {
  // position: absolute;
  // right: 300px;
  // top: 275px;
  // left: 0;
  position: relative;
  width: 338px;
  height: 422px;
  background: url("../assets/image/login-back.png");
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  // border-radius:12px;
  // box-shadow: 0px 2px 12px 0px rgba(9, 23, 39, 1);
  color: rgba(255, 255, 255, 1);

  .img1 {
    position: absolute;
    top: 46px;
    left: 53px;
    width: 110px;
  }
  .img2 {
    position: absolute;
    top: 63px;
    left: 132px;
    width: 348px;
    height: 299px;
  }
  h3 {
    margin-left: 52px;
    margin-top: 383px;
    margin-bottom: 0;
    font-size: 32px;
  }
  h4 {
    margin-left: 52px;
    font-size: 24px;
    margin-top: 16px;
  }
  .login-form {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 6px;
    // background: #ffffff;
    width: 100%;
    height: 495px;
    padding: 33px 38px;
    .title {
      // width:85px;
      font-size: 30px;
      margin: 0px auto 36px auto;
      // border-bottom: 3px rgba(27, 74, 127, 1) ridge;
      text-align: center;
      color: #333333;
      padding-bottom: 8px;
      color: #fff;
    }

    .el-input {
      height: 32px;
      　 input:focus {
        color: rgba(6, 104, 185, 1);
      }
      input::-webkit-input-placeholder {
        color: #2f4295;
      }
      input {
        outline: none;
        height: 38px;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 5px;
      }
    }
    // .color-class {
    //   color: rgba(6, 104, 185, 1);
    // }
    .input-icon {
      // height: 39px;
      width: 19px;
      margin-left: 2px;
    }
  }
}
.el-input--prefix .el-input__inner {
  padding-left: 40px;
}
.el-input__prefix {
  padding-left: 6px;
  height: 100%;
  padding-top: 5px;
  img {
    width: 17px;
    height: 20px;
  }
  /deep/.el-input__inner {
    padding-left: 40px !important;
  }
}
.login-code {
  position: absolute;
  width: 88px;
  height: 32px;
  right: 0;
  bottom: 14px;
  img {
    width: 88px;
    height: 38px;
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: absolute;
  transform: translateY(273px);
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  span {
    img {
      height: 12px;
    }
  }
}
</style>
