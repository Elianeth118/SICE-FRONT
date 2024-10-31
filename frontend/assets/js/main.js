
const checkProcess = () => {
    $.ajax({
        url: `/api/v1/detallecicloescolar/${urlParameters.level}/${urlParameters.operation}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (!response.success) {
                alert(response.message);
                redirectToAdmission(3000);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            const resp = JSON.parse(xhr.responseText);
            if (resp.status===500){
                alert("Ocurrió un error en el servidor. Reporte al teléfono 951 ...");
            }
        }
    })
}


const checkStudent = (curp) => {
    $.ajax({
        url: `/api/v1/alumno-escuela/incidents/${curp}/${urlParameters.level}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success && response.data.length > 0) {
                const incidents = response.data[0].incidents;
                let message="incidencias en procesos anteriores";
                if (incidents===Incident.FINAL_WITHDRAWAL)
                    message="baja definitiva"
                alert(`El aspirante tiene ${message}` );
            } else {
                checkAdmission(curp);
            }
        },
        error: function (xhr, status, error) {
        }
    });

}

const  checkAdmission = (curp) => {

    $.ajax({
        url: `/api/v1/admision/estatus-aceptado/${curp}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                alert(response.message)
                checkPreinscripcion(curp);
                //redirectToAdmission(3000);
               // showFieldAccessCode();

            }else {
                checkExistFUA(curp);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// //let preinscripcionDatos= null
const checkPreinscripcion = (curp) => {
    $.ajax({
        url: `/api/v1/admision/findCarrera/${curp}/${urlParameters.level}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success && response.data && response.data.length > 0) {
                const estatus = response.data[0].estatus;
                if (estatus === StatusAdmission.ACCEPTED) {
                    showFieldAccessCode(); // Mostrar código de acceso si el estatus es 3
                } else if (estatus === '52') {
                    showCredentialContainer();
                }
            } else  {
                //checkAdmission();
                alert(response.message);
                redirectToAdmission(300)
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


//
// // //SI ya es estatus 3 (aceptado) nos redirije a la uabjo porque el proceso de admision ha concluido
// const  checkAdmission = (curp) => {
//     $.ajax({
//         url: `/api/v1/admision/estatus-aceptado/${curp}`,
//         method: "GET",
//         dataType: "json",
//         success: function (response) {
//             if (response.success) {
//                 alert(response.message);  // Mostrar el mensaje de que ya está aceptado
//                 const operation = parseInt(urlParameters.operation);
//                 if (operation === Operation.ASPIRANT_PRE_REGISTRATION) {
//                     estatus = response.data[0];
//                     sessionStorage.setItem("estatus", estatus);
//                     console.log("AQUI TAMPOCO")
//                     checkPreinscripcion(curp);
//                     //preregisterAspirant();
//                 } else {
//                     console.log("No es operación de preinscripción, continuar flujo normal.");
//                 }
//             } else {
//                 checkExistFUA(curp);  // Si no está aceptado, continuar con el flujo normal
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error(error);
//         }
//     });
// }


const checkExistFUA = (curp) =>{
    $.ajax({
        url: `/api/v1/admision/current-fua/${curp}/${urlParameters.call}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                console.log("Retrieve FUA: " + response.data[0]);
                const currentFUA = response.data[0].fua
                sessionStorage.setItem("fua", currentFUA);
                showFieldAccessCode();
            } else {
                retrieveAspirantData(curp);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

const showFieldAccessCode = () => {
    $("#divAccessCode").show();
    $("#btnStart").hide();
    $("#btnValidateCode").show();
}

const retrieveAspirantData = (curp) => {
    $.ajax({
        url: `/api/v1/aspirantes/${curp}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                if (isLastUpdateOlderThan4Months(response.data[0])){
                    showEditAspirant();
                } else {
                    showFieldAccessCode();
                }
            } else {
                registerAspirant();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}



const isLastUpdateOlderThan4Months= (data) => {
    let registerDate = new Date(data.fecha_registro);
    let currentDate = new Date();
    let monthFour = 4 * 30 * 24 * 60 * 60 * 1000; //

    return (currentDate - registerDate >= monthFour)
}



const sendCodeToEmail = () => {
    $.ajax({
        url: `/api/v1/aspirantes/sendcode/${curp}`,
        method: "GET",
        success: function(response) {
            alert(response.message);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud:", textStatus, errorThrown);
        }
    });
}

const validateAccessCode = (curp, code) => {
    $.ajax({
        url: `/api/v1/aspirantes/validatecode/${curp}/${code}`,
        method: "GET",
        success: function(response) {
            if (response.success) {
                sessionStorage.setItem("code", code);
                // Redirigir al formulario de preinscripción
                analyzeOperation()

            } else {
                alert("Código de acceso no válido");
                $('#linkCode').show();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error en la solicitud:", textStatus, errorThrown);
        }
    });
}

const analyzeOperation = () => {
    const operation = parseInt(urlParameters.operation)
    admissionData.curp = curp;
    admissionData.id.folioAdmision = sessionStorage.getItem("fua");

    switch (operation) {
        case Operation.ASPIRANT_REGISTER: {
            console.log("FUA: " + sessionStorage.getItem("fua"));
            if (sessionStorage.getItem("fua")){
                showGeneralInformation();
            } else if (sessionStorage.getItem("code")) {
                //--- seleccionar carrera
                loadPage("aspirant/career.html", "content", function() {
                    loadScript("assets/js/career.js", "career");
                });
            }
            else {
                registerAspirant();
            }
            break
        }
        case Operation.ASPIRANT_LOAD_PHOTO: {
            loadPage("admission/features_photo.html", "content", function() {
                loadScript("assets/js/face-api.min.js", "face-api");
                loadScript("assets/js/pico.js", "pico");
                loadScript('assets/js/facedetection.js','facedection');
            });
            break
        }
        case Operation.ASPIRANT_REPRINT_FUA: {
            showTicketContainer();
            loadScript('assets/js/ticket.js',"ticket");
            break
        }
        case Operation.ASPIRANT_PRINT_CREDENTIAL_TICKET: {
            showCredentialContainer();
            loadScript('assets/js/credential.js','credential');
            break
        }
        case Operation.ASPIRANT_PRE_REGISTRATION:{
            // if (sessionStorage.getItem("code")){
            // }
            //preregisterAspirant();
            // loadPage("preregister/preregister_aspirant.html", "content", function() {
            //     loadScript("assets/js/preregister_aspirant.js", "career");

            // });
            // loadPage("preregister/pre-register.html", "content", function() {
            //     loadScript("assets/js/register_preinscripcion.js", "register_preinscripcion");
            // });

            preregisterAspirant();

            break
        }

        // case Operation.ASPIRANT_PRE_REGISTRATION:{
        //     // Aseguramos que el estatus es exactamente el de aceptado
        //     if (StatusAdmission.ACCEPTED) {
        //         alert("El aspirante  tiene estatus de aceptación.");
        //         preregisterAspirant();
        //     } else {
        //         alert("El aspirante no tiene estatus de aceptación (estatus 3).");
        //         //redirectToAdmission(300);
        //     }
        //
        //     // preregisterAspirant();
        //     break
        // }


    }

}

const initMain = () => {
    let $txtCurp = $("#txtCurp");
    if (!isValidateUrlParams()) {
        alert("La petición del recurso es incorrecto ");
        redirectToAdmission(3000);
    }

    checkProcess();

    document.getElementById("btnStart").addEventListener('click', function() {
        const form = $("#frmMain")[0];
        if (!(form.checkValidity())){
            form.classList.add('was-validated');
            return;
        }
        curp = $txtCurp.val().toUpperCase();
        if (!isValidCurp(curp)) {
            alert("CURP NO válida, revise e intente de nuevo");
            return;
        }
        $txtCurp.prop("disabled",true);
        checkStudent(curp);
    });


    document.getElementById("btnValidateCode").addEventListener('click', function() {
        curp = $txtCurp.val().toUpperCase();
        const  code = $("#txtAccessCode").val();
        validateAccessCode(curp, code);

    });

    document.getElementById("linkCode").addEventListener('click', function() {
        sendCodeToEmail();
    });

    document.getElementById("showPasswordIcon").addEventListener('click', function() {
        const txtAccessCode = document.getElementById("txtAccessCode");
        const type = txtAccessCode.getAttribute('type') === 'password' ? 'text' : 'password';
        txtAccessCode.setAttribute('type', type);
    });

    $txtCurp.focus();
    handlerForUpperCase();
}


const showGeneralInformation= () =>{
    loadPage("admission/show_general_information.html", "content", function() {
        loadScript("assets/js/show_general_information.js", "show_general_information");
    });
}

const registerAspirant = () =>{
    loadPage("aspirant/register_aspirant.html", "content", function() {
        loadScript("assets/js/register_aspirant.js", "register_aspirant");
    });
}

const  showEditAspirant  = () => {
    loadPage("aspirant/edit_aspirant.html", "content", function() {
        loadScript("assets/js/edit_aspirant.js", "editaspirant");
    });
}

const preregisterAspirant = () =>{
    loadPage("preregister/pre-register.html", "content", function() {
        loadScript("assets/js/register_preinscripcion.js", "register_preinscripcion");
    });
}
