<!-- This Is Base Model For Planting Hole Survielliance Details -->
<template>
    <div>
      <v-row>
        <v-col>
            <v-card data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" class="geko-base-detail-card mb-5" v-if="data.result">
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
                        variant="warning" small class="mt-2"
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
                      <!-- <v-btn
                        v-if="true"
                        variant="warning" small class="mt-2"
                      >
                        <v-icon class="mr-1">mdi-clock-alert </v-icon> Proses Distribusi Belum Selesai!
                      </v-btn> -->
                    </template>
                    <template v-slot:item.total_pupuk="{ item }">
                      <p v-if="item.is_pupuk_load == 0" >0</p>
                      <p v-else>{{item.total_pupuk}}</p>
                    </template>
                    <template v-slot:item.status_pupuk="{ item }">
                      <div class="d-flex flex-row align-items-center">
                        <span class="badge"
                          :class="{
                            'bg-light': item.is_pupuk_distributed == 0,
                            'bg-success': item.is_pupuk_distributed == 1,
                            'bg-warning': item.is_pupuk_distributed == 2,
                            'bg-danger': item.is_pupuk_distributed == 3,
                          }"
                        >
                          <span v-if="item.is_pupuk_distributed == 0">Belum Diterima</span>
                          <span v-if="item.is_pupuk_distributed == 1">Pupuk Lengkap</span>
                          <span v-if="item.is_pupuk_distributed == 2">Pupuk Kurang</span>
                          <span v-if="item.is_pupuk_distributed == 3">Pupuk Kelebihan</span>
                        </span>
                      </div>
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
                                           Total Pupuk Terdistribusi
                                         </th>
                                         <td class="text-left" style="font-size: 14px">
                                           <strong v-if="item.is_pupuk_load == 0">0</strong>
                                           <strong v-else>{{ item.total_pupuk }}</strong>
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
                              :items="item.detail_seed_farmers"
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
                              :headers="configLablePrintedDetail.table.header"
                              :items="getTableLableItem(lable_table_key, item)"
                              dense
                            >
                              <!-- No Column -->
                              <template v-slot:item.index="{ index }">
                                {{ index + 1 }}
                              </template>
                              <template v-slot:top>
                                <div class="statistics mb-3">
                                    <div class="statistic-item info">
                                      <v-icon>mdi-list-status</v-icon>
                                      <div class="statistic-data">
                                          <p class="mb-0 label">Total Label Tercetak</p>
                                          <p class="mb-0 value">{{ item.printed_lable.length ?? 0 }}</p>

                                      </div>
                                    </div>
                                    <div class="statistic-item warning">
                                      <v-icon>mdi-truck-cargo-container</v-icon>
                                      <div class="statistic-data">
                                          <p class="mb-0 label">Total Label Ter-Load</p>
                                          <p class="mb-0 value">{{ item.loaded_lable.length ?? 0 }}</p>

                                      </div>
                                    </div>
                                    <div class="statistic-item success">
                                      <v-icon>mdi-check-bold</v-icon>
                                      <div class="statistic-data">
                                          <p class="mb-0 label">Total Label Diterima</p>
                                          <p class="mb-0 value">{{ item.distributed_lable.length ?? 0 }}</p>

                                      </div>
                                    </div>
                                    <div class="statistic-item danger">
                                      <v-icon>mdi-magnify-close</v-icon>
                                      <div class="statistic-data">
                                          <p class="mb-0 label">Total Label Hilang</p>
                                          <p class="mb-0 value">{{ item.missing_lable.length ?? 0 }}</p>

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
                          <!-- <tr>
                             <td>
    
                             </td>
                            <td>
                              <v-card color="#26c6da" max-width="575" class="geko-base-detail-card mb-5 px-1">
                                <v-data-table :headers="configLablePrintedDetail.table.header" :items-per-page="3" :items="item.printed_lable"
                                        :search="''" class="rounded-xl elevation- pa-1 px-5">
    
                                        <template v-slot:item.index="{ index }">
                                        {{ index + 1 }}
                                        </template>
    
                                        <template v-slot:top>
                                        <div class="list-header py-3 mt-1">
                                            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                            <h4>Label Tercetak</h4>
                                            </div>
                                            <div class="d-flex flex-row geko-list-header-action">
                                            <div class="geko-list-header-toolbar"></div>
                                            </div>
                                        </div>
    
                                        <div class="statistics mb-3">
                                            <div class="statistic-item light">
                                              <v-icon>mdi-list-status</v-icon>
                                              <div class="statistic-data">
                                                  <p class="mb-0 label">Total Label</p>
                                                  <p class="mb-0 value">{{ item.printed_lable.length ?? '' }}</p>
    
                                              </div>
                                            </div>
                                        </div>
                                        </template>
    
                                    </v-data-table>
                              </v-card>
                            </td>
                            <td>
                              <v-card color="#f0a42b" max-width="575" class="geko-base-detail-card mb-5 px-1">
                                <v-data-table :headers="configLableLoadedDetail.table.header" :items-per-page="3" :items="item.loaded_lable"
                                        :search="''" class="rounded-xl elevation- pa-1 px-5">
    
                                        <template v-slot:item.index="{ index }">
                                        {{ index + 1 }}
                                        </template>
    
                                        <template v-slot:top>
                                        <div class="list-header py-3 mt-1">
                                            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                            <h4>Label Loaded</h4>
                                            </div>
                                            <div class="d-flex flex-row geko-list-header-action">
                                            <div class="geko-list-header-toolbar"></div>
                                            </div>
                                        </div>
    
                                        <div class="statistics mb-3">
                                            <div class="statistic-item light">
                                            <v-icon>mdi-list-status</v-icon>
                                            <div class="statistic-data">
                                                <p class="mb-0 label">Total Label Loaded</p>
                                                <p class="mb-0 value">{{ item.loaded_lable.length ?? '' }}</p>
    
                                            </div>
                                            </div>
                                        </div>
                                        </template>
    
                                    </v-data-table>
                              </v-card>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              
                            </td>
                            <td>
                              <v-card color="#1cd104" max-width="575" class="geko-base-detail-card mb-5 px-1">
                                <v-data-table :headers="configLableDistributedDetail.table.header" :items-per-page="3" :items="item.distributed_lable"
                                        :search="''" class="rounded-xl elevation- pa-1 px-5">
    
                                        <template v-slot:item.index="{ index }">
                                        {{ index + 1 }}
                                        </template>
    
                                        <template v-slot:top>
                                        <div class="list-header py-3 mt-1">
                                            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                            <h4>Label Terdistribusi</h4>
                                            </div>
                                            <div class="d-flex flex-row geko-list-header-action">
                                            <div class="geko-list-header-toolbar"></div>
                                            </div>
                                        </div>
    
                                        <div class="statistics mb-3">
                                            <div class="statistic-item light">
                                            <v-icon>mdi-list-status</v-icon>
                                            <div class="statistic-data">
                                                <p class="mb-0 label">Total Label Terdistribusi</p>
                                                <p class="mb-0 value">{{ item.distributed_lable.length ?? '' }}</p>
    
                                            </div>
                                            </div>
                                        </div>
                                        </template>
    
                                    </v-data-table>
                              </v-card>
                            </td>
                            <td>
                              <v-card color="#e81313" max-width="575" class="geko-base-detail-card mb-5 px-1">
                                <v-data-table :headers="configLableMissingDetail.table.header" :items-per-page="3" :items="item.missing_lable"
                                        :search="''" class="rounded-xl elevation- pa-1 px-5">
    
                                        <template v-slot:item.index="{ index }">
                                        {{ index + 1 }}
                                        </template>
    
                                        <template v-slot:top>
                                        <div class="list-header py-3 mt-1">
                                            <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
                                            <h4>Label Hilang</h4>
                                            </div>
                                            <div class="d-flex flex-row geko-list-header-action">
                                            <div class="geko-list-header-toolbar"></div>
                                            </div>
                                        </div>
    
                                        <div class="statistics mb-3">
                                            <div class="statistic-item light">
                                            <v-icon>mdi-list-status</v-icon>
                                            <div class="statistic-data">
                                                <p class="mb-0 label">Total Label Hilang</p>
                                                <p class="mb-0 value">{{ item.missing_lable.length ?? '' }}</p>
    
                                            </div>
                                            </div>
                                        </div>
                                        </template>
    
                                    </v-data-table>
                              </v-card>
                            </td>
                          </tr>
                          <tr>
                            <td>
    
                            </td>
                            <td>
                              <v-card class="geko-base-detail-card mb-5 px-4">
    
                                  <div class="list-header py-3 mt-1">
                                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
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
    
                              </v-card>
                            </td>
                            <td>
                              <v-card class="geko-base-detail-card mb-5 px-4">
    
                                  <div class="list-header py-3 mt-1">
                                    <div class="pr-5 mr-5 d-flex flex-row" style="justify-content: space-between">
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
    
                              </v-card>
                            </td>
                          </tr> -->
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
        lable_table_key: 0,
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
              {text: 'Nomor Lahan', value: 'lahan_no', align:'center'},
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
          const prompt = await this.$_alert.confirm('Verifikasi Distribusi Petani?', 'Apakah Anda Yakin Untuk Melakukan VERIFIKASI Data Distribusi Petani?', 'Ya, Verifikasi', 'Batal', true)
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
                        this.$_alert.success('Data Distribusi Petani Berhasil Diverifikasi')
                    })
            }
        }else if(type == 'unverification'){
          const prompt = await this.$_alert.confirm('Unverifikasi Distribusi Petani?', 'Apakah Anda Yakin Untuk Melakukan UNVERIFIKASI Data Distribusi Petani?', 'Ya, Verifikasi', 'Batal', true)
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
                        this.$_alert.success('Data Distribusi Petani Berhasil Diunverifikasi')
                    })
            }
        }
        await this.getData();
      },
      getTableLableItem(itemKey, item){
        if(itemKey == 0) return item.printed_lable
        if(itemKey == 1) return item.loaded_lable
        if(itemKey == 2) return item.distributed_lable
        if(itemKey == 3) return item.missing_lable
      },
      async getData() {
        const result = await this.$_api.get("distribution/loading-line/detail", {
          id: this.data.result.id,
        });
        // console.log(result)
        this.data = result;
      },
    }
  }
  </script>