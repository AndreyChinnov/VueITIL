// import { mixin } from "vue/types/umd";
import { myMixin } from "../../mixins/common";

export default {
  actions: {
    async updateTask(ctx, taskChanges) {
      const currentTaskId = this.getters.getSelectedTask.id;
      const url = myMixin.methods.get_url() + "/tasks/" + currentTaskId;
      console.log(url);
      const options = {
        method: "PUT",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(taskChanges)
      };
      const res = await fetch(url, options);
      const updatedTask = await res.json();
      console.log(updatedTask);
      ctx.commit("updateTask", updatedTask);
    },
    async fetchPriorities(ctx) {
      const url = myMixin.methods.get_url() + "/priorities/";
      const res = await fetch(url);
      const routes = await res.json();

      ctx.commit("updatePriorities", routes);
    },
    async fetchRoutes(ctx) {
      const url = myMixin.methods.get_url() + "/routes/";
      const res = await fetch(url);
      const routes = await res.json();

      ctx.commit("updateRoutes", routes);
    },
    async fetchTasks(ctx) {
      // const currentExecutor = this.getters.getCurrentExecutor;
      const currentRoute = this.getters.getCurrentRoute;

      if (currentRoute) {
        let url = myMixin.methods.get_url() + "/tasks/?route=" + currentRoute;
        // let url =
        //   "http://itil/itil2-sa/hs/api/tasks/?executor=" + currentExecutor;
        // let url =
        // "http://itil/itil-api/hs/api/tasks/?executor=" + currentExecutor;
        const date_from = this.getters.getDate_from;
        const date_to = this.getters.getDate_to;

        if (date_from) {
          url = url + "&date_from=" + date_from;
        }
        if (date_to) {
          url = url + "&date_to=" + date_to;
        }
        if (!date_from && !date_to) {
          url = url + "&completed=false";
        }
        console.log(url);
        const res = await fetch(url);
        const tasks = await res.json();

        ctx.commit("updateTasks", tasks);
      }
    },
    async createTaskAction(ctx, newTask) {
      const url = myMixin.methods.get_url() + "/tasks/001";
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(newTask)
      };
      // console.log(newTask);
      const res = await fetch(url, options);
      const result = await res.json();
      if (res.status === 201) {
        ctx.commit("createTask", result);
      } else {
        alert("Внутренняя ошибка сервера 500!");
        console.log(result);
      }
    },
    async addCommentAction(ctx, newComment) {
      const url = myMixin.methods.get_url() + "/tasks/addcomments";
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(newComment)
      };
      const res = await fetch(url, options);
      ctx.dispatch("fetchTasks");
    }
  },
  mutations: {
    updateTask(state, changedTask) {
      console.log(changedTask);
      state.tasks = [
        ...state.tasks.map(t =>
          t.id !== changedTask.id ? t : { ...t, ...changedTask }
        )
      ];
      // state.tasks.filter(t => t.id === payload.id)[0] = payload.changedTask;
      console.log(state.tasks.filter(t => t.id === changedTask.id)[0]);
    },
    updatePriorities(state, priorities) {
      state.priorities = priorities;
    },
    updateRoutes(state, routes) {
      state.routes = routes;
    },
    updateTasks(state, tasks) {
      state.tasks = tasks;
    },
    updateSelectedTask(state, task) {
      // console.log(task.id);
      state.selectedTask = task;
    },
    createTask(state, newTask) {
      state.tasks.unshift(newTask);
    },
    setDate_from(state, date_from) {
      state.date_from = date_from;
    },
    setDate_to(state, date_to) {
      state.date_to = date_to;
    },
    setCurrentExecutor(state, executor) {
      state.currentExecutor = executor;
    },
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    }
  },
  state: {
    tasks: [],
    date_from: "",
    date_to: "",
    currentExecutor: "",
    currentRoute: "",
    selectedTask: "",
    routes: [],
    priorities: []
  },
  getters: {
    tasksOfExecutor(state, getters) {
      if (!getters.getCurrentExecutor) {
        return state.tasks;
      } else {
        return state.tasks.filter(
          t => t.executor.email === getters.getCurrentExecutor.email
        );
      }
    },
    allExecutors(state) {
      // return [...new Set(state.tasks.map(t => t.executor.email))];
      if (state.tasks.length) {
        return [...new Set(state.tasks.map(t => t.executor))].filter(
          (v, i, a) => a.findIndex(t => t.email === v.email) === i
        );
      } else return [];
    },
    getPriorities(state) {
      return state.priorities;
    },
    getRoutes(state) {
      return state.routes;
    },
    validTasks(state, getters) {
      return getters.tasksOfExecutor.filter(t => {
        return t.title && t.description;
      });
    },

    doneTasks(state, getters) {
      return getters.tasksOfExecutor.filter(t => t.completed_at);
    },

    // inprogressTasks(state) {
    //   return state.tasks.filter(
    //     t => t.status.id === "000000025" || t.status.id === "000000051"
    //   );
    // },

    inprogressTasks(state, getters) {
      return getters.tasksOfExecutor.filter(t => !t.completed_at);
    },

    todoTasks(state, getters) {
      // return state.tasks.filter(
      //   t =>
      //     t.status.id != "000000025" &&
      //     t.status.id != "000000051" &&
      //     t.status.id != "000000026" &&
      //     !t.completed
      // );
      const date_from = getters.getDate_from;
      const date_to = getters.getDate_to;

      const unsortedTasks = myMixin.methods.filterTasksByPeriod(
        getters.inprogressTasks,
        date_from,
        date_to,
        true
      );
      // console.log(unsortedTasks);

      const sortedTasks = unsortedTasks.sort(myMixin.methods.compare);
      // console.log(sortedTasks);
      return sortedTasks;
    },

    recentlyDoneNew(state, getters) {
      const date_from = getters.getDate_from;
      const date_to = getters.getDate_to;

      const unsortedTasks = myMixin.methods.filterTasksByPeriod(
        getters.doneTasks,
        date_from,
        date_to
      );

      const sortedTasks = unsortedTasks.sort((a, b) => {
        // const date_from = getters.getDate_from;
        // const date_to = getters.getDate_to;
        return (
          myMixin.methods.totalTaskCosts(b, date_from, date_to) -
          myMixin.methods.totalTaskCosts(a, date_from, date_to)
        );
      });
      // console.log(sortedTasks);
      return sortedTasks;

      // return getters.doneTasks.filter(
      //   t =>
      //     t.laborcosts_fact.filter(
      //       c =>
      //         !getters.getDate_from ||
      //         new Date(c.date) >= new Date(getters.getDate_from)
      //     ).length
      // );
    },
    inProgressNew(state, getters) {
      const date_from = getters.getDate_from;
      const date_to = getters.getDate_to;

      const unsortedTasks = myMixin.methods.filterTasksByPeriod(
        getters.inprogressTasks,
        date_from,
        date_to
      );

      const sortedTasks = unsortedTasks.sort((a, b) => {
        // const date_from = getters.getDate_from;
        // const date_to = getters.getDate_to;
        return (
          myMixin.methods.totalTaskCosts(b, date_from, date_to) -
          myMixin.methods.totalTaskCosts(a, date_from, date_to)
        );
      });
      // console.log(sortedTasks);
      return sortedTasks;
      // return getters.doneTasks.filter(
      //   t =>
      //     t.laborcosts_fact.filter(
      //       c =>
      //         !getters.getDate_from ||
      //         new Date(c.date) >= new Date(getters.getDate_from)
      //     ).length
      // );
    },

    allTasks(state) {
      return state.tasks;
    },
    getDate_from(state) {
      return state.date_from;
    },
    getDate_to(state) {
      return state.date_to;
    },
    getCurrentExecutor(state) {
      return state.currentExecutor;
    },
    getCurrentRoute(state) {
      return state.currentRoute;
    },
    tasksCount(state, getters) {
      return getters.validTasks.length;
    },
    getSelectedTask(state) {
      return state.selectedTask;
    },
    isActiveById: (state, getters) => id => {
      return id === getters.getSelectedTask.id;
    }
  }
};
