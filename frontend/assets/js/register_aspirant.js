const registerAspirantInit =() => {
    console.log("Init register aspirant...");
    preloadData();
    
    $(window).on('beforeunload', function () {
        if (!formCompleted) {
            return '¡Aún no has completado el formulario! ¿Estás seguro de abandonar la página?';
        }
    });
    
    $("#btnSave").click( async  function () {
        const form = $('#formRegisterAspirant')[0];
        
        if (!form.checkValidity()){
            form.classList.add('was-validated');
            alert("Faltan datos, por favor revise");
            return;
        }
        
        const curpGenerated = generateCURP(
            $("#nombre").val(),
            $("#apellidoPaterno").val(),
            $("#apellidoMaterno").val(),
            $("#fechaNacimiento").val(),
            curp.substring(10,11),
            curp.substring(11,13),
            curp.substring(16,17)
        );
        
        if (curp !== curpGenerated){
            alert("La CURP no coincide con los datos ingresados");
            return;
        }
        
        //-- validate email
        const emailConfirm = $('#correoValidacion').val();
        const email = $('#correoElectronico').val();
        if (email!==emailConfirm){
            showMessageEmailNotMatch();
            return;
        }


        checkEmailExist(curp, emailConfirm).then(emailExist => {
            if (!emailExist){
                //--- general data
                aspirant.nombre = $("#nombre").val();
                aspirant.a_paterno = $("#apellidoPaterno").val();
                aspirant.a_materno = $("#apellidoMaterno").val();
                aspirant.estado_civil= StatusAspirant.SINGLE_MARITAL;
                aspirant.estatus = StatusAspirant.ACTIVE;
                aspirant.municipio_nacimiento = parseInt($("#municipioNacimiento").val());
                //--- contact data
                aspirant.telefono = $("#telefonoCasa").val();
                aspirant.celular = $("#telefonoCelular").val();
                aspirant.correo_e = $("#correoElectronico").val();
                //--- address data
                aspirant.ciudad = $('#ciudad').val();
                aspirant.cp = $('#codigoPostal').val();
                aspirant.colonia = $('#localidad').val();
                aspirant.estado = $('#localidad option:selected').attr("cve_estado");
                aspirant.calle = $('#calle').val();
                aspirant.num_interior = $('#numInterior').val();
                aspirant.num_exterior = parseInt($('#numExterior').val());
                
                //--- schoolOfOrigin data
                aspirant.cve_escuela_procedencia = $("#claveescuela").val();
                console.log("ok andamos bien", aspirant.cve_escuela_procedencia)
                aspirant.estado_escuela = parseInt($("#estadoescuela").val());
                aspirant.escuela_procedencia = 0; //default
                saveAspirant();
            } else {
                showMessageEmailExist();
            }
        });


    });
    
    $("#codigoPostal").change(function() {
        const postalCode = $('#codigoPostal').val().trim();
        if (postalCode.length<5) return;
        const url = '/api/v1/localidad/' + encodeURIComponent(postalCode);
        populateSelect(url, $("#localidad"), propertiesForLocality());
        
    });
    
    $("#estadoescuela").change(function () {
        const cve_estado_escuela = $(this).val();
        if (cve_estado_escuela.trim()==="") return;
        const url = "/api/v1/escuela-procedencia/estado/" +
            cve_estado_escuela + "/" + levelOfOrigin(urlParameters.level.toString());
        
        populateSelect(url, $("#claveescuela"), propertiesForSchoolOfOrigin());
        
    });
    
    $("#claveescuela").change( function (){
        const optionSelected = $('#claveescuela option:selected');
        $("#escuela").val(optionSelected.attr("escuela"));
        $("#municipio").val(optionSelected.attr("municipio"));
    });
    
    
    $("#nombre").focus();
    handlerForUpperCase();
    handlerForOnlyNumber();
    
}
//-----------------
const saveAspirant = () => {

    $.ajax({
        url: '/api/v1/aspirantes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(aspirant),
        success: function(response) {
            if (response.success){
                loadPage("register/career.html", "content", function() {
                    loadScript("assets/js/career.js", "career");
                });
            } else {
                alert(response.message);
            }
        },
        error: function(error) {
            console.error('Error en la solicitud:', error);
        }
    });
}



const preloadData = () => {
    const genre = curp.charAt(10);
    $("#curp").val(curp);
    aspirant.curp = curp;
    aspirant.sexo = genre==="M"?"F":"M"
    const textGenre =  genre==="M"?"FEMENINO":"MASCULINO";
    $("#genero").val(textGenre)
    
    const nationality = curp.substring(11, 13);
    aspirant.nacionalidad = nationality==="NE"?"2":"1";
    const textNationality = nationality==="NE"?"EXTRANJERA":"MEXICANA";
    $('#nacionalidad').val(textNationality);
    
    const birthDate = getBirthDateFromCurp(curp);
    const [year, month, day] = birthDate.split("-");
    $('#fechaNacimiento').val(`${day}/${month}/${year}`);
    aspirant.f_nacimiento = `${year}-${month}-${day}`
    
    const stateCode = curp.substring(11,13);
    $('#estadoNacimiento').val (getState(stateCode));
    aspirant.estado_nacimiento =  getKeyState(stateCode);
    //---
    const codeState = curp.substring(11,13);
    const url = "/api/v1/municipio/" +  encodeURIComponent(getKeyState(codeState))
    populateSelect(url, $("#municipioNacimiento"), propertiesForMunicipality())
    populateSelect("/api/v1/estado", $("#estadoescuela"), propertiesForState());
    
    initializeInput();
}

const initializeInput = () => {
    $("#clave").val("");
    $("#escuela").val("");
    $("#municipio").val("");
}

(function() {
    registerAspirantInit()
})();