const SHARED_TREE_DETAIL_HEADERS = [
    { text: 'No', value: 'index', sortable: false },
    { text: 'Nomor Pohon', value: 'tree_no' },
    { text: 'Kode Pohon', value: 'tree_code' },
    { text: 'Nama Pohon', value: 'tree_name' },
    { text: 'Umur Pohon', value: 'tree_age' },
    { text: 'Kondisi Sekitar', value: 'tree_condition' },
    { text: 'Tinggi (cm)', value: 'height' },
    { text: 'Diameter (cm)', value: 'diameter' },
    { text: 'Status Hidup', value: 'life_status' },
    { text: 'Pupuk', value: 'pest' },
    { text: 'Deskripsi Pupuk', value: 'pest_description' },
]

const SHARED_MONITORING_TREE_DETAIL_HEADERS = [
    { text: 'No', value: 'index', sortable: false },
    { text: 'Kode Pohon', value: 'tree_code' },
    { text: 'Nama Pohon', value: 'tree_name' },
    { text: 'Kategori Pohon', value: 'tree_category' },
    { text: 'Jumlah Hidup', value: 'life' },
]

const SHARED_PEST_DISEASE_HEADERS = [
    { text: 'No', value: 'index', sortable: false, width: '50px' },
    { text: 'Tipe', value: 'pest_disease_type', width: '100px' },
    { text: 'Nama', value: 'pest_disease_name' },
    { text: 'Deskripsi', value: 'pest_disease_description' },
    { text: 'Est. Mati', value: 'plant_dead_estimation', width: '100px' },
    { text: 'Pohon Mati', value: 'tree_dead', width: '100px' },
]

const SHARED_DISASTER_HEADERS = [
    { text: 'No', value: 'index', sortable: false, width: '50px' },
    { text: 'Tipe', value: 'disaster_type', width: '150px' },
    { text: 'Nama', value: 'disaster_name' },
    { text: 'Tahun', value: 'disaster_year', width: '80px' },
    { text: 'Deskripsi', value: 'disaster_description' },
    { text: 'Dampak', value: 'disaster_impact' },
    { text: 'Est. Mati', value: 'plant_dead_estimation', width: '100px' },
]

const SHARED_HARVEST_HEADERS = [
    { text: 'No', value: 'index', sortable: false, width: '50px' },
    { text: 'Jenis Panen', value: 'harvest_type' },
    { text: 'Kode Pohon', value: 'tree_code', width: '120px' },
    { text: 'Intensitas', value: 'harvest_intensity', width: '150px' },
]

const SHARED_COMPLAIN_HEADERS = [
    { text: 'No', value: 'index', sortable: false, width: '50px' },
    { text: 'Tipe', value: 'complain_type', width: '150px' },
    { text: 'Keluhan', value: 'complain_name' },
    { text: 'Deskripsi', value: 'complain_description' },
]

const SHARED_PLANT_COMPANION_HEADERS = [
    { text: 'No', value: 'index', sortable: false, width: '50px' },
    { text: 'Tipe', value: 'plant_type', width: '150px' },
    { text: 'Nama Tanaman', value: 'plant_name' },
]

const SHARED_TABLE_HEADERS = {
    treeDetailHeaders: SHARED_TREE_DETAIL_HEADERS,
    monitoringTreeDetail: SHARED_MONITORING_TREE_DETAIL_HEADERS,
    pestDiseaseHeaders: SHARED_PEST_DISEASE_HEADERS,
    disasterHeaders: SHARED_DISASTER_HEADERS,
    complainHeaders: SHARED_COMPLAIN_HEADERS,
    harvestHeaders: SHARED_HARVEST_HEADERS,
    plantCompanionHeaders: SHARED_PLANT_COMPANION_HEADERS,
}

const SHARED_API = {
    list: 'monitorings-v3/list/web',
    detail: 'monitorings-v3/detail',
    verifFC: 'monitorings-v3/update/main',
    verifUM: 'monitorings-v3/update/main',
    unverif: 'monitorings-v3/update/main',
    delete: 'monitorings-v3/delete',
    export: 'monitorings-v3/export',
}

function buildStage(stageNumber) {
    const isLastStage = stageNumber === 5
    const key = `monitoring${stageNumber}_no`

    return {
        label: `Monitoring ${stageNumber}`,
        stageNumber,
        key,
        api: SHARED_API,
        deletePayloadKeys: [key],
        features: {
            hasExportSummary: true,
            hasGeneratePopulate: !isLastStage,
            hasPrintLabel: true,
        },
        populate: isLastStage ? null : {
            targetStage: stageNumber + 1,
            endpoint: 'populate-monitorings-v3/create',
        },
        ...SHARED_TABLE_HEADERS,
    }
}

export const MONITORING_STAGES_REGISTRY = {
    2: buildStage(2),
    3: buildStage(3),
    4: buildStage(4),
    5: buildStage(5),
}
