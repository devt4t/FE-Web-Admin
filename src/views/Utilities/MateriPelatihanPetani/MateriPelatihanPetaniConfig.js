export default {
    title: 'Materi Pelatihan Petani',
    getter: 'GetTrainingMaterials',
    getterDataKey: 'data.result',
    setter: 'AddTrainingMaterials',
    update: 'UpdateTrainingMaterials',
    delete: 'DeleteTrainingMaterials',
    deleteKey: 'id',
    pagination: false,
    permission: {
        read: 'materi-pelatihan-petani-list',
        list: 'materi-pelatihan-petani-list',
        detail: 'materi-pelatihan-petani-list',
        create: 'materi-pelatihan-petani-create',
        update: 'materi-pelatihan-petani-update',
        delete: 'materi-pelatihan-petani-delete',
        lookup: 'materi-pelatihan-petani-lookup'
    },
    fields: [
        {
            id: 'indicator',
            label: ' ',
            methods: {
                list: { type: 'row-slot' }
            },
        },
        {
            id: 'material_no',
            label: 'No Materi Pelatihan',
            methods: {
                list: true,
                detail: true,
                create: {
                    type: 'text',
                    validation: ['required'],
                    col_size: 6
                },
                update: {
                    type: 'text',
                    validation: ['required'],
                    col_size: 6
                }
            },
        },
        {
            id: 'material_name',
            label: 'Nama Materi Pelatihan',
            methods: {
                list: true,
                detail: true,
                create: {
                    type: 'text',
                    validation: ['required'],
                    col_size: 6
                },
                update: {
                    type: 'text',
                    validation: ['required'],
                    col_size: 6
                }
            },
        },
    ],
};