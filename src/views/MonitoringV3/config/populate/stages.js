export const POPULATE_STAGE_REGISTRY = {
    // Populate pertama, dari Realisasi Tanam ke Monitoring 2
    '1-to-2': {
        label: 'Populate 1 To Monitoring 2',
        stageNumber: 1,
        targetMonitoring: 2,
        api: {
            list: 'populate-monitorings-v3/list',
            detail: 'populate-monitorings-v3/detail',
            assignment: 'populate-monitorings-v3/update',
            resetAssignment: 'populate-monitorings-v3/update',
            generateMonitoring: 'monitorings-v3/generate',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring2_no'],
    },
    '2-to-3': {
        label: 'Populate 2 To Monitoring 3',
        stageNumber: 2,
        targetMonitoring: 3,
        api: {
            list: 'populate-monitorings-v3/list',
            detail: 'populate-monitorings-v3/detail',
            assignment: 'populate-monitorings-v3/update',
            resetAssignment: 'populate-monitorings-v3/update',
            generateMonitoring: 'monitorings-v3/generate',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring3_no'],
    },
    '3-to-4': {
        label: 'Populate 3 To Monitoring 4',
        stageNumber: 3,
        targetMonitoring: 4,
        api: {
            list: 'populate-monitorings-v3/list',
            detail: 'populate-monitorings-v3/detail',
            assignment: 'populate-monitorings-v3/update',
            resetAssignment: 'populate-monitorings-v3/update',
            generateMonitoring: 'monitorings-v3/generate',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring4_no'],
    },
    '4-to-5': {
        label: 'Populate 4 To Monitoring 5',
        stageNumber: 4,
        targetMonitoring: 5,
        api: {
            list: 'populate-monitorings-v3/list',
            detail: 'populate-monitorings-v3/detail',
            assignment: 'populate-monitorings-v3/update',
            resetAssignment: 'populate-monitorings-v3/update',
            generateMonitoring: 'monitorings-v3/generate',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring5_no'],
    },
    '5-to-6': {
        label: 'Populate 5 To Monitoring 6',
        stageNumber: 5,
        targetMonitoring: 6,
        api: {
            list: 'populate-monitorings-v3/list',
            detail: 'populate-monitorings-v3/detail',
            assignment: 'populate-monitorings-v3/update',
            resetAssignment: 'populate-monitorings-v3/update',
            generateMonitoring: 'monitorings-v3/generate',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring6_no'],
    },
}
