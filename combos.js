$(document).ready(function() {
    $.getJSON("combos.json", function(data) {
      var items = [];
      $.each(data, function(key, val) {
        items.push("<li class='list-group-item'>" + val.nombre + "<span class='precio'>$" + val.precio.toFixed(2) + "</span><input class='texto form-control' type='number' value='1'></li>");
      });
      $("<ul/>", {
        class: "list-group",
        html: items.join("")
      }).appendTo("#combos-lista");
  
      // Calcula el total al cambiar la cantidad o el descuento
      $(".texto").change(function() {
        var subtotal = 0;
        var descuento = $("#descuento-combos").val() || 0;
        $("#combos-lista li").each(function() {
          var precio = parseFloat($(this).find(".precio").text().replace("$", ""));
          var cantidad = parseInt($(this).find(".texto").val());
          subtotal += precio * cantidad;
        });
        var total = subtotal * (100 - descuento) / 100;
        $("#total-combos").text("Total: $" + total.toFixed(2));
      });
  
      $("#descuento-combos").change(function() {
        $(".texto").trigger("change");
      });
    });
  });
  