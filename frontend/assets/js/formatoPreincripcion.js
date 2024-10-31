const ticketInit = () => {
    if (!alumno || !alumno.matricula) {
        console.error("La variable 'alumno' o 'alumno.MATRICULA' no está definida.");
        return;
    }
    console.log("matricula", alumno.matricula)
    $.ajax({
        url: `/api/v1/alumno/findAlumno/${alumno.matricula}`,
        method: "GET",
        success: function (response) {
      if(response.success){
          const alumno= response.data[0];
          generatePDF(alumno)
      }else{
          alert("Ocurrio un error al recuperar los datos");
      }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
};

// Función para convertir el valor numérico del estado civil a texto
const obtenerEstadoCivilTexto = (edoCivil) => {
    switch (edoCivil) {
        case 1:
            return "SOLTERO/A";
        case 2:
            return "CASADO/A";
        case 3:
            return "UNION LIBRE";
        case 4:
            return "DIVORCIADO/A O VIUDO/A";
        default:
            return "No especificado";
    }
};
// Función para convertir el valor numérico del sexo a texto
const obtenerSexoTexto = (Sexo) => {
    switch (Sexo) {
        case 1:
            return "FEMENINO";
        case 2:
            return "MASCULINO";
    }
};

const generatePDF = async ( alumno) => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    // Inserta el logotipo en la parte superior izquierda
    const imgLogo = await imageUrlToBase64('assets/images/escudo.jpg');
    pdf.addImage(imgLogo, 'JPEG', 9, 15, 35, 40); // Añade el logotipo en la esquina superior izquierda
    // Rectángulo exterior con doble línea
    pdf.setLineWidth(0.5);
    pdf.rect(9, 10, 190, 46); // Rectángulo exterior
    pdf.setLineWidth(0.5); // Segunda línea
    pdf.rect(8, 9, 191, 48); // Segunda línea exterior para doble borde

    // División del rectángulo en tres partes
    pdf.setLineWidth(0.5);
    pdf.line(45, 10, 45, 56); // Línea vertical divisoria entre logotipo y texto
    pdf.line(162, 10, 162, 56); // Línea vertical divisoria entre texto y foto


    // Añade el cuadro para la foto del alumno
    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text('FOTO', 181.5, 15, { align: 'center' });
    // Dibuja el rectángulo exterior (para la doble línea)
    pdf.setLineWidth(0.5); // Primera línea (más gruesa)
    pdf.rect(163, 11, 35, 44);

    //**********************************************************
    // Texto de Solicitud de Inscripción y Ciclo Escolar centrado
    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(105, 20, 'SOLICITUD DE INSCRIPCIÓN', { align: 'center' });

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(105, 30, 'PRIMER INGRESO', { align: 'center' });

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(105, 40, 'CICLO ESCOLAR 2024-2025', { align: 'center' });

    // Añade el cuadro para la foto del alumno
    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text('FOTO', 181.5, 15, { align: 'center' });
    //pdf.text(181.5, 15, 'FOTO', { align: 'center' });
    pdf.setLineWidth(0.5);
    pdf.rect(163, 9, 35, 45.5);

    //*****************************************************

    pdf.setLineWidth(0.5);
    pdf.rect(8, 59, 191, 210);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 60.5, 188, 25);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 87, 188, 50); // Datos del responsable

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 138.5, 188, 12);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 152, 188, 50);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 203.5, 188, 8);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 213, 188, 20);

    pdf.setLineWidth(0.5);
    pdf.rect(9.5, 234.5, 188, 33);


    //****************************************

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 65, 'CARRERA A LA QUE SOLICITA ADMISION:');
    const carreraTexto = 'LICENCIATURA EN ARTES PLÁSTICAS Y VISUALES CAMPUS JUCHITAN';
    const textLines = pdf.splitTextToSize(carreraTexto, 110);
    pdf.text(90, 65, textLines);


    pdf.text(11, 74, 'ESCUELA Y/O FACULTAD:');
    const LICENCIATURA = alumno.nombreCarrera;
    const textLines1 = pdf.splitTextToSize(LICENCIATURA, 110);
    pdf.text(90, 74, textLines);

    pdf.text(11, 83, 'CURP:');
    pdf.text(90, 83, alumno.curp);


    //*******************************************************


    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 91, 'Apellido paterno');
    pdf.text(65, 91, 'Apellido materno');
    pdf.text(135, 91, 'Nombre(s)');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 96, alumno.alumnoAPaterno);
    pdf.text(65, 96, alumno.alumnoAMaterno);
    pdf.text(135, 96, alumno.alumnoNombre);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 101, 'Estado');
    pdf.text(65, 101, 'Municipio');
    pdf.text(135, 101, 'Colonia');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 106, alumno.alumnoNombreEstado);
    pdf.text(65, 106, alumno.alumnoNombreMunicipio);
    pdf.text(135, 106, alumno.alumnoColonia);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 111, 'Calle');
    pdf.text(65, 111, 'Número exterior');
    pdf.text(135, 111, 'Número interior');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 116, alumno.alumnoCalle);
    pdf.text(65, 116, alumno.alumnoNumExterior.toString());
    pdf.text(135, 116, alumno.alumnoNumInterior);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 121, 'Tel. celular');
    pdf.text(65, 121, 'Estado civil');
    pdf.text(135, 121, 'Sexo:');


    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 126, alumno.alumnoCelular);

    // Aquí convertimos el estado civil numérico a texto
    //const estadoCivilTexto = obtenerEstadoCivilTexto(alumno.edo_civil);
    pdf.text(65, 126, alumno.edo_civil); // Muestra el estado civil en texto en lugar de número

    // Conversion del sexo numérico a texto
    //const sexoTexto = obtenerSexoTexto(alumno.sexo);
    pdf.text(135, 126, alumno.sexo); // Muestra el sexo en texto en lugar de número
    //pdf.text(135, 120, alumno.sexo);

    pdf.text(11, 136, alumno.alumnoNacionalidad);
    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 131, 'Nacionalidad');


    //**********************************
    pdf.text(11, 143, 'Escuela de procedencia:');
    pdf.text(11, 148, 'Estado:');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(55, 143, alumno.escuela_procedencia_nombre, { align: 'left' });
    pdf.text(95, 148, alumno.escuela_nombreEstado);


    //***************************************
    // Sección de datos del responsable
    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 157, 'DATOS DEL RESPONSABLE');


    pdf.text(11, 162, 'Apellido paterno');
    pdf.text(65, 162, 'Apellido materno');
    pdf.text(135, 162, 'Nombre(s)');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 167, alumno.familiaPaterno);
    pdf.text(65, 167, alumno.familiaMaterno);
    pdf.text(135, 167, alumno.familiaNombre);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 172, 'Estado');
    pdf.text(65, 172, 'Municipio');
    pdf.text(135, 172, 'Colonia');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 177, alumno.familiaNombreEstado);
    pdf.text(65, 177, alumno.familiaNombreMunicipio);
    pdf.text(135, 177, alumno.familiaColonia);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 182, 'Calle');
    pdf.text(65, 182, 'Número exterior');
    pdf.text(135, 182, 'Número interior');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 187, alumno.familiaCalle);
    pdf.text(65, 187, alumno.familiaNumExterior.toString());
    pdf.text(135, 187,alumno.familiaNumInterior);

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(11, 192, 'Nacionalidad:');
    pdf.text(65, 192, 'Parentesco:');

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(11, 197, alumno.familiaNacionalidad);
    pdf.text(65, 197,alumno.parentescoDescripcion);

    //**********************************************

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(100, 209, 'OAXACA DE JUAREZ, OAXACA; A 09 DE SEPTIEMBRE DE 2024', { align: 'center' });

    //*****************************************************************

    // Dibujar líneas divisorias para las firmas
    pdf.setLineWidth(0.5);
    pdf.line(25, 225, 90, 225); // Línea para firma del responsable
    pdf.line(120, 225, 180, 225); // Línea para firma del alumno

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(40, 230, 'Firma del responsable');
    pdf.text(135, 230, 'Firma del alumno');


    pdf.text(100, 239, 'AUTORIZACION', { align: 'center' });

    pdf.text(20, 265, 'Firma del Director de servicios Escolares');
    pdf.text(150, 265, 'SELLO');

   const positionY=225;

    // Cargar imagen de la firma del director y del sello
    const imgFirma = await imageUrlToBase64('assets/images/logo_drti.png'); // Firma del director
    pdf.addImage(imgFirma, 'JPEG', 15, positionY + 5, 40, 20); // Añadir firma del director


    const imgSello = await imageUrlToBase64('assets/images/escudo.jpg'); // Imagen del sello
    pdf.addImage(imgSello, 'JPEG', 130, positionY + 5, 40, 40); // Añadir el sello


    // Vista previa del PDF en un iframe

    const iframe = document.getElementById('pdfPreviewTicket');
    iframe.src = pdf.output('datauristring');

    // Guardar el PDF
    pdf.output('dataurlnewwindow');
    pdf.save(`Solicitud_${alumno.matricula}.pdf`)
    // pdf.save(`ficha_inscripcion_${alumno.matricula}.pdf`);
};


//Función que inicia la llamada y genera el PDF
(function () {
    ticketInit();
})();
//
// document.getElementById('btnSavePreincripcion').addEventListener('click', function() {
//     ticketInit();
// });
// document.getElementById('btnSavePreincripcion').addEventListener('click', function() {
//     ticketInit(); // Llama a la función que obtiene los datos y genera el PDF
// });