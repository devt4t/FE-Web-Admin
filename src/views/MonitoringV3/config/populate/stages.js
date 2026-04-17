export const POPULATE_STAGE_REGISTRY = {
    // Populate pertama, dari Realisasi Tanam ke Monitoring 2
    '1-to-2': {
        label: 'Populate To Monitoring 2',
        stageNumber: 1,
        targetMonitoring: 2,
        api: {
            list: 'monitoring-v3/populate/list',
            assignment: 'monitoring-v3/populate/assignment',
            ressetAssignment: 'monitoring-v3/populate/ressetAssignment',
            generateMonitoring: 'monitoring-v3/populate/generateMonitoring',
            delete: 'monitoring-v3/populate/delete',
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
            list: 'monitoring-v3/populate/list',
            assignment: 'monitoring-v3/populate/assignment',
            ressetAssignment: 'monitoring-v3/populate/ressetAssignment',
            generateMonitoring: 'monitoring-v3/populate/generateMonitoring',
            delete: 'monitoring-v3/populate/delete',
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
            list: 'monitoring-v3/populate/list',
            assignment: 'monitoring-v3/populate/assignment',
            ressetAssignment: 'monitoring-v3/populate/ressetAssignment',
            generateMonitoring: 'monitoring-v3/populate/generateMonitoring',
            delete: 'monitoring-v3/populate/delete',
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
            list: 'monitoring-v3/populate/list',
            assignment: 'monitoring-v3/populate/assignment',
            ressetAssignment: 'monitoring-v3/populate/ressetAssignment',
            generateMonitoring: 'monitoring-v3/populate/generateMonitoring',
            delete: 'monitoring-v3/populate/delete',
        },
        features: {
            hasExport: false,
        },
        deletePayloadKeys: ['id', 'is_monitoring', 'monitoring_no'],
    },
}