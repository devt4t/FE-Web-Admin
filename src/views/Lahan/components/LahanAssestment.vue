<template>
    <div class="lahan-gis-verification" v-if="ready">
      <div class="d-flex flex-row mb-3" style="justify-content: space-between">
        <h5>Lahan Assestment</h5>
        <button @click="$emit('close', true)"><v-icon>mdi-close</v-icon></button>
      </div>
  
      <ValidationObserver ref="lahanAssestment" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
          <v-row v-if="role == 'fc-assestment'">
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_boundary"
                :item="{
                  label: 'Lahan memiliki batas yang jelas',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_boundary_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="isCarbonProject">
              <geko-input
                v-model="assestment.boundary_desc"
                :item="{
                  label: 'Deskripsi batas',
                  type: 'textarea',
                  validation: ['required'],
                }"
              />
            </v-col>
            <v-col md="12" v-if="assestment.is_boundary == '1'">
              <geko-input
                v-model="assestment.boundary_photo"
                :item="{
                  label: 'Foto Batas Lahan',
                  validation:
                    assestment.is_boundary == '1'
                      ? ['required']
                      : [],
                  type: 'upload',
                  api: 'lahans/upload.php',
                  directory: 'foto-lahan',
                  upload_type: 'image/*',
                  setter: 'boundary_photo',
                  view_data: 'boundary_photo',
                  option: {
                    label_hint:
                      'Klik gambar untuk memilih berkas yang akan diunggah',
                    max_size: 5,
                  },
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_dispute"
                :item="{
                  label: 'Apakah ada sengketa berkaitan kepemilikan lahan atau penggunaan lahan?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_dispute_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_dispute == '1'">
              <geko-input
                v-model="assestment.dispute_desc"
                :item="{
                  label: 'Deskripsi sengketa',
                  type: 'textarea',
                  validation: assestment.is_dispute == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_expanded"
                :item="{
                  label: 'Apakah ada tanda akan melakukan kegiatan perluasan lahan?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_expanded_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_expanded == '1'">
              <geko-input
                v-model="assestment.expanded_desc"
                :item="{
                  label: 'Deskripsi perluasan lahan',
                  type: 'textarea',
                  validation: assestment.is_expanded == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
              <geko-input
                v-model="assestment.farming_system"
                :item="{
                  label: 'Sistem pertanian dominan',
                  type: 'select',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.farming_system,
  
                    default_label: assestment.farming_system_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.farming_system == 'Lainnya'">
              <geko-input
                v-model="assestment.farming_desc"
                :item="{
                  label: 'Deskripsi sistem pertanian',
                  type: 'textarea',
                  validation: assestment.farming_system == 'Lainnya'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
              <v-row class="tutupan-wrapper pb-5">
                <v-col lg="12">
                  <h4 class="mb-2 text-success">Land Owner</h4>
                  <h5 class="font-weight-normal">
                    Pemilik Lahan :
                    <span class="text-success font-weight-bold"
                      >{{ formData.farmers_name || '-' }}</span
                    >
                  </h5>
                </v-col>
                <v-col lg="12">
                  <geko-input
                    v-model="assestment.land_occupant"
                    :item="{
                      label: 'Pengelola Lahan',
                      type: 'text',
                      validation: [],
                    }"
                  />
                </v-col>
                <v-col lg="12">
                <geko-input
                  v-model="assestment.type_ownership"
                  :item="{
                    label: 'Bukti kepemilikan lahan',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.type_owner,
                      default_label: assestment.type_ownership_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
                <v-col lg="12">
                  <geko-input
                    v-model="assestment.prefered_contact"
                    :item="{
                      label: 'Cara kontak yg disarankan',
                      type: 'select',
                      validation: ['required'],
                      option: {
                        default_options: defaultData.contact,
      
                        default_label: assestment.prefered_contact_label,
                        list_pointer: {
                          label: 'name',
                          code: 'code',
                          display: ['name'],
                        },
                      },
                    }"
                  />
                </v-col>
                <v-col lg="12">
                  <geko-input
                    v-model="assestment.email"
                    :item="{
                      label: 'Email',
                      type: 'text',
                      validation: assestment.prefered_contact == 'Email' 
                        ? ['email', 'required']
                        : [],
                    }"
                  />
                </v-col>
                <v-col lg="12" class="pb-5">
                  <geko-input
                    v-model="assestment.phone"
                    :item="{
                      label: 'Telepon',
                      type: 'text',
                      validation: assestment.prefered_contact == 'Telepon' 
                        ? ['decimal', 'required']
                        : ['decimal'],
                    }"
                  />
                </v-col>
                <v-col lg="12" class="pb-5">
                  <geko-input
                    v-model="assestment.whatsapp"
                    :item="{
                      label: 'Whatsapp',
                      type: 'text',
                      validation: assestment.prefered_contact == 'Whatsapp' 
                        ? ['decimal', 'required']
                        : ['decimal'],
                    }"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_interest"
                :item="{
                  label: 'Apakah pemilik lahan tertarik menjadi bagian dari project?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_interest_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_interest == '1'">
              <geko-input
                v-model="assestment.interest_proof"
                :item="{
                  label: 'Pernyataan Ketertarikan',
                  type: 'textarea',
                  validation: assestment.is_interest == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
              <geko-input
                v-model="assestment.land_used"
                :item="{
                  label: 'Penggunaan lahan sebelumnya',
                }"
              />
              <h5 class="font-weight-normal">
                {{formData.lahan_type}}, {{formData.description}} ({{formData.current_crops}})
              </h5>
            </v-col>
            <v-col lg="12">
              <geko-input
                v-model="assestment.land_used"
                :item="{
                  label: 'Bukti penggunaan lahan',
                  type: 'select',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.land_used_proof,
                    default_label: assestment.land_used_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12">
              <geko-input
                v-model="assestment.land_use"
                :item="{
                  label: 'Penggunaan lahan saat ini',
                  type: 'select',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.farming_system,
  
                    default_label: assestment.land_use_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.land_use == 'Lainnya'">
              <geko-input
                v-model="assestment.land_use_other"
                :item="{
                  label: 'Deskripsi lainnya',
                  type: 'textarea',
                  validation: assestment.land_use == 'Lainnya'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_illegal"
                :item="{
                  label: 'Adakah kegiatan ilegal di lahan?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_illegal_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_illegal == '1'">
              <geko-input
                v-model="assestment.illegal_desc"
                :item="{
                  label: 'Deskripsi kegiatan ilegal',
                  type: 'textarea',
                  validation: assestment.is_illegal == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_expected"
                :item="{
                  label: 'Apakah lahan yg akan ditanami mengalami degradasi dan tidak ada tanaman?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_expected_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_expected == '1'">
              <geko-input
                v-model="assestment.expected_desc"
                :item="{
                  label: 'Deskripsi informasi lebih lengkap dari lahan',
                  type: 'textarea',
                  validation: assestment.is_expected == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
              <geko-input
                v-model="assestment.expected_proof"
                :item="{
                  label: 'Bukti informasi lahan',
                  type: 'select',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.expected_proof,
                    default_label: assestment.expected_proof_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col md="12">
              <geko-input
                v-model="formData.photo1"
                :item="{
                  label: 'Foto Lahan',
                  validation: [],
                  type: 'upload',
                  api: 'lahans/upload.php',
                  directory: 'foto-lahan',
                  upload_type: 'image/*',
                  setter: 'photo1',
                  view_data: 'photo1',
                  option: {
                    label_hint:
                      'Klik gambar untuk memilih berkas yang akan diunggah',
                    max_size: 5,
                  },
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_deforested"
                :item="{
                  label: 'Apakah lahan pernah terjadi kegiatan pembukaan lahan dalam 10 tahun terakhir?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_deforested_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_deforested == '1'">
              <geko-input
                v-model="assestment.deforested_desc"
                :item="{
                  label: 'Deskripsi pembukaan lahan yang pernah terjadi',
                  type: 'textarea',
                  validation: assestment.is_deforested == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_waterbody"
                :item="{
                  label: 'Apakah lahan terdapat wilayah perairan atau lahan basah?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_waterbody_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_waterbody == '1'">
              <geko-input
                v-model="assestment.waterbody_desc"
                :item="{
                  label: 'Deskripsi wilayah perairan',
                  type: 'textarea',
                  validation: assestment.is_waterbody == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
                <geko-input
                v-model="assestment.is_model"
                :item="{
                  label: 'Apakah lahan cocok untuk penerapan model yg telah ditetapkan sebelumnya?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
  
                    default_label: assestment.is_model_label,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col lg="12" v-if="assestment.is_model == '1'">
              <geko-input
                v-model="assestment.model_desc"
                :item="{
                  label: 'Model yang dipilih',
                  type: 'text',
                  validation: assestment.is_model == '1'
                      ? ['required']
                      : [],
                }"
              />
            </v-col>
            <v-col lg="12">
            <v-row class="tutupan-wrapper pb-5">
                <v-col lg="12">
                  <h4 class="mb-2 text-success">Resiko Lahan</h4>
                </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_fire"
                  :item="{
                    label: 'Apakah di lahan pernah terjadi kebakaran?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_fire_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_fire == '1'">
                <geko-input
                  v-model="assestment.fire_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.fire_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.fire_doc == '1'">
                <geko-input
                  v-model="assestment.fire_photo"
                  :item="{
                    label: 'Foto Kebakaran',
                    validation:
                      assestment.fire_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'fire_photo',
                    view_data: 'fire_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.fire_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.fire_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_fire_risk"
                  :item="{
                    label: 'Apakah di lahan ada resiko terjadi kebakaran?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_fire_risk_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_fire_risk == '1'">
                <geko-input
                  v-model="assestment.fire_risk_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.fire_risk_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.fire_risk_doc == '1'">
                <geko-input
                  v-model="assestment.fire_risk_photo"
                  :item="{
                    label: 'Foto Area yg mudah terbakar',
                    validation:
                      assestment.fire_risk_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'fire_risk_photo',
                    view_data: 'fire_risk_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.fire_risk_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.fire_risk_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_flood"
                  :item="{
                    label: 'Apakah di lahan pernah terjadi banjir?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_flood_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_flood == '1'">
                <geko-input
                  v-model="assestment.flood_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.flood_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.flood_doc == '1'">
                <geko-input
                  v-model="assestment.flood_photo"
                  :item="{
                    label: 'Foto Banjir',
                    validation:
                      assestment.fire_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'flood_photo',
                    view_data: 'flood_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.flood_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.flood_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_flood_risk"
                  :item="{
                    label: 'Apakah di lahan ada resiko terjadi banjir?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_flood_risk_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_flood_risk == '1'">
                <geko-input
                  v-model="assestment.flood_risk_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.flood_risk_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.flood_risk_doc == '1'">
                <geko-input
                  v-model="assestment.flood_risk_photo"
                  :item="{
                    label: 'Foto area yg menjadi penyebab banjir',
                    validation:
                      assestment.flood_risk_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'flood_risk_photo',
                    view_data: 'flood_risk_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.flood_risk_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.flood_risk_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_erosion"
                  :item="{
                    label: 'Apakah di lahan ada resiko erosi?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_erosion_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_erosion == '1'">
                <geko-input
                  v-model="assestment.erosion_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.erosion_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.erosion_doc == '1'">
                <geko-input
                  v-model="assestment.erosion_photo"
                  :item="{
                    label: 'Foto erosi',
                    validation:
                      assestment.erosion_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'erosion_photo',
                    view_data: 'erosion_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.erosion_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.erosion_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                  <geko-input
                  v-model="assestment.is_risk"
                  :item="{
                    label: 'Apakah di lahan ada resiko lainnya?',
                    type: 'select-radio',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.question_option,
    
                      default_label: assestment.is_risk_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_risk == '1'">
                <geko-input
                  v-model="assestment.risk_desc"
                  :item="{
                    label: 'Deskripsi resiko lain',
                    type: 'textarea',
                    validation: assestment.is_risk == '1'
                        ? ['required']
                        : [],
                  }"
                />
              </v-col>
              <v-col lg="12" v-if="assestment.is_risk == '1'">
                <geko-input
                  v-model="assestment.risk_doc"
                  :item="{
                    label: 'Apakah ada bukti dokumentasi',
                    type: 'select-radio',
                    validation: [],
                    option: {
                      default_options: defaultData.yes_no_option,
    
                      default_label: assestment.risk_doc_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
              <v-col md="12" v-if="assestment.risk_doc == '1'">
                <geko-input
                  v-model="assestment.risk_photo"
                  :item="{
                    label: 'Foto area yg beresiko',
                    validation:
                      assestment.risk_doc == '1'
                        ? ['required']
                        : [],
                    type: 'upload',
                    api: 'lahans/upload.php',
                    directory: 'foto-lahan',
                    upload_type: 'image/*',
                    setter: 'risk_photo',
                    view_data: 'risk_photo',
                    option: {
                      label_hint:
                        'Klik gambar untuk memilih berkas yang akan diunggah',
                      max_size: 5,
                    },
                  }"
                />
              </v-col>
              <v-col lg="12">
                <geko-input
                  v-model="assestment.risk_proof"
                  :item="{
                    label: 'Asal keterangan/bukti',
                    type: 'select',
                    validation: ['required'],
                    option: {
                      default_options: defaultData.risk,
                      default_label: assestment.risk_proof_label,
                      list_pointer: {
                        label: 'name',
                        code: 'code',
                        display: ['name'],
                      },
                    },
                  }"
                />
              </v-col>
            </v-row>
            </v-col>
            <v-col lg="12" v-for="(question, i) in questions" :key="`quest-${i}`">
              <geko-input
                v-model="formData[`question_${question.id}`]"
                :item="{
                  label: question.question + '?',
                  type: 'select-radio',
                  validation: ['required'],
                  option: {
                    default_options: defaultData.question_option,
                    list_pointer: {
                      label: 'name',
                      code: 'code',
                      display: ['name'],
                    },
                  },
                }"
              />
            </v-col>
            <v-col
            lg="12">
            <geko-input
              v-model="formData.eligible_status"
              :item="{
                label: 'Eligibilitas Lahan',
                type: 'select-radio',
                validation: ['required'],
                option: {
                  default_options: [
                    {
                      label: 'Tidak Bisa Ikut',
                      code: '0',
                    },
                    {
                      label: 'Bisa Ikut Dengan Kondisi',
                      code: '1',
                    },
                    {
                      label: 'Bisa Ikut',
                      code: '2',
                    },
                  ],
                  default_label: formData.eligible_status_label,
                  list_pointer: {
                    label: 'name',
                    code: 'code',
                    display: ['name'],
                  },
                },
              }"
            />
          </v-col>
            <v-col lg="12">
              <v-btn
                type="submit"
                variant="warning"
                class="w-100"
                style="width: 100%"
                :disabled="loading"
              >
                <v-icon>mdi-content-save</v-icon>
                <span>Simpan Data</span>
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </div>
  </template>
  
  <script>
  import defaultData from "../LahanData.js";
  export default {
    name: "lahan-assestment",
    props: {
      data: {
        required: true,
        type: Object,
        default: () => {},
      },
      questions: {
        required: false,
        default: () => [],
      },
      answers: {
        required: false,
        default: () => [],
      },
      assestment: {
        required: false,
        default: () => [],
      },
      role: {
        required: false,
        default: null,
      },
      isCarbonProject: {
        required: false,
        default: null,
      }
    },
    mounted() {
      this.initData();
    },
  
    methods: {
      async onSubmit() {
        let payload = JSON.parse(JSON.stringify(this.assestment));
        payload.current_id = this.$route.query.id;
  
        this.loading = true;
        this.$_alert
          .confirm(
            "Simpan?",
            "Apakah anda yakin ingin menyimpan data lahan assestment?",
            "Simpan"
          )
          .then(async (res) => {
            if (res.isConfirmed) {
              const insertingQuestion = await this.submitIndicator()
                .then(() => true)
                .catch(() => false);
  
              if (!insertingQuestion) {
                this.loading = false;
                return;
              }
              const nullableData = [
                "boundary_photo",
                "farming_desc",
                "email",
                "phone",
                "whatsapp",
                "expected_photo",
                "fire_photo",
                "fire_risk_photo",
                "flood_photo",
                "flood_risk_photo",
                "erosion_photo",
                "risk_photo",
                "type_ownership",
                "dispute_desc",
                "expanded_desc",
                "interest_proof",
                "illegal_desc",
                "expected_desc",
                "deforested_desc",
                "waterbody_desc",
                "model_desc",
                "risk_desc"
              ];
  
              for (const item of nullableData) {
                if (payload[item] == null || payload[item] == 0) {
                  payload[item] = "-";
                }
              }
              payload.lahan_no = this.data.lahan_no;
              payload.id = this.assestment.id;
              payload.land_occupant = this.assestment.land_occupant ?? formData.farmers_name;
              const isCreate = this.create == "CREATE"
                ? true
                : false;
              this.$_api
                .post(isCreate ? "AddLahanAssestment" : "UpdateLahanAssestment", payload)
                .then(() => {
                  this.loading = false;
                  this.$_alert.success("Data lahan assestment berhasil disimpan");
                  this.$emit("success", true);
                })
                .catch(() => {
                  this.loading = false;
                });

              this.$_api
                .post("UpdateLahanEligibleStatus_new", {
                  current_id: this.$route.query.id,
                  eligible_status: parseInt(this.formData.eligible_status),
                })
                .then(() => {
                  this.loading = false;
                })
                .catch(() => {
                  this.loading = false;
                });
            }
          });
      },
  
      async submitIndicator() {
        return new Promise(async (resolve, reject) => {
          var i = 0;
          for (const question of this.questions) {
            const isCreate = this.answers.find((x) => question.id == x.term_id)
              ? false
              : true;
            await this.$_api
              .post(
                isCreate ? "addLahanTermAnswer_new" : "updateLahantermAnswer_new",
                {
                  current_id: isCreate
                    ? null
                    : this.answers.find((x) => question.id == x.term_id).id,
                  lahan_no: this.data.lahan_no,
                  term_id: question.id,
                  term_answer: this.formData[`question_${question.id}`],
                  program_year: this.$_config.programYear.model || "2024",
                }
              )
              .then(() => {
                i += 1;
  
                if (i == this.questions.length) {
                  return resolve(true);
                }
              })
              .catch((err) => {
                return reject(err);
              });
          }
        });
      },
      initData() {
        const keys = [
          ["land_area"],
          ["planting_area"],
          ["farmers_name"],
          ["elevation"],
          ["description"],
          ["current_crops"],
          ["lahan_type"],
          ["photo1"],
          ["eligible_status"],
          ["fc_complete_data", "boolean"],
          ["is_boundary", "boolean"],
          ["is_dispute", "boolean"],
          ["is_expanded", "boolean"],
          ["is_interest", "boolean"],
          ["is_illegal", "boolean"],
          ["is_expected", "boolean"],
          ["is_deforested", "boolean"],
          ["is_waterbody", "boolean"],
          ["is_model", "boolean"],
          ["is_fire", "boolean"],
          ["is_fire_risk", "boolean"],
          ["is_flood", "boolean"],
          ["is_flood_risk", "boolean"],
          ["is_erosion", "boolean"],
          ["is_risk", "boolean"]
        ];
        for (const question of this.questions) {
          keys.push([`question_${question.id}`, "question", question.id]);
        }
  
        for (const key of keys) {
          var _value = this.data[key[0]];
          if (_value == "-") _value = null;
  
          if (key.length > 1 && key[1] == "boolean") {
            _value = typeof _value === "number" ? _value.toString() : _value;
          }
  
          if (key.length > 2 && key[1] == "question") {
            let _answer = this.answers.find((x) => x.term_id == key[2]);
            if (_answer) {
              _value = [0, 1].includes(_answer.term_answer)
                ? _answer.term_answer.toString()
                : null;
            }
          }
          this.$set(this.formData, key[0], _value);
          if (key.length > 1 && key[1] == "array") {
            var _valueLabel = defaultData[key[2]].find((x) => x.code == _value);
  
            this.$set(this.formData, `${key[0]}_label`, _valueLabel);
          }
        }
  
        this.ready = true;
      },
    },
  
    watch: {},

    computed: {
      defaultData() {
        return defaultData;
      },
    },
    
    data() {
      return {
        loading: false,
        formData: {},
        ready: false,
      };
    },
  };
  </script>
  