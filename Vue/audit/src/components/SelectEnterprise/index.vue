<template>
  <el-dialog :title="title" :visible.sync="show" width="85%" :close-on-click-modal="false" append-to-body :before-close="close">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="行业类型" prop="tradeId">
        <el-select v-model="queryParams.tradeId" placeholder="行业类型" clearable size="small" style="width:200px">
          <el-option v-for="dict in tradeList" :key="dict.objectId" :label="dict.name" :value="dict.objectId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="Modeler" @selection-change="handleSelectionChange" ref="multipleTable" @select-all="selectAll" @select="selectChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业名称" prop="name" />
      <el-table-column label="企业类型" prop="compTypeName" :show-overflow-tooltip="true" />
      <el-table-column label="法人" prop="link" />
      <el-table-column label="法人手机号" prop="linkMobile" />
      <el-table-column label="所属区域" prop="areaNames" />
      <el-table-column label="许可证" prop="code" />
      <el-table-column label="诚信等级" prop="level">
        <template slot-scope="scope">
          <span v-if="scope.row.level==1">A</span>
          <span v-if="scope.row.level==0">B</span>
          <span v-if="scope.row.level==-1">C</span>
          <span v-if="scope.row.level==-2">D</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getCompanyList" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCompanyList } from "@/api/caseManage/createCase";
import { getIndustryTypeList } from "@/api/siteConfig/modelSitting";

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
    objectId: {
      type: String,
      default: "",
    },
    companyId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // VIEW表格数据
      Modeler: [],
      // 查询参数
      selectDataArrL: [],
      selectNameArr: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        compTypeId: "",
      },
      selection: [],
      tradeList: [],
      form: {},
    };
  },
  created() {
    if (this.objectId) {
      this.queryParams.compTypeId = this.objectId;
      this.getCompanyList();
    } else {
      this.getCompanyList();
    }
    if (this.companyId) {
      this.selectDataArrL = this.companyId.split(",");
    }
    this.getIndustryTypeList();
  },
  methods: {
    // 单独选择
    selectChange(arr, row) {
      // 判断选中数据中是否包含当前的row
      let isHaveItem = this.selectDataArrL.find((item) => item == row.objectId);
      let isHaveItemName = this.selectNameArr.find((item) => item == row.name);
      if (isHaveItem) {
        this.selectDataArrL = this.selectDataArrL.filter(
          (item) => item != isHaveItem
        );
      } else {
        this.selectDataArrL.push(row.objectId);
      }
      if (isHaveItemName) {
        this.selectNameArr = this.selectNameArr.filter(
          (item) => item != isHaveItemName
        );
      } else {
        this.selectNameArr.push(row.name);
      }
    },
    // 全选
    selectAll(arr) {
      // 判断全选选中数据是否为空
      if (arr.length > 0) {
        arr.forEach((ms) => {
          this.selectDataArrL.push(ms.objectId);
          this.selectNameArr.push(ms.name);
        });
      } else {
        arr.forEach((ms) => {
          this.selectDataArrL = this.selectDataArrL.filter(
            (item) => item != ms.objectId
          );
          this.selectNameArr = this.selectNameArr.filter(
            (item) => item != ms.name
          );
        });
      }
    },
    renderTable() {
      if (this.selectDataArrL.length > 0) {
        this.$nextTick(function () {
          this.selectDataArrL.forEach((item) => {
            this.Modeler.forEach((listitem) => {
              if (item == listitem.objectId) {
                this.$refs.multipleTable.toggleRowSelection(listitem, true);
                this.selectNameArr.push(listitem.name);
              }
            });
          });
        });
      }
    },
    // 获取行业类型列表
    getIndustryTypeList() {
      getIndustryTypeList().then((res) => {
        this.tradeList = res.data ? res.data : [];
      });
    },
    // 获取企业列表
    getCompanyList() {
      getCompanyList(this.queryParams).then((res) => {
        this.Modeler = res.rows;
        this.renderTable();

        this.total = res.total;
        this.loading = false;
      });
    },
    duplicateRemoval(arr, current) {
      for (var i = 0; i < arr.length; i++) {
        if (current.objectId == arr[i].objectId) {
          return false;
        } else {
          return true;
        }
      }
    },

    handleSelectionChange(val) {
      // let name = [];
      // let objectId = [];
      // for (let i = 0; i < val.length; i++) {
      //   name.push(val[i].name);
      //   objectId.push(val[i].objectId);
      // }
      // this.form.name = name.join("|");
      // this.form.objectId = objectId.join(",");
    },
    // 设置选中状态
    toggleSelection(row) {
      if (row) {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getCompanyList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 确认选择
    submitForm() {
      this.form.name = this.selectNameArr.join("|");
      this.form.objectId = this.selectDataArrL.join(",");
      this.$emit("confirm", this.form);
    },
    close() {
      this.$emit("close");
    },
    formatter(row) {
      return row.createTime ? this.formatDate(row.createTime) : "";
    },
  },
};
</script>
