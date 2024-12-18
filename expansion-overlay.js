class ExpansionOverlay extends HTMLElement {

  /** Una promesa que obliga a esperar a que cargen los templates antes de que se creen y modifiquen los atributos del DOM */
  loadTemplatePromise;
  /** HTMLElement. Elemento que aparecerá en el expansion-overlay con la animación de despliegue. */
  componentToExpand = null;

  /**
   * VALORES POR DEFECTO DE LOS INPUTS DEL COMPONENTE (NO SE UTILIZAN EN EL CÓDIGO, SOLO SIRVEN COMO READONLY)
   */
  /** Tipo string. Id de HTMLElement. Id del item desde donde se despliega el expansion-overlay. */
  expandFromItem = null;
  /** Tipo string. Id de HTMLElement. Id del item que causa la expansión, suele ser un botón. A este HTMLElement se le añade un addEventListener 'click'. */
  expandTrigger = null;
  /** Tipo boolean. Opciones posibles: 'true' | 'false' (default). Indica si expansion-overlay ocultará el border-radius del elemento expandFromItem cuando se despliegue, es solo un cambio estético para que no se vea un borde redondeado y luego el expansion-overlay. */
  expandFromItemHideRoundBorder = false;
  /** Tipo string. Opciones posibles: 'left' (default) | 'middle' | 'right'. Indica donde se alineará el expansion-overlay en el eje X, por ejemplo si se alinea 'left' el expansion-overlay se pegará a la izquierda y si necesita más espacio crecerá hacia la derecha. */
  horizontalAlign = 'left';
  /** Tipo boolean. Opciones posibles: 'true' | 'false' (default). Indica el expansion-overlay se ubicará forzosamente en el horizontalAlign seleccionado (aunque no haya espacio para mostrar correctamente el expansion-overlay). Esta opción ignora la función que cambia el horizontalAlign del expansion-overlay si no hay espacio suficiente. */
  forceHorizontalAlign = false;
  /** Tipo string. Opciones posibles: 'top' | 'bottom' (default). Indica donde se alineará el expansion-overlay en el eje Y, por ejemplo si se alinea 'top' el expansion-overlay se colocará por encima del objeto y la animación de expandirse será de abajo hacia arriba. */
  verticalAlign = 'bottom';
  /** Tipo boolean. Opciones posibles: 'true' | 'false' (default). Indica el expansion-overlay se ubicará forzosamente en el verticalAlign seleccionado (aunque no haya espacio para mostrar correctamente el expansion-overlay). Esta opción ignora la función que cambia el verticalAlign del expansion-overlay si no hay espacio suficiente. */
  forceVerticalAlign = false;
  /** Tipo boolean. Opciones posibles: 'true' (default) | 'false'. Indica si el width del expansion-overlay será igual que el width del HTMLElement de expandFromItem. */
  inheritParentWidth = true;
  /** Tipo string. Valores posibles: '350px' | '150em' | '50%' | '200vw'. Indica un width específico para el expansion-overlay (si el parametro inheritParentWidth está 'true' este parametro se ignora). */
  customWidth = '';
  /** Tipo boolean. Opciones posibles: 'true' (default) | 'false'. Indica si el height del expansion-overlay será igual que el height del HTMLElement de expandFromItem. */
  inheritParentHeight = true;
  /** Tipo string. Valores posibles: '350px' | '150em' | '50%' | '200vh'. Indica un height específico para el expansion-overlay (si el parametro inheritParentHeight está 'true' este parametro se ignora). */
  customHeight = '';
  /** Tipo string. Valores posibles: '0.25s' | '250ms'. Indica el tiempo de la animación de despliegue del expansion-overlay. */
  animationDuration = '0.25s';
  /** Tipo boolean. Opciones posibles: 'true' (default) | 'false'. Indica si el componente backdrop debe aparecer cuando se despliegue el expansion-overlay. */
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

  /**
   * Carga los archivos de HTML y CSS del custom-web-component.
   * @param {any} loadTemplateResolve Parámetro resolve que termina la promesa que obliga a esperar a que cargen los templates antes de que se creen y modifiquen los atributos del DOM.
   */
  async loadTemplates(loadTemplateResolve) {
    /*
    * Slot hace visible dentro del shadowRoot elementos que se añaden al componente, pero desde fuera del shadowRoot
    * Ejemplo: <expansion-overlay><div>Prueba</div></expansion-overlay> -- Para poder visualizar el div prueba desde el shadowRoot se utiliza slot
    */
    this.shadowRoot.innerHTML = `
      <slot></slot>
      <div id="backdrop"></div>
    `;
    // TODO - probar con el backdrop aqui, si no, poner en el body de la aplicacion

    // Adjuntar el contenido del template de CSS al Shadow DOM
    this.shadowRoot.appendChild(this.loadCSSTemplate());

    loadTemplateResolve(); // Termina la promesa con un resolve
  }

  /**
   * Carga el archivo con el template CSS.
   * @returns {HTMLStyleElement} Devuelve un objeto que contiene el <style> del archivo CSS.
   */
  loadCSSTemplate() {
    const cssContent = `#backdrop${this.overlayContainerId} { width: 100vw; height: 100vh; position: absolute; top: 0px; left: 0px; z-index: 1000; background-color: #121212; /* --ion-background-color */ opacity: 0; visibility: hidden; transition: opacity 0.25s linear, visibility 0.25s linear; } #backdrop${this.overlayContainerId}.activated { /* opacity: 0.32; */ opacity: 0.52; visibility: visible; }`;

    // Crear un elemento <style> para agregar el archivo CSS y adjuntarlo al Shadow DOM
    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;

    return styleElement;
  }

  //#region Ciclo de vida del custom web component
  /**
   * Ciclo de vida del webcomponent. Se ejecuta al crearse el webcomponent y otra vez cuando se cargan por primera vez todos los atributos del attributeChangedCallback.
   */
  connectedCallback() {
    /**
     * ¡IMPORTANTE!
     * Este setTimeout es IMPERATIVO para que el componente funcione, ya que garantiza que el DOM esté listo antes de que el método se ejecute.
     * 
     * The connectedCallback fires on the opening tag, its inner content is not yet parsed.
     * So to make it work when your Custom Element is defined BEFORE being used, you have to delay execution till the Components DOM (innnerText or innerHTML) is parsed.
     * https://stackoverflow.com/questions/68070285/web-component-behaves-differently-depending-on-defer-being-used-or-not
     */
    setTimeout(() => {
      this.manageExpansionOverlay();
    }, 50);
  }

  /**
   * Ciclo de vida del webcomponent. Es el método que crea el observable, aquí se determina que atributos (@Input) tendrá el webcomponent.
   */
  static get observedAttributes() {
    return ['expand-from-item-id', 'expand-from-item-class', 'expand-trigger-id', 'expand-trigger-class', 'expand-from-item-hide-round-border', 'horizontal-align', 'force-horizontal-align', 'vertical-align', 'force-vertical-align', 'inherit-parent-width', 'custom-width', 'inherit-parent-height', 'custom-height', 'animation-duration', 'show-backdrop'];
  }

  /**
   * Ciclo de vida del webcomponent. Es el método que obtiene los datos del observable, se activa cuando el atributo tiene un nuevo valor.
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
  }
  //#endregion

  //#region Getters
  /**
   * Busca en el DOM el objeto HTMLElement por el #ID o .Class propocionado en el atributo expand-from-item.
   * Si encuentra más de un objeto HTMLElement al buscar por .Class devuelve un error.
   * @returns {Element | null} Devuelve el objeto HTMLElement del atributo expand-from-item.
   */
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

  /**
   * Busca en el DOM el objeto HTMLElement por el #ID o .Class propocionado en el atributo expand-trigger.
   * Si encuentra más de un objeto HTMLElement al buscar por .Class devuelve un error.
   * @returns {Element | null} Devuelve el objeto HTMLElement del atributo expand-trigger.
   */
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

  /**
   * Busca en el DOM del shadowRoot el objeto HTMLElement overlayContainer.
   * @returns {HTMLElement | null} Devuelve el objeto HTMLElement overlayContainer del shadowRoot.
   */
  getOverlayContainer() {
    return this.shadowRoot.getElementById('overlayContainer');
  }

  /**
   * Obtiene el width total del elemento ExpandFromItem (incluido paddings)
   * @returns {number} Valor de width que debe tener el expansion-overlay
   */
  getExpandFromItemWidth() {
    // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    const computedStyle = window.getComputedStyle(this.getExpandFromItem()); // shadowRoot en sí no tiene el método getComputedStyle. Este método pertenece al objeto global window y se utiliza para obtener los estilos calculados de un elemento DOM, independientemente de si está dentro de un shadowRoot o no.
    return parseFloat(computedStyle.width) + parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + parseFloat(computedStyle.borderLeft) + parseFloat(computedStyle.borderRight);
  }

  /**
   * Obtiene el height total del elemento ExpandFromItem (incluido paddings)
   * @returns {number} Valor de height que debe tener el expansion-overlay
   */
  getExpandFromItemHeight() {
    // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    const computedStyle = window.getComputedStyle(this.getExpandFromItem()); // shadowRoot en sí no tiene el método getComputedStyle. Este método pertenece al objeto global window y se utiliza para obtener los estilos calculados de un elemento DOM, independientemente de si está dentro de un shadowRoot o no.
    return parseFloat(computedStyle.height) + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + parseFloat(computedStyle.borderTop) + parseFloat(computedStyle.borderBottom);
  }

  /**
   * Obtiene el width total del elemento ComponentToExpand (incluido paddings) siempre que el atributo inherit-parent-width no venga (valor por defecto: true) o venga a true. En caso contrario establece el valor del atributo custom-width como el width del expansion-overlay.
   * @returns {number} Valor de width que debe tener el expansion-overlay
   */
  getComponentToExpandWidth() {
    // Existe un customWidth y inheritParentWidth viene a falso
    if (this.getAttribute('custom-width') != null && this.getAttribute('inherit-parent-width') != null && this.getAttribute('inherit-parent-width').toLowerCase() === 'false') {
      return +this.getAttribute('custom-width');
    }

    // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    const computedStyle = window.getComputedStyle(this.componentToExpand); // shadowRoot en sí no tiene el método getComputedStyle. Este método pertenece al objeto global window y se utiliza para obtener los estilos calculados de un elemento DOM, independientemente de si está dentro de un shadowRoot o no.
    return parseFloat(computedStyle.width) + parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + parseFloat(computedStyle.borderLeft) + parseFloat(computedStyle.borderRight);
  }

  /**
   * Obtiene el height total del elemento ComponentToExpand (incluido paddings) siempre que el atributo inherit-parent-height no venga (valor por defecto: true) o venga a true. En caso contrario establece el valor del atributo custom-height como el height del expansion-overlay.
   * @returns {number} Valor de height que debe tener el expansion-overlay
   */
  getComponentToExpandHeight() {
    // Existe un customHeight y inheritParentHeight viene a falso
    if (this.getAttribute('custom-height') != null && this.getAttribute('inherit-parent-height') != null && this.getAttribute('inherit-parent-height').toLowerCase() === 'false') {
      return +this.getAttribute('custom-height');
    }

    // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    const computedStyle = window.getComputedStyle(this.componentToExpand); // shadowRoot en sí no tiene el método getComputedStyle. Este método pertenece al objeto global window y se utiliza para obtener los estilos calculados de un elemento DOM, independientemente de si está dentro de un shadowRoot o no.
    return parseFloat(computedStyle.height) + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + parseFloat(computedStyle.borderTop) + parseFloat(computedStyle.borderBottom);
  }

  /**
   * 
   * @returns {Promise<number>}
   */
  async getScrollPosition() {
    // Acceder al ion-content y obtener el elemento de desplazamiento
    const ionContent = document.querySelector('ion-content');
    const scrollElement = await ionContent.getScrollElement();
    
    // Obtener la posición actual del scroll
    return scrollElement.scrollTop;
  }
  //#endregion

  /**
   * Comprueba que parámetros han sido recibidos.
   * @returns {boolean} Indica si se han recibido los parámetros obligatorios
   */
  manageAttributeAvailability() {
    // Muestra un mensaje error cuando el atributo de input expand-from-item-id venga con algun valor distinto de null
    if (this.getAttribute('expand-from-item-id') == null && this.getAttribute('expand-from-item-class') == null) {
      console.error('ERROR: Property expand-from-item has not been initialized correctly.');
      return false;
    }
    // Muestra un mensaje advertencia e ignora el atributo de input expand-from-item-class cuando los atributos de input expand-from-item-id y expand-from-item-class vengan los dos con valor
    else if (this.getAttribute('expand-from-item-id') != null && this.getAttribute('expand-from-item-class') != null) {
      console.warn('WARNING: Property expand-from-item-id and expand-from-item-class are mutually exclusive, expand-from-item-id will be used by default.');
    }

    // Muestra un mensaje error cuando el atributo de input expand-trigger-id venga con algun valor distinto de null
    if (this.getAttribute('expand-trigger-id') == null && this.getAttribute('expand-trigger-class') == null) {
      console.error('ERROR: Property expand-trigger has not been initialized correctly.');
      return false;
    }
    // Muestra un mensaje advertencia e ignora el atributo de input expand-trigger-class cuando los atributos de input expand-trigger-id y expand-trigger-class vengan los dos con valor
    else if (this.getAttribute('expand-trigger-id') != null && this.getAttribute('expand-trigger-class') != null) {
      console.warn('WARNING: Property expand-trigger-id and expand-trigger-class are mutually exclusive, expand-trigger-id will be used by default.');
    }

    // Muestra un mensaje advertencia e ignora el atributo de input custom-width cuando el atributo de input inherit-parent-width es 'true' o no viene (su valor por defecto es 'true')
    if (this.getAttribute('custom-width') != null && (this.getAttribute('inherit-parent-width') == null || (this.getAttribute('inherit-parent-width') != null && this.getAttribute('inherit-parent-width').toLowerCase() === 'true'))) {
      console.warn('WARNING: Property inherit-parent-width == true and custom-width are mutually exclusive, custom-width will be ignored. Use inherit-parent-width == false to enforce custom-width.');
    }

    // Muestra un mensaje advertencia e ignora el atributo de input custom-height cuando el atributo de input inherit-parent-height es 'true' o no viene (su valor por defecto es 'true')
    if (this.getAttribute('custom-height') != null && (this.getAttribute('inherit-parent-height') == null || (this.getAttribute('inherit-parent-height') != null && this.getAttribute('inherit-parent-height').toLowerCase() === 'true'))) {
      console.warn('WARNING: Property inherit-parent-height == true and custom-height are mutually exclusive, custom-height will be ignored. Use inherit-parent-height == false to enforce custom-height.');
    }

    return true;
  }

  /**
   * Método asíncrono que espera a que se resuelva la promesa (loadTemplatePromise) que obliga a esperar a que cargen los templates antes de que se creen y modifiquen los atributos del DOM.
   * 
   * Al terminar la promesa llama a los métodos para crear el expansion-overlay y establecer su ubicación.
   */
  async manageExpansionOverlay() {
    await this.loadTemplatePromise;

    // Comprueba si existen los parámetros para crear el elemento overlayContainer.
    if (!this.manageAttributeAvailability()) {
      return;
    }

    // Comprueba si el elemento overlayContainer ya ha sido creado anteriormente
    const overlayContainer = this.getOverlayContainer();
    if (overlayContainer == null) {
      this.createOverlay();
      this.overlayVisibilityListeners();
    }
  }

  /**
   * Crea el elemento HTMLDivElement del expansion-overlay (#ID overlayContainer) y luego busca el elemento que debe aparecer dentro del overlayContainer.
   * Cuando lo encuentra mete ese elemento dentro del elemento overlayContainer recien creado.
   * 
   * El principal cometido del elemento overlayContainer recien creado es realizar la animación de colapso y despliegue.
   * @returns {void} El return solo existe para salir del método cuando no se encuentra el componente del atributo component-to-expand en el DOM.
   */
  createOverlay() {
    const slot = this.shadowRoot.querySelector('slot');
    const assignedNodes = slot.assignedNodes({ flatten: true });
    this.componentToExpand = assignedNodes.find((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV'); // Obtenemos el elemento al que le vamos a crear el padre
    if (this.componentToExpand == null) {
      console.warn('Element to expand not found');
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
    newParent.style.transition = `max-height ${this.getAttribute('animation-duration') ?? this.animationDuration} ease-out`; // Animación responsable del colapso y despliegue del componente

    newParent.appendChild(this.componentToExpand); // A nuestro elemento wrapper le añadimos el elemento original como hijo
    this.shadowRoot.appendChild(newParent); // Añadimos el wrapper al shadowRoot
  }

  /**
   * Muestra u oculta el backdrop y el overlayContainer.
   * 
   * El backdrop puede ser desactivado, al desactivarse el componente solo puede colapsarse de nuevo al hacer click en el botón asociado al atributo expand-trigger.
   * @returns {void} El return solo existe para salir del método cuando no se encuentra el componente del atributo expand-trigger en el DOM.
   */
  overlayVisibilityListeners() {
    if (this.getExpandTrigger() == null) {
      return;
    }

    const overlayContainer = this.getOverlayContainer();
    // El usuario hace click en el botón del componente externo asociado al atributo expand-trigger.
    this.getExpandTrigger().addEventListener('click', () => {
      const showOverlay = overlayContainer.style.maxHeight == '0px' ? true : false; // Indica si el overlay se va a mostrar o a ocultar
      this.updateHorizontalAlign(showOverlay);
      this.updateVerticalAlign(showOverlay);
      overlayContainer.style.maxHeight = showOverlay ? `${this.getComponentToExpandHeight()}px` : '0px';
    });
    return;
    // let overlayContainer = this.getOverlayContainer();
    const backdrop = document.querySelector("expansion-overlay").shadowRoot.getElementById(`backdrop${this.overlayContainerId}`); // Buscamos en expansion-overlay (el html propio del componente) para obtener el DOM de este propio componente
    const showBackdrop = this.getAttribute('show-backdrop') ?? this.showBackdrop;
    // No está habilitado el backdrop, se procede a ocultar
    if ((typeof showBackdrop == "boolean" && !showBackdrop) || (typeof showBackdrop === 'string' && showBackdrop.toLowerCase() === 'false')) {
      backdrop.style.transition = 'unset';
      backdrop.style.visibility = 'hidden';
    }

    // El usuario hace click en el backdrop
    backdrop.addEventListener('click', () => {
      overlayContainer.style.maxHeight = overlayContainer.style.maxHeight == '0px' ? `${this.getComponentToExpandHeight()}px` : '0px';
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });

    // El usuario hace click en el botón del componente externo asociado al atributo expand-trigger.
    this.getExpandTrigger().addEventListener('click', () => {
      overlayContainer.style.maxHeight = overlayContainer.style.maxHeight == '0px' ? `${this.getComponentToExpandHeight()}px` : '0px';
      backdrop.classList.toggle('activated'); // Muestra - oculta el backdrop
    });
  }

  /**
   * Añade un border-radius al expansion-overlay con los mismos px que tenia el border-radius del componente expandFromItem.
   * 
   * Dependiendo del atributo vertical-align el border-radius se pondra la parte de arriba o de abajo del expansion-overlay.
   * @returns {number} Número de px que se tienen que reducir del cálculo de posicionamiento vertical del expansion-overlay para ocultar el border-radius del atributo expand-from-item.
   */
  updateRoundBorder() {
    const expandFromItemHideRoundBorder = this.getAttribute('expand-from-item-hide-round-border') ?? this.expandFromItemHideRoundBorder;

    // No está habilitada la opción para ocultar el borde redondeado del componente expandFromItem.
    if ((typeof expandFromItemHideRoundBorder == "boolean" && !expandFromItemHideRoundBorder) ||
      (typeof expandFromItemHideRoundBorder === 'string' && this.getAttribute('expand-from-item-hide-round-border').toLowerCase() === 'false')) {
      return 0;
    }

    let overlayContainer = this.getOverlayContainer();
    const verticalAlign = this.getAttribute('vertical-align') ?? this.verticalAlign;
    const computedStyles = window.getComputedStyle(this.getExpandFromItem()); // El componente expandFromItem debe existir aquí obligatoriamente o el código no podría llegar a esta línea

    // El expansion-overlay sale por encima del componente, la animación de expansión es desde abajo hacia arriba. El border-radius se establece en el top.
    if (verticalAlign == 'top') {
      const borderTopLeftRadius = computedStyles.getPropertyValue('border-top-left-radius').replace('px', '');
      const borderTopRightRadius = computedStyles.getPropertyValue('border-top-right-radius').replace('px', '');
      overlayContainer.style.borderTopLeftRadius = `${borderTopLeftRadius}px`;
      overlayContainer.style.borderTopRightRadius = `${borderTopRightRadius}px`;

      // Si ocurre que un border-radius es mayor que el otro coger el de mayor valor. Se divide entre 2 porque el border-radius forma una curva, y solo una mitad (que es la mitad horizontal) sería visible.
      if (borderTopLeftRadius > borderTopRightRadius) {
        return borderBottomLeftRadius / 2;
      }

      if (borderTopRightRadius > borderTopLeftRadius) {
        return borderTopRightRadius / 2;
      }

      return borderTopLeftRadius / 2;
    }

    // El expansion-overlay sale por debajo del componente, la animación de expansión es desde arriba hacia abajo. El border-radius se establece en el bottom.
    if (verticalAlign == 'bottom') {
      const borderBottomLeftRadius = computedStyles.getPropertyValue('border-bottom-left-radius').replace('px', '');
      const borderBottomRightRadius = computedStyles.getPropertyValue('border-bottom-right-radius').replace('px', '');
      overlayContainer.style.borderBottomLeftRadius = `${borderBottomLeftRadius}px`;
      overlayContainer.style.borderBottomRightRadius = `${borderBottomRightRadius}px`;

      // Si ocurre que un border-radius es mayor que el otro coger el de mayor valor. Se divide entre 2 porque el border-radius forma una curva, y solo una mitad (que es la mitad horizontal) sería visible.
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
   * Actualiza la posición horizontal del componente overlayContainer.
   * 
   * Cuando se establece la posición del horizontal-align se realiza un cálculo para comprobar si el overlayContainer se saldrá de la pantalla por overflow.
   * Si el componente overlayContainer sufre overflow se realizan cálculos para comprobar que horizontal-align sufre menos overflow.
   * 
   * Si el atributo force-horizontal-align viene a true se forzará la posición establecida en el atributo horizontal-align aunque no haya espacio suficiente.
   * @returns {void} El return solo existe para salir del método cuando no se encuentra el componente del atributo expand-from-item o del component-to-expand en el DOM.
   */
  updateHorizontalAlign(showOverlay) {
    if (!showOverlay) { // No se realizan actualizaciones de ubicación al cerrar el overlay
      return;
    }

    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    // Calculos del expansion-overlay en las diferentes posiciones posibles de horizontalAlign
    const horizontalCalculations = {
      left: expandFromItem.getBoundingClientRect().left,
      right: window.innerWidth - expandFromItem.getBoundingClientRect().right,
      middle: expandFromItem.getBoundingClientRect().left + ((this.getExpandFromItemWidth() / 2) - (this.getComponentToExpandWidth() / 2))
    };

    let overlayContainer = this.getOverlayContainer();
    let horizontalAlign = this.getAttribute('horizontal-align') ?? this.horizontalAlign;
    const forceHorizontalAlign = this.getAttribute('force-horizontal-align') ?? this.forceHorizontalAlign;

    // Si se fuerza la posición de horizontalAlign, no se realizarán los cálculos para cambiar el horizontalAlign aunque no haya espacio suficiente
    if ((typeof forceHorizontalAlign == "boolean" && !forceHorizontalAlign) || (typeof forceHorizontalAlign === 'string' && forceHorizontalAlign.toLowerCase() === 'false')) {
      horizontalAlign = this.checkHorizontalAlignAvailability(horizontalAlign, horizontalCalculations); // Se realizan los cálculos para ver si el componente overlayContainer se saldrá de la pantalla por overflow 
    }

    if (horizontalAlign == 'left') {
      overlayContainer.style.left = `${horizontalCalculations.left}px`;
      overlayContainer.style.right = 'unset';
      return;
    }

    if (horizontalAlign == 'right') {
      overlayContainer.style.left = 'unset';
      overlayContainer.style.right = `${horizontalCalculations.right}px`;
      return;
    }

    if (horizontalAlign == 'middle') {
      overlayContainer.style.left = `${horizontalCalculations.middle}px`;
      overlayContainer.style.right = 'unset';
      return;
    }
  }

  /**
   * Realiza un cálculo para comprobar si el overlayContainer se saldrá de la pantalla por overflow.
   * Si el componente overlayContainer sufre overflow se realizan cálculos para comprobar que horizontal-align sufre menos overflow.
   * @param {string} horizontalAlign Posición original / por defecto del atributo horizontal-align.
   * @param {*} horizontalCalculations Calculos del expansion-overlay en las diferentes posiciones posibles de horizontalAlign.
   * @returns {string} Valor definitivo del horizontalAlign tras hacer los cálculos.
   */
  checkHorizontalAlignAvailability(horizontalAlign, horizontalCalculations) {
    if (horizontalAlign == 'left') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + this.getComponentToExpandWidth()) >= 0)) {
        return horizontalAlign; // El componente overlayContainer no sufre overflow, se muestra en el horizontal-align original
      }

      // Comprueba que horizontalAlign tiene más espacio disponible
      const minCalculation = Math.min(Math.abs(horizontalCalculations.left), Math.abs(horizontalCalculations.right), Math.abs(horizontalCalculations.middle));
      if (minCalculation === Math.abs(horizontalCalculations.left)) {
        return 'left';
      }
      if (minCalculation === Math.abs(horizontalCalculations.right)) {
        return 'right';
      }
      if (minCalculation === Math.abs(horizontalCalculations.middle)) {
        return 'middle';
      }

      return 'left'; // Failsafe return, nunca debería llegar a este return
    }

    if (horizontalAlign == 'right') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + this.getComponentToExpandWidth()) >= 0)) {
        return horizontalAlign;
      }

      // Comprueba que horizontalAlign tiene más espacio disponible
      const minCalculation = Math.min(Math.abs(horizontalCalculations.left), Math.abs(horizontalCalculations.right), Math.abs(horizontalCalculations.middle));
      if (minCalculation === Math.abs(horizontalCalculations.left)) {
        return 'left';
      }
      if (minCalculation === Math.abs(horizontalCalculations.right)) {
        return 'right';
      }
      if (minCalculation === Math.abs(horizontalCalculations.middle)) {
        return 'middle';
      }

      return 'right'; // Failsafe return, nunca debería llegar a este return
    }

    if (horizontalAlign == 'middle') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + this.getComponentToExpandWidth()) >= 0)) {
        return horizontalAlign;
      }

      // Comprueba que horizontalAlign tiene más espacio disponible
      const minCalculation = Math.min(Math.abs(horizontalCalculations.left), Math.abs(horizontalCalculations.right), Math.abs(horizontalCalculations.middle));
      if (minCalculation === Math.abs(horizontalCalculations.left)) {
        return 'left';
      }
      if (minCalculation === Math.abs(horizontalCalculations.right)) {
        return 'right';
      }
      if (minCalculation === Math.abs(horizontalCalculations.middle)) {
        return 'middle';
      }

      return 'middle'; // Failsafe return, nunca debería llegar a este return
    }
  }

  /**
   * Actualiza la posición vertical del componente overlayContainer.
   * 
   * Cuando se establece la posición del vertical-align se realiza un cálculo para comprobar si el overlayContainer se saldrá de la pantalla por overflow.
   * Si el componente overlayContainer sufre overflow se realizan cálculos para comprobar que vertical-align sufre menos overflow.
   * 
   * Si el atributo force-vertical-align viene a true se forzará la posición establecida en el atributo vertical-align aunque no haya espacio suficiente.
   * @param {boolean} showOverlay 
   * @returns {void} El return solo existe para salir del método cuando no se encuentra el componente del atributo expand-from-item en el DOM.
   */
  async updateVerticalAlign(showOverlay) {
    if (!showOverlay) { // No se realizan actualizaciones de ubicación al cerrar el overlay
      return;
    }

    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    let overlayContainer = this.getOverlayContainer();
    // Calculos del expansion-overlay en las diferentes posiciones posibles de verticalAlign
    const verticalCalculations = {
      top: window.innerHeight - expandFromItem.offsetTop,
      bottom: expandFromItem.offsetTop + parseFloat(window.getComputedStyle(this.getExpandFromItem()).height)
    };

    let verticalAlign = this.getAttribute('vertical-align') ?? this.verticalAlign;
    const borderRadiusValue = this.updateRoundBorder(); // Obtiene los px que se deben eliminar del cálculo de posición vertical para que no aparezca el border-radius del componente expandFromItem
    const forceVerticalAlign = this.getAttribute('force-vertical-align') ?? this.forceVerticalAlign;

    // Si se fuerza la posición de verticalAlign, no se realizarán los cálculos para cambiar el verticalAlign aunque no haya espacio suficiente
    // Solo se hace la comprobación al abrirse el overlay
    if ((typeof forceVerticalAlign == "boolean" && !forceVerticalAlign) || (typeof forceVerticalAlign === 'string' && forceVerticalAlign.toLowerCase() === 'false')) {
      verticalAlign = await this.checkVerticalAlignAvailability(verticalAlign, verticalCalculations); // Se realizan los cálculos para ver si el componente overlayContainer se saldrá de la pantalla por overflow 
    }

    // El expansion-overlay sale por encima del componente, la animación de expansión es desde abajo hacia arriba.
    if (verticalAlign == 'top') {
      overlayContainer.style.top = 'unset';
      overlayContainer.style.bottom = `${verticalCalculations.top - borderRadiusValue}px`;
      return;
    }

    // El expansion-overlay sale por debajo del componente, la animación de expansión es desde arriba hacia abajo.
    if (verticalAlign == 'bottom') {
      overlayContainer.style.top = `${verticalCalculations.bottom - borderRadiusValue}px`;
      overlayContainer.style.bottom = 'unset';
      return;
    }
  }

  /**
   * Realiza un cálculo para comprobar si el overlayContainer se saldrá de la pantalla por overflow.
   * Si el componente overlayContainer sufre overflow se realizan cálculos para comprobar que vertical-align sufre menos overflow.
   * @param {string} verticalAlign Posición original / por defecto del atributo vertical-align.
   * @param {*} verticalCalculations Calculos del expansion-overlay en las diferentes posiciones posibles de verticalAlign.
   * @returns {string} Valor definitivo del verticalAlign tras hacer los cálculos.
   */
  async checkVerticalAlignAvailability(verticalAlign, verticalCalculations) {
    const scrollTop = await this.getScrollPosition();

    if (verticalAlign == 'top') {
      // Si el overlayContainer está en bottom: -50px (es decir que está fuera de la pantalla). Y si la pantalla es de 400px y el overlayContainer está en bottom: 350px, pero el overlayContainer tiene un height de >50px, se sale de la pantalla.
      // Para hacer una comprobación correcta se debe calcular (el tamaño de la pantalla + cuanto se ha hecho de scroll hasta ese momento) - (ubicación de ExpandFromItem + altura de ComponentToExpand)
      if (verticalCalculations[verticalAlign] >= 0 && ((window.innerHeight + scrollTop) - (verticalCalculations[verticalAlign] + this.getComponentToExpandHeight()) >= 0)) {
        return verticalAlign; // El componente overlayContainer no sufre overflow, se muestra en el vertical-align original
      }

      // Comprueba que verticalAlign tiene más espacio disponible
      const minCalculation = Math.min(Math.abs(verticalCalculations.top), Math.abs(verticalCalculations.bottom));
      if (minCalculation === Math.abs(verticalCalculations.top)) {
        return 'top';
      }
      if (minCalculation === Math.abs(verticalCalculations.bottom)) {
        return 'bottom';
      }

      return 'top'; // Failsafe return, nunca debería llegar a este return
    }

    if (verticalAlign == 'bottom') {
      // Si el overlayContainer está en bottom: -50px (es decir que está fuera de la pantalla). Y si la pantalla es de 400px y el overlayContainer está en bottom: 350px, pero el overlayContainer tiene un height de >50px, se sale de la pantalla.
      // Para hacer una comprobación correcta se debe calcular (el tamaño de la pantalla + cuanto se ha hecho de scroll hasta ese momento) - (ubicación de ExpandFromItem + altura de ComponentToExpand)
      if (verticalCalculations[verticalAlign] >= 0 && ((window.innerHeight + scrollTop) - (verticalCalculations[verticalAlign] + this.getComponentToExpandHeight()) >= 0)) {
        return verticalAlign;
      }

      // Comprueba que verticalAlign tiene más espacio disponible
      const minCalculation = Math.min(Math.abs(verticalCalculations.top), Math.abs(verticalCalculations.bottom));
      if (minCalculation === Math.abs(verticalCalculations.top)) {
        return 'top';
      }
      if (minCalculation === Math.abs(verticalCalculations.bottom)) {
        return 'bottom';
      }

      return 'bottom'; // Failsafe return, nunca debería llegar a este return
    }
  }
}

// Registrar el Custom Element
customElements.define('expansion-overlay', ExpansionOverlay);