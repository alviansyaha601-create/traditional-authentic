const menuContainer = document.getElementById('menuContainer');
function renderMenu(provinsiAktif) {
    menuContainer.innerHTML = '';
    const menuTerfilter = dataBaseMenu.filter(item => item.provinsi === provinsiAktif);

    if (menuTerfilter.length === 0) {
        menuContainer.innerHTML = '<p style="color:#ccc;">Menu untuk provinsi ini belum tersedia.</p>';
        return;
    }

    menuTerfilter.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-menu';
        card.setAttribute('data-provinsi', item.provinsi);
        card.innerHTML = `
            <div class="foto-menu">
                <img src="${item.gambar}" alt="${item.nama}">
            </div>
            <div class="info-menu">
                <h3>${item.nama}</h3>
                <p>${item.deskripsi}</p>
                <div class="footer-card">
                    <span class="harga">${item.harga}</span>
                    <button class="btn-pesan">Pesan</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);

        const tombolPesan = card.querySelector('.btn-pesan');
        tombolPesan.addEventListener('click', () => {
            tambahKeCart(item);
        });
    });
}

const tombolProvinsi = document.querySelectorAll('.kapsul-provinsi');

tombolProvinsi.forEach(tombol => {
    tombol.addEventListener('click', () => {
        tombolProvinsi.forEach(btn => btn.classList.remove('active'));
        tombol.classList.add('active');

        const provinsiDipilih = tombol.getAttribute('data-provinsi');
        renderMenu(provinsiDipilih);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tombolDefault = document.querySelector('.kapsul-provinsi[data-provinsi="aceh"]');
    renderMenu('aceh');
})

const namaProvinsiContainer = document.querySelector('.nama-provinsi');
const panahKiri = document.querySelector('.panah-kiri');
const panahKanan = document.querySelector('.panah-kanan');

const jarakGeser = 300;

if (panahKiri && namaProvinsiContainer) {
  panahKiri.addEventListener('click', () => {
    namaProvinsiContainer.scrollBy({
      left: -jarakGeser,
      behavior: 'smooth'
    });
  });
}

if (panahKanan && namaProvinsiContainer) {
  panahKanan.addEventListener('click', () => {
    namaProvinsiContainer.scrollBy({
      left: jarakGeser,
      behavior: 'smooth'
    });
  });
}

const elemenReveal = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.15
});

elemenReveal.forEach(el => revealObserver.observe(el));

let cartData = [];

const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
});

function tutupCart() {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
}
cartClose.addEventListener('click', tutupCart);
cartOverlay.addEventListener('click', tutupCart);

function hargaKeAngka(hargaString) {
    return parseInt(hargaString.replace(/[^0-9]/g, ''));
}

function angkaKeHarga(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function tambahKeCart(item) {
    const itemAda = cartData.find(i => i.id === item.id);
    if (itemAda) {
        itemAda.qty += 1;
    } else {
        cartData.push({ ...item, qty: 1 });
    }
    renderCart();
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
}

function renderCart() {
    cartItemsContainer.innerHTML = '';

    if (cartData.length === 0) {
        cartItemsContainer.appendChild(cartEmpty);
        cartTotalEl.textContent = angkaKeHarga(0);
        cartCountEl.textContent = '0';
        cartCountEl.classList.remove('show');
        return;
    }

    let total = 0;
    let totalQty = 0;

    cartData.forEach(item => {
        const hargaAngka = hargaKeAngka(item.harga);
        const subtotal = hargaAngka * item.qty;
        total += subtotal;
        totalQty += item.qty;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.gambar}" alt="${item.nama}">
            </div>
            <div class="cart-item-top">
                <h4>${item.nama}</h4>
                <span class="cart-item-harga">${angkaKeHarga(subtotal)}</span>
            </div>
            <div class="cart-item-bottom">
                <div class="cart-qty">
                    <button class="qty-min" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <span>${item.qty}</span>
                    <button class="qty-plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                </div>
                <button class="cart-remove" data-id="${item.id}">Hapus</button>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });

    cartTotalEl.textContent = angkaKeHarga(total);
    cartCountEl.textContent = totalQty;
    cartCountEl.classList.add('show');

    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => ubahQty(btn.dataset.id, 1));
    });
    document.querySelectorAll('.qty-min').forEach(btn => {
        btn.addEventListener('click', () => ubahQty(btn.dataset.id, -1));
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => hapusItem(btn.dataset.id));
    });
}

function ubahQty(id, perubahan) {
    const item = cartData.find(i => i.id === id);
    if (!item) return;
    item.qty += perubahan;
    if (item.qty <= 0) {
        cartData = cartData.filter(i => i.id !== id);
    }
    renderCart();
}

function hapusItem(id) {
    cartData = cartData.filter(i => i.id !== id);
    renderCart();
}