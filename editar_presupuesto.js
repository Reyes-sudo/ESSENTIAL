
let id = $('#id_venta').val();

$("#impuesto_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getImpuesto_x_id",{
        id:$(this).val()
    },
    function (data, textStatus, jqXHR) {
        $('#tasa_imp').val(data.data[0].tasa_imp);
        tasa_imp = data.data[0].tasa_imp;
        document.getElementById("tasa").innerHTML = tasa_imp;
    },
    'json'
); 
})

//Obtencion y agregacion del nombre de Moneda a un INPUT para tomar valor-hidden 
$("#moneda_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getMoneda_x_id",{
        id:$(this).val()
    },
    function (data, textStatus, jqXHR) {
        $('#nombre_mon').val(data.data[0].nombre_mon);
        moneda = data.data[0].simbolo_mon;
        //Llenar atributos en las etiquetas con el simbolo demoneda
        document.getElementById("mon_simbolo1").innerHTML = moneda;
        document.getElementById("mon_simbolo2").innerHTML = moneda;
        document.getElementById("mon_simbolo3").innerHTML = moneda;
    },
    'json'
); 
})


$(document).ready(function () {
    $(".select2").select2();
    combo_articulos();
    editar_datos();
});


const nombreArticulosObj = {};
function combo_articulos() {
    $.post(ruta + "/lista_articulos_con_stock",
        function (data, textStatus, jqXHR) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const options = doc.querySelectorAll('option');
            options.forEach((option) => {
                if (option.value !== '') {
                    nombreArticulosObj[option.value] = option.textContent;
                }
            });
            $(".selectarticulos").html(data);
        },
    );
}
//mostrar datos
let cant_ventas = 0;
let nuevo_importe_una_fila = 0;
let count = 0;
function editar_datos() {
    $.post(ruta + "/getPresupuestosID", { id: id },
        function (data, textStatus, jqXHR) {
            $("#tipo_cliente_id").val(data.data[0].tipo_cliente_id).trigger('change');
            $("#codigo_venta").val(data.data[0].codigo_venta);
            $("#fecha_venta").val(data.data[0].fecha_venta);
            $("#fecha_caducidad_venta").val(data.data[0].fecha_caducidad_venta);
            $("#moneda_id").val(data.data[0].moneda_id).trigger('change');
            $("#impuesto_id").val(data.data[0].impuesto_id).trigger('change');
            $("#tipo_descuento_venta").val(data.data[0].tipo_descuento_venta).trigger('change');
            $("#referencia_venta").val(data.data[0].referencia_venta);
            $("#agente_venta").val(data.data[0].agente_venta).trigger('change');
            $("#estado_venta").val(data.data[0].estado_venta).trigger('change');
            $("#nota_admin_venta").val(data.data[0].nota_admin_venta);
            $("#mostrar_igv").val(data.data[0].con_sin_igv);
            $('textarea[name="terminos_condiciones_venta"]').val(data.data[0].terminos_condiciones_venta);

            $("#descuento_tipo").html(data.data[0].monto_descuento); 
                document.getElementById('descuento_tipo_input').value = data.data[0].monto_descuento;

            let mostrar_ocultar_igv = document.getElementById("mostrar_igv").value;
            if(mostrar_ocultar_igv == "ocultar_igv"){
                var option = document.querySelector("#tipo_descuento_venta option[value='antes impuesto']");
                option.remove();
                let row = document.getElementById('myRow');
                    if (row.style.display === 'none') {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                    $('#myButton').toggleClass('active');
                    count++;
                    $(".sincon_igv").val(count);
                    console.log("yess");
            }else{
                console.log("ÑEE");
            }
            //Recorrer los detalles con for
            for (var i = 0; i < data.data.length; i++) {
                let id_row = 'row' + cant_ventas;
                let fila =
                    `<tr id="${id_row}">
                        <td><input type="hidden" value="${cant_ventas + 1}" name="cant_ventas[]">${cant_ventas+1}</td>
                        <td><input type="hidden" value="${data.data[i].articulo_id}" name="articuloId[]">${data.data[i].nombre_mercancia_art}</td>
                        <td><input onchange="calculo_modificar('${id_row}');" type="number" value="${data.data[i].stock_vendido_det}" name="stock_ingreso[]"></td>
                        <td><input onchange="calculo_modificar('${id_row}');"type="text" value="${data.data[i].precio_venta_det}" name="precio_venta[]"></td>    
                        <td><input type="hidden" value="${data.data[i].importe_venta_det}" name="importe_det[]">${data.data[i].importe_venta_det}</td>
                        <td><a href="#" onclick="eliminar_venta('${id_row}',${cant_ventas});" class="btn btn-circle btn-sm btn-danger" title="Eliminar"><i class="fa fa-solid fa-trash"></i></a></td>
                    </tr>`;
                sumaImportes = sumaImportes + parseFloat(data.data[i].importe_venta_det);
                let tasa = document.getElementById('tasa_imp').value;
                document.getElementById('tasa').innerHTML = tasa;

                document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
                $(".importes_total").val(sumaImportes.toFixed(2));
                
                /* TOTAL + IGV */
                tasa = data.data[0].total_impuesto_venta;    //tasa: el resultado de descuento de Impuesto - Ejm: Importe: (100  * IGV )=  18
                document.getElementById('impuesto').innerHTML = tasa; //SPAN
                $(".impuesto").val(tasa);              //INPUT
                //imprime el impuesto : IGV = 18%
                //
                total = data.data[0].total_venta;        
                //TOTAL-FINAL  Importe-total+Descuento-Impuesto

                document.getElementById('venta_total').innerHTML = total;  //imprime el TOTAL-FINAL en id - SPAN
                $(".venta_total").val(total);  //imprime el TOTAL-FINAL en id -INPUT
                $('#lista').append(fila);              //Agrega Fila a la Tabla
                $('#articulo_id').val("").trigger('change');   //Limpia los select
                $('#nombre_mercancia_art').val("");            //Limpian campos
                $('#stock_venta_det').val("");
                $('#precio_venta_det').val("");

                cant_ventas++; //ids de la tabla por cada fila agregada + id del row(id)
                contadorArticulos[data.data[i].articulo_id] = (contadorArticulos[data.data[i].articulo_id] || 0) + 1;
                
            }
        }, 'json'
    );
}
//editar presupuesto
const formulario = $('#form_venta')
$(formulario).submit(function (e) {
    //Remover atributo disabled para guardar con el mismo codigo de compra
    $("#codigo_venta").removeAttr("disabled", "disabled");
    e.preventDefault();
    $("#button_add").html('<img class="loader_button" src="' + ruta + '/recursos/img/loader/loader.gif" alt="loader"> cargando...').attr("disabled", true);
    $.ajax({
        type: "post",
        url: ruta + "/updatePresupuesto",
        data: new FormData(formulario[0]),
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.error == "") {
                formulario[0].reset();
                swal.fire({
                    title: response.ok,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
                $("#button_add").html('Guardar').attr("disabled", false);

                location.href = ruta + '/PresupuestoProductosController';
            } else {
                swal.fire({
                    title: "¡Error!",
                    html: response.error,
                    icon: "error",
                    showConfirmButton: true,
                });
                $("#codigo_venta").attr("disabled", true); //validacion
                $("#button_add").html('Guardar').attr("disabled", false);
            }
        }, error: function () {
            swal.fire({
                title: "Error 500",
                html: "Error de servidor interno",
                icon: "error",
                showConfirmButton: true,
            });
            $("#button_add").html('Guardar').attr("disabled", false);
        }
    });
});
let cantidad_total = 0;
//Obtencion y Agregacion de nombre de Articulo a un INPUT para tomar valor-hidden 
$("#articulo_id").change(function (e) {
    cantidad_total=0;
    e.preventDefault();
    $.post(ruta + "/getAlmArticulo-x-id", {
        //
        id: $(this).val()
    },
        function (data, textStatus, jqXHR) {
            if (data && data.data && data.data.length > 0) {
                $('#nombre_mercancia_art').val(data.data[0].nombre_mercancia_art);
                $('#precio_venta_det').val(data.data[0].precio_venta_art);
            }
        },
        'json'
    );
    //esto sirve para poner el stock total cerca del input cantidad en PRODUCTOS
    $.post(ruta + "/contadorStock_x_id",{
        //
        id:$(this).val()
    },
        function (data, textStatus, jqXHR) {
            if (data && data.data && data.data.length > 0) {
                let stocks_lotes = [];
                
                $.each(data.data, function (index, value) {
                    // Convierte la fecha de vencimiento en un objeto DateTime
                    var fecha_vencimiento = new Date(value.fecha_venc);
                    var stock_lote = value.stock;

                    // Compara la fecha de vencimiento con la fecha actual
                    if (fecha_vencimiento > new Date()) {
                        // Agrega la fecha de vencimiento al array
                        stocks_lotes.push(stock_lote);
                    }
                });
                for (var i = 0; i < stocks_lotes.length; i++) {
                    // Convierte el valor del elemento en un número
                    var cant_lote = parseInt(stocks_lotes[i]); 
                    // Suma el número a la variable suma
                    cantidad_total += cant_lote;
                }
                $('#max-stock-venta-det').text("Stock disponible: " + cantidad_total);
            }else{
                $('#max-stock-venta-det').val("");
                $('#max-stock-venta-det').text("Stock disponible: 0");
            }
        },
        'json'
    ); 
})



//Obtencion y agregacion de la tasa(numero) de Impuesto->Ejm:IGV a un INPUT para tomar valor-hidden 
$("#impuesto_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getImpuesto_x_id", {
        id: $(this).val()
    },
        function (data, textStatus, jqXHR) {
            $('#tasa_imp').val(data.data[0].tasa_imp);
        },
        'json'
    );
})

//Obtencion y agregacion del nombre de Moneda a un INPUT para tomar valor-hidden 
$("#moneda_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getMoneda_x_id", {
        id: $(this).val()
    },
        function (data, textStatus, jqXHR) {
            $('#nombre_mon').val(data.data[0].nombre_mon);
        },
        'json'
    );
})




$('#fecha_venta').change(function (e) {

    let fech_caduc_vent = document.getElementById("fecha_caducidad_venta").value;

    if (fech_caduc_vent != '' && $(this).val() > fech_caduc_vent) {
        Swal.fire({
            html: 'Error: No debe ingresar una fecha mayor que Fecha de Caducidad',
            icon: 'warning',
        })

        $('#fecha_venta').val("");
    }

});

$('#fecha_caducidad_venta').change(function (e) {
    let fech_vent = document.getElementById("fecha_venta").value;
    let date_fech_vent = new Date(fech_vent);

    let fecha_Actual = new Date();

    let fecha_caduc_vent = $(this).val();
    let date_fecha_caduc_vent = new Date(fecha_caduc_vent);


    if (fech_vent != '' && fecha_caduc_vent != '' && date_fecha_caduc_vent < date_fech_vent) {
        Swal.fire({
            html: 'Error: No debe ingresar una fecha de caducidad menor que Fecha de Venta',
            icon: 'warning',
        })
        $('#fecha_caducidad_venta').val("");
    }


    if (date_fecha_caduc_vent < fecha_Actual) {

        $('#estado_venta').val('expirado').trigger('change.select2');
        $('#respaldo_valor_estado').val($('#estado_venta').val());
        $('#estado_venta').attr('disabled', true);
    } else {
        $('#estado_venta').attr('disabled', false);
        $('#respaldo_valor_estado').val($('#estado_venta').val());
        if ($('#estado_venta').val() === 'expirado') {
            $('#estado_venta').val('borrador').trigger('change.select2');
            $('#respaldo_valor_estado').val($('#estado_venta').val());
        }
    }

});
$('#estado_venta').change(function (e) {
    $('#respaldo_valor_estado').val($('#estado_venta').val());
});


//cosa nueva 2
//CANTIDAD DE DESCUENTO
$('#descuento').change(function (e) { 
    let tasa =  parseFloat($("#tasa_imp").val());
    var element = document.getElementById("forma_descuento");
    if($(this).val()<=0){
        //codigo solo para el 1er intento de descuento y uso de este codigo
        var element_verific = document.getElementById("descuento_tipo");
        if(element_verific.textContent != ""){

             //cosa nueva 3
             if(count % 2 === 0){
                console.log("PASO1");
                let importe_for_tasa = parseFloat(document.getElementById("importe_tot").value);
                
                let tasa_impuest =  importe_for_tasa * (tasa/100);
                tasa_impuest = parseFloat(tasa_impuest.toFixed(2));
                $("#impuesto").html(tasa_impuest);
                $(".impuesto").val(tasa_impuest);
                let total_final_original = importe_for_tasa + tasa_impuest;
    
                document.getElementById('venta_total').innerHTML = total_final_original.toFixed(2);
                $(".venta_total").val(total_final_original.toFixed(2));
                total = total_final_original;
        
    
                
                var element = document.getElementById("forma_descuento");
                element.selectedIndex = 0;
                $('#descuento').val("");
                document.getElementById('descuento_tipo_input').value = 0;
                var element = document.getElementById("descuento_tipo");
                element.textContent = "0";
                $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
                $("#descuento").attr("disabled",true);
                $("#forma_descuento").attr("disabled", true);
            }else{
                let importeT = parseFloat(document.getElementById("importe_tot").value);  
                document.getElementById('venta_total').innerHTML = importeT;
                $(".venta_total").val(importeT);
                $('#descuento').val("");
                document.getElementById('descuento_tipo_input').value = 0;
                var element = document.getElementById("descuento_tipo");
                element.textContent = "0";
                var element = document.getElementById("forma_descuento");
                element.selectedIndex = 0;
                $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
                $("#descuento").attr("disabled",true);
                $("#forma_descuento").attr("disabled", true);
            }
            //fin cosa nueva 3
            Swal.fire({
                html: 'Advertencia: No se puede registrar descuento con monto 0, reintente',
                icon: 'warning',
            })

        

        }else{
            console.log("HO");
            var element = document.getElementById("forma_descuento");
            element.selectedIndex = 0;
            $('#descuento').val("");
            document.getElementById('descuento_tipo_input').value = 0;
            var element = document.getElementById("descuento_tipo");
            element.textContent = "0";
            $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
            $("#descuento").attr("disabled",true);
            $("#forma_descuento").attr("disabled", true);
            Swal.fire({
                html: 'Advertencia: No se puede registrar descuento con monto 0, reintente',
                icon: 'warning',
            })
        }

    }else if(element.selectedIndex==1 || element.selectedIndex==2){
        $('#forma_descuento').trigger('change');
    }
    
});
//fin cosa nueva 2

//cosa nueva 2
//Esto hace que el input donde se ingresa el valor del descuento se quede inabilitado hasta poner un Tipo de Descuento
$('#tipo_descuento_venta').change(function (e) { 
    e.preventDefault();
    let tasa =  parseFloat($("#tasa_imp").val());
    if($(this).val()=="sin descuento"){
        
        let comprobar_monto_descuento = document.getElementById('descuento').value
        let comprobar_tipo_descuento = document.getElementById('forma_descuento').value

        if(comprobar_monto_descuento != "" && comprobar_tipo_descuento != "1" && comprobar_tipo_descuento != "2"){
            $('#descuento').val("");
            $("#descuento").attr("disabled",true);
            $("#forma_descuento").attr("disabled", true);
        }else{

            let descuento_temp= parseFloat($("#descuento_tipo").text());   //esta linea toma el descuento que se cargo para sumar al total si en caso se ingrese nuevo descuento
            let total_temp = parseFloat($("#total_venta").val());
            let total_final_original = descuento_temp+total_temp;
            document.getElementById('venta_total').innerHTML = total_final_original.toFixed(2);
            $(".venta_total").val(total_final_original.toFixed(2));
            total = total_final_original;
            
            var element = document.getElementById("forma_descuento");
            element.selectedIndex = 0;
            $('#descuento').val("");
            document.getElementById('descuento_tipo_input').value = 0;
            var element = document.getElementById("descuento_tipo");
            element.textContent = "0";
            
            
            $("#descuento").attr("disabled",true);
            $("#forma_descuento").attr("disabled", true);
        }

    }else if(count % 2 === 0){
        
        let x = document.getElementById('descuento_tipo_input').value
        if(x != ""){

            let importe_for_tasa = parseFloat(document.getElementById("importe_tot").value);
            let tasa_impuest =  importe_for_tasa * (tasa/100);
            tasa_impuest = parseFloat(tasa_impuest.toFixed(2));
            $("#impuesto").html(tasa_impuest);
            $(".impuesto").val(tasa_impuest);
            let total_final_original_2 = importe_for_tasa + tasa_impuest;

            document.getElementById('venta_total').innerHTML = total_final_original_2.toFixed(2);
            $(".venta_total").val(total_final_original_2.toFixed(2));
            total = total_final_original_2;
            var element = document.getElementById("forma_descuento");
            element.selectedIndex = 0;
            $('#descuento').val("");
            document.getElementById('descuento_tipo_input').value = 0;
            var element = document.getElementById("descuento_tipo");
            element.textContent = "0";
        }
        
        $("#descuento").attr("disabled",false);
        $("#forma_descuento").attr("disabled", false);

    }else if(count % 2 === 1){
        $("#descuento").attr("disabled",false);
        $("#forma_descuento").attr("disabled", false);
    }
});
//fin cosa nueva 2

$(".sincon_igv").val(count);
function sin_con_igv(){
    var selectElement = document.getElementById("tipo_descuento_venta");
    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
    count++;
    if (count % 2 === 1) {
        var element = document.getElementById("forma_descuento");
        element.selectedIndex = 0;
        $('#descuento').val("");
        $("#descuento").attr("disabled", true);
        $("#forma_descuento").attr("disabled", true);
        $(".sincon_igv").val(count);
        var option = document.querySelector("#tipo_descuento_venta option[value='antes impuesto']");
        option.remove();
        $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
        document.getElementById('descuento_tipo_input').value = 0;
        var element = document.getElementById("descuento_tipo");
        element.textContent = "0";

        let sumaImportes_tempor = 0;
        console.log("sin igv");
        let row = document.getElementById('myRow');
        if (row.style.display === 'none') {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
        $('#myButton').toggleClass('active');
    
        let rows = document.querySelectorAll('tr[id^="row"]');
        let tasa = document.getElementById('tasa_imp').value;
        tasa = parseInt(tasa)
        // Recorre cada fila
        let total_import = 0;
        for (let i = 0; i < rows.length; i++) {
            total_import = 0;
    
            let input3 = rows[i].querySelectorAll('input')[2];
            let valor_input3 = parseFloat(input3.value);
            
            let input4 = rows[i].querySelectorAll('input')[3];
            // Aumenta el valor del input en 4
            console.log(input4.value);  
            let valor_input4 = (parseFloat(input4.value) + ((tasa/100)*parseFloat(input4.value))).toFixed(2);
            input4.value = valor_input4;
            total_import=valor_input3*valor_input4;
            
    
            let input5 = rows[i].querySelectorAll('input')[4];
            // Aumenta el valor del input en 5
            input5.value = total_import;
    
            let textNode = input5.nextSibling;
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                let value = parseFloat(input5.value).toFixed(2);
                textNode.textContent = value;
            }
            sumaImportes_tempor = sumaImportes_tempor + total_import;
        }
        sumaImportes = sumaImportes_tempor;
        total = sumaImportes;
        document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
        $(".importes_total").val(sumaImportes.toFixed(2));
        document.getElementById('venta_total').innerHTML = sumaImportes.toFixed(2); 
        $(".venta_total").val(sumaImportes.toFixed(2));  
        $(".sincon_igv").val(count);
    }else{
        var element = document.getElementById("forma_descuento");
        element.selectedIndex = 0;
        $('#descuento').val("");
        $("#descuento").attr("disabled", true);
        $("#forma_descuento").attr("disabled", true);
        if(selectedValue != "sin descuento"){
            $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
        }
        document.getElementById('descuento_tipo_input').value = 0;
        var element = document.getElementById("descuento_tipo");
        element.textContent = "0";

        let sumaImportes_tempor2 = 0;
        console.log("con igv");
        var option = document.createElement("option");
        option.value = "antes impuesto";
        option.text = "Antes del Impuesto";
        // Agregar la opción al select
        var select = document.getElementById("tipo_descuento_venta");
        select.appendChild(option);

        let row = document.getElementById('myRow');
        if (row.style.display === 'none') {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
        $('#myButton').toggleClass('active');
        let newtasa = 0 ; 
        let rows = document.querySelectorAll('tr[id^="row"]');
        let tasa = document.getElementById('tasa_imp').value;
        tasa = parseInt(tasa)
        // Recorre cada fila
        let total_import = 0;
        for (let i = 0; i < rows.length; i++) {
            total_import = 0;
            let input3 = rows[i].querySelectorAll('input')[2];
            let valor_input3 = parseFloat(input3.value);

            let input4 = rows[i].querySelectorAll('input')[3];
            let valor_input4 = (parseFloat(input4.value) / (1+(tasa/100))).toFixed(2);
            input4.value = valor_input4;

            total_import=valor_input3*valor_input4;
            let input5 = rows[i].querySelectorAll('input')[4];
            input5.value = total_import;

            let textNode = input5.nextSibling;
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                let value = parseFloat(input5.value).toFixed(2);
                textNode.textContent = value;
            }
            sumaImportes_tempor2 =  sumaImportes_tempor2 + total_import;
        }
        sumaImportes = sumaImportes_tempor2;
        newtasa = sumaImportes * (tasa/100);
        total = sumaImportes + newtasa;
        document.getElementById('impuesto').innerHTML = newtasa.toFixed(2); //SPAN
        $(".impuesto").val(newtasa.toFixed(2));              //INPUT
        document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
        $(".importes_total").val(sumaImportes.toFixed(2));
        document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
        $(".importes_total").val(sumaImportes.toFixed(2));
        document.getElementById('venta_total').innerHTML = total.toFixed(2); 
        $(".venta_total").val(total.toFixed(2));  
        $(".sincon_igv").val(count);
    }  
}

//VARIABLES de la funcion AgregarCompra()
//let cant_ventas = 0;
let cont_id = 0;
let sumaImportes = 0;
let sumaImportes_mod = 0;
let total = 0
let forma_Descuento1 = "";
let forma_Descuento2 = "";
let valorDescuento = 0;
let tablas = 0;
let contadorArticulos = {};
let titulos = [];
function AgregarVenta() {
    let stock_ingreso = document.getElementById("stock_venta_det").value;
    let cliente_Idx = document.getElementById("tipo_cliente_id").value;
    let agente_Idx = document.getElementById("agente_venta").value;

    let precio_venta = document.getElementById("precio_venta_det").value;

    let fecha_Venta = document.getElementById("fecha_venta").value;
    let fecha_Caducidad_Venta = document.getElementById("fecha_caducidad_venta").value;

    let impuesto_Idx = document.getElementById("impuesto_id").value;

    let nombre_mercancia = document.getElementById("nombre_mercancia_art").value;
    let articulo_Idx = document.getElementById("articulo_id").value;

    let moneda_Idx = document.getElementById("moneda_id").value;

    let importe_det = parseFloat(stock_ingreso) * parseFloat(precio_venta);

    valorDescuento = document.getElementById("descuento").value;

  /*
    if (nombre_mercancia != "" && moneda_Idx != "" && stock_ingreso != "" && precio_venta != "" && impuesto_Idx != ""
        && fecha_Venta != "" && cliente_Idx != "" && agente_Idx != "" && fecha_Caducidad_Venta != "" && stock_ingreso != "") {
*/
                if(parseInt(stock_ingreso)<=parseInt(cantidad_total)){
                    if (contadorArticulos[articulo_Idx] && contadorArticulos[articulo_Idx] >= 1) {
                        Swal.fire({
                            html: 'No se admite registrar 2 veces el mismo articulo - Intente en la próxima compra',
                            icon: 'warning',
                        })
                    } else {
                        let tasa = document.getElementById('tasa_imp').value;
                        if (count % 2 === 1) {
                            precio_venta= parseFloat(precio_venta);
                            precio_venta = precio_venta + (precio_venta*(tasa/100));
                            precio_venta = (precio_venta).toFixed(2);
                        }
                        let id_row = 'row' + cant_ventas;
                        let fila = ``;
                        let importe_temp = 0;
                        if(count % 2 === 1){
                            importe_temp = 0;
                            importe_temp = parseFloat(importe_det) + ((tasa/100)*parseFloat(importe_det));
                            fila = `<tr id="${id_row}">
                                        <td><input type="hidden" value="${cant_ventas + 1}" name="cant_ventas[]">${cant_ventas + 1}</td>
                                        <td><input type="hidden" value="${articulo_Idx}" name="articuloId[]">${nombre_mercancia}</td>
                                        <td><input onchange="calculo_modificar('${id_row}');" type="number" value="${stock_ingreso}" name="stock_ingreso[]"></td>
                                        <td><input onchange="calculo_modificar('${id_row}');"type="text" value="${precio_venta}" name="precio_venta[]"></td>    
                                        <td><input type="hidden" value="${importe_temp}" name="importe_det[]">${importe_temp}</td>
                                        <td><a href="#" onclick="eliminar_venta('${id_row}',${cant_ventas});" class="btn btn-circle btn-sm btn-danger" title="Eliminar"><i class="fa fa-solid fa-trash"></i></a></td>
                                    </tr>`;
                        }else{
                            fila = `<tr id="${id_row}">
                                        <td><input type="hidden" value="${cant_ventas + 1}" name="cant_ventas[]">${cant_ventas + 1}</td>
                                        <td><input type="hidden" value="${articulo_Idx}" name="articuloId[]">${nombre_mercancia}</td>
                                        <td><input onchange="calculo_modificar('${id_row}');" type="number" value="${stock_ingreso}" name="stock_ingreso[]"></td>
                                        <td><input onchange="calculo_modificar('${id_row}');"type="text" value="${precio_venta}" name="precio_venta[]"></td>    
                                        <td><input type="hidden" value="${importe_det}" name="importe_det[]">${importe_det}</td>
                                        <td><a href="#" onclick="eliminar_venta('${id_row}',${cant_ventas});" class="btn btn-circle btn-sm btn-danger" title="Eliminar"><i class="fa fa-solid fa-trash"></i></a></td>
                                    </tr>`;
                        }
                        
                        if (count % 2 === 1) {
                            console.log("Vamos bien");
                            console.log("Importe Temp: ",importe_temp);
                            sumaImportes = sumaImportes + parseFloat(importe_temp);
                            console.log("Final Import: ",sumaImportes);
                        }else{
                            sumaImportes = sumaImportes + parseFloat(importe_det);
                        }
                        document.getElementById('tasa').innerHTML = tasa;
                        document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
                        $(".importes_total").val(sumaImportes.toFixed(2));
                        tasa = sumaImportes*(tasa/100);    //tasa: el resultado de descuento de Impuesto
                        if (count % 2 === 1) {
                            total = sumaImportes;
                        }else{
                            total = sumaImportes + tasa;
                        }
                        document.getElementById('impuesto').innerHTML = tasa.toFixed(2); //SPAN
                        $(".impuesto").val(tasa.toFixed(2));              //INPUT
                        //imprime el impuesto : IGV = 18%                                                                          
                                                               //TOTAL-FINAL  Importe-total+Descuento-Impuesto
                        document.getElementById('venta_total').innerHTML = total.toFixed(2);  //imprime el TOTAL-FINAL en id - SPAN
                        $(".venta_total").val(total.toFixed(2));  //imprime el TOTAL-FINAL en id -INPUT
                        $('#lista').append(fila); //Agrega Fila a la Tabla
                        $('#articulo_id').val("").trigger('change');   //Limpia los select
                        $('#nombre_mercancia_art').val("");            //Limpian campos
                        $('#stock_venta_det').val("");
                        $('#precio_venta_det').val("");
                        $('#max-stock-venta-det').val("");
                        $('#max-stock-venta-det').text("Stock disponible: ");
                        tablas ++;
                        cant_ventas++; //ids de la tabla por cada fila agregada + id del row(id)
                        contadorArticulos[articulo_Idx] = (contadorArticulos[articulo_Idx] || 0) + 1;
                    
                } 
        } else {
            Swal.fire({
                html: 'Advertencia: No se admite campos vacios',
                icon: 'warning',
            })
        }
    /*   
    }else{
        Swal.fire({
            html: 'Advertencia: Rellene los campos vacios,',
            icon: 'warning',
        })
    } */
}
//Esta funcion permite modificar todos los montos segun la edicion de los datos de cada fila de la TABLA
function calculo_modificar(id_row) {
    let importe_total_actual = $(".importes_total").val(); //10
    //let nuevo_importe_una_fila = 0;
    let importe_total_nuevo = 0;
    let total_general = 0;
    let row = document.getElementById(id_row);
    let inputs = row.getElementsByTagName('input');
    let tercerInput = inputs[2];
    let cuartoInput = inputs[3];
    let quintoInput = inputs[4];
    let stock_Ingreso = parseInt(tercerInput.value);
    let precio_Venta = parseFloat(cuartoInput.value);
    let antiguo_importe_reemplazar = parseFloat(quintoInput.value);

    nuevo_importe_una_fila = stock_Ingreso * precio_Venta;
    importe_total_nuevo = (parseFloat(importe_total_actual) - antiguo_importe_reemplazar) + nuevo_importe_una_fila;

    inputs[4].nextSibling.textContent = nuevo_importe_una_fila.toFixed(2);//le pone el valor en la parte del texto
    inputs[4].value = nuevo_importe_una_fila.toFixed(2);//le pone el valor en value del 5to input

    sumaImportes = importe_total_nuevo;

    let tasa = parseFloat($("#tasa_imp").val());
    tasa = (importe_total_nuevo * tasa) / 100;
    total_general = importe_total_nuevo + tasa;
    $("#impuesto").html(tasa.toFixed(2));
    $(".impuesto").val(tasa.toFixed(2));

    if (count % 2 === 1) {
        document.getElementById('venta_total').innerHTML = importe_total_nuevo.toFixed(2);
        $(".venta_total").val(importe_total_nuevo.toFixed(2));
    }else{
        document.getElementById('venta_total').innerHTML = total_general.toFixed(2);
        $(".venta_total").val(total_general.toFixed(2));
    }

    $("#importes_total").html(importe_total_nuevo.toFixed(2));
    $(".importes_total").val(importe_total_nuevo.toFixed(2));
}


//CALCULO DEL DESCUENTO segun   : TIPO DE DESCUENTO
$('#forma_descuento').change(function (e) {
    e.preventDefault();
    let tasa = parseFloat($("#tasa_imp").val());
    let total_importe = $(".importes_total").val();
    let tipo_descto = $('#tipo_descuento_venta').val();
    let moneda = $('.moneda_simbolo').val();
    let total = $(".venta_total").val();
    let descuento = parseFloat($("#descuento").val());
    //cosa nueva 2
    let comprobador_monto_descuento_existe = document.getElementById('descuento').value
    if(comprobador_monto_descuento_existe != ""){
    //fin cosa nueva 2
        if ($(this).val() == "1") {
            //PORCENTAJE   %
                
            if (tipo_descto == "antes impuesto" || tipo_descto == "despues impuesto") {
                let descuento_temp = parseFloat($("#descuento_tipo").text());   //esta linea toma el descuento que se cargo para sumar al total si en caso se ingrese nuevo descuento
                let total_temp = parseFloat($("#total_venta").val());
                let total_final_original = descuento_temp+total_temp;
                document.getElementById('venta_total').innerHTML = total_final_original.toFixed(2);
                $(".venta_total").val(total_final_original.toFixed(2));
                total = total_final_original;
            }

            if (tipo_descto == "antes impuesto") {
                if (descuento > 100) {  //el 100 es el descuento maximo en porcentaje

                    //cosa nueva 2
                    let import_tot = parseFloat($(".importes_total").val()) //solo importes
                    let tasa_import = parseFloat((import_tot * (tasa/100)).toFixed(2));
                    $("#impuesto").html(tasa_import);
                    $(".impuesto").val(tasa_import);
                    let total_total = import_tot + tasa_import;
                    document.getElementById('venta_total').innerHTML = total_total;  //imprime el TOTAL-FINAL
                    $(".venta_total").val(total_total);
                    var element = document.getElementById("forma_descuento");
                    element.selectedIndex = 0;
                    $('#descuento').val("");
                    document.getElementById('descuento_tipo_input').value = 0;
                    var element = document.getElementById("descuento_tipo");
                    element.textContent = "0";    

                    //fin cosa nueva 2
                    Swal.fire({
                        html: 'Error: Descuento no puede superar Importe',
                        icon: 'warning',
                    })

                } else {
                    let total_descuento = (total_importe * descuento) / 100;    //10   %descuento(importe)
                    total_descuento = parseFloat(total_descuento.toFixed(2));
                    tasa = ((total_importe - total_descuento) * tasa) / 100;    //8 igv
                    let total_con_descuento = (total_importe - total_descuento) + tasa;    //total - %descuento(importe)
                    document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2); //imprimo el valor en html 
                    $(".venta_total").val(total_con_descuento.toFixed(2));  //imprime el valor en el input (clase)
                    $("#descuento_tipo").html(total_descuento.toFixed(2)); //imprime el valor de descuento en el html
                    document.getElementById('descuento_tipo_input').value = total_descuento.toFixed(2);
                    $("#impuesto").html(tasa.toFixed(2));
                    $(".impuesto").val(tasa.toFixed(2));
                    $(".importes_total").val(total_importe);
                }

            } else if (tipo_descto == "despues impuesto") {
                if (descuento > 100) {

                    //cosa nueva 2
                    var element = document.getElementById("forma_descuento");
                    element.selectedIndex = 0;
                    $('#descuento').val("");
                    document.getElementById('descuento_tipo_input').value = 0;
                    var element = document.getElementById("descuento_tipo");
                    element.textContent = "0";    
                    //fin cosa nueva 2

                    Swal.fire({
                        html: 'Error: Descuento no puede superar el Total',
                        icon: 'warning',
                    })

                } else {
                    tasa = (total_importe * tasa) / 100;
                    let total_descuento = (total * descuento) / 100;        //  %descuento(total)   
                    let total_con_descuento = total - total_descuento;   // total - %descuento(total)
                    document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2);  //imprime el TOTAL-FINAL
                    $(".venta_total").val(total_con_descuento.toFixed(2));  //imprime el valor en el input (clase)
                    $("#descuento_tipo").html(total_descuento.toFixed(2));  //imprime el valor de descuento en el html
                    $("#descuento_tipo_input").val(total_descuento.toFixed(2));
                    $("#impuesto").html(tasa.toFixed(2));
                    $(".impuesto").val(tasa.toFixed(2));
                    $(".importes_total").val(total_importe);
                }
            } else {
                alert("sin descuento")
            }

        } else {
            //CANTIDAD FIJA
            if (tipo_descto == "antes impuesto" || tipo_descto == "despues impuesto") {
                let descuento_temp = parseFloat($("#descuento_tipo").text());   //esta linea toma el descuento que se cargo para sumar al total si en caso se ingrese nuevo descuento
                let total_temp = parseFloat($("#total_venta").val());
                let total_final_original = descuento_temp+total_temp;
                document.getElementById('venta_total').innerHTML = total_final_original.toFixed(2);
                $(".venta_total").val(total_final_original.toFixed(2));
                total = total_final_original;
            }

            if (tipo_descto == "antes impuesto") {
                
                if (descuento > total_importe) {
                    let import_tot = parseFloat($(".importes_total").val()) //solo importes
                    let tasa_import = parseFloat((import_tot * (tasa/100)).toFixed(2));
                    $("#impuesto").html(tasa_import);
                    $(".impuesto").val(tasa_import);
                    let total_total = import_tot + tasa_import;
                    document.getElementById('venta_total').innerHTML = total_total;  //imprime el TOTAL-FINAL
                    $(".venta_total").val(total_total);
                    $('#descuento').val("");
                    document.getElementById('descuento_tipo_input').value = 0;
                    var element = document.getElementById("descuento_tipo");
                    element.textContent = "0";
                    Swal.fire({
                        html: 'Error: Descuento no puede superar el Importe',
                        icon: 'warning',
                    })
                } else {
                    let total_descuento = total_importe - descuento;// total - descuento(importe)      
                    tasa = (total_descuento * tasa) / 100;
                    let total_final = total_descuento + tasa;
                    document.getElementById('venta_total').innerHTML = total_final.toFixed(2);
                    $(".venta_total").val(total_final.toFixed(2));
                    $("#descuento_tipo").html(descuento.toFixed(2)); //imprime el descuento en el html
                    document.getElementById('descuento_tipo_input').value = descuento.toFixed(2);
                    $("#impuesto").html(tasa.toFixed(2));
                    $(".impuesto").val(tasa.toFixed(2));
                    $(".importes_total").val(total_importe);
                }

            } else if (tipo_descto == "despues impuesto") {
                console.log("Vamos bn");
                if (descuento > total) {

                    //cosas nuevas 2
                    let import_tot = parseFloat($(".importes_total").val()) //solo importes
                    let tasa_import = parseFloat((import_tot * (tasa/100)).toFixed(2));
                    let total_total = import_tot + tasa_import;
                    $('#descuento').val("yyy");
                    document.getElementById('venta_total').innerHTML = total_total;
                    document.getElementById('descuento_tipo_input').value = 0;
                    $(".venta_total").val(total_total);
                    var element = document.getElementById("descuento_tipo");
                    element.textContent = "0";   
                    //fin cosas nuevas 2

                    Swal.fire({
                        html: 'Error: Descuento no puede superar el Total',
                        icon: 'warning',
                    })
                } else {

                    tasa = (total_importe * tasa) / 100;
                    let total_con_descuento = total - descuento;  // total - descuento(total)
                    document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2);
                    $(".venta_total").val(total_con_descuento.toFixed(2));
                    $("#descuento_tipo").html(descuento.toFixed(2));
                    document.getElementById('descuento_tipo_input').value = descuento.toFixed(2);
                    $("#impuesto").html(tasa.toFixed(2));
                    $(".impuesto").val(tasa.toFixed(2));
                    $(".importes_total").val(total_importe);
                }
            } else {
                alert("sin descuento")
            }
        }

    //cosa nueva 2
    }else{
        var element = document.getElementById("forma_descuento");
        element.selectedIndex = 0;
        $("#descuento").attr("disabled",true);
            $("#forma_descuento").attr("disabled", true);
        $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
        Swal.fire({
            html: 'Error: Debe introducir un monto antes del tipo de descuento, reintente',
            icon: 'warning',
        })
    }
    //fin cosa nueva 2
}
);

//Esto sucede si se elimina una fila, se restan los datos ingresados de la fila eliminada
function eliminar_venta(id_row, row) {
    Swal.fire({
        title: '¿Desea eliminar esta fila?',
        showCancelButton: true,
        confirmButtonText: `Eliminar`,
        confirmButtonColor: "#FF0000",
        icon: "warning",
    }).then((result) => {

        if (result.isConfirmed) {
            let importe_Total_Actual = $(".importes_total").val();

            let import_Total_Nuevo = 0;

            let row_fila = document.getElementById(id_row);
            let inputs = row_fila.getElementsByTagName('input');
            let quintoInput = inputs[4];
            let antiguo_importe_una_fila_restar = parseFloat(quintoInput.value);
            let segundoInput = inputs[1];
            sumaImportes = sumaImportes - antiguo_importe_una_fila_restar; //el conteo general de sumaImportes debe restarse
            import_Total_Nuevo = sumaImportes;
            //inicio codigo eliminar articulo de la variable objeto contador: contadorArticulos = {}
            let valorArticuloIndex = parseFloat(segundoInput.value);
            delete contadorArticulos[valorArticuloIndex];
            //fin
            let tasa = parseFloat($("#tasa_imp").val());
            tasa = (import_Total_Nuevo * tasa) / 100;  //nueva tasa por valor eliminado

            if (count % 2 === 1) {
                total_general = import_Total_Nuevo;
            }else{
                total_general = import_Total_Nuevo + tasa;   //total nuevo por valor eliminado
            }
            $("#impuesto").html(tasa.toFixed(2));
            $(".impuesto").val(tasa.toFixed(2));
            
            document.getElementById('venta_total').innerHTML = total_general.toFixed(2);
            $(".venta_total").val(total_general.toFixed(2));

            $("#importes_total").html(import_Total_Nuevo.toFixed(2));
            $(".importes_total").val(import_Total_Nuevo.toFixed(2));

            $("#row" + row).remove();
            Swal.fire({
                html: 'Fila eliminada!',
                timer: 1000,
                icon: 'success',
                showConfirmButton: false
            });
            //focus despues de agregar  el cursos se queda alli
            $('#articulo_id').val('').focus();

        }
    });
}

