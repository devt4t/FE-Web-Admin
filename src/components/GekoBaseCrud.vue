<template>
  <div class="geko-base-crud">
    <v-breadcrumbs
      :dark="$store.state.theme == 'dark'"
      class="breadcrumbsmain"
      :items="[
        {
          text: 'Utilities',
          disabled: true,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: `${config.title}`,
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ]"
      divider=">"
      large
      data-aos="fade-right"
    ></v-breadcrumbs>

    <!-- Base Table Data -->
    <div class="geko-list" v-if="activeView === 'list'">
      <v-data-table
        :headers="header"
        :items="data"
        :search="''"
        class="rounded-xl elevation-6 mx-3 pa-1"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        @update:page="($p) => (page = $p)"
        @update:items-per-page="($p) => (perPage = $p)"
        :items-per-page="perPage"
        :server-items-length="totalRecord"
        :page="page"
        :footer-props="{
          itemsPerPageText: 'Jumlah Data Per Halaman',
          itemsPerPageOptions: [10, 25, 50, 100, 200],
          showCurrentPage: true,
          showFirstLastPage: true,
        }"
      >
        <template v-slot:top>
          <div class="geko-list-header px-5 py-3 mt-1">
            <div class="pr-5 mr-5">
              <h4>{{ config.title }}</h4>
            </div>
            <v-select
              v-if="config.program_year.show"
              color="success"
              item-color="success"
              v-model="config.program_year.model"
              :items="['All Data', ...$store.state.programYear.options]"
              :disabled="tableLoading"
              outlined
              dense
              hide-details
              :menu-props="{
                bottom: true,
                offsetY: true,
                rounded: 'xl',
                transition: 'slide-y-transition',
              }"
              rounded
              label="Tahun Program"
              class="mx-auto mr-lg-2 mb-2 mb-lg-0"
              style="max-width: 200px"
            ></v-select>
            <!-- i'm, adding a program years, just in case it'll be needed ;),  -->
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar">
                <form>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Pencarian"
                    :placeholder="'Cari data ' + config.title.toLowerCase()"
                    hide-details
                    dense
                    rounded
                    outlined
                    color="green"
                    class="mr-2"
                  ></v-text-field>
                </form>
                <button class="toolbar-button mr-2" @click="onRefresh">
                  <v-icon>mdi-refresh</v-icon>
                </button>

                <button class="toolbar-button mr-2">
                  <v-icon>mdi-microsoft-excel</v-icon>
                </button>
              </div>
              <v-btn
                variant="success"
                class="ml-4"
                @click="
                  $router.push({
                    query: {
                      view: 'create',
                    },
                  })
                "
              >
                <v-icon small>mdi-plus</v-icon>
                <span class="ms-2">Tambah Data</span>
              </v-btn>
            </div>
          </div>
        </template>

        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template
          v-for="f in fields.list.filter(
            (x) => x.type === 'row-slot' || x.transform
          )"
          v-slot:[`item.${f.view_data}`]="{ item }"
        >
          <slot
            v-if="f.type === 'row-slot'"
            :name="'list-' + f.view_data"
            v-bind:item="item"
          ></slot>

          <span v-else>{{ item[f.view_data] | parse(f.transform) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="geko-list-actions">
            <button class="geko-list-action-view">
              <v-icon small>mdi-eye-outline</v-icon>
            </button>
            <button
              class="geko-list-action-update"
              @click="
                $router.push({
                  query: {
                    view: 'update',
                    id: item.id,
                  },

                  params: item,
                })
              "
            >
              <v-icon small>mdi-pencil-minus</v-icon>
            </button>
            <button
              class="geko-list-action-delete"
              @click="onDelete(item)"
              v-if="config.delete"
            >
              <v-icon small>mdi-trash-can-outline</v-icon>
            </button>
          </div>
        </template>
      </v-data-table>
    </div>

    <div
      class="geko-form mx-4"
      v-if="['create', 'update'].includes(activeView)"
    >
      <geko-base-form
        :title="config.title"
        :fields="activeView === 'create' ? fields.create : fields.update"
        :setter="config.setter"
        :setterExtPayload="config.setter_ext_payload"
        :update="config.update"
        :updateExtPayload="config.update_ext_payload"
        @success="getListData"
      >
        <template v-slot:create-form>
          <slot name="create-form"></slot
        ></template>
      </geko-base-form>
    </div>
  </div>
</template>

<script>
import "../assets/scss/geko-base-crud.scss";
import GekoBaseForm from "./GekoBaseForm.vue";
export default {
  name: "geko-base-crud",
  props: {
    config: {
      type: Object,
      required: true,
      default: {},
    },
    hideCreate: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    hideDetail: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    hideDelete: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    hideUpdate: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  components: {
    GekoBaseForm,
  },
  data() {
    return {
      header: [],
      data: [],
      params: {},
      filters: {},
      endpoint: {},
      page: 1,
      perPage: 10,
      search: "",
      activeView: "list",
      activeID: null,
      permission: {},
      loading: true,
      totalRecord: null,

      fields: {
        list: [],
        detail: [],
        create: [],
        update: [],
        filter: [],
      },
    };
  },

  mounted() {
    if (!this.$route.query.view) {
      this.$router.replace({
        query: {
          view: "list",
          id: null,
        },
      });
    }
    this.onInit();
  },

  methods: {
    getSlotName(value) {
      console.log("value", value);
      return `item.${value}`;
    },
    async onInit() {
      if (!this.$route.query.view) return;
      await this.buildModule();
      await this.generateList();
      this.getListData();
    },
    buildModule() {
      return new Promise(async (resolve) => {
        if (!this.config) return resolve();

        if (!Array.isArray(this.config.fields)) return resolve();

        let _fields = {
          list: [],
          detail: [],
          create: [],
          update: [],
          filter: [],
        };

        for (const f of this.config.fields) {
          if (f.methods.list) {
            if (f.methods.list.show === false) continue;
            _fields.list.push(this.generateConfigField(f, "list"));
          }
          if (f.methods.detail) {
            if (f.methods.detail.show === false) continue;
            _fields.detail.push(this.generateConfigField(f, "detail"));
          }
          if (f.methods.create) {
            if (f.methods.create.show === false) continue;
            _fields.create.push(this.generateConfigField(f, "create"));
          }
          if (f.methods.update) {
            if (f.methods.update.show === false) continue;
            _fields.update.push(this.generateConfigField(f, "update"));
          }
          if (f.methods.filter) {
            if (f.methods.filter.show === false) continue;
            _fields.filter.push(this.generateConfigField(f, "filter"));
          }
        }

        this.fields = _fields;

        return resolve();
      });
    },

    generateList() {
      return new Promise(async (resolve) => {
        let _header = [];

        if (this.config.listOption && this.config.listOption.noIndex) {
        } else {
          _header.push({
            text: "",
            key: "actions",
            value: "actions",
            class: "sticky-left",
            sortable: false,
          });
          _header.push({
            text: "#",
            value: "index",
            key: "index",
            sortable: false,
          });
        }
        for (const f of this.fields.list) {
          _header.push({
            text: f.label,
            key: f.view_data,
            class: f.class,
            value: f.view_data,
            sortable: false,
          });
        }

        this.header = _header;

        if (typeof this.config.filter_api === "object") {
          this.filters = JSON.parse(JSON.stringify(this.config.filter_api));
        }

        return resolve();
      });
    },

    generateConfigField(item, key) {
      let _data = {
        view_data: item.methods[key].view_data || item.id,
        label: item.methods[key].label
          ? item.methods[key].label
          : item.label
          ? item.label
          : item.id,
        header_class: item.methods[key].header_class || null,
        type: item.methods[key].type || "text",
        class: item.methods[key].class || null,
        transform: item.methods[key].transform || null,
        validation: item.methods[key].validation || [],
        input:
          typeof item.methods[key].input === "boolean"
            ? item.methods[key].input
            : true,
        default: item.methods[key].default || null,
      };

      if (["update", "create"].includes(key)) {
        _data.setter = item.methods[key].setter || _data.view_data;
        _data.getter = item.methods[key].getter || _data.view_data;
        _data.option =
          typeof item.methods[key].option === "object"
            ? item.methods[key].option
            : null;

        _data.col_size = item.methods[key].col_size || 12;
      }
      if (key === "create" && item.label == "Created By") {
        console.log(item.methods[key].input);
      }

      return _data;
    },

    async getListData() {
      let _params = JSON.parse(JSON.stringify(this.params));
      let _filters = JSON.parse(JSON.stringify(this.filters));
      let reqParams = Object.assign(_filters, _params);

      reqParams.page = this.page;
      reqParams.per_page = this.perPage;
      const responseData = await this.$_api.get(this.config.getter, reqParams);
      this.data = this.processListData(
        responseData,
        this.config.getterDataKey || "data"
      );
      this.totalRecord = responseData.total;
    },

    processListData(data, _key) {
      const keys = _key.split(".");
      let tmpData = data;
      for (const key of keys) {
        tmpData = tmpData[key];
      }
      return tmpData;
    },

    onDelete(item) {
      if (!this.config.delete) return;
      this.$_alert
        .confirm(
          "",
          "Data yang dihapus tidak dapat dikembalikan. Apakah anda yakin ingin melanjutkan?",
          "",
          "",
          true
        )
        .then((response) => {
          if (response.isConfirmed) {
            let _param = {};
            if (this.config.delete_ext_payload) {
              _param = this.config.delete_ext_payload;
            }
            if (this.config.deleteKey) {
              if (!item[this.config.deleteKey]) {
                this.$_alert.error(
                  "",
                  "",
                  `Data dengan key ${this.config.deleteKey} tidak ditemukan`
                );
                return;
              }
              _param[this.config.deleteKey] = item[this.config.deleteKey];
            } else {
              _param.id = item.id;
            }
            this.$_api.post(this.config.delete, _param).then(() => {
              this.$_alert.success("Data berhasil dihapus");
              this.getListData();
            });
          }
        });
    },

    onRefresh() {
      this.page = 1;
      this.getListData();
    },
  },

  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(to, from) {
        if (!from) {
          return;
        }
        this.activeView = to.query.view ? to.query.view : "list";

        this.activeID = to.query.id
          ? isNaN(to.query.id)
            ? to.query.id
            : Number(to.query.id)
          : "";

        if (from.query.view !== to.query.view) {
          if (this.activeView === "list") {
            this.getListData();
          }
        }
      },
    },
    page(t) {
      this.getListData();
    },
    perPage(t) {
      this.page = 1;
      this.getListData();
    },
  },
};
</script>
