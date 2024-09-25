<template>
  <div style="border-right: 1px solid transparent" v-if="data">
    <section class="pdf-item">
      <h3
        class="text-center text-black font-weight-bold text-1-em"
        style="margin-bottom: 2em"
      >
        PERJANJIAN KERJASAMA<br />PENGGUNAAN LAHAN UNTUK PENANAMAN POHON DALAM
        PROYEK KARBON<br />Antara<br />YAYASAN BUMI HIJAU LESTARI
        (Trees4Trees)<br />Dengan PETANI <br />PEMILIK TANAH/LAHAN
      </h3>

      <p class="text-black">
        Perjanjian ini dibuat pada hari {{ formatDate("dddd") }} tanggal
        {{ formatDate("DD") }}
        bulan {{ formatDate("MMMM") }} tahun {{ formatDate("YYYY") }} antara:
      </p>
      <table class="text-black table-1" style="margin-bottom: 1em">
        <tr class="font-weight-bold">
          <td>Nama</td>
          <td>Pandu Budi Wahono</td>
        </tr>
        <tr>
          <td>Jabatan</td>
          <td>Project Manager</td>
        </tr>
        <tr>
          <td>Alamat</td>
          <td style="font-style: italic">
            Jl. Sanggung Barat No.11 RT 006/ RW 002 Jatingaleh, Candisari,
            Semarang.
          </td>
        </tr>
      </table>
      <p class="text-black" style="margin-bottom: 0.8em">
        Bertindak untuk dan atas nama Yayasan Bumi Hijau Lestari
        <strong>(Trees4Trees)</strong>, yang selanjutnya disebut
        <strong>"PIHAK PERTAMA"</strong>.
      </p>

      <table class="text-black table-1" style="margin-bottom: 1em">
        <tr>
          <td>Nama</td>
          <td>{{ data.farmer_name }}</td>
        </tr>
        <tr>
          <td>Alamat</td>
          <td>{{ data.farmer_address }}</td>
        </tr>
        <tr>
          <td>No. KTP</td>
          <td>{{ data.farmer_nik }}</td>
        </tr>
      </table>

      <p class="text-black">
        Bertindak atas nama sendiri sebagai pemilik sah dari tanah/lahan yang
        digunakan untuk proyek ini, yang selanjutnya disebut
        <strong>"PIHAK KEDUA"</strong>.
      </p>

      <p class="text-black">
        PIHAK PERTAMA dan PIHAK KEDUA secara sendiri-sendiri disebut
        <strong>“PIHAK”</strong> dan secara bersama-sama disebut
        <strong>“PARA PIHAK”</strong>.
      </p>

      <p class="text-black">
        PARA PIHAK dengan ini terlebih dahulu menerangkan sebagai berikut :
      </p>

      <ol>
        <li class="text-black">
          Bahwa PIHAK PERTAMA adalah
          <strong>Badan Hukum berupa Yayasan</strong> yang mana sesuai dengan
          akta pendiriannya bergerak di bidang Lingkungan Hidup, Sosial dan
          Perlindungan Konsumen
        </li>
        <li class="text-black">
          Bahwa PIHAK KEDUA adalah <strong>Perorangan</strong> yang berkuasa
          penuh atas kepemilikan lahan
        </li>
      </ol>

      <p class="text-black" style="margin-top: 0">
        Atas dasar pertimbangan yang diuraikan tersebut diatas, PARA PIHAK
        <span class="text-italic">sah dan berwenang serta telah sepakat</span>
        untuk melakukan perjanjian Penggunaan Lahan Untuk Penanaman Pohon Dalam
        Proyek Karbon yang saling menguntungkan dengan ketentuan-ketentuan dan
        syarat-syarat sebagai berikut:
      </p>
    </section>

    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        Pasal 1
      </p>
      <p class="text-center text-black font-weight-bold">KETENTUAN UMUM</p>
      <p class="text-black" style="margin-bottom: 0.5em">
        Dalam perjanjian ini, yang dimaksud dengan:
      </p>
      <ol class="text-09-em">
        <li class="text-black" style="padding-bottom: 0">
          <strong>Proyek Karbon</strong> adalah kegiatan yang bertujuan untuk
          mengurangi emisi gas rumah kaca melalui penanaman pohon dan
          pengelolaan hutan yang berkelanjutan, sesuai dengan peraturan
          perundangan yang berlaku di Indonesia, termasuk namun tidak terbatas
          pada Peraturan Presiden No. 98 Tahun 2021 tentang Penyelenggaraan
          Nilai Ekonomi Karbon (NEK) dan Peraturan Presiden No. 14 Tahun 2024
          tentang Penyelenggaraan Kegiatan Penangkapan dan Penyimpanan Karbon
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Monitoring, Reporting, and Verification (MRV)</strong> adalah
          proses pemantauan, pelaporan, dan verifikasi yang dilakukan untuk
          memastikan bahwa semua kegiatan yang dilakukan dalam proyek karbon ini
          sesuai dengan rencana yang telah disepakati dan memenuhi standar yang
          ditetapkan oleh pemerintah Indonesia dan standar karbon terverifikasi.
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Aplikasi GEKO atau platform lain</strong> adalah sistem atau
          perangkat lunak yang dipersiapkan oleh yayasan untuk digunakan dalam
          monitoring, pelaporan, dan verifikasi (MRV) kegiatan penanaman dan
          pertumbuhan pohon dalam proyek karbon ini. Aplikasi ini memfasilitasi
          pemantauan secara digital terhadap keberhasilan penanaman, pertumbuhan
          pohon, serta penilaian nilai karbon yang dihasilkan.
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Multi-Purpose Tree Species (MPTS)</strong> adalah jenis pohon
          serbaguna yang selain memiliki manfaat ekologis juga memberikan
          manfaat ekonomi bagi masyarakat, seperti hasil hutan bukan kayu
          (Non-Timber Forest Products -NTFPs) yang dapat berupa buah-buahan,
          resin, daun, dan produk lainnya.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Lahan yang Sah dan Legal</strong> adalah lahan yang secara
          hukum diakui sebagai milik PIHAK KEDUA, yang bebas dari sengketa, sita
          jaminan, atau hak tanggungan lain yang dapat menghalangi pelaksanaan
          proyek karbon ini.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Kompensasi Nilai Karbon</strong> adalah pembayaran yang
          dilakukan oleh PIHAK PERTAMA kepada PIHAK KEDUA sebagai imbalan atas
          penanaman, pemeliharaan, dan pertumbuhan pohon yang dilakukan dalam
          proyek ini, yang dinilai berdasarkan nilai ekonomi karbon sesuai
          dengan regulasi yang berlaku dan sudah disesuakan dengan pengurangan
          untuk biaya biaya yang timbul dari proyek ini.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Land Owner Group</strong> adalah Kelompok yang dibentuk oleh
          PIHAK KEDUA berbentuk badan hukum yang terdiri dari pemilik lahan yang
          ikut serta dalam proyek karbon, di mana kelompok tersebut bertanggung
          jawab secara kolektif untuk memastikan bahwa lahan yang dikelola
          memenuhi persyaratan hukum dan teknis proyek karbon, serta menjalankan
          kegiatan penanaman dan pemeliharaan sesuai dengan standar yang
          ditetapkan oleh PIHAK PERTAMA.
        </li>
      </ol>
      <div>
        <p class="text-center text-black font-weight-bold mb-1 mt-5 pt-5">
          Pasal 2
        </p>
        <p class="text-center text-black font-weight-bold mb-5">DASAR HUKUM</p>

        <p class="text-black">
          <strong>Perpres Nomor 98 Tahun 2021</strong> Tentang Penyelenggaraan
          Nilai Ekonomi Karbon untuk Pencapaian Target Kontribusi yang
          Ditetapkan secara Nasional dan Pengendalian Emisi Gas Rumah Kaca dalam
          Pembangunan Nasional.
        </p>
        <p class="text-black">
          <strong>Perpres Nomor 14 Tahun 2024</strong> tentang Penyelenggaraan
          Kegiatan Penangkapan dan Penyimpanan Karbon.
        </p>
      </div>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold mb-1">Pasal 3</p>
      <p class="text-center text-black font-weight-bold mb-5">
        TUJUAN KERJASAMA
      </p>

      <p class="text-black">
        Tujuan perjanjian ini adalah penggunaan lahan untuk meningkatkan
        pendapatan petani dan masyarakat pedesaan melalui penanaman pohon dan
        restorasi lahan, yang berdampak positif terhadap lingkungan dan
        masyarakat lokal serta berkontribusi terhadap program nasional menuju
        Net Zero Emission.
      </p>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 4</p>
      <p class="text-center text-black font-weight-bold mb-5">
        RUANG LINGKUP PERJANJIAN
      </p>

      <ol>
        <li class="text-black" style="padding-bottom: 0">
          PARA PIHAK sepakat untuk bekerjasama dalam proyek ini dengan kegiatan,
          pilihan model proyek, dokumen lahan, luas lahan, jumlah dan jenis
          pohon yang ditanam, dan spesifikasi teknis lainnya yang ditulis pada
          lampiran
        </li>
        <li class="text-black" style="padding-bottom: 0">
          PIHAK PERTAMA sebagai Pengembang Proyek bertanggungjawab untuk
          memberikan manfaat finansial berupa kompensasi nilai karbon dan
          manfaat non finansial meliputi penyediakan bibit pohon, pelatihan
          terkait praktik kehutanan yang baik kepada PIHAK KEDUA serta
          mendampingi melengkapi persyaratan dan ketentuan standar karbon
          terverifikasi.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          PIHAK KEDUA bertanggungjawab terhadap ketersediaan lahan, melakukan
          penanaman dan pemeliharaan pohon sesuai dengan rencana, syarat dan
          ketentuan proyek.
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 5</p>
      <p class="text-center text-black font-weight-bold mb-5">
        HAK DAN KEWAJIBAN
      </p>

      <ol>
        <li class="text-black">
          <p class="font-weight-bold">KEWAJIBAN PIHAK PERTAMA</p>
          <ol type="a">
            <li class="text-black" style="padding-bottom: 0">
              Memeriksa kriteria kelayakan proyek melalui citra satelit dan
              melakukan survey lapangan.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memeriksa dokumen sah dan legal PIHAK KEDUA sesuai ketentuan
              proyek.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Melakukan pengukuran, pemetaan serta pendataan.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memproduksi dan menyediakan bibit pohon untuk PIHAK KEDUA.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Mendistribusikan bibit pohon ke lokasi terdekat PIHAK KEDUA.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memberikan pelatihan tentang praktik kehutanan yang baik dan
              pelatihan aplikasi GEKO atau platform lain kepada PIHAK KEDUA.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memberikan dukungan teknis kepada PIHAK KEDUA untuk monitoring
              kegiatan dan perkembangan pohon.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memberikan dukungan pendampingan, komunikasi dan hotline pengaduan
              dan keluhan untuk keberhasilan kegiatan penanaman dan pemantauan
              pohon.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Membuat Dokumen Rencana Aksi Mitigasi (DRAM) untuk proyek karbon
              dan mendampingi dalam pendaftaran proyek kepada Pemerintah.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memberikan kompensasi nilai karbon kepada PIHAK KEDUA sesuai
              dengan hasil pemantauan pertumbuhan dan perkembangan pohon
              berdasarkan aplikasi GEKO atau platform lain setiap 5 tahun
              sekali.
            </li>
          </ol>
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <ol start="2">
        <li class="text-black">
          <p class="font-weight-bold">HAK PIHAK PERTAMA:</p>
          <ol type="a">
            <li class="text-black" style="padding-bottom: 0">
              Mengatur semua rencana kegiatan proyek dan rencana penanaman
              pohon, membangun persemaian, memproduksi dan mendistribusikan
              bibit
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Melakukan evaluasi dan validasi data hasil monitoring perkembangan
              pohon melalui aplikasi GEKO atau platform lain, atau survey
              lapangan (monitoring, reporting dan verifikasi/MRV).
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Mendapatkan informasi termasuk namun tidak terbatas pada data
              pribadi, data lahan, gambar, video, wawancara tertulis dan
              mempublikasikan proyek ini.
            </li>
          </ol>
        </li>

        <li class="text-black">
          <p class="font-weight-bold">KEWAJIBAN PIHAK KEDUA:</p>
          <ol type="a">
            <li class="text-black" style="padding-bottom: 0">
              Menyediakan lahan yang sah dan legal untuk menjadi bagian dari
              proyek, dibuktikan dengan melampirkan salinan sertifikat
              kepemilikan tanah.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Dalam hal lahan belum bersertifikat, PIHAK KEDUA Melampirkan
              Salinan dokumen peralihan hak beserta dengan surat keterangan desa
              dan surat keterangan bebas sengketa dari pemerintah desa dan
              bersedia melakukan pengurusan sertifikat tersebut sebagai syarat
              untuk mendapatkan kompensasi nilai karbon.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Menjamin lahan yang dikerjasamakan tidak dalam keadaan sengketa
              serta bebas dari sita jaminan dan atau tidak dalam keadaan
              dijadikan sebagai jaminan hutang kepada pihak manapun.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Memberikan data-data dan informasi yang diperlukan PIHAK PERTAMA
              dalam penyusunan Dokumen Rencana Aksi Mitigasi Proyek Karbon.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Melakukan persiapan lahan, penanaman dan pemeliharaan pohon yang
              diberikan PIHAK PERTAMA pada lahan yang ditetapkan dalam proyek
              sesuai rencana proyek dengan baik, termasuk penanaman pengganti
              untuk pohon yang mati selama proyek.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Menghadiri pelatihan dan pertemuan tatap muka yang diadakakan oleh
              PIHAK PERTAMA.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Menjadi anggota anggota aktif Land Owner Group, setelah badan
              hukum tersebut didirikan.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Melakukan pemantauan mandiri perkembangan keberhasilan penanaman
              pohon dan menyampaikan informasi kepada PIHAK PERTAMA.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              Tidak melakukan penebangan pohon yang diberikan selama jangka
              waktu proyek sesuai dengan ketentuan proyek.
            </li>
            <li class="text-black" style="padding-bottom: 0">
              <p class="text-black" style="padding-bottom: 0; font-size: 1em">
                Setelah mendapatkan penjelasan tentang Proyek ini, akan mentaati
                hal-hal sebagai berikut:
              </p>
              <ul style="list-style-type: disc; font-size: 1em">
                <li style="font-size: 1em; padding-bottom: 0">
                  Mentaati hukum-hukum yang berlaku baik lokal, nasional dan
                  internasional.
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Tidak melakukan pembukaan hutan, kecuali bagian tugas
                  berdasarkan kewenangan legal.
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Tidak menggunakan bibit tanaman/hewan dari modifikasi
                  genetic/GMO.
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Tidak menggunakan bahan kimia berbahaya/beracun sesuai
                  peraturan Indonesia dan WHO, dan menggunakan cara-cara yang
                  ramah lingkungan.
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Tidak menggunakan pekerja anak kecuali dalam perlindungan
                  orang tuanya, serta tidak menggunakan tenaga kerja secara
                  paksa. PIHAK KEDUA dapat menyampaikan informasi apabila
                  terjadi penggunaan pekerja anak dan tenaga kerja secara paksa
                  dalam proyek ini.
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Melindungi kawasan-kawasan konservasi dan satwa-tumbuhan yang
                  dilindungi
                </li>
                <li style="font-size: 1em; padding-bottom: 0">
                  Mengikuti petunjuk tenaga pendamping PIHAK PERTAMA selama
                  proyek berlangsung.
                </li>
              </ul>
            </li>
          </ol>
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <ol start="4">
        <li class="text-black">
          <p class="font-weight-bold" style="margin-bottom: 0">
            HAK PIHAK KEDUA:
          </p>
          <ol type="a">
            <li class="text-black" style="padding-bottom: 0">
              <p
                class="font-weight-bold"
                style="font-size: 1em; margin-bottom: 0"
              >
                Hak Finansial
              </p>
              <ul style="list-style-type: disc; padding-bottom: 0">
                <li style="padding-bottom: 0">
                  Mendapat kompensasi nilai manfaat proyek karbon dari PIHAK
                  PERTAMA sesuai tingkat pertumbuhan dan perkembangan pohon
                  tertanam sesuai dengan kesepakatan pada KOMPENSASI NILAI
                  KARBON
                </li>
              </ul>
            </li>
            <li class="text-black" style="padding-bottom: 0">
              <p
                class="font-weight-bold"
                style="font-size: 1em; margin-bottom: 0"
              >
                Hak Non Finansial
              </p>
              <ul style="list-style-type: disc">
                <li style="padding-bottom: 0">
                  Mendapatkan 100% hasil dari manfaat pohon yang ditanam dan
                  dipelihara
                </li>
                <li style="padding-bottom: 0">
                  Mendapatkan insentif keberhasilan dalam mencapai 80% tingkat
                  Survival Rate dalam setiap 2 (dua) tahun
                </li>
                <li style="padding-bottom: 0">
                  Mendapat pelatihan tentang praktik kehutanan yang baik dan
                  pelatihan aplikasi GEKO atau platform lain dari PIHAK PERTAMA.
                </li>
                <li style="padding-bottom: 0">
                  Mendapat dukungan teknis untuk monitoring kegiatan dan
                  perkembangan pohon.
                </li>
              </ul>
            </li>
          </ol>
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 6</p>
      <p class="text-center text-black font-weight-bold mb-5">
        KOMPENSASI NILAI KARBON
      </p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          Perhitungan Nilai karbon dihitung berdasarkan hasil pengukuran dan
          pemantauan proyek dari aplikasi GEKO atau platform lain yang digunakan
          dan telah diverifikasi oleh lembaga independen Verifikator Dan
          Validator Berkualifikasi (VVB) terkait keabsahan dan disesuaikan
          dengan kontribusi pengurangan emisi karbon yang timbul atas
          pelaksanaan proyek ini.
        </li>
        <li style="padding-bottom: 0">
          Kompensasi nilai karbon ditentukan oleh beberapa faktor, termasuk:
          Jenis dan jumlah pohon yang ditanam, Data pertumbuhan dan biomassa
          pohon yang dikumpulkan secara berkala melalui platform pemantauan dan
          Harga satuan kredit karbon.
        </li>
        <li style="padding-bottom: 0">
          Kompensasi nilai karbon akan diberikan oleh PIHAK PERTAMA kepada PIHAK
          KEDUA setiap 5 (lima) tahun sekali, berdasarkan pertumbuhan dan
          perkembangan pohon yang telah diverifikasi, dengan perhitungan
          berdasarkan jumlah kredit karbon yang dihasilkan selama periode
          tersebut.
        </li>
        <li style="padding-bottom: 0">
          Harga satuan kredit karbon yang digunakan untuk perhitungan kompensasi
          akan mengacu pada harga pasar internasional yang berlaku pada saat
          pembayaran. Harga pasar kredit karbon disesuaikan dengan standar pasar
          global yang diakui, seperti VERRA atau standar lain yang disepakati
          oleh PARA PIHAK.
        </li>
        <li style="padding-bottom: 0">
          Pembayaran kompensasi nilai karbon dari PIHAK PERTAMA kepada PIHAK
          KEDUA akan dilakukan melalui system transfer rekening bank, atau cara
          lain sesuai ketentuan proyek.
        </li>
        <li style="padding-bottom: 0">
          PARA PIHAK akan menyimpan catatan dan dokumentasi yang tepat dari
          semua pembayaran yang dilakukan untuk proyek ini, dan setuju untuk
          dilakukan audit keuangan internal dan eksternal.
        </li>
        <li style="padding-bottom: 0">
          PIHAK PERTAMA akan menyediakan laporan berkala kepada PIHAK KEDUA yang
          berisi estimasi jumlah kredit karbon yang dihasilkan dan nilai
          kompensasi yang diharapkan, berdasarkan data yang dikumpulkan melalui
          aplikasi GEKO atau platform lain. Estimasi ini akan membantu PIHAK
          KEDUA memperkirakan potensi keuntungan dari proyek karbon.
        </li>
        <li style="padding-bottom: 0">
          Pajak yang timbul atas penerimaan kompensasi karbon ditanggung oleh
          kelompok petani karbon
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 7</p>
      <p class="text-center text-black font-weight-bold mb-5">PERALIHAN HAK</p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          Dalam hal PIHAK KEDUA memutuskan untuk mengalihkan tanahnya kepada
          orang lain untuk sementara atau selamanya. PIHAK KEDUA harus
          menyatakan 90 hari sebelum peralihan hak, secara tertulis, sehingga
          tidak merugikan perkembangan proyek ini. Kemudian, hak dan kewajiban
          yang sama harus disampaikan kepada pemilik baru oleh PIHAK KEDUA.
        </li>
        <li style="padding-bottom: 0">
          Dalam hal kematian, PIHAK KEDUA sebagai pemegang hak milik tanah, maka
          manfaat dan kewajiban dalam perjanjian proyek ini beralih ke ahli
          waris yang sah.
        </li>
        <li style="padding-bottom: 0">
          Dalam hal lahan yang digunakan dalam proyek ini menjadi objek sita
          jaminan, PIHAK KEDUA wajib segera memberitahukan PIHAK PERTAMA secara
          tertulis, kemudian PARA PIHAK akan bersama-sama menentukan
          langkah-langkah yang diperlukan, termasuk kemungkinan penghentian
          proyek dan pengaturan kompensasi yang telah diberikan oleh PIHAK
          PERTAMA
        </li>
        <li style="padding-bottom: 0">
          Dalam hal pemilik baru menyatakan tidak mampu atau tidak sepakat
          melanjutkan perjanjian proyek ini, maka proyek akan diberhentikan dan
          tidak ada pembayaran yang wajib dibayarkan kepada PIHAK KEDUA.
        </li>
        <li style="padding-bottom: 0">
          Jika PIHAK PERTAMA tidak dapat melanjutkan proyek karena pembubaran,
          likuidasi, atau sebab lain yang menyebabkan ketidakmampuan untuk
          melanjutkan proyek sebelum proyek berakhir, maka seluruh manfaat dan
          nilai kompensasi proyek yang sudah dibayarkan atau diberikan PIHAK
          PERTAMA menjadi sepenuhnya milik PIHAK KEDUA tanpa perlu penggantian
          atau pengembalian.
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 8</p>
      <p class="text-center text-black font-weight-bold mb-5">
        PENALTI DAN SANKSI
      </p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          PIHAK PERTAMA dapat segera menangguhkan pembayaran kompensasi nilai
          manfaat proyek karbon kepada PIHAK KEDUA dalam hal Tingkat
          kelangsungan hidup pohon setelah penggantian pohon mati lebih rendah
          dari 80% selama dua tahun berturut-turut dalam satu lahan terdaftar
          PIHAK KEDUA
        </li>
        <li style="padding-bottom: 0">
          <p style="padding-bottom: 0">
            PIHAK PERTAMA dapat menghentikan pembayaran kompensasi nilai manfaat
            proyek karbon kepada PIHAK KEDUA dan mengakhiri proyek sebelum
            waktunya dalam hal berikut:
          </p>
          <ol type="a">
            <li>
              PIHAK KEDUA memberikan data-data dan informasi yang tidak akurat
              atau dipalsukan dengan tujuan semata-mata untuk mendapatkan
              keuntungan finansial.
            </li>
            <li>
              PIHAK KEDUA menggunakan lahan dalam proyek ini untuk kepentingan
              proyek karbon lain
            </li>
            <li>Penggunaan bahan kimia berbahaya di lokasi proyek</li>
            <li>
              Perusakan dengan sengaja sebagian atau seluruh lokasi penanaman
              dengan api (dibakar), penebangan dini atau cara lain dalam bentuk
              apapun.
            </li>
          </ol>
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        Pasal 9
      </p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        KERAHASIAAN DAN PERLINDUNGAN DATA PRIBADI
      </p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          PARA PIHAK wajib menjaga kerahasiaan semua data dan informasi yang
          diperoleh selama pelaksanaan perjanjian ini, termasuk namun tidak
          terbatas pada data pribadi, data lahan, dan informasi proyek.
        </li>
        <li style="padding-bottom: 0">
          PIHAK PERTAMA bertanggung jawab untuk memastikan bahwa data pribadi
          disimpan dengan aman dan hanya digunakan untuk tujuan yang telah
          disepakati dalam perjanjian.
        </li>
        <li style="padding-bottom: 0">
          Jika terjadi pelanggaran terhadap kerahasiaan atau penggunaan data
          pribadi, PIHAK yang mengetahui pelanggaran tersebut harus segera
          melaporkannya kepada pihak lainnya dan mengambil langkah-langkah yang
          diperlukan untuk mengatasi pelanggaran tersebut.
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 10</p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        JANGKA WAKTU PERJANJIAN
      </p>
      <p class="text-black">
        Jangka waktu perjanjian ini adalah 40 (empat puluh) tahun, dimulai dari
        tanggal : {{ data.mou_start }} dan berakhir pada tanggal :
        {{ data.mou_end }} Perjanjian ini akan dievaluasi setiap tahun melalui
        pengukuran, pemantauan pohon, dan pertemuan berkala untuk menilai
        perkembangan kerjasama.
      </p>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 11</p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        KEADAAN KAHAR (FORCE MAJEURE)
      </p>
      <ol class="text-black">
        <li style="padding-bottom: 0">
          Keadaan kahar berarti semua peristiwa yang berada di luar kendali para
          pihak dalam perjanjian ini dan yang tidak dapat diprediksi atau
          diperkirakan tidak dapat dihindari, seperti bencana alam (longsor,
          likuifaksi, banjir, kebakaran alam, gempa bumi, dll) atau bencana tak
          terduga (peperangan, huru-hara, dll).
        </li>
        <li style="padding-bottom: 0">
          Jika salah satu pihak dalam perjanjian ini, karena Keadaan Kahar,
          tidak dapat melaksanakan tanggung jawabnya secara keseluruhan atau
          sebagian, tanggung jawab pihak tersebut, sejauh mereka dipengaruhi
          oleh Keadaan Kahar maka proyek akan diberhentikan dan tidak dikenakan
          Penalti atau penggantian apapun.
        </li>
        <li style="padding-bottom: 0">
          Pihak yang mengalami Keadaan Kahar harus segera memberitahu pihak lain
          secara tertulis dan harus memberikan bukti yang tepat tentang
          terjadinya dan durasi “Keadaan Kahar” tersebut, selambatnya 7 (tujuh)
          hari setelah kejadian.
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5 pt-5">
        Pasal 12
      </p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0"
      >
        BERAKHIRNYA PERJANJIAN
      </p>

      <ol class="text-black">
        <li>
          Perjanjian ini berakhir setelah semua kewajiban yang tercantum dalam
          perjanjian ini dan jangka waktu perjanjian telah dipenuhi oleh PARA
          PIHAK.
        </li>
        <li>
          Perjanjian ini berakhir jika dinyatakan batal atau dibatalkan oleh
          keputusan pengadilan yang memiliki kekuatan hukum tetap.
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold mb-1">Pasal 13</p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0.5em"
      >
        PERSELISIHAN
      </p>

      <p class="text-black">
        Bilamana terjadi perselisihan dałam pelaksanaan Perjanjian Kerjasama ini
        akan diselesaikan secara musyawarah dan mufakat antara PARA PIHAK, dan
        apabila tidak tercapai kesepakatan maka PARA PIHAK memilih tempat
        kedudukan hukum (domisili) yang tetap pada Kantor Panitera Pengadilan
        Negeri Kabupaten Bandung Provinsi Jawa Barat.
      </p>

      <p class="text-center text-black font-weight-bold mb-1">Pasal 14</p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0.5em"
      >
        KETENTUAN LAIN
      </p>
      <ol class="text-black">
        <li style="padding-bottom: 0">
          Segala lampiran yang melengkapi surat perjanjian ini merupakan bagian
          yang tidak terpisahkan dan mempunyai kekuatan hukum yang sama.
        </li>
        <li style="padding-bottom: 0">
          Perubahan atas surat Perjanjian Kerjasama ini tidak berlaku kecuali
          terlebih dahulu melalui persetujuan PARA PIHAK secara musyawarah dan
          mufakat.
        </li>
      </ol>

      <p
        class="text-center text-black font-weight-bold mb-1"
        style="margin-top: 1em"
      >
        Pasal 15
      </p>
      <p
        class="text-center text-black font-weight-bold"
        style="margin-bottom: 0.5em"
      >
        PENUTUP
      </p>

      <p class="text-black">
        Surat perjanjian kerjasama ini ditanda tangani oleh PARA PIHAK dengan
        itikad baik, penuh kesadaran dan tanggung jawab tanpa adanya paksaan
        dari manapun dan untuk digunakan sebagaimana mestinya.
      </p>

      <div
        class="text-black"
        style="
          padding-top: 2em;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        "
      >
        <p>Bandung, {{ data.mou_start }}</p>
      </div>

      <div
        class="d-flex flex-row text-black"
        style="justify-content: space-between"
      >
        <div
          style="
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
          "
        >
          <p class="font-weight-bold mb-5 pb-2">PIHAK PERTAMA</p>

          <div
            class="materai mb-5"
            style="
              padding-inline: 2em;
              padding-block: 1em;
              border: 1px solid black;
              transform: translateX(-50%);
            "
          >
            Materai
          </div>

          <p class="font-weight-bold mb-0" style="text-decoration: underline">
            Pandu Budi Wahono
          </p>
          <p class="text-black">Project Manager</p>
        </div>
        <div
          style="
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
          "
        >
          <p class="font-weight-bold mb-5 pb-2">PIHAK KEDUA</p>

          <div
            class="materai mb-5"
            style="
              padding-inline: 2em;
              padding-block: 1em;
              border: 1px solid black;
              transform: translateX(-50%);
            "
          >
            Materai
          </div>

          <p class="font-weight-bold mb-0" style="text-decoration: underline">
            {{ data.farmer_name }}
          </p>
          <p class="text-black">Pemilik Lahan/Tanah</p>
        </div>
      </div>

      <div
        class="d-flex flex-row text-black"
        style="
          justify-content: space-between;
          margin-top: 2em;
          border-bottom: 1px solid black;
          padding-bottom: 1em;
        "
      >
        <ol>
          <p class="font-weight-bold mb-0">Lampiran:</p>

          <li style="padding-bottom: 0">Foto diri petani</li>
          <li style="padding-bottom: 0">Identitas diri petani (KTP)</li>
          <li style="padding-bottom: 0">Spesifikasi Teknis</li>
          <li style="padding-bottom: 0">Peta polygon lahan petani</li>
          <li style="padding-bottom: 0">Bukti dokumen kepemilikan lahan</li>
        </ol>
        <div
          class="d-flex"
          style="flex-direction: column; justify-content: flex-end"
        ></div>
        <qr-code v-if="data.mou_no" :text="data.mou_no" :size="130"></qr-code>
      </div>
    </section>

    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <div
        class="textblack"
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          padding-top: 1em;
        "
      >
        <div style="width: 30%">
          <img :src="data.farmer_photo" style="width: 100%; height: auto" />
        </div>

        <div style="width: 50%">
          <img :src="data.farmer_ktp_photo" style="width: 100%; height: auto" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import VueQRCodeComponent from "vue-qrcode-component";

moment.locale("id");
export default {
  name: "mou-html",
  components: {
    "qr-code": VueQRCodeComponent,
  },
  props: {
    data: {
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      formatDate(format) {
        return moment().format(format);
      },
    };
  },
};
</script>

<style scoped>
.text-09-em {
  font-size: 0.9em;
}

.text-1-em {
  font-size: 1em;
}
.text-11-em {
  font-size: 1.1em;
}

.text-08-em {
  font-size: 0.8em;
}

.pdf-item {
  padding-block: 2.5em;
  padding-inline: 2.5em;
}
.text-black {
  color: black !important;
}

.text-italic {
  font-style: italic;
}

.table-1 {
  width: 100%;
}

.table-1 tr td:nth-child(1) {
  width: 20%;
}

.table-1 tr td:nth-child(2)::before {
  content: ": ";
}

.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-col {
  flex-direction: column;
}

.font-weight-bold {
  font-weight: bold;
}

.mb-5 {
  margin-bottom: 1.9em !important;
}

.mt-5 {
  margin-top: 1.9em !important;
}

ul,
ol {
  padding-left: 24px !important;
}

ol li,
ul li {
  padding-bottom: 1em;
  font-size: 0.95em;
}

p {
  margin-bottom: 0.5em;
  font-size: 0.95em;
}

table tr td {
  font-size: 0.95em;
}
</style>
