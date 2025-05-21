import { literal } from "sequelize";

export default (sequelize, DataTypes) => {
    const KinSwmp = sequelize.define('KinSwmp', {
        kode: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            defaultValue: literal(`nextval('"kinerja".kin_swmp_kode_seq'::regclass)`)
        },
        tahun: {
            type: DataTypes.CHAR(4),
            allowNull: true
        },
        semester: {
            type: DataTypes.CHAR(2),
            allowNull: true
        },
        id_dosen: {
            type: DataTypes.CHAR(15),
            allowNull: true
        },
        id_kegiatan: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        judul_kegiatan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_jenjang_pendidikan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_program_studi: {
            type: DataTypes.UUID,
            allowNull: true
        },
        tahun_lulus: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tanggal_lulus: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        nomor_ijazah: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        beban: {
            type: DataTypes.DECIMAL(5,3),
            allowNull: true
        },
        verifikasi: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        verifikator: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        komentar_verifikator: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        keterangan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        first_create: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: literal('CURRENT_TIMESTAMP')
        },
        user_create: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        last_update: {
            type: DataTypes.DATE(6),
            allowNull: true
        },
        user_update: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        asal_koneksi: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        metode_entri: {
            type: DataTypes.CHAR(3),
            allowNull: true
        },
        aktif: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        },
        id_pf: {
            type: DataTypes.UUID,
            allowNull: true
        },
        asal_tabel_pf: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sk_penugasan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_jenis_diklat: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tahun_diklat: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tingkat_diklat: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        no_sertifikat: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tanggal_sertifikat: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        lokasi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tanggal_mulai: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        tanggal_selesai: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        jumlah_mahasiswa: {
            type: DataTypes.DECIMAL(5,0),
            allowNull: true
        },
        kelas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sks_mk: {
            type: DataTypes.DECIMAL(4,2),
            allowNull: true
        },
        semester_sister: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tatap_muka_rencana: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tatap_muka_realisasi: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        mata_kuliah: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_kelas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        jenjang: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        kode_mk: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pertemuan_jam_kerja: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        pertemuan_luar_jam_kerja: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        total_pertemuan: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        beban_reg: {
            type: DataTypes.DECIMAL(5,3),
            allowNull: true
        },
        beban_tambah_mhs: {
            type: DataTypes.DECIMAL(5,3),
            allowNull: true
        },
        beban_tambah_jadwal: {
            type: DataTypes.DECIMAL(5,3),
            allowNull: true
        },
        jns_kelas: {
            type: DataTypes.CHAR(1),
            allowNull: true
        },
        status_bim_kkn: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        nama: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nomor_induk: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        judul_bahan_ajar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_jenis_bahan_ajar: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        nama_penerbit: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tanggal_terbit: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        id_kategori_capaian_luaran: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isbn: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bahasa: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tingkat_publikasi: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jns_isbn: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_halaman: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        judul_makalah: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nama_pertemuan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        penyelenggara: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tanggal_pelaksanaan: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        id_tingkat_pertemuan: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_jenis_tugas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tanggal_mulai_tugas: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        tanggal_selesai_tugas: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        nama_bimbingan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        jabatan_fungsional_pembimbing: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        jabatan_fungsional_bimbingan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_perguruan_tinggi: {
            type: DataTypes.UUID,
            allowNull: true
        },
        deskripsi_kegiatan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        metode_pelaksanaan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        jumlah_jam: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        judul: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        quartile: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_jenis_publikasi: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tanggal: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        peran: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        urutan: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jml_anggota: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tkt_publikasi: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        corresponding_author: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        sinta: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tkt_publikasi_jurnal: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        nomor_paten: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pemberi_paten: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        jenis_paten: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_afiliasi: {
            type: DataTypes.UUID,
            allowNull: true
        },
        id_jenis_skim: {
            type: DataTypes.UUID,
            allowNull: true
        },
        tanggal_sk_penugasan: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        id_kategori_pembicara: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_media_publikasi: {
            type: DataTypes.UUID,
            allowNull: true
        },
        peran_jurnal: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status_jurnal: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tkt_pengelola_jurnal_int: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        tkt_pengelola_jurnal_nas: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_jenis_kepanitiaan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        instansi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        peran_panitia: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tingkat_panitia: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        klasifikasi_panitia: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        jumlah_minggu: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_artikel: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_dosen: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_buku: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_tendik: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_proposal: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_uker: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_prodi: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jumlah_judul: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        klasifikasi_anggota_panitia: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tanggal_mulai_keanggotaan: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        tanggal_selesai_keanggotaan: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        instansi_profesi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        peran_anggota_profesi: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        peran_pertemuan_ilmiah: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_tingkat_penghargaan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_jenis_penghargaan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        instansi_pemberi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tahun_penghargaan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        jenis_terbitan_buku_pelajaran: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        peringkat_penghargaan: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        jenis_tim_penilai: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        id_sk: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        hash: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        capaian: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
    },
    {
        schema: 'kinerja',
        tableName: 'kin_swmp',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    KinSwmp.associate = (models) => {
        KinSwmp.belongsTo(models.KegiatanRemun, {
            foreignKey: 'id_kegiatan',
            as: 'Kegiatan_Kin'
        });
        KinSwmp.belongsTo(models.DataDosen, {
            foreignKey: 'id_dosen',
            as: 'Dosen_Kin'
        });
    }
    return KinSwmp;
}