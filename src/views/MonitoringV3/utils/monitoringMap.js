export const monitoringMap = {
    // A. Kondisi Lahan & Lingkungan
    weed_condition: {
        0: 'Bersih',
        1: 'Cukup Mengganggu',
        2: 'Sangat Mengganggu'
    },
    soil_moisture: {
        0: 'Tanah Lembab Baik',
        1: 'Tanah Agak Kering',
        2: 'Tanah Kering',
        3: 'Tanah Sangat Kering / Pecah & Retak'
    },
    land_use_changes: {
        0: 'Kepemilikan/Dijual',
        1: 'Pembangunan area lahan',
        2: 'Alih fungsi pertanian/perkebunan',
        3: 'Lainnya'
    },

    // B. Perawatan Tanaman
    irrigation_origin: {
        0: 'Tidak Ada',
        1: 'Hujan',
        2: 'Sungai/Mata Air',
        3: 'Pengupayaan Mandiri'
    },
    watering_period: {
        0: 'Tidak Rutin',
        1: 'Rutin',
        2: 'Rutin 2-3x seminggu',
        3: 'Rutin Seminggu Sekali'
    },
    preservation_period: {
        0: 'Tidak Rutin',
        1: 'Rutin',
        2: 'Rutin 2-3x seminggu',
        3: 'Rutin Seminggu Sekali'
    },
    fertilizer_type: {
        0: 'Pupuk Organik',
        1: 'Pupuk Organik Cair',
        2: 'Pupuk Kimia',
        3: 'Keduanya'
    },
    pesticide_type: {
        0: 'Pestisida Organik',
        1: 'Pestisida Kimia',
        2: 'Keduanya'
    },

    // C. Kondisi & Pertumbuhan Tanaman
    total_estimated_tree: {
        0: 'Tidak Ingat',
        1: 'Ingat',
        2: 'Tidak Yakin'
    },
    percentage_of_t4t_live_plants: {
        0: '<25%',
        1: '25%-50%',
        2: '51%-75%',
        3: '100%'
    },
    average_plant_growth: {
        0: 'Pertumbuhan Baik',
        1: 'Pertumbuhan Sedang',
        2: 'Pertumbuhan Mengalami Gangguan',
        3: 'Sebagian Besar Tanaman Mati'
    }
};

// Helper function untuk memformat flag boolean menjadi Ya/Tidak
export const formatYesNo = (val) => {
    if (val === 1 || val === true) return 'Ya';
    if (val === 0 || val === false) return 'Tidak';
    return '-'; // Fallback jika null/undefined
};

// Helper khusus untuk is_verified (karena statusnya spesifik)
export const formatVerified = (val) => {
    if (val === 1) return 'Diverifikasi';
    if (val === 0) return 'Belum Diverifikasi';
    return '-';
};
