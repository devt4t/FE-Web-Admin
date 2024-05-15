<template>
    <div>
        <ValidationProvider mode="eager" :name="item.label" :rules="item.validation.join('|')"
            v-slot="{ classes, errors }" class="geko-input">
            <label :for="item.view_data" :class="{
                required: Array.isArray(item.validation) && item.validation.includes('required')
            }">{{ item.label || 'Tolong Gunakan Label Ya...' }}</label>
            <input v-if="['text'].includes(item.type)" :id="item.view_data" :type="item.type || 'text'"
                v-on:input="$emit('input', $event.target.value)" v-on:change="
                    $emit('change', errors[0] ? '' : $event.target.value)" :placeholder="item.placeholder || ''"
                v-bind:value="value" :class="{
                    'invalid': errors.length > 0
                }" />
            <span v-if="errors.length > 0" class="text-danger text-xs mt-1">{{ errors[0] }}</span>
        </ValidationProvider>
    </div>
</template>

<script>
export default {
    name: 'geko-input',
    props: {
        item: {
            type: Object,
            required: true,
            default: () => { }
        },
        value: {
            required: false
        },
        disabled: {
            required: false,
            default: false
        }
    }

}
</script>