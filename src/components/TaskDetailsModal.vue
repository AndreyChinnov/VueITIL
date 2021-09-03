<template>
  <div class="modalTask">
    <h1>ITIL #{{ this.getSelectedTask.id }}!</h1>
    <h2>{{ this.getSelectedTask.title }}</h2>
    <p v-if="!this.getSelectedTask.descriptionHTML.length">
      {{ this.getSelectedTask.description }}
    </p>
    <!-- <p>html</p> -->
    <p v-else v-html="this.getSelectedTask.descriptionHTML"></p>

    <div v-if="this.getSelectedTask.laborcosts_fact.length">
      <h2>Трудозатраты:</h2>
      <LaborCostList />
    </div>

    <div v-if="this.getSelectedTask.comments.length">
      <h2>Переписка:</h2>
      <div v-for="(ms, index) of this.getSelectedTask.comments" :key="index">
        <h4 class="commentDate">{{ getDateT(ms.date) }}:</h4>
        <h3 class="author">{{ ms.author }}</h3>
        <p v-if="!ms.commentHTML">
          {{ ms.comment }}
        </p>
        <p v-else v-html="ms.commentHTML"></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LaborCostList from './LaborCostList';
export default {
  computed: {
    ...mapGetters(['getSelectedTask']),
  },
  methods: {
    getDateT(DateString) {
      return this.getDateTime(DateString);
    },
  },
  components: {
    LaborCostList,
  },
};
</script>

<style>
h3.author {
  color: green;
  font-weight: bold;
  font-size: 1.5rem;
}
.modalTask {
  padding: 2rem;
}

.commentDate {
  font-weight: bold;
}
</style>