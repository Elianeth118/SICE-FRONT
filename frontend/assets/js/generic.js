const StatusAdmission = {
    REGISTERED:"1", //--- registrado
    PAID:"2",
    ACCEPTED:"3",
    PRE_SELECTED:"4",
    PRE_REGISTER:"6",
    ENROLLED:"7", //--- inscrito
    CANCELED:"53"
}

const EstatusAdmision = {
    "1": "REGISTRADO",
    "2": "PAGADO",
    "3": "ACEPTADO",
    "4": "PRE SELECCIONADO",
    "6": "PRE REGISTRADO",
    "7": "INSCRITO",
    "53": "CANCELADO",
}

const StatusAspirant = {
    SINGLE_MARITAL:"1",
    ACTIVE:1,
}

const Operation = {
    ASPIRANT_REGISTER : 62,
    ASPIRANT_LOAD_PHOTO : 215,
    ASPIRANT_PRINT_CREDENTIAL_TICKET: 81,
    ASPIRANT_REPRINT_FUA: 84,
    ASPIRANT_PRE_REGISTRATION: 80,
    ASPIRANT_DIAGNOSIS: 0,
}

const Incident = {
    FINAL_WITHDRAWAL: 1,
    PREVIOUS_PROCESS : 2,
}

const StatusCredential ={
    PRINTING:1,
    PREVIEWING:2
}


const getKeyByValue = (obj, value) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === value) {
            return  key;
        }
    }
    return "";
}

const forceInputUpperCase = (e) => {
    const element = e.target;
    const start = element.selectionStart || 0;
    element.value = element.value.toUpperCase();
    element.setSelectionRange(start, start)
};

const forceInputLowerCase = (e) => {
    const element = e.target;
    const start = element.selectionStart || 0;
    element.value = element.value.toLowerCase();
    element.setSelectionRange(start, start)

};

const handlerForUpperCase = () =>{

    document.querySelectorAll(".upper").forEach(function(input) {
        input.addEventListener('input', function(event) {
            forceInputUpperCase(event);
        });
    })

};

const handlerForLowerCase = () =>{
    document.querySelectorAll(".lower").forEach(function(input) {
        input.addEventListener('input', function(event) {
            forceInputLowerCase(event);
        });
    })
};

const handlerForOnlyNumber = () =>{
    document.querySelectorAll(".only-number").forEach(function(input) {
        input.addEventListener("input", function() {
            this.value = this.value.replace(/\D/g, '');
        });
    })
};

const keyCodeState = [
    {key:1,  code:"AS", state:"Aguascalientes"},
    {key:2,  code:"BC", state:"Baja California"},
    {key:3,  code:"BS", state:"Baja California Sur"},
    {key:4,  code:"CC", state:"Campeche"},
    {key:5,  code:"CL", state:"Coahuila"},
    {key:6,  code:"CM", state:"Colima"},
    {key:7,  code:"CS", state:"Chiapas"},
    {key:8,  code:"CH", state:"Chihuahua"},
    {key:9,  code:"DF", state:"Distrito Federal"},
    {key:10, code:"DG", state:"Durango"},
    {key:11, code:"MC", state:"México"},
    {key:12, code:"GT", state:"Guanajuato"},
    {key:13, code:"GR", state:"Guerrero"},
    {key:14, code:"HG", state:"Hidalgo"},
    {key:15, code:"JC", state:"Jalisco"},
    {key:16, code:"MN", state:"Michoacán"},
    {key:17, code:"MS", state:"Morelos"},
    {key:18, code:"NT", state:"Nayarit"},
    {key:19, code:"NL", state:"Nuevo León"},
    {key:20, code:"OC", state:"Oaxaca"},
    {key:21, code:"PL", state:"Puebla"},
    {key:22, code:"QT", state:"Querétaro"},
    {key:23, code:"QR", state:"Quintana Roo"},
    {key:24, code:"SP", state:"San Luis Potosí"},
    {key:25, code:"SL", state:"Sinaloa"},
    {key:26, code:"SR", state:"Sonora"},
    {key:27, code:"TC", state:"Tabasco"},
    {key:28, code:"TS", state:"Tamaulipas"},
    {key:29, code:"TL", state:"Tlaxcala"},
    {key:30, code:"VZ", state:"Veracruz"},
    {key:31, code:"YN", state:"Yucatán"},
    {key:32, code:"ZS", state:"Zacatecas"},
    {key:39, code:"NE", state:"Extranjero"},
]
const getKeyState = (codeState) => {
    const notFound = {key:0, code:"", state:""};
    const elements = keyCodeState.filter(item => item.code === codeState)
    return (elements.length > 0?elements[0].key:notFound.key);
}

const getState = (codeState) => {
    const notFound = {key:0, code:"", state:""};
    const elements = keyCodeState.filter(item => item.code === codeState)
    return (elements.length > 0?elements[0].state:notFound.state);
}
const getStateByKey = (keyState) => {
    const notFound = {key:0, code:"", state:""};
    const elements = keyCodeState.filter(item => item.key === keyState)
    return (elements.length > 0?elements[0].state:notFound.state);
}

 //-------------------------------------
const handleSelect2 = (object) => {
    object.select2({
        with:'resolve',
        data: function (params) {
            return {
                term: params.term.toUpperCase(),
            };
        },
        language: {
            noResults: function() {
                return "Elemento no encontrado";
            },
            searching: function () {
                return "Buscando...";
            }
        },
        minimumResultsForSearch:5
    });
    $(document).on("select2:open", () => {
        document.querySelector(".select2-container--open .select2-search__field").focus()
    });
    $(document).on('keyup', '.select2-search__field', function(e){
        e.target.value = e.target.value.toUpperCase()
    });
}

const levelOfOrigin = (targetLevel) => {
    const levels = new Map()
    levels.set("102",109);
    levels.set("104",102);
    levels.set("106",104);
    return levels.get(targetLevel)
}

const populateSelect = (url, object, properties, callback) => {

    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                const rows = response.data;
                object.empty();
                object.append("<option value='0'>" + object.attr("placeholder") +" </option>");
                $.each(rows, function (index, row) {
                    let textProperties = "";
                    properties.forEach((value, key) => {
                        //--- The text indicates the field to be displayed in the SELECT element.
                        if (key!=="text")
                            textProperties += key + "='" + row[value] + "' ";
                    })
                    object.append(
                        '<option ' + textProperties + '>' +
                        row[properties.get('text')] + '</option>');

                });
                handleSelect2(object);
                if (callback) callback();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        },
    }); //--- end ajax
}

//----------------

const propertiesForState = () => {
    const properties = new Map();
    properties.set("value", "id");
    properties.set("text", "nombre");
    return properties;
}

const propertiesForMunicipality = () => {
    const properties = new Map();
    properties.set("value", "municipio");
    properties.set("text", "nombre");
    return properties;
}
const propertiesForSchoolOfOrigin = () => {
    const properties = new Map();
    properties.set("value","cve_escuela");
    properties.set("cve_municipio","cve_municipio");
    properties.set("municipio","municipio");
    properties.set("escuela","escuela");
    properties.set("text","cve_escuela");
    return properties;
}
const propertiesForLocality = () => {
    const properties = new Map();
    properties.set("value","nombrelocalidad");
    properties.set("cve_estado","cve_estado");
    properties.set("text","nombrelocalidad");
    return properties;
}

const propertiesForCareer= () => {
    const properties = new Map();
    properties.set("value","carrera");
    properties.set("escuela","escuela");
    properties.set("nombreescuela","nombreEscuela");
    properties.set("cicloescolar","cicloEscolar");
    properties.set("text","nombreCarrera");
    return properties;
}
window.propertiesForParentesco= () =>{
    const properties= new Map();
    properties.set("value", "id");
    properties.set("text","descripcion");
    return properties;
}
window.propertiesForLengua = function() {
    const properties = new Map();
    properties.set("value", "id");
    properties.set("text", "descripcion");
    properties.set("tipo", "tipo");
    return properties;
};

window.propertiesForDiscapacidad = function() {
    const properties = new Map();
    properties.set("value", "id");
    properties.set("text", "discapacidad");
    return properties;
};

const redirectToAdmission = (delay=3000) => {
    setTimeout(() => {
        window.location = "https://admision.uabjo.mx/";
    }, delay);
}

const dateConvertDDMMYYY = (date) =>{
    const [year, month, day] = date.split("-");
    return (day + "-" + month + "-" + year);
}
let familia = {
    id:"",
    curp: "",
    nombre: "",
    a_paterno: "",
    a_materno: "",
    calle: "",
    colonia: "",
    nacionalidad: "",
    sexo: "",
    telefono: "",
    num_exterior: "",
    num_interior: "",
    cp: "",
    municipio: "",
    estado: "", //--- estado del domicilio actual
    lengua: "",
    ocupacion: "",
    puesto: "",
    nivel: "",

}
let aspirant = {
    curp: "",
    nombre: "",
    a_paterno: "",
    a_materno: "",
    calle: "",
    colonia: "",
    num_exterior: "",
    num_interior: "",
    telefono: "",
    cp: "",
    celular: "",
    correo_e: "",
    sexo: "",
    escuela_procedencia: 0,
    f_nacimiento: "",
    municipio_nacimiento: "",
    estado_nacimiento: "",
    estado_escuela: "",
    ciudad: "",
    estado: "", //--- estado del domicilio actual
    estado_civil: "",
    nacionalidad: "",
    password: "",
    fecha_registro: "",
    carrera_simultanea: "",
    estatus: "",
    cve_escuela_procedencia: "",
    codigo_acceso: "",

}

let curp = "";
let folioAdmision = "";
let nivel = "";
let formCompleted = false;

let admissionData = {
    id: {
        folioAdmision: 0,
        cicloEscolar: 0
    },
    curp: "",
    carrera: 0,
    escuela: 0,
    fechaRegistro: "",
    referenciaBancaria: "",
    folioCeneval: "",
    estatus: "1",
    condonado: "0",
    fechaPago: "",
    fechaLimitePago: "",
    salonAsignado: "",
    nombreCarrera:""
}

let responsableData={
    id:{
        matricula:0,
        familiar:0
    }

}
let almmnoData={

    alumnoNombre: " ",
    alumnoAPaterno: "",
    alumnoAMaterno: "",
    sexo: "",
    edo_civil: "",
    alumnoNacionalidad: "",
    carrera: 0,
    nombreCarrera: " ",
    escuela: 0,
    escuelaNombre: "",
    alumnoEstado: 0,
    alumnoNombreEstado: "",
    alumnoColonia: " ",
    alumnoCalle: " ",
    alumnoCelular: "",
    alumnoNumInterior: "",
    alumnoNumExterior:"" ,
    correoE: "",
    escuela_procedencia: 0,
    escuela_procedencia_nombre: " ",
    estadoEscuela: 0,
    escuela_nombreEstado: "",
    alumnoCP: "",
    alumnoMunicipio: 0,
    alumnoNombreMunicipio: "",
    nivelEscolar: 0,
    familiaId: 0,
    familiaNombre: "",
    familiaPaterno: "",
    familiaMaterno: "",
    familiaEstado: 0,
    familiaNombreEstado: "",
    familiaMunicipio: 0,
    familiaNombreMunicipio: " ",
    familiaColonia: " ",
    familiaCalle: "",
    familiaNumInterior: "",
    familiaNumExterior: 0,
    familiaNacionalidad: "",
    parentescoId: "",
    parentescoDescripcion: "",
    descripcion_concepto_cobro:"",
    concepto:0,
    concepto_cobro:0,
    monto:0.0,
    cuenta:"",
    sucursal:0,
    banco:"",
    descripcion_ciclo_escolar:""

}

let preinscripcion={

        curp:"",
        folioAdmision:"",
        nivel:"",
        estatus:"",

    nombreCarrera:"",
        carrera:0,
        nombre:"",
        a_paterno:"",
        a_materno:"",
        estado:0,
        nombreEstado:"",
        ciudad:"",
        colonia:"",
        calle:"",
        celular:"",
        num_interior:"",
        num_exterior: 0,
        correo_e:"",
        nombreEscuela:"",
        cp:""
}

let alumno = {
    curp: "",
    estado: 0,
    calle: "",
    colonia: "",
    num_exterior: 0,
    num_interior: "",
    cp: "",
    municipio: 0,
    celular: "",
    correo_e: "",
    condonado: "",
    institucion_medica: "",
    discapacidad: 0,
    afrodesendiente: "",
    grupo_indigena: 0,
    hablalengua: 0,
    fecha_registro: "",
    rol: 0,
    escuela_procedencia: 0,
    foto: "",
    estatus: "52",
    nacionalidad:"",
    edo_civil:""

};




const reloadApplication = () => {
    formCompleted= true;
    curp="";
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

const isValidateUrlParams = () => {
    initializeParams();
    const levelsValid = new Set([102, 104]);
    return urlParameters.call!==0 && urlParameters.operation!==0 &&
    levelsValid.has(urlParameters.level);
}

const urlParams = new URLSearchParams(window.location.search);

let urlParameters = {"level":"","call":"","operation":""}; // callforapplication = call = convocatoria

const initializeParams = () =>{
    urlParameters.level =  parseInt("0" + urlParams.get("nivel"));
    urlParameters.call = parseInt("0" + urlParams.get("convocatoria"));
    urlParameters.operation = parseInt("0" + urlParams.get("operacion"));
}

const loadAspirantFromAPI =  (curp) => {
    const url = `/api/v1/aspirantes/${curp}`;
    
    return $.ajax({
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
}


const getBirthDateFromCurp = (curp) => {
    let year = parseInt(curp.substring(4, 6));
    const month = curp.substring(6, 8);
    const day = curp.substring(8,10);

    if ("0123456789".indexOf(curp.charAt(16))>=0) {
        year =  1900 + year;
    } else {
        year =  2000 + year;
    }
    return `${year}-${month}-${day}`;
}

const isValidCurp = (curp) => {
    const curpPattern = "[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}" +
        "(?:AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
        "[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$";

    return (curp.length === 18 && curp.match(curpPattern));
}

const showMessageEmailExist =  () => {
    const messageFeedback ="El correo ya se encuentra registrado. No puede duplicarse";
    $("#email-feedback").text(messageFeedback);
    $("#email-confirm-feedback").text(messageFeedback);
    $('#correoValidacion, #correoElectronico').addClass('is-invalid');
}

const showMessageEmailNotMatch = () => {
    $("#email-feedback").text("No coinciden los correos");
    $("#email-confirm-feedback").text("No coinciden los correos");
    $('#correoValidacion, #correoElectronico').addClass('is-invalid');
}

const refreshStatus= (status) => {
    //--- here will show the status process
}


const imageUrlToBase64= (url) =>  {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(url);
            let blob = await response.blob();
            let reader = new FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            reject(error);
        }
    });
}

const checkEmailExist = async (curp, emailConfirm) => {
    try {
        const response = await $.ajax({
            url: '/api/v1/aspirantes/email-already-exists/' + curp + "/" + encodeURIComponent(emailConfirm),
            type: 'GET'
        });
        return  response.success;
    } catch (error) {
        console.error('Error al verificar el email:', error);
        return  false;
    }
};

//------------------------------------------------------------
//--- Utils for load resource
//------------------------------------------------------------
const loadPage = (url, destination, callback) => {
    const target = document.getElementById(destination);
    fetch(url)
        .then(response => response.text())
        .then(html => {
            target.innerHTML = html;
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

const loadScript = (url, id ) => {
    let script = document.createElement("script");
    script.src = url;
    script.id = id;
    const existingScript = document.querySelector('script[src="' + url + '"]');
    if (existingScript) {
        console.log(`Removing script ${script}...`);
        existingScript.parentNode.removeChild(existingScript);
    }
    document.body.appendChild(script);
}



// Guardar una referencia al fetch original
const originalFetch = fetch;

const showTicketContainer = () => {
    const ticketContainer = "<div class=\"embed-responsive embed-responsive-1by1\">\n" +
        "    <iframe id=\"pdfPreviewTicket\" width=\"100%\" height=\"600px\" class=\"embed-responsive-item\" allowfullscreen ></iframe>\n" +
        "</div>";
    $("#content").html (ticketContainer);
}

const showCredentialContainer = () => {
    const credentialContainer = "<div class=\"embed-responsive embed-responsive-1by1\">\n" +
        "    <iframe id=\"pdfPreviewCredential\" width=\"100%\" height=\"600px\" class=\"embed-responsive-item\" allowfullscreen ></iframe>\n" +
        "</div>";
    $("#content").html (credentialContainer);
}