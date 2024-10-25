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
  /** boolean, Opciones posibles: 'true' | 'false' (default). Indica el expansion-overlay se ubicará forzosamente en el horizontalAlign seleccionado (aunque no haya espacio para mostrar correctamente el expansion-overlay). Esta opción ignora la función que cambia el horizontalAlign del expansion-overlay si no hay espacio suficiente */
  forceHorizontalAlign = false;
  /** string, Opciones posibles: 'top' | 'bottom' (default). Indica donde se alineará el expansion-overlay en el eje Y, por ejemplo si se alinea 'top' el expansion-overlay se colocará por encima del objeto y la animación de expandirse será de abajo hacia arriba. */
  verticalAlign = 'bottom';
  /** boolean, Opciones posibles: 'true' | 'false' (default). Indica el expansion-overlay se ubicará forzosamente en el verticalAlign seleccionado (aunque no haya espacio para mostrar correctamente el expansion-overlay). Esta opción ignora la función que cambia el verticalAlign del expansion-overlay si no hay espacio suficiente */
  forceVerticalAlign = false;
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
    return ['expand-from-item-id', 'expand-from-item-class', 'component-to-expand-id', 'component-to-expand-class', 'expand-trigger-id', 'expand-trigger-class', 'expand-from-item-hide-round-border', 'horizontal-align', 'force-horizontal-align', 'vertical-align', 'force-vertical-align', 'inherit-parent-width', 'custom-width', 'inherit-parent-height', 'custom-height', 'animation-duration', 'show-backdrop'];
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

    if (name === 'force-horizontal-align') {
      this.forceHorizontalAlign = newValue;
      return;
    }

    if (name === 'vertical-align') {
      this.verticalAlign = newValue;
      return;
    }

    if (name === 'force-vertical-align') {
      this.forceVerticalAlign = newValue;
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
    return originalElement.getBoundingClientRect().width;
  }

  getComponentToExpandHeight() {
    // Existe un customHeight y inheritParentHeight viene a falso
    if (this.getAttribute('custom-height') != null && this.getAttribute('inherit-parent-height') != null && this.getAttribute('inherit-parent-height').toLowerCase() === 'false') {
      return this.getAttribute('custom-height');
    }

    const originalElement = this.getComponentToExpand(); // El componente debe existir aquí obligatoriamente o el código no podría llegar a esta línea
    return originalElement.getBoundingClientRect().height;
  }

  async manageExpansionOverlay() {
    await this.loadTemplatePromise;

    this.createOverlay();
    this.updateHorizontalAlign();
    this.updateVerticalAlign();
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
  updateHorizontalAlign() {
    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    let componentToExpand = this.getComponentToExpand();
    if (componentToExpand == null) {
      return;
    }

    // Calculos del expansion-overlay en las diferentes posiciones posibles de horizontalAlign
    const horizontalCalculations = {
      left: expandFromItem.getBoundingClientRect().left,
      right: window.innerWidth - expandFromItem.getBoundingClientRect().right,
      middle: expandFromItem.getBoundingClientRect().left + ((expandFromItem.getBoundingClientRect().width / 2) - (componentToExpand.getBoundingClientRect().width / 2))
    };

    let horizontalAlign = this.getAttribute('horizontal-align') ?? this.horizontalAlign;
    const forceHorizontalAlign = this.getAttribute('force-horizontal-align') ?? this.forceHorizontalAlign;

    // Si se fuerza la posición de horizontalAlign no se realizarán los cálculos para cambiar el horizontalAlign si no hay espacio suficiente
    if ((typeof forceHorizontalAlign == "boolean" && !forceHorizontalAlign) || (typeof forceHorizontalAlign === 'string' && forceHorizontalAlign.toLowerCase() === 'false')) {
      horizontalAlign = this.checkHorizontalAlignAvailability(horizontalAlign, horizontalCalculations);
    }

    if (horizontalAlign == 'left') {
      document.getElementById('overlayContainer').style.left = `${horizontalCalculations.left}px`;
      return;
    }

    if (horizontalAlign == 'right') {
      document.getElementById('overlayContainer').style.right = `${horizontalCalculations.right}px`;
      return;
    }

    if (horizontalAlign == 'middle') {
      document.getElementById('overlayContainer').style.left = `${horizontalCalculations.middle}px`;
      return;
    }
  }

  /**
   * Comprueba si es necesario cambiar el horizontalAlign, debido a que el horizontalAlign seleccionado no deja suficiente espacio para el expansion-overlay
   */
  checkHorizontalAlignAvailability(horizontalAlign, horizontalCalculations) {
    let componentToExpand = this.getComponentToExpand();
    if (componentToExpand == null) {
      return this.horizontalAlign; // Failsafe return, nunca debería llegar a este return
    }

    if (horizontalAlign == 'left') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + componentToExpand.getBoundingClientRect().width) >= 0)) {
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

      return 'left'; // Failsafe return, nunca debería llegar a este return
    }

    if (horizontalAlign == 'right') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + componentToExpand.getBoundingClientRect().width) >= 0)) {
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
      if (horizontalCalculations[horizontalAlign] >= 0 && (window.innerWidth - (horizontalCalculations[horizontalAlign] + componentToExpand.getBoundingClientRect().width) >= 0)) {
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

  updateVerticalAlign() {
    let expandFromItem = this.getExpandFromItem();
    if (expandFromItem == null) {
      return;
    }

    // Calculos del expansion-overlay en las diferentes posiciones posibles de verticalAlign
    const verticalCalculations = {
      top: window.innerHeight - expandFromItem.getBoundingClientRect().top,
      bottom: expandFromItem.getBoundingClientRect().bottom
    };

    const borderRadiusValue = this.updateRoundBorder();
    let verticalAlign = this.getAttribute('vertical-align') ?? this.verticalAlign;
    const forceVerticalAlign = this.getAttribute('force-vertical-align') ?? this.forceVerticalAlign;

    // Si se fuerza la posición de verticalAlign no se realizarán los cálculos para cambiar el verticalAlign si no hay espacio suficiente
    if ((typeof forceVerticalAlign == "boolean" && !forceVerticalAlign) || (typeof forceVerticalAlign === 'string' && forceVerticalAlign.toLowerCase() === 'false')) {
      verticalAlign = this.checkVerticalAlignAvailability(verticalAlign, verticalCalculations);
    }

    // El expansion-overlay sale debajo del componente, la animación de expansión es hacia abajo.
    if (verticalAlign == 'top') {
      document.getElementById('overlayContainer').style.bottom = `${verticalCalculations.top - borderRadiusValue}px`;
      return;
    }

    // El expansion-overlay sale arriba del componente, la animación de expansión es hacia arriba.
    if (verticalAlign == 'bottom') {
      document.getElementById('overlayContainer').style.top = `${verticalCalculations.bottom - borderRadiusValue}px`;
      return;
    }
  }

  /**
   * Comprueba si es necesario cambiar el verticalAlign, debido a que el verticalAlign seleccionado no deja suficiente espacio para el expansion-overlay
   */
  checkVerticalAlignAvailability(verticalAlign, verticalCalculations) {
    let componentToExpand = this.getComponentToExpand();
    if (componentToExpand == null) {
      return this.verticalAlign; // Failsafe return, nunca debería llegar a este return
    }

    if (verticalAlign == 'top') {
      // Si el overlayContainer está en left: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en left: 350px, pero el overlayContainer tiene un width de >50px, se sale de la pantalla.
      if (verticalCalculations[verticalAlign] >= 0 && (window.innerHeight - (verticalCalculations[verticalAlign] + componentToExpand.getBoundingClientRect().height) >= 0)) {
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

      return 'top'; // Failsafe return, nunca debería llegar a este return
    }

    if (verticalAlign == 'bottom') {
      // Si el overlayContainer está en bottom: -50px está fuera de la pantalla Y si la pantalla es de 400px y el overlayContainer está en bottom: 350px, pero el overlayContainer tiene un height de >50px, se sale de la pantalla.
      if (verticalCalculations[verticalAlign] >= 0 && (window.innerHeight - (verticalCalculations[verticalAlign] + componentToExpand.getBoundingClientRect().height) >= 0)) {
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