
function credentialInit(){
    
    fetch(`/photos/${curp}.jpg?` + new Date().getTime(), { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                $.ajax({
                    url: `/api/v1/admision/boleta/${admissionData.curp}/${admissionData.id.folioAdmision}/${urlParameters.level}`,
                    method: "GET",
                    success: function (response) {
                        if (response.success){
                            admissionData.id.cicloEscolar = response.data[0].cicloescolar;
                            updateCredentialStatus(StatusCredential.PRINTING)
                                .then(r => generatePDFCredential(response.data[0]));
                            
                        } else {
                            alert (response.message);
                            redirectToAdmission();
                        }
                    }
                });
            } else {
                alert("Para generar la boleta credencial es necesario subir la fotografía y haber pagado la ficha");
                redirectToAdmission();
            }
        })
        .catch(error => {
            alert("Ocurrió un error al validar la fotografía del aspirante");
        });
}


function generatePDFCredential(admission) {
    const { jsPDF } = window.jspdf;
    let pdfCT = new jsPDF();
    const lineWidth = 0.5;

    pdfCT.setTextColor(0, 0, 0);
    pdfCT.setFontSize(15).setFont(undefined, 'bold');
    const level = admission.nivel===104?" Superior": " Media Superior ";
    pdfCT.text(120, 38, 'Boleta Credencial (EXAMEN DE ADMISION ', { align: 'center' });
    pdfCT.text(120, 45, level.toUpperCase()  +  ")", { align: 'center' });
    pdfCT.setFontSize(12).setFont(undefined, 'bold');
    pdfCT.text(120, 50, 'Universidad Autónoma "Benito Júarez" de Oaxaca', { align: 'center' });
    pdfCT.text(120, 55, admission.descripcioncicloescolar.toUpperCase(), { align: 'center' });
    pdfCT.text(120, 60, 'Nivel ' + level, { align: 'center' });
    // -------------------------------------------------
    pdfCT.line(13,70,198,70);
    // -------------------------------------------------
    pdfCT.setFontSize(10).setFont(undefined, 'normal');
    pdfCT.text(15, 75, 'ASPIRANTE:');
    pdfCT.text(15, 85, 'CURP:');
    pdfCT.text(15, 95, 'CARRERA:');
    pdfCT.text(15, 105, 'ESCUELA:');
    
    pdfCT.setFontSize(18).setFont(undefined, 'bold');
    pdfCT.text(15, 115, "FUA: ");
    pdfCT.text(50, 115, admission.folioadmision.toString());
    //---------------------------------------------------
    pdfCT.setFontSize(10).setFont(undefined, 'bold');
    const aspirant= (admission.nombre + " " + admission.a_paterno + " " +
        admission.a_materno).toUpperCase();
    pdfCT.text(50, 75, aspirant);
    pdfCT.text(50, 85, admission.curp.toUpperCase());
    pdfCT.text(50, 95, admission.carrera.toUpperCase(),  { maxWidth: 100 });
    pdfCT.text(50, 105, admission.escuela.toUpperCase(),  { maxWidth: 100 });
    
    //---------------------------------------------------
    pdfCT.line(13,120,198,120);
    //---------------------------------------------------

    
    //----------------------------------------------------
    pdfCT.setFontSize(12).setFont(undefined, 'normal');
    pdfCT.text(15, 125, "Sede del examen: ");
    pdfCT.setFontSize(12).setFont(undefined, 'bold');
    const sede = admission.nombresede +  " "  + admission.direccionsede;
    pdfCT.text(55, 125, sede, { maxWidth: 140 });

    //---------------------------------------------------
    pdfCT.line(13,135,198,135);
    //---------------------------------------------------
    
    pdfCT.setFontSize(12).setFont(undefined, 'normal');
    pdfCT.text(15, 140, "FECHA DEL EXAMEN: "); pdfCT.text(120, 140, "SALON: ");
    pdfCT.text(15, 145, "HORA DEL EXAMEN: ");  pdfCT.text(120, 145, "ASIENTO: ");
    pdfCT.setFontSize(12).setFont(undefined, 'bold');
    pdfCT.text(65, 140, admission.fechaexamen); pdfCT.text(150, 140, admission.salonasignado);
    pdfCT.text(65, 145, admission.horaexamen);  pdfCT.text(150, 145, " "); //--- Asiento Pendiente
    
    //---------------------------------------------------
    pdfCT.line(13,150,198,150);
    pdfCT.line(115,135,115,150); //--- vertical
    //---------------------------------------------------
    
    pdfCT.text(120, 155, "LEA Y SIGA TODAS LAS INSTRUCCIONES", { align: 'center' });
    
    //---------------------------------------------------
    pdfCT.line(13,160,198,160);
    //---------------------------------------------------
    
    const surveyLink ="https://forms.office.com/r/3nvQecGy7Q?origin=lprLink";
    
    const instructions = [
        "1. El acceso a la sede del examen será a partir de las 09:00 horas, llegar 1 hora antes de la hora programada",
        "2. Sólo podrás realizar el examen presentando los siguientes requisitos:",
        "   * Boleta Credencial expedida por la UABJO impresa.",
        "   * Identificación oficial con fotografía. (Credencial de tu escuela secundaria, INE en caso de ser ",
        "mayor de edad o constancia de identidad expedida por la autoridad municipal de tu localidad).",
        "3. Se prohíbe introducir todo tipo de aparatos electrónicos (celulares, reproductores de multimedia ",
        "y audífonos) así como el uso de accesorios: mochilas, bolsas, chamarras y gafas de sol.",
        "4. Localice su sede de examen con 24 horas de anticipación.",
        "5. Para presentar tu examen deberás traer los siguientes materiales:",
        "   * Lápiz número 2, borrador, sacapuntas y calculadora científica ",
        "6. No podrás ingresar con gorra.",
        "7. No podrás ingresar con alimentos ni bebidas.",
        "8. Te invitamos a seguir las medidas sanitarias para prevenir el contagio del virus Covid 19.",
        "9. Nota: En caso de tener duda en cómo llegar a la sede de tu examen, contáctanos vía WhatsApp al ",
        "siguiente número 9515310843.",
        "10. Posteriormente de haber realizado tu examen deberás de ingresar a la siguiente liga o leer el codigoQR, ",
        "realiza la encuesta de satisfación para  concluir con tu proceso. ",
        `${surveyLink}`
    ];
    
    
    let positionY = 165;
    pdfCT.setFontSize(10).setFont(undefined, 'normal');

    instructions.forEach(item => {
        pdfCT.text(15, positionY, item);
        positionY+=5;
    })
    pdfCT.text(100, positionY, "HE LEIDO Y ACEPTO LAS CONDICIONES", { align: 'center' });
    positionY +=5;
    pdfCT.text(100, positionY, "DEL PROCESO DE ADMISIÓN NIVEL " + level.toUpperCase() + " " + admission.cicloescolar, { align: 'center' });
    positionY +=10;
    pdfCT.setFontSize(10).setFont(undefined, 'bold');
    pdfCT.text(100, positionY, aspirant, { align: 'center' });
    pdfCT.setFontSize(10).setFont(undefined, 'normal');
    pdfCT.line(70,positionY+1,130,positionY+1);
    positionY +=5;
    pdfCT.text(100, positionY, "NOMBRE Y FIRMA DEL ASPIRANTE", { align: 'center' });
    
    pdfCT.setLineWidth(lineWidth);
    pdfCT.rect(13, 22, 185, positionY-10);
    
    (async () => {
        let img = await imageUrlToBase64(`/assets/images/escudo.jpg`);
        pdfCT.addImage(img, 'JPEG', 15, 27, 35, 40);
        
        let photo = await imageUrlToBase64(`/photos/${admission.curp}.jpg`);
        pdfCT.addImage(photo, 'JPEG', 160, 75, 35, 40);
        
        //--- Create QR Code
        const qrCode = new QRCode(document.createElement('div'), {
            text: surveyLink,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        const qrCodeDataURL = qrCode._el.childNodes[0].toDataURL('image/png');
        pdfCT.addImage(qrCodeDataURL, 'png', 173, positionY-12, 24, 24);
        
        const iframe = document.getElementById('pdfPreviewCredential');
        
        iframe.src =  pdfCT.output('datauristring');
        pdfCT.save(`boleta_${curp}.pdf`)
    })();
        
    
}

const updateCredentialStatus= async (estatus) =>  {
    const url= `/api/v1/admision/boletaestatus/${admissionData.curp}/${admissionData.id.folioAdmision}/${admissionData.id.cicloEscolar}?status=${estatus}`;
    await fetch(url, {
        method: 'PUT'
    });
}

(function () {
    credentialInit();
})();