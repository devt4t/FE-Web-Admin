<template>
  <div>
    <ValidationProvider
      mode="eager"
      :name="item.label"
      :rules="item.validation ? item.validation.join('|') : ''"
      v-slot="{ classes, errors }"
      class="geko-input"
      ref="provider"
    >
      <label
        v-if="!item.hide_label"
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
        v-if="['text', 'number'].includes(item.type)"
        :id="item.view_data"
        :type="item.type || 'text'"
        v-on:input="$emit('input', $event.target.value)"
        v-on:change="$emit('change', errors[0] ? '' : $event.target.value)"
        :placeholder="item.placeholder || ''"
        v-bind:value="value"
        :class="{
          invalid: errors.length > 0,
        }"
        :disabled="disabled"
      />

      <date-picker
        v-else-if="['date', 'daterange'].includes(item.type)"
        v-model="tmpValue"
        valueType="format"
        class="w-100"
        :class="{
          invalid: errors.length > 0,
        }"
        :range="item.type === 'daterange'"
      ></date-picker>

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
        :disabled="disabled"
      ></textarea>

      <geko-select
        v-else-if="['select'].includes(item.type)"
        class="vs-style"
        :class="{
          invalid: errors.length > 0,
        }"
        :placeholder="item.placeholder || null"
        :disabled="disabled"
        :options="selectOptions"
        @option:selected="$emit('selected', $event)"
        @open="selectGetInitData"
        :reduce="(x) => x[item.option?.list_pointer.code || 'code']"
        v-model="tmpValue"
        @search="selectSearchData"
        :appendToBody="true"
        :label="
          item.option && item.option.list_pointer
            ? item.option.list_pointer.label
            : 'label'
        "
        :searchable="
          typeof item.searchable === 'boolean' ? item.searchable : true
        "
        :multiple="item.option && item.option.multiple ? true : false"
      >
        <template #no-options="{ search, searching, loading }">
          <span v-if="isLoading"
            ><v-progress-circular
              color="success"
              indeterminate
              :size="17"
              :width="2"
              class="mr-2"
            ></v-progress-circular>
            <span class="text-09-em text-grey">{{
              `Loading data ${item.label ? item.label.toLowerCase() : ""}...`
            }}</span></span
          >
          <span v-else>{{
            `Tidak ada data ${item.label ? item.label.toLowerCase() : ""}`
          }}</span>
        </template>
      </geko-select>

      <VueEditor
        v-else-if="['editor'].includes(item.type)"
        v-model="tmpValue"
        :disabled="disabled"
        :placeholder="item.placeholder || ''"
        :class="{
          invalid: errors.length > 0,
        }"
      />

      <div
        class="select-radio-row"
        v-else-if="['select-radio'].includes(item.type)"
      >
        <div
          class="select-radio-item"
          :class="{
            active:
              tmpValue ===
              data[
                item.option && item.option.list_pointer.code
                  ? item.option.list_pointer.code || 'code'
                  : 'code'
              ],
          }"
          v-for="(data, i) in item.option.default_options"
          :key="'i' + item.view_data + i"
          @click="onSelectRadio(data)"
        >
          <v-icon class="select-radio-radio">{{
            data[
              item.option && item.option.list_pointer
                ? item.option.list_pointer.code || "code"
                : "code"
            ] == tmpValue
              ? "mdi-radiobox-marked"
              : "mdi-radiobox-blank"
          }}</v-icon>
          <v-icon class="select-radio-icon" v-if="data.icon">{{
            data.icon
          }}</v-icon>
          <span>{{ data.label }}</span>
        </div>
      </div>
      <input
        v-else-if="['upload'].includes(item.type)"
        :type="'file'"
        :id="item.view_data"
        :accept="item.upload_type"
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
          <v-icon v-if="!tmpImage">{{
            item.option && item.option.icon ? item.option.icon : "mdi-image"
          }}</v-icon>
        </label>

        <div class="upload-label">
          <h6>
            {{
              item.option
                ? item.option.label_hint
                : "Klik gambar untuk memilih berkas yang akan diunggah"
            }}
          </h6>
          <span class="d-block" v-if="item.option && item.option.max_size"
            >Ukuran berkas maksimal {{ item.option.max_size }}
            Mb
            <span v-if="item.option && item.option.max"
              >( Maksimal {{ item.option.max }} foto)</span
            ></span
          >

          <div class="preview-image-list">
            <div
              class="preview-image"
              v-for="(image, i) in tmpImages"
              :key="item.label + i"
              :style="{
                'background-image': image ? 'url(' + image + ')' : 'unset',
              }"
            >
              <button @click="removeImage(i)">
                <v-icon>mdi-close-circle</v-icon>
              </button>
            </div>
          </div>

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

      <span
        v-if="errors.length > 0"
        class="error-message text-danger text-xs mt-1"
        >{{ errors[0] }}</span
      >
    </ValidationProvider>
  </div>
</template>

<script>
import _ from "lodash";
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
      tmpImages: [],
      selectOptions: [],
      isLoading: false,
    };
  },

  mounted() {
    if (![undefined, null, ""].includes(this.value)) {
      this.setDefaultValue();
    }
    if (this.item.option && Array.isArray(this.item.option.default_options)) {
      this.selectOptions = this.item.option.default_options;
    }
  },

  methods: {
    selectSearchData: _.debounce(function (search, loading, limit = 10) {
      if (this.item.option && Array.isArray(this.item.option.default_options))
        return;
      if (!this.item.api || !search) return;

      if (loading instanceof Function) loading(true);

      let params = {
        search: search,
        limit: limit,
      };

      this.selectGetInitData(params, loading);
    }),
    async setDefaultValue() {
      if (
        this.item.option &&
        Array.isArray(this.item.option.default_options) &&
        this.item.type === "select"
      ) {
        if (this.item.option && this.item.option.multiple) {
          this.tmpValue = this.value;
        } else {
          this.tmpValue = this.item.option.default_options.find(
            (x) => x[this.item.option.list_pointer.code || "code"] == this.value
          );
        }
      } else if (this.item.type === "select-radio") {
        this.tmpValue = this.value;

        await this.$refs.provider.validate(this.tmpValue);
      } else if (this.item.type === "select") {
        if (this.item.option && this.item.option.multiple) {
          this.tmpValue = this.value;
        } else {
          this.tmpValue = {
            [this.item.option.list_pointer.code || "code"]: this.value,
            [this.item.option.list_pointer.label || "label"]: this.item
              .default_label
              ? this.item.default_label
              : this.item.option.default_label,
          };
        }
      } else if (this.item.type === "upload") {
        if (this.item.option && this.item.option.multiple) {
          let _tmpImages = JSON.parse(JSON.stringify(this.value));
          if (!Array.isArray(this.value)) {
            _tmpImages = [JSON.parse(JSON.stringify(this.value))];
          }

          for (let i = 0; i < _tmpImages.length; i++) {
            _tmpImages[i] = `${this.$_config.baseUrlUpload}/${_tmpImages[i]}`;
          }

          this.tmpImages = _tmpImages;
          this.tmpValue = this.value;
          await this.$refs.provider.validate(this.tmpValue);
        } else {
          this.tmpImage = `${this.$_config.baseUrlUpload}/${this.value}`;
          this.tmpValue = this.value;
          await this.$refs.provider.validate(this.tmpValue);
        }
      } else {
        this.tmpValue = this.value;
        await this.$refs.provider.validate(this.tmpValue);
      }
    },
    async selectGetInitData(extParams = {}, loading) {
      if (typeof extParams !== "object") return;
      if (!this.item.api) return;

      if (Array.isArray(this.item.option.default_options)) {
        return;
      }

      this.isLoading = true;

      let payload = {};

      if (this.item.param) {
        if (!this.item.param.page) payload.limit = 10;
        if (!this.item.param.per_page) payload.offset = 0;
        for (const _param of Object.keys(this.item.param)) {
          payload[_param] = this.item.param[_param];
        }
      } else {
        payload.limit = 10;
        payload.offset = 0;
      }

      const _payload = Object.assign(payload, extParams);

      const result = await this.$_api.get(this.item.api, _payload).catch(() => {
        this.isLoading = false;
      });
      const responseData = this.item.option.getterKey
        ? this.getListDataKey(result, this.item.option.getterKey)
        : result.data;

      let processedData = [];
      for (const _data of responseData) {
        const _display = Array.isArray(this.item.option.list_pointer.display)
          ? this.item.option.list_pointer.display
          : [this.item.option.list_pointer.label || "label"];
        const _separator = this.item.option.list_pointer.separator || "-";

        let _label = [];
        for (const _d of _display) {
          if (_data[_d]) {
            _label.push(_data[_d]);
          }
        }

        processedData.push({
          ...(this.$listeners.selected instanceof Function ? _data : {}),

          [this.item.option.list_pointer.label || "label"]: _label.join(
            ` ${_separator} `
          ),
          [this.item.option.list_pointer.code || "code"]:
            _data[this.item.option.list_pointer.code || "code"],
        });
      }
      this.isLoading = false;
      if (loading instanceof Function) {
        loading(false);
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
      let param = {
        nama: Date.now().toString(),
        dir: this.item.directory,
        fileToUpload: data.target.files[0],
      };

      if (this.item.upload_type) {
        param.type = this.item.upload_type == ".kml" ? "polygon" : "photo";
      }

      const response = await this.$_api.upload(this.item.api, param);

      if (this.item.option && this.item.option.multiple) {
        this.tmpImages.push(URL.createObjectURL(data.target.files[0]));
      } else {
        this.tmpImage = URL.createObjectURL(data.target.files[0]);
      }

      const imageFolder = this.item.api.split("/")[0];
      const imageUrl = `${imageFolder}/${response}`;
      if (this.item.option && this.item.option.multiple) {
        if (!Array.isArray(this.tmpValue)) {
          this.tmpValue = [imageUrl];
        } else {
          this.tmpValue.push(imageUrl);
        }
      } else {
        this.tmpValue = imageUrl;
      }

      await this.$refs.provider.validate(this.tmpValue);
    },

    onRemoveImage() {
      this.tmpImage = null;
      this.tmpValue = null;
    },
    async onSelectRadio(data) {
      this.tmpValue = data[this.item.option.list_pointer.code] || "code";
      this.$emit("input", data[this.item.option.list_pointer.code || "code"]);

      await this.$refs.provider.validate(this.tmpValue);
    },

    removeImage(i) {
      this.tmpImages.splice(i, 1);
      this.tmpValue.splice(i, 1);
    },
  },

  watch: {
    tmpValue(t, f) {
      if ([null, undefined].includes(t) && [null, undefined].includes(f))
        return;

      if (
        typeof this.tmpValue === "object" &&
        !Array.isArray(this.tmpValue) &&
        this.tmpValue !== null
      ) {
        this.$emit(
          "input",
          this.tmpValue[this.item.option.list_pointer.code || "code"]
        );

        if (this.item.type === "upload") {
          if (this.item.option && this.item.option.multiple) {
            this.tmpImages = [];
          } else {
            this.tmpImage = null;
          }
        }
      } else {
        this.$emit("input", this.tmpValue);
      }
    },
    // 'item.option': {
    //   immediate: false,
    //   deep: true,
    //   handler(v) {
    //     if (v && v.default_options) {
    //       this.setDefaultValue()
    //     }
    //   }
    // }
  },
};
</script>
