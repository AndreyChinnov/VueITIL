import { mapState, mapGetters, mapMutations } from "vuex";

let filterCostsByPeriod_loc = function(CostList, date_from, date_to) {
  if (CostList) {
    const date_from_start = new Date(date_from);
    date_from_start.setHours(0, 0, 0, 0);
    const date_to_end = new Date(date_to);
    date_to_end.setHours(23, 59, 59, 999);
    return CostList.filter(
      c =>
        (!date_from || new Date(c.date) >= date_from_start) &&
        (!date_to || new Date(c.date) <= date_to_end)
    );
  } else return CostList;
};

let totalTaskCosts_loc = function(Task, date_from, date_to) {
  let totalCostsArray = filterCostsByPeriod_loc(
    Task.laborcosts_fact,
    date_from,
    date_to
  ).map(t => t.time_spent_fact);
  if (totalCostsArray.length)
    return totalCostsArray.reduce((a, b) => a + b).toFixed(1);
  else return 0;
};

let compareNotNullDates = function(d1, d2) {
  if (new Date(d1) < new Date(d2)) return -1;
  else if (new Date(d1) > new Date(d2)) return 1;
  else return 0;
};

let compareDueTo = function(a, b) {
  if (a.due_to !== b.due_to) {
    if (!a.due_to) return 1;
    else if (!b.due_to) return -1;
    else return compareNotNullDates(a.due_to, b.due_to);
  }
};

let comparePriorities = function(a, b) {
  if (a.priority.id < b.priority.id) return -1;
  else if (a.priority.id > b.priority.id) return 1;
  else return compareDueTo(a, b);
};

export const myMixin = {
  data() {
    return {
      message: "hello",
      foo: "abc"
    };
  },
  methods: {
    get_url(production = true) {
      if (production) {
        return "http://itil/itil-api/hs/api";
      } else {
        return "http://itil/itil2-sa/hs/api";
      }
    },
    getDateMain(DateString) {
      //   console.log("GLOBAL FUNCTION!");
      if (DateString === "") return "";
      else
        return (
          new Date(DateString).getFullYear() +
          "-" +
          ("0" + (new Date(DateString).getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + new Date(DateString).getDate()).slice(-2)
        );
    },
    getDateTime(DateString) {
      //   console.log("GLOBAL FUNCTION!");
      if (DateString === "") return "";
      else
        return (
          new Date(DateString).getFullYear() +
          "-" +
          ("0" + (new Date(DateString).getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + new Date(DateString).getDate()).slice(-2) +
          " " +
          ("0" + new Date(DateString).getHours()).slice(-2) +
          ":" +
          ("0" + new Date(DateString).getMinutes()).slice(-2) +
          ":" +
          ("0" + new Date(DateString).getSeconds()).slice(-2)
        );
    },
    getDate1c(DateString) {
      return (
        new Date(DateString).getFullYear() +
        ("0" + (new Date(DateString).getMonth() + 1)).slice(-2) +
        ("0" + new Date(DateString).getDate()).slice(-2) +
        ("0" + new Date(DateString).getHours()).slice(-2) +
        ("0" + new Date(DateString).getMinutes()).slice(-2) +
        ("0" + new Date(DateString).getSeconds()).slice(-2)
      );
    },
    filterCostsByPeriod(CostList, date_from, date_to) {
      return filterCostsByPeriod_loc(CostList, date_from, date_to);
    },
    filterTasksByPeriod(
      TaskList,
      date_from = "",
      date_to = "",
      leaveRemains = false
    ) {
      if (TaskList) {
        // return TaskList;
        // const date_from = this.$store.getters.getDate_from;
        // const date_to = this.$store.getters.getDate_to;
        const date_from_start = new Date(date_from);
        date_from_start.setHours(0, 0, 0, 0);
        const date_to_end = new Date(date_to);
        date_to_end.setHours(23, 59, 59, 999);

        if (!leaveRemains) {
          return TaskList.filter(
            t =>
              t.laborcosts_fact.filter(
                c =>
                  (!date_from || new Date(c.date) >= date_from_start) &&
                  (!date_to || new Date(c.date) <= date_to_end)
              ).length
          );
        } else {
          return TaskList.filter(
            t =>
              !t.laborcosts_fact.filter(
                c =>
                  (!date_from || new Date(c.date) >= date_from_start) &&
                  (!date_to || new Date(c.date) <= date_to_end)
              ).length
          );
        }
      } else return TaskList;
    },
    totalTaskCosts(Task, date_from, date_to) {
      return totalTaskCosts_loc(Task, date_from, date_to);
    },
    totalCostCount(TaskList, date_from, date_to) {
      let totalCostsArray = TaskList.map(t =>
        Number(this.totalTaskCosts(t, date_from, date_to))
      );
      if (totalCostsArray.length)
        return totalCostsArray.reduce((a, b) => a + b).toFixed(1);
      else return 0;
    },
    compare(a, b) {
      if (a.status.id === b.status.id) return comparePriorities(a, b);
      else if (a.status.id === "000000025") return -1;
      else if (b.status.id === "000000025") return 1;
      else return comparePriorities(a, b);
    }
  }
};
