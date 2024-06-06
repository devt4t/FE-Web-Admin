<template>
  <ValidationObserver ref="mainForm" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
      <v-row class="geko-form-wrapper" v-if="ready">
        <v-col lg="12">
          <geko-input v-model="formData.participant_category" :item="{
            view_data: 'participant_category',
            type: 'select-radio',
            label: 'Kategori Partisipan',
            validation: [],
            option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Personal',
                  icon: 'mdi-account-heart',
                  code: 'personal',
                },
                {
                  label: 'Perusahaan',
                  icon: 'mdi-domain',
                  code: 'company',
                },
              ],
            },
          }" />
        </v-col>

        <v-col v-if="!isCreate">
          <geko-input v-model="formData.participant_no" :item="{
            view_data: 'participant_no',
            type: 'text',
            label: 'Kode Partisipan',
          }" :disabled="true" />
        </v-col>
        <v-col lg="12">
          <geko-input v-model="formData.first_name" :item="{
            view_data: 'first_name',
            type: 'text',
            label:
              formData.participant_category === 'personal'
                ? 'Nama Depan'
                : 'Nama Perusahaan',
            validation: ['required'],
          }" />
        </v-col>
        <v-col lg="12" v-if="formData.participant_category == 'personal'">
          <geko-input v-model="formData.last_name" :item="{
            view_data: 'last_name',
            type: 'text',
            label: 'Nama Belakang',
            validation: [],
          }" />
        </v-col>
        <v-col lg="12">
          <geko-input v-model="formData.email" :item="{
            view_data: 'email',
            type: 'text',
            label: 'Email',
            validation: ['required', 'email'],
          }" />
        </v-col>
        <!-- <v-col lg="6">
          <geko-input
            v-model="formData.phone"
            :item="{
              view_data: 'phone',
              type: 'text',
              label: 'No. HP',
              validation: ['required'],
            }"
          />
        </v-col> -->
        <!-- <v-col lg="12">
          <geko-input
            v-model="formData.country"
            :item="{
              view_data: 'country',
              type: 'select',
              label: 'Negara',
              validation: ['required'],
              option: {
                list_pointer: {
                  label: 'name',
                  code: 'id',
                  display: ['name'],
                },
                default_options: [
                  {
                    label: 'Indonesia',
                    code: 'Indonesia',
                  },
                  {
                    label: 'Foreign',
                    code: 'Foreign',
                  },
                ],
              },
            }"
          />
        </v-col>

        <v-col lg="6" v-if="formData.country === 'Indonesia'">
          <geko-input
            v-model="formData.province"
            :item="{
              view_data: 'province',
              label: 'Provinsi',
              api: 'GetProvinceAdmin',
              type: 'select',
              validation: ['required'],
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  label: 'name',
                  code: 'province_code',
                  display: ['name'],
                },
              },
            }"
          />
        </v-col>

        <v-col lg="6" v-if="formData.country === 'Indonesia'">
          <geko-input
            v-model="formData.kabupaten"
            :disabled="!formData.province"
            :item="{
              view_data: 'kabupaten',
              label: 'Kota / Kabupaten',
              api: 'GetKabupatenByProvince',
              type: 'select',
              param: {
                province_code: formData.province,
              },
              validation: ['required'],
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  label: 'namaKabupaten',
                  code: 'kabupaten_no',
                  display: ['namaKabupaten'],
                },
              },
            }"
          />
        </v-col>

        <v-col lg="12">
          <geko-input
            v-model="formData.address1"
            :item="{
              view_data: 'address1',
              label: 'Alamat 1',
              type: 'textarea',
              validation: ['required'],
            }"
          />
        </v-col>
        <v-col lg="8">
          <geko-input
            v-model="formData.address2"
            :item="{
              view_data: 'address2',
              label: 'Alamat 2',
              type: 'text',
              validation: [],
            }"
          />
        </v-col>
        <v-col lg="4">
          <geko-input
            v-model="formData.postal_code"
            :item="{
              view_data: 'postal_code',
              label: 'Kode Pos',
              type: 'text',
              validation: [],
            }"
          />
        </v-col>

        <v-col lg="12">
          <geko-input
            v-model="formData.participant_category"
            :item="{
              view_data: 'participant_category',
              type: 'select',
              label: 'Kategori Participant',
              validation: ['required'],
              option: {
                getterKey: 'data.result',
                list_pointer: {
                  label: 'name',
                  code: 'code',
                  display: ['name'],
                },
                default_options: [
                  {
                    label: 'Personal',
                    code: 'personal',
                  },
                  {
                    label: 'Business',
                    code: 'business',
                  },
                ],
              },
            }"
          />
        </v-col>
        <v-col lg="6" v-if="formData.participant_category === 'business'">
          <geko-input
            v-model="formData.company"
            :item="{
              view_data: 'company',
              label: 'Nama Perusahaan',
              type: 'text',
              validation: ['required'],
            }"
          />
        </v-col>
        <v-col lg="6" v-if="formData.participant_category === 'business'">
          <geko-input
            v-model="formData.website"
            :item="{
              view_data: 'website',
              label: 'Website',
              type: 'text',
              validation: [],
            }"
          />
        </v-col>
        <v-col lg="12">
          <geko-input
            v-model="formData.photo"
            :item="{
              view_data: 'photo',
              label: 'Foto',
              type: 'upload',
              validation: [],
            }"
          />
        </v-col>
        <v-col lg="6">
          <geko-input
            v-model="formData.join_date"
            :item="{
              view_data: 'join_date',
              label: 'Tgl. Bergabung',
              type: 'date',
              validation: ['required'],
            }"
          />
        </v-col> -->

        <v-col lg="6">
          <geko-input v-model="formData.join_year" :item="{
            view_data: 'join_year',
            label: 'Tahun Bergabung',
            type: 'select',
            validation: ['required'],
            option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: '2020',
                  code: 2020,
                },
                {
                  label: '2021',
                  code: 2021,
                },
                {
                  label: '2022',
                  code: 2022,
                },
                {
                  label: '2023',
                  code: 2023,
                },
                {
                  label: '2024',
                  code: 2024,
                },
              ],
            },
          }" />
        </v-col>
        <v-col lg="6">
          <geko-input v-model="formData.active" :item="{
            view_data: 'active',
            label: 'Status',
            type: 'select',
            validation: ['required'],
            option: {
              list_pointer: {
                label: 'label',
                code: 'code',
                display: ['label'],
              },
              default_options: [
                {
                  label: 'Aktif',
                  code: 1,
                },
                {
                  label: 'Tidak Aktif',
                  code: 0,
                },
              ],
            },
          }" />
        </v-col>

        <v-col lg="12" class="mt-4">
          <div class="d-flex flex-row justify-content-end">
            <v-btn variant="light" class="mr-2" @click="$router.go(-1)">Batal</v-btn>
            <v-btn variant="success" :disabled="loading" type="submit">
              {{ isCreate ? "Tambah" : "Perbarui" }} Data
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  name: "donor-form",
  watch: {
    "formData.country": {
      handler(v) {
        console.log(this.formData);
      },
    },
  },
  data() {
    return {
      isCreate: null,
      loading: false,
      ready: false,
      formData: {
        participant_category: "personal",
        first_name: null,
        last_name: null,
        address1: null,
        address2: null,
        province: null,
        kabupaten: null,
        country: null,
        postal_code: null,
        email: null,
        phone: null,
        join_date: null,
        photo: null,
        company: null,
        website: null,
        active: 1,
      },
    };
  },

  mounted() {
    this.isCreate = this.$route.query.view === "create";

    if (this.$route.query.view === "update") {
      this.getDetailDonor();
    } else {
      this.ready = true;
    }
  },

  methods: {
    async getDetailDonor() {
      const result = await this.$_api.get("DetailDonor", {
        id: this.$route.query.id,
      });
      const keys = [
        "active",
        "email",
        "first_name",
        "last_name",
        "join_year",
        "participant_category",
        "participant_no",
      ];
      for (const key of keys) {
        this.$set(this.formData, key, result.data[key]);
      }

      this.ready = true;
    },
    onSubmit() {
      this.loading = true;

      let payload = JSON.parse(JSON.stringify(this.formData));

      if (!this.isCreate) {
        payload.current_id = this.$route.query.id;
      }

      this.$_api
        .post(this.isCreate ? "AddDonor" : "UpdateDonor", payload)
        .then(() => {
          this.loading = false;
          this.$_alert.success(
            `Data Donatur berhasil ${this.isCreate ? "ditambahkan" : "diperbarui"
            }`
          );
          this.$router.go(-1);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
