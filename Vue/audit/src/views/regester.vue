<template>
  <div class="dashboard-editor-container">
   <el-row>
         <el-col :span="8" >
            <el-input v-model="ServiceName" placeholder="请输入服务名"></el-input>
        </el-col>
            <el-col :span="8"> <el-button type="primary" @click="handleQuery">查看</el-button>
            <el-button type="success" @click="handleRegester">注册</el-button>
        </el-col>
   </el-row>
    <el-col>
        <el-table :data="tableData" >
        <el-table-column prop="ServiceName" label="服务名" >
        </el-table-column>
        <el-table-column prop="Str" label="密钥" >
        </el-table-column>
        <el-table-column prop="time" label="注册时间" >
          <template slot-scope="scope" :v-show="scope.row.time!=''">
            <div >
              {{parseTime(new Date(scope.row.time))}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="OperationType" >
            <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleBlack(scope.row)">禁用</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-col>
  </div>
</template>

<script>
import {
  regesterService,
  QueryService
} from "@/api/audit/audit";

export default {
  name: "Index",
  components: {
  },
  data() {
    return {
      token:{
          version: 1,
          ServiceName:"",
          Name:"",
          ContentHash:"",
          LastContentHash:"",
          HashAlgorithm:"",
          SignatureAlgorithm:"",
          OperationType:"",
          ExpirationTime:"",
          CertificateHash:"",
          SignatureValue:"",
          time: "",
          //transactionHash: "",
          LastTransactionHash: "",//放在最后一项
          transactionHash:""
      },
      ServiceName:"",
      tableData:[]
    };
  },
  mounted() {
    
  },
  methods: {
    handleRegester() {
        regesterService(this.ServiceName).then((res) => {
            this.tableData=res.data;
            //this.$alert(res, "导入结果",);
        });
    },
    handleQuery() {
        QueryService(this.ServiceName).then((res) => {
            this.tableData=res.data;
            //this.$alert(res, "导入结果",);
        });
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
