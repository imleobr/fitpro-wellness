// ===========================
// CART.JS - FitPro Wellness
// Sistema de Carrinho de Compras
// Persistência em localStorage + checkout via WhatsApp
// ===========================

// Número de WhatsApp que recebe os pedidos (sem o "+")
const WHATSAPP_NUMBER = '353831588830';

// Chave usada no localStorage
const CART_KEY = 'fitpro-cart';

// ===========================
// FUNÇÕES BÁSICAS DE STORAGE
// ===========================
function getCart() {
    try {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

// ===========================
// MANIPULAÇÃO DE ITENS
// ===========================
function addToCart(id, name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            qty: 1
        });
    }

    saveCart(cart);
    showCartToast(name);
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}

function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty = Math.max(1, parseInt(qty) || 1);
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ===========================
// BADGE NO HEADER
// Atualiza o contador no ícone do carrinho
// ===========================
function updateCartBadge() {
    const count = getCartCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// ===========================
// TOAST DE CONFIRMAÇÃO
// Pequena notificação ao adicionar produto
// ===========================
function showCartToast(productName) {
    const lang = localStorage.getItem('lang') || 'pt';
    const msg = lang === 'en'
        ? `"${productName}" added to cart`
        : `"${productName}" adicionado ao carrinho`;

    // Remove toast anterior se existir
    const existing = document.querySelector('.cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => toast.classList.add('show'), 10);
    // Fade out + remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// ===========================
// CHECKOUT VIA WHATSAPP
// Monta a mensagem do pedido e abre o WhatsApp
// ===========================
function checkoutWhatsApp(customer) {
    const cart = getCart();
    if (cart.length === 0) return;

    const lang = localStorage.getItem('lang') || 'pt';
    const isEn = lang === 'en';

    let msg = isEn
        ? '*New order — FitPro Wellness*\n\n'
        : '*Novo pedido — FitPro Wellness*\n\n';

    msg += isEn ? '*Customer info:*\n' : '*Dados do cliente:*\n';
    msg += `${isEn ? 'Name' : 'Nome'}: ${customer.name}\n`;
    msg += `Email: ${customer.email}\n`;
    if (customer.phone) {
        msg += `${isEn ? 'Phone' : 'Telefone'}: ${customer.phone}\n`;
    }
    msg += '\n';

    msg += isEn ? '*Items:*\n' : '*Itens:*\n';
    cart.forEach(item => {
        const subtotal = (item.price * item.qty).toFixed(2).replace('.', ',');
        msg += `• ${item.qty}x ${item.name} — ${subtotal}€\n`;
    });

    const total = getCartTotal().toFixed(2).replace('.', ',');
    msg += '\n';
    msg += `*Total: ${total}€*\n\n`;
    msg += isEn
        ? 'Please confirm payment details and delivery. Thank you!'
        : 'Por favor, confirme os dados de pagamento e entrega. Obrigado!';

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ===========================
// INICIALIZAÇÃO
// Atualiza badge ao carregar qualquer página
// ===========================
document.addEventListener('DOMContentLoaded', updateCartBadge);
