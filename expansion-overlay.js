class ExpansionOverlay extends HTMLElement {

  /** string, Opciones posibles: 'left' (default) | 'middle' | 'right'. Indica donde se alineará el expansion-overlay en el eje X, por ejemplo si se alinea 'left' el expansion-overlay se pegará a la izquierda y si necesita más espacio crecerá hacia la derecha. */
  horizontalAlign = 'left';
  /** string, Opciones posibles: 'top' | 'bottom' (default). Indica donde se alineará el expansion-overlay en el eje Y, por ejemplo si se alinea 'top' el expansion-overlay se colocará por encima del objeto y la animación de expandirse será de abajo hacia arriba. */
  verticalAlign = 'bottom';
  /** string, Id de HTMLElement. Id del item desde donde se despliega el expansion-overlay */
  expandFromItem = '';
  /** string, Id de HTMLElement. Id del item que aparecerá en el expansion-overlay */
  componentToExpand = '';
  /** string, Id de HTMLElement. Id del item que causa la expasión, suele ser un botón. A este HTMLElement se le añade un addEventListener 'click'. */
  expandTrigger = '';
  /** boolean, Opciones posibles: 'true' (default) | 'false'. Indica si el width del expansion-overlay será igual que el width del HTMLElement de expandFromItem */
  inheritParentWidth = true;
  /** string, valores posibles: '350px' | '150em' | '50%' | '200vw'. Indica un width específico para el expansion-overlay (si el parametro inheritParentWidth está 'true' este parametro se ignora). */
  customWidth = '';

  constructor() {
    super();
    /**
     * Adjuntar un Shadow DOM.
     * El modo open desactiva el encapsulamiento del shadow dom, de esta manera se puede acceder al html y css de este componente desde fuera (es decir, puedo editar el css de este componente desde un componente externo).
     * El modo close activa el encapsulamiento del shadow dom, inhabilitando el acceso al html y css desde un componente externo.
    */
    this.attachShadow({ mode: 'open' });
    this.loadTemplates();
  }

  async loadTemplates() {
    // Cargar el HTML y CSS
    const [templateContent, cssContent] = await Promise.all([
      this.loadTemplate(),
      this.loadCSS()
    ]);

    // Adjuntar el contenido del template al Shadow DOM
    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Crear un elemento <style> para agregar el CSS y adjuntarlo al Shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;
    this.shadowRoot.appendChild(styleElement);

    this.createOverlay();
  }

  // Función para cargar el template HTML
  async loadTemplate() {
    const response = await fetch('assets/expansion-overlay/expansion-overlay.html');
    const templateText = await response.text();

    const template = document.createElement('template');
    template.innerHTML = templateText;

    return template.content;
  }

  // Función para cargar el CSS
  async loadCSS() {
    const response = await fetch('assets/expansion-overlay/expansion-overlay.css');
    return await response.text();
  }

  createOverlay() {
    const originalElement = document.getElementById("password-composition"); // Obtenemos el elemento al que le vamos a crear el padre // todo - por parametro
    const newParent = document.createElement('div'); // Creamos el elemento padre: overlay-container, el responsable de la animación de despliegue
    newParent.id = 'overlayContainer';
    newParent.style.cssText = `
      position: absolute;
      bottom: 100%; /* El contenido está inicialmente por encima del encabezado */
      width: 100%;
      max-height: 0;
      overflow: hidden;
      padding: 0 15px;
      background-color: #f9f9f9;
      transition: max-height 0.3s ease-out;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* Sombras hacia arriba */
      border-top: 1px solid #ddd; /* Separador del contenido */

      height: 140px;
      bottom: 200px;
      /* max-height: 100px; */
      z-index: 10000;
      width: 350px;
      left: 0%;
    `; // todo - revisar estructura

    const originalElementParent = originalElement.parentNode; // Accedemos al padre original del elemento al que le vamos a crear el padre
    // set the wrapper as child (instead of the element) (Basicamente eliminamos el elemento original y lo sustitumos por el que va a ser su padre)
    originalElementParent.replaceChild(newParent, originalElement); // Sustituimos el elemento original por nuestro elemento padre recién creado
    // set element as child of wrapper
    newParent.appendChild(originalElement); // A nuestro elemento padre le añadimos el elemento original como hijo

    this.manageVisibility();
  }

  /**
   * Muestra - oculta el backdrop y el overlay
   */
  manageVisibility() {
    const backdrop = document.querySelector("expansion-overlay").shadowRoot.getElementById('backdrop'); // Buscamos en expansion-overlay para obtener el DOM de este componente
    // El usuario hace click en el backdrop
    backdrop.addEventListener('click', function () {
      const overlayMaxHeight = document.getElementById('overlayContainer').style.maxHeight;
      document.getElementById('overlayContainer').style.maxHeight = overlayMaxHeight == '0px' ? '200px' : '0px'; // Despliega - oculta el overlay
      console.log(document.getElementById('overlayContainer').style.maxHeight);
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });

    // El usuario hace click en el botón del componente externo
    document.getElementById('click-trigger').addEventListener('click', function () {
      const overlayMaxHeight = document.getElementById('overlayContainer').style.maxHeight;
      document.getElementById('overlayContainer').style.maxHeight = overlayMaxHeight == '0px' ? '200px' : '0px'; // Despliega - oculta el overlay
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });
  }

  /**
   * Ciclo de vida del webcomponent. Se ejecuta al crearse un elemento del componente.
   */
  connectedCallback() {

  }

  /**
   * horizontal-align (string - left, middle, right)
   * vertical-align (string - top, bottom) (¿¿Se deberia hacer un calculo antes para ver si se podrá visualizar correctamente??)
   * expandFromItem (string - con el id del item desde donde se despliega el expansion-overlay)
   * componentToExpand (string - con el id del item que aparecerá en el expansion-overlay)
   * expandTrigger (string - con el id del item que causa la expasión, suele ser un botón)
   * inheritParentWidth (boolean - falso por defecto - indica si el expansion-overlay tendrá el width del padre)
   * customWidth (string - ej: '350px' - indica el width del expansion-overlay, si inheritParentWidth este parametro se ignora)
   */

  /**
   * Ciclo de vida del webcomponent. Es el método que crea el observable, aquí se determina que las propiedades (@Input) que tendra el webcomponent.
   */
  static get observedAttributes() {
    return ['horizontal-align', 'vertical-align', 'expand-from-item', 'component-to-expand', 'expand-trigger', 'inherit-parent-width', 'custom-width'];
  }

  /**
   * Ciclo de vida del webcomponent. Es el método que obtiene los datos del observable, se activa cuando la propiedad tiene un nuevo valor.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Es el mismo valor, no hace falta renderizar el cambio.
    if (oldValue === newValue) {
      return;
    }

    console.log('attributeChangedCallback');
    if (name === 'horizontal-align') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'vertical-align') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'expand-from-item') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'component-to-expand') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'expand-trigger') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'inherit-parent-width') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }

    if (name === 'custom-width') {
      console.log(`attributeChangedCallback ${name} - ${oldValue} - ${newValue}`);
      return;
    }
  }
}

// Registrar el Custom Element
customElements.define('expansion-overlay', ExpansionOverlay);
