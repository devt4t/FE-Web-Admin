<template>
  <v-data-table
    :headers="header"
    :items="data"
    :search="''"
    class="rounded-xl elevation-1 mx-3 pa-1 mb-4"
    data-aos="fade-up"
    data-aos-delay="100"
    data-aos-duration="800"
    :footer-props="{
      showCurrentPage: false,
      showFirstLastPage: false,
    }"
  >
    <template v-slot:top>
      <div class="geko-list-header px-5 py-3 mt-1">
        <div class="pr-5 mr-5 mb-3 pb-3 bordered-bottom">
          <h4>Pohon</h4>
        </div>
        <div
          v-if="hasEmptyTree"
          class="d-flex flex-row align-items-center mt-2 bg-warning-light px-4 py-3 br-8"
        >
          <v-icon class="text-warning" large>mdi-information</v-icon>
          <span class="text-warning pl-3">
            Untuk <strong>Project Carbon</strong>, data jumlah bibit akan
            diperbarui setelah data lahan dan polygon lahan diverifikasi oleh
            GIS. Update jumlah bibit dapat dilakukan melalui GEKO Mobile App
          </span>
        </div>
      </div>
    </template>

    <template v-slot:item.index="{ index }">
      {{ index + 1 }}
    </template>

    <template v-slot:item.trees_tree_category="{ item }">
      <span>{{ item.trees_tree_category.replace(/_/g, " ") }}</span>
    </template>

    <template v-slot:item.detail_year="{ item }">
      <div class="d-flex flex-row justify-content-center">
        <span
          class="badge bg-primary mr-2"
          v-for="(year, i) in item.detail_year.split(',')"
          >{{ year }}</span
        >
      </div>
    </template>

    <template v-slot:item.trees_tree_name="{ item }">
      <div class="d-flex flex-column">
        <span>{{ item.trees_tree_name }}</span>
        <span class="text-grey font-weight-300">{{
          item.trees_scientific_name
        }}</span>
      </div>
    </template>

    <template v-slot:item.tree_code="{ item }">
      <span class="badge bg-light">{{ item.tree_code }}</span>
    </template>
    <template v-slot:item.amount="{ item }">
      <span class="font-weight-bold">{{ item.amount | parse("ts") }}</span>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "farmer-detail-tree",
  props: {
    trees: {
      required: false,
      default: () => [],
    },
    mainData: {
      required: false,
      default: () => {},
    },
  },
  watch: {
    trees(t) {
      if (Array.isArray(t)) {
        for (const item of t) {
          if (parseInt(item.amount) == 0) {
            this.hasEmptyTree = true;
          }
        }
        this.data = t;
      }
    },
  },
  data() {
    return {
      hasEmptyTree: false,
      header: [
        {
          text: "No",
          key: "index",
          value: "index",
          class: "sticky-left",
          sortable: false,
        },
        {
          text: "Kategori Pohon",
          key: "trees_tree_category",
          value: "trees_tree_category",
          sortable: false,
        },
        {
          text: "Pohon",
          key: "trees_tree_name",
          value: "trees_tree_name",
          sortable: false,
        },
        {
          text: "Jumlah",
          key: "amount",
          value: "amount",
          sortable: false,
          class: "font-weight-bold",
        },
        {
          text: "Kode Pohon",
          key: "tree_code",
          value: "tree_code",
          sortable: false,
        },
        {
          text: "Tahun Program",
          key: "detail_year",
          value: "detail_year",
          sortable: false,
        },
      ],
      data: [],
    };
  },
};
</script>
