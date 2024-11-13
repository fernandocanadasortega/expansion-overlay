<!-- ORIGINAL README TEMPLATE -- https://github.com/othneildrew/Best-README-Template --> 

<!-- Enlace que dirige al readme en español -->
<a id="readme-spanish"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<div align="center">
  <a href="https://github.com/fernandocanadasortega/expansion-overlay/graphs/contributors">
    <img alt="Contributors" src="https://img.shields.io/github/contributors/fernandocanadasortega/expansion-overlay.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/fernandocanadasortega/expansion-overlay/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/fernandocanadasortega/expansion-overlay.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/fernandocanadasortega/expansion-overlay/pulls">
    <img alt="Pull requests" src="https://img.shields.io/github/issues-pr/fernandocanadasortega/expansion-overlay.svg?style=for-the-badge" />
  </a>
  <a href="https://github.com/fernandocanadasortega/expansion-overlay/forks">
    <img alt="Forks" src="https://img.shields.io/github/forks/fernandocanadasortega/expansion-overlay.svg?style=for-the-badge" />
  </a>
</div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h2 align="center">Expansion overlay</h2>

  <p align="center">
    Custom web component de JavaScript nativo que despliega un overlay que se expande desde un punto en específico.
    <br />
    <a href="#readme-spanish"><strong>Go to english docs »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/">Página de NPM</a>
    ·
    <a href="https://stackblitz.com/">Ver Demo</a>
    ·
    <a href="https://github.com/fernandocanadasortega/expansion-overlay/issues/new?labels=bug&template=bug-report---.md">Informar sobre un bug</a>
    ·
    <a href="https://github.com/fernandocanadasortega/expansion-overlay/issues/new?labels=enhancement&template=feature-request---.md">Solicitar funcionalidad</a>
  </p>
</div>

<br />

<!-- ABOUT THE PROJECT -->
## Sobre el proyecto

![](assets/Ejemplo%20expansion-overlay.gif)

Custom web component de JavaScript nativo que despliega un overlay, es completamente configurable. 

Puede ser configurado para que el overlay de multiples maneras:
* Configuración del despliegue vertical, hacia arriba o hacia abajo.
* Configuración del despliegue horizontal, alineación a la izquierda, a la derecha o que se quede en medio.
* Configuración que compruebe si el componente del que saldrá tiene border-radius y aplicarlos al overlay.
* Y muchas más configuraciones :smile:.

<br />

<!-- GETTING STARTED -->
## Primeros pasos

### Prerequisitos

*Este paso solo ha sido probado en Angular*. Para poder utilizar el componente es necesario habilitar una configuración de Angular dentro de cada componente en el que se vaya a usar.
* Habilitar **CUSTOM_ELEMENTS_SCHEMA**
  ```ts
  @Component({
    selector: 'password-strength-requirements',
    templateUrl: './password-strength.component.html',
    styleUrls: ['./password-strength.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  ```
  >*Al habilitar **CUSTOM_ELEMENTS_SCHEMA** puedes utilizar etiquetas de HTML diferentes a las nativas y a las propias que genera Angular al definir un componente. En caso de no ser activada esta opción no será posible utilizar el componente.*
<br />

### Instalación

Una vez habilitada la configuración procedemos a descargar el componente de NPM.

1. Instalamos el paquete de NPM
   ```sh
   npm install expansion-overlay
   ```
2. Importamos el archivo de JavaScript dentro de nuestro componente. *En caso de ser Angular es obligatorio el paso mostrado en los prerequisitos*.
   ```ts
   import '@expansion-overlay/expansion-overlay.js';
   ```
3. En el archivo HTML del componente definimos la etiqueta del expansion-overlay. *Debe tener **tres parámetros obligatorios**, mirar apartado de [Implementación](#implementaci%C3%B3n).*
   ```html
   <expansion-overlay expand-from-item-id="id-componente" component-to-expand-id="id-componente" expand-trigger-id="id-componente"></expansion-overlay>
   ```
<br />

> *Para ver el resto de la configuración mirar el apartado [Parámetros disponibles](#par%C3%A1metros-disponibles)*.

<br />

<!-- USAGE -->
## Implementación

Para realizar la configuración básica del componente son necesarios **tres parámetros obligatorios**, abajo se encuentra un diagrama básico con los tres elementos junto con un ejemplo html básico del componente.

![](assets/Diagrama%20de%20ejemplo%20básico.png)

```html
<div id="box-container" style="width: 200px; height: 100px; display: flex; justify-content: flex-end; align-items: center; border: 1px solid red; padding: 10px;">
  <button id="box-trigger" style="height: 50px;">Trigger</button>
</div>

<div id="div-i-want-to-overlay" style="width: 120px; height: 80px; border: 1px solid cyan; padding: 10px;">
  <span>I Want to overlay this div</span>
</div>

<expansion-overlay expand-from-item-id="box-container" component-to-expand-id="div-i-want-to-overlay" expand-trigger-id="box-trigger"></expansion-overlay>
```

-- AÑADIR EJEMPLO STACKBLITZ --

### Parámetro expandFromItem
Es el elemento desde donde se desplegará el expansion-overlay, puede ser cualquier elemento del html (*div, button, span, label, etc...*). Del elemento expandFromItem se obtendrán los valores para realizar los cálculos de alineamiento del expansion-overlay.

Hay dos maneras de enviar el parámetro expandFromItem, **expand-from-item-id** y **expand-from-item-class**, dependiendo si vas a enviar un **#ID** o un **.class**.

> Los parámetros **expand-from-item-id** y **expand-from-item-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **expand-from-item-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.

### Parámetro expandTrigger
Es el elemento que provoca la expansión y/o el cierre del expansion-overlay, puede ser cualquier elemento del html (*div, button, span, label, etc...*). *Normalmente es un botón*, pero se le puede asignar a cualquier elemento que soporte <code>addEventListener click</code>.

Hay dos maneras de enviar el parámetro expandTrigger, **expand-trigger-id** y **expand-trigger-class**, dependiendo si vas a enviar un **#ID** o un **.class**.

> Los parámetros **expand-trigger-id** y **expand-trigger-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **expand-trigger-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.

### Parámetro componentToExpand
Es el elemento que se introducirá en el expansion-overlay, el elemento que tendrá la animación de despliegue, puede ser cualquier elemento del html (*div, button, span, label, etc...*). Del elemento componentToExpand se obtendrán los valores de width y height del expansion-overlay, que además se usan durante el cálculo para comprobar que el expansion-overlay cabe dentro de la pantalla.

Este elemento se puede ubicar en cualquier parte del DOM, **no es necesario que esté dentro de la etiqueta <code>expansion-overlay</code>**, debido a que cuando se cree el expansion-overlay el elemento de componentToExpand se introducirá dentro de un wrapper creado por el expansion-overlay que lo hará desaparecer.

Hay dos maneras de enviar el parámetro componentToExpand, **component-to-expand-id** y **component-to-expand-class**, dependiendo si vas a enviar un **#ID** o un **.class**.

> Los parámetros **component-to-expand-id** y **component-to-expand-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **component-to-expand-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.

<br />

<!-- Available parameters -->
## Parámetros disponibles

#### Definición del elemento desde donde se desplegará el expansion-overlay.
  
| Parámetros             | Tipo   | Descripción                      | ¿Parámetro requerido? | Valor por defecto |
| ---------------------- | ------ | -------------------------------- | --------------------- | ----------------- |
| expand-from-item-id    | string | Valor del #ID del HTMLElement    | ✅                    | null              |
| expand-from-item-class | string | Valor del .class del HTMLElement | ✅                    | null              |

> Los parámetros **expand-from-item-id** y **expand-from-item-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **expand-from-item-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.
<br />

#### Definición del elemento que se introducirá en el expansion-overlay, el elemento que tendrá la animación de despliegue.
  
| Parámetros                | Tipo   | Descripción                      | ¿Parámetro requerido? | Valor por defecto |
| ------------------------- | ------ | -------------------------------- | --------------------- | ----------------- |
| component-to-expand-id    | string | Valor del #ID del HTMLElement    | ✅                    | null              |
| component-to-expand-class | string | Valor del .class del HTMLElement | ✅                    | null              |

> Los parámetros **component-to-expand-id** y **component-to-expand-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **component-to-expand-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.
<br />

#### Definición del elemento que activa la expansión. *Normalmente es un botón*, pero se le puede asignar a cualquier elemento que soporte <code>addEventListener click</code>.
  
| Parámetros           | Tipo   | Descripción                      | ¿Parámetro requerido? | Valor por defecto |
| -------------------- | ------ | -------------------------------- | --------------------- | ----------------- |
| expand-trigger-id    | string | Valor del #ID del HTMLElement    | ✅                    | null              |
| expand-trigger-class | string | Valor del .class del HTMLElement | ✅                    | null              |

> Los parámetros **expand-trigger-id** y **expand-trigger-class** son mutuamente excluyentes, en caso de recibir los dos parámetros **expand-trigger-id** será usado por defecto.

> No puedes enviar el parámetro expandFromItem mediante **.class** si existe más de una clase con ese nombre en el DOM.
<br />

#### Alineaciones del componente
  
| Parámetros             | Tipo    | Descripción                                                   | ¿Parámetro requerido? | Valor por defecto | Opciones válidas      |
| ---------------------- | ------- | ------------------------------------------------------------- | --------------------- | ----------------- | --------------------- |
| horizontal-align       | string  | Indica donde se alineará el expansion-overlay en el eje X     | ❎                    | left              | left / middle / right |
| vertical-align         | string  | Indica donde se alineará el expansion-overlay en el eje Y     | ❎                    | bottom            | top / bottom          |
| force-horizontal-align | boolean | Fuerza a utilizar únicamente el horizontalAlign seleccionado  | ❎                    | false             |                       |
| force-vertical-align   | boolean | Fuerza a utilizar únicamente el vertical-align seleccionado   | ❎                    | false             |                       |

> Si se establece **horizontal-align: 'left'** el expansion-overlay se pegará a la izquierda y si necesita más espacio crecerá hacia la derecha.

> Si se establece **vertical-align: 'top'** el expansion-overlay se colocará por encima del objeto y la animación de expansión será de abajo hacia arriba.

> Si se fuerza la alineación, *tanto horizontal como vertical*, se ignorará la función que cambia la alineación del expansion-overlay de forma automática cuando no hay espacio suficiente.
<br />

#### Tamaño del componente
  
| Parámetros            | Tipo    | Descripción                                                                         | ¿Parámetro requerido? | Valor por defecto | Opciones válidas            |
| --------------------- | ------- | ----------------------------------------------------------------------------------- | --------------------- | ----------------- | --------------------------- |
| inherit-parent-width  | boolean | Indica si el width del expansion-overlay será igual que el width de expandFromItem  | ❎                    | true              |                             |
| inherit-parent-height | boolean | Indica si el height del expansion-overlay será igual que el width de expandFromItem | ❎                    | true              |                             |
| custom-width          | string  | Indica un width específico para el expansion-overlay                                | ❎                    |                   | 350px / 150em / 50% / 200vw |
| custom-height         | string  | Indica un height específico para el expansion-overlay                               | ❎                    |                   | 350px / 150em / 50% / 200vh |

> Los parámetros **inherit-parent-width** y **custom-width** son mutuamente excluyentes, en caso de recibir los dos parámetros o si solo se recibe **custom-width** pero **inherit-parent-width=true** por defecto, **inherit-parent-width** será usado por defecto.

> Los parámetros **inherit-parent-height** y **custom-height** son mutuamente excluyentes, en caso de recibir los dos parámetros o si solo se recibe **custom-height** pero **inherit-parent-height=true** por defecto, **inherit-parent-height** será usado por defecto.
<br />

#### Otros parámetros
  
| Parámetros                         | Tipo    | Descripción                                                                               | ¿Parámetro requerido? | Valor por defecto | Opciones válidas      |
| ---------------------------------- | ------- | ----------------------------------------------------------------------------------------- | --------------------- | ----------------- | --------------------- |
| animation-duration                 | string  | Tiempo de la animación de despliegue del expansion-overlay                                | ❎                    | 0.25s             | 0.20s / 500ms         |
| show-backdrop                      | boolean | Indica si se mostrará un backdrop al desplegarse el expansion-overlay                     | ❎                    | true              |                       |
| expand-from-item-hide-round-border | boolean | Indica si el expansion-overlay ocultará el border-radius de expandFromItem al desplegarse | ❎                    | false             |                       |

> Al ocultar el backdrop es posible interactuar con el resto de la aplicación cuando el expansion-overlay aún está desplegado. Al hacer click en el backdrop se cerrará automaticamente el expansion-overlay.

> Al activar **expand-from-item-hide-round-border** se ocultará el border-radius de expandFromItem al desplegarse, es solo un cambio estético para que no se vea un borde redondeado y luego el expansion-overlay. El valor del border-radius de expandFromItem se aplicará al expansion-overlay.

<br />

<!-- CONTRIBUTING -->
## Colaboradores

Gracias por colaborar en este proyecto! 😊 Cualquier colaboración al proyecto es **ampliamente apreciado**.

Si tienes cualquier sugerencia para mejorar el componente y este proyecto puedes crear un **fork** de este repositorio y solicitar un **pull request**, o simplemente crear una [solicitud de funcionalidad](https://github.com/fernandocanadasortega/expansion-overlay/issues/new?labels=enhancement&template=feature-request---.md)

Si encuentras algún error en el proyecto, por favor, [hazmelo saber](https://github.com/fernandocanadasortega/expansion-overlay/issues/new?labels=bug&template=bug-report---.md) para que pueda arreglarlo, también puedes crear un **fork** de este repositorio y luego solicitar un **pull request**.

Muchas gracias por colaborar!! 😄

### Para poder colaborar sigue los siguientes pasos:

1. **Crea un Fork** del proyecto.
2. **Crea una rama** para tu bug o funcionalidad
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. **Realiza un Commit** con tus cambios
   ```sh
   git commit -m 'Add some Amazing features'
   ```
6. **Sube tus cambios** a la rama remota
   ```sh
   git push origin feature/AmazingFeature
   ```
8. **Crea una Pull Request** en el repositorio.

### Mayores colaboradores:

<a href="https://github.com/fernandocanadasortega/expansion-overlay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fernandocanadasortega/expansion-overlay" alt="contrib.rocks image" />
</a>

<br />

<!-- LICENSE -->
## Licencia
<img src="assets/cc_deed.png" alt="CC Deed">

Distribuido bajo la licencia Creative Commons Atribución (***Creative Commons Deed Only Atribution***). Puedes usar el código a discrepción, pero si clonas el proyecto y lo subes a un repositorio diferente en vez de realizar un pull request a este respositorio, por favor, cita el proyecto de origen preferentemente en el readme.

> El beneficiario de la licencia tiene el derecho de copiar, distribuir, exhibir y representar la obra y hacer obras derivadas siempre y cuando reconozca y cite la obra de la forma especificada por el autor o el licenciante.

<br />

<!-- ACKNOWLEDGMENTS -->
## Agradecimientos

Este Readme ha sido posible gracias a las plantillas y publicaciones de github sobre casos específicos para errores en el readme.

* [Best-README-Template hecho por othneildrew](https://github.com/othneildrew/Best-README-Template)
* [Ejemplo de README por anuraghazra](https://codesandbox.io/p/sandbox/github-readme-stats-mh75j)
* [Publicación de un hilo de Github sobre los enlaces con acentos](https://github.com/DavidAnson/markdownlint/issues/955)
