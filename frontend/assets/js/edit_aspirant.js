
const editAspirantInit = () => {
    
    if (typeof curp === "undefined") {
        alert("Es necesario la curp para procesar los datos")
        redirectToAdmission();
    }
    const request = loadAspirantFromAPI(curp);

    request.then(result => {
            if (!result.success) {
                alert("Aspirante no encontrado");
                redirectToAdmission();
            } else {
                aspirant = result.data[0];
                populateSelect("/api/v1/municipio/" + getKeyState(aspirant.curp.substring(11,13)),
                    $("#municipioNacimiento"), propertiesForMunicipality(), function (){
                        populateSelect("/api/v1/estado", $("#estadoescuela"), propertiesForState(),function () {
                            showAspirant(aspirant);
                        });
                    });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    //---
    handlerForUpperCase();
    handlerForLowerCase();
    handlerForOnlyNumber();
    $("#codigoPostal").change(function (){
        const postalCode = $('#codigoPostal').val().trim();
        if (postalCode.length<5) return;
        const url = '/api/v1/localidad/' + encodeURIComponent(postalCode);
        populateSelect(url, $("#localidad"), propertiesForLocality());
    });

    const schoolState = $("#estadoescuela");
    schoolState.change(function () {
        const cve_estado_escuela = $(this).val();
        if (cve_estado_escuela.trim().length===0) return;
        const url = `/api/v1/escuela-procedencia/estado/${cve_estado_escuela}/` +
            levelOfOrigin(urlParameters.level.toString());

        populateSelect(url, $("#claveescuela"), propertiesForSchoolOfOrigin());
        $("#escuela").val("");
        $("#municipio").val("");
    });

    $("#claveescuela").change( function (){
        const optionSelected = $('#claveescuela option:selected');
        $("#escuela").val(optionSelected.attr("escuela"));
        $("#municipio").val(optionSelected.attr("municipio"));
    });


    $("#btnConfirm").click( function () {
        const formEditAspirant = $("#formEditAspirant")[0];
        if (!isAllSelectsHaveValues()){
            return;
        }

        if (formEditAspirant.checkValidity()){
            const emailConfirm = $('#correoValidacion').val();
            const email = $('#correoElectronico').val();

            if (email!==emailConfirm){
                showMessageEmailNotMatch();
                return;
            }
            $.ajax({
                url: '/api/v1/aspirantes/email-already-exists/' + curp + "/" + encodeURIComponent(emailConfirm),
                type: 'GET',
                success: function (response) {
                    if (response.success){
                        showMessageEmailExist();
                        formEditAspirant.classList.add('was-validated');
                    }  else {
                        assignDataToAspirant();
                        updateAspirant(aspirant);
                    }
                },
                error: function () {
                    console.error('Error al enviar la solicitud a la API');
                }
            });

        }else {
            formEditAspirant.classList.add('was-validated');
            alert("Faltan datos, por favor revise");
        }
    });


    $("#correoValidacion").on( "keyup", () => {
        const email = $("#correoElectronico").val();
        const emailConfirm = $("#correoValidacion").val();
        $('#correoValidacion, #correoElectronico').removeClass('is-invalid');
        const isEmpty = () =>{return $("#correoValidacion").val().trim()===""; }
        if (isEmpty()){
            $("#email-confirm-feedback").text("El correo es requerido");
            return;
        }
        $("#email-confirm-feedback").text(email!==emailConfirm?"No coinciden los correos":$("#email-confirm-feedback").text());


    });

    $("#correoElectronico").on( "keyup", () => {
        const isEmpty = () =>{return $("#correoElectronico").val().trim()===""; }
        $("#email-feedback").text(isEmpty()?"El correo es requerido":$("#email-feedback").text());
        $('#correoValidacion, #correoElectronico').removeClass('is-invalid');
    });
}



const showAspirant = (aspirant) => {
    //--- general data
    $("#curp").val(aspirant.curp);
    $("#nombre").val(aspirant.nombre);
    $("#apellidoPaterno").val(aspirant.a_paterno);
    $("#apellidoMaterno").val(aspirant.a_materno);
    $("#fechaNacimiento").val(dateConvertDDMMYYY(aspirant.f_nacimiento));
    $("#genero").val(aspirant.sexo==="M"?"Masculino":"Femenino" );
    $("#nacionalidad").val(aspirant.nacionalidad==="1"?"MEXICANA":"EXTRANJERA")
    $("#estadoNacimiento").val(getStateByKey(aspirant.estado_nacimiento));
    $("#municipioNacimiento").val(aspirant.municipio_nacimiento);
    $('#municipioNacimiento').select2().trigger('change');
    //--- contact
    $("#telefonoCelular").val(aspirant.celular);
    $("#telefonoCasa").val(aspirant.telefono);
    $("#correoElectronico").val(aspirant.correo_e);
    $("#correoValidacion").val(aspirant.correo_e);
    //--- direction
    $("#ciudad").val(aspirant.ciudad);
    $("#calle").val(aspirant.calle);
    $("#numExterior").val(aspirant.num_exterior);
    $("#numInterior").val(aspirant.num_interior);
    //--- School origin
    $("#estadoescuela").val(aspirant.estado_escuela);
    $('#estadoescuela').select2().trigger('change');
    setTimeout(()=> {
        $("#codigoPostal").val(aspirant.cp);
        $("#codigoPostal").trigger('change');
    },100);
    setTimeout(()=> {
        $("#localidad").val(aspirant.colonia);
        $('#localidad').select2().trigger('change');
        $("#claveescuela").val(aspirant.cve_escuela_procedencia);
        $('#claveescuela').select2().trigger('change');
        $("#escuela").val($('#claveescuela option:selected').attr("escuela"));
        $("#municipio").val($('#claveescuela option:selected').attr("municipio"));
    },200);
}




const updateAspirant = (aspirant) => {
    $.ajax({
        url: '/api/v1/aspirantes/' +  aspirant.curp,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(aspirant),
        success: function(response) {
            if (response.success){
                const email = $("#correoValidacion").val();
                const message ="En este momento se ha enviado su código de acceso al correo: " +
                    `${email}. Revise su bandeja puede estar en la lista de spam`;
                
                alert(`Operación exitosa!\n ${message}`);
                
                setTimeout(() => {
                    loadPage("default.html","content", function () {
                        sessionStorage.clear();
                        initMain();
                        $("#txtCurp").val(curp);
                        $("#txtCurp").prop("disabled", true);
                        $("#divAccessCode").show();
                        $("#btnStart").hide();
                        $("#btnValidateCode").show();
                        $("#txtAccessCode").focus();
                    });
                }, 3000);
                
            } else {
                alert(response.message);
            }

        },
        error: function(error) {
            alert("Ocurrió un error en la actualización");
        }
    });
}

const assignDataToAspirant = () =>{
    aspirant.nombre =    $("#nombre").val().trim();
    aspirant.a_paterno = $("#apellidoPaterno").val().trim();
    aspirant.a_materno = $("#apellidoMaterno").val().trim();
    aspirant.f_nacimiento = getBirthDateFromCurp(curp);
    aspirant.sexo = curp.charAt(10)==="H"?"M":"F";
    const nationality = curp.substring(11, 13);
    aspirant.nacionalidad = nationality==="NE"?"2":"1";
    aspirant.estado_nacimiento = getKeyState(curp.substring(11,13))
    aspirant.municipio_nacimiento = parseInt($("#municipioNacimiento").val());
    aspirant.celular =  $("#telefonoCelular").val().trim();
    aspirant.telefono = $("#telefonoCasa").val().trim();
    aspirant.correo_e = $("#correoElectronico").val().trim();
    aspirant.ciudad = $("#ciudad").val().trim();
    aspirant.calle = $("#calle").val().trim();
    aspirant.num_exterior = parseInt($("#numExterior").val().trim());
    aspirant.num_interior = $("#numInterior").val().trim();
    aspirant.estado_escuela = $("#estadoescuela").val();
    aspirant.cp = parseInt($("#codigoPostal").val());
    aspirant.colonia = $("#localidad").val();
    aspirant.cve_escuela_procedencia =  $("#claveescuela").val();
    aspirant.estado_civil= StatusAspirant.SINGLE_MARITAL;
    aspirant.estatus = StatusAspirant.ACTIVE;
    aspirant.escuela_procedencia = 0 ; // not currently used
}

const isAllSelectsHaveValues = ()=> {

    if ($("#municipioNacimiento").val().toString()==="0") {
        alert("Es necesario elegir el municipio de nacimiento ");
        return false;
    }
    if ($("#localidad").val().toString()==="0") {
        alert("Es necesario elegir la colonia");
        return false;
    }
    if ($("#estadoescuela").val().toString()==="0") {
        alert("Es necesario elegir el estado de la escuela de procedencia");
        return false;
    }
    if ($("#claveescuela").val().toString()==="0") {
        alert("Es necesario elegir la escuela");
        return false;
    }
    return  true;
}

(function() {
    editAspirantInit()
})();
