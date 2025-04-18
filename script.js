let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;
        c('.pizzaInfo--qt').innerHTML = modalQt;

        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            size.setAttribute('data-key', sizeIndex); // Adiciona o atributo para identificação
            size.classList.remove('selected');
            if (sizeIndex == 2) size.classList.add('selected');
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => c('.pizzaWindowArea').style.opacity = 1, 200);
    });

    c('.pizza-area').append(pizzaItem);
});

// Fechar modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => c('.pizzaWindowArea').style.display = 'none', 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Tamanho selecionado e troca de preço
cs('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

        let sizeIndex = parseInt(size.getAttribute('data-key'));
        let newPrice = pizzaJson[modalKey].price[sizeIndex];
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${newPrice.toFixed(2)}`;
    });
});

// Controle de quantidade no modal
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// Adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = `${pizzaJson[modalKey].id}@${size}`;

    let key = cart.findIndex((item) => item.identifier === identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

// Abrir carrinho no mobile
c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

// Fechar carrinho no mobile
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

// Atualizar carrinho
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        cart.forEach((cartItem, i) => {
            let pizza = pizzaJson.find((item) => item.id === cartItem.id);
            subtotal += pizza.price[cartItem.size] * cartItem.qt;

            let cartEl = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName = ['P', 'M', 'G'][cartItem.size];
            let pizzaName = `${pizza.name} (${pizzaSizeName})`;

            cartEl.querySelector('img').src = pizza.img;
            cartEl.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartEl.querySelector('.cart--item--qt').innerHTML = cartItem.qt;

            cartEl.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cartItem.qt > 1) {
                    cartItem.qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartEl.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cartItem.qt++;
                updateCart();
            });

            c('.cart').append(cartEl);
        });

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
