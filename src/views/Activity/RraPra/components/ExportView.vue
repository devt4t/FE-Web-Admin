<template>
  <div v-if="raw_data">
    <!-- Header -->
    <div v-if="raw_data.Scooping && raw_data.RRA">
      <h2 style="text-align: center;">{{ stepper == 1 ? 'RRA' : (stepper == 2 ? 'PRA' : 'Flora Fauna Endemik') }}</h2>
      <p style="text-align: center;">Form No: #{{ this.id }}</p>
      <h4>1. Tanggal & Lokasi</h4>
      <table style="width: 100%;">
        <tr>
          <td>Tanggal</td>
          <td colspan="5">
            :
            {{
              this._utils.dateFormat(
                this.raw_data.RRA.rra_pra_date_start,
                "DD MMMM YYYY"
              )
            }}
            {{
              this.raw_data.RRA.rra_pra_date_start != this.raw_data.RRA.rra_pra_date_end
                ? " - " +
                  this._utils.dateFormat(
                    this.raw_data.RRA.rra_pra_date_end,
                    "DD MMMM YYYY"
                  )
                : ""
            }}
          </td>
        </tr>
        <tr>
          <td>Provinsi</td>
          <td colspan="5">: {{ this.raw_data.Scooping.province_name }}</td>
        </tr>
        <tr>
          <td>Kab / Kota</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.Scooping.city_name) }}
          </td>
        </tr>
        <tr>
          <td>Kecamatan</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.Scooping.district_name) }}
          </td>
        </tr>
        <tr>
          <td>Desa</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.Scooping.village_name) }}
          </td>
        </tr>
      </table>
    </div>
    <!-- RRA -->
    <div v-if="stepper == 1 && raw_data.RRA">
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>2. Batas Wilayah</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Arah</th>
            <th>Tipe</th>
            <th>Kabupaten</th>
            <th>Kecamatan</th>
            <th>Desa</th>
          </tr>
          <tr
            v-for="(village_border, village_border_index) in raw_data.RRA.VillageBorder"
            :key="village_border.name"
          >
            <td style="text-align: center;">{{ village_border_index + 1 }}</td>
            <td style="text-align: center;">{{ village_border.point }}</td>
            <td style="text-align: center;">{{ village_border.border_type }}</td>
            <td style="text-align: center;">{{ village_border.kabupaten_no }}</td>
            <td style="text-align: center;">{{ village_border.kode_kecamatan }}</td>
            <td style="text-align: center;">{{ village_border.kode_desa }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>3. Landscape Desa</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <td style="text-align: left;" colspan="2">Luas Desa :</td>
            <td style="text-align: left;" colspan="2">{{ raw_data.Scooping.land_area }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Tanah Sawah :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tanah_sawah }} Ha</td>
            <td style="text-align: left;">Tanah Rawa :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tanah_rawa }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Pemukiman :</td>
            <td style="text-align: left;">{{ raw_data.RRA.pemukiman }} Ha</td>
            <td style="text-align: left;">Pekarangan :</td>
            <td style="text-align: left;">{{ raw_data.RRA.pekarangan }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Tegal / Ladang :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tegal_ladang }} Ha</td>
            <td style="text-align: left;">Daduk / Danau :</td>
            <td style="text-align: left;">{{ raw_data.RRA.waduk_danau }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Tanah Perkebunan Rakyat :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tanah_perkebunan_rakyat }} Ha</td>
            <td style="text-align: left;">Tanah Perkebunan Negara :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tanah_perkebunan_negara }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Tanah Perkebunan Swasta :</td>
            <td style="text-align: left;">{{ raw_data.RRA.tanah_perkebunan_swasta }} Ha</td>
            <td style="text-align: left;">Fasilitas Umum :</td>
            <td style="text-align: left;">{{ raw_data.RRA.fasilitas_umum }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Hutan Lindung :</td>
            <td style="text-align: left;">{{ raw_data.RRA.hutan_lindung }} Ha</td>
            <td style="text-align: left;">Hutan Rakyat :</td>
            <td style="text-align: left;">{{ raw_data.RRA.hutan_rakyat }} Ha</td>
          </tr>
          <tr>
            <td style="text-align: left;">Lahan Menurut Masyarakat :</td>
            <td style="text-align: left;" colspan="3">{{ raw_data.RRA.lahan_menurut_masyarakat }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>4. Pola Pemanfaatan Lahan</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Pola</th>
            <th>Tanaman</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.RRA.LandUse"
            :key="val_index + 'PolaPemanfaatanLahan'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.pattern }}</td>
            <td style="text-align: left;">{{ val.plant }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>5. Kelembagaan Masyarakat</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Lembaga</th>
            <th>Peran</th>
            <th>Deskripsi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.RRA.CommunityInstitution"
            :key="val_index + 'Kelembagaan_Masyarakat'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.institution_name }}</td>
            <td style="text-align: left;">{{ val.role }}</td>
            <td style="text-align: left;">{{ val.description }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>6. Potensi Pertanian Organik</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Petani</th>
            <th>Kategori</th>
            <th>Sumber</th>
            <th>Deskripsi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.RRA.OrganicPotential"
            :key="val_index + 'Potensi_Pertanian'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.name }}</td>
            <td style="text-align: left;">{{ val.potential_category }}</td>
            <td style="text-align: left;">{{ val.source }}</td>
            <td style="text-align: left;">{{ val.description }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>7. Pemasaran Hasil Produksi</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Komoditas</th>
            <th>Kapasitas</th>
            <th>Metode Pemasaran</th>
            <th>Periode</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.RRA.ProductionMarketing"
            :key="val_index + 'Pemasaran_Hasil_Produksi'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.commodity_name }}</td>
            <td style="text-align: left;">{{ val.capacity }} Kg</td>
            <td style="text-align: left;">{{ val.method }}</td>
            <td style="text-align: left;">{{ val.period }}</td>
          </tr>
        </table>
      </div>
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>8. Identifikasi Petani Inovatif</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Petani</th>
            <th>Spesialisasi</th>
            <th>Potensial</th>
            <th>Deskripsi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.RRA.InnovativeFarmer"
            :key="val_index + 'Identifikasi_Petani'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.farmer_name }}</td>
            <td style="text-align: left;">{{ val.specialitation }}</td>
            <td style="text-align: left;">{{ val.potential }}</td>
            <td style="text-align: left;">{{ val.description }}</td>
          </tr>
        </table>
      </div>
      <div class="dusun" style="margin-top: 50px;">
        <h4>9. List Dusun</h4>
        <div
          v-for="(val, val_index) in raw_data.RRA.Dusun"
          :key="val_index + 'Dusun'"
        >
          <h5>{{ val_index+ 1 }}. {{ val.dusun_name }} ({{ val.potential ? '' : 'Tidak' }} Berpotensi)</h5>
          <div v-if="val.potential">
            <table style="width: 100%;border-collapse: collapse;" border="1">
              <!-- General Data -->
              <tr>
                <th style="text-align: center;" colspan="4">General Data : </th>
              </tr>
              <tr>
                <td style="text-align: left;">Luas Dusun ({{ val.data_land_area_source }}) : </td>
                <td style="text-align: left;">{{ val.land_area }} m<sup>2</sup></td>
                <td style="text-align: left;">Luas Lahan Kritis ({{ val.data_dry_land_area_source }}) : </td>
                <td style="text-align: left;">{{ val.land_area }} m<sup>2</sup></td>
              </tr>
              <tr>
                <td style="text-align: left;">Aksesibilitas : </td>
                <td style="text-align: left;">{{ val.accessibility }} m<sup>2</sup></td>
                <td style="text-align: left;">Foto Akses Dusun : </td>
                <td style="text-align: left;">
                  <img
                    height="200"
                    width="200"
                    :src="$store.state.apiUrlImage + val.dusun_access_photo"
                    style="margin: auto;padding: 20px;"
                  />
                </td>
              </tr>
              <!-- PIC Dusun -->
              <tr>
                <th style="text-align: center;" colspan="4">PIC Dusun : </th>
              </tr>
              <tr>
                <td style="text-align: left;">Nama : </td>
                <td style="text-align: left;">{{ val.pic_dusun }}</td>
                <td style="text-align: left;">Jabatan : </td>
                <td style="text-align: left;">{{ val.position }}</td>
              </tr>
              <tr>
                <td style="text-align: left;">No HP : </td>
                <td style="text-align: left;">{{ val.phone }}</td>
                <td style="text-align: left;">Jabatan : </td>
                <td style="text-align: left;">{{ val.whatsapp }}</td>
              </tr>
              <!-- Data Populasi -->
              <tr>
                <th style="text-align: center;" colspan="4">Data Populasi : </th>
              </tr>
              <tr>
                <td style="text-align: left;">Total RW : </td>
                <td style="text-align: left;">{{ val.total_rw }}</td>
                <td style="text-align: left;">Total RT : </td>
                <td style="text-align: left;">{{ val.total_rt }}</td>
              </tr>
              <tr>
                <td style="text-align: left;">Total Laki - Laki : </td>
                <td style="text-align: left;">{{ val.total_male }}</td>
                <td style="text-align: left;">Total Perempuan : </td>
                <td style="text-align: left;">{{ val.total_female }}</td>
              </tr>
              <tr>
                <td style="text-align: left;" colspan="2">Total Keluarga : </td>
                <td style="text-align: left;" colspan="2">{{ val.total_kk }} KK</td>
              </tr>
              <tr v-if="val.has_detail_kk">
                <td style="text-align: left;">Total Keluarga Petani : </td>
                <td style="text-align: left;">{{ val.total_farmer_family }} KK</td>
                <td style="text-align: left;">Total Keluarga Non-Petani : </td>
                <td style="text-align: left;">{{ val.total_non_farmer_family }} KK</td>
              </tr>
              <tr v-if="val.has_avg_member">
                <td style="text-align: left;" colspan="2">Rata - Rata Anggota Keluarga : </td>
                <td style="text-align: left;" colspan="2">{{ val.average_family_member }} orang</td>
              </tr>
              <tr v-if="val.has_detail_avg_member">
                <td style="text-align: left;">Rata - Rata Anggota Keluarga Petani : </td>
                <td style="text-align: left;">{{ val.average_farmer_family_member }} orang</td>
                <td style="text-align: left;">Rata - Rata Anggota Keluarga Non-Petani : </td>
                <td style="text-align: left;">{{ val.average_non_farmer_family_member }} orang</td>
              </tr>
              <!-- Data Edukasi -->
              <tr>
                <th style="text-align: center;" colspan="4">Data Edukasi : </th>
              </tr>
              <tr>
                <td style="text-align: left;" colspan="2">SD - SMP : </td>
                <td style="text-align: left;" colspan="2">{{ val.education_elementary_junior_hs }} orang</td>
              </tr>
              <tr>
                <td style="text-align: left;" colspan="2">SMA : </td>
                <td style="text-align: left;" colspan="2">{{ val.education_senior_hs }} orang</td>
              </tr>
              <tr>
                <td style="text-align: left;" colspan="2">Kuliah : </td>
                <td style="text-align: left;" colspan="2">{{ val.education_college }} orang</td>
              </tr>
              <!-- Produktifitas -->
              <tr>
                <th style="text-align: center;" colspan="4">Produktifitas : </th>
              </tr>
              <tr>
                <td style="text-align: left;">Produktif : </td>
                <td style="text-align: left;">{{ val.age_productive }} orang</td>
                <td style="text-align: left;">Tidak Produktif : </td>
                <td style="text-align: left;">{{ val.age_non_productive }} orang</td>
              </tr>
              <!-- Mata Pencaharian Masyarakat -->
              <tr>
                <th style="text-align: center;" colspan="4">Mata Pencaharian Masyarakat : </th>
              </tr>
              <tr>
                <td style="text-align: left;">Petani : </td>
                <td style="text-align: left;">{{ val.job_farmer }} orang</td>
                <td style="text-align: left;">Buruh Tani : </td>
                <td style="text-align: left;">{{ val.job_farm_workers }} orang</td>
              </tr>
              <tr>
                <td style="text-align: left;">Karyawan Swasta : </td>
                <td style="text-align: left;">{{ val.job_private_employee }} orang</td>
                <td style="text-align: left;">ASN (Guru, TNI, Polri) : </td>
                <td style="text-align: left;">{{ val.job_state_employee }} orang</td>
              </tr>
              <tr>
                <td style="text-align: left;">Wiraswasta : </td>
                <td style="text-align: left;">{{ val.job_enterpreneur }} orang</td>
                <td style="text-align: left;">Profesi Lain : </td>
                <td style="text-align: left;">{{ val.job_others }} orang</td>
              </tr>
            </table>
          </div>
          <div v-else>
            <table style="width: 100%;border-collapse: collapse;" border="1">
              <tr>
                <td style="text-align: left;">Jumlah Keluarga: </td>
                <td style="text-align: left;">{{ val.total_kk }} KK</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- PRA -->
    <div v-if="stepper == 2 && raw_data.PRA">
      <!-- 2. Kepemilikan Lahan -->
      <div style="margin-top: 50px;">
        <h4>2. Kepemilikan Lahan</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Kategori</th>
            <th>Presentase</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.LandOwnership"
            :key="val_index + 'LandOwnership'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.type_ownership }} {{ val.land_ownership ? `, ${val.land_ownership}` : '' }}</td>
            <td style="text-align: left;">{{ val.percentage }}%</td>
          </tr>
        </table>
        <p>Deskripsi Kepemilikan Lahan: {{ raw_data.PRA.land_ownership_description }}</p>
      </div>
      <!-- 3. Penyebaran Lokasi Lahan Kering & Kritis -->
      <div style="margin-top: 50px;">
        <h4>3. Penyebaran Lokasi Lahan Kering & Kritis</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Dusun</th>
            <th>Pola Pemanfaatan Lahan</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.DryLandSpread"
            :key="val_index + 'DryLandSpread'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.dusun_name }}</td>
            <td style="text-align: left;">{{ val.type_utilization }}</td>
          </tr>
        </table>
        <p>Deskripsi Penyebaran Lokasi Lahan Kering & Kritis: {{ raw_data.PRA.distribution_of_critical_land_locations_description }}</p>
      </div>
      <!-- 4. Sumber Air -->
      <div style="margin-top: 50px;">
        <h4>4. Sumber Air</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Sumber Air</th>
            <th>Jenis</th>
            <th>Kondisi</th>
            <th>Pemanfaatan</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.Watersource"
            :key="val_index + 'Watersource'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.watersource_name }}</td>
            <td style="text-align: left;">{{ val.watersource_condition }}</td>
            <td style="text-align: left;">{{ val.consumption }}</td>
            <td style="text-align: left;">{{ val.watersource_utilization }}</td>
          </tr>
        </table>
        <p>Deskripsi Sumber Air: {{ raw_data.PRA.pra_watersource_description }}</p>
      </div>
      <!-- 6. Hasil Ekonomi Pemanfaatan Lahan -->
      <div style="margin-top: 50px;">
        <h4>6. Hasil Ekonomi Pemanfaatan Lahan</h4>
        <p>Sumber: {{ raw_data.PRA.land_utilization_source }}</p>
        <p>Jenis Tanaman: {{ raw_data.PRA.land_utilization_plant_type }}</p>
        <p>Deskripsi Hasil Ekonomi Pemanfaatan Lahan: {{ raw_data.PRA.land_utilization_description }}</p>
      </div>
      <!-- 7. Pupuk Dalam Pemanfaatan Lahan -->
      <div style="margin-top: 50px;">
        <h4>7. Pupuk Dalam Pemanfaatan Lahan</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Pupuk</th>
            <th>Kategori</th>
            <th>Jenis</th>
            <th>Sumber</th>
            <th>Deskripsi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.Fertilizer"
            :key="val_index + 'Fertilizer'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.fertilizer_name }}</td>
            <td style="text-align: left;">{{ val.fertilizer_categories }}</td>
            <td style="text-align: left;">{{ val.fertilizer_type }}</td>
            <td style="text-align: left;">{{ val.fertilizer_source }}</td>
            <td style="text-align: left;">{{ val.fertilizer_description }}</td>
          </tr>
        </table>
      </div>
      <!-- 8. Pestisida Dalam Pemanfaatan Lahan -->
      <div style="margin-top: 50px;">
        <h4>8. Pestisida Dalam Pemanfaatan Lahan</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Pestisida</th>
            <th>Kategori</th>
            <th>Jenis</th>
            <th>Sumber</th>
            <th>Deskripsi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.Pesticide"
            :key="val_index + 'Pesticide'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.pesticide_name }}</td>
            <td style="text-align: left;">{{ val.pesticide_categories }}</td>
            <td style="text-align: left;">{{ val.pesticide_type }}</td>
            <td style="text-align: left;">{{ val.pesticide_source }}</td>
            <td style="text-align: left;">{{ val.pesticide_description }}</td>
          </tr>
        </table>
      </div>
      <!-- 9. Bencana -->
      <div style="margin-top: 50px;">
        <h4>9. Bencana</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Penyebutan Bencana</th>
            <th>Kategori</th>
            <th>Periode</th>
            <th>Korban Jiwa</th>
            <th>Penjelasan</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.DisasterHistory"
            :key="val_index + 'DisasterHistory'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.disaster_name }}</td>
            <td style="text-align: left;">{{ val.disaster_categories }}</td>
            <td style="text-align: left;">{{ val.year }}</td>
            <td style="text-align: left;">{{ val.fatalities }} orang</td>
            <td style="text-align: left;">{{ val.detail }}</td>
          </tr>
        </table>
      </div>
      <!-- 10. Permasalahan Yang Ada -->
      <div style="margin-top: 50px;">
        <h4>10. Permasalahan Yang Ada</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Masalah</th>
            <th>Kategori</th>
            <th>Periode Masalah</th>
            <th>Sumber</th>
            <th>Saran Solusi</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.ExistingProblem"
            :key="val_index + 'ExistingProblem'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.problem_name }}</td>
            <td style="text-align: left;">{{ val.problem_categories }}</td>
            <td style="text-align: left;">{{ val.date }}</td>
            <td style="text-align: left;">{{ val.problem_source }}</td>
            <td style="text-align: left;">{{ val.problem_solution }}</td>
          </tr>
        </table>
        <h5>Matrik Permasalahan</h5>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama Masalah</th>
            <th>Dirasakan Banyak Orang</th>
            <th>Sering Terjadi</th>
            <th>Potensi</th>
            <th>Prioritas</th>
            <th>Total</th>
            <th>Rank</th>
          </tr>
          <tr
            v-for="(val, val_index) in existingProblemSort()"
            :key="val_index + 'ExistingProblem'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.problem_name }}</td>
            <td style="text-align: left;">{{ val.impact_to_people }}</td>
            <td style="text-align: left;">{{ val.interval_problem }}</td>
            <td style="text-align: left;">{{ val.potential }}</td>
            <td style="text-align: left;">{{ val.priority }}</td>
            <td style="text-align: left;">{{ val.total_value }}</td>
            <td style="text-align: left;">{{ val.ranking }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="stepper == 3 && raw_data.PRA">
      <!-- 2. Flora Endemik -->
      <div style="margin-top: 50px;">
        <h4>2. Flora Endemik</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Populasi</th>
            <th>Status</th>
            <th>Kategori</th>
            <th>Sumber Air</th>
            <th>Lokasi Habitat</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.Flora"
            :key="val_index + 'Flora'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.flora_name }}</td>
            <td style="text-align: left;">{{ val.flora_population }}</td>
            <td style="text-align: left;">{{ val.flora_status }}</td>
            <td style="text-align: left;">{{ val.flora_categories }}</td>
            <td style="text-align: left;">{{ val.flora_foodsource }}</td>
            <td style="text-align: left;">{{ val.flora_habitat }}</td>
          </tr>
        </table>
      </div>
      <!-- 3. Fauna Endemik -->
      <div style="margin-top: 50px;">
        <h4>3. Fauna Endemik</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Populasi</th>
            <th>Status</th>
            <th>Kategori</th>
            <th>Sumber Makanan</th>
            <th>Lokasi Habitat</th>
          </tr>
          <tr
            v-for="(val, val_index) in raw_data.PRA.Fauna"
            :key="val_index + 'Fauna'"
          >
            <td style="text-align: center;">{{ val_index + 1 }}</td>
            <td style="text-align: left;">{{ val.fauna_name }}</td>
            <td style="text-align: left;">{{ val.fauna_population }}</td>
            <td style="text-align: left;">{{ val.fauna_status }}</td>
            <td style="text-align: left;">{{ val.fauna_categories }}</td>
            <td style="text-align: left;">{{ val.fauna_foodsource }}</td>
            <td style="text-align: left;">{{ val.fauna_habitat }}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- Footer -->
    <div class="footer" style="margin-top: 100px;">
      <p style="text-align: center">Export Time: {{ Date() }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: "0",
    },
    raw_data: {
      type: Object,
      default: null,
    },
    stepper: {
      type: Number,
      default: 1
    }
  },
  data: () => ({}),

  mounted() {
  },

  methods: {
    existingProblemSort() {
      let EP = this.raw_data.PRA.ExistingProblem 
      if (EP.length > 1) EP = EP.sort((a,b) => {return a.ranking - b.ranking})
      return EP
    }
  },
};
</script>
