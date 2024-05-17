<template>
  <div>
    <ValidationProvider
      mode="eager"
      :name="item.label"
      :rules="item.validation.join('|')"
      v-slot="{ classes, errors }"
      class="geko-input"
    >
      <label
        :for="item.view_data"
        :class="{
          required:
            Array.isArray(item.validation) &&
            item.validation.includes('required'),
        }"
        >{{ item.label || "Tolong Gunakan Label Ya..." }}</label
      >

      <input
        v-model="tmpValue"
        v-if="['text', 'number', 'date'].includes(item.type)"
        :id="item.view_data"
        :type="item.type || 'text'"
        v-on:input="$emit('input', $event.target.value)"
        v-on:change="$emit('change', errors[0] ? '' : $event.target.value)"
        :placeholder="item.placeholder || ''"
        v-bind:value="value"
        :class="{
          invalid: errors.length > 0,
        }"
      />

      <textarea
        v-model="tmpValue"
        v-else-if="['textarea'].includes(item.type)"
        :id="item.view_data"
        :type="item.type || 'text'"
        v-on:input="$emit('input', $event.target.value)"
        v-on:change="$emit('change', errors[0] ? '' : $event.target.value)"
        :placeholder="item.placeholder || ''"
        v-bind:value="value"
        :class="{
          invalid: errors.length > 0,
        }"
      ></textarea>

      <geko-select
        v-else-if="['select'].includes(item.type)"
        class="vs-style v-select-40"
        :class="{
          invalid: errors.length > 0,
        }"
        :placeholder="item.placeholder || null"
        :disabled="disabled"
        :options="selectOptions"
        @open="selectGetInitData"
        :reduce="(x) => x.code"
        v-model="tmpValue"
      >
      </geko-select>

      <div
        class="select-radio-row"
        v-else-if="['select-radio'].includes(item.type)"
      >
        <div
          class="select-radio-item"
          :class="{
            active: tmpValue === data.code,
          }"
          v-for="(data, i) in item.option.default_options"
          :key="item.view_data + i"
          @click="onSelectRadio(data)"
        >
          <v-icon class="select-radio-radio">{{
            data.code == tmpValue ? "mdi-radiobox-marked" : "mdi-radiobox-blank"
          }}</v-icon>
          <v-icon class="select-radio-icon" v-if="data.icon">{{
            data.icon
          }}</v-icon>
          <span>{{ data.label }}</span>
        </div>
      </div>
      <input
        v-else-if="['upload'].includes(item.type)"
        type="file"
        :id="item.view_data"
        @change="handleFileUpload($event)"
      />

      <div class="upload-wrapper" v-if="['upload'].includes(item.type)">
        <label
          :for="item.view_data"
          class="file-upload"
          :class="{
            uploaded: tmpImage,
          }"
          :style="{
            'background-image': tmpImage ? 'url(' + tmpImage + ')' : 'unset',
          }"
        >
          <v-icon v-if="!tmpImage">mdi-image</v-icon>
        </label>

        <div class="upload-label">
          <h6>Klik gambar untuk memilih berkas yang akan diunggah</h6>
          <span class="d-block">Ukuran berkas maksimal 2 Mb</span>

          <v-btn
            v-if="tmpImage"
            variant="danger"
            small
            class="mt-2"
            @click="onRemoveImage"
          >
            Hapus
          </v-btn>
        </div>
      </div>

      <span v-if="errors.length > 0" class="text-danger text-xs mt-1">{{
        errors[0]
      }}</span>
    </ValidationProvider>
  </div>
</template>

<script>
export default {
  name: "geko-input",
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
    value: {
      required: false,
    },
    disabled: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      tmpValue: null,
      tmpImage: null,
      selectOptions: [],
    };
  },

  mounted() {
    if (this.value) {
      if (
        Array.isArray(this.item.option.default_options) &&
        this.item.type === "select"
      ) {
        this.tmpValue = this.item.option.default_options.find(
          (x) => x[this.item.option.list_pointer.code] === this.value
        );
      } else if (this.item.type === "select-radio") {
        this.tmpValue = this.value;
      } else {
        this.tmpValue = {
          [this.item.option.list_pointer.code]: this.value,
          [this.item.option.list_pointer.label]: this.item.default_label,
        };
      }
    }
    if (this.item.option && Array.isArray(this.item.option.default_options)) {
      this.selectOptions = this.item.option.default_options;
    }
  },

  methods: {
    async selectGetInitData() {
      if (!this.item.api) return;

      if (Array.isArray(this.item.option.default_options)) {
        return;
      }

      let payload = {
        limit: 10,
        offset: 0,
      };

      if (this.item.param) {
        for (const _param of Object.keys(this.item.param)) {
          payload[_param] = this.item.param[_param];
        }
      }

      const result = await this.$_api.get(this.item.api, payload);

      const responseData = this.item.option.getterKey
        ? this.getListDataKey(result, this.item.option.getterKey)
        : responseData.data;

      let processedData = [];
      for (const _data of responseData) {
        processedData.push({
          label: _data[this.item.option.list_pointer.label],
          code: _data[this.item.option.list_pointer.code],
        });
      }
      this.selectOptions = processedData;
    },

    getListDataKey(data, _key) {
      const keys = _key.split(".");
      let tmpData = data;
      for (const key of keys) {
        tmpData = tmpData[key];
      }

      return tmpData;
    },

    async handleFileUpload(data) {
      this.tmpImage = URL.createObjectURL(data.target.files[0]);
      const response = await this.$_api.upload("donor/upload.php", {
        nama: Date.now().toString(),
        dir: "donor-photo/",
        image: data.target.files[0],
      });

      this.tmpValue = response;
    },

    onRemoveImage() {
      this.tmpImage = null;
      this.tmpValue = null;
    },
    onSelectRadio(data) {
      this.tmpValue = data.code;
      this.$emit("input", data.code);
    },
  },

  watch: {
    tmpValue(t) {
      if (typeof this.tmpValue === "object" && !Array.isArray(this.tmpValue)) {
        this.$emit("input", this.tmpValue[this.item.option.list_pointer.code]);
      } else {
        this.$emit("input", this.tmpValue);
      }
    },
  },
};
</script>
