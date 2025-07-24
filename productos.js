document.getElementById("switchempleado").addEventListener("change", async () => {
  await getProductos();
});

async function getProductos() {
  const switchEmpleado = document.querySelector("#switchempleado input[type='checkbox']");
  const listado = document.getElementById("productos-lista");
  const listadoBebidas = document.getElementById("productos-lista-bebidas");
  
  // Animación suave al ocultar la lista anterior
  fadeOut(listado);
  fadeOut(listadoBebidas);

  // Esperar a que termine la animación
  await wait(500);

  listado.innerHTML = ""; // Limpiar el contenido actual de la lista
  listadoBebidas.innerHTML = ""; // Limpiar el contenido actual de la lista de bebidas

  let listaProductos;

  if (switchEmpleado.checked) {
    listaProductos = await fetch("./preciosempleados.json");
  } else {
    listaProductos = await fetch("./productos.json");
  }

  let productos = await listaProductos.json();

  productos.forEach((producto) => {
    //compruebo el tipo de producto, si es comida uso itemList, si es bebida uso itemListBebidas//
    if (producto.tipo == "Bebida") {
      let itemListBebidas = document.createElement("div");
      listadoBebidas.appendChild(itemListBebidas);
      itemListBebidas.classList.add("list-group-item");
      itemListBebidas.innerHTML = `<span class='precio'>${
        producto.nombre
      } $<span class='numero'>${producto.precio.toFixed(2)}</span></span>
      <input class='texto price-producto form-control' data-nombre='${
        producto.nombre
      }' data-precio=${
        producto.precio
      } type='number' value='0' min=0 oninput="validity.valid||(value='');">`;
    } else {
      let itemList = document.createElement("div");
      listado.appendChild(itemList);
      itemList.classList.add("list-group-item");
      itemList.innerHTML = `<span class='precio'>${
        producto.nombre
      } $<span class='numero'>${producto.precio.toFixed(2)}</span></span>
      <input class='texto price-producto form-control' data-nombre='${
        producto.nombre
      }' data-precio=${
        producto.precio
      } type='number' value='0' min=0 oninput="validity.valid||(value='');">`;
    }
  });

  // Animación suave al mostrar la lista actualizada
  fadeIn(listado);
  fadeIn(listadoBebidas);
}

function fadeOut(element) {
  let opacity = 1;
  const start = performance.now();

  function animate(timestamp) {
    const elapsed = timestamp - start;
    opacity = 1 - elapsed / 500; // Duración de la animación: 500ms

    if (opacity <= 0) {
      opacity = 0;
      element.style.opacity = opacity;
    } else {
      element.style.opacity = opacity;
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function fadeIn(element) {
  let opacity = 0;
  const start = performance.now();

  function animate(timestamp) {
    const elapsed = timestamp - start;
    opacity = elapsed / 500; // Duración de la animación: 500ms

    if (opacity >= 1) {
      opacity = 1;
      element.style.opacity = opacity;
    } else {
      element.style.opacity = opacity;
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//


async function getCombos() {
  let listaCombos = await fetch("./combos.json");
  let combos = await listaCombos.json();
  const listado = document.getElementById("combos-lista");

  combos.forEach((producto) => {
    let itemList = document.createElement("div");
    listado.appendChild(itemList);
    itemList.classList.add("list-group-item");
    itemList.innerHTML = `<span class='precio'>${
      producto.nombre
    } $<span class='numero'>${producto.precio.toFixed(
      2
    )}</span></span><input class='texto price-producto form-control' data-nombre='${
      producto.nombre
    }' data-precio=${
      producto.precio
    } type='number' value='0' min=0 oninput="validity.valid||(value='');">`;
  });
}

async function getCombosconvenios() {
  let listaCombosconvenios = await fetch("./comboconvenios.json");
  let combosconvenios = await listaCombosconvenios.json();
  const listadoconvenios = document.getElementById("combosconvenios-lista");

  combosconvenios.forEach((producto) => {
    let itemListconv = document.createElement("div");
    listadoconvenios.appendChild(itemListconv);
    itemListconv.classList.add("list-group-item");
    itemListconv.innerHTML = `<span class='precio'><span class='faccion'>${producto.faccion} - </span>${producto.nombre} $<span class='numero'>${producto.precio}</span></span>
    <input class='texto price-producto form-control' data-nombre='${producto.nombre}' data-precio=${producto.precio} type='number' value='0' min=0 oninput="validity.valid||(value='');">`;
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
  for (var i = 0; i < arrayTotales.length; i++) {
    sumaTotales += parseFloat(arrayTotales[i].innerHTML);
  }
  document.getElementById("total-pedidos").innerHTML = sumaTotales;
}

window.onload = async () => {
  await getProductos();
  await getCombos();
  await getCombosconvenios();
  await getConvenios();

  document.getElementById("calcular").addEventListener("click", (e) => {
    let pedido = [];
    let precioTotal = document.getElementById("precio-total");
    let descuento = document.getElementById("descuento").value;
    let listaProductos = document.getElementsByClassName("price-producto");
    let listaPedidos = document.getElementById("lista-pedidos");
    let total = 0;
    document.getElementById("select-convenios").selectedIndex = 0;
    document.getElementById("descuento").value = 0;

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
          (listaProductos[i].dataset.precio *
            listaProductos[i].value *
            descuento) / 100;
        pedido.push({
          nombre: listaProductos[i].dataset.nombre,
          precio: listaProductos[i].dataset.precio,
          cantidad: listaProductos[i].value,
        });
        total +=
          listaProductos[i].dataset.precio * listaProductos[i].value -
          precioDescontado;
      }
      listaProductos[i].value = 0;
    }

    if (total !== 0) {
      let divPedido = document.createElement("div");
      divPedido.classList.add("pedido-card");

      pedido.forEach((producto) => {
        divPedido.innerHTML += `<p>${producto.cantidad}x - ${producto.nombre} - ${producto.precio} $<p>`;
      });

      // Obtener la hora actual local
      const horaActual = new Date().toLocaleTimeString();

      divPedido.innerHTML += `<p>Total del pedido: <span class="pedido-card-total">${total}</span>$<br><br>Hora: ${horaActual}<br><button class="botonborrar" onclick="eliminarDiv(this)"><i class="bi bi-trash"></i></button></i><p>`;
      listaPedidos.appendChild(divPedido);

      let ingresosPedidos = parseFloat(document.getElementById("total-pedidos").textContent);
      ingresosPedidos += total;
      document.getElementById("total-pedidos").textContent = ingresosPedidos;

      precioTotal.innerHTML = `<p class="preciototal">TOTAL = ${total.toFixed(2)}$</p>`;
    }
  });
};

async function getConvenios() {
  let listaConvenios = await fetch("./convenios.json");
  let convenios = await listaConvenios.json();
  const selectConvenios = document.getElementById("select-convenios");
  const inputDescuento = document.getElementById("descuento");

  // Agregar un option con el placeholder
  let placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.textContent = "Selecciona un convenio";
  selectConvenios.appendChild(placeholderOption);

  convenios.forEach((convenio) => {
    let option = document.createElement("option");
    option.value = convenio.faccion;
    option.dataset.descuento = convenio.descuento; // Agregar el atributo "data-descuento" con el valor de descuento

    // Crear un elemento <strong> para el valor "faccion" en negrita
    let strong = document.createElement("strong");
    strong.textContent = convenio.faccion;

    option.appendChild(strong);
    option.innerHTML += ` - ${convenio.nombre}`;
    selectConvenios.appendChild(option);
  });

  // Evento para capturar el cambio de selección en el select
  selectConvenios.addEventListener("change", (e) => {
    // Obtener el descuento de la opción seleccionada
    let selectedOption = selectConvenios.options[selectConvenios.selectedIndex];
    let descuento = selectedOption.dataset.descuento;

    // Insertar el descuento en el input de descuento
    inputDescuento.value = descuento;
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll("[data-toggle='collapse']");
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      const icon = this.querySelector("i");
      const buttonText = this.textContent.trim();
      if (buttonText.includes("Mostrar")) {
        this.innerHTML = '<i class="bi bi-caret-right"></i> Ocultar ' + buttonText.substring(8);
        icon.classList.remove("bi-caret-down");
        icon.classList.add("bi-caret-right");
      } else {
        this.innerHTML = '<i class="bi bi-caret-down"></i> Mostrar ' + buttonText.substring(8);
        icon.classList.remove("bi-caret-right");
        icon.classList.add("bi-caret-down");
      }
    });
  });
});
