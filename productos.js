async function getProductos() {
  let listaProductos = await fetch("./productos.json");
  let productos = await listaProductos.json();
  const listado = document.getElementById("productos-lista");

  productos.forEach((producto) => {
    let itemList = document.createElement("div");
    listado.appendChild(itemList);
    itemList.classList.add("list-group-item");
    itemList.innerHTML = `<span class='precio'>${producto.nombre} $<span class='numero'>${producto.precio.toFixed(
      2
    )}</span></span><input class='texto price-producto form-control' data-nombre='${
      producto.nombre
    }' data-precio=${producto.precio} type='number' value='0'>`;
  });
}

async function getCombos() {
  let listaCombos = await fetch("./combos.json");
  let combos = await listaCombos.json();
  const listado = document.getElementById("combos-lista");

  combos.forEach((producto) => {
    let itemList = document.createElement("div");
    listado.appendChild(itemList);
    itemList.classList.add("list-group-item");
    itemList.innerHTML = `<span class='precio'>${producto.nombre} $<span class='numero'>${producto.precio.toFixed(
      2
    )}</span></span><input class='texto price-producto form-control' data-nombre='${
      producto.nombre
    }' data-precio=${producto.precio} type='number' value='0'>`;
  });
}

function eliminarDiv(boton) {
  var divPadre = boton.parentNode; //el padre del boton es un <p>
  var divAbuelo = divPadre.parentNode; //el abuelo si es el div que interesa
  var divFinal = divAbuelo.parentNode; //para borrarlo necesito a su padre
  divFinal.removeChild(divAbuelo);
  var listaPedido = document.getElementById("lista-pedidos");
  var arrayTotales = listaPedido.getElementsByClassName("pedido-card-total");
  console.log(arrayTotales);
  var sumaTotales = 0;
  for (var i=0; i<arrayTotales.length; i++){
    sumaTotales += parseInt(arrayTotales[i].innerHTML);
  }
  document.getElementById("total-pedidos").innerHTML=sumaTotales;
}

window.onload = async () => {
  await getProductos();
  await getCombos();

  document.getElementById("calcular").addEventListener("click", (e) => {
    let pedido = [];
    let precioTotal = document.getElementById("precio-total");
    let descuento = document.getElementById("descuento").value;
    let listaProductos = document.getElementsByClassName("price-producto");
    let listaPedidos = document.getElementById("lista-pedidos");
    let total = 0;

    for (let i = 0; i < listaProductos.length; i++) {
      if (!descuento && listaProductos[i].value != 0) {
        pedido.push({
          nombre: listaProductos[i].dataset.nombre,
          precio: listaProductos[i].dataset.precio,
          cantidad: listaProductos[i].value,
        });
        total += listaProductos[i].dataset.precio * listaProductos[i].value;
      }

      if (descuento && listaProductos[i].value != 0) {
        let precioDescontado =
          (listaProductos[i].dataset.precio * listaProductos[i].value * descuento) / 100;
        pedido.push({
          nombre: listaProductos[i].dataset.nombre,
          precio: listaProductos[i].dataset.precio,
          cantidad: listaProductos[i].value,
        });
        total +=
          listaProductos[i].dataset.precio * listaProductos[i].value - precioDescontado;
      }
      listaProductos[i].value = 0;
    }

    let divPedido = document.createElement("div");
    divPedido.classList.add("pedido-card");

    pedido.forEach((producto) => {
      divPedido.innerHTML += `<p>${producto.cantidad}x - ${producto.nombre} - ${producto.precio} $<p>`;
    });

    divPedido.innerHTML += `<p>Total del pedido: <span class="pedido-card-total">${total}</span> $<br><br><button class="botonborrar" onclick="eliminarDiv(this)"><i class="bi bi-trash"></i></button></i><p>`;
    listaPedidos.appendChild(divPedido);

    let ingresosPedidos = parseInt(document.getElementById("total-pedidos").textContent);

    ingresosPedidos += total;

    document.getElementById("total-pedidos").textContent = ingresosPedidos;

    precioTotal.textContent = `PRECIO TOTAL = $ ${total.toFixed(2)}`;
  });

  
};
