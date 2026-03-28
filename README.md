# 🚀 Spacehack 2026 - Asistente Virtual 3D

**Descripción**: Aplicación interactiva con personaje 3D flotante que responde mensajes en tiempo real. Utiliza React 19, Three.js y modelos 3D (.glb) configurables.

---

## 🎯 Inicio Rápido

### 1. Instalación

```bash
npm install
npm run dev
```

Accede a `http://localhost:3000/demo` para ver el personaje 3D en acción.

### 2. Cambiar el Modelo 3D

```bash
# 1. Exporta tu modelo desde Blender como .glb (con animaciones)
# 2. Coloca en: public/models/TuModelo.glb
# 3. En el código: <FloatingCharacter3D modelPath="/models/TuModelo.glb" />
```

👉 **Guía completa**: Ver `PERSONAJE_3D_SETUP.md`

### 3. Ver la Estructura del Proyecto

```bash
# Explora la arquitectura de carpetas y componentes
```

👉 **Estructura detallada**: Ver `CARPETAS_ESTRUCTURA.md`

---

## 📦 Compilación

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start
```

---

## 🦊 Personaje 3D - Lo Esencial

El módulo de personaje 3D permite:

- ✅ Cargar cualquier modelo .glb (no solo Fox)
- ✅ Animaciones automáticas detectadas
- ✅ Burbuja de chat responsive (móvil + desktop)
- ✅ Posicionamiento flexible (4 esquinas)

**Ubicación del módulo**: `src/features/character/`

**Componente principal**:

```jsx
<FloatingCharacter3D
  modelPath="/models/MiModelo.glb" // Tu modelo
  position="bottom-right" // Esquina
  size="md" // sm, md, lg
  isAnimating={isAnimating}
  message={activeMessage}
/>
```

---

## 🗂️ Estructura Principal

```
src/
├── features/
│   └── character/          ⭐ MÓDULO 3D
│       ├── components/     (FloatingCharacter3D, GenericModel, ChatBubble)
│       ├── hooks/          (useSatelliteMessages)
│       └── *.md            (Documentación completa)
├── routes/
│   └── demo/               (Página de demostración)
└── ...
```

👉 **Ver `CARPETAS_ESTRUCTURA.md` para detalles completos**

---

## 📚 Documentación

| Documento                                            | Propósito                                |
| ---------------------------------------------------- | ---------------------------------------- |
| **PERSONAJE_3D_SETUP.md**                            | Cómo usar el personaje, animaciones, GLB |
| **CARPETAS_ESTRUCTURA.md**                           | Estructura de carpetas y componentes     |
| **src/features/character/START_HERE.md**             | Entrega del módulo refactorizado         |
| **src/features/character/HOW_TO_CHANGE_MODEL.md**    | Cambiar modelo en 3 pasos                |
| **src/features/character/CHARACTER_MODULE_GUIDE.md** | Arquitectura interna completa            |

---

## 🔧 Scripts Disponibles

```bash
npm run dev        # Desarrollo local
npm run build      # Compilar para producción
npm run start      # Ejecutar en producción
npm run test       # Ejecutar tests (Vitest)
npm run lint       # Verificar estilos (ESLint)
npm run format     # Formatear código (Prettier)
npm run check      # Lint + Format
```

---

## 🎨 Tecnologías

- **Frontend**: React 19.2, TypeScript
- **UI**: Tailwind CSS 4
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **Build Tool**: Vite 7.3
- **Testing**: Vitest

---

## 📞 ¿Por Dónde Empiezo?

### Si quieres...

- **Cambiar el modelo 3D** → Lee `PERSONAJE_3D_SETUP.md`
- **Entender la estructura** → Lee `CARPETAS_ESTRUCTURA.md`
- **Usar el personaje en código** → Lee `src/features/character/START_HERE.md`
- **Debuggear/personalizar** → Lee `src/features/character/CHARACTER_MODULE_GUIDE.md`

---

## ✅ Estado del Proyecto

- ✅ Personaje 3D flotante funcional
- ✅ Módulo standalone y exportable
- ✅ Mobile-first responsive design
- ✅ Build sin errores
- ✅ Completamente documentado

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
