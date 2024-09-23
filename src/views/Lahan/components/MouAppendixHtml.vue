<template>
  <div style="border-right: 1px solid transparent" v-if="data">
    <section class="pdf-item" style="padding: 2em">
      <h3
        class="text-center text-black font-weight-bold text-1-em"
        style="margin-bottom: 2em"
      >
        Appendix Lahan<br />MOU {{ data.mou_no }}
      </h3>

      <div
        class="wrapper"
        style="
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          height: 35em;
        "
      >
        <!-- <img
          :src="data.polygon_image"
          style="width: 65%; height: 35em"
          :style="{ 'background-image': `url(${data.polygon_image})` }"
        /> -->

        <div
          :style="{
            'background-image': `url(${data.polygon_image})`,
            width: '65%',
            height: '100%',
            'background-size': 'cover',
            'background-position': 'center',
            'border-radius': '1em',
          }"
        ></div>

        <div
          style="
            width: 35%;
            margin-left: 2em;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100%;
            border: 1px solid rgba(128, 128, 128, 0.2);
          "
        >
          <div style="width: 100%; padding: 1.5em">
            <h3>Identitas Petani</h3>
            <table class="farmer">
              <tr>
                <td>Nama</td>
                <td>{{ data.farmer_name }} | {{ data.farmer_no }}</td>
              </tr>
              <tr>
                <td>Luas</td>
                <td>
                  {{ data.gis_polygon_area | parse("ts") }} m&sup2; (Luas Tanam
                  : {{ data.gis_planting_area | parse("ts") }} m&sup2;)
                </td>
              </tr>
              <tr>
                <td>Model</td>
                <td>{{ data.project_model }}</td>
              </tr>
            </table>
            <h3 style="margin-top: 1em">Jenis &amp; Jumlah Pohon</h3>
            <table class="tree">
              <tr
                v-for="(tree, i) in Array.isArray(data.trees) ? data.trees : []"
              >
                <td>{{ tree.trees_tree_name }}</td>
                <td>{{ tree.amount | parse("ts") }} pohon</td>
              </tr>
            </table>
          </div>

          <div
            style="
              width: 100%;
              background-color: #f8f8f8;
              display: flex;
              flex-direction: row;
              align-items: center;
            "
          >
            <img src="/images/tft_logo.png" style="width: 20%" />
            <div style="padding-inline: 1em">
              <p style="margin-bottom: 0.1em">Sumber Data :</p>
              <p style="margin-bottom: 0; font-size: 0.9em">
                - Google Earth Satellite
              </p>
              <p style="margin-bottom: 0; font-size: 0.9em">
                - Survey Pengukuran Lahan 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <div class="html2pdf__page-break"></div> -->
  </div>
</template>

<script>
import moment from "moment";
import VueQRCodeComponent from "vue-qrcode-component";

moment.locale("id");
export default {
  name: "mou-html",
  components: {
    "qr-code": VueQRCodeComponent,
  },
  props: {
    data: {
      required: false,
      default: () => {},
    },
  },

  methods: {},
  data() {
    return {
      formatDate(format) {
        return moment().format(format);
      },
    };
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-col {
  flex-direction: column;
}

.font-weight-bold {
  font-weight: bold;
}

table.farmer,
table.tree {
  width: 88%;
  border-collapse: collapse;
  margin-top: 0.5em;
}

table.farmer tr td,
table.tree tr td {
  padding: 0.5em;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

table.farmer tr td:first-child {
  width: 30%;
}
table.farmer tr td:last-child::before {
  content: ": ";
}

table.tree tr td {
  width: 50%;
}

table.tree tr td:last-child::before {
  content: ": ";
}
</style>
