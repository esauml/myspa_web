/*
 * Variables globales
 */

// id de la sucursal en la que se encuentra
var idSucursal = 1;

// documento JSON de reservaciones traído por REST
var reservacionesJSON;

/******************************************************
 * Inicialización de página
 *******************************************************/

$(document).ready(function () {

    incializarComponentes();

    // Enlsta las reservaciones en la tabla
    listarReservaciones();
});

function incializarComponentes()
{
    // incializa el Modal para que solo pueda cerrarse mediante su boton de cerrar
    $('#formularioReservacionModal').modal({
        backdrop: 'static',
        show: false
    });

    // Llenado del contenido dinámico del formulario #formReservacion
    llenarContenidoReservacionFormulario();
}

/*******************************************************
 * Event Handlers
 *******************************************************/

// Evento para toggle de modal RESERVACION
$("#btnAgregarReservacion").click(function () {
    $('#formularioReservacionModal').modal('toggle');
});

// Evento cuando se cierra el modal RESERAVCION, elimina los datos del formulario
$('#formularioReservacionModal').on('hidden.bs.modal', function (e) {
    // después de cerrarse elimina los datos del formulario

    // selecciona el <option> default
    $('#clienteReservacionListado option:eq(0)').prop('selected', true);
    $('#salaReservacionListado option:eq(0)').prop('selected', true);
    $('#horarioReservacionListado option:eq(0)').prop('selected', true);

    // Eliminar los <option> de horario
    $('#horarioReservacionListado option').slice(1).remove();

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
        if (data.error)
        {
            alert("Problema \n" + data.error);
            return;
        }
        console.log("correcto");
        
        $("#formularioReservacionModal").modal('hide');


    }).fail(function (data) {
        console.log("falló ajax\n");
        console.log(data);
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

/*******************************************************
 * Contenido dinámico de formularios
 *******************************************************/

// Llenado de <setion> clientes y salas en el formulario #formReservacion
function llenarContenidoReservacionFormulario()
{

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

    // Llenado del <section> de salas
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



        // Recorre por cada elemento Cliente del array que devuelve el servicio REST.
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
}


function atenderReservacion(posicionReservacionJSON) {
    console.log(reservacionesJSON[posicionReservacionJSON]);
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

