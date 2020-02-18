/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function usarToken()
{
    var usuario = $('#txtUsuario').val();
    var password = $('#txtPassword').val();
    console.log(usuario);
    console.log(password);

    $.ajax({
        type: 'POST',
        url: 'api/usuario/login',
        data: {
            usuario: 'usuario',
            password: 'password'
        }
    }).done(function (data) {
        if (data.error != null)
        {
            alert("Problema para generar el token \n" + data.error);
            return;
        }

        alert("Token generado");
        alert(data.result)
        // $("#token").html(data.result);
    });
}
