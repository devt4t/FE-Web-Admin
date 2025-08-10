<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="table.header" :items="trees"
            :search="''" class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ item, index }">
              <span>{{ index + 1 }}.</span>
            </template>

            <template v-slot:item.tree_category="{ item, index }">
              <span>{{ item.tree_category.replace(/_/g, ' ') }}</span>
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Jenis Pohon Yang Diminati</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div v-for="item in Object.groupBy(trees, ({tree_category})=>tree_category)" :key="item" class="statistic-item light">
                  <v-icon>mdi-tree</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">{{ item[0].tree_category.replace(/_/g, ' ') }}</p>
                    <p class="mb-0 value">{{ item.length }}</p>
                  </div>
                </div>
              </div>
            </template>

          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import defaultData from "./ProgramSocData.js";
export default {
  name: "program-soc-collective-detail",
  mounted: function () {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.$_api
        .get("GetFormMinatCollectiveDetailAll_new", {
          id: this.$route.query.id,
        })
        .then((response) => {
          console.log("Detail data loaded", response.sprTrees);
          this.trees = response.sprTrees;
          // this.$emit("data-loaded", this.data);
        })
        .catch((err) => {
          console.error(err);
          this.$_alert.error(err);
        });
    }
  },
  computed: {
    defaultData() {
      return defaultData;
    },
  },
  data() {
    return {
      deleteIds: [],
      trees: [],
      table: {
        header: [
          {
            key: "index",
            sortable: false,
            text: "#",
            value: "index",
          },
          {
            key: "tree_code",
            sortable: false,
            text: "Kode Pohon",
            value: "tree_code",
          },
          {
            key: "tree_name",
            sortable: false,
            text: "Nama Pohon",
            value: "tree_name",
          },
          {
            key: "tree_category",
            sortable: false,
            text: "Jenis Pohon",
            value: "tree_category",
          },
        ],
        data: [],
      },
    };
  },
};
</script>
