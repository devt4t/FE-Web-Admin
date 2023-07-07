import Vue from "vue";
import moment from "moment";

const utils = {
    // T4T Utils
    // Get type sppt lahan
    getTypeSpptLahan(type) {
        let res = '-'
        if (type == 0) {
            res = "Pribadi";
        }
        if (type == 1) {
            res = "Keterkaitan Keluarga";
        }
        if (type == 2) {
            res = "Umum";
        }
        if (type == 3) {
            res = "Lain-lain";
        }
        return res
    },
    // Global Utils
    // Capitalize first letter
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    capitalizeLetter (string) {
        if (string) return string.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        return ''
    },
    // date format
    dateFormat (date, format) {
        return moment(date).format(format)
    },
    // generate form data (for file upload)
    generateFormData(data) {
        let formData= new FormData()

        const objectArray= Object.entries(data)

        objectArray.forEach(([key, value]) => {

            if (Array.isArray(value)){
            value.map(item => {
                formData.append(key+'[]' , item)
            })
            }else {
            formData.append(key, value)
            }
        })
        return formData
    },
    // Random String
    generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    // Random Color
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    // Ktp Rules
    ktpRules (val) {
      const ktpRegex = /^[0-9]{16}$/;
      const check = ktpRegex.test(val)
      return check
    },
    // number format
    numberFormat (num)  {
        return new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0
        }).format(num)
    },
    // phone number
    formatPhoneNumber(phoneNumber) {
        let cleaned = ('' + phoneNumber).replace(/\D/g, '');
        let match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
          return match[1] + '-' + match[2] + '-' + match[3];
        }
        return null;
      },
    //   whatsapp
    whatsappPhone(no) {
        if (!no) return no
        return no.replace(/^0/, "62");
    }
}

Vue.prototype._utils = utils