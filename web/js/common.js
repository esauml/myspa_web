/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function iniciarSesion(usuario, password)
{
    console.log(usuario);
    console.log(password);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:18835/my-spa/api/usuario/login',
        data: {
            usuario: usuario,
            password: password
        }
    }).done(function (data) {
        if (data.error != null)
        {
            alert("Problema para generar el token \n" + data.error);
            return;
        }

        // alert("Token generado");
        // alert(data.token);
        // console.log(data);
        localStorage.setItem("token", data.result);
        window.location.replace("tratamiento.html");
    }).fail(function (data) {
        alert("falló");
    });
}

function verificarSesion()
{
    var token = localStorage.getItem("token");

    var ruta;
    if (token !== null)
    {
        ruta = "tratamiento.html";
    } else {
        ruta = "login.html";
    }

    window.location.replace(ruta);
}

function listar()
{
    var token = localStorage.getItem("token");
    console.log("token: " + token);
    $.ajax({
        type: 'POST',
        url: 'api/tratamiento/listado',
        data: {
            token: token
        }
    }).done(function (data) {
        if (data.error != null)
        {
            alert("Problema de autenticación \n" + data.error);
            return;
        }

        console.log(data);

        // Eliminar las filas que ya estan en la tabla
        $('#tablePreview tbody tr').slice(1).remove();

        $.each(data, function (i, item) {

            var html;

            if (item.estatus !== 0) {
                html = "<tr>" +
                        "<th scope=\"row\">" + item.idTratamiento + "</th>" +
                        "<td>" + item.nombre + "</td>" +
                        "<td>" + item.descripcion + "</td>" +
                        "<td>" + item.costo + "</td>" +
                        "<td> " +
                        "<button type=\"button\" onclick=\"editar('" + item.idTratamiento + "')\" class=\"btn btn-info btn-sm\">Editar</button>" +
                        "<button type=\"button\" onclick=\"eliminar('" + item.idTratamiento + "')\" class=\"btn btn-danger btn-sm\">Eliminar</button>" +
                        "</td>" +
                        "</tr>";

                //$("#prueba").append(html);

                var tableRef = document.getElementById('tablePreview').getElementsByTagName('tbody')[0];
                var newRow = tableRef.insertRow(tableRef.rows.length);
                newRow.innerHTML = html;
            }
        });
    }).fail(function (data) {
        alert("falló");
    });
}

function listarReservaciones()
{
//    var token = localStorage.getItem("token");
//    console.log("token: " + token);
    $.ajax({
        type: 'GET',
        url: 'api/reservacion/getAll'
    }).done(function (data) {
        if (data.error != null)
        {
            alert("Problema de autenticación \n" + data.error);
            return;
        }

        console.log(data);

        // Eliminar las filas que ya estan en la tabla
        $('#tablePreview tbody tr').slice(1).remove();

        $.each(data, function (i, item) {

            var html;

            if (item.estatus !== 0) {
                
                var fechaR;
                var horaI;
                var horaF;

                if (item.fechaHoraInicio) {
                    var fechaJSON = JSON.parse(item);
                    var fecha = new Date(fechaJSON);

                    var mes = fecha.getMonth();
                    var dia = fecha.getDay();
                    var anio = fecha.getYear();

                    fechaR = dia + "/" + mes + "/" + anio;
                    horaI = fecha.getTime();
                }

                if (item.fechaHoraFin) {
                    var fechaJSON = JSON.parse(item);
                    var fecha = new Date(fechaJSON);
                    
                    horaF = fecha.getTime();
                }


                html = "<tr>" +
                        "<th scope=\"row\">" + fechaR + "</th>" +
                        "<td>" + horaI + "</td>" +
                        "<td>" + horaF + "</td>" +
                        "<td>" + item.cliente + "</td>" +
                        "<td>" + item.sala + "</td>" +
                        "</tr>";

                //$("#prueba").append(html);

                var tableRef = document.getElementById('tablePreview').getElementsByTagName('tbody')[0];
                var newRow = tableRef.insertRow(tableRef.rows.length);
                newRow.innerHTML = html;
            }
        });
    }).fail(function (data) {
        alert("falló");
    });
}

function editar(idTratamiento)
{
    console.log("Editar: id " + idTratamiento);
    localStorage.setItem("idTratamiento", idTratamiento);
    window.location.replace("tratamientoForm.html");
}

function eliminar(idTratamiento)
{
    var token = localStorage.getItem("token");
    var confirmacion = window.confirm("¿ Está seguro ?")


    if (confirmacion)
    {
        $.ajax({
            type: 'POST',
            url: 'api/tratamiento/eliminar',
            data: {
                token: token,
                idTratamiento: idTratamiento
            }
        }).done(function (data) {
            if (data.error != null)
            {
                alert("Problema de autenticación \n" + data.error);
                return;
            }

            console.log(data);

            listar();

        }).fail(function (data) {
            alert("falló");
        });
    }
}

function cerrarSesion()
{
    var token = localStorage.getItem("token");

    $.ajax({
        type: 'POST',
        url: 'api/usuario/cerrarSesion',
        data: {
            token: token
        }
    }).done(function (data) {
        if (data.error != null)
        {
            alert("Problema de autenticación \n" + data.error);
            return;
        }

        console.log(data);

        localStorage.clear();
        window.location.replace("login.html");

    }).fail(function (data) {
        alert("falló");
    });
}