import { reactive } from "vue";

function resolveInheritance(stageKey, extraFieldsMap) {
    const extras = extraFieldsMap[stageKey]
    if (!extras) return []

    let allAdditions = []

    if (extras.additions && extras.additions.length > 0) {
        allAdditions = [...allAdditions, ...extras.additions]
    }

    return allAdditions
}

function mergeFields(baseFields, additions) {
    let fields = JSON.parse(JSON.stringify(baseFields))
    for (const addition of additions) {
        const { afterFieldId, fields: newFields } = addition
        if (!afterFieldId) {
            fields.push(...newFields)
            continue
        }
        const targetIndex = fields.findIndex(f => f.id === afterFieldId)
        if (targetIndex !== -1) {
            fields.splice(targetIndex + 1, 0, ...newFields)
        } else {
            console.warn(`[buildCrudConfig] afterFieldId "${afterFieldId}" not found, appending to end`)
            fields.push(...newFields)
        }
    }
    return fields
}

export function baseCrudConfigPopulate(baseFields, extraFieldsMap, stageKey, stageConfig) {
    // Resolve semua additions (termasuk dari parent stages)
    const allAdditions = resolveInheritance(stageKey, extraFieldsMap)

    // merge base fields + additions
    const mergedFields = mergeFields(baseFields, allAdditions)

    // build final config project
    return reactive({
        title: stageConfig.label,
        getter: `${stageConfig.api.list}`,
        getterDataKey: 'data',
        totalDataKey: 'total',
        detail: stageConfig.api.detail,
        detailIdKey: 'id',
        detailKey: '',
        pk_field: null,
        globalFilter: {
            program_year: { setter: 'program_year' },
        },
        permission: {
            create: 'monitoring-v3-create',
            read: 'monitoring-v3-list',
            update: 'monitoring-v3-update',
            detail: 'monitoring-v3-detail',
            lookup: 'monitoring-v3-lookup',
            delete: 'monitoring-v3-delete',
        },
        slave: [],
        fields: mergedFields,
        treeDetailHeaders: stageConfig.treeDetailHeaders || null
    })
}