<template>
  <geko-base-crud :config="config">
    <template v-slot:list-first_name="{ item }">
      <div class="d-flex flex-column min-w-100px">
        <div v-if="item.participant_category === 'personal'">
          <span>{{ item.first_name }}</span>
          <span v-if="item.last_name">{{ " " + item.last_name }}</span>
        </div>

        <span v-else>{{ item.first_name }}</span>
      </div>
    </template>

    <template v-slot:list-address1="{ item }">
      <div class="min-w-200px d-flex flex-column">
        <span>{{ item.address1 }}</span>
        <span v-if="item.address2" class="font-weight-300 text-small">{{
          item.address2
        }}</span>
      </div>
    </template>

    <template v-slot:list-province="{ item }">
      <div class="text-capitalize">
        {{ parseAddress(item) }}
      </div>
    </template>

    <template v-slot:list-company="{ item }">
      <div class="min-w-200px">
        <span v-if="!item.company">-</span>
        <p class="font-weight-bold mb-0" v-else>
          {{ item.company }}
        </p>
        <p class="mb-0 pb-0" v-if="item.website">{{ item.website }}</p>
      </div>
    </template>

    <template v-slot:detail-row-first_name="{ item }">
      <div class="geko-base-detail-item">
        <div class="label">
          <p class="mb-0 pb-0">
            {{ item.participant_category == "company" ? "Perusahaan" : "Nama" }}
          </p>
        </div>

        <div class="value">
          <p class="mb-0 pb-0">
            {{
              item.participant_category == "company"
                ? item.first_name
                : `${item.first_name} ${item.last_name}`
            }}
          </p>
        </div>
      </div>
    </template>

    <template v-slot:create-form>
      <donor-form />
    </template>
  </geko-base-crud>
</template>

<script>
import DonorForm from "./DonorForm.vue";
export default {
  name: "crud-donor",
  watch: {},
  components: {
    DonorForm,
  },
  data() {
    return {
      config: {
        title: "Donor",
        program_year: {
          show: false,
          model: "2024",
        },
        model_api: null,
        getter: "GetDonorAllAdmin",
        getterDataKey: "data",
        setter: "addProjectUtils",
        update: "updateProjectUtils",
        delete: "newDeleteDonor",
        detail: "",
        pk_field: null,
        permission: {
          create: "donor-create",
          read: "donor-list",
          update: "donor-update",
          show: "donor-show",
          lookup: "donor-lookup",
          delete: "donor-delete",
        },
        slave: [],
        fields: [
          {
            id: "id",
            methods: {
              list: false,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "first_name",
            label: "Nama/Perusahaan",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: {
                type: "row-slot",
              },
              create: {
                validation: ["required"],
                label: "Nama Depan",
                col_size: 6,
              },
              update: { validation: ["required"] },
              filter: false,
            },
          },

          {
            id: "participant_no",
            label: "Kode Donor",
            methods: {
              list: true,
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },

          {
            id: "last_name",
            label: "Nama Belakang",
            methods: {
              list: false,
              detail: false,
              create: {
                validation: ["required"],
                col_size: 6,
              },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },

          // {
          //   id: "phone",
          //   label: "No. HP",
          //   methods: {
          //     list: true,
          //     detail: true,
          //     create: { validation: ["required"], col_size: 6 },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          {
            id: "participant_category",
            label: "Kategori Donor",
            methods: {
              list: {
                show: true,
                class: "text-capitalize",
              },
              detail: true,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "email",
            label: "Email",
            methods: {
              list: true,
              detail: {
                type: "text",
              },
              create: { validation: ["required", "email"], col_size: 6 },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },

          // {
          //   id: "address1",
          //   label: "Alamat",
          //   methods: {
          //     list: {
          //       type: "row-slot",
          //     },
          //     detail: true,
          //     create: {
          //       validation: ["required"],
          //       type: "textarea",
          //       col_size: 8,
          //     },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          // {
          //   id: "postal_code",
          //   label: "Kode Pos",
          //   methods: {
          //     list: false,
          //     detail: true,
          //     create: { validation: ["required"], col_size: 4 },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          // {
          //   id: "province",
          //   label: "Provinsi",
          //   methods: {
          //     list: {
          //       type: "row-slot",
          //       label: "Provinsi/Kota/Desa",
          //     },
          //     detail: true,
          //     create: {
          //       getter: "GetProvinceAdmin",
          //       setter: "province_code",
          //       type: "select",
          //       validation: ["required"],
          //       option: {
          //         getterKey: "data.result",
          //         list_pointer: {
          //           label: "name",
          //           code: "id",
          //           display: ["name"],
          //         },
          //       },
          //     },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          // {
          //   id: "company",
          //   label: "Perusahaan",
          //   methods: {
          //     list: {
          //       type: "row-slot",
          //     },
          //     detail: true,
          //     create: { validation: ["required"] },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          // {
          //   id: "join_date",
          //   label: "Tgl. Bergabung",
          //   methods: {
          //     list: {
          //       transform: "date",
          //       class: "text-no-wrap",
          //     },
          //     detail: true,
          //     create: { validation: ["required"], type: "date" },
          //     update: { validation: ["required"], setter: "new_name" },
          //     filter: false,
          //   },
          // },

          {
            id: "active",
            label: "Status",
            methods: {
              list: {
                transform: "active",
                class: {
                  1: "badge bg-success",
                  0: "badge bg-danger",
                },
              },
              detail: {
                transform: "active",
                class: {
                  1: "badge bg-success",
                  0: "badge bg-danger",
                },
              },
              create: { validation: ["required"], type: "date" },
              update: { validation: ["required"], setter: "new_name" },
              filter: false,
            },
          },
        ],
      },
    };
  },

  methods: {
    parseAddress(item) {
      let locations = [];
      let keys = ["city", "state", "country"];

      for (const key of keys) {
        if (item[key]) {
          locations.push(item[key]);
        }
      }

      return locations.join(", ").toLowerCase();
    },
  },
};
</script>
