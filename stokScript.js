// File: js/stokScript.js

const KEY_STORAGE = 'dataKatalogBukuApp';

// Data Dummy Awal (Hanya akan digunakan jika Local Storage kosong)
const initialDataKatalog = [
    { 
        kodeBarang: "B001", 
        namaBarang: "Dasar Pemrograman", 
        edisi: "1", 
        stok: 50, 
        harga: "Rp 150.000", 
        cover: "img/buku_pemrograman.jpg" 
    },
    { 
        kodeBarang: "B002", 
        namaBarang: "Fisika Modern", 
        edisi: "2", 
        stok: 30, 
        harga: "Rp 180.000", 
        cover: "img/buku_fisika.jpg" 
    },
    { 
        kodeBarang: "B003", 
        namaBarang: "Akuntansi Lanjut", 
        edisi: "3", 
        stok: 45, 
        harga: "Rp 220.000", 
        cover: "https://via.placeholder.com/400x200/8ac4d0/FFFFFF?text=Akuntansi" 
    }
];

// --- FUNGSI MANAJEMEN DATA (Local Storage) ---

// 1. Ambil data dari Local Storage atau gunakan data awal
function getKatalogData() {
    const storedData = localStorage.getItem(KEY_STORAGE);
    if (storedData) {
        return JSON.parse(storedData);
    }
    // Jika tidak ada di Local Storage, simpan data awal dan kembalikan
    saveKatalogData(initialDataKatalog);
    return initialDataKatalog;
}

// 2. Simpan data ke Local Storage
function saveKatalogData(data) {
    localStorage.setItem(KEY_STORAGE, JSON.stringify(data));
}

let dataKatalogBuku = getKatalogData();
const katalogGrid = document.getElementById('katalogBukuGrid');

// --- FUNGSI RENDER (Menampilkan ke HTML) ---

function renderKatalog() {
    katalogGrid.innerHTML = ''; 
    dataKatalogBuku.forEach(buku => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('katalog-item');

        const coverUrl = buku.cover && buku.cover !== "" ? buku.cover : 'img/default.jpg'; 
        
        itemDiv.innerHTML = `
            <img src="${coverUrl}" alt="Cover Buku ${buku.namaBarang}" onerror="this.onerror=null;this.src='img/default.jpg';">
            <div class="katalog-item-info">
                <h3>${buku.namaBarang}</h3>
                <p>Kode: ${buku.kodeBarang}</p>
                <p>Edisi: ${buku.edisi}</p>
                <p class="stok">Stok: ${buku.stok}</p>
                <p class="harga">${buku.harga}</p>
                <button class="button" style="padding: 8px 15px; font-size: 0.9em; margin-top: 10px;" 
                        onclick="hapusBuku('${buku.kodeBarang}')">Hapus</button>
            </div>
        `;
        katalogGrid.appendChild(itemDiv);
    });
}

// --- FUNGSI TAMBAH BUKU (Form Submit) ---

document.getElementById('formTambahStok').addEventListener('submit', function(event) {
    event.preventDefault();

    const kode = document.getElementById('inputKode').value;
    const judul = document.getElementById('inputJudul').value;
    const edisi = document.getElementById('inputEdisi').value;
    const stok = parseInt(document.getElementById('inputStok').value);
    const harga = document.getElementById('inputHarga').value;
    const cover = document.getElementById('inputCover').value; 

    // Cek duplikasi
    if (dataKatalogBuku.some(b => b.kodeBarang === kode)) {
        alert('Kode barang sudah ada. Silakan gunakan kode lain!');
        return;
    }

    const bukuBaru = { 
        kodeBarang: kode, 
        namaBarang: judul, 
        edisi: edisi, 
        stok: stok, 
        harga: harga,
        cover: cover
    };
    
    dataKatalogBuku.push(bukuBaru);
    saveKatalogData(dataKatalogBuku); // 👈 SIMPAN KE LOCAL STORAGE
    
    renderKatalog();

    alert('Buku "' + judul + '" berhasil ditambahkan dan disimpan!');
    this.reset(); 
});

// --- FUNGSI HAPUS BUKU (Aksi) ---
// Perlu didefinisikan secara global agar bisa dipanggil oleh onclick di HTML
function hapusBuku(kode) {
    if (confirm(`Yakin ingin menghapus buku dengan Kode ${kode}?`)) {
        // Filter array, hilangkan buku dengan kode yang cocok
        dataKatalogBuku = dataKatalogBuku.filter(buku => buku.kodeBarang !== kode);
        
        saveKatalogData(dataKatalogBuku); // 👈 SIMPAN PERUBAHAN
        renderKatalog();
        alert('Buku berhasil dihapus!');
    }
}


// Panggil fungsi saat halaman dimuat
renderKatalog();