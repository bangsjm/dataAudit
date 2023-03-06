<template>
  <el-dialog :title="title" :visible.sync="show" width="85%" :before-close="handleClose" center :close-on-click-modal="false">

    <el-row :gutter="20" justify="center" style="margin-bottom:20px">
      <el-col :span="12">
        <el-input v-model="queryParams.nickName" style="display:inline;width:300px" placeholder="请输入姓名"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" style="display:inline-block" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }" class="card">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :span="16">
        <!-- <el-transfer style="text-align: left; display: inline-block" v-model="selectList" :props="props" :titles="['姓名', '姓名']" :button-texts="['删除', '添加']" @change="handleChange" :data="userList">
          </el-transfer> -->
        <el-col :span="10">
          <el-card :body-style="{ padding: '0px' }" class="card">
            <div slot="header" class="clearfix">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">姓名</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in list" :label="item.userId" :key="item.userId" class="check-item">{{item.nickName}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
        <el-col :span="4">
          <div class="opera-content">
            <div class="oprea-btn" @click="addToLeft">添加</div>
            <div class="oprea-btn" @click="deleteToRight">删除</div>
          </div>
        </el-col>
        <el-col :span="10">
          <el-card :body-style="{ padding: '0px' }" class="card">
            <div slot="header" class="clearfix">
              <el-checkbox :indeterminate="isIndeterminateRight" v-model="checkAllRight" @change="handleCheckAllChangeRight">姓名</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkedCitiesRight" @change="handleCheckedCitiesChangeRight">
              <el-checkbox v-for="item in rightList" :label="item.userId" :key="item.userId" class="check-item">{{item.nickName}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import { listUserAll } from "@/api/system/user";
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    checkList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      form: {},
      userList: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      checkAll: false,
      checkedCities: [],
      rightList: this.checkList,
      list: [],
      isIndeterminate: false,
      selectList: [],
      isIndeterminateRight: false,
      checkAllRight: false,
      checkedCitiesRight: [],
      props: {
        key: "userId",
        label: "nickName",
      },
      queryParams: {},
    };
  },
  created() {
    this.getTreeselect();
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      // 筛选节点
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      // 节点单击事件
      this.queryParams.deptId = data.id;
      this.getList();
    },
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    handleClose() {
      this.$emit("close");
    },
    confirmSubmit() {
      this.$emit("confirm", this.rightList);
    },
    handleChange(value, direction, movedKeys) {
      // console.log(value, direction, movedKeys);
    },
    getList() {
      //   this.loading = true;
      listUserAll(this.queryParams).then((response) => {
        this.list = response.data;
        this.checkAll = false;
        this.isIndeterminate = false;
        this.checkedCities = [];
      });
    },
    handleCheckAllChange(val) {
      if (val) {
        var arr = [];
        this.list.map((item) => {
          arr.push(item.userId);
        });
        this.checkedCities = arr;
      } else {
        this.checkedCities = [];
      }
      //   this.checkedCities = val ? this.list : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.list.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
    },
    addToLeft() {
      // 添加到左侧

      this.checkedCities = [...new Set(this.checkedCities)];
      this.list.map((item) => {
        this.checkedCities.map((value) => {
          if (item.userId == value) {
            if (this.rightList.length == 0) {
              this.rightList.push({
                nickName: item.nickName,
                userId: item.userId,
              });
            } else {
              if (this.hasContians(value)) {
                this.msgInfo("已添加");
              } else {
                this.rightList.push({
                  nickName: item.nickName,
                  userId: item.userId,
                });
              }
            }
          }
        });
      });

      //   this.rightList = this.checkedCities;
    },
    deleteToRight() {
      // 从左侧删除
      let arr = [];
      this.checkedCitiesRight.map((value) => {
        this.rightList.map((item, index) => {
          if (item.userId == value) {
            this.rightList.splice(index, 1);
          }
        });
      });
      //   this.rightList = arr;
      this.checkedCitiesRight = [];
    },
    handleCheckAllChangeRight(val) {
      //   this.checkedCitiesRight = val ? this.list : [];
      if (val) {
        let arr = [];
        this.rightList.map((item) => {
          arr.push(item.userId);
        });
        this.checkedCitiesRight = arr;
      } else {
        this.checkedCitiesRight = [];
      }
      this.isIndeterminateRight = false;
    },
    handleCheckedCitiesChangeRight(value) {
      let checkedCount = value.length;
      this.checkAllRight = checkedCount === this.rightList.length;
      this.isIndeterminateRight =
        checkedCount > 0 && checkedCount < this.rightList.length;
    },
    hasContians(value) {
      let bool = false;
      this.rightList.forEach((item) => {
        if (item.userId == value) {
          bool = true;
        }
      });
      return bool;
    },
  },
  watch: {
    checkList: {
      handler(val) {
        this.rightList = val
      },
    },
  },
};
</script>

<style scoped lang='scss'>
.card:nth-child(1) {
  margin-right: 20px;
}
.card {
  height: 400px;
  overflow: hidden;
  padding-top: 10px;
  //   padding-left: 10px;
}

.check-item {
  display: block;
  padding: 6px 15px;
}

.opera-content {
  height: 400px;
  padding-top: 80px;
  .oprea-btn {
    background: #09c;
    color: #fff;
    padding: 8px 16px;
    width: 60px;
    border-radius: 2px;
    cursor: pointer;
  }
  .oprea-btn:nth-child(1) {
    margin-bottom: 20px;
  }
}
</style>
