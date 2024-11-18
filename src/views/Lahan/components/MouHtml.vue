<template>
  <div style="border-right: 1px solid transparent" v-if="data">
    <section class="pdf-item">
      <h2 class="text-center text-black font-weight-bold text-1-em" style="margin-bottom: 1.5em">
        PERJANJIAN KERJASAMA<br />
        PENANAMAN, PEMELIHARAAN DAN PEMANTAUAN POHON<br />
        DALAM PROYEK KARBON<br />
        Antara<br />
        YAYASAN BUMI HIJAU LESTARI<br />
        Dengan <br />
        PETANI PEMILIK LAHAN
      </h2>

      <p class="text-black">
        Perjanjian ini dibuat pada hari {{ formatDate("dddd") }} tanggal
        {{ formatDate("DD") }}
        bulan {{ formatDate("MMMM") }} tahun {{ formatDate("YYYY") }},<br />
        bertempat di <span style="text-decoration: underline !important;padding: 0 50px;"></span>, oleh dan antara:
      </p>
      <table class="text-black table-1" style="margin-bottom: 1em">
        <tr>
          <td>Nama</td>
          <td>:</td>
          <td>Pandu Budi Wahono</td>
        </tr>
        <tr>
          <td>Jabatan</td>
          <td>:</td>
          <td>Direktur Yayasan Bumi Hijau Lestari</td>
        </tr>
        <tr >
          <td style="vertical-align: top">Alamat</td>
          <td style="vertical-align: top">:</td>
          <td>
            Jl. Telaga Bodas Raya No. 42 , Kel. Karangrejo, Kec. Gajahmungkur, Semarang 50235
          </td>
        </tr>
        <tr>
          <td>No. Telepon</td>
          <td>:</td>
          <td>+62 815-5438-4357</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>:</td>
          <td>pandu@trees4trees.org / info@trees4trees.org</td>
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
          <td>:</td>
          <td>{{ data.farmer_name }}</td>
        </tr>
        <tr>
          <td style="vertical-align: top">Alamat</td>
          <td style="vertical-align: top">:</td>
          <td>{{ data.farmer_address }}</td>
        </tr>
        <tr>
          <td>No. KTP</td>
          <td>:</td>
          <td>{{ data.farmer_nik }}</td>
        </tr>
        <tr>
          <td>No. Telepon</td>
          <td>:</td>
          <td>{{ ''}}</td>
        </tr>
      </table>

      <p class="text-black">
        Bertindak atas nama sendiri sebagai pemilik sah dari lahan yang
        digunakan untuk Proyek ini, yang selanjutnya disebut
        <strong>"PIHAK KEDUA"</strong>.
      </p>

      <p class="text-black">
        <strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong>, yang selanjutnya secara sendiri-sendiri disebut
        sebagai
        <strong>“PIHAK”</strong> dan secara bersama-sama disebut sebagai
        <strong>“PARA PIHAK”</strong>, terlebih dahulu menerangkan hal-hal sebagai berikut:
      </p>

      <ol>
        <li class="text-black">
          Bahwa <strong>PIHAK PERTAMA</strong> adalah
          Badan Usaha Yayasan yang bergerak di bidang Lingkungan
          Hidup, Sosial, Pendidikan <strong>PIHAK PERTAMA</strong> bertindak sebagai pemrakarsa proyek,
          bertanggung jawab atas pengembangan, implementasi, dan pengelolaan proyek karbon.
        </li>
        <li class="text-black">
          Bahwa <strong>PIHAK KEDUA</strong> adalah pemilik sah dari lahan yang akan digunakan dalam rangka
          penanaman, pemeliharaan dan pemantauan pohon dalam Proyek karbon oleh <strong>PIHAK
            PERTAMA</strong>, dan sebagai anggota Land-Owner Group, sebuah badan hukum yang didirikan
          untuk mewakili pemilik lahan yang terlibat dalam Proyek karbon.
        </li>
      </ol>

      <p class="text-black" style="margin-top: 0">
        Berdasarkan hal-hal tersebut di atas, <strong>PARA PIHAK</strong> dengan ini setuju untuk mengadakan perjanjian
        sebagai berikut:
      </p>
    </section>

    <section class="pdf-item mt-4">
      <p class="text-center text-black font-weight-bold mt-5">
        Pasal 1
      </p>
      <p class="text-center text-black font-weight-bold mb-5">KETENTUAN UMUM</p>
      <p class="text-black" style="margin-bottom: 0.5em">
        Dalam perjanjian ini, yang dimaksud dengan:
      </p>
      <ol class="text-09-em">
        <li class="text-black" style="padding-bottom: 0">
          <strong>Proyek Karbon</strong> adalah kegiatan yang bertujuan untuk
          mengurangi emisi gas rumah kaca melalui penanaman pohon di lahan milik Petani Pemilik Lahan secara
          berkelanjutan dan
          jangka panjang, sesuai dengan peraturan perundangan yang berlaku di Indonesia.
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Monitoring Project</strong> adalah
          Pola pilihan model untuk penggunaan lahan untuk penanaman
          pohon dalam project ini, yang terdiri dari Model 1 (penanaman pohon kayu yang dapat di
          tebang setelah 6 tahun), Model 2 (penanaman pohon kayu dan MPTS dengan pohon kayu
          dapat ditebang setelah 6 tahun dan pohon MPTS tidak ditebang), Model 3 (penanaman
          pohon kayu dan MPTS yang tidak akan ditebang).
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Monitoring, Reporting, and Verification (MRV)</strong> adalah
          proses pemantauan, pelaporan, dan verifikasi yang dilakukan untuk
          memastikan bahwa semua kegiatan yang dilakukan dalam proyek karbon ini
          sesuai dengan rencana yang telah disepakati dan memenuhi standar yang
          ditetapkan oleh pemerintah Indonesia dan standar karbon terverifikasi.
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Platform Teknologi Informasi</strong> adalah sistem atau
          perangkat lunak yang dipersiapkan oleh PIHAK PERTAMA untuk digunakan dalam
          monitoring, pelaporan, dan verifikasi (MRV) kegiatan penanaman dan
          pertumbuhan pohon dalam proyek karbon ini. Aplikasi ini memfasilitasi
          pemantauan secara digital terhadap keberhasilan penanaman, pertumbuhan
          pohon, serta penilaian nilai karbon yang dihasilkan.
        </li>

        <li class="text-black" style="padding-bottom: 0">
          <strong>Multi-Purpose Tree Species (MPTS)</strong> adalah jenis pohon
          serbaguna yang selain memiliki manfaat ekologis juga memberikan
          manfaat ekonomi bagi masyarakat, seperti hasil hutan bukan kayu.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Lahan yang Sah dan Legal</strong> adalah lahan yang secara
          hukum diakui sebagai milik PIHAK KEDUA, yang bebas dari sengketa, sita
          jaminan, atau hak tanggungan lain yang dapat menghalangi pelaksanaan
          proyek karbon ini.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Kompensasi Manfaat Karbon</strong> adalah pembayaran yang
          dilakukan oleh PIHAK PERTAMA kepada PIHAK KEDUA sebagai imbalan atas
          penanaman, pemeliharaan, dan pertumbuhan pohon yang dilakukan dalam
          proyek ini, berdasarkan kesepakatan perwakilan pemilik lahan
          atau Land-owner Group.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Land Owner Group</strong> adalah Badan Hukum yang dibentuk oleh PIHAK KEDUA yang
          keanggotaannya terdiri dari pemilik lahan yang ikut serta dalam proyek karbon, dimana
          badan hukum tersebut bertanggung jawab secara kolektif memastikan bahwa lahan yang
          dikelola memenuhi persyaratan hukum dan standar teknis proyek karbon.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Pekerja Anak</strong> adalah pekerja yang lebih muda dari usia minimum sesuai peraturan yang
          berlaku di Indonesia.
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>Kerja Paksa</strong> adalah Setiap pekerjaan yang tidak dilakukan oleh seseorang secara sukarela,
          dilakukan dibawah ancaman hukuman, sebagai pembayaran pinjaman atau hutang,
          penipuan, intimidasi, ancaman, kekerasan, atau bentuk pemaksaan lainnya yang tidak
          sesuai dengan peraturan yang berlaku di Indonesia.
        </li>
      </ol>

      <div class="html2pdf__page-break"></div>
      <div>
        <br /><br /><br />
        <p class="text-center text-black font-weight-bold mb-1 mt-5">
          Pasal 2
        </p>
        <p class="text-center text-black font-weight-bold mb-5">RUANG LINGKUP PERJANJIAN</p>
        <ol>
          <li class="text-black" style="padding-bottom: 0">
            <strong>PARA PIHAK</strong> menyepakati bahwa isi perjanjian ini akan mengikuti sepenuhnya perjanjian
            penggunaan lahan untuk penanaman, pemeliharaan dan pemantauan pohon Proyek karbon
            yang dibuat dan ditandatangani Land Owner Group.
          </li>
          <li class="text-black" style="padding-bottom: 0">
            <strong>PIHAK KEDUA</strong> dengan ini menyetujui lahan miliknya yang sah dan legal diikutsertakan dalam
            Proyek karbon yang dikembangkan <strong>PIHAK PERTAMA</strong>, dan mematuhi persyaratan yang
            ditetapkan dalam Proyek karbon.
          </li>
          <li class="text-black" style="padding-bottom: 0">
            <strong>PIHAK KEDUA</strong> menyetujui menjadi anggota dan menyerahkan kuasa dalam pengelolaan
            Proyek karbon kepada Land Owner Group yang akan dibentuk secara partisipatif dan
            berjenjang oleh Seluruh Pemilik Lahan yang ikut dalam Proyek karbon ini.
          </li>
          <li class="text-black" style="padding-bottom: 0">
            <strong>PIHAK KEDUA</strong> memberikan kuasa dalam menyusun perjanjian proyek karbon kepada Land
            Owner Group mencakup hak untuk mengatur PIHAK KEDUA dalam memenuhi kewajiban
            pengelolaan Proyek karbon.
          </li>
        </ol>
      </div>
    </section>
    <section class="pdf-item ">
      <p class="text-center text-black font-weight-bold mb-1">Pasal 3</p>
      <p class="text-center text-black font-weight-bold mb-5">
        HAK DAN KEWAJIBAN
      </p>
      <ol class="text-09-em bold-marker">
        <li class="text-black" style="padding-bottom: 0">
          <strong>HAK PIHAK PERTAMA:</strong>
          <ol type="a">
            <li>Mengatur semua rencana dan operasional kegiatan Proyek karbon, membangun
              persemaian, memproduksi dan mendistribusikan bibit selama masa proyek, serta
              mengatur pemenuhan persyaratan Proyek karbon yang harus dipenuhi <strong>PIHAK KEDUA.</strong>
            </li>
            <li>
              Melakukan evaluasi, validasi dan verifikasi data hasil pemantauan Proyek karbon melalui
              aplikasi platform teknologi informasi, atau survey lapangan di lahan <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Mendapatkan kuasa <strong>PIHAK KEDUA</strong> atas sertifikat pengurangan emisi karbon yang
              dikeluarkan oleh Pemerintah Indonesia atau Lembaga Verifikator dan Validator Proyek
              Karbon.
            </li>
            <li>
              Mendapatkan informasi termasuk namun tidak terbatas pada data pribadi, data lahan,
              gambar, video, wawancara tertulis dan mempublikasikan Proyek karbon ini.
            </li>
            <li>
              Menghentikan kepesertaan Proyek karbon atau menghentikan pemberian kompensasi
              manfaat karbon atau mengakhiri perjanjian jika <strong>PIHAK KEDUA</strong> terbukti melanggar
              ketentuan perjanjian yang dibuat Land Owner Group.
            </li>
          </ol>
        </li>
        <div class="html2pdf__page-break"></div>
        <br /><br /><br /><br /><br /><br />
        <li class="text-black" style="padding-bottom: 0">
          <strong>KEWAJIBAN PIHAK PERTAMA:</strong>
          <ol type="a">
            <li>
              Memeriksa kriteria kelayakan proyek melalui citra satelit dan melakukan survey lapangan.
            </li>
            <li>
              Memeriksa dokumen lahan yang sah dan legal <strong>PIHAK KEDUA</strong> sesuai ketentuan proyek.
            </li>
            <li>
              Melakukan pengukuran, pemetaan serta pendataan lahan milik <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Menyediakan pendanaan yang sesuai dan layak untuk Proyek karbon yang akan dilaksanakan di lahan milik
              <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Memproduksi dan menyediakan bibit pohon (kayu/ MPTS) untuk <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Mendistribusikan bibit pohon (kayu/ MPTS) ke lokasi terdekat <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Memberikan pelatihan tentang praktik kehutanan yang baik dan pelatihan aplikasi platform
              informasi teknologi kepada <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Memberikan dukungan teknis kepada <strong>PIHAK KEDUA</strong> untuk penanaman, pemeliharaan dan
              dan pemantauan kegiatan proyek karbon.
            </li>
            <li>
              Memberikan dukungan pendampingan, komunikasi dan hotline untuk pengaduan dan
              keluhan.
            </li>
            <li>
              Memberikan kompensasi manfaat karbon kepada <strong>PIHAK KEDUA</strong> sesuai dengan
              kesepakatan dengan Land Owner Group sesuai persyaratan Proyek karbon.
            </li>
            <li>
              Memperbaiki atau memberikan kompensasi atas kerusakan pada tanaman, jalan, pagar,
              atau gerbang yang disebabkan oleh PIHAK PERTAMA.
            </li>
            <li>
              PIHAK PERTAMA akan memberikan pemberitahuan sebelum mengakses lahan proyek
              karbon PIHAK KEDUA.
            </li>

          </ol>
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>HAK PIHAK KEDUA:</strong>
          <ol type="a">
            <li>
              Seluruh manfaat dan hasil non-karbon, baik dalam bentuk finansial maupun non-finansial dalam Proyek karbon
              ini akan menjadi hak dan milik <strong>PIHAK KEDUA</strong>.
            </li>
            <li>
              Mendapatkan dukungan teknis dari <strong>PIHAK PERTAMA</strong> dalam pengelolaan Proyek karbon termasuk
              pemantauan
              keberhasilan, serta pelatihan-pelatihan dan penggunaan aplikasi platform teknologi informasi yang
              digunakan dalam Proyek Karbon.
            </li>
            <li>
              Menerima bagian dari kompensasi manfaat karbon yang dihasilkan dari pelaksanaan Proyek Karbon sesuai
              kesepakatan pembagian kompensasi manfaat karbon dengan Land Owner Group
            </li>
            <li>
              Mengajukan usulan, masukan dan keluhan terkait pelaksanaan Proyek Karbon kepada PIHAK PERTAMA secara
              langsung atau melalui saluran komunikasi yang disepakati, serta memiliki hak untuk mengajukan penyelesaian
              sengketa yang mungkin timbul selama pelaksanaan proyek.
            </li>
          </ol>
        </li>
        <li class="text-black" style="padding-bottom: 0">
          <strong>KEWAJIBAN PIHAK KEDUA:</strong>
          <ol type="a">
            <li>
              Menjadi anggota Land Owner Group yang akan dibentuk secara partisipatif dan berjenjang oleh Seluruh
              Pemilik Lahan yang mengikuti Proyek Karbon ini.
            </li>
            <li>
              Menyiapkan dokumen legal lahan yang sah sebagai miliknya sebagai syarat kepesertaan Proyek karbon ini.
            </li>
            <li>
              Dalam hal lahan belum bersertifikat, PIHAK KEDUA melampirkan salinan dokumen peralihan hak kepemilikan
              lahan serta surat keterangan desa dan surat keterangan bebas sengketa dari pemerintah desa.
            </li>
            <div class="html2pdf__page-break"></div>
            <br /><br /><br /><br /><br /><br />
            <li>
              Menjamin lahan yang dikerjasamakan tidak dalam keadaan sengketa serta bebas dari sita jaminan dan atau
              tidak dalam keadaan dijadikan sebagai jaminan hutang kepada pihak manapun.
            </li>
            <li>
              Bersedia memberikan dokumen yang diperlukan oleh PIHAK PERTAMA dan mengizinkan pihak-pihak berkepentingan
              lainnya dalam pengembangan proyek untuk melakukan kegiatan di lahan PIHAK KEDUA.
            </li>
            <li>
              Melakukan pengambilan bibit di lokasi yang disepakati.
            </li>
            <li>
              Melakukan penanaman bibit pohon dengan jumlah dan jenis yang sesuai dengan luas lahan
              dan sesuai persyaratan proyek.
            </li>
            <li>
              Melakukan penanaman ulang apabila pohon Proyek karbon ini dipanen selama jangka
              waktu program untuk Model Project 1 dan 2.
            </li>
            <li>
              Melakukan pemeliharaan dan pemantauan pohon sampai dengan jangka waktu
              berakhirnya proyek sesuai petunjuk dan arahan pendamping yang akan diberikan PIHAK PERTAMA untuk
              keberhasilan program.
            </li>
            <li>
              Mengikuti dan mentaati hal-hal sebagai berikut:
              <ul style="list-style-type:disc">
                <li>
                  Mentaati hukum-hukum yang berlaku baik lokal, nasional dan internasional.
                </li>
                <li>
                  Tidak melakukan pembukaan hutan dan penebangan pohon, kecuali bagian tugas berdasarkan kewenangan
                  legal.
                </li>
                <li>
                  Tidak menggunakan bibit tanaman dari modifikasi genetic/ GMO.
                </li>
                <li>
                  Tidak menggunakan bahan kimia berbahaya/ beracun sesuai peraturan Indonesia dan WHO, dan menggunakan
                  cara-cara yang ramah lingkungan sesuai arahan PIHAK PERTAMA.
                </li>
                <li>
                  Tidak menggunakan pekerja anak, serta tidak menggunakan tenaga kerja secara paksa.
                </li>
                <li>
                  Melindungi kawasan-kawasan konservasi dan satwa-tumbuhan yang dilindungi serta melindungi situs
                  warisan budaya.
                </li>
              </ul>
            </li>
          </ol>
        </li>
      </ol>

      <br /><br />
      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 4</p>
      <p class="text-center text-black font-weight-bold mb-5">
        JANGKA WAKTU PERJANJIAN
      </p>

      <p class="text-black">
        Jangka waktu perjanjian ini adalah 41 (empat puluh satu) tahun, dimulai dari tanggal 01 Desember
        2024 sampai dengan berakhirnya project pada tanggal 01 Januari 2065. Perjanjian ini akan
        dievaluasi setiap tahun melalui pengukuran dan pemantauan pohon, dan pertemuan berkala untuk
        menilai perkembangan proyek dan menyusun pelaporan proyek.
      </p>

      <div class="html2pdf__page-break"></div>
      <br /><br /><br /><br />
      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 5</p>
      <p class="text-center text-black font-weight-bold mb-5">
        PERALIHAN HAK
      </p>

      <ol type="1">
        <li class="text-black">
          Dalam hal <strong>PIHAK KEDUA</strong> memutuskan untuk mengalihkan kepemilikan lahannya kepadaorang lain
          untuk sementara atau
          selamanya. <strong>PIHAK KEDUA</strong> harus menyatakan 30 harisebelum peralihan hak, secara tertulis,
          sehingga tidak
          merugikan perkembangan Proyekkarbon ini. Kemudian, hak dan kewajiban yang sama harus disampaikan kepada
          pemilik baruoleh <strong>PIHAK KEDUA</strong>.
        </li>
        <li class="text-black">
          Dalam hal kematian <strong>PIHAK KEDUA</strong> sebagai pemegang hak kepemilikan lahan, maka manfaatdan
          kewajiban <strong>PIHAK KEDUA</strong>
          dalam perjanjian Proyek ini dapat beralih ke ahli waris yang sah.
        </li>
        <li class="text-black">
          Dalam hal lahan yang digunakan dalam proyek ini menjadi objek sita jaminan, <strong>PIHAK KEDUAwajib</strong>
          segera
          memberitahukan <strong>PIHAK PERTAMA</strong> secara tertulis, kemudian PARA <strong>PIHAK
            akanbersama</strong>-sama menentukan langkah-langkah
          yang diperlukan, termasuk kemungkinanpenghentian proyek dan penghentian kompensasi oleh <strong>PIHAK
            PERTAMA</strong>.
        </li>
        <li class="text-black">
          Jika <strong>PIHAK PERTAMA</strong> tidak dapat melanjutkan Proyek karbon ini karena pembubaran,likuidasi,
          krisis ekonomi, atau
          sebab lain yang menyebabkan ketidakmampuan untukmelanjutkan Proyek sebelum Proyek berakhir, maka seluruh
          manfaat dan nilai kompensasiyang sudah dibayarkan atau diberikan <strong>PIHAK PERTAMA</strong> menjadi
          sepenuhnya milik
          <strong>PIHAK KEDUA</strong>.
        </li>

      </ol>
    </section>

    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold mb-1">Pasal 6</p>
      <p class="text-center text-black font-weight-bold mb-5">
        KEADAAN KAHAR (FORCE MAJEURE)
      </p>

      <ol class="text-black">
        <li class="text-black">
          Keadaan kahar berarti semua peristiwa yang berada di luar kendali para pihak dalam perjanjian ini dan yang
          tidak dapat diprediksi atau diperkirakan tidak dapat dihindari, seperti bencana alam (longsor, likuifaksi,
          banjir, kebakaran alam, gempa bumi, dll) atau bencana tak terduga
          (peperangan, huru-hara, dll).
        </li>
        <li class="text-black">
          Jika salah satu pihak dalam perjanjian ini, karena Keadaan Kahar tidak dapat melaksanakan tanggung jawabnya
          secara keseluruhan atau sebagian, tanggung jawab pihak tersebut, sejauh mereka dipengaruhi oleh Keadaan Kahar
          maka proyek akan diberhentikan dan tidak dikenakan Penalti atau penggantian apapun.
        </li>
        <li class="text-black">
          Pihak yang mengalami Keadaan Kahar harus segera memberitahu pihak lain secara tertulis dan harus memberikan
          bukti yang tepat tentang terjadinya dan durasi “Keadaan Kahar” tersebut, selambatnya 7 (tujuh) hari setelah
          kejadian.
        </li>
      </ol>
    </section>
    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold mb-1 mt-4">Pasal 7</p>
      <p class="text-center text-black font-weight-bold mb-5">PERSELISIHAN</p>

      <p class="text-black">
        Bilamana terjadi perselisihan dałam pelaksanaan Perjanjian Kerjasama ini akan diselesaikan
        secara musyawarah dan mufakat antara PARA PIHAK, dan apabila tidak tercapai kesepakatan
        maka PARA PIHAK memilih tempat kedudukan hukum (domisili) yang tetap pada Kantor Panitera
        Pengadilan Negeri Kabupaten Bandung, Provinsi Jawa Barat.
      </p>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 8</p>
      <p class="text-center text-black font-weight-bold mb-5">
        PENALTI DAN SANKSI
      </p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          Perjanjian ini berakhir setelah semua hak dan kewajiban yang tercantum dalam perjanjian ini
          dan jangka waktu perjanjian telah dipenuhi oleh PARA PIHAK.
        </li>
        <li style="padding-bottom: 0">
          Perjanjian ini berakhir jika dinyatakan batal atau dibatalkan oleh keputusan pengadilan yang
          memiliki kekuatan hukum tetap.
        </li>
      </ol>
    </section>
    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <p class="text-center text-black font-weight-bold" style="margin-bottom: 0">
        Pasal 9
      </p>
      <p class="text-center text-black font-weight-bold" style="margin-bottom: 0">
        KERAHASIAAN DAN PERLINDUNGAN DATA PRIBADI
      </p>

      <ol class="text-black">
        <li style="padding-bottom: 0">
          <strong>PARA PIHAK</strong> wajib menjaga kerahasiaan semua data dan informasi yang
          diperoleh selama pelaksanaan perjanjian ini, termasuk namun tidak
          terbatas pada data pribadi, data lahan, dan informasi Proyek.
        </li>
        <li style="padding-bottom: 0">
          <strong>PARA PIHAK</strong> bertanggung jawab untuk memastikan bahwa data pribadi disimpan dengan
          aman dan hanya digunakan untuk tujuan yang telah disepakati dalam perjanjian
        </li>
        <li style="padding-bottom: 0">
          Jika terjadi pelanggaran terhadap kerahasiaan atau penggunaan data pribadi, PIHAK yang
          mengetahui pelanggaran tersebut harus segera melaporkannya kepada pihak lainnya dan
          mengambil langkah-langkah yang diperlukan untuk mengatasi pelanggaran tersebut.
        </li>
      </ol>

      <p class="text-center text-black font-weight-bold mb-1 mt-5">Pasal 10</p>
      <p class="text-center text-black font-weight-bold" style="margin-bottom: 0">
        PENUTUP
      </p>
      <ol type="1">
        <li class="text-black">
          Perjanjian ini dibuat dan ditandatangani oleh PARA PIHAK dengan itikad baik dan penuh kesadaran, tanpa adanya
          paksaan dari pihak manapun.
        </li>
        <li class="text-black">
          Segala perubahan atau penambahan terhadap perjanjian ini hanya dapat dilakukan dengan persetujuan tertulis
          dari kedua belah pihak.
        </li>
        <li class="text-black">
          Perjanjian ini dibuat dalam 2 (dua) rangkap asli, masing-masing pihak memegang 1 (satu) rangkap asli yang
          semuanya memiliki kekuatan hukum yang sama.
        </li>
      </ol>

      <div class="text-black" style="
          padding-top: 2em;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        ">
        <p>Bandung, {{ data.mou_start }}</p>
      </div>

      <div class="d-flex flex-row text-black" style="justify-content: space-between">
        <div style="
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
          <p class="font-weight-bold mb-5 pb-2">PIHAK PERTAMA</p>

          <div class="materai mb-5" style="
              padding-inline: 2em;
              padding-block: 1em;
              border: 1px solid black;
              transform: translateX(-50%);
            ">
            Materai
          </div>

          <p class="font-weight-bold mb-0" style="text-decoration: underline">
            Pandu Budi Wahono
          </p>
          <p class="text-black">Yayasan Bumi Hijau Lestari</p>
        </div>
        <div style="
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
          <p class="font-weight-bold mb-5 pb-2">PIHAK KEDUA</p>

          <div class="materai mb-5" style="
              padding-inline: 2em;
              padding-block: 1em;
              border: 1px solid black;
              transform: translateX(-50%);
            ">
            Materai
          </div>

          <p class="font-weight-bold mb-0" style="text-decoration: underline">
            {{ data.farmer_name }}
          </p>
          <p class="text-black">Pemilik Lahan</p>
        </div>
      </div>

      <div class="d-flex flex-row text-black" style="
          justify-content: space-between;
          margin-top: 2em;
          border-bottom: 1px solid black;
          padding-bottom: 1em;
        ">
        <ol>
          <p class="font-weight-bold mb-0">Lampiran:</p>

          <li style="padding-bottom: 0">Data-data Project</li>
          <li style="padding-bottom: 0">Foto diri petani</li>
          <li style="padding-bottom: 0">Identitas diri petani (KTP)</li>
          <li style="padding-bottom: 0">Peta polygon (termasuk batas lahan dan eligible area)</li>
          <li style="padding-bottom: 0">Bukti dokumen kepemilikan lahan</li>
          <li style="padding-bottom: 0">Tata waktu kegiatan proyek</li>
        </ol>
        <div class="d-flex" style="flex-direction: column; justify-content: flex-end"></div>
        <qr-code v-if="data.mou_no" :text="data.mou_no" :size="130"></qr-code>
      </div>
    </section>

    <div class="html2pdf__page-break"></div>
    <section class="pdf-item">
      <div class="textblack" style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          padding-top: 1em;
        ">
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
      space: [],
      default: () => { },
    },
  },
  methods: {
    location() {
      //
    }
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
@font-face {
  font-family: 'Calibri';
  src: url('/public/fonts/Calibri.ttf');
}

body * {
  font-family: 'Calibri', Geneva, Tahoma, sans-serif !important;
}

/* .text-09-em {
  font-size: 0.9em;
} */

.text-1-em {
  font-size: 1.04em;
  line-height: 0.5cm;
}

.text-11-em {
  font-size: 1.1em;
}

.text-08-em {
  font-size: 0.8em;
}

.pdf-item {
  padding-block: 6.1em;
  padding-inline: 5.5em;
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

.table-1 tr {
  line-height: 0.45cm;
}

/* .table-1 tr td:nth-child(2)::before {
  content: ": ";
} */

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

ol.bold-marker > li::marker {
  font-weight: bold;
}

ol li,
ul li {
  padding-bottom: .2em;
  font-size: 1.05em;
}

p {
  margin-bottom: 0.7em;
  font-size: 1.04em;
  line-height: 0.5cm;
}

table tr td {
  font-size: 1.04em;
}
</style>
