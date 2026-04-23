// config/index.js
import { buildCrudConfigMonitoring } from '../utils/config-builder-monitoring'
import { baseCrudConfigPopulate } from '../utils/config-builder-populate'
import { buildCrudConfigFCFF } from '../utils/config-builder-fc-ff'

// Populate imports
import { POPULATE_STAGE_REGISTRY } from './populate/stages'
import { POPULATE_BASE_FIELDS } from './populate/fields.base'
import { POPULATE_EXTRA_FIELDS } from './populate/fields.per-stage'

// Monitoring imports
import { MONITORING_STAGES_REGISTRY } from './monitoring/stages'
import { MONITORING_BASE_FIELDS } from './monitoring/fields.base'
import { MONITORING_EXTRA_FIELDS } from './monitoring/fields.per-stage'

// Helper untuk populate
export function buildPopulateCrudConfig(stageKey) {
    const stageConfig = POPULATE_STAGE_REGISTRY[stageKey]
    return baseCrudConfigPopulate(POPULATE_BASE_FIELDS, POPULATE_EXTRA_FIELDS, stageKey, stageConfig)
}

// Helper untuk monitoring
export function buildMonitoringCrudConfig(stageNumber) {
    const stageConfig = MONITORING_STAGES_REGISTRY[stageNumber]
    return buildCrudConfigMonitoring(MONITORING_BASE_FIELDS, MONITORING_EXTRA_FIELDS, stageNumber, stageConfig)
}

// Helper untuk FC monitoring
export function buildFCMonitoringConfig(baseFields) {
    const permissionFC = {
        create: 'ff-monitoring-v3-create',
        read: 'ff-monitoring-v3-list',
        update: 'ff-monitoring-v3-update',
        detail: 'ff-monitoring-v3-detail',
        lookup: 'ff-monitoring-v3-lookup',
        delete: 'ff-monitoring-v3-delete',
    }
    return buildCrudConfigFCFF(baseFields, 'fc', permissionFC)
}

// Helper untuk FF monitoring
export function buildFFMonitoringConfig(baseFields) {
    const permissionFF = {
        create: 'monitoring-create',
        read: 'monitoring-list',
        update: 'monitoring-update',
        detail: 'monitoring-detail',
        lookup: 'monitoring-lookup',
        delete: 'monitoring-delete',
    }
    return buildCrudConfigFCFF(baseFields, 'ff', permissionFF)
}

// Re-export registries
export { POPULATE_STAGE_REGISTRY }
export { MONITORING_STAGES_REGISTRY }
