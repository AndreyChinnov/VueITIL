<template>
  <div
    class="task"
    v-bind:class="{ active: isActive }"
    @click="onClickTask"
    @dblclick="onDbClick"
  >
    <span>
      <img class="status" :src="require(`@/images/${image2}`)" alt="" />
      <!-- <img class="status" :src="image" alt="" /> -->
      <h3>
        <b>#{{ task.id }}</b> {{ task.title }}
      </h3>
    </span>
    <br />
    <table class="table">
      <tr v-if="task.created_at">
        <td class="bold">Создана:</td>
        <td>
          {{ getDate(task.created_at) }}
        </td>
      </tr>
      <!-- <tr v-if="task.due_to"> -->
      <tr>
        <td class="bold">Срок:</td>
        <!-- <td>
          {{ this.getDateTime(task.due_to) }}
          <img
            v-if="new Date(task.due_to) < Date.now() && !task.completed_at"
            class="status"
            :src="require(`@/images/new.png`)"
            alt=""
          />
        </td> -->
        <td>
          <div class="due-to">
            <datetime
              @close="changeDueTo"
              type="datetime"
              v-model="due_to_local"
            ></datetime>
            <img
              v-if="new Date(task.due_to) < Date.now() && !task.completed_at"
              class="status"
              :src="require(`@/images/new.png`)"
              alt=""
            />
          </div>
        </td>
      </tr>
      <tr v-if="task.completed_at">
        <td class="bold">Выполнена:</td>
        <td>
          {{ getDate(task.completed_at) }}
        </td>
      </tr>
      <tr>
        <td class="bold">Статус:</td>
        <td>
          {{ task.status.name }}
        </td>
      </tr>
      <tr>
        <td class="bold">Приоритет:</td>
        <td>
          <select
            name="TaskPriority"
            id="TaskPriority"
            @change="changePriority"
          >
            <option selected v-bind:value="task.priority.id">
              {{ task.priority.name }}
            </option>
            <option
              v-for="p of getPriorities.filter((p) => p.id != task.priority.id)"
              :key="p.id"
              v-bind:value="p.id"
            >
              {{ p.name }}
            </option>
          </select>
        </td>
        <!-- <td>
          {{ task.priority.name }}
        </td> -->
      </tr>
      <tr>
        <td class="bold">Маршрут:</td>
        <td>
          {{ task.route.name }}
        </td>
      </tr>
      <tr>
        <td class="bold">Заказчик:</td>
        <td v-if="task.initiator === task.business_consumer">
          {{ task.initiator }}
        </td>
        <td v-else>
          {{ task.business_consumer }} ( поставил(а) {{ task.initiator }})
        </td>
      </tr>
      <tr>
        <td class="bold">Исполнитель:</td>
        <select name="TaskExecutor" id="TaskExecutor" @change="changeExecutor">
          <option selected v-bind:value="task.executor.email">
            {{ task.executor.name }}
          </option>
          <option
            v-for="e of allExecutors.filter(
              (e) => e.email != task.executor.email
            )"
            :key="e.email"
            v-bind:value="e.email"
          >
            {{ e.name }}
          </option>
        </select>
      </tr>
    </table>
    <form @submit.prevent="addComment">
      <input type="text" placeholder="Comment to the task" v-model="message" />
      <button class="w3-btn w3-green">Add comment</button>
    </form>
    <!-- <button @click="completeTask">Complete task!</button> -->
    <b>
      <p v-if="totalCosts">Трудозатраты: {{ totalCosts }}</p></b
    >
  </div>
</template>

<script>
// import image from '@/images/completed.png';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      image: 'completed.png',
      image3: this.task.status,
      message: '',
      due_to_local: '',
    };
  },
  //   created() {
  //     this.$root.$refs.TTT = this;
  //   },
  computed: {
    // due_to_string: {
    //   get() {
    //     return this.task.due_to;
    //   },
    //   set(newValue) {
    //     // console.log(typeof newValue);
    //     // console.log(newValue);
    //     // let valueWithTime = new Date(newValue);
    //     // valueWithTime.setHours(18);
    //     // this.task.due_to = valueWithTime;
    //     if (this.task.due_to != newValue) console.log(true);
    //     this.task.due_to = newValue;
    //   },
    // },
    ...mapGetters([
      'getSelectedTask',
      'isActiveById',
      'getPriorities',
      'getDate_from',
      'getDate_to',
      'allExecutors',
    ]),
    isActive() {
      return this.$store.getters.isActiveById(this.task.id);
    },
    image2() {
      return this.getTaskIcon(this.task.status);
    },
    totalCosts() {
      //   let totalCostsArray = this.filterCostsByPeriod(
      //     this.task.laborcosts_fact
      //   ).map((t) => t.time_spent_fact);
      //   if (totalCostsArray.length)
      //     return totalCostsArray.reduce((a, b) => a + b).toFixed(1);
      //   else return 0;
      // },
      return this.totalTaskCosts(this.task, this.getDate_from, this.getDate_to);
    },
  },
  props: {
    task: {
      type: Object,
      required: false,
    },
  },
  methods: {
    ...mapMutations(['updateSelectedTask']),
    ...mapActions(['addCommentAction', 'updateTask']),
    getTaskIcon(status) {
      if (status.id === '000000025') return 'inprogress.png';
      else if ((status.id === '000000001') | (status.id === '000000030'))
        return 'new.png';
      else if (status.id === '000000026') return 'intesting.png';
      else if (status.id === '000000051') return 'questionmark.png';
      else if (status.id === '000000024') return 'accepted.png';
      else if ((status.id === '000000022') | (status.id === '000000023'))
        return 'canceled.png';
      else return 'completed.png';
    },
    completeTask() {
      console.log('status ' + this.task.status);
      this.task.status = 'На приемке у инициатора';
      this.task.completed = true;
    },
    getDate(DateString) {
      //   if (DateString === '') return '';
      //   else
      //     return (
      //       new Date(DateString).getFullYear() +
      //       '-' +
      //       ('0' + (new Date(DateString).getMonth() + 1)).slice(-2) +
      //       '-' +
      //       ('0' + new Date(DateString).getDate()).slice(-2)
      //     );
      return this.getDateMain(DateString);
    },
    getTotalLaborCosts(timeTable) {
      let totalCosts = timeTable.map((t) => t.time_spent_fact).sum();
    },
    onClickTask() {
      this.updateSelectedTask(this.task);
      amplitude.getInstance().logEvent('task clicked', { task: this.task });
      console.log('task clicked');
    },
    onDbClick() {
      this.updateSelectedTask(this.task);
      this.$emit('onDbClickTask');
    },
    addComment() {
      const comment = {
        message: this.message,
        taskId: this.task.id,
      };
      //   console.log(comment);
      this.addCommentAction(comment);
      this.message = '';
      amplitude.getInstance().logEvent('comment added', comment);
      console.log(comment);
    },
    changePriority(e) {
      const taskChanges = {
        priority: e.target.value,
      };
      console.log(taskChanges);
      this.updateTask(taskChanges);
      amplitude
        .getInstance()
        .logEvent('task change', { task: this.task, taskChanges });
    },
    changeExecutor(e) {
      const taskChanges = {
        executor: e.target.value,
      };
      console.log(taskChanges);
      this.updateTask(taskChanges);
      amplitude
        .getInstance()
        .logEvent('task change', { task: this.task, taskChanges });
    },
    changeDueTo() {
      if (this.task.due_to != this.due_to_local) {
        this.task.due_to = this.due_to_local;
        const taskChanges = {
          due_to: this.getDate1c(this.due_to_local),
        };
        console.log(taskChanges);
        this.updateTask(taskChanges);
        amplitude
          .getInstance()
          .logEvent('task change', { task: this.task, taskChanges });
      }
      //   this.updateTask(taskChanges);
    },
  },
  mounted() {
    this.due_to_local = this.task.due_to;
  },
};
</script>

<style>
input {
  margin-right: 0.5em;
}
.task:hover {
  border: solid 3px green;
}
.task:active {
  border: solid 3px blue;
}

div.active {
  border: solid 3px blue;
  background-color: rgb(211, 253, 239);
}

.bold {
  font-weight: bold;
}
div.due-to {
  display: flex;
  align-items: center;
}
</style>