<template>
  <geko-base-crud
    :config="config"
    :hideDetail="true"
    :hideUpdate="true"
    :hideDelete="true"
    :hideCreate="true"
  >
    <template v-slot:list-photos="{ item }">
      <div class="d-flex flex-row lahan-photo" style="min-width: 400px">
        <v-img
          v-if="item.photo1"
          :src="$_config.baseUrlUpload + '/' + item.photo1"
          alt="Foto Lahan 1"
          :width="100"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo1)"
          class="lahan-photo-img"
        >
          <template v-slot:placeholder>
            <div class="lahan-photo-placeholder">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="20"
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        <v-img
          v-if="item.photo2"
          :src="$_config.baseUrlUpload + '/' + item.photo2"
          alt="Foto Lahan 2"
          :width="100"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo2)"
          class="lahan-photo-img"
        >
          <template v-slot:placeholder>
            <div class="lahan-photo-placeholder">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="20"
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        <v-img
          v-if="item.photo3"
          :src="$_config.baseUrlUpload + '/' + item.photo3"
          alt="Foto Lahan 3"
          :width="100"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo3)"
          class="lahan-photo-img"
        >
          <template v-slot:placeholder>
            <div class="lahan-photo-placeholder">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="20"
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        <v-img
          v-if="item.photo4"
          :src="$_config.baseUrlUpload + '/' + item.photo4"
          alt="Foto Lahan 4"
          :width="100"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo4)"
          class="lahan-photo-img"
        >
          <template v-slot:placeholder>
            <div class="lahan-photo-placeholder">
              <v-progress-circular
                color="primary"
                indeterminate
                :size="20"
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        <!-- <img
          v-if="item.photo1"
          :src="$_config.baseUrlUpload + '/' + item.photo1"
          alt="Foto Lahan 1"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo1)"
        />
        <img
          v-if="item.photo2"
          :src="$_config.baseUrlUpload + '/' + item.photo2"
          alt="Foto Lahan 2"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo2)"
        />
        <img
          v-if="item.photo3"
          :src="$_config.baseUrlUpload + '/' + item.photo3"
          alt="Foto Lahan 3"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo3)"
        />
        <img
          v-if="item.photo4"
          :src="$_config.baseUrlUpload + '/' + item.photo4"
          alt="Foto Lahan 4"
          @click="showLightbox($_config.baseUrlUpload + '/' + item.photo4)"
        /> -->
      </div>
    </template>

    <template v-slot:list-gis_polygon_area="{ item }">
      <span class="d-block min-w-100px" style="text-align: right"
        >{{ item.gis_polygon_area | parse("ts") }} m2</span
      >
    </template>
    <template v-slot:list-gis_planting_area="{ item }">
      <span class="d-block min-w-100px" style="text-align: right"
        >{{ item.gis_planting_area | parse("ts") }} m2</span
      >
    </template>

    <template v-slot:list-location="{ item }">
      <v-btn variant="primary" @click="onOpenMaps(item)">
        Open in Google Map
      </v-btn>
    </template>

    <template v-slot:list-coordinate="{ item }">
      <span class="d-block text-gray"> Latitude </span>
      <span class="d-block font-weight-bold">{{ item.latitude }}</span>
      <span class="d-block text-gray"> Longitude </span>
      <span class="d-block font-weight-bold">{{ item.longitude }}</span>
    </template>
  </geko-base-crud>
</template>

<script>
export default {
  name: "crud-lahan-2",
  watch: {},
  data() {
    return {
      config: {
        title: "Lahan",
        model_api: null,
        getter: "lahan-2",
        setter: "lahan-2",
        update: "lahan-2",
        delete: "lahan-2",
        deleteKey: "code",
        pk_field: null,
        permission: {
          create: "lahan-2-create",
          read: "lahan-2-list",
          update: "lahan-2-update",
          detail: "lahan-2-detail",
          lookup: "lahan-2-lookup",
          delete: "lahan-2-delete",
        },
        slave: [],
        fields: [
          {
            id: "lahan_no",
            label: "Kode Lahan",
            methods: {
              list: true,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "farmer_name",
            label: "Nama Petani",
            methods: {
              list: true,
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },
          {
            id: "gis_polygon_area",
            label: "Luas Lahan Polygon (m2)",
            methods: {
              list: {
                type: "row-slot",
              },
              detail: false,
              create: false,
              update: false,
              filter: false,
            },
          },
          //   {
          //     id: "gis_planting_area",
          //     label: "Luas Tanam (m2)",
          //     methods: {
          //       list: {
          //         type: "row-slot",
          //       },
          //       detail: false,
          //       create: false,
          //       update: false,
          //       filter: false,
          //     },
          //   },

          {
            id: "photos",
            label: "Foto Lahan ",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          {
            id: "coordinate",
            label: "Koordinat",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
          {
            id: "location",
            label: "Lokasi",
            methods: {
              list: {
                type: "row-slot",
              },
            },
          },
        ],
      },
    };
  },

  methods: {
    onOpenMaps(item) {
      window.open(
        `https://maps.google.com/maps?q=${item.latitude},${item.longitude}`,
        "_blank"
      );
    },

    showLightbox(imgs, index) {
      if (imgs) this.$store.state.lightbox.imgs = imgs;

      if (index) this.$store.state.lightbox.index = index;
      else this.$store.state.lightbox.index = 0;

      this.$store.state.lightbox.show = true;
    },
  },
};
</script>

<style>
.lahan-photo-img {
  width: 100px;
  height: auto;
  margin-right: 5px;
  border-radius: 8px;
  position: relative;
  bottom: 0;
  box-shadow: rgba(100, 100, 111, 0) 0px 7px 29px 0px;
  transition: all 0.2s ease;
}

.lahan-photo-img:hover {
  cursor: pointer;
  bottom: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  transition: all 0.2s ease;
}

.lahan-photo-placeholder {
  width: 100px;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.text-gray {
  color: gray;
}
</style>
