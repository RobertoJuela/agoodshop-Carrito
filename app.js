const API_URL = 'https://jsonblob.com/api/jsonBlob/01a15b77-cc58-7eac-b245-014a8875012a';
async function iniciar(){
    try{
        const respuesta = await fetch (API_URL);

        if(!respuesta.ok){
            throw new Error('La API respondio con error ' + respuesta.status);
        }

        const datos = await respuesta.json();
        const carrito = new Carrito (datos.products, datos.currency);
        pintarProductos(carrito);
    } catch(error){
        console.error('No se pudieron cargar los prductos: ', error);
    }
}

function pintarProductos(carrito){
    const listado = document.getElementById('listado');
    listado.innerHTML = '';

    carrito.productos.forEach(p => {
        const fila = document.createElement ('tr');
         fila.innerHTML = `
            <td><strong>${p.title}</strong><br>REF: ${p.SKU}</td>
            <td>
            <button class="menos">-</button>
            <input type="number" min="0" value="0">
            <button class="mas">+</button>
            </td>
            <td>${p.price}${carrito.moneda}</td>
            <td class="total-fila">0${carrito.moneda}</td>
    `;
    listado.appendChild(fila);
    const input = fila.querySelector('input');

    const cambiar = (nuevasUnidades) => {
      carrito.actualizarUnidades(p.SKU, nuevasUnidades);
      const info = carrito.obtenerInformacionProducto(p.SKU);

      input.value = info.quantity;
      fila.querySelector('.total-fila').textContent =
        (info.price * info.quantity).toFixed(2) + carrito.moneda;

        pintarResumen(carrito);
    };

    fila.querySelector('.mas').addEventListener('click', () => {
      cambiar(Number(input.value) + 1);
    });

    fila.querySelector('.menos').addEventListener('click', () => {
      cambiar(Number(input.value) - 1);
    });

    input.addEventListener('input', () => {
      cambiar(input.value);
    });
  
    })
}

function pintarResumen(carrito) {
  const datos = carrito.obtenerCarrito();

  document.getElementById('lineas').innerHTML = datos.products
    .map(p => `
      <p>
        <span>${p.quantity} x ${p.title}</span>
        <span>${p.quantity} x ${p.price}${datos.currency}</span>
      </p>
    `)
    .join('');

  document.getElementById('total').textContent = datos.total + datos.currency;
}

iniciar();