<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="6">
        <el-form :label-position="left" size="medium " label-width="110px" class="search" :model="token" >
        <el-form-item label="请选择操作类型" >
        <el-select  placeholder="请选择操作类型"  v-model="token.OperationType"  @change="selectChange" style="width: 100%;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
        </el-form-item>
        <el-form-item label="请选择数据类型">
              <el-select v-model="token.ServiceName" placeholder="请选择数据类型" style="width: 100%;">
                <el-option
                  v-for="item in optionsServiceName"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>      
        </el-form-item>
          </el-form>
          <el-upload ref="upload" :limit="1"  :name="dict" :headers="upload.headers"	 :data="token" :action="upload.url" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"  :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“bpmn”、“bar”或“zip”格式文件！</div> -->
      </el-upload>
      <div  class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
     </el-col>
      <el-col :span="10" style="border:1px solid transparent">
        <div></div>
      </el-col>
     <el-col :span="10">
    <el-form :label-position="left" size="medium " label-width="88px" class="search" :model="token" >
          <el-col >
            <el-form-item label="ID">
            <el-input  v-model="transactionHash"></el-input>
          </el-form-item>
          <el-form-item label="文件名">
            <el-input  v-model="token.Name"></el-input>
          </el-form-item>
          
          <el-form-item label="操作类型" >
            <el-input  v-model="token.LastOperationType"></el-input>
            </el-form-item>
          <el-form-item label="数据类型">
            <el-input  v-model="token.ServiceName"></el-input>
          </el-form-item>
          <el-form-item label="生成时间">
            <el-input >
              <template  slot="prefix">
                <div v-show="token.time!=''">
                  <span ><font color="black">{{parseTime(new Date(token.time))}}</font></span>
                </div>
              </template>
          </el-input>
          </el-form-item>
          <el-form-item label="过期时间">
            <el-input :v-if="token.ExpirationTime" >
              <template  slot="prefix" >
                <div v-show="token.ExpirationTime!=''">
                    <span ><font color="black">{{parseTime(new Date(token.ExpirationTime))}}</font></span>
                </div>
              </template>
          </el-input>
          </el-form-item>
            <el-form-item label="文件哈希">
            <el-input v-model="token.ContentHash"></el-input>
          </el-form-item>
          <el-form-item label="Last ID">
            <el-input v-model="token.LastTransactionHash"></el-input>
          </el-form-item>
          <!-- <el-button  type="text"  @click="uploadData">上传</el-button> -->
          </el-col>
      </el-form>
    </el-col>
  </el-row>
    
      
    
    
      
  </div>
</template>

<script>
import {
  uploadData,
  getHistoryToken
} from "@/api/audit/audit";

export default {
  name: "Index",
  components: {
  },
  data() {
    return {
      dict:'dict',
      token:{
          version: 1,
          ServiceName:"",
          Name:"",
          ContentHash:"",
          LastContentHash:"",
          HashAlgorithm:"",
          SignatureAlgorithm:"",
          OperationType:"",
          LastOperationType:"",
          ExpirationTime:"",
          CertificateHash:"",
          SignatureValue:"",
          time: "",
          //transactionHash: "",
          LastTransactionHash: "",//放在最后一项
          transactionHash:""
      },
      UploadContentHash:"",
      transactionHash:"",
      options: [{
          value: '上传',
          label: '上传'
        }, {
          value: '修改',
          label: '修改'
        }, {
          value: '删除',
          label: '删除'
        }],
      optionsServiceName: [{
          value: '文本',
          label: '文本'
        }, {
          value: '图片',
          label: '图片'
        }, 
        ],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          "/uploadStream",
      },

    };
  },
  mounted() {
  },
  
  // watch: {
  //   'token.OperationType'(newVal, oldVal) {
  //       this.token.LastOperationType=oldVal;
  //   		 // 业务代码
  //   	}
  // },

  methods: {
    uploadData() {
      uploadData(this.token).then((res) => {
        this.transactionHash=res.transactionHash;
        this.token.transactionHash=res.transactionHash;
        this.token.time=res.token.time;
        this.token.ServiceName=res.token.ServiceName;
        this.token.ContentHash=res.token.ContentHash;
      });
    },

    selectChange(data){
      //this.$alert(data);
      if(data=="上传"){
        this.transactionHash="";
        this.token.time="";
        this.token.ServiceName="";
        this.token.ContentHash="";
        this.token.transactionHash="";
        this.token.Name="";
        this.token.ExpirationTime="";
        this.token.LastContentHash="";
        this.token.HashAlgorithm="";
        this.token.SignatureAlgorithm="";
        this.token.CertificateHash="";
        this.token.SignatureValue="";
        this.token.LastTransactionHash="";//放在最后一项
        //this.token.OperationType=data;
        this.token.LastOperationType="";
      }
    },
    
    handleFileBefore(file){

    },
     // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(res, file, fileList) {
      if(!res.flag){
        this.$confirm('Token错误！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        })
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
        return ;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      //this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      //this.getList();
      this.transactionHash=res.transactionHash;
      this.token.transactionHash=res.transactionHash;
      this.token.time=res.token.time;
      this.token.ServiceName=res.token.ServiceName;
      this.token.ContentHash=res.token.ContentHash;
      this.token.LastTransactionHash=res.token.LastTransactionHash;
      this.token.Name=res.token.Name;
      this.token.ExpirationTime=res.token.ExpirationTime;
      this.token.LastContentHash=res.token.LastContentHash;
      this.token.HashAlgorithm=res.token.HashAlgorithm;
      this.token.SignatureAlgorithm=res.token.SignatureAlgorithm;
      this.token.OperationType=res.token.OperationType;
      this.token.CertificateHash=res.token.CertificateHash;
      this.token.SignatureValue=res.token.SignatureValue;
      this.token.LastOperationType=res.token.OperationType;
    },

    submitFileForm() {
      this.$refs.upload.submit();
    },

 
    
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 84px);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.title {
  text-align: center;
  line-height: 40px;
}
.title-content {
  text-align: right;
  .title-le {
    line-height: 20px;
  }
  .num {
    // text-align: center;
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
