# NAEVCO — Solución Técnica

Qué es exactamente el producto, cómo funciona, qué implica y qué construimos.

---

## La solución en una frase

**NAEVCO es un dashboard geoespacial que convierte datos satelitales y de cadena de suministro en scores de emisiones verificados para corredores logísticos multimodales — en tiempo casi real y sin depender de datos auto-reportados.**

No es un mapa bonito. Es un sistema de inteligencia que toma señales del espacio, las correlaciona con actividad logística real, y las convierte en métricas accionables para tres tipos de usuario.

---

## Cómo funciona: el flujo de datos

```
FUENTES DE DATOS
      │
      ├── Sentinel-5P (ESA) ─────── NO₂ troposférico global, resolución 5.5km, diario
      ├── VIIRS (NOAA) ──────────── Luz nocturna, resolución 500m, mensual
      ├── AIS ───────────────────── Posición de barcos en tiempo real / histórico
      ├── World Port Index ───────── Características de 3,700 puertos
      └── OECD / IMO DCS ─────────── Línea base de emisiones declaradas
             │
             ▼
      CAPA DE PROCESAMIENTO (Google Earth Engine + Python)
             │
      ├── Filtrado de calidad (qa_value > 0.75, enmascarado de nubes)
      ├── Correlación de señal NO₂ con geometría de corredores AIS
      ├── Comparación valor observado vs. baseline histórico por zona
      ├── Cálculo de score por segmento (marítimo / puerto / terrestre)
      └── Detección de anomalías (spike de NO₂ no explicado por tráfico declarado)
             │
             ▼
      BASE DE DATOS (PostGIS + TimescaleDB)
             │
      ├── Series temporales de scores por corredor y por puerto
      ├── Snapshots mensuales de datos satelitales procesados
      ├── Geometrías de corredores y polígonos de puertos
      └── Metadata de barcos y rutas (AIS)
             │
             ▼
      API (FastAPI)
             │
      ├── /corridors → lista y scores de corredores activos
      ├── /corridors/{id}/timeseries → evolución histórica del score
      ├── /ports/{id}/score → score actual del puerto
      ├── /alerts → anomalías detectadas en las últimas 24-72h
      └── /reports/{id} → reporte PDF generado on-demand
             │
             ▼
      FRONTEND — 3 vistas según tipo de usuario
      ├── Vista Shipper: mis rutas, mis scores, mis alertas
      ├── Vista Puerto: mi benchmark vs. competidores
      └── Vista Analista: exploración libre de datos, consultas ad-hoc
```

---

## Las 4 capas del producto (lo que el usuario realmente toca)

### Capa 1 — El Globo (la vista que impacta)

Un globo 3D interactivo que muestra el mundo logístico en tiempo real:

- **Capa de NO₂**: heatmap semitransparente sobre el océano y puertos, en escala de color de azul (limpio) a rojo (alta contaminación)
- **Capa de rutas**: líneas de los corredores logísticos con color dinámico según su score verde
- **Capa de puertos**: puntos con tamaño proporcional al tráfico y color según su score
- **Capa VIIRS**: intensidad de actividad nocturna en zonas portuarias
- El usuario puede encender/apagar capas, navegar en el tiempo (slider de meses), y hacer zoom sobre cualquier zona

**Tecnología:** Deck.gl con GlobeView + Mapbox GL o Google Maps como base

---

### Capa 2 — El Score Card (lo que el cliente compra)

Para cada corredor o puerto, una ficha detallada:

```
┌─────────────────────────────────────────────────────┐
│  CORREDOR: Shanghai → Rotterdam                      │
│  Período: Enero 2025                                 │
├─────────────────────────────────────────────────────┤
│  SCORE GLOBAL:  66 / 100   ████████░░░░  REGULAR    │
├─────────────────────────────────────────────────────┤
│  Tramo marítimo        72 / 100  ████████░░  ✓      │
│  Puerto Shanghai       45 / 100  █████░░░░░  ⚠ HOT  │
│  Puerto Rotterdam      88 / 100  █████████░  ✓      │
│  Corredor terrestre    61 / 100  ██████░░░░  ~       │
├─────────────────────────────────────────────────────┤
│  BOTTLENECK DETECTADO: Puerto Shanghai               │
│  NO₂ observado: 0.000198 mol/m²                     │
│  NO₂ esperado para este tráfico: 0.000130 mol/m²    │
│  Exceso: +52% → posible operación sin cold ironing  │
├─────────────────────────────────────────────────────┤
│  Tendencia: ↓ Empeoró 8 puntos vs. mes anterior     │
│  [Ver gráfico histórico]  [Descargar reporte PDF]   │
└─────────────────────────────────────────────────────┘
```

---

### Capa 3 — El Feed de Alertas (lo que genera urgencia)

Sistema de notificaciones en tiempo cuasi-real:

- **Alerta roja:** "El barco MSC OSCAR declaró uso de biocombustible en el tramo Mediterráneo pero el NO₂ observado en su ruta el 15 de enero excede en 3 desviaciones estándar el perfil de biocombustible."
- **Alerta amarilla:** "Puerto de Shanghái registra el nivel de NO₂ más alto en 6 meses en la última semana."
- **Alerta verde:** "Puerto de Rotterdam redujo su score de emisiones 12 puntos en Q4 2024 — posiblemente por la nueva terminal de cold ironing."

Estas alertas son el producto más valioso: nadie las tiene hoy. Son verificación independiente en tiempo real.

---

### Capa 4 — El Reporte (lo que el cliente presenta a sus auditores)

PDF auto-generado que incluye:
- Score del período con metodología explicada
- Comparación vs. industria (percentil)
- Mapa del corredor con overlay de NO₂
- Firma metodológica NAEVCO
- Listo para adjuntar en reportes CSRD / SEC / ESG

---

## Qué implica técnicamente: el stack completo

### Frontend
```
React 18
├── Deck.gl 9 (globo 3D, capas geoespaciales)
├── Recharts / Tremor (gráficos de series temporales y scores)
├── TailwindCSS (UI rápida y limpia)
├── React Query (estado del servidor, caché de API calls)
└── Mapbox GL JS (tiles de mapa base)
```

**Por qué Deck.gl:** Es el único framework que maneja millones de puntos geoespaciales en WebGL con 60fps. Uber lo construyó para esto exactamente. Tiene GlobeView nativo.

---

### Backend
```
Python 3.11
├── FastAPI (API REST, async, rápido de desarrollar)
├── SQLAlchemy + GeoAlchemy2 (ORM con soporte espacial)
├── Celery + Redis (tareas asíncronas para procesamiento GEE)
├── earthengine-api (conexión con Google Earth Engine)
└── ReportLab / WeasyPrint (generación de PDFs)
```

---

### Base de datos
```
PostgreSQL 15
├── PostGIS (extensión espacial — queries como ST_Within, ST_Buffer)
└── TimescaleDB (extensión de series temporales — queries de tendencia rápidas)
```

**Por qué PostGIS:** Almacenar geometrías de rutas y puertos, hacer buffers y intersecciones directamente en SQL es 10x más rápido que hacerlo en Python.

---

### Procesamiento de datos
```
Google Earth Engine Python API
├── Sentinel-5P OFFL NO₂ → procesamiento de imágenes satelitales
├── VIIRS VCMSLCFG → nighttime lights
└── JRC Global Surface Water → máscara agua/tierra
```

---

### Infraestructura
```
Google Cloud Platform
├── Cloud Run (deploy del backend — serverless, escala a cero cuando no hay uso)
├── Cloud SQL (PostgreSQL managed)
├── Cloud Storage (almacenamiento de GeoTIFFs exportados de GEE)
├── Cloud Scheduler (trigger del procesamiento mensual automático)
└── Firebase Hosting (deploy del frontend — CDN global)
```

**Por qué GCP:** La integración con GEE es nativa. No hay latencia adicional por estar en el mismo ecosistema de Google.

---

### Extras creativos (si hay tiempo)

**Asistente virtual 3D (tu idea):**
```
Three.js + React Three Fiber → modelo 3D del personaje
Web Speech API → texto a voz
Claude API (claude-haiku-4-5) → inteligencia del asistente
```

El asistente recibe contexto del corredor que el usuario está mirando y explica en lenguaje natural qué significa el score, por qué hay una alerta, y qué acción recomienda. No es un chatbot genérico — está conectado a los datos de NAEVCO en tiempo real.

Ejemplo de lo que diría:
> *"El corredor Shanghai-Rotterdam empeoró este mes. El problema está en el puerto de origen: detectamos un 52% más de NO₂ de lo esperado para el volumen de tráfico declarado. Probablemente los barcos están corriendo sus motores auxiliares en lugar de usar la electricidad del puerto. Si tu empresa tiene una cláusula de cold ironing en el contrato con tu naviera, este dato es evidencia para activarla."*

Eso transforma datos complejos en acción concreta. Ese es el valor del asistente.

---

## Lo que construimos en 2 días (hackathon)

### Día 1 — La base

**Mañana:**
- [ ] Setup del proyecto: React + FastAPI + PostgreSQL local
- [ ] Cargar WPI en base de datos (puertos con coordenadas)
- [ ] Definir los 3 corredores en `corredores.py`

**Tarde:**
- [ ] Procesar y cachear datos de Sentinel-5P para los 3 corredores (1 mes de datos = suficiente para demo)
- [ ] Procesar y cachear VIIRS para los 3 puertos principales
- [ ] Calcular scores y guardar en PostgreSQL

**Noche:**
- [ ] API con 3 endpoints funcionando: `/corridors`, `/corridors/{id}`, `/ports/{id}/score`
- [ ] Globo 3D básico en frontend con la ruta Shanghai-Rotterdam visible

---

### Día 2 — El producto

**Mañana:**
- [ ] Integrar la capa de NO₂ en el globo (heatmap real con datos procesados)
- [ ] Score Card funcional con datos reales
- [ ] Feed de alertas (aunque sea hardcodeado para el demo)

**Tarde:**
- [ ] Serie temporal de score (gráfico de 12 meses para 1 corredor)
- [ ] UI pulida (Tailwind, colores NAEVCO, tipografía limpia)
- [ ] Deploy en Firebase + Cloud Run

**Si sobra tiempo:**
- [ ] Asistente 3D con texto predefinido (no necesariamente IA en el demo, puede ser scripted)
- [ ] Reporte PDF auto-generado

---

## La demo ideal para el pitch (5 minutos)

1. **Abrir el globo** → mostrar el mundo con capa de NO₂ activa. Rojo sobre el Mar de China Sur, el Canal de Suez, el Norte de Europa. Impacto visual inmediato.

2. **Hacer clic en corredor Shanghai → Rotterdam** → aparece el Score Card. 66/100. El bottleneck es el Puerto de Shanghai.

3. **Hacer clic en Puerto de Shanghai** → zoom in al puerto, NO₂ visible sobre el área portuaria. Explicar: "El satélite detecta 52% más de lo esperado. Algo está pasando ahí."

4. **Mostrar la alerta** → "Detectamos anomalía en este puerto el 15 de enero. Posible operación sin cold ironing."

5. **Mostrar el reporte PDF** → "Esto es lo que tu auditor recibe. Con metodología verificable. Firmado por NAEVCO."

6. **Pregunta retórica al jurado:** "¿Cuántas empresas pueden presentar esto hoy? Ninguna. Eso es NAEVCO."

---

## Lo que NO hacer en 2 días

- No implementar autenticación de usuarios (mockear una sesión)
- No conectar AIS en tiempo real (usar rutas hardcodeadas)
- No implementar el asistente 3D con IA real (si se hace, texto scripted)
- No cubrir más de 3 corredores (calidad > cantidad)
- No hacer el módulo terrestre completo (mencionar en pitch como roadmap)
- No gastar tiempo en el deploy perfecto (demo local con ngrok es suficiente)

---

## Resumen del stack en una tabla

| Capa | Tecnología | Por qué |
|---|---|---|
| Globo 3D | Deck.gl + GlobeView | WebGL, maneja datos geoespaciales masivos |
| UI/UX | React + Tailwind + Tremor | Rápido de construir, se ve profesional |
| API | FastAPI (Python) | Async, rápido de desarrollar, integra bien con GEE |
| Base de datos | PostgreSQL + PostGIS | Queries espaciales nativas |
| Satellite processing | Google Earth Engine | Datos ya están ahí, procesamiento en la nube de Google |
| Infra | GCP (Cloud Run + Firebase) | Ecosistema unificado con GEE |
| Asistente (extra) | Three.js + Claude API | Modelo 3D + inteligencia conectada a los datos |
