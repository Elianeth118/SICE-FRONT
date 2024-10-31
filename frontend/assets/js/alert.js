
const customAlert = (msg, icon = "") => {
    let alert_message = document.getElementById('alert-message');
    alert_message.textContent = String(msg);
    let alert_icon = document.getElementById('alert-icon');
    alert_icon.innerHTML = icon;
    
    let me = document.getElementById('alertWindow');
    let alertModal = new bootstrap.Modal(me, {
        keyboard: false,
        backdrop: 'static'
    });
    alertModal.show();
}

(function(proxied) {
    window.alert = function() {
        return proxied.apply(this, arguments);
    };
})(customAlert);
