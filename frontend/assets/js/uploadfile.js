const  convertImageToBlob = () => {
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = document.getElementById("photoHidden").width;
    canvas.height = document.getElementById("photoHidden").height;
    
    // Draw the image on the canvas
    ctx.drawImage(document.getElementById("photoHidden"), 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
        //--- Create a FormData object
        const formData = new FormData();
        formData.append('photo', blob, `${curp}.jpg`);
        
        //--- Send the resized image to the server
        uploadFile(formData);
    }, 'image/jpeg');
    
}

const  uploadFile= (formData) => {
    const code = sessionStorage.getItem("code");
    document.getElementById('progress-bar').value = 0;
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', `/api/v1/admision/upload-photo/${curp}/${code}/${urlParameters.call}`, true);
    
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            document.getElementById('progress-bar').value = percentComplete;
            document.getElementById('status').innerText = `Enviando: ${percentComplete.toFixed(0)}%`;
        }
    });
    
    xhr.onreadystatechange = function() {
        const DONE = 4;
        const OK = 200;
        const ENTITY_TOO_LARGE = 413;
        
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                alert('Archivo enviado correctamente!');
            } else if (xhr.status === ENTITY_TOO_LARGE) {
                alert('El archivo es demasiado grande. ¡Por favor, intenta con un archivo más pequeño!');
            } else {
                alert('Falló el envío del archivo');
            }
        }
    };
    
    xhr.send(formData);
}