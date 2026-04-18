import { reactive } from "vue"

export function buildCrudConfigFCFF(baseFields, moduleType) {
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

        // Delete Dinamis
        get delete() {
            let flag = this.dataSource === 'external' ? 'true' : 'false'
            return `monitoring-officer-v3/${moduleType}/delete?is_external=${flag}`
        },

        get deleteKey() {
            return isFC ? 'nik' : 'ff_no'
        },


        // setter Dinamis
        get setter() {
            return `AddEmployee`
        },

        // Filter API
        // get filter_api() {
        //     const base = isFC ? { position_no: 19 } : {};
        //     return base;
        // },
        // get filter_api() {
        //     const base = isFC ? { position_no: 19 } : {};
        //     return {
        //         ...base,
        //         is_external: this.dataSource === 'external'
        //     };
        // },

        // Fields Mapping
        get fields() {
            const clonedFields = JSON.parse(JSON.stringify(baseFields));
            const setSafe = (obj, mode, key) => {
                if (obj[mode] === true) {
                    obj[mode] = { view_data: key };
                } else if (obj[mode] && typeof obj[mode] === 'object') {
                    obj[mode].view_data = key;
                }
            };

            return clonedFields.map(f => {
                if (this.dataSource === 'external') {
                    if (f.id === 'nik') setSafe(f.methods, 'list', isFC ? 'employee_nik' : 'ff_no');
                    if (f.id === 'name') setSafe(f.methods, 'list', isFC ? 'employees_name' : 'field_facilitators_name');
                    if (f.id === 'email') setSafe(f.methods, 'list', 'users_email');
                } else {
                    if (f.id === 'email' && !isFC) setSafe(f.methods, 'list', 'ff_users_data.email');
                }
                return f;
            });
        },

        detailIdKey: isFC ? 'id' : 'ff_no',
        globalFilter: {
            program_year: { setter: 'program_year' },
        },
        permission: {
            create: 'monitoring-create',
            read: 'monitoring-list',
            update: 'monitoring-update',
            detail: 'monitoring-detail',
            lookup: 'monitoring-lookup',
            delete: 'monitoring-delete',
        },
    })
}
