# NAEVCO — Qué hay en la app y para qué sirve cada cosa

---

## Las 5 pantallas de la app

### 1. HOME — El Globo (`/`)

**Es la pantalla de entrada. El wow moment.**

Un globo 3D de la Tierra que rota lentamente. Encima tiene capas de datos activas:

**Capas togglables (con switches en el panel lateral):**
- `NO₂ Heatmap` — gradiente de color azul→amarillo→rojo sobre océanos y puertos según concentración de NO₂. Rojo = problema.
- `Corredores activos` — arcos 3D animados sobre las rutas logísticas monitoreadas. El color del arco es su score (verde/amarillo/rojo).
- `Puertos` — puntos brillantes en las coordenadas de cada puerto. Tamaño = volumen de tráfico. Color = score.
- `Actividad nocturna (VIIRS)` — capa de luz nocturna sobre zonas portuarias.

**Interacciones:**
- Click en un arco → abre panel lateral con preview del Score Card del corredor → botón "Ver detalle completo"
- Click en un punto de puerto → preview del score del puerto → botón "Ver benchmark"
- Slider de tiempo en la parte inferior → viaja entre meses (ene 2024 → dic 2024) y ves cómo cambian los colores
- Buscador en el header → buscar corredor por nombre de puerto origen/destino

**Datos que consume:**
- Scores de corredores (Supabase)
- Coordenadas y scores de puertos (Supabase)
- Tiles de NO₂ pre-procesados en GeoTIFF (Cloud Storage / Supabase Storage)

---

### 2. CORRIDOR DETAIL — El Score Card (`/corridor/:id`)

**Es el producto central. Lo que el cliente compra.**

Layout de dos columnas:
- **Izquierda:** mapa 2D del corredor específico con la capa de NO₂ encima de la ruta
- **Derecha:** panel de datos

**Panel derecho tiene 4 bloques:**

**Bloque A — Score global**
```
SHANGHAI → ROTTERDAM
Score global: 66/100   [████████░░░░]  REGULAR
Período: Enero 2025
Trend: ↓ -8 pts vs. mes anterior
```

**Bloque B — Score por segmento** (4 barras horizontales con tooltip)
- Tramo marítimo: 72 — verde
- Puerto origen: 45 — rojo con badge "BOTTLENECK"
- Puerto destino: 88 — verde
- Corredor terrestre: 61 — amarillo

**Bloque C — Gráfico histórico** (línea temporal 12 meses)
- Eje X: meses
- Eje Y: score 0-100
- Una línea por segmento (marítimo, origen, destino)
- Línea punteada horizontal = promedio de la industria para este tipo de ruta

**Bloque D — Insight generado automáticamente**
Caja destacada con texto:
> ⚠ Anomalía detectada en Puerto de Shanghai: NO₂ observado supera en 52% el baseline esperado para el volumen de tráfico del período. Posible causa: operación sin cold ironing. Comparado con el mismo período del año anterior, el exceso aumentó 18%.

**Botón al pie:** `Generar Reporte PDF` → dispara n8n workflow → descarga PDF

**Datos que consume:**
- `corridors` table en Supabase
- `corridor_scores` time series en Supabase
- `no2_snapshots` por corredor y mes en Supabase
- Geometría GeoJSON del corredor

---

### 3. PORT BENCHMARK — El Comparador (`/port/:id`)

**Lo que vende a puertos. Su argumento para inversión.**

Layout de pantalla completa:

**Header:** Nombre del puerto, país, bandera, score actual con badge de color.

**Sección 1 — Mi posición en el mundo**
Mapa global con el puerto seleccionado resaltado y los 10 puertos competidores más similares (mismo tipo, mismo rango de tráfico) marcados en gris. El usuario ve instantáneamente si está arriba o abajo del grupo.

**Sección 2 — Benchmark table**
| Puerto | País | Score | NO₂ avg | VIIRS avg | Trend |
|---|---|---|---|---|---|
| Rotterdam | NL | 88 | ↓ bajo | media | ↑ |
| **Shanghai** | CN | **45** | ↑ alto | alta | ↓ |
| Singapore | SG | 79 | bajo | alta | → |
| Hamburg | DE | 82 | bajo | media | ↑ |

El puerto del usuario está siempre resaltado en su fila.

**Sección 3 — Desglose de mi score**
Dos gráficos side by side:
- Radar chart: mi puerto vs. promedio del grupo en 5 dimensiones (NO₂ operacional, actividad nocturna, cold ironing proxy, eficiencia tráfico, tendencia anual)
- Bar chart: evolución mensual de mi score vs. el líder del grupo

**Sección 4 — Oportunidades de mejora**
Cards automáticas generadas según el análisis:
- "Instalar cold ironing estimaría una mejora de 15-20 puntos en tu score"
- "Tu NO₂ operacional nocturno es 3x el de Rotterdam — revisar maquinaria de patio"

**Datos que consume:**
- `ports` table (WPI procesado)
- `port_scores` time series
- `port_no2_monthly` y `port_viirs_monthly`
- Query de puertos similares (mismo tipo, rango de tráfico)

---

### 4. ALERTS FEED — El Monitor (`/alerts`)

**Lo más diferenciador. Verificación en tiempo cuasi-real.**

Vista de lista estilo feed de noticias, ordenada por severidad y timestamp.

Cada alerta tiene:
- Ícono de severidad (rojo / amarillo / verde)
- Título corto: "Anomalía NO₂ — Puerto Shanghai"
- Descripción: "NO₂ observado el 15 ene supera 3σ del baseline para el período"
- Tags: el corredor/puerto afectado, el tipo de anomalía
- Timestamp
- Botón "Ver en mapa" → abre el globo centrado en esa zona con la fecha del evento

**Tipos de alerta:**
- `EXCESO_NO2_RUTA` — un barco en una ruta declarada "verde" muestra NO₂ elevado
- `EXCESO_NO2_PUERTO` — un puerto supera su propio baseline histórico
- `ACTIVIDAD_NOCTURNA_ANOMALA` — VIIRS detecta spike de actividad en puerto fuera de patrón
- `TENDENCIA_NEGATIVA` — un corredor lleva 3 meses consecutivos empeorando
- `MEJORA_SIGNIFICATIVA` — un puerto mejoró >10 puntos (buenas noticias, para marketing)

**Filtros en el header:**
- Por tipo de alerta
- Por corredor o puerto
- Por período (última semana, mes, trimestre)
- Por severidad

**Datos que consume:**
- `alerts` table en Supabase (generada por n8n cuando procesa los datos mensuales)
- Actualización: n8n corre el workflow de detección de anomalías y hace INSERT en `alerts`

---

### 5. METHODOLOGY (`/methodology`)

**Una página. Construye credibilidad.**

No es una pantalla de uso diario. Es la que muestras cuando el auditor pregunta "¿y esto cómo funciona?".

Contenido:
- Infografía del flujo de datos (Sentinel-5P → GEE → score)
- Explicación de cada componente del score con fórmula visible
- Limitaciones explícitas (cobertura de nubes, resolución espacial)
- Referencia a los datasets públicos usados
- Sección "Validación": comparación del score NAEVCO vs. datos IMO DCS para los años con datos disponibles

**Por qué está:**
Cuando un cliente dice "¿puedo confiar en esto?", le mandas el link. Sin esta página, NAEVCO es solo otro dashboard bonito. Con ella, es una herramienta metodológicamente seria.

---

## Qué hay en el header (navegación global)

```
[NAEVCO logo]  [Globo]  [Corredores]  [Puertos]  [Alertas]  [Metodología]    [🔔 3 alertas]  [Período: Ene 2025 ▼]
```

El selector de período en el header cambia los datos de TODA la app simultáneamente. Eso es clave para el demo: puedes viajar en el tiempo en vivo.

---

## Qué datos viven en Supabase

### Tablas necesarias

```sql
-- Puertos (cargado desde WPI CSV)
ports (
  id text PRIMARY KEY,        -- "NLRTM"
  name text,
  country text,
  lat float, lon float,
  has_electricity boolean,
  has_lng boolean,
  harbor_type text,
  traffic_level text          -- high/medium/low (derivado de WPI)
)

-- Corredores (los 3-5 que mostramos)
corridors (
  id text PRIMARY KEY,        -- "CNSHA_NLRTM"
  name text,
  origin_port_id text,
  destination_port_id text,
  waypoints jsonb,            -- array de [lon, lat]
  corridor_type text          -- asia_europe, transatlantic, etc.
)

-- Scores mensuales por corredor
corridor_scores (
  id uuid DEFAULT gen_random_uuid(),
  corridor_id text,
  year_month text,            -- "2024-01"
  score_total float,
  score_maritime float,
  score_port_origin float,
  score_port_destination float,
  score_land float,
  bottleneck text,
  no2_mean float,
  no2_max float,
  created_at timestamptz DEFAULT now()
)

-- Scores mensuales por puerto
port_scores (
  id uuid DEFAULT gen_random_uuid(),
  port_id text,
  year_month text,
  score_total float,
  no2_mean float,
  no2_max float,
  viirs_mean float,
  viirs_max float,
  created_at timestamptz DEFAULT now()
)

-- Alertas generadas por el sistema
alerts (
  id uuid DEFAULT gen_random_uuid(),
  type text,                  -- EXCESO_NO2_RUTA, etc.
  severity text,              -- high/medium/low
  title text,
  description text,
  corridor_id text,
  port_id text,
  year_month text,
  created_at timestamptz DEFAULT now()
)
```

---

## Qué hace n8n

n8n actúa como el **orchestrator** del sistema. Tiene 3 workflows:

**Workflow 1 — Procesamiento mensual** (trigger: Cloud Scheduler o manual para demo)
1. Llama al microservicio Python de GEE para cada corredor
2. Guarda los scores en Supabase (`corridor_scores`, `port_scores`)
3. Llama al workflow de detección de anomalías

**Workflow 2 — Detección de anomalías** (trigger: al finalizar Workflow 1)
1. Consulta los últimos scores vs. histórico en Supabase
2. Si algún valor supera umbral → INSERT en `alerts` con tipo y descripción

**Workflow 3 — Generación de reporte PDF** (trigger: HTTP webhook desde el botón en la app)
1. Recibe `corridor_id` y `year_month`
2. Consulta todos los datos del corredor en Supabase
3. Llama a servicio de generación de PDF (o usa una template HTML → PDF)
4. Devuelve la URL del PDF o lo descarga directamente

---

## Lo que se muestra en el demo (prioridad máxima)

El jurado va a ver exactamente esto en 5 minutos:

1. Globo girando con NO₂ rojo sobre Mar de China Sur y el Canal de Suez → impacto visual
2. Click en el arco Shanghai→Rotterdam → Score Card aparece con 66/100 y "BOTTLENECK: Shanghai"
3. El gráfico de tendencia bajando en los últimos 3 meses → "algo está pasando"
4. Click en alerta de anomalía → el mapa se centra en el puerto de Shanghai → capa de NO₂ intensa
5. Click en "Generar Reporte" → PDF descargado con el análisis

Eso es suficiente para ganar. Todo lo demás es bonus.
