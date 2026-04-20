export const POPULATE_STAGE_REGISTRY = {
    // Populate pertama, dari Realisasi Tanam ke Monitoring 2
    '1-to-2': {
        label: 'Populate To Monitoring 2',
        stageNumber: 1,
        targetMonitoring: 2,
        api: {
            list: 'populate-monitorings-v3/list',
            assignment: 'populate-monitorings-v3/assignment',
            resetAssignment: 'populate-monitorings-v3/resetAssignment',
            generateMonitoring: 'populate-monitorings-v3/generateMonitoring',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring_no'],
    },
    '2-to-3': {
        label: 'Populate To Monitoring 3',
        stageNumber: 2,
        targetMonitoring: 3,
        api: {
            list: 'populate-monitorings-v3/list',
            assignment: 'populate-monitorings-v3/assignment',
            resetAssignment: 'populate-monitorings-v3/resetAssignment',
            generateMonitoring: 'populate-monitorings-v3/generateMonitoring',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring_no'],
    },
    '3-to-4': {
        label: 'Populate To Monitoring 4',
        stageNumber: 3,
        targetMonitoring: 4,
        api: {
            list: 'populate-monitorings-v3/list',
            assignment: 'populate-monitorings-v3/assignment',
            resetAssignment: 'populate-monitorings-v3/resetAssignment',
            generateMonitoring: 'populate-monitorings-v3/generateMonitoring',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring_no'],
    },
    '4-to-5': {
        label: 'Populate To Monitoring 5',
        stageNumber: 4,
        targetMonitoring: 5,
        api: {
            list: 'populate-monitorings-v3/list',
            assignment: 'populate-monitorings-v3/assignment',
            resetAssignment: 'populate-monitorings-v3/resetAssignment',
            generateMonitoring: 'populate-monitorings-v3/generateMonitoring',
            delete: 'populate-monitorings-v3/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring_no'],
    },
}