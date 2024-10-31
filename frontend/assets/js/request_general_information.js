const requestGeneralInformationInit =() => {
    preloadData();
    const codeState = curp.substring(11,13);
    const url = "/api/v1/municipio/" +  encodeURIComponent(getKeyState(codeState))
    populateSelect(url, $("#municipioNacimiento"), propertiesForMunicipality())

    $(window).on('beforeunload', function () {
        if (!formCompleted) {
            return '¡Aún no has completado el formulario! ¿Estás seguro de abandonar la página?';
        }
    });
    $("#btnNext").click(function () {
        const form = $('#formGeneral_Information')[0];
        const curpGenerated = generateCURP(
            $("#nombre").val(),
            $("#apellidoPaterno").val(),
            $("#apellidoMaterno").val(),
            $("#fechaNacimiento").val(),
            curp.substring(10,11),
            curp.substring(11,13),
            curp.substring(16,17)
            );
        if (form.checkValidity()){
            if (curp === curpGenerated) {
                aspirant.nombre = $("#nombre").val();
                aspirant.a_paterno = $("#apellidoPaterno").val();
                aspirant.a_materno = $("#apellidoMaterno").val();
                aspirant.estado_civil= StatusAspirant.SINGLE_MARITAL;
                aspirant.estatus = StatusAspirant.ACTIVE;
                aspirant.municipio_nacimiento = parseInt($("#municipioNacimiento").val());
                loadResources(['register/contact.html'],[['assets/js/contact.js','contact']]);
            }  else {
                alert("La CURP no coincide con los datos ingresados");
            }
        } else {
            form.classList.add('was-validated');
        }
    });
    $("#nombre").focus();
    handlerForUpperCase();
}

//--- end document().ready()


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
}

(function() {
    requestGeneralInformationInit()
})();