<template>
  <v-row class="lahan-detail" :key="'lahan-detail' + componentKey">
    <v-col md="4" xl="3">
      <lahan-mou-print
        :mouData="
          Array.isArray(data.farmer_lahan_mou) &&
          data.farmer_lahan_mou.length > 0
            ? data.farmer_lahan_mou.find(
                (v) => v.mou_no == data.main_lahan.farmers_mou_no_pivot_farmer
              )
            : null
        "
        :lahanData="data.main_lahan"
        :modalKey="printModal"
      />
      <lahan-appendix-print
        v-if="mapReady"
        :mouData="
          Array.isArray(data.farmer_lahan_mou) &&
          data.farmer_lahan_mou.length > 0
            ? data.farmer_lahan_mou.find(
                (v) => v.mou_no == data.main_lahan.farmers_mou_no_pivot_farmer
              )
            : null
        "
        :lahanData="data.main_lahan"
        :modalKey="printAppendixModal"
        :imageData="polygonImageData"
        :trees="data.lahan_detail"
      />
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
      >
        <v-card-title>
          <v-icon large class="mr-2" @click="$router.go(-1)"
            >mdi-arrow-left-circle</v-icon
          >
          <h5 class="mb-0 pb-0">Detail Lahan</h5>
        </v-card-title>
        <div class="lahan-side-wrapper">
          <div class="lahan-side-list">
            <h4>Action</h4>

            <div
              class="lahan-side-item-wrapper"
              style="flex-wrap: wrap; width: 100%"
              v-if="data.main_lahan"
            >
              <!-- UNVERIFIKASI CARBON -->
              <div
                class="lahan-side-item d-flex flex-col"
                style="flex-wrap: wrap"
                v-if="getProject() === 'carbon'"
              >
                <div>
                  <v-btn
                    v-if="
                      $_sys.isAllowed('lahan-fc-unverification-create') &&
                      [0, 1, null].includes(data.main_lahan.fc_complete_data) &&
                      data.main_lahan.updated_gis === 'belum'
                    "
                    variant="danger"
                    class="mr-1 mb-1"
                    @click="unverificationData('fc_complete_data')"
                  >
                    <v-icon>mdi-undo-variant</v-icon>
                    <span>Unverifikasi Kelengkapan Data</span>
                  </v-btn>

                  <v-btn
                    v-if="$_sys.isAllowed('lahan-um-unverification-create')"
                    variant="danger"
                    class="mr-1 mb-1"
                    @click="unverificationData('um_seed')"
                  >
                    <v-icon>mdi-undo-variant</v-icon>
                    <span>Unverifikasi Perubahan Bibit</span>
                  </v-btn>

                  <v-btn
                    v-if="$_sys.isAllowed('lahan-gis-unverification-create')"
                    variant="danger"
                    class="mr-1 mb-1"
                    @click="unverificationData('gis')"
                  >
                    <v-icon>mdi-undo-variant</v-icon>
                    <span>Unverifikasi GIS</span>
                  </v-btn>

                  <v-btn
                    v-if="$_sys.isAllowed('lahan-um-unverification-create')"
                    variant="danger"
                    class="mr-1 mb-1"
                    @click="unverificationData('um_unverification')"
                  >
                    <v-icon>mdi-undo-variant</v-icon>
                    <span
                      >Unverifikasi
                      {{ data.main_lahan.approve == 2 ? "UM" : "FC" }}</span
                    >
                  </v-btn>
                </div>

                <v-btn
                  v-if="
                    !openGisEdit &&
                    $_sys.isAllowed('lahan-gis-verification-create') &&
                    data.main_lahan.fc_complete_data == 1
                  "
                  variant="success"
                  class="mr-1 mb-1"
                  @click="
                    openGisEdit = true;
                    verifRole = 'gis';
                  "
                  >Verifikasi GIS</v-btn
                >
                <v-btn
                  v-if="
                    !openFcCompleteData &&
                    !openFc &&
                    $_sys.isAllowed('lahan-fc-verification-create') &&
                    data.main_lahan &&
                    ((data.main_lahan.fc_complete_data == null &&
                      data.main_lahan.updated_gis.toLowerCase() === 'belum') ||
                      data.main_lahan.updated_gis.toLowerCase() === 'sudah')
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="toggleVerificationFc"
                  >Verifikasi FC</v-btn
                >
                <v-btn
                  v-if="
                    !openUm &&
                    $_sys.isAllowed('lahan-um-verification-create') &&
                    data.main_lahan &&
                    data.main_lahan.updated_gis.toLowerCase() === 'sudah' &&
                    data.main_lahan.approve == 1
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="
                    openUm = true;
                    verifRole = 'um';
                  "
                  >Verifikasi UM</v-btn
                >

                <!-- PRINT & PREVIEW MOU -->
                <v-btn
                  variant="primary"
                  class="mr-1 mb-2 d-flex flex-row align-items-center"
                  v-if="$_sys.isAllowed('lahan-print-mou-create')"
                  @click="printModal += 1"
                >
                  <v-icon v-if="btnLabelLegalitasMOU.toLowerCase() == 'preview'"
                    >mdi-file-document-outline</v-icon
                  >
                  <v-icon
                    v-else-if="btnLabelLegalitasMOU.toLowerCase() == 'revisi'"
                    >mdi-file-document-edit-outline</v-icon
                  >
                  <v-icon v-else>mdi-printer-outline</v-icon>
                  <span class="ml-1">{{ btnLabelLegalitasMOU }} MOU</span>
                </v-btn>

                <!-- PRINT APPENDIX LAHAN -->
                <v-btn
                  variant="primary"
                  @click="onOpenAppendixPrint"
                  v-if="$_sys.isAllowed('lahan-print-appendix-create')"
                >
                  <v-icon>mdi-printer-outline</v-icon>
                  <span>Print Appendix</span>
                </v-btn>
              </div>
              <!-- UNVERIFIKASI & VERIF NON CARBON -->
              <div
                class="lahan-side-item d-flex flex-col"
                style="flex-wrap: wrap"
                v-if="getProject() === 'non-carbon'"
              >
                <!-- UNVERIFIKASI -->
                <v-btn
                  v-if="
                    $_sys.isAllowed('lahan-fc-unverification-create') &&
                    [0, 1, null].includes(data.main_lahan.fc_complete_data)
                  "
                  variant="danger"
                  class="mr-1 mb-1"
                  @click="unverificationData('fc_complete_data')"
                >
                  <v-icon>mdi-undo-variant</v-icon>
                  <span>Unverifikasi Kelengkapan Data</span>
                </v-btn>

                <v-btn
                  v-if="$_sys.isAllowed('lahan-um-unverification-create')"
                  variant="danger"
                  class="mr-1 mb-1"
                  @click="unverificationData('um_unverification')"
                >
                  <v-icon>mdi-undo-variant</v-icon>
                  <span>Unverifikasi UM</span>
                </v-btn>
                <!-- VERIFIKASI -->
                <v-btn
                  v-if="
                    !openGisEdit &&
                    $_sys.isAllowed('lahan-fc-verification-create') &&
                    data.main_lahan &&
                    data.main_lahan.approve == 0
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="
                    openGisEdit = true;
                    verifRole = 'fc-non-carbon';
                  "
                  >Verifikasi FC</v-btn
                >

                <v-btn
                  v-if="
                    $_sys.isAllowed('lahan-um-verification-create') &&
                    data.main_lahan &&
                    data.main_lahan.approve == 1
                  "
                  variant="success"
                  class="mr-1 mb-2"
                  @click="verifUmNonCarbon()"
                  >Verifikasi Data Lahan</v-btn
                >
              </div>
            </div>
          </div>
          <!-- 
          <lahan-gis-verification
            v-if="
              data.main_lahan &&
              ['4', '13', '14', '19', '20'].includes(
                this.$store.state.User.role
              ) &&
              openGisEdit
            "
            :data="data.main_lahan"
            :questions="
              data.lahan_term_question_list.filter((x) => {
                if (verifRole == 'gis') return x.role_id == 14;
                else if (verifRole == 'um') return x.role_id == 20;
                else if (verifRole == 'fc') return x.role_id == 19;
              })
            "
            :answers="data.lahan_term_answer_list"
            :role="verifRole"
            :isCarbonProject="
              Array.isArray(data.lahan_project) &&
              data.lahan_project.length > 0 &&
              data.lahan_project[0].project_planting_purposes_code == 'carbon'
            "
            :polygonGisArea="polygonGisArea"
            @success="
              componentKey += 1;
              openGisEdit = false;
              getData();
            "
            @polygon_change="onChangePolygon"
            @close="
              openGisEdit = false;
              verifRole = null;
            "
          /> -->

          <lahan-verification-gis
            v-if="
              data.main_lahan &&
              $_sys.isAllowed('lahan-gis-verification-create') &&
              openGisEdit
            "
            :data="data.main_lahan"
            :questions="
              data.lahan_term_question_list.filter((x) => x.role_id == 14)
            "
            :answers="data.lahan_term_answer_list"
            :role="verifRole"
            :isCarbonProject="getProject(data.lahan_project) === 'carbon'"
            :polygonGisArea="polygonGisArea"
            @success="
              componentKey += 1;
              openGisEdit = false;
              getData();
            "
            @polygon_change="onChangePolygon"
            @close="
              openGisEdit = false;
              verifRole = null;
            "
          />

          <lahan-verification-fc-complete-data
            v-if="
              data.main_lahan &&
              $_sys.isAllowed('lahan-fc-verification-create') &&
              openFcCompleteData
            "
            :data="data.main_lahan"
            :role="verifRole"
            :isCarbonProject="getProject(data.lahan_project) === 'carbon'"
            @success="
              componentKey += 1;
              openFcCompleteData = false;
              getData();
            "
            @close="
              openFcCompleteData = false;
              verifRole = null;
            "
          />

          <lahan-verification-fc
            v-if="
              data.main_lahan &&
              $_sys.isAllowed('lahan-fc-verification-create') &&
              openFc
            "
            :data="data.main_lahan"
            :questions="
              data.lahan_term_question_list.filter((x) => x.role_id == 19)
            "
            :answers="data.lahan_term_answer_list"
            :role="verifRole"
            :isCarbonProject="getProject(data.lahan_project) === 'carbon'"
            @success="
              componentKey += 1;
              openFc = false;
              getData();
            "
            @close="
              openFc = false;
              verifRole = null;
            "
          />

          <lahan-verification-um
            v-if="
              data.main_lahan &&
              $_sys.isAllowed('lahan-um-verification-create') &&
              openUm
            "
            :data="data.main_lahan"
            :role="verifRole"
            :isCarbonProject="getProject(data.lahan_project) === 'carbon'"
            @success="
              componentKey += 1;
              openUm = false;
              getData();
            "
            @close="
              openUm = false;
              verifRole = null;
            "
          />

          <div class="lahan-side-list">
            <h4>Status &amp; Log</h4>

            <div class="lahan-side-item-wrapper" v-if="data.main_lahan">
              <div class="lahan-side-item">
                <p class="mb-0 label">Status</p>

                <!--
                  STATUS LAHAN CARBON
                  - Belum Diverifikasi
                  - Diverifikasi GIS
                  - Diverifikasi FC
                  - Terverifikasi


                  STATUS LAHAN NON CARBON
                  - Belum Diverifikasi
                  - Diverifikasi FC
                  - Terverifikasi / Force Majeure
                -->

                <!-- STATUS CARBON -->
                <div
                  class="d-flex flex-row value"
                  v-if="getProject() === 'carbon'"
                >
                  <span
                    :class="{
                      'badge bg-warning':
                        data.main_lahan.approve == 0 &&
                        data.main_lahan.updated_gis.toLowerCase() == 'belum',
                      'badge bg-info':
                        data.main_lahan.approve == 0 &&
                        data.main_lahan.updated_gis.toLowerCase() == 'sudah',
                      'badge bg-primary':
                        data.main_lahan.approve == 1 &&
                        data.main_lahan.fc_complete_data != null,
                      'badge bg-success': data.main_lahan.approve == 2,
                      'badge bg-danger':
                        data.main_lahan.approve == 3 ||
                        (data.main_lahan.approve == 1 &&
                          data.main_lahan.fc_complete_data == null),
                    }"
                  >
                    <span
                      v-if="
                        data.main_lahan.approve == 1 &&
                        data.main_lahan.fc_complete_data == null
                      "
                      >Data Bermasalah</span
                    >
                    <span
                      v-else-if="
                        data.main_lahan.approve == 0 &&
                        data.main_lahan.updated_gis.toLowerCase() == 'belum'
                      "
                      >Belum Diverifikasi</span
                    >
                    <span
                      v-else-if="
                        data.main_lahan.approve == 0 &&
                        data.main_lahan.updated_gis.toLowerCase() == 'sudah'
                      "
                      >Diverifikasi GIS</span
                    >
                    <span v-else-if="data.main_lahan.approve == 1"
                      >Diverifikasi FC</span
                    >
                    <span v-else-if="data.main_lahan.approve == 2"
                      >Terverifikasi</span
                    >
                    <span v-else-if="data.main_lahan.approve == 3"
                      >Force Majeure</span
                    >
                  </span>
                </div>

                <!-- STATUS NON CARBON -->
                <div
                  class="d-flex flex-row value"
                  v-if="getProject() === 'non-carbon'"
                >
                  <span
                    class="badge"
                    :class="{
                      'bg-warning':
                        data.main_lahan.approve === 0 &&
                        data.main_lahan.fc_complete_data === null,
                      'bg-primary':
                        data.main_lahan.approve === 1 &&
                        data.main_lahan.fc_complete_data !== null,
                      'bg-success': data.main_lahan.approve === 2,
                    }"
                  >
                    <span
                      v-if="
                        data.main_lahan.approve === 0 &&
                        data.main_lahan.fc_complete_data === null
                      "
                      >Belum Diverifikasi</span
                    >
                    <span
                      v-else-if="
                        data.main_lahan.approve === 1 &&
                        data.main_lahan.fc_complete_data !== null
                      "
                      >Data Lahan Terverifikasi</span
                    >
                    <span v-else-if="data.main_lahan.approve === 2"
                      >Terverifikasi</span
                    >
                  </span>
                </div>
              </div>

              <div class="lahan-side-item">
                <p class="mb-0 label">Jumlah Bibit</p>
                <div class="d-flex flex-row value">
                  <span
                    v-if="data.main_lahan.seed_is_modified == 1"
                    class="badge"
                    :class="{
                      'bg-danger': data.main_lahan.seed_verify_status == 0,
                      'bg-warning': data.main_lahan.seed_verify_status == null,
                      'bg-success': data.main_lahan.seed_verify_status == 1,
                    }"
                  >
                    <span v-if="data.main_lahan.seed_verify_status == 0"
                      >Tidak Disetujui</span
                    >
                    <span v-else-if="data.main_lahan.seed_verify_status == 1"
                      >Disetujui</span
                    >

                    <span v-else>Menunggu Approval</span>
                  </span>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="lahan-side-item" v-if="getProject() === 'carbon'">
                <p class="mb-0 label">Eligibilitas Lahan</p>
                <div class="d-flex flex-row value">
                  <span
                    :class="{
                      'text-danger': data.main_lahan.eligible_status == 0,
                      'text-warning': data.main_lahan.eligible_status == 1,
                      'text-success': data.main_lahan.eligible_status == 2,
                    }"
                  >
                    <span v-if="data.main_lahan.eligible_status == 0"
                      >Tidak Bisa Ikut</span
                    >
                    <span v-else-if="data.main_lahan.eligible_status == 1"
                      >Bisa Ikut Dengan Tindakan Tambahan</span
                    >
                    <span v-else-if="data.main_lahan.eligible_status == 2"
                      >Bisa Ikut</span
                    >
                    <span v-else>-</span>
                  </span>
                </div>
              </div>

              <div
                class="lahan-side-item d-flex flex-col"
                style="flex-direction: column !important"
              >
                <p class="mb-0 label">Log Data</p>
                <div class="d-flex flex-col log-data" v-if="data.main_lahan">
                  <div class="log-data-item active">
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span class="time">{{
                        formatDate(
                          data.main_lahan.created_at,
                          "D MMMM YYYY HH:mm"
                        )
                      }}</span>
                      <span class="label">FF Menambahkan Data Lahan</span>
                      <span class="user"
                        >FF: {{ data.main_lahan.field_facilitators_name }}</span
                      >
                    </div>
                  </div>

                  <div
                    class="log-data-item"
                    :class="{
                      active: [0, 1].includes(data.main_lahan.fc_complete_data),
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="data.main_lahan.fc_complete_data_at"
                        >{{
                          formatDate(
                            data.main_lahan.fc_complete_data_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label">FC Verifikasi Kelengkapan Data</span>
                      <span
                        class="user"
                        v-if="data.main_lahan.fc_complete_data_by"
                        >{{ data.main_lahan.fc_complete_data_by }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-if="getProject() === 'carbon'"
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.gis_updated_at,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="data.main_lahan.gis_updated_at"
                        >{{
                          formatDate(
                            data.main_lahan.gis_updated_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label"
                        >GIS Verifikasi Polygon & Data Lahan</span
                      >
                      <span
                        class="user"
                        v-if="data.main_lahan.gis_updated_at"
                        >{{ data.main_lahan.gis_officer }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.approve >= 1,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="
                          data.main_lahan.approve >= 1 &&
                          data.main_lahan.approved_at
                        "
                        >{{
                          formatDate(
                            data.main_lahan.approved_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label">FC Verifikasi Data Lahan</span>
                      <span
                        v-if="
                          data.main_lahan.approve >= 1 &&
                          data.main_lahan.approved_by
                        "
                        class="user"
                        >{{ data.main_lahan.approved_by }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-if="getProject() === 'carbon'"
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.approve == 2,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="
                          data.main_lahan.approve == 2 &&
                          data.main_lahan.update_eligible_at
                        "
                        >{{
                          formatDate(
                            data.main_lahan.update_eligible_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label"
                        >UM Menentukan Eligibilitas Lahan</span
                      >
                      <span
                        v-if="
                          data.main_lahan.approve == 2 &&
                          data.main_lahan.update_eligible_by
                        "
                        class="user"
                        >{{ data.main_lahan.update_eligible_by }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-if="getProject() === 'non-carbon'"
                    class="log-data-item"
                    :class="{
                      active: data.main_lahan.approve == 2,
                    }"
                  >
                    <div class="dot-wrapper">
                      <div class="dot"></div>
                    </div>
                    <div class="log-value">
                      <span
                        class="time"
                        v-if="
                          data.main_lahan.approve == 2 &&
                          data.main_lahan.approved_at
                        "
                        >{{
                          formatDate(
                            data.main_lahan.approved_at,
                            "D MMMM YYYY HH:mm"
                          )
                        }}</span
                      >
                      <span class="label">UM Verifikasi Data Lahan</span>
                      <span
                        v-if="
                          data.main_lahan.approve == 2 &&
                          data.main_lahan.approved_by
                        "
                        class="user"
                        >{{ data.main_lahan.approved_by }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="data.main_lahan"
            class="lahan-side-list"
            v-for="(item, i) in side"
            :key="'land-detail-row-' + i"
          >
            <h4>{{ item.name }}</h4>

            <div class="lahan-side-item-wrapper">
              <div
                class="lahan-side-item"
                v-for="(v, j) in item.items"
                :key="'lahan-item' + i + j"
                v-if="!v.project || (v.project && v.project === getProject())"
              >
                <p class="mb-0 label">{{ v.label }}</p>
                <div class="value">
                  <p class="mb-0 value qrcode" v-if="v.type === 'qrcode'">
                    <qr-code :text="data.main_lahan.barcode" />
                  </p>
                  <span class="mb-0 value" v-if="v.key === 'project'">
                    <div
                      v-if="v.key === 'project'"
                      v-for="(project, j) in data.lahan_project"
                      :key="`project-${j}`"
                      class="d-flex flex-col"
                    >
                      <span>{{ project.projects_project_name }}</span>
                      <div class="d-flex flex-row mb-2">
                        <span
                          class="badge"
                          :class="{
                            'bg-info':
                              project.project_planting_purposes_code ==
                              'carbon',
                            'bg-light':
                              project.project_planting_purposes_code !=
                              'carbon',
                          }"
                          >{{ project.project_planting_purposes_name }}</span
                        >
                      </div>
                    </div>
                  </span>
                  <p
                    class="mb-0 value"
                    v-if="v.type !== 'qrcode' && v.key !== 'project'"
                  >
                    <span v-if="v.prepend">{{ v.prepend }}</span>
                    <span
                      :class="{
                        [v.class || '']: true,
                      }"
                      >{{
                        getValue(v.key) | parse(v.transform || "no-empty")
                      }}</span
                    >
                    <span v-if="v.append">{{ v.append }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col lg="8">
      <v-card
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
        class="scooping-visit-detail-card mb-5"
      >
        <v-card-title>
          <h5 class="mb-0 pb-0">Polygon, Pohon &amp; Lainnya</h5>
        </v-card-title>
        <div
          class="alert bg-info-light px-3 mx-4 py-2 d-flex flex-row br-8 mb-4"
          v-if="
            data.main_lahan &&
            data.main_lahan.updated_gis &&
            data.main_lahan.updated_gis.toLowerCase() == 'sudah' &&
            data.main_lahan.gis_polygon_area
          "
        >
          <v-icon large class="text-info">mdi-information</v-icon>
          <span class="text-info d-block pl-2"
            >Luas lahan dan luas tanam dihitung berdasarkan luas polygon
            lahan</span
          >
        </div>
        <div class="lahan-stat-list">
          <div class="lahan-stat-item">
            <p class="mb-0 label">Tutupan Lahan</p>
            <p class="mb-0 value">
              <span v-if="data.main_lahan"
                >{{ data.main_lahan.tutupan_lahan }}%</span
              >
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Lahan</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <span
                v-if="
                  data.main_lahan &&
                  data.main_lahan.updated_gis.toLowerCase() == 'belum'
                "
                >{{ data.main_lahan.land_area | parse("ts") }} m&sup2;</span
              >
              <span
                v-else-if="
                  data.main_lahan &&
                  data.main_lahan.updated_gis.toLowerCase() == 'sudah' &&
                  data.main_lahan.gis_polygon_area
                "
                >{{
                  data.main_lahan.gis_polygon_area | parse("ts")
                }}
                m&sup2;</span
              >
            </p>
          </div>
          <div class="lahan-stat-item">
            <p class="mb-0 label">Luas Tanam</p>
            <p class="mb-0 value" v-if="data.main_lahan">
              <!-- <span
                v-if="data.main_lahan && data.main_lahan.updated_gis == 'sudah'"
                >{{
                  ((data.main_lahan.planting_area / 100) *
                    data.main_lahan.land_area)
                    | parse("ts")
                }}
                m&sup2;</span
              > -->
              <span
                v-if="
                  data.main_lahan &&
                  data.main_lahan.updated_gis.toLowerCase() == 'belum'
                "
                >{{ data.main_lahan.planting_area | parse("ts") }} m&sup2;</span
              >
              <span
                v-else-if="
                  data.main_lahan &&
                  data.main_lahan.updated_gis.toLowerCase() == 'sudah' &&
                  data.main_lahan.gis_polygon_area
                "
                >{{
                  data.main_lahan.gis_planting_area | parse("ts")
                }}
                m&sup2;</span
              >
            </p>
          </div>
        </div>
        <div class="polygon-wrapper">
          <div
            class="map-wrapper"
            id="map-wrapper"
            style="height: 400px; width: 100%"
          >
            <div class="map-legends">
              <div
                class="map-legend-item"
                v-for="(item, i) in legends"
                :key="item.id"
                :class="{
                  active: item.show,
                  disabled: item.disabled,
                }"
                @click="toggleLayer(item, i)"
              >
                <span
                  v-if="item.id !== 'map-coordinate'"
                  class="shape"
                  :class="item.shape"
                >
                </span>
                <span v-else-if="item.id == 'map-coordinate'"
                  ><v-icon class="icon">mdi-map-marker</v-icon></span
                >
                <span>{{ item.label }}</span>
              </div>
            </div>
            <div ref="mapContainer" class="map-container" v-if="mapOpen"></div>
            <div class="map-placeholder" v-else>
              <v-btn variant="success" @click="openMaps">
                <v-icon>mdi-google-maps</v-icon>
                <span>Buka Maps</span>
              </v-btn>
            </div>
          </div>

          <div class="lahan-photo-list d-flex flex-row" v-if="data.main_lahan">
            <div
              v-if="
                data.main_lahan.photo1 !== '-' ||
                data.main_lahan.photo2 !== '-' ||
                data.main_lahan.photo3 !== '-' ||
                data.main_lahan.photo4 !== '-'
              "
              class="lahan-photo-item"
              v-for="(item, i) in [1, 2, 3, 4]"
              :key="'lahan-photo' + i"
              @click="
                showLightbox(
                  $_config.baseUrlUpload + '/' + data.main_lahan[`photo${item}`]
                )
              "
              v-bind:style="{
                backgroundImage:
                  'url(' +
                  $_config.baseUrlUpload +
                  '/' +
                  data.main_lahan[`photo${item}`] +
                  ')',
              }"
            >
              <h6>Foto Lahan {{ item }}</h6>
            </div>
          </div>

          <div class="trees">
            <div
              class="d-flex flex-row align-items-center justify-content-between"
            >
              <h4 class="mb-0 pb-0">Pohon</h4>
              <div class="trees-filter" v-if="trees.length > 1">
                <v-btn
                  v-for="(tree, i) in trees"
                  :variant="tree.label != treesActive ? 'light' : 'success'"
                  :key="`lahan-detail-tree-${i}`"
                  class="mr-2"
                  :class="{
                    'font-weight-bold': tree.label == treesActive,
                  }"
                  @click="treesActive = tree.label"
                  >{{ tree.label }}
                </v-btn>
              </div>
            </div>

            <div
              class="d-flex flex-row align-items-center bg-warning-light px-3 py-3 br-8 mb-4 mt-3"
              v-if="
                data.main_lahan &&
                data.main_lahan.updated_gis == 'belum' &&
                Array.isArray(data.lahan_project) &&
                data.lahan_project.length > 0 &&
                data.lahan_project[0].project_planting_purposes_code == 'carbon'
              "
            >
              <v-icon large class="text-warning mr-3">mdi-information</v-icon>
              <span
                class="text-warning"
                v-if="
                  data.main_lahan.pohon_kayu == 0 &&
                  data.main_lahan.pohon_mpts == 0 &&
                  data.main_lahan.seed_is_modified == null
                "
                >Untuk <strong>Project Carbon</strong>, data jumlah bibit akan
                diperbarui setelah data lahan dan polygon lahan diverifikasi
                oleh GIS. Update jumlah bibit dapat dilakukan melalui GEKO
                Mobile App</span
              >

              <span
                class="text-warning"
                v-if="
                  (data.main_lahan.pohon_kayu > 0 ||
                    data.main_lahan.pohon_mpts > 0) &&
                  data.main_lahan.seed_is_modified == null
                "
                >Untuk <strong>Project Carbon</strong>, data jumlah bibit masih
                perkiraan. Jumlah bibit dapat diperbarui melalui GEKO Mobile App
                setelah data lahan dan polygon lahan diverifikasi oleh
                GIS.</span
              >
            </div>

            <div
              class="d-flex flex-row align-items-center bg-info-light px-2 py-2 br-8 mt-3"
              v-if="
                $_sys.isAllowed('lahan-um-verification-create') &&
                data.main_lahan &&
                data.main_lahan.seed_is_modified == 1 &&
                data.main_lahan.seed_verify_status !== 1
              "
            >
              <v-icon large class="text-info">mdi-information</v-icon>
              <span class="text-info pl-3"
                >Data jumlah bibit sudah diperbarui, silahkan verifikasi jumlah
                bibit dan status eligibilitas lahan
              </span>
            </div>

            <div class="tree-list">
              <div
                class="tree-item"
                v-for="(item, i) in Array.isArray(trees) &&
                trees.find((x) => x.label == treesActive) &&
                trees.find((x) => x.label == treesActive).data
                  ? trees.find((x) => x.label == treesActive).data
                  : []"
              >
                <v-icon>mdi-tree</v-icon>
                <div class="tree-item-wrapper">
                  <span class="label">Pohon {{ item.trees_tree_name }} </span>
                  <span class="value">{{ item.amount | parse("ts") }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="other-data mt-5">
            <h4 class="mb-4 text-success">Data Lahan Lainnya</h4>

            <div class="other-data-list">
              <div
                class="other-data-item"
                v-for="(item, i) in mainData"
                :key="'key-' + i"
              >
                <p class="mb-0 label">{{ item[0] }}</p>
                <div class="value" v-if="data.main_lahan">
                  <span
                    v-if="
                      item.length > 2 &&
                      item[2] == 'photo' &&
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      ) &&
                      data.main_lahan[item[1]] !== '-'
                    "
                  >
                    <img
                      class="main-data-img"
                      :src="
                        $_config.baseUrlUpload + '/' + data.main_lahan[item[1]]
                      "
                      alt=""
                      @click="
                        showLightbox(
                          $_config.baseUrlUpload +
                            '/' +
                            data.main_lahan[item[1]]
                        )
                      "
                    />
                  </span>
                  <span
                    v-else-if="
                      item.length > 2 &&
                      item[2] == 'boolean' &&
                      data.main_lahan[item[1]] !== '-' &&
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      )
                    "
                  >
                    <span
                      class="badge"
                      :class="{
                        'bg-success': data.main_lahan[item[1]] == 1,
                        'bg-danger': data.main_lahan[item[1]] == 0,
                      }"
                    >
                      <v-icon v-if="data.main_lahan[item[1]] == 1"
                        >mdi-circle-fill</v-icon
                      >
                      <v-icon v-else-if="data.main_lahan[item[1]] == 0"
                        >mdi-close-circle-fill</v-icon
                      >
                      <span
                        >{{
                          data.main_lahan[item[1]] == 1
                            ? "Ya"
                            : data.main_lahan[item[1]] == 0
                            ? "Tidak"
                            : "-"
                        }}
                      </span>
                    </span>
                  </span>

                  <span
                    v-else-if="
                      ![null, undefined, '', '-'].includes(
                        data.main_lahan[item[1]]
                      )
                    "
                  >
                    <span>{{ data.main_lahan[item[1]] }}</span>
                    <span
                      v-if="
                        item.length > 4 &&
                        item[4] &&
                        ![null, undefined, '', '-'].includes(
                          data.main_lahan[item[1]]
                        )
                      "
                      >{{ item[4] }}</span
                    ></span
                  >

                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </div>
          <div class="questions mt-5 pt-5" v-if="getProject() === 'carbon'">
            <h4 class="mb-4 text-success">
              Kelayakan dan Kesesuaian Lahan Project
            </h4>
            <table class="eligibility-table geko-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Indikator</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(question, i) in data.lahan_term_question_list"
                  :key="`question-${i}`"
                >
                  <td class="text-center">{{ i + 1 }}</td>
                  <td>{{ question.question }}</td>
                  <td>
                    <div class="center-v text-no-wrap">
                      <span
                        class="badge"
                        :class="{
                          'bg-danger':
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 0,
                          'bg-success':
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 1,
                        }"
                      >
                        <span
                          class="center-v text-no-wrap"
                          v-if="
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 0
                          "
                        >
                          <v-icon small class="mr-1"
                            >mdi-close-circle-outline</v-icon
                          >
                          <span>Tidak</span>
                        </span>
                        <span
                          class="center-v text-no-wrap"
                          v-else-if="
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ) &&
                            data.lahan_term_answer_list.find(
                              (x) => x.term_id === question.id
                            ).term_answer == 1
                          "
                        >
                          <v-icon small class="mr-1"
                            >mdi-check-circle-outline</v-icon
                          >
                          <span>Ya</span>
                        </span>

                        <span v-else>-</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VueQRCodeComponent from "vue-qrcode-component";
import LahanGisVerification from "./LahanGisVerification.vue";
import LahanVerificationGis from "./components/LahanVerificationGis.vue";
import LahanVerificationFcCompleteData from "./components/LahanVerificationFcCompleteData.vue";
import LahanVerificationFc from "./components/LahanVerificationFc.vue";
import LahanVerificationUm from "./components/LahanVerificationUm.vue";
import LahanMouPrint from "./components/LahanMouPrint.vue";
import LahanAppendixPrint from "./components/LahanAppendixPrint.vue";
import moment from "moment";
import html2canvas from "html2canvas";

export default {
  name: "land-detail",
  components: {
    "qr-code": VueQRCodeComponent,
    LahanGisVerification,
    LahanVerificationGis,
    LahanVerificationFcCompleteData,
    LahanVerificationFc,
    LahanVerificationUm,
    LahanMouPrint,
    LahanAppendixPrint,
  },
  methods: {
    test() {
      // const captureElement = document.querySelector(".map-wrapper");
      var mapCanvas = document.querySelector(".mapboxgl-canvas");
      mapCanvas.style.display = "block";
      const mapImage = mapCanvas.toDataURL();

      // html2canvas(captureElement, { useCORS: true })
      //   .then((canvas) => {
      //     canvas.style.display = "none";
      //     document.body.appendChild(canvas);
      //     return canvas;
      //   })
      //   .then((canvas) => {
      //     const image = canvas.toDataURL("image/png");
      //     const a = document.createElement("a");
      //     a.setAttribute("download", "my-image.png");
      //     a.setAttribute("href", image);
      //     a.click();
      //     canvas.remove();
      //   });
    },

    onOpenAppendixPrint() {
      var mapCanvas = document.querySelector(".mapboxgl-canvas");
      mapCanvas.style.display = "block";
      const mapImage = mapCanvas.toDataURL();
      this.polygonImageData = mapImage;
      this.printAppendixModal += 1;
    },

    getProject(lahanDetail) {
      try {
        return lahanDetail[0].project_planting_purposes_code;
      } catch {
        return false;
      }
    },
    toggleVerificationFc() {
      if (this.data.main_lahan.fc_complete_data === null) {
        this.openFcCompleteData = !this.openFcCompleteData;
      } else {
        this.openFc = !this.openFc;
      }

      this.verifRole =
        this.data.main_lahan.fc_complete_data == null &&
        this.data.main_lahan.updated_gis.toLowerCase() == "belum"
          ? "fc-verif-data"
          : "fc";

      if (!this.openFc && !this.openFcCompleteData) {
        console.log(this.verifRole);
      }
    },
    //refactored
    async unverificationData(type) {
      if (this.loading) return;

      if (type == "gis") {
        this.handleGisUnverification();
        return;
      }

      if (type == "um_unverification") {
        this.handleUmUnverification();

        return;
      }
      const confirmationMessage =
        type === "fc_complete_data"
          ? "Apakah anda yakin ingin unverifikasi data kelengkapan lahan?"
          : "Apakah anda yakin ingin unverifikasi jumlah bibit?";
      const apiEndpoint =
        type === "fc_complete_data"
          ? "UpdateLahanFCCompleteStatus_new"
          : "UpdateSeedAmountVerification_new";
      const successMessage =
        type === "fc_complete_data"
          ? "Kelengkapan data lahan berhasil diunverifikasi"
          : "Jumlah bibit berhasil diunverifikasi";

      const prompt = await this.$_alert.confirm(
        "Unverifikasi Data?",
        confirmationMessage,
        "Unverifikasi",
        "Batal",
        true
      );

      if (!prompt.isConfirmed) {
        this.loading = false;
        return;
      }

      this.loading = true;

      const updateCompleteData = await this.$_api
        .post(apiEndpoint, {
          current_id: this.$route.query.id,
          fc_complete_data: type === "fc_complete_data" ? 2 : undefined,
          verif_moduls: type === "um_seed" ? "unverif" : undefined,
        })
        .then(() => {
          this.$_alert.success(successMessage);
          this.componentKey += 1;
          this.getData();
          this.loading = false;
        })
        .catch(() => {
          this.$_alert.error({}, "Error", "Failed to unverify data");
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
          return false;
        });
    },

    async handleGisUnverification() {
      this.loading = true;

      const prompt = await this.$_alert.confirm(
        "Unverifikasi Data GIS?",
        "",
        "Unverifikasi",
        "Batal",
        true
      );

      if (!prompt.isConfirmed) {
        this.loading = false;
        return;
      }

      let payload = {
        current_id: this.$route.query.id,
        moduls: "unverification",
        approval_status: 3,
      };

      this.$_api.post("UpdateLahanApproval_new", payload).then((res) => {
        this.$_alert.success("Lahan berhasil diunverifikasi");
        this.loading = false;
      });
    },

    async handleUmUnverification() {
      this.loading = true;

      const prompt = await this.$_alert.confirm(
        "Unverifikasi Data?",
        "",
        "Unverifikasi",
        "Batal",
        true
      );

      if (!prompt.isConfirmed) {
        this.loading = false;

        return;
      }

      const payload = {
        current_id: this.$route.query.id,
        lahan_no: this.data.main_lahan.lahan_no,
        moduls: "unverification",
        approval_status: this.data.main_lahan.approve,
        // approval_status: 2,
        fc_email: this.data.main_lahan.users_email,
      };
      console.log("payload", payload);

      this.$_api.post("UpdateLahanApproval_new", payload).then(() => {
        this.$_alert.success("Lahan berhasil diunverifikasi");
      });
    },

    async verifUmNonCarbon() {
      if (this.loading) return;
      this.loading = true;

      const isConfirmed = await this.$_alert.confirm(
        "Verifikasi Data Lahan?",
        "Apakah anda yakin ingin verifikasi data lahan?",
        "Ya, Verifikasi",
        "Batal",
        true
      );
      if (!isConfirmed.isConfirmed) {
        this.loading = false;
        return;
      }

      this.$_api
        .post("UpdateLahanApproval_new", {
          current_id: this.$route.query.id,
          moduls: "verification",
          approval_status: 2,
        })
        .then(() => {
          this.loading = false;
          this.componentKey += 1;
          this.getData();
          this.$_alert.success("Lahan berhasil diunverifikasi");
        });
    },

    getProject() {
      try {
        return this.data.lahan_project[0].project_planting_purposes_code;
      } catch {
        return null;
      }
    },

    toggleLayer(item, i) {
      var isLayerFillExist = this.map.getLayer(`${item.id}-fill`);
      if (isLayerFillExist) {
        this.map.setLayoutProperty(
          `${item.id}-fill`,
          "visibility",
          item.show ? "none" : "visible"
        );
      }

      var isLayerBorderExist = this.map.getLayer(`${item.id}-border`);
      if (isLayerBorderExist) {
        this.map.setLayoutProperty(
          `${item.id}-border`,
          "visibility",
          item.show ? "none" : "visible"
        );
      }

      if (item.id == "map-coordinate") {
        if (item.show) {
          for (const _marker of this.markers) {
            _marker.remove();
          }
          this.markers = [];
        } else {
          for (const coord of Array.isArray(this.data.lahan_polygon)
            ? this.data.lahan_polygon
            : []) {
            const marker = new mapboxgl.Marker()
              .setLngLat([coord.longitude, coord.latitude])
              .addTo(this.map);

            this.markers.push(marker);
          }
        }
      }
      if (
        !isLayerBorderExist &&
        !isLayerFillExist &&
        item.id !== "map-coordinate"
      )
        return;
      this.legends[i].show = !item.show;
    },
    getValue(data) {
      var _value = this.data;
      for (const key of data.split(".")) {
        if (_value[key]) {
          _value = _value[key];
        }
      }

      if (typeof _value === "object") return "-";

      return _value;
    },
    async getData() {
      const result = await this.$_api.get("getDetailLahan_new", {
        id: this.$route.query.id,
      });

      this.data = result;
      console.log("detailData res", result);
      let _trees = [];
      for (const tree of result.lahan_detail) {
        const idx = _trees.findIndex(
          (x) => x.label == tree.detail_year.substring(0, 4)
        );
        if (idx < 0) {
          _trees.push({
            label: tree.detail_year.substring(0, 4),
            data: [tree],
          });
        } else {
          _trees[idx].data.push(tree);
        }
      }

      this.trees = _trees;
      this.openMaps();
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
    async onChangePolygon(newPath) {
      const kmlGisData = await this.loadKml(
        `https://t4tadmin.kolaborasikproject.com/${newPath}`
      );
      console.log("new kml", kmlGisData);
      this.addMapLayer(kmlGisData, "map-layer-2", "#1F6200", "#97F570");
      const centerCoordinate = turf.center(kmlGisData);
      const mapCenter = centerCoordinate.geometry.coordinates;
      this.$set(this.legends, 1, {
        ...this.legends[1],
        disabled: false,
        show: true,
      });

      //calculate polygon
      if (
        Array.isArray(kmlGisData.features) &&
        kmlGisData.features.length > 0 &&
        kmlGisData.features[0].geometry
      ) {
        const polygonGis = turf.polygon(
          kmlGisData.features[0].geometry.coordinates
        );
        const area = turf.area(polygonGis);

        if (area && !this.data.main_lahan.gis_polygon_area) {
          this.polygonGisArea = parseFloat(area).toFixed(2);
        } else if (area && this.data.main_lahan.gis_polygon_area) {
          this.polygonGisArea = parseFloat(
            this.data.main_lahan.gis_polygon_area
          ).toFixed(2);
        }
      }

      if (this.map && this.map.setCenter instanceof Function) {
        this.map.setCenter(mapCenter);
      }
    },

    async loadKml(url) {
      return new Promise(async (resolve) => {
        const data = await omnivore.kml(url).on("ready", async function () {
          const geoJson = await data.toGeoJSON();
          if (geoJson.features.length > 1) {
            let _coordinates = [];

            for (const _c of geoJson.features) {
              _coordinates.push(_c.geometry.coordinates);
            }

            _coordinates.push(geoJson.features[0].geometry.coordinates);

            let _model = {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [_coordinates],
                  },
                  properties: {
                    name: "Area 1",
                    styleUrl: "#style1",
                    styleHash: "-3bc05740",
                  },
                },
              ],
            };

            return resolve(_model);
          }

          return resolve(geoJson);
        });
      });
    },

    async addMapLayer(data, id, borderColor, fillColor) {
      if (!this.map) return;
      await this.map.addSource(id, {
        type: "geojson",
        data: data,
      });

      if (fillColor) {
        await this.map.addLayer({
          id: id + "-fill",
          type: "fill",
          source: id,
          layout: {
            visibility: "visible",
          },

          mapZoom: 200,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.1,
              0.5,
            ],
          },
        });
      }

      await this.map.addLayer({
        id: id + "-border",
        type: "line",
        source: id,
        layout: {
          visibility: "visible",
        },
        paint: {
          "line-color": borderColor,
          "line-width": 2,
        },
      });
    },

    async openMaps() {
      this.mapOpen = true;
      setTimeout(async () => {
        this.$set(this.maps, "center", [
          parseFloat(this.data.main_lahan.longitude),
          parseFloat(this.data.main_lahan.latitude),
        ]);
        mapboxgl.accessToken = this.$_config.mapBoxApi;
        this.map = await new mapboxgl.Map({
          container: this.$refs.mapContainer,
          style: this.$_config.mapBoxStyle,
          zoom: 17,
          projection: "globe",
          maxZoom: 100,
          preserveDrawingBuffer: true,
        });

        await this.map.dragRotate.disable();

        await this.map.touchZoomRotate.disableRotation();
        await this.map.addControl(new mapboxgl.FullscreenControl());
        await this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on("load", async () => {
          // this.addMapLayer(kmlGisData, "Map-Layer2", "#1F6200", "#97F570");
          if (
            ![null, "-", undefined].includes(
              this.data.main_lahan.polygon_from_ff
            )
          ) {
            const kmlData = await this.loadKml(
              `https://t4tadmin.kolaborasikproject.com/${this.data.main_lahan.polygon_from_ff}`
            );

            if (kmlData.features.length > 0) {
              this.addMapLayer(kmlData, "map-layer-1", "#FF7B7B", null);
              this.$set(this.legends, 0, {
                ...this.legends[0],
                show: true,
              });

              const centerCoordinate = turf.center(kmlData);
              const mapCenter = centerCoordinate.geometry.coordinates;
              if (this.map && this.map.setCenter instanceof Function) {
                this.map.setCenter(mapCenter);
              }
            }
          }

          if (
            ![null, "-", undefined].includes(
              this.data.main_lahan.polygon_from_gis
            )
          ) {
            const kmlData = await this.loadKml(
              `https://t4tadmin.kolaborasikproject.com/${this.data.main_lahan.polygon_from_gis}`
            );
            this.addMapLayer(kmlData, "map-layer-2", "#1F6200", "#97F570");
            this.$set(this.legends, 1, {
              ...this.legends[1],
              show: true,
            });

            const centerCoordinate = turf.center(kmlData);
            const mapCenter = centerCoordinate.geometry.coordinates;
            if (this.map && this.map.setCenter instanceof Function) {
              this.map.setCenter(mapCenter);
            }
          }

          if (Array.isArray(this.data.lahan_polygon)) {
            for (const coord of this.data.lahan_polygon) {
              const marker = new mapboxgl.Marker()
                .setLngLat([
                  parseFloat(coord.longitude),
                  parseFloat(coord.latitude),
                ])
                .addTo(this.map);

              this.markers.push(marker);
            }
            if (
              [undefined, null, "", "-"].includes(
                this.data.main_lahan.polygon_from_gis
              ) &&
              [undefined, null, "", "-"].includes(
                this.data.main_lahan.polygon_from_ff
              )
            ) {
              this.map.setCenter([
                parseFloat(this.data.main_lahan.longitude),
                parseFloat(this.data.main_lahan.latitude),
              ]);
            }
            if (this.data.lahan_polygon.length > 0) {
              this.$set(this.legends, 2, {
                ...this.legends[2],
                show: true,
              });
            }
          }
          console.log("render", this.map.getCanvas().toDataURL("image/png"));

          this.mapReady = true;
        });

        this.map.on("click", (e) => {
          console.log(e);
        });

        this.map.once("render", () => {});
      }, 1000);
    },
  },

  computed: {
    btnLabelLegalitasMOU() {
      let label = "Print";
      if (
        Array.isArray(this.data.farmer_lahan_mou) &&
        this.data.farmer_lahan_mou.length > 0
      ) {
        const find = this.data.farmer_lahan_mou.find(
          (v) => v.mou_no == this.data.main_lahan.farmers_mou_no_pivot_farmer
        );
        if (find) {
          if (!find.mou_status) label = "Preview";
          else if (find.mou_status == 2) label = "Revisi";
          else if (find.mou_status == 3) label = "Print & Upload";
        }
      }

      return label;
    },
  },

  mounted() {
    this.getData();
  },
  data() {
    return {
      formatDate(date, format) {
        return moment(date).format(format);
      },
      loading: false,
      trees: [],
      treesActive: "2024",
      map: null,
      mapReady: false,
      mapOpen: true,
      openGisEdit: false,
      openFcCompleteData: false,
      openUm: false,
      openFc: false,
      polygonGisArea: 0,
      componentKey: 0,
      printModal: 0,
      printAppendixModal: 0,
      polygonImageData: null,
      markers: [],
      verifRole: null,
      legends: [
        {
          id: "map-layer-1",
          label: "FF Polygon",
          show: false,
          shape: "ff",
        },
        {
          id: "map-layer-2",
          label: "GIS Polygon",
          show: false,
          shape: "gis",
        },
        {
          id: "map-coordinate",
          label: "Coordinate",
          show: false,
          shape: "coordinate",
        },
      ],
      maps: {
        accessToken: this.$_config.mapBoxApi,
        mapStyle: this.$_config.mapBoxStyle,
        center: [113.9213, -0.7893],
        zoom: 3,
        geojson: {},
        key: 111,
        layerId: 0,
        hoveredStateId: 0,
        layerStyle: {
          outline: {
            color: "#000000",
          },
          fill: {
            color: "#f06800",
          },
        },
        popup: {
          model: false,
          content: {
            title: "",
            description: "",
          },
        },
      },
      side: [
        {
          name: "Informasi Lahan",
          items: [
            {
              label: "QR Code",
              key: "main_lahan.barcode",
              type: "qrcode",
            },
            {
              label: "No. Lahan",
              key: "main_lahan.lahan_no",
              class: "badge bg-primary",
            },
            {
              label: "No. Dokumen",
              key: "main_lahan.document_no",
              class: "font-weight-300",
            },
            {
              label: "Luas Lahan SPPT",
              key: "main_lahan.land_area",
              class: "font-weight-bold",
              append: "m²",
              transform: "ts",
            },
            {
              label: "Luas Lahan Polygon",
              key: "main_lahan.gis_polygon_area",
              class: "font-weight-bold",
              append: "m²",
              transform: "ts",
              project: "carbon",
            },
            {
              label: "Project",
              key: "project",
            },
          ],
        },
        {
          name: "Petani",
          items: [
            {
              label: "Nama",
              key: "main_lahan.farmers_name",
              class: "fotn-weight-bold",
            },
            {
              label: "Kode",
              key: "main_lahan.farmer_no",
            },
            {
              label: "Nama FF",
              key: "main_lahan.field_facilitators_name",
            },
          ],
        },
        {
          name: "Kondisi Lahan",
          items: [
            {
              label: "Jenis Lahan",
              key: "main_lahan.lahan_type",
            },
            {
              label: "Kondisi Terbaru",
              key: "main_lahan.latest_condition",
            },
            {
              label: "Deskripsi",
              key: "main_lahan.description",
            },
          ],
        },
        {
          name: "Lokasi Lahan",
          items: [
            {
              label: "Management Unit",
              key: "main_lahan.managementunits_name",
            },
            {
              label: "Target Area",
              key: "main_lahan.target_areas_name",
            },
            {
              label: "Koordinat",
              key: "main_lahan.coordinate",
            },
            {
              label: "Desa",
              key: "main_lahan.desas_name",
            },
            {
              label: "Akses Lahan",
              key: "main_lahan.access_to_lahan",
            },
            {
              label: "Akses Sumber Air",
              key: "main_lahan.access_to_water_sources",
            },
            {
              label: "Jarak Lahan",
              key: "main_lahan.jarak_lahan",
            },
          ],
        },
        {
          name: "Informasi Lainnya",
          items: [
            {
              label: "Pestisida",
              key: "main_lahan.pesticide",
            },
            {
              label: "Ketersediaan Air",
              key: "main_lahan.water_availability",
            },
            {
              label: "Pola Tanam",
              key: "main_lahan.opsi_pola_tanam",
            },
          ],
        },
      ],
      mainData: [
        [
          "Ada Habitat Satwa/Kawasan Dilindungi Terdekat",
          "animal_protected_habitat",
          "boolean",
        ],
        [
          "Jarak Ke Habitat Satwa/Kawasan Dilindungi Terdekat",
          "animal_protected_habitat_distance",
          "",
          "",
          "m",
        ],
        ["Koordinat", "coordinate"],
        ["Tanaman Saat Ini", "current_crops"],
        ["Deskripsi", "description"],
        ["Pupuk", "fertilizer"],
        ["Elevation", "elevation"],
        ["Pernah Terjadi Kekeringan", "drought", "boolean"],
        ["Pernah Terjadi Banjir", "floods", "boolean"],
        ["Pernah Terjadi Longsor", "landslide", "boolean"],
        ["Pernah Terjadi Kebakaran", "wildfire", "boolean"],
        ["Akurasi GPS", "gps_accuration"],
        ["Kode Internal", "internal_code"],
        ["Exposure", "exposure"],
        ["Desa Terdekat", "nearby_village", "boolean"],
        ["Jarak ke Desa Terdekat", "nearby_village_distance", "", "", "m"],
        ["Potensi", "potency"],
        ["Jenis Tanah", "soil_type"],
        ["Foto Tanah", "soil_photo", "photo"],
        ["SPPT", "sppt", "photo"],
        ["Tutupan Lahan", "tutupan_lahan", "", "", "%"],
        ["Foto Tutupan Lahan", "tutupan_pohon_photo", "photo"],
        [
          "Tutupan Bangunan / Lainnya",
          "tutupan_lain_bangunan_percentage",
          "",
          "",
          "%",
        ],
        [
          "Foto Tutupan Bangunan / Lainnya",
          "tutupan_lain_bangunan_photo",
          "photo",
        ],

        [
          "Tutupan Tanaman Bawah",
          "tutupan_tanaman_bawah_percentage",
          "",
          "",
          "%",
        ],
        ["Foto Tutupan Tanaman Bawah", "tutupan_tanaman_bawah_photo", "photo"],
      ],
      data: {
        main_lahan: null,
        broken_barcode: [],
        lahan_detail: [],
        lahan_polygon: [],
        lahan_project: [],
        lahan_tutupan: [],
        lahan_tutupan_request: [],
        farmer_lahan_mou: [],
      },
    };
  },
};
</script>
