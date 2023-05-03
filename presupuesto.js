$(document).ready(function () {
    listarServicios();
    combo_impuestos();
    combo_proveedores();
    combo_servicios();
    combo_monedas();
    combo_clientes();
    combo_empleados();
    $(".select2").select2(); 
    $('#respaldo_valor_estado').val($('#estado_venta').val());
});

//Vista Registrar_Servicio
const formulario = $('#form_venta')



//Boton Volver
function Volver(){
    location.href= ruta+ '/PresupuestoProductosController'
}
//Guarda todas las compras de la TABLA
$(formulario).submit(function (e) {
    e.preventDefault();
    $("#button_add").html('<img class="loader_button" src="' + ruta + '/recursos/img/loader/loader.gif" alt="loader"> cargando...').attr("disabled", true);
    $.ajax({
        type: "post",
        url: ruta + "/create-PresupuestoServicios",
        data: new FormData(formulario[0]),
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.error == "") {
                $('#table_presupuesto_servicios').DataTable().ajax.reload();
                formulario[0].reset();
                swal.fire({
                    title: response.ok,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
                $("#button_add").html('Guardar').attr("disabled", false);
                location.href =ruta+'/PresupuestoProductosController';
            } else {
                swal.fire({
                    title: "¡Error!",
                    html: response.error,
                    icon: "error",
                    showConfirmButton: true,
                });
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


//LISTA DE LA TABLA PRINCIPAL : PRESUPUESTO - Servicios
function listarServicios() {
    $('#table_presupuesto_servicios').DataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
        "ajax": {
            url: ruta + "/getPresupuestoServicios",
            type: "post"
        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 5,
        "order": [[0, "desc"]],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        "pagingType": "simple_numbers",
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
    });
}


//MOSTRAR MODAL OCULTO
function mostrar_detalles_servicios(id) {
    $("#modal_detalles_servicios").modal("show");
    $("#header").addClass("bg-gradient-success");
    $("#lbltitulo").html("Lista de Detalles de Presupuesto");
    listar_detalles_servicios(id);
}

//Lista del modalmantenimiento --> LISTA TABLA DETALLES-SERVICIOS
function listar_detalles_servicios(id) {
    $('#table_detalles_servicios').DataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
        "ajax": {
            url: ruta + "/getPresupuestoDetallesServicios",
            type: "post",
            data: {
                //nombre de campo controlar/dato que paso
                id:id
            }
        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 5,
        "order": [[0, "desc"]],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        "pagingType": "simple_numbers",
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
    });
}



//Selects Articulos + 
//Una variable objeto para el conteo de Articulos y no ingresar 2 articulos a listar en la TABLA ->AgregarCompra()
//Nota: data es un dom y lo convierte a formato html legible para seleccionar todos los nombres del Selects que existen y se usa en AgregarCompra()
const nombreArticulosObj = {};


function combo_servicios() {
    $.post(ruta + "/lista_servicios",
        function (data, textStatus, jqXHR) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const options = doc.querySelectorAll('option');
            options.forEach((option) => {
            if (option.value !== '') {
                nombreArticulosObj[option.value] = option.textContent;
            }
            });
            $(".selectservicios").html(data);
        },
    ); 
}

// Selects Impuestos
function combo_impuestos() {
    $.post(ruta + "/lista_impuestos",
        function (data, textStatus, jqXHR) {
            $(".selectimpuestos").html(data);
        },
    ); 
}

//Selects Proveedores
function combo_proveedores() {
    $.post(ruta + "/lista_proveedores",
        function (data, textStatus, jqXHR) {
            $(".selectproveedores").html(data);
        },
    ); 
}

//Selects Monedas
function combo_monedas(){
    $.post(ruta + "/lista_monedas",
    function (data, textStatus, jqXHR){
        $(".selectmonedas").html(data);
    },
    );
}


function combo_clientes(){
    $.post(ruta + "/lista_perfil_cliente",
    function (data, textStatus, jqXHR){
        $(".selectperfilclientes").html(data);
    },
    );
}

function combo_empleados(){
    $.post(ruta + "/Trabajadores/combo_empleados",
    function (data, textStatus, jqXHR){
        $(".selectempleados").html(data);
    },
    );
}



//Obtencion y Agregacion de nombre de Articulo a un INPUT para tomar valor-hidden 
$("#articulo_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getServicio-x-id",{
        //
        id:$(this).val()
    },
    function (data, textStatus, jqXHR) {
        if (data && data.data && data.data.length > 0) {
        $('#nombre_mercancia_art').val(data.data[0].nombre_servicio);
        $('#precio_venta_det').val(data.data[0].precio_servicio);
        }
    },
    'json'
    ); 
})


//Obtencion y agregacion de la tasa(numero) de Impuesto->Ejm:IGV a un INPUT para tomar valor-hidden 
$("#impuesto_id").change(function (e) {
    e.preventDefault();
    $.post(ruta + "/getImpuesto_x_id",{
        id:$(this).val()
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
    $.post(ruta + "/getMoneda_x_id",{
        id:$(this).val()
    },
    function (data, textStatus, jqXHR) {
        $('#nombre_mon').val(data.data[0].nombre_mon);
        moneda = data.data[0].simbolo_mon;
        document.getElementById("mon_simbolo1").innerHTML = moneda;
        document.getElementById("mon_simbolo2").innerHTML = moneda;
        document.getElementById("mon_simbolo3").innerHTML = moneda;
    },
    'json'
); 
})


//Esto hace que el input donde se ingresa el valor del descuento se quede inabilitado hasta poner un Tipo de Descuento
$('#tipo_descuento_venta').change(function (e) { 
    e.preventDefault();
    if($(this).val()=="sin descuento"){
        $("#descuento").attr("disabled",true);
        $("#forma_descuento").attr("disabled", true);
    }else{
        $("#descuento").attr("disabled",false);
        $("#forma_descuento").attr("disabled", false);
    }
});


$('#fecha_venta').change(function (e) { 

    let fech_caduc_vent = document.getElementById("fecha_caducidad_venta").value;
    
    if(fech_caduc_vent != '' && $(this).val()> fech_caduc_vent){
        
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


    if(fech_vent != '' && fecha_caduc_vent!='' && date_fecha_caduc_vent< date_fech_vent){
        Swal.fire({
            html: 'Error: No debe ingresar una fecha de caducidad menor que Fecha de Venta',
            icon: 'warning',
        })
    $('#fecha_caducidad_venta').val("");
    }

    
    if(date_fecha_caduc_vent < fecha_Actual){
        
        $('#estado_venta').val('expirado').trigger('change.select2');
        $('#respaldo_valor_estado').val($('#estado_venta').val());
        $('#estado_venta').attr('disabled', true);
    }else{
        $('#estado_venta').attr('disabled', false);
        $('#respaldo_valor_estado').val($('#estado_venta').val());
        if ($('#estado_venta').val() === 'expirado') {
            $('#estado_venta').val('borrador').trigger('change.select2');
            $('#respaldo_valor_estado').val($('#estado_venta').val());
        }
    }

});



$('#tipo_descuento_venta').change(function (e) { 
    e.preventDefault();
    if($(this).val()=="sin descuento"){
        $("#descuento").attr("disabled",true);
        $("#forma_descuento").attr("disabled", true);
    }else{
        $("#descuento").attr("disabled",false);
        $("#forma_descuento").attr("disabled", false);
    }
});
/*
$('#estado_venta').change(function (e) { 
    $('#respaldo_valor_estado').val($('#estado_venta').val());
});*/
let contador_igv = 0;
let count = 0;
$(".sincon_igv").val(count);

function sin_con_igv(){
    count++;
    if (count % 2 === 1) {
        $(".sincon_igv").val(count);
        var option = document.querySelector("#tipo_descuento_venta option[value='antes impuesto']");
        option.remove();

        $('#tipo_descuento_venta').val('sin descuento').trigger('change.select2');
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
            let valor_input4 = (parseFloat(input4.value) / (1+(tasa/100))).toFixed(2);;
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
        console.log("SumTot: ",sumaImportes);
        console.log("tasa: ",tasa);
        newtasa = sumaImportes * (tasa/100);
        total = sumaImportes + newtasa;
        document.getElementById('impuesto').innerHTML = newtasa.toFixed(2); //SPAN
        $(".impuesto").val(newtasa.toFixed(2));              //INPUT
        document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
        $(".importes_total").val(sumaImportes.toFixed(2));
        document.getElementById('venta_total').innerHTML = total.toFixed(2); 
        $(".venta_total").val(total.toFixed(2));  
        $(".sincon_igv").val(count);
    }
    
}

//VARIABLES de la funcion AgregarCompra()
let cant_ventas = 0;
let cont_id = 0;
let sumaImportes = 0;
let sumaImportes_mod = 0;
let total = 0
let forma_Descuento1 =  "";
let forma_Descuento2 =  "";
let valorDescuento = 0;
let tablas = 0;
let titulos = [];
let contadorArticulos = {};
let articulo_eliminar = {};
let tbody_datos = "";
cont =0;
let hasEmptied = false;  //para que quite tabla de muestra
let contadorTitulos = {};

function AgregarVenta() {
    let titulo_productos = document.getElementById("titulo_productos").value;
    let titulo_productos_lower = titulo_productos.toLowerCase();
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
    let importe_det = (parseFloat(stock_ingreso)*parseFloat(precio_venta)).toFixed(2);
    console.log("Comp-ImpIndiv: ",importe_det)
    valorDescuento = document.getElementById("descuento").value;
    let existe = false;

    let tasa = document.getElementById('tasa_imp').value;
    /*
    if(nombre_mercancia!="" && moneda_Idx!="" && stock_ingreso!="" && precio_venta !="" && impuesto_Idx!=""
    && fecha_Venta!="" && cliente_Idx!="" && agente_Idx!="" && fecha_Caducidad_Venta!="" && stock_ingreso!=""){
        */
        if(titulo_productos!=""){
            if (!hasEmptied) {
                $("#tabla_muestra").empty();
                hasEmptied = true;
            }
            if (count % 2 === 1) {
                precio_venta= parseFloat(precio_venta);
                precio_venta = precio_venta + (precio_venta*(tasa/100));
                precio_venta = (precio_venta).toFixed(2);
                console.log("Nuevo pv: "+precio_venta);
            }
            let id_row = 'row' + cant_ventas;
            let datos_filas=``; //codigo - fin 2 
            
            for (let key in contadorArticulos) {
                if (key.toLowerCase() === titulo_productos_lower) {
                    existe = true;
                    titulo_productos = key;
                    break;
                }
            }
            if (!existe) {
                contadorTitulos[titulo_productos] = {};
                contadorTitulos[titulo_productos][cont] = true;
                contadorArticulos[titulo_productos] = {};
                articulo_eliminar[titulo_productos] = {};
                let titles = Object.keys(contadorArticulos);
                let index = titles.indexOf(titulo_productos);

                tbody_datos = "tbody_ventas_" + index;
                let estructura_tabla = `<table class="table table-striped" style="width: 100%;">   
                                                <thead class="table-dark">
                                                    <th colspan="6" style="background-color:#34495E;">
                                                        <input type="text" onchange="cambiar_titulo(${cont});" id="${cont}" value="${titulo_productos}" style="width:100%; text-align:center; font-size:15px; background-color:#EAF2F8; color:#34495E;">                                                            </th>
                                                    <tr  style="background-color:#34495E;">
                                                        <th>#</th>
                                                        <th>Producto</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio de Venta</th>
                                                        <th>Importe </th>
                                                        <th>Opcion </th>
                                                    </tr>
                                                </thead>
                                                <tbody id="${tbody_datos}">     
                                                </tbody>
                                            </table>`;
                $("#padre-tablas").append(estructura_tabla);
                cont++;
                    
            }
            if (!contadorArticulos[titulo_productos][articulo_Idx]) {
                // Si no existe, establecer su valor en true
                contadorArticulos[titulo_productos][articulo_Idx] = true;
                let titles = Object.keys(contadorArticulos);
                let index = titles.indexOf(titulo_productos);
                tbody_datos = "tbody_ventas_" + index;
                let importe_temp = 0;
                if(count % 2 === 1){
                    let tasax = document.getElementById('tasa_imp').value
                    importe_temp = 0
                    importe_temp = (parseFloat(importe_det) + ((tasax/100)*parseFloat(importe_det))).toFixed(2);
                    datos_fila = `<tr id="${id_row}">
                                        <td><input type="hidden" value="${cant_ventas + 1}" name="cant_ventas[]">${cant_ventas + 1}</td>
                                        <td><input type="hidden" value="${articulo_Idx}" name="articuloId[]">${nombre_mercancia}</td>
                                        <td><input onchange="calculo_modificar('${id_row}');" type="number" value="${stock_ingreso}" name="stock_ingreso[]"></td>
                                        <td><input onchange="calculo_modificar('${id_row}');"type="text" value="${precio_venta}" name="precio_venta[]"></td>    
                                        <td><input type="hidden" value="${importe_temp}" name="importe_det[]">${importe_temp}</td>
                                        <td><a href="#" onclick="eliminar_venta('${id_row}',${cant_ventas});" class="btn btn-circle btn-sm btn-danger" title="Eliminar"><i class="fa fa-solid fa-trash"></i></a></td>
                                    </tr>`;
                }else{
                    datos_fila = `<tr id="${id_row}">
                                            <td><input type="hidden" value="${cant_ventas + 1}" name="cant_ventas[]">${cant_ventas + 1}</td>
                                            <td><input type="hidden" value="${articulo_Idx}" name="articuloId[]">${nombre_mercancia}</td>
                                            <td><input onchange="calculo_modificar('${id_row}');" type="number" value="${stock_ingreso}" name="stock_ingreso[]"></td>
                                            <td><input onchange="calculo_modificar('${id_row}');"type="text" value="${precio_venta}" name="precio_venta[]"></td>    
                                            <td><input type="hidden" value="${importe_det}" name="importe_det[]">${importe_det}</td>
                                            <td><a href="#" onclick="eliminar_venta('${id_row}',${cant_ventas});" class="btn btn-circle btn-sm btn-danger" title="Eliminar"><i class="fa fa-solid fa-trash"></i></a></td>
                                        </tr>`;
                }

                articulo_eliminar[titulo_productos][cant_ventas] = true;

                if (count % 2 === 1) {
                    sumaImportes = sumaImportes + parseFloat(importe_temp);
                }else{
                    sumaImportes = sumaImportes + parseFloat(importe_det); 
                }
                sumaImportes = parseFloat(sumaImportes.toFixed(2));
                let tasa = document.getElementById('tasa_imp').value;
                document.getElementById('tasa').innerHTML = tasa;
                document.getElementById('importes_total').innerHTML = sumaImportes.toFixed(2);
                $(".importes_total").val(sumaImportes.toFixed(2));
                tasa = sumaImportes*(tasa/100);    //tasa total
                if (count % 2 === 1) {
                    total = sumaImportes;//TOTAL-FINAL  Importe +Impuesto
                }else{
                    total = sumaImportes + tasa;//TOTAL-FINAL  Importe+Impuesto
                }
                document.getElementById('impuesto').innerHTML = tasa.toFixed(2); //SPAN
                $(".impuesto").val(tasa.toFixed(2));              //INPUT
                                     
                document.getElementById('venta_total').innerHTML = total.toFixed(2);  //imprime el TOTAL-FINAL en id - SPAN
                $(".venta_total").val(total.toFixed(2));  //imprime el TOTAL-FINAL en id -INPUT
                
                $('#articulo_id').val("").trigger('change');   //Limpia los select
                $('#nombre_mercancia_art').val("");            //Limpian campos
                $('#stock_venta_det').val("");
                $('#precio_venta_det').val("");
                $("#" + tbody_datos).append(datos_fila);  
            }else{
            Swal.fire({
                html: 'No se admite registrar 2 veces el mismo articulo - Intente en la próxima compra',
                icon: 'warning',
            })
            }
            cant_ventas++;
        
            $("#servicio_titulo").val(JSON.stringify(contadorArticulos));
        }else{
            Swal.fire({
            html: 'Advertencia - Titulo es un campo obligatorio',
            icon: 'warning',
            })
        }
        /*
    }else{
        Swal.fire({
                html: 'Advertencia: No se admite campos vacios',
                icon: 'warning',
            })
    }*/
}
//Esta funcion permite modificar todos los montos segun la edicion de los datos de cada fila de la TABLA
function calculo_modificar(id_row) {
    let importe_total_actual = $(".importes_total").val(); //10
    let nuevo_importe_una_fila = 0;
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
    importe_total_nuevo = (parseFloat(importe_total_actual) - antiguo_importe_reemplazar)+ nuevo_importe_una_fila;

    inputs[4].nextSibling.textContent = nuevo_importe_una_fila.toFixed(2);//le pone el valor en la parte del texto
    inputs[4].value = nuevo_importe_una_fila.toFixed(2);//le pone el valor en value del 5to input

    sumaImportes = importe_total_nuevo;

    let tasa =  parseFloat($("#tasa_imp").val());
    tasa = (importe_total_nuevo* tasa)/100;
    
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
    let tasa =  parseFloat($("#tasa_imp").val());
    let total_importe = $(".importes_total").val();
    let tipo_descto = $('#tipo_descuento_venta').val();
    let total = $(".venta_total").val();
    let descuento = parseFloat($("#descuento").val());

    if($(this).val()=="1"){
         //PORCENTAJE   %
        if(tipo_descto == "antes impuesto"){     
            if(descuento>100){  //el 100 es el descuento maximo en porcentaje
                Swal.fire({
                    html: 'Error: Descuento no puede superar Importe',
                    icon: 'warning',
                })          
            }else{
            let total_descuento = (total_importe*descuento)/100;    //10   %descuento(importe)
            tasa = ((total_importe - total_descuento)*tasa)/100;    //8 igv
            let total_con_descuento = (total_importe - total_descuento)+tasa;    //total - %descuento(importe)
            document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2); //imprimo el valor en html 
            $(".venta_total").val(total_con_descuento.toFixed(2));  //imprime el valor en el input (clase)
            $("#descuento_tipo").html(total_descuento.toFixed(2)); //imprime el valor de descuento en el html
            document.getElementById('descuento_tipo_input').value = total_descuento.toFixed(2);
            $("#impuesto").html(tasa.toFixed(2));
            $(".impuesto").val(tasa.toFixed(2));
            $(".importes_total").val(total_importe);
            }
        }else if(tipo_descto == "despues impuesto"){
            if(descuento>100){
                Swal.fire({
                    html: 'Error: Descuento no puede superar el Total',
                    icon: 'warning',
                })
            }else{
            tasa = (total_importe*tasa)/100;   
            let total_descuento = (total*descuento)/100;        //  %descuento(total)   
            let total_con_descuento = total - total_descuento;   // total - %descuento(total)
            document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2);  //imprime el TOTAL-FINAL
            $(".venta_total").val(total_con_descuento.toFixed(2));  //imprime el valor en el input (clase)
            $("#descuento_tipo").html(total_descuento.toFixed(2));  //imprime el valor de descuento en el html
            $("#descuento_tipo_input").val(total_descuento.toFixed(2));
            $("#impuesto").html(tasa.toFixed(2));
            $(".impuesto").val(tasa.toFixed(2));
            $(".importes_total").val(total_importe);
            }
        }else {
            alert("sin descuento")
        }
        
    }else{
        //CANTIDAD FIJA   
        if(tipo_descto == "antes impuesto"){  

            if(descuento>total_importe){
                Swal.fire({
                    html: 'Error: Descuento no puede superar el Importe',
                    icon: 'warning',
                })
            }else{
            let total_descuento = total_importe - descuento;// total - descuento(importe)      
            tasa = (total_descuento*tasa)/100;
            let total_final =   total_descuento + tasa;
            document.getElementById('venta_total').innerHTML = total_final.toFixed(2);
            $(".venta_total").val(total_final.toFixed(2));
            $("#descuento_tipo").html(descuento.toFixed(2)); //imprime el descuento en el html
            document.getElementById('descuento_tipo_input').value = descuento.toFixed(2);
            $("#impuesto").html(tasa.toFixed(2));
            $(".impuesto").val(tasa.toFixed(2));
            $(".importes_total").val(total_importe);
            }
            
        }else if(tipo_descto == "despues impuesto"){

            if(descuento>total){
                Swal.fire({
                    html: 'Error: Descuento no puede superar el Total',
                    icon: 'warning',
                })
            }else{
            
            tasa = (total_importe * tasa)/100;
            let total_con_descuento = total - descuento;  // total - descuento(total)
            document.getElementById('venta_total').innerHTML = total_con_descuento.toFixed(2);
            $(".venta_total").val(total_con_descuento.toFixed(2));
            $("#descuento_tipo").html(descuento.toFixed(2));
            document.getElementById('descuento_tipo_input').value = descuento.toFixed(2);
            $("#impuesto").html(tasa.toFixed(2));
            $(".impuesto").val(tasa.toFixed(2));
            $(".importes_total").val(total_importe);
            }
        }else {
            alert("sin descuento")
        }
    }
}
);  

function cambiar_titulo(cont){
    let articulo_nuevo = document.getElementById(cont).value;
    let nuevoContadorArticulo = {};
    let nuevoContadorArticuloEliminar = {};
    let nuevoContadorTitulos = {};
    let tituloConValor = "";  //servicio antiguo
    console.log(cont);
    console.log(articulo_nuevo);
    $("#" + cont).val(articulo_nuevo);
    
    for (let titulo in contadorTitulos) {
        if (contadorTitulos[titulo][cont] === true) {
            tituloConValor = titulo;
        }
    }
    console.log(tituloConValor);

    for (let propiedad in contadorTitulos) {
        if (propiedad === tituloConValor) {
            nuevoContadorTitulos[articulo_nuevo] = contadorTitulos[propiedad];
        } else {
            nuevoContadorTitulos[propiedad] = contadorTitulos[propiedad];
        }
    }
    contadorTitulos=nuevoContadorTitulos;

    for (let propiedad in contadorArticulos) {
        if (propiedad === tituloConValor) {
            nuevoContadorArticulo[articulo_nuevo] = contadorArticulos[propiedad];
        } else {
            nuevoContadorArticulo[propiedad] = contadorArticulos[propiedad];
        }
    }
    contadorArticulos = nuevoContadorArticulo;

    for (let propiedad in articulo_eliminar) {
        if (propiedad === tituloConValor) {
            nuevoContadorArticuloEliminar[articulo_nuevo] = articulo_eliminar[propiedad];
        } else {
            nuevoContadorArticuloEliminar[propiedad] = articulo_eliminar[propiedad];
        }
    }
    articulo_eliminar = nuevoContadorArticuloEliminar;
    $("#servicio_titulo").val(JSON.stringify(contadorArticulos));
}

//Esto sucede si se elimina una fila, se restan los datos ingresados de la fila eliminada
function eliminar_venta(id_row,row) {
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

            let quintoInput = inputs[4]; //Importe del articulo 0    1
            let antiguo_importe_una_fila_restar = parseFloat(quintoInput.value);    

            let segundoInput = inputs[1];   //esto se obtiene para eliminar el articulo del contadorArticulos porque se eliminaria
            sumaImportes = sumaImportes - antiguo_importe_una_fila_restar; //el conteo general de sumaImportes debe restarse
            import_Total_Nuevo = sumaImportes;

            //inicio codigo eliminar articulo de la variable objeto contador: contadorArticulos = {}
            let valorArticuloIndex = parseFloat(segundoInput.value);
            for(let articulo in articulo_eliminar){
                if(articulo_eliminar[articulo][row]){
                    let rowString = row.toString();
                    let posicion = Object.keys(articulo_eliminar[articulo]).indexOf(rowString);
                    delete articulo_eliminar[articulo][row];
                    let datos_objeto_principal = Object.keys(contadorArticulos[articulo]);
                    let dato_segun_posicion = datos_objeto_principal[posicion];
                    delete contadorArticulos[articulo][dato_segun_posicion];

                    for (let oficina in contadorArticulos) {
                        console.log("oooooooooooooooooooooooooooo");
                        console.log(oficina);
                        if (Object.keys(contadorArticulos[oficina]).length === 0) {
                            delete contadorArticulos[oficina];
                            var table = $("table:contains('" + oficina + "')");

                            table.nextAll("table").find("tbody[id^='tbody_ventas_']").each(function() {
                                var id = $(this).attr("id");
                                var num = parseInt(id.split("_").pop());
                                $(this).attr("id", "tbody_ventas_" + (num - 1));
                            });
                            let valorTitulo = null;
                            for (let titulo in contadorTitulos) {
                                if (titulo === oficina) {
                                    for (let num in contadorTitulos[titulo]) {
                                        if (contadorTitulos[titulo][num] === true) {
                                            valorTitulo = num;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            //$("input[value='" + oficina + "']").closest("table").remove();//SI se mantiene este codigo habra el error de titulo
                            $("#" + valorTitulo).closest("table").remove();


                        }
                    }
                }
            }
            //delete contadorArticulos[valorArticuloIndex];
            //fin
            let tasa =  parseFloat($("#tasa_imp").val());
            tasa = (import_Total_Nuevo* tasa)/100;  //nueva tasa por valor eliminado
            total_general = import_Total_Nuevo + tasa;   //total nuevo por valor eliminado
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
            $("#servicio_titulo").val(JSON.stringify(contadorArticulos));
            $('#articulo_id').val('').focus();

            
        }
    });
}




