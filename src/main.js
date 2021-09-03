import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import { myMixin } from "./mixins/common";
import FullpageModal from "vue-fullpage-modal";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import { DateTime } from "luxon";

Vue.config.productionTip = false;
Vue.mixin(myMixin);
Vue.use(FullpageModal);
Vue.use(Datetime);
Vue.component("datetime", Datetime);

// export const myMixin = {
//   data() {
//     return {
//       message: "hello",
//       foo: "abc"
//     };
//   },
//   methods: {
//     getDateMainGlobal(DateString) {
//       console.log("GLOBAL FUNCTION MAIN!");
//       if (DateString === "") return "";
//       else
//         return (
//           new Date(DateString).getFullYear() +
//           "-" +
//           ("0" + (new Date(DateString).getMonth() + 1)).slice(-2) +
//           "-" +
//           ("0" + new Date(DateString).getDate()).slice(-2)
//         );
//     }
//   }
// };

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
