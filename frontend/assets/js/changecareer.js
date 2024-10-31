

const changeCareerInit = () => {
    console.log("changeCareerInit...");
    let levelMessage = {"102":"MEDIA SUPERIOR","104":"SUPERIOR"}

    $("#nivelAcademico").html( `Nivel académico: <strong> ${levelMessage[urlParameters.level]}</strong>`)
    
    $("#carreraActual").html(`Carrera actual: <strong> ${admissionData.carrera}</strong>`);
    $("#escuelaActual").html(`Escuela actual: <strong> ${admissionData.escuela} </strong>`);
    
    
    const url =
        "/api/v1/detallecicloescolar/" +
        encodeURIComponent(urlParameters.level) +
        "/" +
        encodeURIComponent(urlParameters.operation);
    
    populateSelect(url, $("#nuevacarrera"), propertiesForCareer(), function (){
        objectHandlerForChangeCareer();
    })
    
}

const objectHandlerForChangeCareer= () => {
    const options=[];
    const schoolCareers = [];
    $("#nuevacarrera > option").each(function () {
        if ($(this).val()>0){
            schoolCareers.push({carrera:$(this).val(), nombreCarrera:$(this).text(),
                escuela:$(this).attr("escuela"), nombreEscuela:$(this).attr("nombreEscuela")}) ;
            if(options.includes($(this).text())) {
                $(this).remove();
            } else {
                options.push($(this).text());
            }
        }
    });
    
    $("#nuevacarrera").change(function (){
        console.log("change nuevacarrera " + $("#nuevacarrera").val() );
        const escuelas= schoolCareers.filter( item => item.carrera === $(this).val() )
        $("#nuevaescuela").empty();
        if (parseInt($(this).val())>0) {
            escuelas.forEach((item) =>{
                $("#nuevaescuela").append("<option value='" + item.escuela + "'>" + item.nombreEscuela +  "</option>");
            });
        }
    });
    
    document.getElementById("btnSaveChangeCareer").addEventListener('click', function() {
        saveChangeCareer();
    });
}

const saveChangeCareer = () => {
    const nuevacarrera = $("#nuevacarrera").val();
    const nuevaescuela = $("#nuevaescuela").val();
    if (nuevacarrera <= 0 || nuevaescuela <= 0 ){
        alert("Es necesario elegir la carrera y escuela");
        return;
    }
    admissionData.curp = curp;
    admissionData.carrera = nuevacarrera;
    admissionData.escuela = nuevaescuela;
    
    const selectedOption = $('#nuevacarrera').find('option:selected');
    admissionData.id.cicloEscolar =selectedOption.attr("cicloescolar");
    
    const admissionParameter ={
        eadmisionEntity:admissionData,
        convocatoria:urlParameters.call,
        nivel: urlParameters.level,
    }

    $.ajax({
        url: `/api/v1/admision/cancelfua/${curp}/${admissionData.id.folioAdmision}/${sessionStorage.getItem("code")}`,
        type: "PUT",
        contentType: "application/json",
        success: function (response){
            if (response.success){
                $.ajax({
                    url: "/api/v1/admision",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(admissionParameter),
                    success: function (response){
                        if (response.success){
                            admissionData.id.folioAdmision = response.data[0].fua;
                            showTicketContainer();
                            loadScript('assets/js/ticket.js',"ticket");
                        }
                    }
                });
            } else {
                alert(response.message);
            }
        }
    });
}

(function (){
    changeCareerInit();
})()