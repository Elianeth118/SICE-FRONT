/*
	download the face-detection cascade
*/
var facefinder_classify_region = function(r, c, s, pixels, ldim) {
    return -1.0;
  };

const cascadeurl =
    "https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder";
  fetch(cascadeurl).then(function(response) {
    response.arrayBuffer().then(function(buffer) {
      var bytes = new Int8Array(buffer);
      facefinder_classify_region = pico.unpack_cascade(bytes);
    });
  });


  /*
      a function to transform an RGBA image to grayscale
  */
function rgba_to_grayscale(rgba, nrows, ncols) {
    let gray = new Uint8Array(nrows * ncols);
    for (let r = 0; r < nrows; ++r)
      for (let c = 0; c < ncols; ++c)
        // gray = 0.2*red + 0.7*green + 0.1*blue
        gray[r * ncols + c] =
          (2 * rgba[r * 4 * ncols + 4 * c + 0] +
            7 * rgba[r * 4 * ncols + 4 * c + 1] +
            1 * rgba[r * 4 * ncols + 4 * c + 2]) /
          10;
    return gray;
  }
  /*
      this function is called each time you press the button to detect the faces
  */
  function hasContainHumanFace() {
    const canvas = document.createElement('canvas');
    canvas.id = "canvas";
    canvas.width = 360;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    
    let img = document.getElementById("photoHidden");
    
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
    // ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    const rgba = ctx.getImageData(0, 0, 480, 360).data;
    // prepare input to `run_cascade`
    let image = {
      pixels: rgba_to_grayscale(rgba, 360, 480),
      nrows: 360,
      ncols: 480,
      ldim: 480
    };
    params = {
      shiftfactor: 0.1, // move the detection window by 10% of its size
      minsize: 20, // minimum size of a face (not suitable for real-time detection, set it to 100 in that case)
      maxsize: 1000, // maximum size of a face
      scalefactor: 1.1 // for multiscale processing: resize the detection window by 10% when moving to the higher scale
    };
    // run the cascade over the image
    // dets is an array that contains (r, c, s, q) quadruplets
    // (representing row, column, scale and detection score)
    let dets = pico.run_cascade(image, facefinder_classify_region, params);
    // cluster the obtained detections
    dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
    // draw results
    qthresh = 5.0; // this constant is empirical: other cascades might require a different one
    let hasFace = false;
    for (i = 0; i < dets.length; ++i)
      // check the detection score
      // if it's above the threshold, draw it
      if (dets[i][3] > qthresh) {
        hasFace =  true;
        ctx.beginPath();
        ctx.arc(dets[i][1], dets[i][0], dets[i][2] / 2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
    return (hasFace);
  }

//--- ==================================================
const  analyzeImage = () =>{
    if (!hasContainHumanFace()){
        alert ("No se encontró rostro humano. Elija otra foto");
    } else {
        convertImageToBlob();
    }
}
  
function face(evt) {

    const file = evt.target.files[0];
    const img = document.getElementById("photoHidden");
    if (file.type.match("image.*")) {
        const reader = new FileReader();
        //--- Read in the image file as a data URL.
        reader.readAsDataURL(file);
        
        reader.onload = function(evt) {
          if (evt.target.readyState === FileReader.DONE) {
            img.src = evt.target.result;
            document.getElementById("photo").src = evt.target.result;
  
          }
        };
        const maxWidth = 480;
        const maxHeight = 640;
        const minWidth = 150;
        const minHeight = 160;
        
        img.onload = function() {
            const width = img.width;
            const height = img.height;
            if (width > maxWidth || height > maxHeight) {
                scaleImage(document.getElementById("photoHidden"),480);
            } else if (width < minWidth || height < minHeight){
                alert(`Las dimensiones de la imagen son demasiado pequeños. Las dimensiones mínimas permitidas son ${minWidth}x${minHeight}px.`);
                resetUpload();
            }
        };
      
    }else {
        alert("Debe seleccionar una imagen por favor");
    }
  }

const  resetUpload = () => {
    document.getElementById("photoHidden").src='assets/images/user_add.png';
    document.getElementById("photo").src='assets/images/user_add.png';
    document.getElementById("file-photo").value='';
}

const  scaleImage = (img = document.getElementById("photoHidden") , newWidth) => {
    
    if (img==null) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    
    const aspectRatio = originalHeight / originalWidth;
    const newHeight = newWidth * aspectRatio;
    
    //--- establecer  dimension canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Dibujar la imagen en el canvas
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    // Convertir el contenido del canvas a una URL de datos y mostrarla en la imagen escalada
    const scaledDataUrl = canvas.toDataURL('image/jpeg');

    document.getElementById("photoHidden").src = scaledDataUrl;
    document.getElementById("photo").src = scaledDataUrl;
    document.getElementById("photo").style.display = 'block';

    canvas.style.display = 'none';
}

const loadData = () => {
      const folio = sessionStorage.getItem("fua") | "0"
    $.ajax({
        url: `/api/v1/admision/boleta/${admissionData.curp}/${folio}/${urlParameters.level}`,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.success && response.data.length >0 ) {
                const data = response.data[0];
                $("#nombre").val(data.nombre + "  " + data.a_paterno + "  " + data.a_materno);
                $("#curp").val(data.curp);
                $("#fua").val(data.folioadmision.toString());
                $("#carrera").val(data.carrera);
                $("#escuela").val(data.escuela);
                fetch(`/photos/${data.curp}.jpg?` + new Date().getTime(), { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        $('#photo').attr('src', `/photos/${data.curp}.jpg?` +  new Date().getTime());
                        $('#photoHidden').attr('src', `/photos/${data.curp}.jpg?` + new Date().getTime());
                    } else {
                        loadImageDefault();
                    }
                })
                .catch(error => {
                    loadImageDefault();
                });
            } else {
                alert(response.message);
                redirectToAdmission();
            }
        },
        error: function (xhr, status, error) {
          //console.error(error);
        }
    });
}

function loadImageDefault(){
    $('#photo').attr('src', '/assets/images/user_add.png');
    $('#photoHidden').attr('src', '/assets/images/user_add.png');
}