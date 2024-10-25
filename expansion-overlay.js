class ExpansionOverlay extends HTMLElement {

  /** Un flag para que no se muestren los mensajes de error de componente sin inicializar */
  loadBeforeAttributesInit = true;
  /** Una promesa que obliga a esperar a que cargen los templates antes de que se creen y modifiquen los atributos del DOM */
  loadTemplatePromise;


  /**
   * VALORES POR DEFECTO
   */
  /** string, Id de HTMLElement. Id del item desde donde se despliega el expansion-overlay */
  expandFromItem = null;
  /** string, Id de HTMLElement. Id del item que aparecerá en el expansion-overlay */
  componentToExpand = null;
  /** string, Id de HTMLElement. Id del item que causa la expasión, suele ser un botón. A este HTMLElement se le añade un addEventListener 'click'. */
  expandTrigger = null;
  /** boolean, Opciones posibles: 'true' | 'false' (default). Indica si expansion-overlay ocultará el border-radius del elemento expandFromItem cuando se despliegue, es solo un cambio estético para que no se vea un borde redondeado y luego el expansion-overlay */
  expandFromItemHideRoundBorder = false;
  /** string, Opciones posibles: 'left' (default) | 'middle' | 'right'. Indica donde se alineará el expansion-overlay en el eje X, por ejemplo si se alinea 'left' el expansion-overlay se pegará a la izquierda y si necesita más espacio crecerá hacia la derecha. */
  horizontalAlign = 'left';
  /** string, Opciones posibles: 'top' | 'bottom' (default). Indica donde se alineará el expansion-overlay en el eje Y, por ejemplo si se alinea 'top' el expansion-overlay se colocará por encima del objeto y la animación de expandirse será de abajo hacia arriba. */
  verticalAlign = 'bottom';
  /** boolean, Opciones posibles: 'true' (default) | 'false'. Indica si el width del expansion-overlay será igual que el width del HTMLElement de expandFromItem */
  inheritParentWidth = true;
  /** string, valores posibles: '350px' | '150em' | '50%' | '200vw'. Indica un width específico para el expansion-overlay (si el parametro inheritParentWidth está 'true' este parametro se ignora). */
  customWidth = '';
  /** boolean, Opciones posibles: 'true' (default) | 'false'. Indica si el height del expansion-overlay será igual que el height del HTMLElement de expandFromItem */
  inheritParentHeight = true;
  /** string, valores posibles: '350px' | '150em' | '50%' | '200vh'. Indica un height específico para el expansion-overlay (si el parametro inheritParentHeight está 'true' este parametro se ignora). */
  customHeight = '';
  /** string, valores posibles: '0.25s' | '250ms'. Indica el tiempo de la animación de despliegue del expansion-overlay. */
  animationDuration = '0.25s';
  /** boolean, Opciones posibles: 'true' (default) | 'false'. Indica si el componente backdrop debe aparecer cuando se despliegue el expansion-overlay. */
  showBackdrop = true;

  constructor() {
    super();
    /**
     * Adjuntar un Shadow DOM.
     * El modo open desactiva el encapsulamiento del shadow dom, de esta manera se puede acceder al html y css de este componente desde fuera (es decir, puedo editar el css de este componente desde un componente externo).
     * El modo close activa el encapsulamiento del shadow dom, inhabilitando el acceso al html y css desde un componente externo.
    */
    this.attachShadow({ mode: 'open' });
    this.loadTemplatePromise = new Promise((resolve) => {
      this.loadTemplates(resolve);
    });
  }

  async loadTemplates(loadTemplateResolve) {
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

    loadTemplateResolve();
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

  /**
   * Ciclo de vida del webcomponent. Se ejecuta al crearse el webcomponent y otra vez cuando se cargan por primera vez todos los atributos del attributeChangedCallback.
   */
  connectedCallback() {
    // Evita que salgan los mensajes de error, ya que este método se ejecuta antes de que lleguen los atributos y después de que lleguen los atributos.
    if (this.loadBeforeAttributesInit) {
      this.loadBeforeAttributesInit = false;
      return;
    }

    if (this.getAttribute('expand-from-item-id') == null && this.getAttribute('expand-from-item-class') == null) {
      console.error('ERROR: Property expand-from-item has not been initialized correctly.');
      return;
    }
    else if (this.getAttribute('expand-from-item-id') != null && this.getAttribute('expand-from-item-class') != null) {
      console.warn('WARNING: Property expand-from-item-id and expand-from-item-class are mutually exclusive, expand-from-item-id will be used by default.');
    }

    if (this.getAttribute('component-to-expand-id') == null && this.getAttribute('component-to-expand-class') == null) {
      console.error('ERROR: Property component-to-expand has not been initialized correctly.');
      return;
    }
    else if (this.getAttribute('component-to-expand-id') != null && this.getAttribute('component-to-expand-class') != null) {
      console.warn('WARNING: Property component-to-expand-id and component-to-expand-class are mutually exclusive, component-to-expand-id will be used by default.');
    }

    if (this.getAttribute('expand-trigger-id') == null && this.getAttribute('expand-trigger-class') == null) {
      console.error('ERROR: Property expand-trigger has not been initialized correctly.');
      return;
    }
    else if (this.getAttribute('expand-trigger-id') != null && this.getAttribute('expand-trigger-class') != null) {
      console.warn('WARNING: Property expand-trigger-id and expand-trigger-class are mutually exclusive, expand-trigger-id will be used by default.');
    }

    // Si el parametro inheritParentWidth es 'true' o no viene (por defecto es 'true') el parámetro custom-width se ignora
    if (this.getAttribute('custom-width') != null && (this.getAttribute('inherit-parent-width') == null || (this.getAttribute('inherit-parent-width') != null && this.getAttribute('inherit-parent-width').toLowerCase() === 'true'))) {
      console.warn('WARNING: Property inherit-parent-width == true and custom-width are mutually exclusive, custom-width will be ignored. Use inherit-parent-width == false to enforce custom-width.');
    }

    // Si el parametro inheritParentHeight es 'true' o no viene (por defecto es 'true') el parámetro custom-height se ignora
    if (this.getAttribute('custom-height') != null && (this.getAttribute('inherit-parent-height') == null || (this.getAttribute('inherit-parent-height') != null && this.getAttribute('inherit-parent-height').toLowerCase() === 'true'))) {
      console.warn('WARNING: Property inherit-parent-height == true and custom-height are mutually exclusive, custom-height will be ignored. Use inherit-parent-height == false to enforce custom-height.');
    }

    this.manageExpansionOverlay();
  }

  /**
   * Ciclo de vida del webcomponent. Es el método que crea el observable, aquí se determina que las propiedades (@Input) que tendra el webcomponent.
   */
  static get observedAttributes() {
    return ['expand-from-item-id', 'expand-from-item-class', 'component-to-expand-id', 'component-to-expand-class', 'expand-trigger-id', 'expand-trigger-class', 'expand-from-item-hide-round-border', 'horizontal-align', 'vertical-align', 'inherit-parent-width', 'custom-width', 'inherit-parent-height', 'custom-height', 'animation-duration', 'show-backdrop'];
  }

  /**
   * Ciclo de vida del webcomponent. Es el método que obtiene los datos del observable, se activa cuando la propiedad tiene un nuevo valor.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Es el mismo valor, no hace falta renderizar el cambio.
    if (oldValue === newValue) {
      return;
    }

    // No viene ningún valor
    if (newValue == undefined || newValue == null) {
      console.error(`ERROR: value can not be null or undefined. Property: ${name} has not been initialized correctly.`);
      return;
    }

    // El valor es un string pero viene vacío
    if ((typeof newValue === 'string' || newValue instanceof String) && (newValue.trim().length == 0)) {
      console.error(`ERROR: string value can not be empty. Property: ${name} has not been initialized correctly.`);
      return;
    }

    if (name === 'horizontal-align') {
      this.horizontalAlign = newValue;
      return;
    }

    if (name === 'vertical-align') {
      this.verticalAlign = newValue;
      return;
    }

    if (name === 'expand-from-item-id' || name === 'expand-from-item-class') {
      this.expandFromItem = newValue;
      return;
    }

    if (name === 'component-to-expand-id' || name === 'component-to-expand-class') {
      this.componentToExpand = newValue;
      return;
    }

    if (name === 'expand-trigger-id' || name === 'expand-trigger-class') {
      this.expandTrigger = newValue;
      return;
    }

    if (name === 'expand-from-item-hide-round-border') {
      this.expandFromItemHideRoundBorder = newValue;
      return;
    }

    if (name === 'inherit-parent-width') {
      this.inheritParentWidth = newValue;
      return;
    }

    if (name === 'custom-width') {
      this.customWidth = newValue;
      return;
    }

    if (name === 'inherit-parent-height') {
      this.inheritParentHeight = newValue;
      return;
    }

    if (name === 'custom-height') {
      this.customHeight = newValue;
      return;
    }

    if (name === 'animation-duration') {
      this.animationDuration = newValue;
      return;
    }

    if (name === 'show-backdrop') {
      this.showBackdrop = newValue;
      return;
    }
  }

  getExpandFromItem() {
    let expandFromItem = null;

    // Obtenemos el elemento mediante ID
    if (this.getAttribute('expand-from-item-id')) {
      expandFromItem = document.getElementById(this.getAttribute('expand-from-item-id'));
      // No se ha encontrado HTMLElement
      if (expandFromItem == null) {
        console.error(`ERROR: Could not find HTMLElement with ID ${this.getAttribute('expand-from-item-id')}`);
        return null;
      }
    }

    // Obtenemos el elemento mediante clase
    else if (this.getAttribute('expand-from-item-class')) {
      expandFromItem = document.getElementsByClassName(this.getAttribute('expand-from-item-class'));
      // No se ha encontrado HTMLElement
      if (expandFromItem == null || expandFromItem.length == 0) {
        console.error(`ERROR: Could not find HTMLElement with class name ${this.getAttribute('expand-from-item-class')}`);
        return null;
      }
      // Se ha encontrado más de un HTMLElement
      if (expandFromItem.length > 1) {
        console.error(`ERROR: Found more than one HTMLElement with class name ${this.getAttribute('expand-from-item-class')}. Be more especific.`);
        return null;
      }
      expandFromItem = expandFromItem.item(0);
    }

    return expandFromItem;
  }

  getComponentToExpand() {
    let componentToExpand = null;

    // Obtenemos el elemento mediante ID
    if (this.getAttribute('component-to-expand-id')) {
      componentToExpand = document.getElementById(this.getAttribute('component-to-expand-id'));
      // No se ha encontrado HTMLElement
      if (componentToExpand == null) {
        console.error(`ERROR: Could not find HTMLElement with ID ${this.getAttribute('component-to-expand-id')}`);
        return null;
      }
    }

    // Obtenemos el elemento mediante clase
    else if (this.getAttribute('component-to-expand-class')) {
      componentToExpand = document.getElementsByClassName(this.getAttribute('component-to-expand-class'));
      // No se ha encontrado HTMLElement
      if (componentToExpand == null || componentToExpand.length == 0) {
        console.error(`ERROR: Could not find HTMLElement with class name ${this.getAttribute('component-to-expand-class')}`);
        return null;
      }
      // Se ha encontrado más de un HTMLElement
      if (componentToExpand.length > 1) {
        console.error(`ERROR: Found more than one HTMLElement with class name ${this.getAttribute('component-to-expand-class')}. Be more especific.`);
        return null;
      }
      componentToExpand = componentToExpand.item(0);
    }

    return componentToExpand;
  }

  getExpandTrigger() {
    let expandTrigger = null;

    // Obtenemos el elemento mediante ID
    if (this.getAttribute('expand-trigger-id')) {
      expandTrigger = document.getElementById(this.getAttribute('expand-trigger-id'));
      // No se ha encontrado HTMLElement
      if (expandTrigger == null) {
        console.error(`ERROR: Could not find HTMLElement with ID ${this.getAttribute('expand-trigger-id')}`);
        return null;
      }
    }

    // Obtenemos el elemento mediante clase
    else if (this.getAttribute('expand-trigger-class')) {
      expandTrigger = document.getElementsByClassName(this.getAttribute('expand-trigger-class'));
      // No se ha encontrado HTMLElement
      if (expandTrigger == null || expandTrigger.length == 0) {
        console.error(`ERROR: Could not find HTMLElement with class name ${this.getAttribute('expand-trigger-class')}`);
        return null;
      }
      // Se ha encontrado más de un HTMLElement
      if (expandTrigger.length > 1) {
        console.error(`ERROR: Found more than one HTMLElement with class name ${this.getAttribute('expand-trigger-class')}. Be more especific.`);
        return null;
      }
      expandTrigger = expandTrigger.item(0);
    }

    return expandTrigger;
  }

  getComponentToExpandWidth() {
    // Existe un customWidth y inheritParentWidth viene a falso
    if (this.getAttribute('custom-width') != null && this.getAttribute('inherit-parent-width') != null && this.getAttribute('inherit-parent-width').toLowerCase() === 'false') {
      return this.getAttribute('custom-width');
    }

    const originalElement = this.getComponentToExpand(); // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    return originalElement.clientWidth;
  }

  getComponentToExpandHeight() {
    // Existe un customHeight y inheritParentHeight viene a falso
    if (this.getAttribute('custom-height') != null && this.getAttribute('inherit-parent-height') != null && this.getAttribute('inherit-parent-height').toLowerCase() === 'false') {
      return this.getAttribute('custom-height');
    }

    const originalElement = this.getComponentToExpand(); // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    return originalElement.clientHeight;
  }

  async manageExpansionOverlay() {
    await this.loadTemplatePromise;

    this.createOverlay();
    this.updateHorizontalAlign();
    this.updateVertialAlign();
  }

  createOverlay() {
    const originalElement = this.getComponentToExpand(); // Obtenemos el elemento al que le vamos a crear el padre
    if (originalElement == null) {
      return;
    }

    const newParent = document.createElement('div'); // Creamos el elemento padre: overlayContainer, el responsable de la animación de despliegue
    newParent.id = 'overlayContainer'; // Siempre va a ser este ID, es obligatorio
    newParent.style.cssText = `
      position: absolute;
      max-height: 0;
      overflow: hidden;
      z-index: 10000;
    `;
    newParent.style.width = `${this.getComponentToExpandWidth()}px`;
    newParent.style.height = `${this.getComponentToExpandHeight()}px`;
    newParent.style.transition = `max-height ${this.getAttribute('animation-duration') ?? this.animationDuration} ease-out`;

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
    if (this.getExpandTrigger() == null) {
      return;
    }

    const backdrop = document.querySelector("expansion-overlay").shadowRoot.getElementById('backdrop'); // Buscamos en expansion-overlay (el html propio del componente) para obtener el DOM de este propio componente
    const showBackdrop = this.getAttribute('show-backdrop') ?? this.showBackdrop;
    // No está habilitado el backdrop, se procede a ocultar
    if ((typeof showBackdrop == "boolean" && !showBackdrop) || (typeof showBackdrop === 'string' && showBackdrop.toLowerCase() === 'false')) {
      backdrop.style.transition = 'unset';
      backdrop.style.visibility = 'hidden';
    }

    // El usuario hace click en el backdrop
    backdrop.addEventListener('click', () => {
      const overlayMaxHeight = document.getElementById('overlayContainer').style.maxHeight;
      document.getElementById('overlayContainer').style.maxHeight = overlayMaxHeight == '0px' ? `${this.getComponentToExpandHeight()}px` : '0px';
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });

    // El usuario hace click en el botón del componente externo
    this.getExpandTrigger().addEventListener('click', () => {
      const overlayMaxHeight = document.getElementById('overlayContainer').style.maxHeight;
      document.getElementById('overlayContainer').style.maxHeight = overlayMaxHeight == '0px' ? `${this.getComponentToExpandHeight()}px` : '0px';
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });
  }

  /**
   * Añade un border-radius al expansion-overlay con los mismos px que tenia el border-radius de expandFromItem.
   * @returns string, Número de px que se tienen que reducir del cálculo de posicionamiento del expansion-overlay para ocultar el border-radius de expandFromItem
   */
  updateRoundBorder() {
    const expandFromItemHideRoundBorder = this.getAttribute('expand-from-item-hide-round-border') ?? this.expandFromItemHideRoundBorder;

    // No está habilitada la opción de ocultado de borde redondeado
    if ((typeof expandFromItemHideRoundBorder == "boolean" && !expandFromItemHideRoundBorder) ||
      (typeof expandFromItemHideRoundBorder === 'string' && this.getAttribute('expand-from-item-hide-round-border').toLowerCase() === 'false')) {
      return 0;
    }

    const verticalAlign = this.getAttribute('vertical-align') ?? this.verticalAlign;
    const computedStyles = window.getComputedStyle(this.getExpandFromItem()); // El componente expandFromItem debe existir aquí obligatoriamente o el código no podría llegar a esta línea

    // El expansion-overlay sale debajo del componente, la animación de expansión es hacia abajo.
    if (verticalAlign == 'top') {
      const borderTopLeftRadius = computedStyles.getPropertyValue('border-top-left-radius').replace('px', '');
      const borderTopRightRadius = computedStyles.getPropertyValue('border-top-right-radius').replace('px', '');
      document.getElementById('overlayContainer').style.borderTopLeftRadius = `${borderTopLeftRadius}px`;
      document.getElementById('overlayContainer').style.borderTopRightRadius = `${borderTopRightRadius}px`;

      // Si ocurre que un border-radius es mayor que el otro coger el de mayor valor. Se divide entre 2 porque el border-radius forma una curva, y solo una mitad sería visible.
      if (borderTopLeftRadius > borderTopRightRadius) {
        return borderBottomLeftRadius / 2;
      }

      if (borderTopRightRadius > borderTopLeftRadius) {
        return borderTopRightRadius / 2;
      }

      return borderTopLeftRadius / 2;
    }

    // El expansion-overlay sale arriba del componente, la animación de expansión es hacia arriba.
    if (verticalAlign == 'bottom') {
      const borderBottomLeftRadius = computedStyles.getPropertyValue('border-bottom-left-radius').replace('px', '');
      const borderBottomRightRadius = computedStyles.getPropertyValue('border-bottom-right-radius').replace('px', '');
      document.getElementById('overlayContainer').style.borderBottomLeftRadius = `${borderBottomLeftRadius}px`;
      document.getElementById('overlayContainer').style.borderBottomRightRadius = `${borderBottomRightRadius}px`;

      // Si ocurre que un border-radius es mayor que el otro coger el de mayor valor. Se divide entre 2 porque el border-radius forma una curva, y solo una mitad sería visible.
      if (borderBottomLeftRadius > borderBottomRightRadius) {
        return borderBottomLeftRadius / 2;
      }

      if (borderBottomRightRadius > borderBottomLeftRadius) {
        return borderBottomRightRadius / 2;
      }

      return borderBottomLeftRadius / 2;
    }

    return 0; // Failsafe return, nunca debería llegar a este return
  }

  /**
   * Actualiza
   */
  updateHorizontalAlign() { // TODO - HACER CALCULO, SI ESTÁ A LEFT POR EJEMPLO PERO NO HAY ESPACIO, PONERLO EN RIGHT Y VICEVERSA. SI ESTÁ EN MIDDLE Y NO HAY ESPACIO CAMBIAR TAMBIÉN. PERO SI CON LEFT POR EJEMPLO NO HAY ESPACIO NUNCA PONER MIDDLE. MIDDLE ES SOLO MANUAL.
    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    const horizontalAlign = this.getAttribute('horizontal-align') ?? this.horizontalAlign;
    if (horizontalAlign == 'left') {
      document.getElementById('overlayContainer').style.left = `${expandFromItem.offsetLeft}px`;
      return;
    }

    if (horizontalAlign == 'right') {
      const offsetRight = window.innerWidth - expandFromItem.offsetLeft - expandFromItem.offsetWidth;
      document.getElementById('overlayContainer').style.right = `${offsetRight}px`;
      return;
    }

    if (horizontalAlign == 'middle') {
      const offsetMiddle = (expandFromItem.clientWidth / 2) - (document.getElementById('overlayContainer').clientWidth / 2);
      document.getElementById('overlayContainer').style.left = `${expandFromItem.offsetLeft + offsetMiddle}px`;
      return;
    }
  }

  updateVertialAlign() { // TODO - HACER CALCULO, SI ESTÁ A TOP POR EJEMPLO PERO NO HAY ESPACIO, PONERLO EN BOTTOM Y VICEVERSA.
    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    const borderRadiusValue = this.updateRoundBorder();

    const verticalAlign = this.getAttribute('vertical-align') ?? this.verticalAlign;
    // El expansion-overlay sale debajo del componente, la animación de expansión es hacia abajo.
    if (verticalAlign == 'top') {
      const offsetTop = window.innerHeight - expandFromItem.offsetTop - borderRadiusValue;
      document.getElementById('overlayContainer').style.bottom = `${offsetTop}px`;
      return;
    }

    // El expansion-overlay sale arriba del componente, la animación de expansión es hacia arriba.
    if (verticalAlign == 'bottom') {
      console.log(expandFromItem.offsetTop);
      console.log(expandFromItem.clientHeight);
      console.log(borderRadiusValue);
      const offsetBottom = expandFromItem.offsetTop + expandFromItem.clientHeight - borderRadiusValue;
      console.log(offsetBottom);
      document.getElementById('overlayContainer').style.top = `${offsetBottom}px`;
      return;
    }
  }
}

// Registrar el Custom Element
customElements.define('expansion-overlay', ExpansionOverlay);