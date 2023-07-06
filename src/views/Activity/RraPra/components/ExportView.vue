<template>
  <div v-if="raw_data">
    <div v-if="stepper == 1">
      <h2 style="text-align: center;">RRA</h2>
      <p style="text-align: center;">Form No: #{{ this.id }}</p>
      <h4>1. Tanggal & Lokasi</h4>
      <table id="tableForExport-RRA" style="width: 100%;">
        <tr>
          <td>Tanggal</td>
          <td colspan="5">
            :
            {{
              this._utils.dateFormat(
                this.raw_data.start_scooping_date,
                "DD MMMM YYYY"
              )
            }}
            {{
              this.raw_data.start_scooping_date != this.raw_data.end_scooping_date
                ? " - " +
                  this._utils.dateFormat(
                    this.raw_data.end_scooping_date,
                    "DD MMMM YYYY"
                  )
                : ""
            }}
          </td>
        </tr>
        <tr>
          <td>Provinsi</td>
          <td colspan="5">: {{ this.raw_data.province_name }}</td>
        </tr>
        <tr>
          <td>Kab / Kota</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.city_name) }}
          </td>
        </tr>
        <tr>
          <td>Kecamatan</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.district_name) }}
          </td>
        </tr>
        <tr>
          <td>Desa</td>
          <td colspan="5">
            : {{ _utils.capitalizeLetter(this.raw_data.village_name) }}
          </td>
        </tr>
      </table>
  
      <table style="width: 100%;border-collapse: collapse;" border="1">
        <tr>
          <td style="margin: auto;padding: 10px;"><h4>2. Data Desa</h4></td>
          <td>
            <table style="width: 100%;border-collapse: collapse;" border="1">
              <tr>
                <td>Luas Desa</td>
                <td colspan="5">: {{ this.raw_data.land_area }} Ha</td>
              </tr>
              <tr>
                <td>Aksesibilitas</td>
                <td colspan="5">: {{ this.raw_data.accessibility }}</td>
              </tr>
              <tr>
                <td>Sumber Air</td>
                <td colspan="5">: {{ this.raw_data.water_source }}</td>
              </tr>
              <tr>
                <td>Sumber Listrik</td>
                <td colspan="5">: {{ this.raw_data.electricity_source }}</td>
              </tr>
              <tr>
                <td>Tempat Pemerintahan</td>
                <td colspan="5">: {{ this.raw_data.goverment_place }}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="margin: auto;padding: 10px;"><h4>3. Data Populasi</h4></td>
          <td>
            <table style="width: 100%;border-collapse: collapse;" border="1">
              <tr>
                <td>Total Keluarga</td>
                <td colspan="5">: {{ this.raw_data.total_kk }} KK</td>
              </tr>
              <tr>
                <td>Total Laki - Laki</td>
                <td colspan="5">: {{ this.raw_data.total_male }} orang</td>
              </tr>
              <tr>
                <td>Total Perempuan</td>
                <td colspan="5">: {{ this.raw_data.total_female }} orang</td>
              </tr>
              <tr>
                <td>Total Dusun</td>
                <td colspan="5">: {{ this.raw_data.total_dusun }} dusun</td>
              </tr>
              <tr>
                <td>Total Dusun Yang Berpotensi</td>
                <td colspan="5">: {{ this.raw_data.potential_dusun }} dusun</td>
              </tr>
              <tr>
                <td>Deskripsi Potensi Dusun</td>
                <td colspan="5">
                  :
                  <div v-html="this.raw_data.potential_description"></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="margin: auto;padding: 10px;">
            <h4>4. Kelengkapan Data Lahan Kering</h4>
          </td>
          <td>
            <table style="width: 100%;border-collapse: collapse;" border="1">
              <tr>
                <td>Luas Lahan Kering</td>
                <td colspan="5">: {{ this.raw_data.dry_land_area }} Ha</td>
              </tr>
              <tr>
                <td>Jenis Tanah</td>
                <td colspan="5">: {{ this.raw_data.land_type }}</td>
              </tr>
              <tr>
                <td>Ketinggian Tanah (mdpl)</td>
                <td colspan="5">: {{ this.raw_data.land_height }}</td>
              </tr>
              <tr>
                <td>Kelerengan Tanah (<sup>o</sup>)</td>
                <td colspan="5">: {{ this.raw_data.land_slope }}</td>
              </tr>
              <tr>
                <td>Kerapatan Vegetasi</td>
                <td colspan="5">: {{ this.raw_data.vegetation_density }}</td>
              </tr>
              <tr>
                <td>Pola Tanam Lahan Kering</td>
                <td colspan="5">: {{ this.raw_data.agroforestry_type }}</td>
              </tr>
              <tr>
                <td>Curah Hujan (mm)</td>
                <td colspan="5">: {{ this.raw_data.rainfall }}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
  
      <div class="tokoh-desa" style="margin-top: 50px;">
        <h4>5. Tokoh Desa</h4>
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>No HP</th>
            <th>Whatsapp</th>
          </tr>
          <tr
            v-for="(tokoh, tokohIndex) in this.raw_data.scooping_figures"
            :key="tokoh.name"
          >
            <td style="text-align: center;">{{ tokohIndex + 1 }}</td>
            <td style="text-align: center;">{{ tokoh.name }}</td>
            <td style="text-align: center;">{{ tokoh.position }}</td>
            <td style="text-align: center;">{{ tokoh.phone }}</td>
            <td style="text-align: center;">{{ tokoh.whatsapp }}</td>
          </tr>
        </table>
      </div>
      <br />
      <br />
  
      <div class="image-data" style="margin-top: 60px;">
        <table style="width: 100%;border-collapse: collapse;" border="1">
          <tr>
            <td style="margin: auto;padding: 10px;">
              <h4>6. Gallery - Akses Jalan</h4>
            </td>
            <td>
              <table>
                <tr
                  v-for="(imageExp, imageExpIndex) in this.raw_data
                    .photo_road_access"
                  :key="imageExp"
                >
                  <td>
                    <img
                      height="350"
                      width="350"
                      :src="imageExp"
                      style="margin: auto;padding: 20px;"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="margin: auto;padding: 10px;">
              <h4>7. Gallery - Pertemuan</h4>
            </td>
            <td>
              <table>
                <tr
                  v-for="(imageExp, imageExpIndex) in this.raw_data
                    .photo_road_access"
                  :key="imageExp"
                >
                  <td>
                    <img
                      height="350"
                      width="350"
                      :src="imageExp"
                      style="margin: auto;padding: 20px;"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="margin: auto;padding: 10px;">
              <h4>8. Gallery - Lahan Kering</h4>
            </td>
            <td>
              <table>
                <tr
                  v-for="(imageExp, imageExpIndex) in this.raw_data
                    .photo_dry_land"
                  :key="imageExp"
                >
                  <td>
                    <img
                      height="350"
                      width="350"
                      :src="imageExp"
                      style="margin: auto;padding: 20px;"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="margin: auto;padding: 10px;">
              <h4>9. Gallery - Profil Desa</h4>
            </td>
            <td>
              <table>
                <tr>
                  <td>
                    <img
                      height="350"
                      width="350"
                      :src="this.raw_data.village_profile"
                      style="margin: auto;padding: 20px;"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
  
      <div class="footer" style="margin-top: 100px;">
        <p style="text-align: center">Export Time: {{ Date() }}</p>
      </div>
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

  mounted() {},

  methods: {},
};
</script>
