<template>
    <div v-if="data">
        <h4 v-if="title" class="mb-2">{{ title }}</h4>
        <div class="detail-card-list">
            <div class="detail-card-item" v-for="(c, i) in config" :key="`main-config-rra-${i}`">
                <p class="label">{{ c.label }}</p>
                <p class="value ">{{ getValue(c.getter) | parse(c.transform || 'no-empty') }} Ha</p>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'rra-pra-detail-card',
    data() {
        return {

        }
    },

    methods: {


        getValue(key) {
            const keys = key.split('.')

            var values = this
            for (const _key of keys) {
                // if (values[_key]) {
                values = values[_key]
                // }
            }

            return values || 0;
        },
    },

    mounted() {
        console.log('detail card', this.data)
    },
    props: {
        data: {
            requried: false,
            default: null
        },

        scoopingData: {
            requried: false,
            default: null
        },

        config: {
            required: false,
            default: () => []
        },
        title: {
            required: false,
            default: null
        }
    }
}
</script>