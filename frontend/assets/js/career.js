
const careerInit =  () => {
    console.log("Init career...");

    let levelMessage = {"102":"MEDIA SUPERIOR","104":"SUPERIOR"}
    $("#txtNivelAcademico").val(levelMessage[urlParameters.level])
   
    const url =
    "/api/v1/detallecicloescolar/" +
    encodeURIComponent(urlParameters.level) +
    "/" +
    encodeURIComponent(urlParameters.operation);

    populateSelect(url, $("#carrera"), propertiesForCareer(), function (){
        objectHandlerForCareer()
    })
}

const objectHandlerForCareer = () => {
    //--- remove duplicates and save original data in schoolCareers
    const options=[];
    const  schoolCareers = [];
    
    $("#carrera > option").each(function () {
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
    
    $("#carrera").change(function (){
        const escuelas= schoolCareers.filter( item => item.carrera === $(this).val() )
        $("#escuela").empty();
        if (parseInt($(this).val())>0) {
            escuelas.forEach((item) =>{
                $("#escuela").append("<option value='" + item.escuela + "'>" + item.nombreEscuela +  "</option>");
            });
        }
        
    });
    
    $("#btnSave").click( function () {
        saveCareer();
    });
}

const saveCareer = () => {
    
    if ($("#carrera").val()<=0 || $("#escuela").val()<=0 ){
        alert("Es necesario elegir la carrera y escuela");
        return;
    }

    admissionData.curp = curp;
    admissionData.carrera = $("#carrera").val();
    admissionData.escuela = $("#escuela").val();
    
    const selectedOption = $('#carrera').find('option:selected');
    admissionData.id.cicloEscolar =selectedOption.attr("cicloescolar");

    const admissionParameter ={
        eadmisionEntity:admissionData,
        convocatoria:urlParameters.call,
        nivel: urlParameters.level,
    }
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
            }else {
            
            }
            
        }, error: function (){
            alert("Ocurrió un error al intentar guardar los datos. Contacte al Tel.");
        }
    });
}

(function() {
    careerInit()
})();