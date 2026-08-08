# Guía funcional — ESL Lessons

Este documento explica, en lenguaje sencillo, **cómo funciona la plataforma ESL Lessons**
tal como está construida hasta hoy: qué hace cada pantalla, qué puede hacer cada tipo de
usuario, y cómo unas piezas dependen de otras. Está pensado para leerse sin conocimientos
técnicos.

> **Nota importante sobre el estado actual:** hoy la web funciona con **datos de ejemplo
> (simulados)**. Todo lo que se ve —lecciones, clientes, pagos, métricas— está "de mentira"
> para poder mostrar cómo se verá y se comportará. Todavía **no hay servidor ni base de
> datos** conectados. Cuando se conecte el backend, esos datos pasarán a ser reales y
> permanentes. Mientras tanto, cualquier cambio que hagas (crear una lección, mover algo a
> una carpeta, etc.) **se pierde al recargar la página**. Esto es normal y esperado en esta
> etapa.

---

## 1. Visión general

ESL Lessons es una plataforma para **vender y distribuir materiales de clases de inglés**
(lecciones de conversación para tutores). Se compone de **tres zonas** bien diferenciadas:

| Zona | Para quién | Cómo se entra |
|------|-----------|----------------|
| **Web pública** | Cualquier visitante | Es la página principal, abierta a todos |
| **Zona de cliente** | Usuarios que pagaron (o con cuenta gratuita) | Se entra al iniciar sesión |
| **Zona de administración** | La dueña del negocio | Se entra al iniciar sesión |

La idea del negocio: un tutor visita la web, ve lecciones de muestra, se suscribe (6 meses
o 1 año), y a partir de ahí accede a **toda** la biblioteca de materiales para usarlos en
sus clases. La administradora sube y organiza las lecciones, escribe el blog, y lleva el
control de clientes e ingresos.

---

## 2. Conceptos base (vocabulario del sistema)

Antes de recorrer las pantallas, conviene entender algunas palabras que se repiten en toda
la plataforma:

- **Lección / material:** la unidad principal. Cada lección tiene un título, un nivel, una
  categoría, un tema (topic), una fecha, y un tipo de acceso (gratis o de pago). Puede
  incluir Google Slides, un plan en PDF, un video, un audio de Spotify y una imagen.

- **Categoría:** el *tipo* de lección. Hoy hay 6: *Podcast-Based Units, Story-Based Units,
  Grammar Speaking Lessons, Phrasal Verb Speaking Lessons, Pronunciations Lessons* y
  *Situational English*.

- **Nivel:** la dificultad, con su color propio y sus siglas europeas (CEFR). Hay 5:
  Beginner & Elementary (A1/A2), Intermediate (B1), Intermediate & Upper-Intermediate
  (B1/B2), Upper-Intermediate & Advanced (B2/C1) y Multilevel (B1/B2/C1). Cada nivel tiene
  un color de fondo fijo para reconocerlo de un vistazo.

- **Topic (tema):** de qué trata la lección: *Health & Wellness, Human Interest, Science &
  Technology, Arts & Entertainment, Business*. Existe además un "tema especial" llamado
  *Free Lessons* que en realidad sirve para filtrar por lecciones gratuitas.

- **Acceso: Free (gratis) o Paid (de pago).** No hay créditos ni compras sueltas: o la
  lección es de muestra gratuita, o forma parte de la biblioteca de pago.

- **Estado: Published (publicada) o Draft (borrador).** Una lección en borrador la puede
  ver la administradora pero no está lista para el público.

- **Suscripción:** el plan que compra el cliente. Hay 2: **6 meses** y **12 meses**. La
  única diferencia real entre ellos es el **tiempo de acceso** (y el precio); ambos dan
  acceso a *todo* el contenido.

- **Estado del cliente:** *Active* (suscripción vigente), *Expired* (venció) o *Free*
  (cuenta sin plan de pago).

---

## 3. La web pública (lo que ve cualquier visitante)

Todas las páginas públicas comparten la misma **estructura**: una **barra de navegación
arriba** (que se queda fija al hacer scroll) y un **pie de página abajo**. En el medio
cambia el contenido según la página.

### 3.1 Barra de navegación (Navbar)

Siempre visible arriba. Contiene:

- El **logo** (lleva al inicio).
- Enlaces: **All Lessons**, **Grammar Index**, **Resources** (con submenú), **Pricing**,
  **For Students**.
- **Resources** es un menú desplegable: al pasar el mouse (o enfocarlo con el teclado)
  muestra dos opciones: *Google Slides Tutorial* y *How to & Teaching Ideas*.
- A la derecha: botón **Log in** y botón **Sign up**.

### 3.2 Pie de página (Footer)

Aparece al final de cada página pública. Tiene el logo, una frase breve, íconos de redes
sociales (de momento decorativos) y dos columnas de enlaces:

- **Explore:** All Lessons, Grammar Index, Google Slides Tutorial, Method & Teaching Ideas,
  For Students, About.
- **Support:** FAQ, Privacy Policy, Terms of Service, Contact me.

### 3.3 Página de inicio (Home)

Es la portada. Está formada por varias secciones, en este orden:

1. **Hero (cabecera):** imagen de fondo grande con el mensaje principal ("Wow your ESL
   students with ZERO prep time") y un botón *Get free lessons*.
2. **Aviso para estudiantes:** una franja delgada y discreta que dice "¿Eres estudiante?"
   y lleva a la página *For Students*.
3. **What I Offer (qué ofrezco):** una imagen y una lista de los tipos de material
   (podcast, historias, phrasal verbs, gramática visual, pronunciación, etc.).
4. **How to use (cómo se usan):** título y espacio para un video explicativo.
5. **Stats (cifras):** tres cifras destacadas del negocio (con íconos).
6. **About (sobre mí):** presentación personal de la autora con foto y un enlace *"I must
   know more"* que lleva a la página About completa.
7. **Testimonials (testimonios):** opiniones de clientes.
8. **CTA final:** una llamada a la acción ("Ready for a Vacation from Lesson Prep?") con
   botón *Sign up*.

### 3.4 Página About (historia)

Se llega desde la sección "About me" del inicio. Cuenta la historia de origen del proyecto
en varias secciones: una carta de la autora, por qué nació la idea, qué hace diferentes a
estas lecciones y cómo llegó hasta aquí. Reutiliza la misma llamada a la acción final del
inicio.

### 3.5 All Lessons (biblioteca de lecciones)

El catálogo principal. Tiene:

- Un **buscador** por texto.
- **Filtros** (menús desplegables de selección múltiple): por **nivel** (siglas CEFR
  A1–C1), por **categoría** y por **topic**. Más un orden (por fecha, más antiguas,
  título A–Z).
- **Comportamiento inteligente:** si *no* hay filtros aplicados, la página muestra
  secciones curadas: **Free Lessons** (4 de muestra), **Most Recent** (4 recientes) y
  **All Lessons: Categories** (tarjetas hacia cada categoría). En cuanto el visitante
  escribe o filtra algo, la página cambia y muestra la lista de **resultados** que
  coinciden, con su conteo ("X lessons").
- Cada lección se muestra como una **tarjeta** (ver 3.6).

### 3.6 La tarjeta de lección (LessonCard)

Es la "ficha" que representa una lección en todo el sitio. Siempre tiene la misma forma
(misma altura), muestre lo que muestre:

- Etiqueta **Free** (estrella) o **Paid** (candado) arriba.
- Un ícono especial si la lección es parte de una **serie**.
- Imagen, título, **franja de color del nivel** con sus siglas, y los datos: categoría,
  topic y fecha.
- Un botón **Go to lesson** que abre el detalle.

Esta misma tarjeta se usa en: la biblioteca pública, las páginas de categoría, las
lecciones gratis y **la zona de cliente**. Por eso, cualquier mejora a la tarjeta se
refleja en todos esos lugares a la vez.

### 3.7 Páginas de categoría y de lecciones gratis

- Hay **una página por cada categoría** (6 en total) y **una página de Free Lessons**.
- Todas comparten el mismo diseño: cabecera con el título de la categoría, los **mismos
  filtros** que la biblioteca **pero sin el filtro de categoría** (porque ya estás dentro
  de una), y una cuadrícula de ~8 tarjetas.
- Al final incluyen la llamada a la acción de suscripción.

### 3.8 Detalle de una lección (vista pública)

Al abrir una lección, el visitante ve la información completa: título, etiquetas de
nivel/categoría/topic, descripción, objetivos y resumen, enlaces a los recursos (Google
Slides, plan de la lección), una vista previa y filas de video/audio. Debajo aparecen
**lecciones similares**, una sección de **comentarios** y una banda para **suscribirse al
newsletter**.

Como es la versión pública (visitante sin cuenta), el botón principal invita a **iniciar
sesión** para obtener la lección. La versión de cliente reutiliza este mismo bloque de
detalle pero con botones de descarga (ver zona de cliente).

### 3.9 Grammar Index (índice de gramática)

Una tabla que lista puntos gramaticales (Present Perfect, Conditionals, etc.), cada uno con
su nivel y uno o varios enlaces a lecciones relacionadas. Incluye un filtro por nivel
(B1/B2/C1). De momento los enlaces son de ejemplo.

### 3.10 Pricing (precios)

Muestra **exactamente los 2 planes reales**: **6 meses ($59)** y **12 meses ($99)**. El de
12 meses aparece destacado como "Best value". Cada tarjeta lista sus ventajas y un botón
*Subscribe now*. Los precios y las ventajas son provisionales y se cambian fácil en un solo
lugar.

### 3.11 Resources (recursos, 2 páginas)

Desde el menú Resources:

- **Google Slides Tutorial:** página con contenido fijo que explica cómo usar los Google
  Slides.
- **How to & Teaching Ideas:** una especie de blog, con tarjetas de artículos (título,
  categoría, autor y fecha). De momento son artículos de ejemplo.

### 3.12 For Students (para estudiantes)

Una página que aclara con amabilidad que **estos materiales son para que los enseñe un
tutor, no para autoestudio**, e invita al estudiante a **recomendárselos a su profesor**.
Incluye botones que **funcionan de verdad**: *Copiar el enlace* del sitio y *Enviar un
correo al tutor* (abre el correo con un mensaje ya escrito).

### 3.13 Páginas de soporte: FAQ, Privacy Policy, Terms of Service

- **FAQ:** preguntas frecuentes en formato **acordeón** (se despliega cada respuesta al
  hacer clic). Hay 7 preguntas; algunas respuestas son provisionales.
- **Privacy Policy** y **Terms of Service:** páginas legales con la misma cabecera y texto
  de relleno, listas para pegar el contenido real.

---

## 4. Registro e inicio de sesión (autenticación)

Estas pantallas se ven **sin** la barra de navegación ni el pie (son pantallas limpias, a
pantalla completa, con una imagen a un lado y el logo discreto en una esquina).

- **Log in (iniciar sesión):** pide correo y contraseña, valida que estén bien escritos y
  muestra mensajes de error si faltan. Al enviar, como es una **simulación, acepta
  cualquier correo/contraseña** y lleva al **panel de administración**. Incluye enlace a
  "Forgot password?" y a "Sign up".
- **Sign up (registrarse):** formulario de registro con validación y estados de error. Al
  completarlo lleva a la pantalla de inicio de sesión.
- **Forgot password (recuperar contraseña):** pantalla para pedir el correo de
  recuperación.

> **Pendiente para producción:** hoy iniciar sesión siempre lleva al panel de admin. Cuando
> haya backend, habrá que distinguir por rol: un **cliente** debe entrar a su zona (`/app`)
> y la **administradora** al panel (`/admin`), y proteger esas zonas para que no se pueda
> entrar sin permiso.

---

## 5. Zona de cliente (usuario que ya entró)

Es el área privada del cliente que pagó. Tiene un diseño propio: **una barra superior**
(distinta al panel de admin, que usa barra lateral). La barra superior tiene el logo y un
**menú de cuenta** (con las iniciales del usuario) que despliega: nombre y correo, "Account
& subscription" y "Log out".

Concepto clave: **todo cliente con suscripción tiene acceso a todo, siempre**. Por eso la
zona de cliente es simple y gira en torno a una sola pantalla: **Materials**.

### 5.1 Materials (biblioteca del cliente)

Es la pantalla principal del cliente. Muestra **todas las lecciones** disponibles usando la
**misma tarjeta** que la web pública. Incluye:

- Un **buscador** por texto.
- **Pestañas** para dividir el contenido: **All / Free / Paid**.
- **Carpetas (folders) para organizar:** una fila de "chips" para filtrar por carpeta
  (*All*, *Uncategorized*, y las carpetas que el cliente haya creado, cada una con su
  conteo). El cliente puede **crear** carpetas nuevas y **eliminarlas**.
- En **cada tarjeta** hay un pequeño selector de carpeta ("Add to folder") para archivar
  esa lección en la carpeta que quiera, o dejarla sin clasificar. La tarjeta se resalta
  cuando está guardada en una carpeta.

> Nota: antes existía una sección separada llamada "Library" (biblioteca de descargados).
> Se **eliminó** porque, al tener todos acceso a todo, era redundante. Ahora la organización
> por carpetas vive directamente dentro de Materials.

### 5.2 Detalle de material (vista de cliente)

Al abrir una lección desde Materials, el cliente ve **el mismo bloque de detalle** que la
web pública (descripción, objetivos, recursos, etc.), pero con un formato más limpio: **sin
lecciones similares, sin comentarios, sin newsletter ni pie**. En lugar del "inicia sesión"
del público, muestra:

- Botones **Download Google Slides** y **Download PDF plan** (de momento simulados).
- Una fila **Folder:** con el mismo selector para archivar la lección en una carpeta.
- Un enlace **"← Back to materials"** para volver.

### 5.3 Account (cuenta y suscripción)

Se llega desde el menú de cuenta. Tiene tres bloques:

- **Your details:** datos personales (nombre, correo).
- **Password:** cambio de contraseña.
- **Subscription:** el plan activo, su estado y la fecha de renovación.

Guardar muestra una confirmación (por ahora simulada).

---

## 6. Zona de administración (la dueña del negocio)

Es el panel de gestión. Tiene una **barra lateral fija** a la izquierda (se queda pegada
aunque el contenido haga scroll) con el logo, el menú y el botón de **Log out** abajo.

El menú lateral tiene: **Dashboard, Lessons, Taxonomy, Blog, Clients, Revenue.**

### 6.1 Dashboard (tablero de inicio)

Un resumen del estado del negocio, con:

- **Cuatro tarjetas de métricas:** total de **descargas de Google Slides**, total de
  **planes PDF descargados**, **suscripciones activas** (sobre el total de clientes) e
  **ingresos totales** (con el aumento del mes).
- Un **gráfico de descargas** de los últimos 6 meses (barras de Slides y de PDF).
- Un panel de **lecciones más descargadas** con barras de progreso.

### 6.2 Lessons (gestión de lecciones)

El corazón del panel. Muestra una **tabla** con todas las lecciones cargadas, con columnas:
**Title, Category, Level** (con su color), **Topic, Access** (Free/Paid), **Status**
(interruptor Published/Draft) y **Actions**.

Funciones:

- Botón **"+ New lesson"** que abre el **formulario** de creación.
- El **interruptor de estado** en la columna Status permite pasar una lección de borrador a
  publicada (y viceversa) directamente desde la tabla.
- En **Actions**, íconos para **editar** (abre el formulario ya rellenado) y **eliminar**
  (abre una **ventana de confirmación** antes de borrar).

**Formulario de lección** (crear o editar): un interruptor de estado, y campos para
**título, categoría, nivel, topic**, enlaces de **Google Slides / video / Spotify**, subida
de **PDF** e **imagen**, y campos de **descripción** y **objetivos/resumen**. Al guardar,
vuelve a la tabla mostrando un mensaje de confirmación (toast).

> **Muy importante — cómo se conecta con Taxonomy:** las opciones de **categoría, nivel y
> topic** que ofrece este formulario **no están fijas en el código**: salen de la sección
> **Taxonomy** (ver abajo). Si la administradora crea una categoría nueva allí, aparece
> automáticamente aquí para poder asignarla.

### 6.3 Taxonomy (gestión de categorías, niveles y topics) — *sección nueva*

Aquí se **administran las opciones** que alimentan el formulario de lecciones. Tiene tres
paneles:

- **Categories:** lista de categorías, con botón para **eliminar** cada una y un campo para
  **crear** nuevas.
- **Topics:** igual que categorías (crear/eliminar temas).
- **Levels:** cada nivel se muestra con su **insignia de color** y sus siglas CEFR. Para
  **crear** un nivel nuevo se indica el nombre, se eligen las **siglas CEFR** (botones
  A1–C1) y un **color** (con vista previa en vivo). También se puede **eliminar**.

Cada eliminación pasa por una **ventana de confirmación** (avisa que la opción dejará de
estar disponible para nuevas lecciones, pero que las lecciones existentes conservan su
valor). Las acciones muestran un **mensaje de confirmación**.

**Dónde impacta lo que se gestiona aquí:**
- En el **formulario de lecciones** (categoría, nivel y topic).
- En los **filtros de la web pública** (categorías y topics): si creas una categoría, también
  aparece como opción de filtro en el sitio.
- El filtro de **nivel** de la web sigue usando la escala CEFR estándar (A1–C1); los niveles
  que gestionas en Taxonomy son los "presets con color" que se asignan al crear la lección.

### 6.4 Blog (gestión de artículos)

Mismo patrón que Lessons: una **tabla** de artículos con su estado (Published/Draft) y
acciones, más un botón para crear, y un **formulario** con **título, texto e imagen**. Los
artículos alimentan el blog público (*How to & Teaching Ideas*).

### 6.5 Clients (clientes registrados)

Una **tabla de solo lectura** con los clientes: **nombre, correo, fecha de registro, plan,
estado** (Active/Expired/Free, con color) y **fecha de renovación**. Arriba, tres cifras
resumen: total de clientes, suscripciones activas y cuentas gratuitas. Incluye **buscador**
(por nombre o correo) y **filtros** por plan y por estado.

Estos datos combinan lo que vendría del **registro** (nombre, correo, fecha) y de la **zona
de cliente / pagos** (plan, estado, renovación).

### 6.6 Revenue (ingresos)

El control financiero, con la idea de que **PayPal es la fuente real del dinero** y aquí
solo se refleja:

- Una **tarjeta de conexión con PayPal** (botón "Connect PayPal" que simula conectarse).
- **Cuatro cifras:** ingresos totales, ingresos del mes, suscripciones activas y **MRR**
  (ingreso mensual estimado).
- Un **gráfico de ingresos por mes**.
- Una **tabla de transacciones** (fecha, cliente, plan, importe, estado —paid/refunded/
  failed— y referencia de PayPal), ordenada de la más reciente a la más antigua.

---

## 7. Cómo dependen unas piezas de otras (mapa en palabras)

Una de las cosas más importantes del proyecto es que **muchas pantallas comparten las
mismas piezas**. Esto significa que un cambio en una pieza compartida se ve reflejado en
todos los lugares que la usan. Estas son las conexiones clave:

### Piezas compartidas y quién las usa

- **La tarjeta de lección (LessonCard):** la usan la biblioteca pública, las páginas de
  categoría, las lecciones gratis y la pantalla Materials del cliente. → *Cambiar la
  tarjeta cambia todas esas vistas a la vez.*

- **El bloque de detalle de lección (contenido de la lección):** lo comparten el **detalle
  público** y el **detalle de cliente**. Cada uno le añade sus propios botones (el público
  "inicia sesión", el cliente "descargar"). → *La información de la lección se mantiene
  idéntica en ambos lados.*

- **Los filtros de lecciones (buscador + niveles/categorías/topics):** los usan la
  biblioteca "All Lessons", las páginas de categoría y las de lecciones gratis. Las páginas
  de categoría los usan **ocultando el filtro de categoría**.

- **La cabecera de página (PageHeader):** el mismo encabezado con título y subtítulo se usa
  en About, All Lessons, For Students, FAQ, legales, etc. Solo cambia el texto.

- **Los botones (Button):** un único componente con 3 estilos —naranja (principal), verde
  oscuro (secundario) y contorno (terciario)— usado en toda la plataforma.

- **Las ventanas de confirmación, los mensajes (toasts) y los interruptores de estado:** son
  piezas compartidas del panel de admin, reutilizadas en Lessons, Blog y Taxonomy.

### Las tres "fuentes de la verdad" (datos centrales)

1. **La lista de rutas:** todas las direcciones de la web (URLs) están definidas en **un solo
   lugar**. Los menús, botones y enlaces apuntan a esa lista, así nunca quedan desincronizados.

2. **La taxonomía (categorías, niveles, topics):** definida en **un solo lugar** que
   alimenta tanto el **formulario de lecciones** del admin como los **filtros públicos**.
   *(Ver 6.3.)*

3. **Las carpetas del cliente:** la organización por carpetas de Materials vive en **un solo
   lugar** de memoria; por eso al archivar una lección en una carpeta, el conteo de los chips
   y el estado de la tarjeta se actualizan juntos y al instante.

### El flujo del negocio, de punta a punta

1. La administradora **crea las opciones** en *Taxonomy* (categorías, niveles, topics).
2. Con esas opciones, **sube lecciones** en *Lessons* (borrador o publicada).
3. Las lecciones publicadas aparecen en la **web pública** (biblioteca, categorías, gratis)
   y se pueden **filtrar y buscar**.
4. Un visitante ve las muestras, va a **Pricing** y **se registra / suscribe**.
5. Ya como cliente, entra a su zona y usa **Materials** para ver, abrir, descargar y
   **organizar en carpetas** todas las lecciones.
6. La administradora sigue el negocio desde **Dashboard** (uso), **Clients** (quién es quién)
   y **Revenue** (dinero, vía PayPal).

---

## 8. Diseño y marca (cómo debe verse)

- **Colores:** naranja de marca (#FF991C), verde suave de acento (#C2D1B8) y un marrón
  oscuro para el texto (#27170C). Cada **nivel** tiene además su propio color de insignia.
- **Tipografías:** *Poppins* para los títulos e *Inter* para el texto corrido.
- **Sensación general:** limpia, cálida y profesional; con imágenes destacadas y botones
  claros. Las imágenes que aún faltan aparecen como marcadores de posición.

---

## 9. Qué es real y qué falta (estado actual)

**Ya funciona (a nivel de interfaz y navegación):**
- Toda la web pública, con búsqueda, filtros y navegación entre páginas.
- Registro/inicio de sesión con validaciones (simulado).
- Zona de cliente: Materials con pestañas, buscador, carpetas y detalle.
- Panel de admin completo: Dashboard, Lessons (crear/editar/eliminar/publicar), Taxonomy,
  Blog, Clients (con filtros) y Revenue.
- Piezas compartidas y consistentes en todo el sitio.

**Pendiente para producción (requiere backend / decisiones):**
- **Conectar un servidor y base de datos** para que los datos sean reales y permanentes
  (hoy todo se reinicia al recargar).
- **Autenticación real y por roles:** que el cliente entre a su zona y la administradora al
  panel, con las zonas protegidas.
- **Pagos reales con PayPal** y sincronización de transacciones/suscripciones.
- **Subidas reales de archivos** (Slides, PDF, imágenes) y **descargas** reales.
- **Analíticas reales** para el Dashboard (descargas, top lecciones).
- Rellenar los **textos definitivos** (legales, FAQ, artículos) y **cargar las imágenes**.
- Definir si al **crear una categoría** también debe generarse su **página pública propia**.

---

*Documento descriptivo del estado actual de la plataforma. A medida que se añadan
funcionalidades, conviene mantenerlo actualizado.*
