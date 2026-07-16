# 🏗️ Screaming Architecture Guide

> **"Your architecture should tell readers about the system, not about the frameworks you used."** - Robert C. Martin (Uncle Bob)

## 📖 Qué es Screaming Architecture

**Screaming Architecture** es un patrón arquitectónico donde la estructura del proyecto "grita" sobre qué hace el negocio, no sobre qué herramientas técnicas utiliza. En lugar de organizar el código por capas técnicas (components/, pages/, hooks/), lo organizamos por **funcionalidades de negocio** (auth/, dashboard/, payments/).

### ❌ Arquitectura Tradicional por Capas Técnicas

```
src/
├── components/     # ¿Qué hacen estos componentes?
├── pages/          # ¿Qué páginas?
├── hooks/          # ¿Para qué funcionalidad?
├── services/       # ¿Qué servicios?
└── utils/          # ¿Utilidades de qué?
```

### ✅ Screaming Architecture por Dominio de Negocio

```
src/
├── features/
│   ├── auth/           # 🔐 AUTENTICACIÓN - ¡Inmediatamente claro!
│   ├── dashboard/      # 📊 DASHBOARDS - ¡Se entiende al instante!
│   ├── payments/       # 💳 PAGOS - ¡Funcionalidad evidente!
│   └── reports/        # 📈 REPORTES - ¡Dominio específico!
├── shared/            # Código reutilizable entre features
└── config/            # Configuración de la aplicación
```

---

## 🎯 Beneficios de Screaming Architecture

### 1. **Claridad de Negocio**

- Un desarrollador nuevo puede entender inmediatamente qué hace la aplicación
- Los stakeholders pueden navegar y entender la estructura
- Facilita la comunicación entre equipos técnicos y de negocio

### 2. **Escalabilidad de Equipos**

- Equipos diferentes pueden trabajar en features independientes
- Reducción de conflictos de merge
- Desarrollo paralelo más eficiente

### 3. **Mantenimiento Simplificado**

- Bugs y cambios están localizados en su dominio
- Testing más enfocado y específico
- Refactoring por feature vs. por capa técnica

### 4. **Evolución Independiente**

- Features pueden evolucionar a su propio ritmo
- Tecnologías diferentes por feature si es necesario
- Deprecación gradual de funcionalidades

---

## 🏛️ Arquitectura del Proyecto

### Estructura General

```
src/
├── 🎯 features/           # CORAZÓN: Funcionalidades de negocio
├── 🔄 shared/            # Componentes y utilidades reutilizables
├── ⚙️  config/            # Configuración y constantes
├── 🛣️  router/            # Configuración de rutas
├── 🏪 store/             # Estado global (Zustand)
├── 🌐 service/           # Servicios de API
├── 📝 interface/         # Tipos TypeScript
├── 🎨 layout/            # Layouts de la aplicación
├── 🪝 hooks/             # Custom hooks globales
└── 🛠️  utils/            # Utilidades generales
```

### Estructura de Feature

```
features/
├── auth/                 # 🔐 Feature de Autenticación
│   ├── components/       # Componentes específicos de auth
│   │   ├── SignInForm.tsx
│   │   ├── SignUpForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── pages/           # Páginas de auth
│   │   ├── SignInPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── hooks/           # Hooks específicos de auth (opcional)
│   │   └── useAuthForm.ts
│   ├── services/        # Servicios API específicos (opcional)
│   │   └── auth.service.ts
│   ├── types/           # Tipos específicos de auth (opcional)
│   │   └── auth.types.ts
│   └── index.ts         # 📤 API pública del feature
├── dashboard/           # 📊 Feature de Dashboard
│   ├── components/
│   ├── pages/
│   └── index.ts
└── payments/            # 💳 Feature de Pagos (futuro)
    ├── components/
    ├── pages/
    └── index.ts
```

---

## 📋 Principios de Implementación

### 1. **Independencia de Features**

```typescript
// ✅ CORRECTO: Feature importa de shared
import { Button } from '../../shared/components';

// ✅ CORRECTO: Feature importa de otro feature por API pública
import { useAuth } from '../auth';

// ❌ INCORRECTO: Feature importa componente interno de otro feature
import { SignInForm } from '../auth/components/SignInForm';
```

### 2. **API Pública de Features**

Cada feature expone solo lo necesario a través de `index.ts`:

```typescript
// features/auth/index.ts
export { SignInPage, SignUpPage } from './pages';
export { useAuth } from './hooks';
export type { User, AuthState } from './types';

// ❌ NO exportar componentes internos
// export { SignInForm } from './components';
```

### 3. **Separación Shared vs Feature**

```typescript
// shared/components/ - Reutilizable entre features
export const Button = ({ children, variant, ...props }) => (
  <button className={`btn btn-${variant}`} {...props}>
    {children}
  </button>
);

// features/auth/components/ - Específico de autenticación
export const SignInForm = () => {
  const { signIn } = useAuth(); // Lógica específica de auth
  return (
    <form>
      <Button variant="primary">Iniciar Sesión</Button> {/* Usa shared */}
    </form>
  );
};
```

---

## 🔧 Stack Tecnológico

### Frontend

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool y dev server
- **React Router DOM 7** - Enrutamiento
- **Tailwind CSS 4** - Estilos utility-first

### Estado y Datos

- **Zustand** - Estado global
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP

### Calidad de Código

- **ESLint** - Linting
- **Prettier** - Formateo de código

---

## 🗂️ Organización por Roles

La aplicación soporta tres tipos de usuarios con dashboards específicos:

### 🔐 Rutas Públicas

```typescript
export const PUBLIC_ROUTES = {
  HOME: '/', // Landing page
  SIGNIN: '/signin', // Inicio de sesión
  SIGNUP: '/signup', // Registro
} as const;
```

### 🛡️ Rutas Protegidas

```typescript
export const PRIVATE_ROUTES = {
  DASHBOARD: {
    ADMIN: '/admin', // Dashboard administrativo
    USER: '/dashboard', // Dashboard de usuario
    BUSINESS: '/business', // Dashboard de negocio
  },
} as const;
```

---

## 🚀 Cómo Implementar Nuevas Features

### Paso 1: Crear Estructura de Feature

```bash
mkdir -p src/features/nueva-feature/{components,pages,hooks,services,types}
touch src/features/nueva-feature/index.ts
```

### Paso 2: Implementar Componentes

```typescript
// src/features/nueva-feature/components/ComponenteEjemplo.tsx
export const ComponenteEjemplo = () => {
  return <div>Nuevo componente</div>;
};
```

### Paso 3: Crear Páginas

```typescript
// src/features/nueva-feature/pages/PaginaEjemplo.tsx
import { ComponenteEjemplo } from '../components';

export const PaginaEjemplo = () => {
  return (
    <div>
      <h1>Nueva Feature</h1>
      <ComponenteEjemplo />
    </div>
  );
};
```

### Paso 4: Configurar API Pública

```typescript
// src/features/nueva-feature/index.ts
export { PaginaEjemplo } from './pages';
export { ComponenteEjemplo } from './components';
```

### Paso 5: Agregar Rutas

```typescript
// src/config/routes.constants.ts
export const APP_ROUTES = {
  // ... rutas existentes
  NUEVA_FEATURE: '/nueva-feature',
} as const;
```

### Paso 6: Configurar Router

```typescript
// src/router/index.tsx
import { PaginaEjemplo } from '../features/nueva-feature';

// Agregar ruta al router
```

---

## 📊 Estado Global vs Local

### Estado Global (Zustand)

- **Auth Store**: Información del usuario autenticado
- **Global Store**: UI state, notificaciones, tema

```typescript
// ✅ Usar para estado que necesitan múltiples features
const { user, isAuthenticated } = useAuthStore();
const { theme, notifications } = useGlobalStore();
```

### Estado Local (React Hook Form, useState)

```typescript
// ✅ Usar para estado específico de componente
const [isLoading, setIsLoading] = useState(false);
const { register, handleSubmit } = useForm();
```

---

## 🎨 Sistema de Diseño

### Componentes Shared

Los componentes en `shared/components/` deben ser:

- **Genéricos**: Sin lógica de negocio específica
- **Reutilizables**: Utilizables por múltiples features
- **Configurables**: A través de props

```typescript
// ✅ Componente shared genérico
export const FormField = ({ label, error, required, ...props }) => (
  <div className="form-field">
    <label>{label} {required && '*'}</label>
    <input {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

// ✅ Uso en feature específico
export const SignInForm = () => (
  <form>
    <FormField
      label="Email"
      required
      type="email"
      // Lógica específica de auth aquí
    />
  </form>
);
```

---

## 🔒 Manejo de Autenticación

### Flujo de Autenticación

1. **Login**: `authService.signIn()` → `authStore.signIn()` → Redirigir por rol
2. **Registro**: `authService.signUp()` → `authStore.signUp()` → Redirigir por rol
3. **Logout**: `authService.logout()` → `authStore.logout()` → Limpiar tokens
4. **Token Refresh**: Automático en interceptor de Axios

### Protección de Rutas

```typescript
// Hook useAuth proporciona info del usuario
const { isAuthenticated, user, isAdmin, isUser, isBusiness } = useAuth();

// Redirigir según rol
if (user?.role === 'admin') {
  navigate(APP_ROUTES.PRIVATE.DASHBOARD.ADMIN);
}
```

---

## 🧪 Testing Strategy

### Testing por Feature

```bash
src/
├── features/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── SignInForm.test.tsx
│   │   │   ├── auth.service.test.ts
│   │   │   └── useAuth.test.ts
│   │   └── ...
```

### Tipos de Tests

- **Unit Tests**: Componentes individuales
- **Integration Tests**: Flujos completos de features
- **E2E Tests**: User journeys completos

---

## 📈 Performance y Optimización

### Code Splitting por Feature

```typescript
// Router con lazy loading
const AuthFeature = lazy(() => import('../features/auth'));
const DashboardFeature = lazy(() => import('../features/dashboard'));
```

### Bundle Analysis

- Separar vendor chunks
- Lazy load features no críticos
- Preload assets críticos

---

## 🔮 Roadmap y Expansión

### Features Planificados

```
features/
├── ✅ auth/           # COMPLETADO
├── ✅ landing/        # COMPLETADO
├── 🚧 dashboard/      # EN DESARROLLO
├── 📋 profile/        # PLANEADO - Gestión de perfil
├── 📊 reports/        # PLANEADO - Sistema de reportes
├── 💳 payments/       # PLANEADO - Procesamiento de pagos
├── 📧 notifications/  # PLANEADO - Sistema de notificaciones
└── ⚙️  settings/       # PLANEADO - Configuraciones
```

### Criterios de Nuevas Features

1. **Dominio claro**: ¿Es una funcionalidad de negocio específica?
2. **Independencia**: ¿Puede desarrollarse sin modificar otras features?
3. **API definida**: ¿Qué necesita exponer a otras features?
4. **Responsabilidad única**: ¿Tiene una responsabilidad clara y acotada?

---

## ✅ Checklist para Nuevas Features

### Estructura

- [ ] Carpetas creadas: `components/`, `pages/`, `index.ts`
- [ ] API pública definida en `index.ts`
- [ ] Tipos TypeScript si es necesario
- [ ] Servicios API si es necesario

### Implementación

- [ ] Componentes implementados
- [ ] Páginas creadas
- [ ] Rutas configuradas
- [ ] Estado global si es necesario

### Integración

- [ ] Imports solo de APIs públicas
- [ ] No dependencias directas entre features
- [ ] Tests implementados
- [ ] Documentación actualizada

---

## 🤝 Contribución

### Reglas de Desarrollo

1. **Una feature, un PR**: Cada feature en su propio pull request
2. **API First**: Definir la API pública antes de implementar
3. **Tests obligatorios**: Toda feature debe incluir tests
4. **Documentación**: Actualizar este documento con cambios

### Code Review Checklist

- [ ] ¿La feature tiene una responsabilidad clara?
- [ ] ¿Respeta las APIs públicas de otras features?
- [ ] ¿Los nombres de archivos y carpetas son descriptivos?
- [ ] ¿Incluye tests adecuados?
- [ ] ¿Sigue las convenciones de código establecidas?

---

## 📚 Recursos Adicionales

### Lecturas Recomendadas

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)

### Herramientas Útiles

- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Zustand DevTools](https://github.com/pmndrs/zustand#devtools)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

---

**¡Tu código debe gritar sobre el negocio, no sobre las herramientas! 🎯**
