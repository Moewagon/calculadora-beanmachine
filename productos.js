/* $(document).ready(function () {
  $.getJSON("productos.json", function (data) {
    var items = [];
    $.each(data, function (key, val) {
      items.push("<li class='list-group-item'>" + val.nombre + "<span class='precio'>$" + val.precio.toFixed(2) + "</span><input class='texto price-producto form-control' type='number' value='0'></li>");
    });
    $("<ul/>", {
      class: "list-group",
      html: items.join("")
    }).appendTo("#productos-lista");

    // Calcula el total al cambiar la cantidad o el descuento
    $(".texto").change(function () {
      var subtotal = 0;
      var descuento = $("#descuento").val() || 0;
      $("#productos-lista li").each(function () {
        var precio = parseFloat($(this).find(".precio").text().replace("$", ""));
        var cantidad = parseInt($(this).find(".texto").val());
        subtotal += precio * cantidad;
      });
      var total = subtotal * (100 - descuento) / 100;
      $("#total").text("Total: $" + total.toFixed(2));
    });

    $("#descuento").change(function () {
      $(".texto").trigger("change");
    });
  });
});
 */

async function getProductos() {

  let listaProductos = await fetch("./productos.json")
  let productos = await listaProductos.json()
  const listado = document.getElementById("productos-lista")

  productos.forEach((producto) => {

    let itemList = document.createElement("li")
    listado.appendChild(itemList)
    itemList.classList.add('list-group-item')
    itemList.innerHTML = `${producto.nombre}<span class='precio'>$ ${producto.precio.toFixed(2)}</span><input class='texto price-producto form-control' data-nombre='${producto.nombre}' data-precio=${producto.precio} type='number' value='0'>`


  })
}
async function getCombos() {

  let listaCombos = await fetch("./combos.json")
  let combos = await listaCombos.json()
  const listado = document.getElementById("combos-lista")

  combos.forEach((producto) => {

    let itemList = document.createElement("li")
    listado.appendChild(itemList)
    itemList.classList.add('list-group-item')
    itemList.innerHTML = `${producto.nombre}<span class='precio'>$ ${producto.precio.toFixed(2)}</span><input class='texto price-producto form-control' data-nombre='${producto.nombre}' data-precio=${producto.precio} type='number' value='0'>`

  })
}

window.onload = async () => {

  await getProductos()
  await getCombos()

  document.getElementById("calcular").addEventListener("click", (e) => {

    let pedido = []
    let precioTotal = document.getElementById("precio-total")
    let descuento = document.getElementById("descuento").value
    let listaProductos = document.getElementsByClassName("price-producto")
    let listaPedidos = document.getElementById("lista-pedidos")
    let total = 0
    for (let i = 0; i < listaProductos.length; i++) {

      if (!descuento && listaProductos[i].value != 0) {

        pedido.push({ nombre: listaProductos[i].dataset.nombre, precio: listaProductos[i].dataset.precio, cantidad: listaProductos[i].value })
        total += listaProductos[i].dataset.precio * listaProductos[i].value

      }

      if (descuento && listaProductos[i].value != 0) {
        let precioDescontado = (listaProductos[i].dataset.precio * listaProductos[i].value) * (descuento / 100)
        pedido.push({ nombre: listaProductos[i].dataset.nombre, precio: listaProductos[i].dataset.precio, cantidad: listaProductos[i].value })
        total += listaProductos[i].dataset.precio * listaProductos[i].value - precioDescontado

      }
      listaProductos[i].value = 0
    }
    let divPedido = document.createElement("div")
    divPedido.classList.add("pedido-card")

    pedido.forEach(producto => {
      divPedido.innerHTML += `<p>${producto.cantidad}x - ${producto.nombre} - ${producto.precio} $<p>`
    })
    divPedido.innerHTML += `<p>Total del pedido: ${total} $<p>`
    listaPedidos.appendChild(divPedido)

    let ingresosPedidos = parseInt(document.getElementById("total-pedidos").textContent)

    ingresosPedidos += total

    document.getElementById("total-pedidos").textContent = ingresosPedidos

    precioTotal.textContent = `PRECIO TOTAL = $ ${total.toFixed(2)}`
  })

}