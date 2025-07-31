<template>
  <geko-base-crud :config="config">
    <template v-slot:list-date="{ item }">
      <div class="min-w-200px">
        <span>{{ item.project_date | parse("date") }}</span>
        <span v-if="item.end_project">
          {{ " - " }} {{ item.end_project | parse("date") }}</span
        >
      </div>
    </template>
    <template v-slot:detail-date="{ item }">
      <div class="min-w-200px">
        <span>{{ item.project_date | parse("date") }}</span>
        <span v-if="item.end_project">
          {{ " - " }} {{ item.end_project | parse("date") }}</span
        >
      </div>
    </template>

    <template v-slot:list-donors_name="{ item }">
      <span class="d-block min-w-150px"
        >{{ item.participants_first_name }}
        {{ item.participants_last_name || "" }}</span
      >
    </template>

    <template v-slot:detail-donors_name="{ item }">
      <span>{{ item.participants_first_name }} </span>
      <span v-if="item.participants_last_name"
        >{{ " " }}{{ item.participants_last_name }}
      </span>
    </template>

    <template v-slot:update-project_name="{ formData, field }">
      <v-col md="6">
        <geko-input
          v-model="formData.project_name"
          :item="{
            label: field.label,
            type: 'text',
            validation: ['required'],
          }"
        />
      </v-col>
    </template>
  </geko-base-crud>
</template>

<script>
import ProjectConfig from './component/config-project'
export default {
  name: "crud-donor",
  watch: {},
  data() {
    return {
      config: ProjectConfig
    };
  },

  methods: {
    
  }
};
</script>
