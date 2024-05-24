<template>
  <div class="geko-base-crud">
    <div class="d-flex flex-row geko-base-crud-header">
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

      <div
        class="global-filters d-flex flex-row"
        v-if="
          config.globalFilter &&
          config.globalFilter.project_purpose &&
          activeView === 'list'
        "
      >
        <geko-select
          v-model="globalFilter.project_purpose"
          @option:selected="
            setGlobalFilter('project_purpose', $event.code, 'tmpProjectPurpose')
          "
          class="vs-style v-select-40 no-clear min-w-150px mr-3"
          placeholder="Tujuan Project"
          :reduce="(x) => x.code"
          :options="[
            {
              label: 'Semua',
              code: '',
            },
            {
              label: 'Carbon',
              code: 'carbon',
            },

            {
              label: 'Non Carbon',
              code: 'non-carbon',
            },
          ]"
        />
        <geko-select
          v-model="globalFilter.tmpProgramYear"
          class="vs-style v-select-40 no-clear min-w-100px"
          placeholder="Tahun"
          :options="[
            {
              label: 'Semua',
              code: '',
            },
            {
              label: '2020',
              code: '2020',
            },
            {
              label: '2021',
              code: '2021',
            },
            {
              label: '2022',
              code: '2022',
            },
            {
              label: '2023',
              code: '2023',
            },
            {
              label: '2024',
              code: '2024',
            },
          ]"
        />
      </div>
    </div>

    <!-- Base Table Data -->

    <!-- :items-per-page="perPage" -->
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
        :server-items-length="totalRecord"
        :items-per-page="perPage"
        :page="page"
        :footer-props="{
          itemsPerPageText: 'Jumlah Data Per Halaman',
          itemsPerPageOptions: [10, 25, 50, 100, 200],
          showCurrentPage: true,
          showFirstLastPage: true,
        }"
        :loading="loading"
      >
        <template v-slot:top>
          <div class="geko-list-header px-5 py-3 mt-1">
            <div class="pr-5 mr-5">
              <h4>{{ config.title }}</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar">
                <form v-on:submit.prevent="getListData">
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

            <div class="statistics" v-if="config.statistic && statistic">
              <div
                class="statistic-item"
                v-if="Array.isArray(statistic)"
                v-for="(stat, i) in statistic"
                :class="{
                  [stat.color]: true,
                }"
              >
                <v-icon>{{ stat.icon }}</v-icon>
                <div class="statistic-data">
                  <p class="mb-0 label">{{ stat.label }}</p>
                  <p class="mb-0 value">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template
          v-for="f in fields.list.filter(
            (x) => x.type === 'row-slot' || x.transform || x.class
          )"
          v-slot:[`item.${f.view_data}`]="{ item }"
        >
          <slot
            v-if="f.type === 'row-slot'"
            :name="'list-' + f.view_data"
            v-bind:item="item"
          ></slot>

          <span
            v-else
            :class="{
              [typeof f.class === 'string' ? `d-block ${f.class}` : '']: true,
              [typeof f.class === 'object' && f.class !== null
                ? `d-block ${f.class[item[f.view_data]]}`
                : '']: true,
            }"
            >{{
              item[f.view_data] | parse(f.transform ? f.transform : "no-empty")
            }}</span
          >
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="geko-list-actions-wrapper d-flex flex-column">
            <div class="geko-list-actions">
              <button
                class="geko-list-action-view"
                @click="
                  $router.push({
                    query: {
                      view: 'detail',
                      id: item.id,
                    },
                  })
                "
              >
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

            <div class="geko-list-actions-bottom">
              <slot name="list-bottom-action" v-bind:item="item"> </slot>
            </div>
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
        :sort="
          config.formOption && Array.isArray(config.formOption.sort)
            ? config.formOption.sort
            : null
        "
        :update_id_getter="config.update_id_getter || 'id'"
        :update_id_setter="config.update_id_setter || 'id'"
      >
        <template
          v-for="f in fields.create.filter((x) => x.type === 'row-slot')"
          v-slot:[`create-${f.view_data}`]="{ formData, field, setFormData }"
        >
          <slot
            :name="'create-' + f.view_data"
            v-bind:formData="formData"
            v-bind:field="field"
            v-bind:setFormData="setFormData"
          >
          </slot>
        </template>

        <template
          v-for="f in fields.update.filter((x) => x.type === 'row-slot')"
          v-slot:[`update-${f.view_data}`]="{ formData, field, setter }"
        >
          <slot
            :name="'update-' + f.view_data"
            v-bind:formData="formData"
            v-bind:field="field"
            v-bind:setter="setter"
          >
          </slot>
        </template>
        <template v-slot:create-form>
          <slot name="create-form"></slot>
        </template>
      </geko-base-form>
    </div>

    <div class="geko-base-detail mx-4" v-else-if="activeView === 'detail'">
      <slot name="detail-row">
        <geko-base-detail
          :fields="fields.detail"
          :api="fields.getter || ''"
          :title="config.title"
        >
          <template v-slot:detail-body>
            <slot name="detail-body"></slot>
          </template>
        </geko-base-detail>
      </slot>
    </div>
  </div>
</template>

<script>
import "../assets/scss/geko-base-crud.scss";
import GekoBaseForm from "./GekoBaseForm.vue";
import GekoBaseDetail from "./GekoBaseDetail.vue";
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
    GekoBaseDetail,
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
      activeView: null,
      activeID: null,
      permission: {},
      statistic: null,
      loading: true,
      totalRecord: null,
      globalFilter: {
        project_purpose: localStorage.getItem("tmpProjectPurpose"),
      },

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
    if (!this.config) return;
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
      return `item.${value}`;
    },
    async onInit() {
      if (!this.$route.query.view) return;
      await this.buildModule();
      await this.generateList();
      this.activeView = this.$route.query.view;
    },
    setGlobalFilter(key, value, localKey) {
      this.$set(this.globalFilter, key, value);
      localStorage.setItem(localKey, value);
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
            class: f.header_class,
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
        _data.param = item.methods[key].param || null;
        _data.show_if = item.methods[key].show_if || null;
        _data.separator = item.methods[key].separator || null;
        _data.disabled = item.methods[key].disabled || null;
      }
      if (key === "create" && item.label == "Created By") {
        console.log(item.methods[key].input);
      }

      return _data;
    },

    async getListData() {
      this.loading = true;
      let _params = JSON.parse(JSON.stringify(this.params));
      let _filters = JSON.parse(JSON.stringify(this.filters));
      if (this.search) {
        _params.search_value = this.search;
      }

      if (this.config.globalFilter) {
        for (const _g of Object.keys(this.globalFilter)) {
          if (this.globalFilter[_g] && this.config.globalFilter[_g]) {
            _params[this.config.globalFilter[_g].setter] =
              this.globalFilter[_g];
          }
        }
      }

      if (typeof this.config.filter_api === "object") {
        _params = Object.assign(
          JSON.parse(JSON.stringify(this.config.filter_api))
        );
      }
      let reqParams = Object.assign(_filters, _params);

      // reqParams.page = this.page;
      // reqParams.per_page = this.perPage;

      reqParams.limit = this.perPage;
      reqParams.offset = (this.page - 1) * this.perPage;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      const responseData = await this.$_api
        .get(this.config.getter, reqParams)
        .catch(() => {
          this.loading = false;
        });

      this.data = this.processListData(
        responseData,
        this.config.getterDataKey || "data"
      );
      if (this.config.statistic) {
        const statisticKey = "count";
        const statisticData = responseData[statisticKey];
        if (statisticData) {
          let statisticArray = [];
          for (const _key of Object.keys(statisticData)) {
            statisticArray.push({
              label: this.config.statistic.transform_key[_key].label,
              value: statisticData[_key],
              icon: this.config.statistic.transform_key[_key].icon,
              color: this.config.statistic.transform_key[_key].color || "",
            });
          }
          this.statistic = statisticArray;
        }
      }
      this.totalRecord = responseData.total;
      this.loading = false;
    },

    onSearch(e) {
      if (e.preventDefault instanceof Function) e.preventDefault();
      this.getListData();
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
