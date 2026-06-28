/* =====================================================
   SMILEKIT — LANDING DE PRODUCTO ÚNICO
   Lógica: WhatsApp dinámico + checkout simple
   ===================================================== */

/* =========== 1. CONFIGURACIÓN EDITABLE =========== */
const CONFIG = {
  // Número de WhatsApp SIN signos ni espacios, con código de país.
  // Ejemplo Colombia: "573001234567"
  whatsappNumber: "573001234567",

  // Nombre de la empresa / marca (se usa en el mensaje de WhatsApp)
  nombreEmpresa: "SmileKit",

  // Nombre del producto que se vende
  nombreProducto: "SmileKit Blanqueador Dental",

  // Precio unitario en número (sin puntos ni símbolos)
  precioUnitario: 89900,

  // Símbolo / formato de moneda mostrado en pantalla
  moneda: "$",

  // Mensaje que se abre al tocar el botón flotante de WhatsApp (sin pedido)
  mensajeFlotante: "Hola, quiero más información sobre SmileKit 🦷✨"
};

/* =========== 2. UTILIDADES =========== */
function formatearPrecio(valor) {
  return CONFIG.moneda + valor.toLocaleString("es-CO");
}

function construirLinkWhatsapp(mensaje) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${texto}`;
}

/* bindClick / bindHref: si el elemento no existe en el HTML, se avisa en  */
/* consola pero el resto del script sigue funcionando con normalidad.     */
function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", handler);
  } else {
    console.warn(`[SmileKit] No se encontró el elemento #${id} (revisa el HTML).`);
  }
}

function bindHref(id, url) {
  const el = document.getElementById(id);
  if (el) {
    el.href = url;
  } else {
    console.warn(`[SmileKit] No se encontró el elemento #${id} (revisa el HTML).`);
  }
}

/* =========== 2.1 MODAL DE POLÍTICAS DE ENVÍO Y DEVOLUCIONES =========== */
function openPolicies() {
  const modal = document.getElementById("policies-modal");
  const overlay = document.getElementById("policies-overlay");
  if (modal) modal.classList.add("active");
  if (overlay) overlay.classList.add("active");
}
function closePolicies() {
  const modal = document.getElementById("policies-modal");
  const overlay = document.getElementById("policies-overlay");
  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

/* =========== 3. INICIALIZACIÓN =========== */
document.addEventListener("DOMContentLoaded", () => {

  bindHref("float-whatsapp", construirLinkWhatsapp(CONFIG.mensajeFlotante));

  bindClick("open-policies", openPolicies);
  bindClick("close-policies", closePolicies);
  bindClick("policies-overlay", closePolicies);

  /* =========== 4. CHECKOUT: CANTIDAD Y TOTAL =========== */
  const cantidadInput = document.getElementById("cantidad");
  const totalEl = document.getElementById("checkout-total");
  const btnMinus = document.getElementById("qty-minus");
  const btnPlus = document.getElementById("qty-plus");

  function actualizarTotal() {
    if (!cantidadInput || !totalEl) return;
    const cantidad = parseInt(cantidadInput.value, 10) || 1;
    const total = cantidad * CONFIG.precioUnitario;
    totalEl.textContent = formatearPrecio(total);
  }

  if (btnMinus && btnPlus && cantidadInput) {
    btnMinus.addEventListener("click", () => {
      let val = parseInt(cantidadInput.value, 10) || 1;
      if (val > 1) val--;
      cantidadInput.value = val;
      actualizarTotal();
    });

    btnPlus.addEventListener("click", () => {
      let val = parseInt(cantidadInput.value, 10) || 1;
      if (val < 10) val++;
      cantidadInput.value = val;
      actualizarTotal();
    });

    actualizarTotal();
  } else {
    console.warn("[SmileKit] No se encontraron todos los controles de cantidad del checkout.");
  }

  /* =========== 5. ENVÍO DEL FORMULARIO A WHATSAPP =========== */
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreEl = document.getElementById("nombre");
      const telefonoEl = document.getElementById("telefono");
      const direccionEl = document.getElementById("direccion");

      const nombre = nombreEl ? nombreEl.value.trim() : "";
      const telefono = telefonoEl ? telefonoEl.value.trim() : "";
      const direccion = direccionEl ? direccionEl.value.trim() : "";
      const cantidad = cantidadInput ? (parseInt(cantidadInput.value, 10) || 1) : 1;
      const total = cantidad * CONFIG.precioUnitario;

      if (!nombre || !telefono || !direccion) {
        alert("Por favor completá todos los campos antes de continuar.");
        return;
      }

      const mensaje =
        `🛒 *Nuevo pedido — ${CONFIG.nombreEmpresa}*\n\n` +
        `*Producto:* ${CONFIG.nombreProducto}\n` +
        `*Cantidad:* ${cantidad}\n` +
        `*Total:* ${formatearPrecio(total)}\n\n` +
        `*Nombre:* ${nombre}\n` +
        `*Teléfono:* ${telefono}\n` +
        `*Dirección de envío:* ${direccion}\n\n` +
        `Quedo a la espera de la confirmación. ¡Gracias!`;

      window.open(construirLinkWhatsapp(mensaje), "_blank");
    });
  } else {
    console.warn("[SmileKit] No se encontró el formulario de checkout.");
  }
});
