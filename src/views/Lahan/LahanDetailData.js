import moment from 'moment'

export default {
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
    openFcNonCarbon: false,
    openUm: false,
    openFc: false,
    polygonGisArea: 0,
    componentKey: 0,
    printModal: 0,
    printAppendixModal: 0,
    polygonImageData: null,
    mouData: null,
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
        id: "map-layer-3",
        label: "Tutupan Lahan",
        show: false,
        shape: "cover",
      },
      {
        id: "map-coordinate",
        label: "Coordinate",
        show: false,
        shape: "coordinate",
      },
    ],
    maps: {
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
    sideTop: [

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
            label: "Luas Polygon Lahan",
            key: "main_lahan.gis_polygon_area",
            class: "font-weight-bold",
            append: "m²",
            transform: "ts",
            project: "carbon",
          },
          {
            label: "Luas Polygon Tutupan Lahan",
            key: "main_lahan.polygon_tutupan_area",
            class: "font-weight-bold",
            append: "m²",
            transform: "ts",
            project: "carbon",
          },
          
          {
            label: "Luas Area Tanam",
            key: "main_lahan.gis_planting_area",
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
    ],
    side: [
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
      ["Tutupan Pohon", "tutupan_pohon_percentage", "", "", "%"],
      ["Foto Tutupan Pohon", "tutupan_pohon_photo", "photo"],
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