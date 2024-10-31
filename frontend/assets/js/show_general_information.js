
const generalInformationInit = () => {
    $.ajax({
        url: `/api/v1/admision/${curp}/${sessionStorage.getItem("fua")}/${urlParameters.level}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success && response.data.length > 0 ) {
                showData(response.data[0])
                loadDataInAdmissionData(response.data[0]);
            } else {
                alert("Ocurríó un error al recuperar los datos");
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
    
    

}

const showData = (admission) => {
    $("#ciclo").text(admission.cicloEscolar);
    $("#fua").text(`FUA: ${admission.folioAdmision}`);
    $("#estatus").text(`ESTATUS: ${EstatusAdmision[admission.estatus]}`);
    $("#nombrecompleto").text(admission.nombre +  " " + admission.apellidoPaterno + " " + admission.apellidoMaterno);
    $("#carrera").text(`Carrera: ${admission.carrera}`);
    $("#escuela").text(`Escuela: ${admission.escuela}`);
    $("#btnChangeCareer").prop("disabled",admission.estatus!==StatusAdmission.REGISTERED)
}

const loadDataInAdmissionData = (admission) =>{
    admissionData.id.folioAdmision = admission.folioAdmision;
    admissionData.id.cicloEscolar = admission.cicloEscolar;
    admissionData.curp =  admission.curp;
    admissionData.carrera = admission.carrera;
    admissionData.escuela = admission.escuela;
}

(function (){
    generalInformationInit();
    document.getElementById("btnChangeCareer").addEventListener('click', function() {
        document.getElementById("warningMessage").style="display: block;";
    });
    
    document.getElementById("btnCancel").addEventListener('click', function() {
        console.log("canceling change career...");
        document.getElementById("warningMessage").style="display: none;";
    });
    
    
    document.getElementById("btnContinue").addEventListener('click', function() {
        console.log("cargando cambio de carrera...");
        loadPage("admission/changecareer.html", "content", function() {
            loadScript("assets/js/changecareer.js", "changecareer");
        });
    });
})()