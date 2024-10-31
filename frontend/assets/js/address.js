const addressInit = () => {
    handlerForUpperCase();
    handlerForOnlyNumber();

    $("#codigoPostal").change(function() {
        const postalCode = $('#codigoPostal').val().trim();
        if (postalCode.length<5) return;
        const url = '/api/v1/localidad/' + encodeURIComponent(postalCode);
        populateSelect(url, $("#localidad"), propertiesForLocality());

    });

    $("#btnNext").click(function (event){
        const form = $("#formAddress")[0];
        if (form.checkValidity()) {
            aspirant.ciudad = $('#ciudad').val();
            aspirant.cp = $('#codigoPostal').val();
            aspirant.colonia = $('#localidad').val();
            aspirant.estado = $('#localidad option:selected').attr("cve_estado");
            aspirant.calle = $('#calle').val();
            aspirant.num_interior = $('#numInterior').val();
            aspirant.num_exterior = parseInt($('#numExterior').val());
            loadResources(['register/schooloforigin.html'],[['assets/js/schooloforigin.js','schooloforigin']])
        } else {
            form.classList.add('was-validated');
        }

    });
}
(function() {
    addressInit();
})();
