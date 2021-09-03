<template>
  <form @submit.prevent="submit">
    <input
      class="newTask"
      type="text"
      placeholder="Название новой задачи"
      v-model="title"
    />
    <textarea
      class="newTask"
      type="text"
      placeholder="Описание"
      v-model="description"
    />
    <select id="TaskPriority" name="TaskPriority" v-model="priority">
      <option disabled selected value>-- Выберете приоритет --</option>
      <option v-for="p of getPriorities" :key="p.id" v-bind:value="p.id">
        {{ p.name }}
      </option>
    </select>
    <!-- <select id="TaskRoute" name="TaskRoute" v-model="route">
      <option disabled selected value>-- Выберете маршрут --</option>
      <option v-for="rt of getRoutes" :key="rt.id_1c" v-bind:value="rt.id">
        {{ rt.name }}
      </option>
    </select> -->
    <button class="w3-btn w3-blue" type="submit">Create new Task</button>
  </form>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      title: '',
      description: '',
      // route: '',
      priority: '',
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentExecutor',
      'getRoutes',
      'getPriorities',
      'getCurrentRoute',
    ]),
  },
  methods: {
    ...mapMutations(['createTask']),
    ...mapActions(['createTaskAction', 'fetchRoutes', 'fetchPriorities']),
    submit() {
      // this.createTask({
      //   title: this.title,
      //   description: this.description,
      //   id: Date.now(),
      //   created_at: Date.now(),
      //   completed: false,
      //   completed_at: '',
      //   due_to: '',
      //   status: {
      //     id: '000000001',
      //     name: 'Регистрация',
      //   },
      //   laborcosts_fact: [],
      // });
      if (this.title && this.description && this.priority) {
        let newTask = {
          title: this.title,
          description: this.description,
          id: Date.now(),
          created_at: this.getDate1c(Date.now()),
          completed: false,
          completed_at: '',
          executor: this.getCurrentExecutor,
          route: this.getCurrentRoute,
          priority: this.priority,
          due_to: '',
          status: {
            id: '000000001',
            name: 'Регистрация',
          },
          laborcosts_fact: [],
        };
        this.createTaskAction(newTask);
        this.title = '';
        this.description = '';
      } else {
        alert('Необходимо заполнить все поля!');
      }
    },
  },
  async mounted() {
    this.fetchRoutes();
    this.fetchPriorities();
  },
};
</script>

<style scoped>
.newTask,
select {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

