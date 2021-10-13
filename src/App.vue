<template>
  <div id="app">
    <header>
      <div class="site-title">
        <div>
          <img class="icon" @click="openModal" src="@/assets/logo.png" />
        </div>
        <div><h1>Web Daily SCRUM meetings</h1></div>
        <div>
          <img class="icon" @click="openModal" src="@/assets/logo-1c_1.png" />
        </div>

        <!-- <p class="subtitile">Web Daily SCRUM meetings</p> -->
      </div>
      <label for="date_start">from:</label>
      <input
        type="date"
        name="date_start"
        id="date_start"
        v-model="date_from"
        @change="onChange($event)"
      />
      <label for="date_end">to:</label>
      <input
        type="date"
        name="date_end"
        id="date_end"
        v-model="date_to"
        @change="onChange($event)"
      />
      <br />
      <select
        @change="onChange($event)"
        id="TaskRoute"
        name="TaskRoute"
        v-model="currentRoute"
      >
        <option disabled selected value>-- Выберете маршрут --</option>
        <option v-for="rt of getRoutes" :key="rt.id_1c" v-bind:value="rt.id">
          {{ rt.name }}
        </option>
      </select>

      <select
        @change="changeExecutor($event)"
        id="programmers"
        name="programmers"
        v-model="currentExecutor"
      >
        <option disabled selected value>-- Выберете исполнителя --</option>
        <option
          v-for="ex of allExecutors"
          :key="ex.email"
          v-bind:value="ex.email"
        >
          {{ ex.name }}
        </option>
        <!-- <option value="danilkin@msbook.ru">Danilkin Oleg</option>
        <option value="chudin@msbook.ru">Chudin Konstantin</option>
        <option value="tarasov@msbook.ru">Tarasov Aleksander</option> -->
      </select>
      <!-- <nav>
        <ul>
          <li><a href="#">Danilkin Oleg</a></li>
          <li><a href="#">Chudin Konstantin</a></li>
          <li><a href="#">Tarasov Alexandr</a></li>
        </ul>
      </nav> -->
    </header>
    <div class="container">
      <div class="col">
        <h2>
          Сделано ({{
            this.totalCostCount(
              recentlyDoneNew,
              this.getDate_from,
              this.getDate_to
            )
          }}
          ч.):
        </h2>
        <Task
          @onDbClickTask="openModal"
          v-for="task of recentlyDoneNew"
          :key="task.id"
          v-bind="(task = { task })"
        />
        <!-- <Task />
        <Task /> -->
      </div>
      <div class="col">
        <h2>
          В работе ({{
            this.totalCostCount(
              inProgressNew,
              this.getDate_from,
              this.getDate_to
            )
          }}
          ч.):
        </h2>
        <Task
          @onDbClickTask="openModal"
          v-for="task of inProgressNew"
          :key="task.id"
          v-bind="(task = { task })"
        />
        <!-- <Task /> -->
      </div>
      <div class="col">
        <NewTaskForm v-if="currentExecutor" />
        <h2>На очереди:</h2>
        <Task
          @onDbClickTask="openModal"
          v-for="task of todoTasks"
          :key="task.id"
          v-bind="(task = { task })"
        />
      </div>
    </div>

    <hr />
    <LaborCostList />
    <h1>{{ tasksCount }}</h1>
    <!-- <div class="post" v-for="post of validTasks" :key="post.id">
      <h2>
        <strong class="task_id">{{ '#' + post.id }}: </strong>{{ post.title }}
      </h2>
      <p>{{ post.description }}</p>
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import NewTaskForm from './components/NewTaskForm';
import Task from './components/Task';
import LaborCostList from './components/LaborCostList';
import TaskDetailsModal from './components/TaskDetailsModal';

export default {
  data() {
    return {
      date_from: '',
      date_to: '',
      currentExecutor: '',
      currentRoute: '',
    };
  },
  name: 'App',
  // data() {
  //   return {
  //     posts: [],
  //   };
  // },

  // computed: {
  //   allTasks() {
  //     return this.$store.getters.allTasks;
  //   },
  // },
  computed: {
    ...mapGetters([
      'validTasks',
      'tasksCount',
      'doneTasks',
      'todoTasks',
      'inprogressTasks',
      'recentlyDoneNew',
      'inProgressNew',
      'getRoutes',
      'allExecutors',
      'getDate_from',
      'getDate_to',
    ]),
    // ...mapState(['currentExecutor']),
  },
  methods: {
    ...mapMutations([
      'setDate_from',
      'setDate_to',
      'setCurrentExecutor',
      'setCurrentRoute',
    ]),
    ...mapActions(['fetchTasks', 'fetchRoutes']),
    onChange(event) {
      this.setDate_from(this.date_from);

      this.setDate_to(this.date_to);

      this.setCurrentRoute(this.currentRoute);

      this.fetchTasks();
    },
    changeExecutor(event) {
      if (this.currentExecutor) {
        this.setCurrentExecutor({
          email: this.currentExecutor,
          name: this.allExecutors.filter(
            (ex) => ex.email === this.currentExecutor
          )[0].name,
        });
      } else {
        this.setCurrentExecutor({ email: '', name: '' });
      }
      amplitude
        .getInstance()
        .logEvent('executor changed', { executor: this.currentExecutor });
      console.log('executor changed');
    },
    openModal() {
      this.$FModal.show({
        component: TaskDetailsModal,
        width: 'calc(100vw - 100px)',
      });
    },
  },
  // async mounted() {
  //   const res = await fetch(
  //     'http://itil/itil2-sa/hs/api/tasks/?executor=chinnov@msbook.ru&completed=false'
  //     // {
  //     //   method: 'GET',
  //     //   mode: 'no-cors',
  //     //   cache: 'default',
  //     //   credentials: 'omit',
  //     //   headers: { 'Content-Type': 'application/json' },
  //     //   redirect: 'follow',
  //     //   referrerPolicy: 'no-referrer',
  //     // }
  //   );
  //   const posts = await res.json();
  //   this.posts = posts;
  //   console.log(posts);
  // },
  async mounted() {
    this.fetchRoutes();
    //this.$store.dispatch('fetchTasks');
    // this.fetchTasks({ completed: false, executor: 'chudin@msbook.ru' });
  },
  components: {
    NewTaskForm,
    Task,
    LaborCostList,
  },
};
</script>

<style>
#app {
  font-family: 'Times New Roman', Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px auto;
  /* width: 100vw; */
}
.post {
  background: linear-gradient(rgb(219, 81, 81), blue);
  color: #fff;
  /*border-radius: 20px;*/
  border: 2px solid #000;
  margin: 10px;
}

.task_id {
  color: #000;
  font-weight: 900;
}

html,
body {
  font-family: 'Verdana', sans-serif;
}

body {
  background: #fff;
}

.col {
  width: 30%;
  /* border: 2px solid red; */
  margin: 2px;
  height: 100%;
  overflow: scroll;
}
.container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  height: 60vh;
}

@media (max-width: 1200px) {
  /* body {
    background: purple;
    } */
  .container {
    flex-direction: column;
    /* border: 2px solid blue; */
    height: 100%;
  }
  .col {
    width: 100%;
    /* height: 100%; */
    /* border: 2px solid red; */
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Segoe UI', sans-serif;
}
h1,
h2 {
  text-align: center;
  color: #143774;
  margin: 0;
}
#banner {
  width: 100%;
  height: 100px;
}

h2 {
  background: #f8f8f8;
}

.task {
  text-align: left;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #000;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

h3 {
  display: inline;
  /* border: 2px solid red; */
}

img.status {
  /* border: 2px solid red; */
  margin-bottom: 0.5em;
  margin-right: 0.5em;
}

span {
  align-items: top;
  /* border: 2px solid violet; */
}

header {
  text-align: center;
  background: #f8f8f8;
  padding: 2em 0;
}

nav ul {
  /* border: 1px solid magenta; */
  list-style: none;
  display: flex;
  padding: 0;
  justify-content: center;
  margin: 0;
}

nav li {
  /* border: 2px dotted orange; */
  margin: 0 1em;
}

nav a {
  /* border: 3px solid green; */
  text-decoration: none;
  color: #707070;
  font-weight: 700;
}

nav a:hover,
nav a:focus {
  color: #1792d2;
  border-bottom: 1px solid #1792d2;
}

img.icon {
  height: 40px;
}

.site-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
