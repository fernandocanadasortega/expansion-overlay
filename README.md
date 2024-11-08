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

![](https://github.com/fernandocanadasortega/expansion-overlay/blob/master/Ejemplo%20expansion-overlay.gif)

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

Para poder utilizar el componente es necesario habilitar una configuración de Angular dentro de cada componente en el que se vaya a usar.
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
2. Importamos el archivo de JavaScript dentro de nuestro componente de angular *al que ya le hemos habilitado la opción mostrada en los prerequisitos*.
   ```ts
   import '@expansion-overlay/expansion-overlay.js';
   ```
3. En el archivo HTML del componente de angular definimos la etiqueta del componente expansion-overlay. *Debe tener **tres parámetros obligatorios**, mirar apartado de [Implementación](#implementaci%C3%B3n).*
   ```html
   <expansion-overlay expand-from-item-id="id-componente" component-to-expand-id="id-componente" expand-trigger-id="id-componente"></expansion-overlay>
   ```

<br />

<!-- USAGE -->
## Implementación

Para realizar la configuración básica del componente son necesarios **tres parámetros obligatorios**, para ver el resto de la configuración mirar el apartado [Parámetros disponibles](#par%C3%A1metros-disponibles).

-- TODO -- EXPLICACION DE LA DIFERENCIA ENTRE expandFromItem - componentToExpand - expandTrigger 

<br />

<!-- Available parameters -->
## Parámetros disponibles

Este apartado describle cada parámetro configurable del componente, sus restricciones y valores predeterminados.

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
