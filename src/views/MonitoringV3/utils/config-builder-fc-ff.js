import { reactive } from "vue"
import store from "@/store"

export function buildCrudConfigFCFF(baseFields, moduleType, permissions) {
    const isFC = moduleType === 'fc';
    const label = isFC ? 'Field Coordinator' : 'Field Facilitator'

    return reactive({
        dataSource: 'external',
        title: label + ' Monitoring V3',

        get primaryKey() {
            return 'id';
        },

        // Getter Dinamis: External and Internal 
        // kirim payload is_monitoring=true/false
        get getter() {
            let flag = this.dataSource === 'external' ? 'true' : 'false'
            return `monitoring-officer-v3/${moduleType}/list?is_external=${flag}`
        },

        get getterDataKey() {
            return 'data'
        },

        // setter Dinamis
        get setter() {
            return isFC ? 'AddEmployee' : 'AddFieldFacilitator'
        },

        // Delete Dinamis
        get delete() {
            let flag = this.dataSource === 'external' ? 'true' : 'false'
            let py = store.state.tmpProgramYear
            return `monitoring-officer-v3/${moduleType}/delete?is_external=${flag}&program_year=${py}`
        },

        get deleteKey() {
            return isFC ? 'nik' : 'ff_no';
        },

        get deleteLabel() {
            return isFC ? 'employee_no' : 'ff_no';
        },

        // detail dinamis
        get detail() {
            let flag = this.dataSource === 'external' ? 'true' : 'false'
            let py = store.state.tmpProgramYear
            return `monitoring-officer-v3/${moduleType}/detail?is_external=${flag}&program_year=${py}`
        },

        get detailIdKey() {
            return 'id'
        },

        get detailApiIdKey() {
            return 'id'
        },

        // Key untuk EXTRACT data dari response detail (response.data)
        get detailKey() {
            return 'data';
        },

        globalFilter: {
            program_year: { setter: 'program_year' },
        },
        permission: permissions,
        fields: baseFields,
    })
}
