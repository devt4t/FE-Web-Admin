<template>
  <div class="program-soc-form">
    <ValidationObserver ref="firstForm" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
        <v-row class="mb-4"></v-row>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  name: "program-soc-form",
  methods: {
    onSubmit() {
      //api call
      //insert main program soc
      //insert farmers
    },
  },
  data() {
    return {
      loading: false,
      formData: {},
    };
  },
};
</script>
