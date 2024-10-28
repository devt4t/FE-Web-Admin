<template>
  <v-dialog v-model="isOpen" :width="'35%'" :style="{
    'min-height': '90vh', 'background-color': 'white'
  }">
    <v-card>
      <v-card-title class="text-center d-block font-weight-bold">
        Detail Petani
      </v-card-title>
      <v-card-text>
        <div class="geko-base-detail-wrapper">
          <div class="geko-base-detail-item" :key="'base-detail'">
            <!-- <div class="label">
                <p class="mb-0 pb-0">label</p>
              </div>
              <div class="value">
                <p class="mb-0 pb-0">
                  <span>value</span>
                </p>
              </div> -->

            <!-- <v-row>
                <v-col>Nama</v-col>
                <v-col>:</v-col>
                <v-col>Jajang</v-col>
              </v-row> -->
            <div class="d-flex flex-row justify-content-center mb-3" style="font-size: 18px;">
              <table>
                <tr>
                  <td>No. Petani</td>
                  <td>:</td>
                  <td>{{ dataFarmer?.kode }}</td>
                </tr>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td>{{ dataFarmer?.nama.split(' - ')[0] }}</td>
                </tr>
                <tr>
                  <td>NIK / No KTP</td>
                  <td>:</td>
                  <td>{{ dataFarmer?.nik }}</td>
                </tr>
                <tr>
                  <td>Desa</td>
                  <td>:</td>
                  <td>{{ dataFarmer?.desa }}</td>
                </tr>
                <tr>
                  <td>FF <small>(Field Facilitator)</small></td>
                  <td>:</td>
                  <td>{{ dataFarmer?.user }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <v-row>
            <v-col style="justify-content: right; display: flex;">
              <v-btn variant="success" @click="handleAddOtherFarmer">
                <v-icon left>mdi-plus</v-icon>
                <span>Tambah</span>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn variant="danger" @click="() => this.isOpen = false">
                <v-icon left>mdi-undo</v-icon>
                <span>Batal</span>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'modal-detail-petani',
  props: {
    isOpen: {
      required: true,
      type: Boolean,
      default: false,
    },
    dataFarmer: {
      required: true,
      type: Object,
      default: {},
    },
  },
  data() {
    return {}
  },
  methods: {
    handleAddOtherFarmer() {
      this.$emit('addedOtherFarmer', this.dataFarmer);
      this.isOpen = false;
    },
  },
};
</script>