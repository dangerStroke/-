<template>
    <div class="children_box">
        <Table :columns="col" :data="data">
            <template slot-scope="{ row,index }" slot="type">
                <div class="timer_box">
                    <p v-if="row.type === 1">按天循环</p>
                    <p  v-if="row.type === 2">按周循环</p>
                    <p  v-if="row.type === 3">按日期循环</p>
                </div>
            </template>
            <template slot-scope="{ row,index }" slot="timer">
              <div class="timer_box" v-if="row.type === 1">
                <div v-for="(value,key,index) in row.day" :key="index">
                  <p v-if="key === 'start'">往：</p>
                  <p v-if="key === 'end'">返：</p>
                  <p v-for="(timer,timerIndex) in value" :key="timerIndex">
                    <span v-for="(timerValue,timerKey,valueIndex) in timer" :key="valueIndex">{{timerValue}}</span>
                  </p>
                </div>
              </div>
              <div class="timer_box" v-if="row.type === 2">
                  <p class="detail_text" @click="modifyList(row,'detail')">查看详情</p>
              </div>
              <div class="timer_box" v-if="row.type === 3">
                <div v-for="(value,key,index) in row.date" :key="index">
                  <p v-if="key === 'start'">往：</p>
                  <p v-if="key === 'end'">返：</p>
                  <p v-for="(timer,timerIndex) in value" :key="timerIndex">
                    <span v-for="(timerValue,timerKey,valueIndex) in timer" :key="valueIndex">{{timerValue}}</span>
                  </p>
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="action">
                <div class="btn_box">
                    <Button type="primary" @click="modifyList(row,'detail')">查看详情</Button>
                    <Button type="primary" @click="modifyList(row,'edit')">修改</Button>
                    <Button type="error" @click="deleteRecord(row.id)">删除</Button>
                </div>
            </template>
        </Table>
    </div>
</template>
<script>
export default {
  props: {
    row: Object,
    // route_id: Number
  },
  data() {
    return {
      col: [
        {
          type: "index",
          title: "序号",
          width: 80
        },
        {
          title: "车辆",
          key: "plate_no"
        },
        {
          title: "停放站点",
          key: "park_name"
        },
        {
          title: "司机",
          key: "driver_name"
        },
        {
          title: "班次类型",
          slot: "type"
        },
        {
          title: "班次",
          slot: "timer"
        },
        {
          title: "操作",
          align: "center",
          width: 300,
          slot: "action"
        }
      ],
      data: [],
      routeId: "",
    };
  },
  created() {
    this.data = this.row.cars;
    this.routeId = this.row.id
    console.log(`线路id${this.route_id}`)
    // console.log(this.params.row.childsRoles)
  },
  methods: {
    deleteRecord (id) {
      this.$emit("removeList",this.row,id)
    },
    modifyList(row,type) {
      this.$emit("editList", row, type,this.routeId)
    },
  }
};
</script>
<style lang="less" >
.children_box {
  td.ivu-table-expanded-cell {
    padding: 0 0;
  }
  .timer_box {
    padding: 15px 0;
    .detail_text{
      text-decoration: underline;
      font-size: 18px;
      color: blue;
      font-weight: bold;
      cursor: default;
    }
  }
}
td.ivu-table-expanded-cell {
  padding: 0 0;
}
</style>
