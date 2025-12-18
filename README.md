# Documentación general del proyecto workflowdynamic.
<div align="center">
  <img src="https://github.com/user-attachments/assets/01892202-2264-4946-b9c2-c0f366d659a3" alt="GALAXY_LOGOTIPO" width="200"/>
</div>

<hr>

<p align="center">
    <img src="http://img.shields.io/static/v1?label=STATUS&message=EN%20DESARROLLO&color=RED&style=for-the-badge"/>
</p>

### Temas

- [Funcionalidad](#funcionalidad)
- [Herramientas utilizadas](#herramientas-utilizadas)
- [Abrir y probar el proyecto](#abrir-y-probar-el-proyecto)
- [Desarrolladores](#desarrolladores)

---

## Funcionalidad

* **Gestión de Usuarios:** Autenticación completa con registro, inicio de sesión y perfiles de usuario.
* **Workflow dinamico:** Permite la personalizacion del flujo de trabajo.
* **Formularios:** Permite poder registrar los datos al sistema.
* **Notificaciones:** Permite notificar a los usuarios del estado de la solicitud.
* **Manejo de estados:** Permite tener distintos estados en el flujo de trabajo.

---

## Herramientas utilizadas

Este proyecto se construye sobre un stack de tecnologías modernas de JavaScript, seleccionadas para ofrecer una experiencia de desarrollo eficiente y un producto final robusto y escalable.

| Logo | Descripción |
| :--- | :--- |
| <img src="https://cdn.worldvectorlogo.com/logos/next-js.svg" width="90" alt="Next.js logo"> | **[Next.js](https://nextjs.org/)** - Como framework principal de React, nos proporciona la estructura para construir una interfaz de usuario rápida, optimizada para SEO y con renderizado tanto del lado del servidor (SSR) como del cliente. |
| <img src="https://media2.dev.to/dynamic/image/width=320,height=320,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Forganization%2Fprofile_image%2F8065%2Fd559bbad-1732-4020-82c4-ad689dbdbc5d.png" width="90" alt="Convex logo"> | **[Convex](https://convex.dev/)** - Es nuestra plataforma de backend en tiempo real. Gestiona la base de datos, las queries y mutations de forma reactiva, simplificando la lógica del estado global y la sincronización de datos. |
| <img src="https://imgix.cosmicjs.com/9d8bc340-e63d-11ee-b074-b5c8fe3ef189-clerk.webp?w=1200&auto=compress" width="90" alt="Clerk logo"> | **[Clerk](https://clerk.com/)** - Se encarga de toda la autenticación y gestión de usuarios. Proporciona componentes de UI listos para usar y una infraestructura segura para el inicio de sesión, registro y manejo de perfiles. |
| <img src="https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" width="90" alt="Tailwind CSS logo"> | **[Tailwind CSS](https://tailwindcss.com/)** - El framework de CSS que utilizamos para el diseño visual. Su enfoque *utility-first* nos permite construir interfaces complejas y personalizadas directamente en el marcado HTML. |
| <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" width="90" alt="shadcn/ui logo"> | **[shadcn/ui](https://ui.shadcn.com/)** - Una colección de componentes de UI reutilizables, bellamente diseñados y accesibles, construidos sobre Tailwind CSS para acelerar el desarrollo de la interfaz sin sacrificar la personalización. |
| <img src="https://avatars.githubusercontent.com/u/78935958?s=280&v=4" width="90" alt="Inngest logo"> | **[Inngest](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi4wIuEx8eRAxXcKkQIHTrkKuAQFnoECBkQAQ&url=https%3A%2F%2Ftranslate.google.com%2Ftranslate%3Fu%3Dhttps%3A%2F%2Fwww.inngest.com%2F%26hl%3Des%26sl%3Den%26tl%3Des%26client%3Dsrp&usg=AOvVaw0ROdlvPAuFSsvpzbTgM-HB&opi=89978449)** - Se integra para la gestión avanzada del workflow. |
| <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxNBM-OibWMfd4NjKStb1NfmwnxKbMhZ6N2A&s" width="90" alt="Sanity logo"> | **[Sanity](https://www.sanity.io)** - Se integra para la generacion automatica de formularios. |

---

## Abrir y probar el proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### **1. Prerrequisitos**

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18.x o superior) y el gestor de paquetes de tu elección (`npm`, `yarn` o `pnpm`).

### **2. Clonar el repositorio**

```bash
  git clone https://github.com/Franck-G-Tech/workflowdynamic.git
```

### **3. Navega a la carpeta del proyecto**
```bash
  cd workflowdynamic
```

### **4. Instalar dependencias**
```bash
  pnpm install
```

### **5. Crear .env para el proyecto e ingresar sus respectivar variables**
```bash
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
```

### **6. cargamos la configuracion a convex**
```bash
  pnpm dlx convex dev
```

### **7. Ejecutamos el proyecto**
```bash
  pnpm run dev
```

## Desarrolladores

Este proyecto fue creado con la colaboración de los siguientes desarrolladores.

| Nombre | GitHub |
| :--- | :---: |
| **BrayanNavaGTech** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BrayanNavaGTech) |
| **MarioLiraGTech** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarioLiraGTech) |
| **Franck-G-Tech** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Franck-G-Tech) |
| **JesusAldaco** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JesusAldaco) |
| **Yahir-toronja** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Yahir-toronja) |
