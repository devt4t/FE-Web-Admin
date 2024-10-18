<template>
  <div class="geko-base-crud" :class="{
    [config.class || '']: true,
  }">
    <div class="d-flex flex-row geko-base-crud-header">
      <v-breadcrumbs :dark="$store.state.theme == 'dark'" class="breadcrumbsmain" :items="[
        {
          text: 'Menu',
          disabled: true,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: `${config.title}`,
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ]" divider=">" large data-aos="fade-right"></v-breadcrumbs>

      <!-- <div class="global-search">
        <input type="text" placeholder="Cari Modul" />
        <div class="search-result">
          <div class="menu-list">
            <span class="menu-label">Activity</span>
            <div class="submenu-list">
              <div class="submenu-wrapper">
                <a href="#">Sosialisasi Program</a>
              </div>
              <div class="submenu-wrapper">
                <a href="#">Scooping Visit</a>
              </div>
            </div>
          </div>
          <div class="menu-list">
            <span class="menu-label">Utilities</span>
            <div class="submenu-list">
              <div class="submenu-wrapper">
                <a href="#">Management Unit</a>
              </div>
              <div class="submenu-wrapper">
                <a href="#">Target Area</a>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="global-filters d-flex flex-row" v-if="config.globalFilter && activeView === 'list'">
        <geko-select v-if="config.globalFilter.project_purpose" v-model="globalFilter.project_purpose" @option:selected="
          setGlobalFilter('project_purpose', $event.code, 'tmpProjectPurpose')
          " class="vs-style v-select-40 no-clear min-w-150px mr-3" placeholder="Tujuan Project" :reduce="(x) => x.code"
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
          ]" />
        <geko-select v-if="config.globalFilter.program_year" v-model="globalFilter.tmpProgramYear"
          class="vs-style v-select-40 no-clear min-w-100px" placeholder="Tahun" :options="[
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
          ]" @option:selected="
            setGlobalFilter('program_year', $event.code, 'tmpProgramYear')
            " />
      </div>
    </div>

    <!-- Base Table Data -->

    <!-- :items-per-page="perPage" -->
    <div class="geko-list" v-if="activeView === 'list' && !this.hideList">
      <v-data-table :headers="header" hide-default-header :items="data" :search="''"
        class="rounded-xl elevation-1 mx-3 pa-1" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
        @update:page="onChangePage" @update:items-per-page="($p) => (perPage = $p)" :server-items-length="totalRecord"
        :items-per-page="perPage" :page="page" :footer-props="{
          itemsPerPageText: 'Jumlah Data Per Halaman',
          itemsPerPageOptions: [10, 25, 50, 100, 200],
          showCurrentPage: true,
          showFirstLastPage: true,
        }" :loading="loading" :show-expand="config.expandable || false" single-expand>
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <tr>
              <th v-for="h in headers" :class="h.class">
                <span>{{ h.text | parse(h.transform) }}</span>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:top>
          <div class="geko-list-header px-5 py-3 mt-1">
            <div class="pr-5 mr-5">
              <h4>{{ config.title }}</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar">
                <form v-on:submit.prevent="getListData">
                  <!-- <v-text-field
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
                    @change="onChangeSearch"
                  ></v-text-field> -->
                  <div class="list-search-wrapper">
                    <v-icon class="prepend">mdi-magnify</v-icon>
                    <input v-model="search" type="text" :placeholder="'Cari data ' + config.title.toLowerCase()" />
                    <v-icon v-if="typeof search == 'string' && search.length > 0" @click="
                      search = '';
                    getListData();
                    " class="append">mdi-close</v-icon>
                  </div>
                </form>
                <button class="toolbar-button mr-2" v-if="
                  Array.isArray(fields.filter) &&
                  fields.filter.filter((x) => !x.main).length > 0
                " @click="filterOpen = !filterOpen" :class="{
                  active: filterOpen,
                }">
                  <v-icon>mdi-filter</v-icon>
                </button>
                <button class="toolbar-button mr-2" @click="onRefresh">
                  <v-icon>mdi-refresh</v-icon>
                </button>
                <button v-if="config.export" class="toolbar-button label mr-2" @click="onExportExcell()"
                  style="background-color: #1b5e20">
                  <v-icon style="color: white">mdi-microsoft-excel</v-icon>
                </button>
                <button v-if="config.export" class="toolbar-button label mr-2" @click="onExportPdf()"
                  style="background-color: #ff0000">
                  <v-icon style="color: white">mdi-file-pdf-box</v-icon>
                </button>

                <geko-base-filter v-if="
                  Array.isArray(fields.filter) &&
                  fields.filter.filter((x) => x.main).length > 0
                " :fields="fields.filter.filter((x) => x.main)" :mainFilter="true" :open="true" :data="filters"
                  @filter="onFilter($event)" />
              </div>
              <slot name="list-before-create"> </slot>
              <v-btn v-if="!hideCreate && $_sys.isAllowed(config.permission.create)" variant="success" class="ml-4"
                @click="
                  $router.push({
                    query: {
                      view: 'create',
                    },
                  })
                  ">
                <v-icon small>mdi-plus</v-icon>
                <span class="ms-2">Tambah Data</span>
              </v-btn>
            </div>
            <slot name="list-after-filter"> </slot>

            <geko-base-filter v-if="
              Array.isArray(fields.filter) &&
              fields.filter.filter((x) => !x.main).length > 0
            " @close="filterOpen = false" :open="filterOpen" :fields="fields.filter.filter((x) => !x.main)"
              @filter="onFilter($event)" />

            <div class="statistics" v-if="config.statistic && statistic">
              <div class="statistic-item" v-if="Array.isArray(statistic)" v-for="(stat, i) in statistic" :class="{
                [stat.color]: true,
              }">
                <v-icon>{{ stat.icon }}</v-icon>
                <div class="statistic-data">
                  <p class="mb-0 label">{{ stat.label }}</p>
                  <p class="mb-0 value">
                    <slot :name="'statistic-' + stat.key" v-bind:item="stat.data">
                      <span>{{
                        [undefined, null, ""].includes(stat.value)
                          ? "-"
                          : stat.value | parse(stat.transform)
                      }}</span>
                    </slot>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:group>
          <div>test</div>
        </template>

        <template v-slot:item.index="{ index }">
          {{ (page - 1) * perPage + index + 1 }}
        </template>

        <template v-for="f in fields.list.filter(
          (x) => x.type === 'row-slot' || x.transform || x.class
        )" v-slot:[`item.${f.view_data}`]="{ item }">
          <slot v-if="f.type === 'row-slot'" :name="'list-' + f.view_data" v-bind:item="item"></slot>

          <span v-else :class="{
            [typeof f.class === 'string' ? `d-block ${f.class}` : '']: true,
            [typeof f.class === 'object' && f.class !== null
              ? `d-block ${f.class[item[f.view_data]]}`
              : '']: true,
          }">{{
            item[f.view_data] | parse(f.transform ? f.transform : "no-empty")
          }}</span>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <slot name="list-expanded-item" v-bind:headers="headers" v-bind:item="item"></slot>

        </template>

        <template v-slot:item.actions="{ item }" v-if="!hideAction">
          <div class="geko-list-actions-wrapper d-flex flex-column">
            <div class="geko-list-actions">
              <slot name="list-action-detail" v-bind:item="item" v-if="$_sys.isAllowed(config.permission.detail)">
                <button v-if="$_sys.isAllowed(config.permission.detail)" class="geko-list-action-view" @click="
                  $router.push({
                    name: $route.name,
                    query: {
                      view: 'detail',
                      id: item.id,
                      [config.detailIdKey ? config.detailIdKey : '']:
                        item[config.detailIdKey],
                    },
                    params:
                      (config.detail && config.detailParams) || !config.detail
                        ? item
                        : null,
                  })
                  ">
                  <v-icon small>mdi-information-outline</v-icon>
                </button>
              </slot>

              <slot name="list-action-update" v-bind:item="item"
                v-if="!hideUpdate && $_sys.isAllowed(config.permission.update)">
                <button class="geko-list-action-update" @click="
                  $router.push({
                    query: {
                      view: 'update',
                      id: item.id,
                      [config.detailIdKey ? config.detailIdKey : '']:
                        item[config.detailIdKey],
                    },

                    params: item,
                  })
                  ">
                  <v-icon small>mdi-pencil-minus</v-icon>
                </button>
              </slot>
              <slot name="geko-list-action-delete" v-if="!hideDelete && $_sys.isAllowed(config.permission.delete)">
                <button class="geko-list-action-delete" @click="onDelete(item)" v-if="config.delete">
                  <v-icon small>mdi-trash-can-outline</v-icon>
                </button>
              </slot>

              <button class="geko-list-action-soft-delete" @click="onDelete(item, config.deleteSoft.payload)" v-if="
                ['4', '13'].includes($store.state.User.role) &&
                config.deleteSoft &&
                config.deleteSoft.payload &&
                $_sys.isAllowed(config.permission.delete)
              ">
                <v-icon small>mdi-eye-off-outline</v-icon>
              </button>
            </div>

            <div class="geko-list-actions-bottom">
              <slot name="list-bottom-action" v-bind:item="item"> </slot>
            </div>
          </div>
        </template>
      </v-data-table>
    </div>

    <div class="geko-form mx-4" v-if="
      ['create', 'update'].includes(activeView) &&
      $_sys.isAllowed(config.permission[activeView])
    ">
      <geko-base-form :title="config.title" :fields="activeView === 'create' ? fields.create : fields.update"
        :setter="config.setter" :setterExtPayload="config.setter_ext_payload" :update="config.update"
        :updateExtPayload="config.update_ext_payload" :detail="config.detail" :detailIdKey="config.detailIdKey"
        :detailKey="config.detailKey" @success="onCreateSuccess" :sort="config.formOption && Array.isArray(config.formOption.sort)
          ? config.formOption.sort
          : null
          " :formConfig="config.formConfig || {}" :update_id_getter="config.update_id_getter || 'id'"
        :update_id_setter="config.update_id_setter || 'id'">
        <template v-for="f in fields.create.filter((x) => x.type === 'row-slot')"
          v-slot:[`create-${f.view_data}`]="{ formData, field, setFormData }">
          <slot :name="'create-' + f.view_data" v-bind:formData="formData" v-bind:field="field"
            v-bind:setFormData="setFormData">
          </slot>
        </template>

        <template v-for="f in fields.update.filter((x) => x.type === 'row-slot')"
          v-slot:[`update-${f.view_data}`]="{ formData, field, setter }">
          <slot :name="'update-' + f.view_data" v-bind:formData="formData" v-bind:field="field" v-bind:setter="setter">
          </slot>
        </template>

        <template v-slot:create-form>
          <slot name="create-form"></slot>
        </template>
      </geko-base-form>
    </div>

    <div class="geko-base-detail mx-4" v-else-if="activeView === 'detail'">
      <slot name="detail-row">
        <geko-base-detail :fields="fields.detail" :api="config.detail || ''" :title="config.title"
          :idKey="config.detailIdKey || 'id'" :dataKey="config.detailKey || ''">
          <template v-slot:detail-body>
            <slot name="detail-body"></slot>
          </template>

          <template v-for="(f, i) in fields.detail.filter((x) => x.type === 'row-slot')"
            v-slot:[`detail-row-${f.view_data}`]="{ item, response }">
            <slot :name="'detail-row-' + f.view_data" v-bind:item="item" v-bind:response="response">
            </slot>
          </template>

          <template v-for="(f, i) in fields.detail.filter((x) => x.type === 'slot')"
            v-slot:[`detail-${f.view_data}`]="{ item }">
            <slot :name="`detail-${f.view_data}`" v-bind:item="item"> </slot>
          </template>

          <template v-slot:detail-slave-raw="{ data }">
            <slot name="detail-slave-raw" v-bind:data="data"></slot>
          </template>

          <template v-slot:detail-body-after="{ item, response }">
            <slot name="detail-body-after" v-bind:item="item" v-bind:response="response"></slot>
          </template>

          <template v-slot:detail-header-action="{ item, response }">
            <slot name="detail-header-action" v-bind:item="item" v-bind:response="response"></slot>
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
import GekoBaseFilter from "./GekoBaseFilter.vue";

import _ from "lodash";
export default {
  name: "geko-base-crud",
  props: {
    config: {
      type: Object,
      required: true,
      default: {},
    },
    hideAction: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideCreate: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    hideList: {
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
    hideDeleteSoft: {
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
    refreshKey: {
      type: Number,
      requried: false,
      default: 0,
    },
  },
  components: {
    GekoBaseForm,
    GekoBaseDetail,
    GekoBaseFilter,
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
      filterOpen: false,
      activeView: null,
      activeID: null,
      permission: {},
      statistic: null,
      loading: false,
      totalRecord: null,
      preventFuckingBinding: false,
      globalFilter: {
        project_purpose: this.$store.state.tmpProjectPurpose,
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
    onChangePage(t) {
      if (this.preventFuckingBinding) return;
      this.page = t;
      this.getListData();
    },
    onCreateSuccess(data) {
      this.$emit("create-success", data);

      this.getListData();
    },
    getSlotName(value) {
      return `item.${value}`;
    },
    async onInit() {
      if (!this.$route.query.view) return;
      await this.buildModule();
      await this.generateList();
      this.activeView = this.$route.query.view;

      this.getListData();
    },
    setGlobalFilter(key, value, localKey, refresh = true) {
      this.$set(this.globalFilter, key, value);
      this.$store.commit("set", [localKey, value, true]);

      if (refresh) {
        if (this.page !== 1) {
          this.page = 1;
        } else {
          this.getListData();
        }
      }
    },

    onFilter(newData) {
      if (typeof newData !== "object") return;
      this.filters = Object.assign(newData, this.filters);

      if (this.page !== 1) {
        this.page = 1;
      } else {
        this.getListData();
      }
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
          if (!this.hideAction) {

            _header.push({
              text: "",
              key: "actions",
              value: "actions",
              class: "sticky-left",
              sortable: false,
            });
          }
          _header.push({
            text: "#",
            value: "index",
            key: "index",
            class: this.hideAction ? 'sticky-left' : '',
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

        this.setDefaultFilter();
        return resolve();
      });
    },

    setDefaultFilter() {
      //GLOBAL FILTER DEFAULT VALUE
      if (this.config.globalFilter) {
        if (this.config.globalFilter.program_year) {
          const _programYear = this.$store.state.tmpProgramYear
            ? this.$store.state.tmpProgramYear
            : localStorage.getItem("tmpProgramYear")
              ? localStorage.getItem("tmpProgramYear")
              : this.$_config.programYear.model;
          this.$set(
            this.globalFilter,
            "program_year",
            _programYear,
            "tmpProgramYear"
          );
          this.$set(this.globalFilter, "tmpProgramYear", {
            label: _programYear,
            code: _programYear,
          });
        }
      }
    },

    generateConfigField(item, key) {
      let _data = {
        view_data: item.methods[key].view_data || item.id,
        label: item.methods[key].label
          ? item.methods[key].label
          : item.label
            ? item.label
            : item.id,
        header_class: item.methods[key].header_class || "",
        type: item.methods[key].type || "text",
        class: item.methods[key].class || "",
        transform: item.methods[key].transform || null,
        validation: item.methods[key].validation || [],
        input:
          typeof item.methods[key].input === "boolean"
            ? item.methods[key].input
            : true,
        default: item.methods[key].default || null,
      };

      if (["list"].includes(key)) {
        // if (item.methods[key].sticky)
        // _data.header_class = _data.header_class += " sticky-left";
      }

      if (["update", "create", "filter"].includes(key)) {
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
        _data.base_type = item.methods[key].base_type || null;
      }

      if (["filter"].includes(key)) {
        _data.form_param = item.methods[key].form_param || null;
        _data.main = item.methods[key].main || null;
        _data.icon = item.methods[key].icon || null;
        _data.ext_param = item.methods[key].ext_param || {}
      }

      return _data;
    },

    onChangeSearch: _.debounce(function () {
      this.getListData();
    }, 1500),
    async getListData() {
      if (this.hideList) {
        return;
      }
      if (this.loading) return;
      this.loading = true;
      let _params = JSON.parse(JSON.stringify(this.params));
      let _filters = JSON.parse(JSON.stringify(this.filters));
      if (this.search) {
        _params[this.config.search_key || "search_value"] = this.search;
      }

      if (this.config.globalFilter) {
        for (const _g of Object.keys(this.globalFilter)) {
          if (this.globalFilter[_g] && this.config.globalFilter[_g]) {
            _params[this.config.globalFilter[_g].setter] =
              this.globalFilter[_g];
          }
        }
      }

      // if (typeof this.config.filter_api === "object") {
      //   _params = Object.assign(
      //     JSON.parse(JSON.stringify(this.config.filter_api)),
      //     _params
      //   );
      // }

      let reqParams = Object.assign(_filters, _params);

      // reqParams.page = this.page;
      // reqParams.per_page = this.perPage;

      reqParams[this.config.limitKey || 'limit'] = this.perPage;
      reqParams[this.config.offsetKey || 'offset'] = (this.page - 1) * this.perPage;

      if (this.config.offsetKey == 'page') {
        reqParams[this.config.offsetKey] = this.page;
      }
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
        const statisticKey = ![null, undefined].includes(
          this.config.statistic.statistic_key
        )
          ? this.config.statistic.statistic_key
          : "count";
        let statisticData = responseData;
        for (const _key of statisticKey == "" ? [] : statisticKey.split(".")) {
          statisticData = statisticData[_key];
        }
        if (statisticData) {
          let statisticArray = [];

          for (const _key of Object.keys(this.config.statistic.transform_key)) {
            let _processedStat = {
              label: this.config.statistic.transform_key[_key].label,
              value: statisticData[_key],
              key: _key,
              icon: this.config.statistic.transform_key[_key].icon,
              color: this.config.statistic.transform_key[_key].color || "",
              transform:
                this.config.statistic.transform_key[_key].transform ||
                "no-null",
            };

            if (this.config.statistic.transform_key[_key].type == "slot") {
              _processedStat.data = {};
              for (const _keys of Array.isArray(
                this.config.statistic.transform_key[_key].pointer
              )
                ? this.config.statistic.transform_key[_key].pointer
                : []) {
                _processedStat.data[_keys] = statisticData[_keys];
              }
            }
            statisticArray.push(_processedStat);
          }
          this.statistic = statisticArray;
        }
      }

      this.totalRecord = this.config.totalDataKey ? this.processListData(responseData, this.config.totalDataKey) : responseData.total;



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

    onDelete(item, extPayload = null) {
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
              _param = JSON.parse(
                JSON.stringify(this.config.delete_ext_payload)
              );
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
              _param[this.config.deleteLabel || this.config.deleteKey] =
                item[this.config.deleteKey];
            } else {
              _param.id = item.id;
            }

            if (extPayload) _param = Object.assign(_param, extPayload);
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

    onExportExcell() {
      const _data = {
        params: this.params,
        filter: this.filters,
        data: this.data,
        totalRecord: this.totalRecord,
      };

      this.$emit("onExportExcel", _data);
    },

    onExportPdf() {
      const _data = {
        params: this.params,
        filter: this.filters,
        data: this.data,
        totalRecord: this.totalRecord,
      };

      this.$emit("onExportPdf", _data);
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
          if (to.query.view !== "list") {
            window.scrollTo({
              top: 0,
            });
          }
          if (this.activeView === "list") {
            this.setDefaultFilter();
            this.getListData();
          }
        }
      },
    },
    perPage(t) {
      if (
        typeof this.config.pagination == "boolean" &&
        this.config.pagination == false
      ) {
        return;
      }
      this.loading = true;

      this.perPage = t;
      this.page = 1;
      this.loading = false;
      this.getListData();
    },
    refreshKey(t) {
      if (t > 0) {
        this.onRefresh();
      }
    },
    search(t) {
      if (this.loading) return;
      if (t == "") {
        return;
      }

      if (t) {
        this.onChangeSearch();
      }
    },
  },
};
</script>
