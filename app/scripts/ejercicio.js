   'use strict';
   var miTabla;
   $(document).ready(function() {
       miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'http://www.futbolistas.com/server_processing_doctor.php',
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

       /*Cargamos las clínicas en el SELECT*/
       function cargarClinicas() {
           $.ajax({
               type: 'POST',
               dataType: 'json',
               url: 'http://www.futbolistas.com/listar_clinicas.php',
               async: false,
               error: function(xhr, status, error) {

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
                   //si queremos hacer algo al terminar la petición ajax
               }
           });
       }

       /*EDITAR*/
       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#id_doctor').val(aData.id_doctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
           cargarClinicas();


       });

       $('#enviar').click(function(e) {
           e.preventDefault();
           var id_doctor = $('#id_doctor').val();
           var nombre = $('#nombre').val();
           var numcolegiado = $('#numcolegiado').val();
           var clinicas_e = $('#clinicas_e').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/modificar_doctor.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       id_doctor: id_doctor,
                       nombre: nombre,
                       numcolegiado: numcolegiado,
                       clinicas_e: clinicas_e
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

       /*AÑADIR*/
       $('#nuevo_doctor').click(function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario_crear').fadeIn(100);
           cargarClinicas();
       });


       $('#añadir').click(function(e) {
           e.preventDefault();
           var nombre_n = $('#nombre_n').val();
           var numcolegiado_n = $('#numcolegiado_n').val();
           var clinicas_n = $('#clinicas_n').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/nuevo_doctor.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       nombre_n: nombre_n,
                       numcolegiado_n: numcolegiado_n,
                       clinicas_n: clinicas_n

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
                   $('#formulario_crear').fadeOut(100);
               });

       });


       /*BORRAR*/
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
