
const initializeInput = () => {
    $("#clave").val("");
    $("#escuela").val("");
    $("#municipio").val("");
}


const schoolOfOriginInit =  () => {
    initializeInput();
    populateSelect("/api/v1/estado", $("#estadoescuela"), propertiesForState());

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

    $("#btnNext").click( function () {
        const form = $("#formSchoolOrigin")[0];
        if (form.checkValidity()){
            aspirant.cve_escuela = $("#claveescuela").val();
            aspirant.estado_escuela = parseInt($("#estadoescuela").val());
            aspirant.escuela_procedencia = 0;
            saveAspirant();
        } else {
            form.classList.add('was-validated');
        }

    });
    
}

const saveAspirant = () => {
    $.ajax({
        url: '/api/v1/aspirantes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(aspirant),
        success: function(response) {
            if (response.success){
                loadResources(['register/edit_aspirant.html'],[['assets/js/edit_aspirant.js','edit_aspirant']]);
            } else {
                alert(response.message);
            }
        },
        error: function(error) {
            console.error('Error en la solicitud:', error);
        }
    });
}

(function() {
    schoolOfOriginInit();
})();