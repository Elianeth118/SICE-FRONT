const ticketInit = () => {
    if (!alumno || !alumno.matricula) {
        console.error("La variable 'alumno' o 'alumno.MATRICULA' no está definida.");
        return;
    }
    console.log("matricula", alumno.matricula)
    $.ajax({
        url: `/api/v1/alumno/fichaInscripcion/${alumno.curp}/${alumno.matricula}/${urlParameters.level}`,
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


// Función que genera el PDF
const generatePDF = async (alumno) => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    // Inserta el logotipo en la parte superior izquierda
    const imgLogo = await imageUrlToBase64('assets/images/escudo.jpg'); // Asegúrate de que la ruta de la imagen es correcta
    pdf.addImage(imgLogo, 'JPEG', 15, 10, 35, 35); // Añade el logotipo en la esquina superior izquierda



    //*************************************************************************
    // Inicializa `positionY` en la posición inicial después del encabezado
    //let positionY = 60; // Posición inicial para los datos del alumno

    pdf.setLineWidth(0.5);
    pdf.rect(13, 15, 185, 235);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 16, 183, 40);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 57, 183, 12);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 68, 183, 7);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 76, 183, 27);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 104, 183, 7);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 112, 183, 20);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 133, 183, 70);

    pdf.setLineWidth(0.5);
    pdf.rect(14, 204, 183, 45);
    //***************************************************************************************************

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 40, 73);
    pdf.text(120, 21, 'FICHA DE DEPOSITO', { align: 'center' });

    pdf.setTextColor(0, 40, 73);
    pdf.text(120, 30, 'CUOTA APOYO A SERVICIOS EDUCATIVOS', { align: 'center' });

    pdf.setTextColor(0, 40, 73);
    pdf.text(120, 40, alumno.descripcion_ciclo_escolar, { align: 'center' });



    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10).setFont(undefined, 'center');
    let note="Una vez efectuado el pago debes anotar tu nombre y la carrera que elegiste en el comprobante de pago que te emite el banco.";
    pdf.text(15, 63, note,{ align: 'left' });


    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(15, 81, 'NOMBRE DEL ASPIRANTE:');
    pdf.text(95, 81, alumno.alumnoNombre + " " + alumno.alumnoAPaterno + " " + alumno.alumnoAMaterno);
    pdf.text(15, 88, 'ESCUELA:');
    pdf.text(95, 88, alumno.escuelaNombre.toString());
    pdf.text(15, 96, 'CARRERA:');

    const carreraTexto = alumno.nombreCarrera;
    const textLines = pdf.splitTextToSize(carreraTexto, 90);
    pdf.text(95, 96, textLines);


    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(15, 117, 'Concepto:');
    pdf.text(70, 117, 'Monto($)');
    pdf.text(105, 117, 'Banco');
    pdf.text(140, 117, 'Sucursal');
    pdf.text(170, 117, 'Cuenta');



    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(15, 122, alumno.descripcion_concepto_cobro);
    pdf.text(70, 122, parseFloat(alumno.monto).toFixed(2).toString(),{ align: 'right' });
    pdf.text(105, 122, alumno.banco);
    pdf.text(140, 122, alumno.sucursal.toString);
    pdf.text(170, 122, alumno.cuenta);


    pdf.setFontSize(11).setFont(undefined, 'bold');
    pdf.text(15, 130.5, 'TOTAL A PAGAR');
    pdf.text(160, 130.5, parseFloat(alumno.monto).toFixed(2).toString());



    pdf.setFontSize(11).setFont(undefined, 'normal');
    const nota = 'Documentos que deberan entregar los alumnos de nuevo ingreso CICLO ESCOLAR 2024 - 2025';
    const texttextLines = pdf.splitTextToSize(nota, 180);
    pdf.text(15, 138, texttextLines);


    // Lista de Documentos
    const documentos = [
        'Original y 2 copias del acta de nacimiento (Reciente).',
        'Tres copias de la CURP.',
        'Original y 2 copias del certificado de bachillerato (Legalizado si es de otro estado).',
        'Original y 2 copias de la carta de buena conducta.',
        'Original y 2 copias de la orden de pago de apoyo a servicios educativos.',
        'Original y 2 copias del comprobante de pago emitido por el banco.',
        'Original y 2 copias de la orden de pago de inscripción nuevo ingreso.',
        'Original y 2 copias del comprobante de pago emitido por el banco.',
        'Trs solicitudes de inscripcion con fotografia pegada.',
        'Siete fotografías tamaño infantil (blanco y negro).',
        'Dos folders tamaño oficio color paja; para Enfermeria Oaxaca color azul;',
        'Para Enfermeria Tehuantepeccolor rosa (sin nombre)'
    ];

    let positionY = 146;
    pdf.setFontSize(10).setFont(undefined, 'bold');
    documentos.forEach((doc, index) => {
        pdf.text(15, positionY, ` • ${doc}`);
        positionY += 4.5;
    });


    // Sección Dirección de Nóminas
    pdf.setTextColor(0, 0, 0);
    positionY = 205;
    pdf.setFontSize(11).setFont(undefined, 'normal');
    const nominasText = `
                La Dirección de Nóminas y Subdirección de Prestaciones Sociales, invita a los estudiantes de nuevo ingreso
                a tramitar el seguro facultativo individual, para contar con el servicio médico proporcionado por el
                Instituto Mexicano del Seguro Social.
                Para este trámite se entregarán los siguientes documentos: `;
    pdf.text(1, positionY, nominasText, { align: 'left' });


    // Lista de Documentos
    const doc = [
        'Hoja de confirmación de inscripción',
        'Vigencia de derechos actualizada',
    ];

    let positionZ = 230;
    pdf.setFontSize(10).setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0 );
    doc.forEach((doc, index) => {
        pdf.text(20, positionZ, ` • ${doc}`);
        //pdf.text(20, positionZ, ` • ${doc}`);
        positionZ += 4.5;
    });

    // Sección Dirección de Nóminas
    pdf.setTextColor(0, 0, 0);
    positionY = 243;
    pdf.setFontSize(9).setFont(undefined, 'normal');
    const nota2 = `
                Trámite y/o información sobre el seguro facultivo, acudir a su unidad Académica correspondiente con el enlace asignado.`;
    pdf.text(2, positionY, nota2, { align: 'left' });






    // // Vista previa del PDF en un iframe
    // const iframe = document.getElementById('pdfPreviewTicket');
    // iframe.src = pdf.output('datauristring');
    pdf.output('dataurlnewwindow');
    pdf.save(`FichaDeposito_${alumno.matricula}.pdf`)

};
(function () {
    ticketInit();
})();

