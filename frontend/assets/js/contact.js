const contactInit = () => {
    handlerForOnlyNumber();
    handlerForLowerCase();

    $("#btnNext").click(function(event) {
        const form =$("#formContact")[0];
        if (!(form.checkValidity())){
            form.classList.add('was-validated');
            return;
        }
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
                } else {
                    aspirant.telefono = $("#telefonoCasa").val();
                    aspirant.celular = $("#telefonoCelular").val();
                    aspirant.correo_e = $("#correoElectronico").val();
                    loadResources(['register/address.html'], [['assets/js/address.js', 'address']])
                }
            },
            error: function () {
                console.error('Error al enviar la solicitud a la API');
            }
        });
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

    $("#telefonoCelular").focus();
}

(function() {
    contactInit();
})();