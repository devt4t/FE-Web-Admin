<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
  <div>
    <v-row>
      <v-col>
          <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
              <v-data-table :headers="configAllocationTransportDetail.table.header" :items="data.result.detail_allocation_transportation"
                  :search="''" class="rounded-xl elevation- pa-1 px-5">

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
                      @click="showLightbox(data.result.img_photo_created_by.url ?? '/images/noimage.png')"
                      v-bind:style="{
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
              <v-data-table 
                :headers="configAllocationFarmerDetail.table.header" 
                :items="data.result.detail_farmers"
                :search="''" 
                class="rounded-xl elevation- pa-1 px-5"
                :single-expand="true"
                :item-key="data.result.detail_farmers.id"
                @item-expanded="expandTableReport"
                show-expand
                >

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
                      v-if="(item.verified_by == null ||item.verified_by == '') &&item.printed_lable.length > 0 && item.loaded_lable.length > 0 && item.distributed_lable.length > 0"
                      @click="updateVerifikasiReportNursery(item, 'verification')"
                      variant="success" small class="mt-2"
                    >
                      <v-icon class="mr-1">mdi-check-bold </v-icon> Verifikasi
                    </v-btn>
                    <v-btn
                      v-else-if="(!item.verified_by == null ||!item.verified_by == '')"
                      @click="updateVerifikasiReportNursery(item, 'unverification')"
                      variant="danger" small class="mt-2"
                    >
                      <v-icon class="mr-1">mdi-check-bold </v-icon> Unverifikasi
                    </v-btn>
                    <v-btn
                      v-else
                      variant="warning" small class="mt-2"
                    >
                      <v-icon class="mr-1">mdi-clock-alert </v-icon> Proses Distribusi Belum Selesai!
                    </v-btn>
                    <v-btn
                      @click="saveDataReportAdjustment(item)"
                      variant="warning" small class="mt-2"
                    >
                      <v-icon class="mr-1">mdi-check-bold </v-icon> Adjust Data Distribusi
                    </v-btn>
                  </template>
                  <template v-slot:item.total_pupuk="{ item }">
                    <p v-if="item.is_pupuk_load == 0" >0</p>
                    <p v-else>{{item.total_pupuk}}</p>
                  </template>
                  <template v-slot:item.acceptance_progress="{ item }">
                    <v-progress-circular
                      :rotate="90"
                      :size="50"
                      :width="8"
                      :value="item.farmer_acceptance_percentage"
                      :color="progressColorFormat(item.farmer_acceptance_percentage)"
                    >
                      {{ item.farmer_acceptance_percentage.toFixed(0) }}%
                    </v-progress-circular>
                  </template>
                  <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                      <v-card class="geko-base-detail-card mb-5 px-8">
                        <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                              <h4>Detail Penerimaan Petani {{ item.farmer_name }}</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                              <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>
                        <h3>  </h3>
                        <!-- detail penerimaan -->
                        <!-- Total Bibit Terdistribusi: {{ item.farmer_seed_loaded }} -->
                         <v-row>
                           <v-col>
                             <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                               <v-simple-table>
                                 <template v-slot:default>
                                   <tbody>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                       Total Bibit Terdistribusi
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                         <strong>{{
                                           item.farmer_seed_loaded
                                         }}</strong>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Total Bibit Diterima
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                         <strong>{{ item.farmer_seed_received }}</strong>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Total Bibit Rusak
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                         <strong>{{ item.farmer_seed_broken }}</strong>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Total Bibit Hilang
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                         <strong>{{ item.farmer_seed_missing }}</strong>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Status Distribusi Pupuk
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                        <v-checkbox
                                          v-model="is_pupuk_distributed"
                                          :label="`${is_pupuk_distributed == 0 ? 'Tidak Menerima' : 'Menerima'}`"
                                          color="info"
                                        ></v-checkbox>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Total Pupuk Terdistribusi
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                         <strong v-if="item.is_pupuk_load == 0">0</strong>
                                         <strong v-else>{{ item.total_pupuk }}</strong>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Tanggal Penerimaan
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                        <v-date-picker
                                          color="green lighten-1 rounded-xl"
                                          v-model="distribution_time"
                                        ></v-date-picker>
                                       </td>
                                     </tr>
                                     <tr>
                                       <th
                                         class="text-left"
                                         style="width: 300px; font-size: 14px"
                                       >
                                         Nama Penerima
                                       </th>
                                       <td class="text-left" style="font-size: 14px">
                                        <geko-input v-model="user_accepted" :item="{
                                          label: 'Nama Penerima',
                                          validation: ['required'],
                                          col_size: 6,
                                          type: 'text',
                                        }" />
                                       </td>
                                     </tr>
                                   </tbody>
                                 </template>
                               </v-simple-table>
                             </v-card>
                            </v-col>
                            <v-col>
                              <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5">
                                <div class="list-header py-3 mt-1">
                                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between; margin-left: 5%;">
                                      <h4>Foto Penerimaan Petani</h4>
                                  </div>
                                  <div class="d-flex flex-row geko-list-header-action">
                                      <div class="geko-list-header-toolbar"></div>
                                  </div>
                                </div>
  
                                <div class="absent-photo-list d-flex flex-row" v-if="item.file_accept != null">
                                    <div class="absent-photo-item"
                                        @click="showLightbox(item.file_accept.url ?? '/images/noimage.png')"
                                        v-bind:style="{
                                        backgroundImage:
                                            'url(' +
                                            item.file_accept.url ?? '/images/noimage.png' +
                                            ')',
                                        }">
                                        <h6>Foto Dokumentasi Distribusi</h6>
                                    </div>
                                </div>
                                <div class="absent-photo-list d-flex flex-row">
                                  <v-file-input
                                    accept="image/png, image/jpeg, image/bmp"
                                    @change="
                                      (val) => {
                                        modal_receiver_photo =
                                          val;
                                      }
                                    "
                                    placeholder="Upload Foto Penerimaan"
                                    prepend-icon="mdi-camera"
                                    show-size
                                    label="Upload Foto Penerimaan"
                                  ></v-file-input>
                                </div>
                                <div class="list-header py-3 mt-1">
                                  <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between; margin-left: 5%;">
                                      <h4>Tanda Tangan Petani</h4>
                                  </div>
                                  <div class="d-flex flex-row geko-list-header-action">
                                      <div class="geko-list-header-toolbar"></div>
                                  </div>
                                </div>
  
                                <div class="absent-photo-list d-flex flex-row" v-if="item.file_signature != null">
                                    <div class="absent-photo-item"
                                        @click="showLightbox(item.file_signature.url ?? '/images/noimage.png')"
                                        v-bind:style="{
                                        backgroundImage:
                                            'url(' +
                                            item.file_signature.url ?? '/images/noimage.png' +
                                            ')',
                                        }">
                                        <h6>Tanda Tangan Petani</h6>
                                    </div>
                                </div>
                                <div class="absent-photo-list d-flex flex-row">
                                  <v-file-input
                                    accept="image/png, image/jpeg, image/bmp"
                                    @change="
                                      (val) => {
                                        modal_signature_photo =
                                          val;
                                      }
                                    "
                                    placeholder="Upload Foto Tanda Tangan Penerima"
                                    prepend-icon="mdi-camera"
                                    show-size
                                    label="Upload Foto Tanda Tangan Penerima"
                                  ></v-file-input>
                                </div>
                              </v-card>
                            </v-col>
                         </v-row>

                        <!-- detail seed farmer -->
                        <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                              <h4>Detail Bibit Petani {{ item.farmer_name }}</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                              <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>
                        <h3>  </h3>
                        <!-- detail penerimaan -->
                        <!-- Total Bibit Terdistribusi: {{ item.farmer_seed_loaded }} -->
                        <v-col cols="12">
                          <v-data-table
                            hide-default-footer
                            :items-per-page="-1"
                            :headers="detailSeedFarmer.table.header"
                            :items="detail_seed_adjusted"
                            dense
                          >
                            <!-- No Column -->
                            <template v-slot:item.index="{ index }">
                              {{ index + 1 }}
                            </template>
                            <template v-slot:item.total_seed="{ item }">
                              <p>
                                {{ parseInt(item.total_received) + parseInt(item.total_damaged) + parseInt(item.total_missing) }} Bibit
                              </p>
                            </template>
                            <template v-slot:item.seed_received_percentage="{ item }">
                              <v-progress-circular
                                :rotate="90"
                                :size="50"
                                :width="8"
                                :value="item.seed_received_percentage"
                                :color="progressColorFormat(item.seed_received_percentage)"
                              >
                                {{ item.seed_received_percentage.toFixed(0) }}%
                              </v-progress-circular>
                            </template>
                            <template v-slot:item.total_received="{ item }">
                              <!-- test Update {{ item.total_received }} -->
                              <geko-input v-model="item.total_received" :item="{
                                label: 'Adjust Penerimaan',
                                validation: ['required'],
                                col_size: 6,
                                type: 'number',
                              }" >
                              </geko-input>
                            </template>
                            <template v-slot:item.total_damaged="{ item }">
                              <!-- test Update {{ item.total_damaged }} -->
                              <geko-input v-model="item.total_damaged" :item="{
                                label: 'Adjust Bibit Rusak',
                                validation: ['required'],
                                col_size: 6,
                                type: 'number',
                              }" >
                              </geko-input>
                            </template>
                            <template v-slot:item.total_missing="{ item }">
                              <!-- test Update {{ item.total_missing }} -->
                              <geko-input v-model="item.total_missing" :item="{
                                label: 'Adjust Bibit Hilang',
                                validation: ['required'],
                                col_size: 6,
                                type: 'number',
                              }" >
                              </geko-input>
                            </template>
                          </v-data-table>
                        </v-col>
  
                        <div class="list-header py-3 mt-1">
                          <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                              <h4>Detail Label Petani {{ item.farmer_name }}</h4>
                          </div>
                          <div class="d-flex flex-row geko-list-header-action">
                              <div class="geko-list-header-toolbar"></div>
                          </div>
                        </div>
                        <h3>  </h3>
                        <!-- detail lable -->
                        <v-col cols="12">
                          <v-data-table
                            :items-per-page="10"
                            :footer-props="{
                              itemsPerPageOptions: [10, 25, 40, -1],
                            }"
                            :headers="getLableTableHeaders(lable_table_key)"
                            :items="getTableLableItem(lable_table_key, item)"
                            dense
                          >
                            <!-- No Column -->
                            <template v-slot:item.index="{ index }">
                              {{ index + 1 }}
                            </template>
                            <template v-if="lable_table_key == 1" v-slot:item.action="{ item }">
                              <!-- <v-btn
                                v-if="item.is_loaded == 0 && item.is_distributed == 0"
                                @click="setLableLoaded(item)"
                                variant="info" small class="mt-2"
                              >
                                <v-icon class="mr-1">mdi-truck-check</v-icon>
                              </v-btn> -->
                              <v-btn
                                v-if="item.is_loaded == 1 && (item.is_distributed == 0 || item.is_distributed == null)"
                                @click="setLableDistributed(item)"
                                variant="success" small class="mt-2"
                              >
                                <v-icon class="mr-1">mdi-check-bold </v-icon> Terima Label Bibit
                              </v-btn>
                              <v-btn
                                v-if="item.is_loaded == 1 && item.is_distributed == 1"
                                variant="info" small class="mt-2"
                              >
                                <v-icon class="mr-1">mdi-information </v-icon> Telah Terdistribusi
                              </v-btn>
                              <v-btn
                                v-if="item.is_loaded == 1 && item.is_distributed == 2"
                                variant="warning" small class="mt-2"
                              >
                                <v-icon class="mr-1">mdi-information </v-icon> Label Siap Di-Adjust
                              </v-btn>
                              <!-- <v-btn
                                v-if="item.is_loaded == 1 && item.is_distributed == 0"
                                @click="setLableMissing(item)"
                                variant="danger" small class="mt-2"
                              > 
                                <v-icon class="mr-1">mdi-eye-off-outline</v-icon>
                              </v-btn>-->
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
                              <!-- Table Data Switch -->
                                <v-select
                                  v-model="lable_table_key"
                                  :items="[
                                    {text: 'Label Tercetak', value: 0},
                                    {text: 'Label Ter-Load', value: 1},
                                    {text: 'Label Diterima', value: 2},
                                    {text: 'Label Hilang', value: 3},
                                  ]"
                                  outlined
                                  dense
                                  hide-details
                                  :menu-props="{
                                    bottom: true,
                                    offsetY: true,
                                    rounded: 'xl',
                                    transition: 'slide-y-transition',
                                  }"
                                  label="Data Tabel 'Label'"
                                  class="mx-auto mx-lg-2 mr-lg-1 mb-2 mb-lg-0"
                                  style="max-width: 200px"
                                ></v-select>
                                </v-row>
                            </template>
                          </v-data-table>
                        </v-col>
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
      distribution_time: '',
      modal_signature_photo: null,
      modal_receiver_photo: null,
      farmer_id: 0,
      nurseryToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLW51cnNlcnkudDR0LWFwaS5vcmdcL2FwaVwvbG9naW4iLCJpYXQiOjE3MzE1NTM1NDMsImV4cCI6MTc2MjY1NzU0MywibmJmIjoxNzMxNTUzNTQzLCJqdGkiOiJhdm50YjVwNVhUNUVKMmMyIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.QX3XMyMTzQYoXMzqlecIK5ImC9siz26Ri8nMaYkiYgg",
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
            {text: 'No', value: 'index', align:'center'},
            {text: 'Nama Bibit', value: 'tree_name', align:'center'},
            {text: 'Tipe Pohon Bibit', value: 'tree_type_name', align:'center'},
            {text: 'Total Bibit Ter-Load', value: 'total_load', align:'center'},
            {text: 'Total Bibit Diterima', value: 'total_received', align:'center'},
            {text: 'Total Bibit Rusak', value: 'total_damaged', align:'center'},
            {text: 'Total Bibit Hilang', value: 'total_missing', align:'center'},
            {text: 'Total Bibit Terdistribusi', value: 'total_seed', align:'center'},
            {text: 'Persentase Penerimaan Bibit', value: 'seed_received_percentage', align:'center'},

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
      configLableMissingDetail: {
        table: {
          header: DetailLableMissing
        }
      },
    }
  },
  methods: {
    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    progressColorFormat(val){
      if(val <= 30) return "red"
      else if (val > 30 && val <= 80) return "orange"
      else if (val > 80) return "green"
    },
    async updateVerifikasiReportNursery(item, type){
      
      let User = JSON.parse(localStorage.getItem("User"))
      let nurseryToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLW51cnNlcnkudDR0LWFwaS5vcmdcL2FwaVwvbG9naW4iLCJpYXQiOjE3MzE1NTM1NDMsImV4cCI6MTc2MjY1NzU0MywibmJmIjoxNzMxNTUzNTQzLCJqdGkiOiJhdm50YjVwNVhUNUVKMmMyIiwic3ViIjoxLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.QX3XMyMTzQYoXMzqlecIK5ImC9siz26Ri8nMaYkiYgg"
      if(type == 'verification'){
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
      }else if(type == 'unverification'){
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
    getLableTableHeaders(itemKey){
      if(itemKey == 0) return this.configLablePrintedDetail.table.header
      if(itemKey == 1) return this.configLableLoadedDetail.table.header
      if(itemKey == 2) return this.configLableDistributedDetail.table.header
      if(itemKey == 3) return this.configLableMissingDetail.table.header
    },
    getTableLableItem(itemKey, item){
      if(itemKey == 0) return item.printed_lable
      if(itemKey == 1) return item.loaded_lable
      if(itemKey == 2) return this.distributed_bag
      if(itemKey == 3) return this.missing_bag
    },
    async getData() {
      const result = await this.$_api.get("distribution/loading-line/detail", {
        id: this.data.result.id,
      });
      this.data = result;
      console.log('get data')
    },
    expandTableReport(item){
      this.detail_seed_adjusted = item.item.detail_seed_farmers
      this.printed_bag = item.item.printed_lable
      this.distributed_bag = item.item.distributed_lable
      this.loaded_bag = item.item.loaded_lable
      this.missing_bag = item.item.missing_lable
      this.is_pupuk_distributed = item.item.is_pupuk_distributed
      this.farmer_id = item.item.id
      this.user_accepted = item.item.user_accepted
    },
    setLableDistributed(item){
      item.is_distributed = 2
      this.distributed_bag.push(item)
      console.log(this.distributed_bag)
    },
    async saveDataReportAdjustment(item) {
      let bags = [] 
      this.distributed_bag.map(v => {
        bags.push(v.id)
      })
      const params = {
        farmer_no: item.farmer_no,
        detail: this.detail_seed_adjusted,
        bag: bags,
        is_pupuk_distributed: this.is_pupuk_distributed,
        id: this.farmer_id,
        distribution_time: this.dateFormat(this.distribution_time, "YYYY-MM-DD"),
        user_accepted: this.user_accepted,
        file_accept: {},
        file_signature: {},
      };
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
      console.log(params)
      const sendData = await axios.post(
        "https://api-nursery.t4t-api.org/api/custom/received-mobile-distribution",
        params,
        {
          headers: {
            Authorization: `Bearer ` + this.nurseryToken,
          },
        }
      ).then(() => {
            this.$_alert.success('Berhasil Melakukan Adjustment Data Distribusi')
        })
      await this.getData();
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