<template>
  <el-dialog :title="title" :visible.sync="show" width="85%" :before-close="handleClose" center :close-on-click-modal="false">
    <el-row :gutter="20" justify="center" style="margin-bottom:20px">
      <el-col :span="12">
        <el-input v-model="queryParams.nickName" style="display:inline;width:300px" placeholder="请输入姓名"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="display:inline-block" @click="search">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="card">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
          <!-- <el-tree :props="defaultProps" :data="treeData" :default-expand-all="true" ref="tree" @node-click="selectNode">
          </el-tree> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }" class="card" v-loading="loading">
          <el-radio-group v-model="name" class="redio-group">
            <el-radio :label="item.userId" class="radio" v-for="item in list" :key="item.userId">{{item.nickName}}</el-radio>
          </el-radio-group>
        </el-card>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listUserAll } from "@/api/system/user";
export default {
  components: {
    Treeselect,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
        };
      },
    },
  },
  data() {
    return {
      deptOptions: [],
      name: "",
      list: [],
      form: {},
      queryParams: {},
      loading: false,
    };
  },
  created() {
    this.getTreeselect();
  },
  methods: {
    // 点击部分查询人员列表
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 搜索昵称
    search() {
      this.getList();
    },
    // 获取部分树
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
        console.log(this.deptOptions);
      });
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 关闭
    handleClose() {
      this.$emit("close");
    },
    // 确认选择
    confirmSubmit() {
      let current = {};
      for (let i = 0; i < this.list.length; i++) {
        if (this.name == this.list[i].userId) {
          current.nickName = this.list[i].nickName;
          current.userId = this.list[i].userId;
          break;
        }
      }
      this.$emit("confirm", current);
    },
    // 选择节点
    selectNode(current) {
      this.getList(current.id);
    },
    // 获取人员列表
    getList(id) {
      this.loading = true;
      listUserAll(this.queryParams).then((response) => {
        this.list = response.data;
        // this.total = response.total;
        this.loading = false;
      });
      // this.$emit("getNameList", id, (list) => {
      //   this.list = list;
      // });
    },
  },
  mounted() {},
};
</script>

<style scoped lang='scss'>
.card:nth-child(1) {
  margin-right: 20px;
}
.card {
  height: 400px;
  overflow: auto;
  padding-top: 10px;
  padding-left: 10px;
}
.redio-group {
  .el-radio {
    display: block;
    padding: 6px 0;
  }
}
</style>
