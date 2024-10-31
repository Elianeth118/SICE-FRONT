
//--- este evento ocurre en cuanto se termina de cargar
//--- todos los elementos incluyendo css, js, imágenes, etc.
window.addEventListener('load', function() {

    $('.select2').select2({
            width: 'resolve' // Adapt the width to the parent element
        });
        
    $("#btnStart").prop("disabled", false);
    $("#txtCurp").prop("disabled", false);
    //--- Mostrar la barra de progreso al iniciar cualquier llamada ajax
    $(document).ajaxStart(function() {
        $("#progress-container").show();
        console.log("showing ajax start...")
    });
    
    //--- Ocultar el contenedor de la barra de progreso al finalizar cualquier llamada AJAX
    $(document).ajaxStop(function() {
        $("#progress-container").hide();
        console.log("showing ajax stop...")
    });


    //--  Sobrescribir
    window.fetch = async function (...args) {
        //--- Mostrar el contenedor de la  progressbar cuando se llama fetch
        document.getElementById("progress-container").style.display = "block";
        console.log("showing fetch start...");
        try {
            // Realizar la solicitud fetch
            const response = await originalFetch(...args);
            return response;
        } catch (error) {
            console.error("Fetch error: ", error);
            throw error;
        } finally {
            //--- Ocultar el contenedor de la barra de progreso
            document.getElementById("progress-container").style.display = "none";
            console.log("showing fetch stop...");
        }
    };
    
    initMain();
});

//--- Este evento ocurre cuando solo se han cargado los elementos del html
document.addEventListener('DOMContentLoaded', function() {

});

