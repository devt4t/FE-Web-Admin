<template>
  <v-dialog v-model="dialogVisible" max-width="80%" min-width="60%">
    <v-card>
      <v-card-title>
        <span class="headline">Detail Dusun</span>
      </v-card-title>
      <v-card-text>
        <div class="rra-pra-detail-dusun-wrapper">
          <div class="dusun-item">
            <span class="label">Nama Dusun</span>
            <div class="value"></div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    data: {
      default: null,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      config: [
        {
          label: "Nama Dusun",
          key: "dusun_name",
        },
        {
          label: "Potensi",
          key: "default",
          value: "Pontensial",
          class: "text-success",
        },
        {
          label: "Aksesibilitas",
          key: "accessibility",
        },
        {
          label: "Foto Akses Jalan",
          key: "dusun_access_photo",
        },
        {
          label: "Sumber Data Luas Lahan",
          key: "data_land_area_source",
        },
        {
          label: "Luas Dusun",
          key: "land_area",
        },
      ],
    };
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
  },
  watch: {
    data(val) {
      if (!val) {
        this.dialogVisible = false;
      } else if (val) {
        this.dialogVisible = true;
      }
    },

    dialogVisible(val) {
      if (!val) {
        this.$emit("close");
      }
    },
  },
};
</script>
