<template>
    <div v-if="config && Array.isArray(config.fields)" :class="{
        [wc]: true
    }">
        <table>
            <thead>
                <tr>
                    <th v-for="(h, i) in config.fields" :key="`header-${h.getter}-${i}`">{{ h.label }}</th>
                </tr>
            </thead>
            <tbody v-if="Array.isArray(data)">
                <tr v-for="(d, i) in data" :key="`body-${i}-${d.id}`">
                    <td v-for="(f, j) in config.fields" :key="`body-${f.getter}-${i}-${j}`">
                        <span :class="f.class">
                            <span v-if="f.translate">{{ defaultData[f.translate].find(x => x.code ==
                                [d[f.getter]])?.name |
                                parse(f.transform ||
                                    'no-empty') }}</span>
                            <span v-else>{{ d[f.getter] | parse(f.transform || 'no-empty') }}</span>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<script>
import defaultData from './RraPraData.js'
export default {
    name: 'rra-pra-detail-table',
    props: {
        config: {
            default: null,
            required: false,
        },
        data: {
            default: () => [],
            required: false,
            type: Array
        },
        wc: {
            default: '',
            required: false,
            type: String
        }
    },
    data() {
        return {}
    },

    computed: {
        defaultData() {
            return defaultData
        }
    },

}
</script>