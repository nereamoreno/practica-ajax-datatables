   'use strict';
   //para que sea una variable global
   var miTabla;
   $(document).ready(function() {
       //lo metemos en una variable de tipo objeto para poder utilizar cualquier propiedad de el en los métodos más tarde
       miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'http://www.futbolistas.com/server_processing.php',
           'columns': [{
               'data': 'id_doctor'
           }, {
               'data': 'nombre'
           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'id_clinicas'
           }, {
               'data': 'nombreclinicas'
           }, {
               'data': 'id_doctor',
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn">Editar</a><a class="btn btn-warning borrarbtn">Borrar</a>';
               }
           }],
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           }
       });

       /*Cargamos los clinicas para que aparezcan en el select:*/
       function cargarClinicas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'php/listar_clinicas.php',
               async: false,
               error: function(xhr, status, error) {
                   //mostraríamos alguna ventana de alerta con el error
               },
               success: function(data) {
                   $('#clinicas_n,#clinicas_e').empty();
                   $.each(data, function() {
                       $('#clinicas_n,#clinicas_e').append(
                           $('<option ></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });
               },
               complete: {
               }
           });
       }

       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#id_doctor').val(aData.id_doctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
           $('#clinicas_e').val(aData.nombreClinica);
           cargarClinicas();
           var str = aData.idClinica;
           str = str.split(",");
           $('#clinicas_e').val(str);


       });

       $('#enviar').click(function(e) {
           e.preventDefault();
           var id_doctor_e = $('#id_doctor').val();
           var nombre_e = $('#nombre_e').val();
           var numcolegiado_e = $('#numcolegiado_e').val();
           var clinicas_e = $('#clinicas_e').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/modificar_doctor.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       id_doctor_e: id_doctor_e,
                       nombre_e: nombre_e,
                       numcolegiado_e: numcolegiado_e,
                       //id_clinicas: id_clinicas,
                       //nombreclinicas: nombreclinicas

                   },
               })
               .done(function() {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               })
               .fail(function() {
                   console.log('error');
               })
               .always(function() {
                   $('#tabla').fadeIn(100);
                   $('#formulario').fadeOut(100);
               });

       });




       /*Accion de CREAR NUEVO Doctor*/
       $('#nuevo_doctor').click(function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario_crear').fadeIn(100);
           cargarClinicas();
       });

       /*$('#form_crear').validate({
           rules: {
               nombre_n: {
                   required: true,
                   spanishlettersspace: true
               },
               numcolegiado_n: {
                   digits: true
               },
               clinicas_n: {
                   required: true,
                   minlength: 1
               }
           },
           submitHandler: function() {
               nombre_n = $('#nombre_n').val();
               numcolegiado_n = $('#numcolegiado_n').val();
               clinicas_n = $('#clinicas_n').val();


               $.ajax({
                   type: 'POST',
                   dataType: 'json',
                   url: 'php/añadir_doctor.php',

                   data: {
                       nombre_n: nombre_n,
                       numcolegiado_n: numcolegiado_n,
                       clinicas_n: clinicas_n

                   },
                   error: function(xhr, status, error) {
                       $.growl.error({
                           title: "ERROR",
                           message: "No se ha podido añadir el Doctor"
                       });
                   },
                   success: function(data) {
                       var $mitabla = $("#miTabla").dataTable({
                           bRetrieve: true
                       });
                       $mitabla.fnDraw();
                       if (data[0].estado == 0) {
                           $.growl.notice({
                               title: "OK",
                               message: "Doctor añadido correctamente"
                           });
                       }
                   },
                   complete: {}
               });
               $('#formulario_crear').fadeOut(100);
               $('#tabla').fadeIn(100);
           }

       });*/



       /*$('#añadir').click(function(e) {
           e.preventDefault();
           var nombre = $('#nombre').val();
           var numcolegiado = $('#numcolegiado').val();
           //var id_clinicas = $('#id_clinicas').val();
           //var nombreclinicas = $('#nombreclinicas').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/añadir_doctor.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       nombre: nombre,
                       numcolegiado: numcolegiado,
                       //id_clinicas: id_clinicas,
                       nombreclinicas: nombreclinicas

                   },
               })
               .done(function() {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               })
               .fail(function() {
                   console.log('error');
               })
               .always(function() {
                   $('#tabla').fadeIn(100);
                   $('#formulario2').fadeOut(100);
               });

       });*/



       $('#miTabla').on('click', '.borrarbtn', function(e) {
           e.preventDefault();
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var id_doctor = aData.id_doctor;
           $.ajax({
                   url: 'http://www.futbolistas.com/borrar_doctor.php',
                   type: 'GET',
                   dataType: 'json',
                   //estos son los datos que queremos actualizar, en json:
                   data: {
                       'id_doctor': id_doctor
                   },
               })
               .done(function() {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                   console.log('Se ha borrado el doctor');
               })
               .fail(function() {
                   console.log('error al borrar el doctor');
               });
       });




   });
