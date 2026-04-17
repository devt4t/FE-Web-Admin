export const POPULATE_EXTRA_FIELDS = {
    // Populate 1→2: dari planting, kolom paling sedikit
    '1-to-2': {
        additions: []  // base fields saja cukup
    },

    // Populate 2→3: dari monitoring 2, ada data monitoring sebelumnya
    '2-to-3': {
        additions: [
            {
                afterFieldId: 'monitoring_no',
                fields: [
                    { id: 'previous_total_trees', label: 'Total Pohon Monitoring Sebelumnya', methods: { list: true, detail: true } },
                ]
            }
        ]
    },

    // Populate 3→4: makin banyak context dari monitoring sebelumnya
    '3-to-4': {
        inheritsFrom: '2-to-3',
        additions: [
            {
                afterFieldId: 'previous_total_trees',
                fields: [
                    { id: 'survival_rate', label: 'Tingkat Kelangsungan (%)', methods: { list: true, detail: true } },
                ]
            }
        ]
    },
}
