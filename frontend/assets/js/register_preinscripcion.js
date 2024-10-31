
const registerPreinscriptionInit = () => {
    console.log("preinscripcion iniciada...");

    $.ajax({
        url: `/api/v1/admision/findCarrera/${curp}/${urlParameters.level}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success && response.data.length > 0) {
                const aspirant = response.data[0]; // Obtener los datos del aspirante
                showDataAspirant(aspirant);
                loadDataInAspirantData(aspirant);
                // loadEstados(aspirant.estado);
                //  loadEscuelas(aspirant.escuela_procedencia);
                loadEstadosAndLocalidad(aspirant.estado, aspirant.cp, aspirant.colonia);

            } else {
                alert(response.message);
                redirectToAdmission(300)


            }
        },
        error: function (xhr, status, error) {
            //console.error(error);
            alert(response.message);
            redirectToAdmission(300)

        }
    });
};

const loadEstadosAndLocalidad = (estadoId, cpAlumno, localidadId) => {

    populateSelect('/api/v1/estado', $('#estado'), propertiesForState(), function() {

        $('#estado').on('change', function() {
            const estadoId = $(this).val();
            if (estadoId != 0 && estadoId !== "") {

                populateSelect(`/api/v1/municipio/${estadoId}`, $('#MunicipioAlumno'), propertiesForMunicipality());
            } else {

                $('#MunicipioAlumno').empty();
                $('#MunicipioAlumno').append('<option value="">Seleccione un municipio</option>');
            }
        });


        if (estadoId) {
            $('#estado').val(estadoId).trigger('change');

        }
    }, estadoId);


    $("#cpAlumno").on('change', function() {
        const postalCode = $('#cpAlumno').val().trim();
        if (postalCode.length < 5) return;

        const url = '/api/v1/localidad/' + encodeURIComponent(postalCode);
        populateSelect(url, $("#localidadAlumno"), propertiesForLocality());
    });


    if (cpAlumno && cpAlumno.length === 5) {
        const url = '/api/v1/localidad/' + encodeURIComponent(cpAlumno);
        populateSelect(url, $("#localidadAlumno"), propertiesForLocality(), function() {
            if (localidadId) {

                $("#localidadAlumno").val(localidadId).trigger("change");
            }

        });
    }
};





const showDataAspirant = (preinscripcionn) => {
    $("#nombreCompleto").text(preinscripcionn.nombre + " " + preinscripcionn.a_paterno + " " + preinscripcionn.a_materno);
    $("#curp").val(preinscripcionn.curp);
    $("#nombre").val(preinscripcionn.nombre);
    $("#a_paterno").val(preinscripcionn.a_paterno);
    $("#a_materno").val(preinscripcionn.a_materno);
    $("#estado").val(preinscripcionn.estado).trigger("change");
    $("#ciudad").val(preinscripcionn.ciudad);
    $("#localidadAlumno").val(preinscripcionn.colonia).trigger("change");
    $("#calle").val(preinscripcionn.calle);
    $("#num_interior").val(preinscripcionn.num_interior);
    $("#num_exterior").val(preinscripcionn.num_exterior);
    $("#celular").val(preinscripcionn.celular);
    $("#correo_e").val(preinscripcionn.correo_e);
    $("#nombreCarrera").val(preinscripcionn.nombreCarrera);
    $("#escuela_procedencia").val(preinscripcionn.nombreEscuela);
    $("#cpAlumno").val(preinscripcionn.cp);
};

const loadDataInAspirantData = (preinscripcionn) => {
    preinscripcion.nombreCompleto = preinscripcionn.nombreCompleto;
    preinscripcion.curp = preinscripcionn.curp;
    preinscripcion.nombre = preinscripcionn.nombre;
    preinscripcion.a_paterno = preinscripcionn.a_paterno;
    preinscripcion.a_materno = preinscripcionn.a_materno;
    preinscripcion.ciudad = preinscripcionn.ciudad;
    preinscripcion.colonia = preinscripcionn.colonia;
    preinscripcion.calle = preinscripcionn.calle;
    preinscripcion.num_interior = preinscripcionn.num_interior;
    preinscripcion.num_exterior = preinscripcionn.num_exterior;
    preinscripcion.celular = preinscripcionn.celular;
    preinscripcion.correo_e = preinscripcionn.correo_e;
    preinscripcion.nombreCarrera = preinscripcionn.nombreCarrera;
    preinscripcion.nombreEscuela=preinscripcionn.nombreEscuela;
    preinscripcion.estatus=preinscripcionn.estatus;
    preinscripcion.cp=preinscripcionn.cp;
};
///-----------------------------------------------------------------SECCION DE LENGUAS Y DISCAPACIDAD------------------------------------------------------------


const loadParentesco = () => {
    $.ajax({
        url: "api/v1/parentesco",
        method: "GET",
        dataType: "json",
        success: function(response) {
            console.log("Response completa:", response);

            if (response.success && Array.isArray(response.data)) {
                const parentescos = response.data;

                const selectParentesco = $("#parentesco");
                const properties = propertiesForParentesco();

                selectParentesco.empty();
                selectParentesco.append('<option value="">Seleccione una opción</option>');

                // Iterar sobre el array de parentescos
                parentescos.forEach(parentesco => {
                    const value = parentesco[properties.get("value")];
                    const text = parentesco[properties.get("text")];
                    selectParentesco.append(`<option value="${value}">${text}</option>`);
                });

                selectParentesco.trigger("change");

            } else {
                console.error("El formato de la respuesta es incorrecto o no hay datos disponibles.");
            }

        },
        error: function(xhr, status, error) {
            console.error("Error al cargar los parentescos: ", error);
        }
    });
};


const loadLengua = () => {
    $.ajax({
        url: "api/v1/lengua",
        method: "GET",
        dataType: "json",
        success: function(response) {

            // Verifica que el éxito sea verdadero y que data sea un array
            if (response.success && Array.isArray(response.data)) {
                const lenguas = response.data;
                console.log(response);
                const selectLengua = $("#grupoIndigena");
                const selectLengua1 = $("#lengua");
                const properties = propertiesForLengua();

                selectLengua.empty();
                selectLengua.append('<option value="">Seleccione una opción</option>');

                selectLengua1.empty();
                selectLengua1.append('<option value="">Seleccione una opción</option>');

                lenguas.forEach(lengua => {
                    const value = lengua[properties.get("value")];
                    const text = lengua[properties.get("text")];
                    selectLengua.append(`<option value="${value}">${text}</option>`);

                    selectLengua1.append(`<option value="${value}">${text}</option>`);
                });


                selectLengua.trigger("change");
                selectLengua1.trigger("change");
            } else {
                console.error("El formato de la respuesta es incorrecto o no hay datos disponibles.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar las lenguas: ", error);
        }
    });
};



const loadDiscapacidad = () => {
    $.ajax({
        url: "api/v1/discapacidad",
        method: "GET",
        dataType: "json",
        success: function(response) {
            console.log("Response completa:", response);  // Verifica toda la respuesta

            // Verifica que el éxito sea verdadero y que data sea un array
            if (response.success && Array.isArray(response.data)) {
                const discapacidades = response.data;

                const selectDiscapacidad = $("#discapacidad");
                const properties = propertiesForDiscapacidad();

                selectDiscapacidad.empty();
                selectDiscapacidad.append('<option value="">Seleccione una opción</option>');

                // Iterar sobre el array de parentescos
                discapacidades.forEach(discapacidad => {
                    const value = discapacidad[properties.get("value")];
                    const text = discapacidad[properties.get("text")];
                    selectDiscapacidad.append(`<option value="${value}">${text}</option>`);
                });

                selectDiscapacidad.trigger("change");  // Si estás usando algún plugin como Select2
            } else {
                console.error("El formato de la respuesta es incorrecto o no hay datos disponibles.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar los parentescos: ", error);
        }
    });
};



document.addEventListener("DOMContentLoaded", function() {
    handlerForUpperCase();  // Campos que requieren texto en mayúsculas
    handlerForOnlyNumber();  // Campos que requieren solo números
});




//------------------------------------------------------------------------------SECCION TUTOR------------------------------------------------------
$("#cpTutor").change(function() {
    const postalCode = $('#cpTutor').val().trim();
    if (postalCode.length<5) return;
    const url = '/api/v1/localidad/' + encodeURIComponent(postalCode);
    populateSelect(url, $("#coloniatutor"), propertiesForLocality());

});
populateSelect('/api/v1/estado', $('#estadoNacimientotutor'), propertiesForState(), function() {
    $('#estadoNacimientotutor').on('change', function() {
        const estadoId = $(this).val();
        if (estadoId != 0) {
            populateSelect(`/api/v1/municipio/${estadoId}`, $('#Municipiotutor'), propertiesForMunicipality());
        }
    });
});


let currentDate = new Date();

// Obtener día, mes y año (aunque no será necesario aquí)
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();



const getFamiliaData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nivelFromUrl = urlParams.get("nivel") || null;


    return {
        curp: $("#curpTutor").val() || null,
        nombre: $("#nombretutor").val(),
        a_paterno: $("#apellidoPaternotutor").val(),
        a_materno: $("#apellidoMaternotutor").val(),
        calle: $("#Calletutor").val(),
        colonia: $("#coloniatutor").val(),
        nacionalidad: $("#nacionalidadtutor").val(),
        sexo: $("#sexoTutor").val() || null,
        telefono: $("#telefonoTutor").val(),
        num_exterior: parseInt($("#numExteriortutor").val()),
        num_interior: $("#numInteriortutor").val(),
        cp: $("#cpTutor").val(),
        municipio: parseInt($("#Municipiotutor").val()),
        estado: parseInt($("#estadoNacimientotutor").val()),
        lengua: $("#lenguaTutor").val() || null,
        ocupacion: $("#ocupacionTutor").val() || null,
        puesto: $("#puestoTutor").val() || null,
        nivel: nivelFromUrl || null

    };
    console.log("get", getFamiliaData());
};
const getAlumnoData =()=> {


    alumno.curp= $("#curp").val();
    alumno.estado = parseInt($("#estado").val());
    alumno.calle = $("#calle").val();
    alumno.colonia = $("#localidadAlumno").val();
    alumno.num_exterior = parseInt($("#num_exterior").val());
    alumno.num_interior = $("#num_interior").val();
    alumno.cp = $("#cpAlumno").val();
    alumno.municipio= parseInt($("#MunicipioAlumno").val());
    alumno.celular = $("#celular").val();
    alumno.correo_e = $("#correo_e").val();
    alumno.condonado = "0";  // por default
    alumno.institucion_medica= "0";  // default
    alumno.afrodesendiente = $("#afrodescendiente").val();
    alumno.grupo_indigena = parseInt($("#grupoIndigena").val());
    alumno.hablalengua = parseInt($("#lengua").val());
    alumno.discapacidad=parseInt($("#discapacidad").val());
    alumno.fecha_registro = new Date().toISOString();
    alumno.rol = 1;  // Valor fijo por ahora
    alumno.escuela_procedencia = 0;  // por default
    alumno.foto= "" || null;// Foto vacía o nula
    alumno.nacionalidad=$("#nacionalidadAlumno").val();
    alumno.edo_civil=$("#estadoCivil").val();
   // alumno.matricula = alumno.matricula;  // Mantener el valor existente si ya está establecido


    return alumno;  // Devuelve el objeto actualizado
};



// Función para enviar los datos al servidor y retornar una promesa
const sendDataToServer = (data, url) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response) {
                console.log("Datos guardados exitosamente.", response);
                resolve(response);  // Resolver la promesa con la respuesta
            },
            error: function(xhr, status, error) {
                console.error("Error al guardar los datos:", error);
                reject(error);  // Rechazar la promesa con el error
            }
        });
    });
};

$(document).ready(function() {
    $("#btnSavePreincripcion").on("click", function (event) {
        const form = $('#formPreinscricionAspirante')[0];

        if (!form.checkValidity()){
            form.classList.add('was-validated');
            alert("Faltan datos, por favor revise");
            return;
        }
        event.preventDefault();

        let familiaResponse;
        let matriculaAlumno;

        const familia = getFamiliaData();
        const alumno = getAlumnoData(curp);
        const relacionPersonal = getRelacionPersonalData();

        console.log("ID de parentesco:", relacionPersonal.parentesco);
        console.log("alumno", getAlumnoData())
        // Guardar familia primero
        sendDataToServer(familia, '/api/v1/familiar')
            .then(responseFamiliar => {
                console.log("Familia guardada exitosamente.", responseFamiliar.id);
                familiaResponse = responseFamiliar;

                // Guardar el alumno después de guardar la familia
                return sendDataToServer(alumno, `/api/v1/alumno/registrar/${curp}/${urlParameters.level}`);
            })
            .then(responseAlumno => {
                console.log("Respuesta completa del alumno:", responseAlumno);

                // Extraer la matrícula del array en la respuesta
                if (responseAlumno.success &&
                    responseAlumno.data.length > 0 ) {

                    matriculaAlumno = responseAlumno.data[0].matricula;
                    console.log("Matrícula extraída:", matriculaAlumno);

                    // Actualizar el objeto alumno con la matrícula
                    alumno.matricula = matriculaAlumno;
                } else {
                    throw new Error("No se pudo obtener la matrícula del alumno de la respuesta");
                }

                // Crear el objeto de relación personal con los IDs obtenidos
                const relacionpersonal = {
                    id: {
                        matricula: matriculaAlumno,
                        familiar: familiaResponse.id
                    },
                    responsable: "1",
                    parentesco: relacionPersonal.parentesco
                };

                console.log("Datos de relación personal a enviar:", relacionpersonal);

                // Guardar la relación personal
                return sendDataToServer(relacionpersonal, '/api/v1/relacionpersonal');
            })
            .then(responseRelacionPersonal => {
                console.log("Relación personal guardada exitosamente.", responseRelacionPersonal);
                alert("Registro completado con éxito");

                console.log("Matrícula del alumno antes de mostrar ticket:", alumno.matricula);

                // Asegurarse de que la matrícula esté establecida antes de mostrar el ticket
                if (!alumno.matricula) {
                    alumno.matricula = responseRelacionPersonal.id.matricula;
                }

                console.log("Matrícula final del alumno:", alumno.matricula);

                showTicketContainer();
                loadScript('assets/js/formatoPreincripcion.js', "formatoPreincripcion");
                loadScript('assets/js/FichaDeposito.js', "fichaDeposito");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error en el proceso de registro: " + error.message);
            });
    });
});


//*************************************************************************************************

const getRelacionPersonalData = () => {
    return {
        parentesco: $("#parentesco").val()  // Asegúrate de que esto está obteniendo el ID correcto
    };
};




///Cargar los datos en la página una vez que el usuario ha ingresado
$(document).ready(function() {
    console.log(curp);
    registerPreinscriptionInit();
    loadParentesco();
    loadLengua();
    loadDiscapacidad();

    // $("#discapacidad").on("change", toggleDiscapacidadSelect);
});

