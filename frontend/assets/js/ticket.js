const  ticketInit = () => {
    $.ajax({
        url: `/api/v1/bancos`,
        method: "GET",
        success: function (response) {
            if (response.success){
                const banks = response.data;
                $.ajax({
                    url: `/api/v1/admision/${admissionData.curp}/${admissionData.id.folioAdmision}/${urlParameters.level}`,
                    method: "GET",
                    success: function (response) {
                        if (response.success){
                            generatePDFTicket(response.data[0], banks);
                        } else {
                            alert (response.message);
                            redirectToAdmission();
                        }
                        
                    }
                });
            }
        }
    });
}


const generatePDFTicket = (admission, banks) => {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();
    
    const lineWidth = 0.5;

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 40, 73);
    pdf.text(100, 15, 'Ficha de Admisión', { align: 'center' });
    pdf.text(100, 20, 'Orden de Pago (FUA)', { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8).setFont(undefined, 'normal');
    pdf.text(100, 32, 'Universidad Autónoma "Benito Júarez" de Oaxaca', { align: 'center' });
    pdf.text(100, 37, 'Secretaría de Finanzas', { align: 'center' });
    pdf.text(100, 45, 'Av. Universidad s/n. Ex-Hacienda de Cinco Señores', { align: 'center' });
    pdf.text(100, 50, 'Tel. 951-5163492', { align: 'center' });
    pdf.setFontSize(15).setFont(undefined, 'bold');
    pdf.text(190, 28, 'FOLIO ÚNICO', { align: 'right' });
    pdf.text(190, 35, 'DE ADMISIÓN:', { align: 'right' });
    pdf.setFontSize(18).setFont(undefined, 'bold');
    pdf.text(170, 42, admission.folioAdmision.toString(), { align: 'center' });

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 40, 73);
    pdf.text(100, 63, 'CICLO ESCOLAR 2023-2024', { align: 'center' });

    pdf.setFontSize(12).setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(15, 78, 'FECHA LÍMITE DE PAGO: ' + admission.fechaLimitePago);

    pdf.line(13,80,198,80);

    //-----------------------------------------------------------------------
    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(15, 85, 'NOMBRE DEL ASPIRANTE:');
    pdf.text(15, 90, 'CURP:');
    pdf.text(77, 90, 'NIVEL ACADÉMICO:');
    pdf.text(15, 95, 'CARRERA:');
    pdf.text(15, 100, 'ESCUELA:');

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(63, 85, admission.nombre + " " + admission.apellidoPaterno + " " + admission.apellidoMaterno);
    pdf.text(30, 90, admission.curp);
    pdf.text(115, 90, admission.nivelAcademico);
    pdf.text(35, 95, admission.carrera);
    pdf.text(35, 100,  admission.escuela);

    pdf.line(13,105,198,105);

//-------------------------------

    pdf.text(130, 110, 'Concepto');
    pdf.text(195, 110, 'Importe($)',{ align: 'right' });

    pdf.setFontSize(10).setFont(undefined, 'normal');
    pdf.text(130, 115, admission.conceptoCobro);
    pdf.text(195, 115, parseFloat(admission.monto).toFixed(2).toString(),{ align: 'right' });

    pdf.setFontSize(10).setFont(undefined, 'bold');
    pdf.text(130, 120, 'TOTAL A PAGAR: ');
    pdf.text(195, 120, parseFloat(admission.monto).toFixed(2).toString(),{ align: 'right' });

    pdf.line(13,125,198,125);
//-----------------------------------------------------------
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(12).setFont(undefined, 'bold');
    let note="Nota: Realiza el pago de tu ficha correctamente en cualquiera de las entidades \nbancarias, el convenio y la referencia bancaria deben ser del mismo banco.";
    pdf.text(15, 130, note,{ align: 'left' });

    pdf.line(13,140,198,140);
//-----------------------------------------------------------
    pdf.setTextColor(0, 0, 0);
    pdf.text(100, 145, 'Entidades Bancarias', { align: 'center' });

    pdf.line(13,150,198,150);

    let positionY = 150;
//-----------------------------------------------------------

    (async () => {
        let img = await imageUrlToBase64(`assets/images/escudo.jpg`);
        pdf.addImage(img, 'JPEG', 15, 27, 35, 40);
        //--- Create QR Code
        const qrCode = new QRCode(document.createElement('div'), {
            text: admission.codigoSeguridad,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        const qrCodeDataURL = qrCode._el.childNodes[0].toDataURL('image/png');
        pdf.addImage(qrCodeDataURL, 'png', 155, 45, 32, 32);

        let index = 0;
        //--- print banks entities
        for (const bank of banks) {
            const bankReferences =  admission.refBancaria.split("|");
            img = await imageUrlToBase64(`assets/images/${bank.img}`);
            pdf.addImage(img, 'JPEG', 15, positionY+1, 40, 10);
            pdf.setTextColor(0, 40, 73);
            positionY +=10;
            pdf.text(60, positionY, `Convenio: ${bank.convenio}`);
            positionY += 5;
            pdf.setTextColor(0, 0, 0);
            pdf.text(15, positionY, `Referencia Bancaria: ${bank.convenioRef}${bankReferences[index]}`);
            index ++;
            pdf.line(13,positionY + 2,198,positionY + 2);
            positionY +=2;
          }
        //-----------------------------------------------------------
        const instructions =`* Esta ficha es personal e intransferible, avala únicamente el pago realizado por el concepto indicado en la misma.
* No puede ser reutilizada, y su cobro por parte del banco avala únicamente el indicado en ella.
* Si se realiza más de un pago con esta ficha, solo se tomará en cuenta uno de ellos y no habrá reembolso para los
demás pagos.
* Conserva esta orden de pago, es útil para continuar con el registro y futuras aclaraciones.
* Efectuado el pago no se hará ninguna devolución. Es responsabilidad del interesado realizar correctamente el 
registro y concluirlo según las fechas establecidas.`;
        positionY += 4;
        pdf.setFontSize(10).setFont(undefined, 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(15, positionY, instructions, { align: 'left'});

        positionY += 40;
        pdf.setLineWidth(lineWidth);

        pdf.rect(13, 22, 185, positionY-30);
        const iframe = document.getElementById('pdfPreviewTicket');
        iframe.src =  pdf.output('datauristring');
        pdf.save(`ficha_${curp}.pdf`)
    })();
}

(function () {
    ticketInit();
})();