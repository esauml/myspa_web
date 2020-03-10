/*
 * Variables globales
 */

// documento arreglo JSON de reservaciones traído por REST
var reservacionesJSON;
// documento arreglo JSON de tratamientos traidos por REST
// Sirven para agregarlos a un Servicio en Modal Atender
var tratamientosJSON;
// empleados en Atender
var empleadosJSON;

var tratamientosAgregados = [];

/******************************************************
 * Inicialización de página
 *******************************************************/

$(document).ready(function () {

    incializarComponentes();

    // Enlsta las reservaciones en la tabla
    listarReservaciones();

});

function incializarComponentes() {
    // incializa el Modal para que solo pueda cerrarse mediante su boton de cerrar
    $('#formularioReservacionModal').modal({
        backdrop: 'static',
        show: false
    });

    $('#formAtenderModal').modal({
        backdrop: 'static',
        show: false
    });

    // Llenado del contenido dinámico del formulario #formReservacion
    llenarContenidoReservacionFormulario();

    // llena los campos del modal Atender
    llenarCamposModalAtender();
}

/*
 * LLena los campos de Modal #formAtenderModal
 * 
 */
function llenarCamposModalAtender() {
    // llena el <section> empleados en 
    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/empleado/getAll'
    }).done(function (data) {
        // por si el servidor devuelve error en json
        if (data.error) {
            alert("Problema \n" + data.error);
            return;
        }

        // elimina las opciones que estaban el el <select> excepto la primera con indice[0]
        $("#empleadoAtender option").slice(1).remove();

        // Asigna a varible local el JSON
        empleadosJSON = data;

        // Recorre por cada elemento Empleado del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html += "<option value='" + item.idEmpleado + "'>" + item.nombre + "</option>";

            // Adición del HTML creado a <Section>
            $("#empleadoAtender").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX funcion llenarCamposReservacionAtender");
    });

    // llena el <section> tratamientos en Atender
    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/tratamiento/getAll'
    }).done(function (data) {
        // por si el servidor devuelve error en json
        if (data.error) {
            alert("Problema \n" + data.error);
            return;
        }

        // elimina las opciones que estaban en el <select> excepto la primera con indice[0]
        $("#tratamientosListadoAtender option").slice(1).remove();

        // Asigna a varible local el JSON
        tratamientosJSON = data;

        // Recorre por cada elemento Tratamiento del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html = "<option value='" + i + "'>" + item.nombre + "</option>";

            // console.log(html);

            // Adición del HTML creado a <Section>
            $("#tratamientosListadoAtender").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX funcion llenarCamposReservacionAtender");
    });
}

/*******************************************************
 * Event Handlers
 *******************************************************/

// Evento para toggle de modal RESERVACION
$("#btnAgregarReservacion").click(function () {
    $('#formularioReservacionModal').modal('toggle');
});

// Evento cuando se cierra el modal RESERAVCION, 
// elimina los datos del formulario
$('#formularioReservacionModal').on('hidden.bs.modal', function (e) {
    // después de cerrarse elimina los datos del formulario

    // selecciona el <option> default
    $('#sucursalReservacionListado option:eq(0)').prop('slected', true);
    $('#clienteReservacionListado option:eq(0)').prop('selected', true);
    $('#salaReservacionListado option:eq(0)').prop('selected', true);
    $('#horarioReservacionListado option:eq(0)').prop('selected', true);

    // selecciona date default en <input>
    $("#fechaReservacion").val("");
});

// Evento cuando se va a hacer una RESERVACIÓN
$('#formReservacion').on('submit', function (event) {

    // Previene la página de recargarse
    event.preventDefault();

    // variables de RESERVACION
    var idCliente = $("#clienteReservacionListado").val();
    var idSala = $("#salaReservacionListado").val();
    // obtiene el texto del <option>
    var horario = $("#horarioReservacionListado option:selected").text();
    var fecha = $("#fechaReservacion").val();

    //    console.log(idCliente);
    //    console.log(idSala);
    //    console.log(idHorario);
    //    console.log(idFecha);

    // Envia los datos al servicio REST
    $.ajax({
        type: 'post',
        url: 'http://localhost:18835/myspa_rest/api/reservacion/agregar',
        data: {
            idCliente: idCliente,
            idSala: idSala,
            horario: horario,
            fecha: fecha
        }
    }).done(function (data) {
        if (data.error) {
            alert("Problema \n" + data.error);
            return;
        }
        console.log("correcto");

        // cierra el modal
        $("#formularioReservacionModal").modal('hide');

        // enlista de nuevo las reservaciones
        listarReservaciones();


    }).fail(function (data) {
        console.log("falló ajax\n");
        console.log(data);
    });
});

// Evento cuando se elige sucursales
// muestra salas de una sucursal
// #formReservacion
$('#sucursalReservacionListado').change(function () {
    // selecciona las dependencias a los dependientes a default
    $('#salaReservacionListado option:eq(0)').prop('selected', true);
    $('#horarioReservacionListado option:eq(0)').prop('selected', true);

    var idSucursal = $('#sucursalReservacionListado').val();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/sala/getByIdSucursal/' + idSucursal
    }).done(function (data) {

        // si devuelve en JSON error salir del método
        if (data.error) {
            alert("Problema: \n" + data.error);
            return;
        }

        // console.log(data);

        // elimina las opciones que estaban el el <select> excepto la primera con indice[0]
        $("#salaReservacionListado option").slice(1).remove();



        // Recorre por cada elemento Sala del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html += "<option value='" + item.idSala + "'>" + item.nombre + "</option>";

            // Adición del HTML creado a <Section>
            $("#salaReservacionListado").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX");
    });
});

// Evento cuando se elige sala de #formReservacion
// Muestra los horarios de una sala
$("#salaReservacionListado").change(function () {

    // <option> seleccionado del <select>
    var idSalaReservacion = $(this).val();
    // console.log("sala: " + idSalaReservacion);

    // Llenado de horarios por sala
    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/horario/getByIdSala/' + idSalaReservacion
    }).done(function (data) {

        // si devuelve en JSON error salir del método
        if (data.error) {
            alert("Problema: \n" + data.error);
            return;
        }

        // console.log(data);

        // elimina las opciones que estaban el el <select> excepto la primera con indice[0]
        $("#horarioReservacionListado option").slice(1).remove();



        // Recorre por cada elemento Horario del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html += "<option value='" + item.idHorario + "'>" + item.horaInicio + " - " + item.horaFin + "</option>";

            // Adición del HTML creado a <Section>
            $("#horarioReservacionListado").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX");
    });
});

/**
 * Evento cuando se elige tratameiento en Atender
 * Agrega el tratamiento a la tabla tratamientosAgregados
 */
$('#tratamientosListadoAtender').change(function () {
    // obtiene el indice en JSON del tratamiento
    var tratamientoIndice = $('#tratamientosListadoAtender').val();

    // JSON del tratiento seleccionado
    var JSONTratamiento = tratamientosJSON[tratamientoIndice];

    // Lo agrega AL FINAL a los tratamientos Agregados
    tratamientosAgregados[tratamientosAgregados.length] = JSONTratamiento;

    // guarda el costo de tratamiento más sus produtos
    var costo = 0;

    // guardará el html de una fila en la tabla
    var html = "";

    html = "<tr><th scope='row'>" + JSONTratamiento.nombre + "</th>" +
        "<td>" + costo + "</td>" +
        "<td><a onclick='agregarProductosTratamiento(" + tratamientosAgregados.length + ")'><i class='fas fa-plus amber-text'></i></a></td>" +
        "</tr>";

    $('#tratamientosAgregadosAtender').append(html);

    // console.log(JSONTratamiento);
    // console.log(tratamientosAgregados);
});

/*******************************************************
 * Contenido dinámico de formularios
 *******************************************************/

// Llenado de <setion> clientes y sucursales en el formulario #formReservacion
function llenarContenidoReservacionFormulario() {

    // Llenado del <section> de clientes
    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/cliente/getAll'
    }).done(function (data) {

        // si devuelve en JSON error salir del método
        if (data.error) {
            alert("Problema: \n" + data.error);
            return;
        }

        // console.log(data);

        // elimina las opciones que estaban el el <select> excepto la primera con indice[0]
        $("#clienteReservacionListado option").slice(1).remove();



        // Recorre por cada elemento Cliente del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html += "<option value='" + item.idCliente + "'>" + item.nombre + " " + item.apellidoPaterno + "</option>";

            // Adición del HTML creado a <Section>
            $("#clienteReservacionListado").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX");
    });

    // Llenado del <section> de sucursales
    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/sucursal/getAll/'
    }).done(function (data) {

        // si devuelve en JSON error salir del método
        if (data.error) {
            alert("Problema: \n" + data.error);
            return;
        }

        // console.log(data);

        // elimina las opciones que estaban el el <select> excepto la primera con indice[0]
        $("#sucursalReservacionListado option").slice(1).remove();



        // Recorre por cada elemento Sucursal del array que devuelve el servicio REST.
        // Asigna cada elemento al <section>
        $.each(data, function (i, item) {

            // guardará el HTML de cada <option>
            var html = "";

            // console.log("each " + i);
            // console.log(item);

            // Construcción del HTML por <option>
            html += "<option value='" + item.idSucursal + "'>" + item.nombre + "</option>";

            // Adición del HTML creado a <Section>
            $("#sucursalReservacionListado").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX");
    });
}

// Para cuanda haga click en atender
// Abre el modal y llena los campos de referencia para el 
function atenderReservacion(posicionReservacionJSON) {
    //console.log(reservacionesJSON[posicionReservacionJSON]);

    var reservacion = reservacionesJSON[posicionReservacionJSON];

    var fecha = reservacion.fechaHoraInicio.substring(0, 10);
    var horaInicio = reservacion.fechaHoraInicio.substring(11);
    var horaFin = reservacion.fechaHoraFin.substring(11);

    // console.log("fecha " + fecha);

    $('#formAtenderModal').modal('toggle');

    $('#idReservacionAtender').html(reservacion.idReservacion);

    $('#fechaAtender').html(fecha);
    $('#horaInicioAtender').html(horaInicio);
    $('#horaFinAtender').html(horaFin);
    $('#horaFinAtender').html(horaFin);

    $('#idClienteAtender').html(reservacion.cliente.idCliente);
    $('#clienteAtender').html(reservacion.cliente.nombre);

    $('#idSalaAtender').html(reservacion.sala.idSala);
    $('#salaAtender').html(reservacion.sala.nombre);
}

/**
 * Evento cuando quiere agregar un producto
 */
function agregarProductoTratamiento(indiceTratamiento) {
    var clase = ["green-text", "amber-text"];
    // 
}

/*******************************************************
 * CRUD funciones
 *******************************************************/

function listarReservaciones() {
    // var token = localStorage.getItem("token");
    // console.log("token: " + token);

    $.ajax({
        type: 'GET',
        url: 'http://localhost:18835/myspa_rest/api/reservacion/getAll'
    }).done(function (data) {

        // si devuelve en JSON error salir del método
        if (data.error) {
            alert("Problema: \n" + data.error);
            return;
        }

        // console.log(data);

        // se asigna el json a la variable global para su posterior uso
        reservacionesJSON = data;

        // Eliminar las filas que ya estan en la tabla
        $('#tablePreview tbody tr').slice(0).remove();

        // guardará el HTML de la información de cada fila
        var html = "";

        // recorre por cada elemento del array que devuelve el servicio REST
        $.each(data, function (i, item) {

            // console.log("each " + i);
            // console.log(item);

            // variables que guardarán las partes de la fecha
            var fechaR = 1;
            var horaI = 1;
            var horaF = 1;

            // contrucción de valores separados de las fechas (fecha
            fechaR = item.fechaHoraInicio.substring(0, 10);
            horaI = item.fechaHoraInicio.substring(11);
            horaF = item.fechaHoraFin.substring(11);

            // Construcción del HTML de una fila
            html = "<tr>" +
                "<th scope=\"row\">" + item.cliente.nombre + "</th>" +
                "<td>" + item.sala.nombre + "</td>" +
                "<td>" + fechaR + "</td>" +
                "<td>" + horaI + "</td>" +
                "<td>" + horaF + "</td>" +
                "<td><a onclick='atenderReservacion(" + i + ")' style='color: blue;'>Atender</a></td>" +
                "</tr>";

            // Adición del HTML creado a <TBODY> de la tabla
            $("#listadoBody").append(html);
        });

    }).fail(function (data) {
        console.log("falló el AJAX");
    });
}

