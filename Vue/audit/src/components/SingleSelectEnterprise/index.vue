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
    <el-table v-loading="loading" :data="Modeler" ref="multipleTable" @current-change="handleCurrentChange" @selection-change="selectCompany" @select-all="selectAll">
      <el-table-column type="selection" width="55" />
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
  name: "SingleSelectEnterprise",
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
    deptId: {
      type: [String, Number],
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
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        compTypeId: "",
      },
      selection: [],
      tradeList: [],
      form: {},
      selectDataArrL: "",
    };
  },
  created() {
    if (this.deptId) {
      this.queryParams.deptId = this.deptId;
    }
    if (this.objectId && !this.deptId) {
      this.queryParams.compTypeId = this.objectId;
      this.getCompanyList();
    } else {
      this.getCompanyList();
    }
    this.getIndustryTypeList();
  },
  methods: {
    // 获取行业类型列表
    getIndustryTypeList() {
      getIndustryTypeList().then((res) => {
        this.tradeList = res.data ? res.data : [];
      });
    },
    selectAll(arr) {
      this.$refs.multipleTable.clearSelection();
    },
    selectCompany(selection, row) {
      // 选择公司
      this.selection = []; //清空已选
      // 选择项大于1时
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      this.selection.push(selection[0]);
      this.$refs.multipleTable.toggleRowSelection(selection[0], true);
    },
    handleCurrentChange(val) {
      this.form.name = val.name;
      this.form.objectId = val.objectId;
    },
    // 获取企业列表
    getCompanyList() {
      getCompanyList(this.queryParams).then((res) => {
        this.Modeler = res.rows;
        if (this.companyId) {
          this.$nextTick(function () {
            this.Modeler.forEach((listitem) => {
              if (this.companyId == listitem.objectId) {
                this.selectCompany([listitem]);
              }
            });
          });
        }
        this.total = res.total;
        this.loading = false;
      });
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
      // this.form.name = this.selection[0].name;
      // this.form.objectId = this.selection[0].objectId;
      this.form = this.selection[0];
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
