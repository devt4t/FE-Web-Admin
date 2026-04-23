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

        // Fields Mapping
        // get fields() {
        //     const clonedFields = JSON.parse(JSON.stringify(baseFields));
        //     const setSafe = (obj, mode, key) => {
        //         if (obj[mode] === true) {
        //             obj[mode] = { view_data: key };
        //         } else if (obj[mode] && typeof obj[mode] === 'object') {
        //             obj[mode].view_data = key;
        //         }
        //     };

        //     return clonedFields.map(f => {
        //         if (this.dataSource === 'external') {
        //             if (f.id === 'nik') setSafe(f.methods, 'list', isFC ? 'nik' : 'ff_no');
        //             if (f.id === 'name') setSafe(f.methods, 'list', isFC ? 'name' : 'users_name');
        //             if (f.id === 'email') setSafe(f.methods, 'list', isFC ? 'email' : 'users_email');
        //         }
        //         return f;
        //     });
        // },

        // Delete Dinamis
        get delete() {
            let flag = this.dataSource === 'external' ? 'true' : 'false'
            let py = store.state.tmpProgramYear
            return `monitoring-officer-v3/${moduleType}/delete?is_external=${flag}&program_year=${py}`
        },

        get deleteKey() {
            if (isFC) {
                return this.dataSource === 'external' ? 'nik' : 'employee_no';
            }
            return 'ff_no';
            // return 'id'
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
            // if (isFC) return this.dataSource === 'external' ? 'nik' : 'employee_no';
            // return 'ff_no';
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
