   'use strict';
   //para que sea una variable global
   var miTabla;
   $(document).ready(function() {
       //lo metemos en una variable de tipo objeto para poder utilizar cualquier propiedad de el en los métodos más tarde
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
                   return '<a class="btn btn-success añadirbtn">Añadir</a><a class="btn btn-primary editarbtn">Editar</a><a class="btn btn-warning borrarbtn">Borrar</a>';
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


       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);
           $('#formulario').fadeIn(100);

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#id_doctor').val(aData.id_doctor);
           $('#nombre').val(aData.nombre);
           $('#numcolegiado').val(aData.numcolegiado);
           $('#id_clinicas').val(aData.id_clinicas);
           $('#nombreclinicas').val(aData.nombreclinicas);

       });

       $('#enviar').click(function(e) {
           e.preventDefault();
           var id_doctor = $('#id_doctor').val();
           var nombre = $('#nombre').val();
           var numcolegiado = $('#numcolegiado').val();
           var id_clinicas = $('#id_clinicas').val();
           var nombreclinicas = $('#nombreclinicas').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/modificar_doctor.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       id_doctor: id_doctor,
                       nombre: nombre,
                       numcolegiado: numcolegiado,
                       id_clinicas: id_clinicas,
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
                   $('#formulario').fadeOut(100);
               });

       });


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
