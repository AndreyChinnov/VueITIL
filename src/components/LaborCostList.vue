<template>
  <div class="costlist">
    <header class="laborcostheader">
      <div class="headercol col1">Дата:</div>
      <div class="headercol col2">Тип работы:</div>
      <div class="headercol col3">Описание работы:</div>
      <div class="headercol col5">Исполнитель:</div>
      <div class="headercol col4">Часы:</div>
    </header>
    <div
      v-for="(row, index) of this.filterCostsByPeriod(
        getSelectedTask.laborcosts_fact,
        this.getDate_from,
        this.getDate_to
      )"
      :key="index"
      class="laborcostsrow"
    >
      <div class="col1">{{ getDate(row.date) }}</div>
      <div class="col2">{{ row.work_type }}</div>
      <div class="col3">{{ row.work_description }}</div>
      <div class="col4">{{ row.executor.name }}</div>
      <div class="col4">{{ row.time_spent_fact }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import { myMixin } from '../mixins/common';
export default {
  computed: {
    ...mapState(['task']),
    ...mapGetters([
      'getCurrentExecutor',
      'getSelectedTask',
      'getDate_from',
      'getDate_to',
    ]),
  },
  methods: {
    getDate(DateString) {
      return this.getDateMain(DateString);
    },
  },
};
</script>

<style>
ul {
  list-style: none;
  text-align: left;
}
header.laborcostheader,
.laborcostsrow {
  display: flex;
  justify-content: space-around;
  margin: 1rem;
  padding: 0px;
}

.headercol {
  font-weight: bold;
}
.col1,
.col2,
.col4,
.col5 {
  width: 10%;
  text-align: left;
}

.col3 {
  width: 55%;
  text-align: left;
}
</style>
