<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
  <div>
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configAllocationTransportDetail.table.header"
            :items="data.result.detail_allocation_transportation" :search="''" class="rounded-xl elevation- pa-1 px-5">

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail Armada Distribusi</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Data Alokasi Transport</p>
                    <p class="mb-0 value">{{ data.result.detail_allocation_transportation.length ?? '' }}</p>

                  </div>
                </div>
              </div>
            </template>

          </v-data-table>
        </v-card>

      </v-col>
      <v-col v-if="false">
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5 px-4">

          <div class="list-header py-3 mt-1">
            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
              <h4>Dokumentasi Distribusi</h4>
            </div>
            <div class="d-flex flex-row geko-list-header-action">
              <div class="geko-list-header-toolbar"></div>
            </div>
          </div>

          <div class="absent-photo-list d-flex flex-row" v-if="true">
            <div class="absent-photo-item"
              @click="showLightbox(data.result.img_photo_created_by.url ?? '/images/noimage.png')" v-bind:style="{
                backgroundImage:
                  'url(' +
                  data.result.img_photo_created_by.thumbnail_url ?? '/images/noimage.png' +
                  ')',
              }">
              <h6>Foto Dokumentasi Distribusi</h6>
            </div>
          </div>

        </v-card>
      </v-col>
    </v-row>

    <!-- detail farmer -->
    <v-row>
      <v-col>
        <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
          <v-data-table :headers="configAllocationFarmerDetail.table.header" :items="data.result.detail_farmers"
            :search="''" class="rounded-xl elevation- pa-1 px-5" :single-expand="true"
            :item-key="data.result.detail_farmers.id" @item-expanded="expandTableReport" show-expand>

            <template v-slot:item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:top>
              <div class="list-header py-3 mt-1">
                <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                  <h4>Detail BAST per-Petani</h4>
                </div>
                <div class="d-flex flex-row geko-list-header-action">
                  <div class="geko-list-header-toolbar"></div>
                </div>
              </div>

              <div class="statistics mb-3">
                <div class="statistic-item light">
                  <v-icon>mdi-list-status</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Data Alokasi Petani</p>
                    <p class="mb-0 value">{{ data.result.detail_farmers.length ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item info">
                  <v-icon>mdi-truck-plus</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Bibit Dimuat</p>
                    <p class="mb-0 value">{{ data.result.ff_seed_loaded ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item warning">
                  <v-icon>mdi-image-broken-variant</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Bibit Rusak</p>
                    <p class="mb-0 value">{{ data.result.ff_seed_broken ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item danger">
                  <v-icon>mdi-help-rhombus-outline</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Bibit Hilang</p>
                    <p class="mb-0 value">{{ data.result.ff_seed_missing ?? 0 }}</p>

                  </div>
                </div>
                <div class="statistic-item success">
                  <v-icon>mdi-check-bold</v-icon>
                  <div class="statistic-data">
                    <p class="mb-0 label">Total Bibit Terdistribusi</p>
                    <p class="mb-0 value">{{ data.result.ff_seed_received ?? 0 }}</p>

                  </div>
                </div>
              </div>
            </template>
            <template v-slot:item.detail_actions="{ item }">
              <v-btn
                v-if="(item.verified_by == null || item.verified_by == '') && item.printed_lable.length > 0 && item.loaded_lable.length > 0 && item.distributed_lable.length > 0"
                @click="updateVerifikasiReportNursery(item, 'verification')" variant="success" small class="mt-2">
                <v-icon class="mr-1">mdi-check-bold </v-icon> Verifikasi
              </v-btn>
              <v-btn v-else-if="(!item.verified_by == null || !item.verified_by == '')"
                @click="updateVerifikasiReportNursery(item, 'unverification')" variant="danger" small class="mt-2">
                <v-icon class="mr-1">mdi-check-bold </v-icon> Unverifikasi
              </v-btn>
              <v-btn v-else variant="warning" small class="mt-2">
                <v-icon class="mr-1">mdi-clock-alert </v-icon> Proses Distribusi Belum Selesai!
              </v-btn>
            </template>
            <template v-slot:item.total_pupuk="{ item }">
              <p v-if="item.is_pupuk_load == 0">0</p>
              <p v-else>{{ item.total_pupuk }}</p>
            </template>
            <!-- <template v-slot:item.acceptance_progress="{ item }">
              <v-progress-circular :rotate="90" :size="50" :width="8" :value="item.farmer_acceptance_percentage"
                :color="progressColorFormat(item.farmer_acceptance_percentage)">
                {{ item.farmer_acceptance_percentage.toFixed(0) }}%
              </v-progress-circular>
            </template> -->
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-card class="geko-base-detail-card mb-5 px-8">
                  <div class="list-header py-3 mt-1 d-flex flex-row align-items-center">
                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                      <h4>Detail Penerimaan Petani {{ item.farmer_name }}</h4>
                    </div>
                    <!-- <div>
                      <v-btn @click="saveDataReportAdjustment(item)" variant="success" small
                        :disabled="hasValidationError">
                        <v-icon class="mr-1">mdi-check-bold </v-icon>
                        Simpan Data Adjust Distribusi
                      </v-btn>
                      <v-alert v-if="hasValidationError" type="error" dense x-small class="mt-2">
                        Total bibit tidak boleh melebihi jumlah dari total bibit yang ter-load!
                      </v-alert>
                    </div> -->
                    <div class="d-flex flex-row geko-list-header-action">
                      <div class="geko-list-header-toolbar"></div>
                    </div>
                  </div>
                  <h3> </h3>
                  <!-- detail penerimaan -->
                  <!-- Total Bibit Terdistribusi: {{ item.farmer_seed_loaded }} -->
                  <v-row>
                    <v-col>
                      <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
                        class="geko-base-detail-card mb-5">
                        <v-simple-table>
                          <template v-slot:default>
                            <tbody>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Total Bibit Terdistribusi
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong>{{
                                    item.farmer_seed_loaded
                                  }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Total Bibit Diterima
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong>{{ item.farmer_seed_received }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Total Bibit Rusak
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong>{{ item.farmer_seed_broken }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Total Bibit Hilang
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong>{{ item.farmer_seed_missing }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Status Distribusi Pupuk
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong>{{ is_pupuk_distributed == 0 ? 'Tidak Menerima' : 'Menerima' }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Total Pupuk Terdistribusi
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <strong v-if="item.is_pupuk_load == 0">0</strong>
                                  <strong v-else>{{ item.total_pupuk }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Tanggal Distribusi
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <!-- <v-date-picker color="green lighten-1 rounded-xl"
                                    v-model="distribution_time"></v-date-picker> -->
                                  <strong>{{ item.distribution_date }}</strong>
                                </td>
                              </tr>
                              <tr>
                                <th class="text-left" style="width: 300px; font-size: 14px">
                                  Nama Penerima
                                </th>
                                <td class="text-left" style="font-size: 14px">
                                  <!-- <geko-input v-model="user_accepted" :item="{
                                    label: 'Nama Penerima',
                                    validation: ['required'],
                                    col_size: 6,
                                    type: 'text',
                                  }" /> -->
                                  <strong>{{ item.user_accepted }}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800"
                        class="geko-base-detail-card mb-5">
                        <!-- <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row"
                            style="justify-content: space-between; margin-left: 5%;">
                            <h4>Foto Penerimaan Petani</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                            <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>

                        <div class="absent-photo-list d-flex flex-row" v-if="item.file_accept != null">
                          <div class="absent-photo-item"
                            @click="showLightbox(item.file_accept.url ?? '/images/noimage.png')" v-bind:style="{
                              backgroundImage:
                                'url(' +
                                item.file_accept.url ?? '/images/noimage.png' +
                                ')',
                            }">
                            <h6>Foto Dokumentasi Distribusi</h6>
                          </div>
                        </div>
                        <div class="absent-photo-list d-flex flex-row">
                          <v-file-input accept="image/png, image/jpeg, image/bmp" @change="
                            (val) => {
                              modal_receiver_photo =
                                val;
                            }
                          " placeholder="Upload Foto Penerimaan" prepend-icon="mdi-camera" show-size
                            label="Upload Foto Penerimaan"></v-file-input>
                        </div>
                        <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row"
                            style="justify-content: space-between; margin-left: 5%;">
                            <h4>Tanda Tangan Petani</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                            <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>

                        <div class="absent-photo-list d-flex flex-row" v-if="item.file_signature != null">
                          <div class="absent-photo-item"
                            @click="showLightbox(item.file_signature.url ?? '/images/noimage.png')" v-bind:style="{
                              backgroundImage:
                                'url(' +
                                item.file_signature.url ?? '/images/noimage.png' +
                                ')',
                            }">
                            <h6>Tanda Tangan Petani</h6>
                          </div>
                        </div>
                        <div class="absent-photo-list d-flex flex-row">
                          <v-file-input accept="image/png, image/jpeg, image/bmp" @change="
                            (val) => {
                              modal_signature_photo =
                                val;
                            }
                          " placeholder="Upload Foto Tanda Tangan Penerima" prepend-icon="mdi-camera" show-size
                            label="Upload Foto Tanda Tangan Penerima"></v-file-input>
                        </div> -->

                        <v-col cols="12">
                          <v-data-table hide-default-footer :items-per-page="-1"
                            :headers="detailSeedFarmer.table.header" :items="detail_seed_adjusted" dense>
                            <!-- No Column -->
                            <template v-slot:item.index="{ index }">
                              {{ index + 1 }}
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- detail seed farmer -->
                  <!-- <div class="list-header py-3 mt-1">
                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                      <h4>Detail Bibit Petani {{ item.farmer_name }}</h4>
                    </div>
                    <div class="d-flex flex-row geko-list-header-action">
                      <div class="geko-list-header-toolbar"></div>
                    </div>
                  </div>
                  <h3> </h3> -->
                  <!-- detail penerimaan -->
                  <!-- Total Bibit Terdistribusi: {{ item.farmer_seed_loaded }} -->
                  <!-- <v-col cols="12">
                    <v-data-table hide-default-footer :items-per-page="-1" :headers="detailSeedFarmer.table.header"
                      :items="detail_seed_adjusted" dense>
                      <template v-slot:item.index="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-slot:item.total_seed="{ item }">
                        <p :class="{ 'error--text font-weight-bold': isExceedingLimit(item) }">
                          {{ parseInt(item.total_received) + parseInt(item.total_damaged) +
                            parseInt(item.total_missing) }} / {{ item.total_load }} Bibit
                        </p>
                        <v-chip v-if="isExceedingLimit(item)" color="error" x-small>
                          Melebihi Batas! ({{ Math.abs(getRemainingSeeds(item)) }} lebih)
                        </v-chip>
                        <v-chip v-else-if="getRemainingSeeds(item) > 0" color="warning" x-small>
                          Sisa: {{ getRemainingSeeds(item) }}
                        </v-chip>
                        <v-chip v-else color="success" x-small>
                          <v-icon class="mr-1" x-small>mdi-check-bold </v-icon> Pas
                        </v-chip>
                      </template>
                      <template v-slot:item.seed_received_percentage="{ item }">
                        <v-progress-circular :rotate="90" :size="50" :width="8" :value="item.seed_received_percentage"
                          :color="progressColorFormat(item.seed_received_percentage)">
                          {{ item.seed_received_percentage.toFixed(0) }}%
                        </v-progress-circular>
                      </template>
                      <template v-slot:item.total_received="{ item }">
                        <geko-input v-model="item.total_received" :item="{
                          label: 'Adjust Penerimaan',
                          validation: ['required'],
                          col_size: 6,
                          type: 'number',
                        }">
                        </geko-input>
                      </template>
                      <template v-slot:item.total_damaged="{ item }">
                        <geko-input v-model="item.total_damaged" :item="{
                          label: 'Adjust Bibit Rusak',
                          validation: ['required'],
                          col_size: 6,
                          type: 'number',
                        }">
                        </geko-input>
                      </template>
                      <template v-slot:item.total_missing="{ item }">
                        <geko-input v-model="item.total_missing" :item="{
                          label: 'Adjust Bibit Hilang',
                          validation: ['required'],
                          col_size: 6,
                          type: 'number',
                        }">
                        </geko-input>
                      </template>
                    </v-data-table>
                  </v-col> -->

                  <!-- <div class="list-header py-3 mt-1">
                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                      <h4>Detail Label Petani {{ item.farmer_name }}</h4>
                    </div>
                    <div class="d-flex flex-row geko-list-header-action">
                      <div class="geko-list-header-toolbar"></div>
                    </div>
                  </div> -->
                  <!-- <h3> </h3> -->
                  <!-- <v-col cols="12">
                    <v-data-table :items-per-page="10" :footer-props="{
                      itemsPerPageOptions: [10, 25, 40, -1],
                    }" :headers="getLableTableHeaders(lable_table_key)"
                      :items="getTableLableItem(lable_table_key, item)" dense>
                      <template v-slot:item.index="{ index }">
                        {{ index + 1 }}
                      </template>
                      <template v-if="lable_table_key == 1" v-slot:item.action="{ item }">
                        <v-btn v-if="item.is_loaded == 1 && (item.is_distributed == 0 || item.is_distributed == null)"
                          @click="setLableDistributed(item)" variant="success" small class="mt-2">
                          <v-icon class="mr-1">mdi-check-bold </v-icon> Terima Label Bibit
                        </v-btn>
                        <v-btn v-if="item.is_loaded == 1 && item.is_distributed == 1" variant="info" small class="mt-2">
                          <v-icon class="mr-1">mdi-information </v-icon> Telah Terdistribusi
                        </v-btn>
                        <v-btn v-if="item.is_loaded == 1 && item.is_distributed == 2" variant="warning" small
                          class="mt-2">
                          <v-icon class="mr-1">mdi-information </v-icon> Label Siap Di-Adjust
                        </v-btn>
                      </template>
                      <template v-slot:top>
                        <div class="statistics mb-3">
                          <div class="statistic-item info">
                            <v-icon>mdi-list-status</v-icon>
                            <div class="statistic-data">
                              <p class="mb-0 label">Total Label Tercetak</p>
                              <p class="mb-0 value">{{ printed_bag.length ?? 0 }}</p>

                            </div>
                          </div>
                          <div class="statistic-item warning">
                            <v-icon>mdi-truck-cargo-container</v-icon>
                            <div class="statistic-data">
                              <p class="mb-0 label">Total Label Ter-Load</p>
                              <p class="mb-0 value">{{ loaded_bag.length ?? 0 }}</p>

                            </div>
                          </div>
                          <div class="statistic-item success">
                            <v-icon>mdi-check-bold</v-icon>
                            <div class="statistic-data">
                              <p class="mb-0 label">Total Label Diterima</p>
                              <p class="mb-0 value">{{ distributed_bag.length ?? 0 }}</p>

                            </div>
                          </div>
                          <div class="statistic-item danger">
                            <v-icon>mdi-magnify-close</v-icon>
                            <div class="statistic-data">
                              <p class="mb-0 label">Total Label Hilang</p>
                              <p class="mb-0 value">{{ missing_bag.length ?? 0 }}</p>

                            </div>
                          </div>
                        </div>
                        <v-row class="align-center justify-center pa-2 pt-3 mx-0 mb-3">
                          <v-select v-model="lable_table_key" :items="[
                            { text: 'Label Tercetak', value: 0 },
                            { text: 'Label Ter-Load', value: 1 },
                            { text: 'Label Diterima', value: 2 },
                            { text: 'Label Hilang', value: 3 },
                          ]" outlined dense hide-details :menu-props="{
                            bottom: true,
                            offsetY: true,
                            rounded: 'xl',
                            transition: 'slide-y-transition',
                          }" label="Data Tabel 'Label'" class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
                            style="max-width: 200px"></v-select>
                        </v-row>
                      </template>
                    </v-data-table>
                  </v-col> -->
                </v-card>
              </td>

            </template>

          </v-data-table>
        </v-card>

      </v-col>
    </v-row>


  </div>

</template>

<script>
import DetailUnloadAllocationTransportField from "./unloadDetailField";
import DetailUnloadAllocationFarmersField from "./unloadDetailFarmerFields";
import DetailLablePrinted from "./DetailLable/totalLableField";
import DetailLableLoaded from "./DetailLable/totalLableLoaded";
import DetailLableDistributed from "./DetailLable/totalLableDistributed";
import DetailLableMissing from "./DetailLable/totalLableMissing";
import moment from "moment";

import axios from "axios";


export default {
  name: "unload-allocation-detail",
  props: {
    data: {
      required: true,
      default: [],
    },
  },
  /**
   * todo: editanku => cek apakah ada bibit yang melebihi batas bibit yang ter-load
   * * tambah computed untuk validasi error, function isExceedingItem, getRemainingSeeds
   */
  // === start ===
  computed: {
    hasValidationError() {
      if (!this.detail_seed_adjusted) return false

      return this.detail_seed_adjusted.some(item => {
        const total = parseInt(item.total_received || 0) +
          parseInt(item.total_damaged || 0) +
          parseInt(item.total_missing || 0)

        return total > parseInt(item.total_load || 0)
      })
    }
  },
  // === end ===

  data() {
    return {
      detail_seed_adjusted: null,
      printed_bag: [],
      loaded_bag: [],
      distributed_bag: [],
      missing_bag: [],
      lable_table_key: 0,
      is_pupuk_distributed: 0,
      user_accepted: '',
      distribution_date: '',
      modal_signature_photo: null,
      modal_receiver_photo: null,
      farmer_id: 0,
      nurseryToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLW51cnNlcnkudDR0LWFwaS5vcmdcL2FwaVwvbG9naW4iLCJpYXQiOjE3NjI3NTYyNzAsImV4cCI6MTc5Mzg2MDI3MCwibmJmIjoxNzYyNzU2MjcwLCJqdGkiOiJ4VHF4cUV6VlQwZEkxSkRwIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ZAlixQ8QWw1EjgPH3wBN6vWitt7TijMqoyCRmGCHzp0",
      configAllocationTransportDetail: {
        table: {
          header: DetailUnloadAllocationTransportField
        }
      },
      configAllocationFarmerDetail: {
        table: {
          header: DetailUnloadAllocationFarmersField
        }

      },
      detailSeedFarmer: {
        table: {
          header: [
            { text: 'No', value: 'index', align: 'center' },
            { text: 'Nama Bibit', value: 'tree_name', align: 'center' },
            { text: 'Tipe Pohon Bibit', value: 'tree_type_name', align: 'center' },
            { text: 'Total Bibit Ter-Load', value: 'total_load', align: 'center' },
            // { text: 'Total Bibit Diterima', value: 'total_received', align: 'center' },
            // { text: 'Total Bibit Rusak', value: 'total_damaged', align: 'center' },
            // { text: 'Total Bibit Hilang', value: 'total_missing', align: 'center' },
            // { text: 'Total Bibit Terdistribusi', value: 'total_seed', align: 'center' },
            // { text: 'Persentase Penerimaan Bibit', value: 'seed_received_percentage', align: 'center' },

          ]
        }
      },
      configLablePrintedDetail: {
        table: {
          header: DetailLablePrinted
        }
      },
      configLableLoadedDetail: {
        table: {
          header: DetailLableLoaded
        }
      },
      configLableDistributedDetail: {
        table: {
          header: DetailLableDistributed
        }
      },
      // configLableMissingDetail: {
      //   table: {
      //     header: DetailLableMissing
      //   }
      // },
    }
  },
  computed: {
    // Cek apakah ada bibit yang melebihi batas
    hasValidationError() {
      if (!this.detail_seed_adjusted) return false

      return this.detail_seed_adjusted.some(item => {
        const total = parseInt(item.total_received || 0) +
          parseInt(item.total_damaged || 0) +
          parseInt(item.total_missing || 0)
        return total > parseInt(item.total_load || 0)
      })
    }
  },
  methods: {
    // === start ===
    // cek apakah total inputan lebih dari bibit ter-load
    isExceedingLimit(item) {
      const total = parseInt(item.total_received || 0) +
        parseInt(item.total_damaged || 0) +
        parseInt(item.total_missing || 0)

      return total > parseInt(item.total_load || 0)
    },
    // hitung sisa bibit yang bisa di input
    getRemainingSeeds(item) {
      const total = parseInt(item.total_received || 0) +
        parseInt(item.total_damaged || 0) +
        parseInt(item.total_missing || 0)

      return parseInt(item.total_load || 0) - total
    },
    // === end ===
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    progressColorFormat(val) {
      if (val <= 30) return "red"
      else if (val > 30 && val <= 80) return "orange"
      else if (val > 80) return "green"
    },
    async updateVerifikasiReportNursery(item, type) {

      let User = JSON.parse(localStorage.getItem("User"))
      let nurseryToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLW51cnNlcnkudDR0LWFwaS5vcmdcL2FwaVwvbG9naW4iLCJpYXQiOjE3NjI3NTYyNzAsImV4cCI6MTc5Mzg2MDI3MCwibmJmIjoxNzYyNzU2MjcwLCJqdGkiOiJ4VHF4cUV6VlQwZEkxSkRwIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.ZAlixQ8QWw1EjgPH3wBN6vWitt7TijMqoyCRmGCHzp0"
      if (type == 'verification') {
        const prompt = await this.$_alert.confirm('Verifikasi Distribusi?', 'Apakah Anda Yakin Untuk Melakukan VERIFIKASI Data Distribusi?', 'Ya, Verifikasi', 'Batal', true)
        if (prompt.isConfirmed) {
          const params = {
            farmer_no: item.farmer_no,
            verified_by: User.email,
          };
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-verification-geko",
            params,
            {
              headers: {
                Authorization: `Bearer ` + nurseryToken,
              },
            }
          )
            .then(() => {
              this.$_alert.success('Data Distribusi Berhasil Diverifikasi')
            })
        }
      } else if (type == 'unverification') {
        const prompt = await this.$_alert.confirm('Unverifikasi Data Distribusi?', 'Apakah Anda Yakin Untuk Melakukan UNVERIFIKASI Data Distribusi?', 'Ya, Verifikasi', 'Batal', true)
        if (prompt.isConfirmed) {
          const params = {
            farmer_no: item.farmer_no,
            verified_by: null,
          };
          const sendData = await axios.post(
            "https://api-nursery.t4t-api.org/api/custom/received-verification-geko",
            params,
            {
              headers: {
                Authorization: `Bearer ` + nurseryToken,
              },
            }
          )
            .then(() => {
              this.$_alert.success('Data Distribusi Berhasil Diunverifikasi')
            })
        }
      }
      await this.getData();
    },
    getLableTableHeaders(itemKey) {
      if (itemKey == 0) return this.configLablePrintedDetail.table.header
      if (itemKey == 1) return this.configLableLoadedDetail.table.header
      if (itemKey == 2) return this.configLableDistributedDetail.table.header
      if (itemKey == 3) return this.configLableMissingDetail.table.header
    },
    getTableLableItem(itemKey, item) {
      if (itemKey == 0) return item.printed_lable
      if (itemKey == 1) return item.loaded_lable
      if (itemKey == 2) return this.distributed_bag
      if (itemKey == 3) return this.missing_bag
    },
    async getData() {
      const result = await this.$_api.get("distribution/loading-line/detail", {
        id: this.data.result.id,
      });
      this.data = result;
      console.log('get data')
    },
    expandTableReport(item) {
      this.detail_seed_adjusted = item.item.detail_seed_farmers
      this.printed_bag = item.item.printed_lable
      this.distributed_bag = item.item.distributed_lable
      this.loaded_bag = item.item.loaded_lable
      this.missing_bag = item.item.missing_lable
      this.is_pupuk_distributed = item.item.is_pupuk_distributed
      this.farmer_id = item.item.id
      this.user_accepted = item.item.user_accepted

      // ✅ TAMBAHKAN INI: Set distribution_time dengan tanggal yang sudah ada
      // Ini akan membuat v-date-picker menampilkan tanggal existing
      // this.distribution_time = item.item.distribution_date || ''
    },
    setLableDistributed(item) {
      item.is_distributed = 2
      this.distributed_bag.push(item)
      console.log(this.distributed_bag)
    },
    async saveDataReportAdjustment(item) {
      /**
       * update untuk menampilkan alert confirm di simpan data adjust
       */
      // === start ===
      // Validasi sebelum lanjut
      if (this.hasValidationError) {
        this.$_alert.error('Total bibit (diterima + rusak + hilang) tidak boleh melebihi total bibit ter-load!')
        return
      }
      const prompt = await this.$_alert.confirm('Simpan Data Adjust Distribusi?', 'Apakah Anda Yakin Untuk Melakukan SIMPAN Data Adjust Distribusi?', 'Ya, Simpan', 'Batal', true)
      if (prompt.isConfirmed) {
        let bags = []
        this.distributed_bag.map(v => {
          bags.push(v.id)
        })
        const params = {
          loading_line_id: this.data.result.id, // untuk fetch existing data
          farmer_no: item.farmer_no,
          detail: this.detail_seed_adjusted,
          bag: bags,
          is_pupuk_distributed: this.is_pupuk_distributed ? 1 : 0,
          id: this.farmer_id,
          // todo editanku 
          distribution_time: this.distribution_time ? this.dateFormat(this.distribution_time, 'YYYY-MM-DD') : this.existing_delivery_date,
          user_accepted: this.user_accepted,
          // file_accept: {},
          // file_signature: {},

          // kirim file jika ada upload terbaru, kosongkan jika tidak
          file_accept: this.modal_receiver_photo ? await this.uploadPhotosNursery(this.modal_receiver_photo) : this.existing_file_accept,
          file_signature: this.modal_signature_photo ? await this.uploadPhotosNursery(this.modal_signature_photo) : this.existing_file_signature,
        };
        // upload foto jika ada
        if (this.modal_receiver_photo) {
          params.file_accept = await this.uploadPhotosNursery(
            this.modal_receiver_photo
          );
        }
        if (this.modal_signature_photo) {
          params.file_signature = await this.uploadPhotosNursery(
            this.modal_signature_photo
          );
        }

        // kirim ke backend
        const sendData = await axios.post(
          "https://api-nursery.t4t-api.org/api/custom/received-mobile-distribution",
          params,
          {
            headers: {
              Authorization: `Bearer ` + this.nurseryToken,
            },
          }
          // 'distribution/loading-line/adjustments/save', params
        ).then(() => {
          this.$_alert.success('Berhasil Melakukan Adjustment Data Distribusi')
        }).catch((err) => {
          console.log(err)
          this.$_alert.error('Gagal Melakukan Adjustment Data Distribusi')
        })
        await this.getData();
        console.log(params)
      }
      // === end ===
    },
    async uploadPhotosNursery(itemFile) {
      this.$store.state.loadingOverlayText = `Saving photo...`;
      const url = `https://api-nursery.t4t-api.org/api/upload`;
      const data = this.generateFormData({
        file: itemFile,
      });
      let responseName = null;
      console.log(data);
      await axios
        .post(url, data, {
          headers: {
            Authorization: `Bearer ` + this.nurseryToken,
          },
        })
        .then((res) => {
          responseName = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
      return responseName;
    },
    generateFormData(data) {
      let formData = new FormData();

      const objectArray = Object.entries(data);

      objectArray.forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.map((item) => {
            formData.append(key + "[]", item);
          });
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
  }
}
</script>