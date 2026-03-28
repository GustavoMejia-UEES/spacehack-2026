# NAEVCO — Modelo de Negocio y Estrategia

Por qué NAEVCO gana, cómo crece y qué hace que sea difícil de copiar.

---

## El mercado y por qué ahora

### El timing es perfecto (no es coincidencia)

Tres regulaciones convergieron en 2023-2024 creando una demanda que antes no existía:

**1. EU ETS Marítimo (enero 2024)**
La Unión Europea extendió su sistema de comercio de emisiones al transporte marítimo. Barcos que entren a puertos europeos deben comprar permisos de carbono por sus emisiones. Para determinar cuántos permisos comprar necesitan datos de emisiones verificables. Sin verificación independiente, las autoridades europeas no confían en los datos propios.

**2. CSRD — Corporate Sustainability Reporting Directive (2024-2025)**
Las empresas europeas con más de 250 empleados deben reportar emisiones Scope 3 de su cadena de suministro con estándares de auditoría comparables a los financieros. Eso obliga a los shippers a tener datos verificables de su logística.

**3. SEC Climate Disclosure Rules (EE.UU., 2024)**
Las empresas cotizadas en bolsa estadounidense deben revelar emisiones Scope 1, 2 y materialmente relevantes de Scope 3. La SEC puede multar por datos incorrectos.

**Resumen del timing:** En 2022 esto era "nice to have". En 2024 es obligatorio. El mercado no existía, ahora es urgente.

### Tamaño del mercado

- Mercado de software ESG global: **$15B en 2024, creciendo a $60B en 2030** (CAGR 26%)
- Segmento de verificación de emisiones logísticas: estimado **$800M–$2B para 2027**
- Solo los fondos ESG que invierten en logística/transporte mueven **$200B+ anuales**
- Los 4,000+ signatarios de SBTi con cadenas de suministro marítimas son el pipeline total de Shippers

---

## Por qué NAEVCO gana (el moat)

### Moat 1 — El dato que nadie puede falsificar

Los competidores en verificación de emisiones (South Pole, Verra, Gold Standard) trabajan con datos auto-reportados que auditan. Es auditoría de papeles. NAEVCO trabaja con observación satelital directa. Esta diferencia es filosófica: **verificamos desde afuera, no desde adentro**. Ningún actor en la cadena puede alterar lo que el satélite ve.

### Moat 2 — El dataset histórico acumulado

Cada mes que NAEVCO procesa datos de un corredor o puerto, añade un punto más al historial. Un competidor que entre en el mercado en 2027 no tiene los datos de 2024-2026. Los clientes que buscan tendencias de 3-5 años solo pueden obtenerlas de NAEVCO. Este efecto de acumulación crece con el tiempo.

### Moat 3 — La metodología validada

El valor de un rating de Moody's no está en los datos que usa — está en que **el mercado confía en su metodología**. NAEVCO necesita construir ese mismo activo: una metodología de scoring auditada por terceros independientes (tipo Bureau Veritas o Lloyd's Register) que el mercado acepte como estándar. Una vez logrado, los competidores no solo tienen que replicar la tecnología, tienen que construir la confianza. Eso tarda años.

### Moat 4 — Las integraciones

Si NAEVCO está integrado en Watershed (la plataforma ESG de Apple, Stripe, etc.), los clientes de Watershed reciben los datos de NAEVCO automáticamente. Cambiar de proveedor requiere cambiar la integración. Este switching cost es el mismo que tiene Salesforce con sus integraciones.

---

## Estrategia de entrada al mercado

### Fase 0 — Hackathon (hoy)
**Objetivo:** Demostrar que funciona con datos reales.
- Demo con 3 corredores reales (Shanghai-Rotterdam, Santos-Hamburgo, NY-Hamburgo)
- Datos reales de Sentinel-5P y VIIRS procesados
- Score funcional y dashboard básico
- Narrativa clara de modelo de negocio

### Fase 1 — Validación (meses 1-6)
**Objetivo:** 1 cliente piloto que pague algo (aunque sea poco).
- Prioridad: Puerto en América Latina (ciclo más corto que Europa, acceso más fácil)
- Candidatos concretos: Puerto de Cartagena (Colombia), Puerto de Santos (Brasil), Autoridad Portuaria de Panamá
- Ofrecer piloto de 3 meses a costo reducido ($500-1,000/mes) a cambio de testimonial y caso de estudio
- Paralelamente: acercarse a 2-3 shippers latinoamericanos con cadenas globales (Grupo Bimbo, FEMSA, etc.)

**Por qué LatAm primero:**
- Menos competencia que Europa/EE.UU.
- Los puertos latinoamericanos buscan activamente métricas para acceder a financiamiento del BID/CAF
- Hablar el mismo idioma y estar en la misma zona horaria reduce barreras de venta enormemente
- La CAF (Banco de Desarrollo de América Latina) es un posible aliado que puede escalar el acceso a múltiples puertos de golpe

### Fase 2 — Crecimiento (meses 6-18)
**Objetivo:** $50-100K MRR, 10-15 clientes activos.
- Expansión a Europa con 1-2 puertos y 3-5 shippers europeos (presión regulatoria más alta)
- Lanzar integraciones con Watershed y/o Salesforce Net Zero Cloud
- Publicar white paper de metodología y buscarlo auditar por Lloyd's Register o Bureau Veritas
- Primera ronda de financiamiento si aplica (pre-seed $500K-$1M para escalar equipo)

### Fase 3 — Escala (año 2-3)
**Objetivo:** Convertirse en el estándar de facto de verificación de emisiones logísticas.
- Acreditación formal como proveedor de datos de referencia para EU ETS reportes
- Dataset licenciado a calificadoras ESG (MSCI, Moody's ESG, S&P Global)
- Expansión a corredores aéreos y terrestres para completar la visión multimodal
- Serie A ($5-10M) para expansión global agresiva

---

## El producto en sus tres versiones

### Versión 1 — Dashboard (para shippers y puertos)

Interfaz web accesible para no-técnicos. El cliente ve:
- Mapa interactivo de sus corredores con capa de NO₂ y VIIRS
- Score mensual con tendencia histórica
- Comparación vs. corredores alternativos
- Alertas cuando hay anomalías
- Reporte PDF descargable listo para auditores

**Tecnología:** React + Deck.gl + FastAPI + PostgreSQL

### Versión 2 — API (para financieras y plataformas ESG)

Acceso programático a los datos para integraciones. Un equipo de data de BlackRock puede:
- Consultar el score de cualquier corredor en tiempo real
- Descargar series históricas en JSON/CSV
- Recibir webhooks de alertas cuando un activo cambia de score

**Tecnología:** REST API con autenticación OAuth2, documentación OpenAPI, SDKs en Python y JavaScript

### Versión 3 — Reports (transaccional)

Para due diligence puntuales. El cliente describe un activo (ruta, puerto, flota) y NAEVCO entrega en 5 días hábiles:
- Análisis histórico de 3 años de emisiones satelitales
- Comparación vs. benchmark de la industria
- Identificación de riesgos regulatorios y ambientales
- Recomendaciones de mitigación
- Documento PDF firmado por NAEVCO con metodología explicada

---

## Cómo se diferencia NAEVCO de lo que existe hoy

| Solución existente | Qué hace | Por qué NAEVCO es diferente |
|---|---|---|
| **Veritics / South Pole** | Auditan reportes de emisiones de empresas | Trabajan con datos auto-reportados. NAEVCO mide independientemente |
| **MarineTraffic / Spire** | Tracking de barcos por AIS | Dan posición, no emisiones. Y los barcos pueden apagar el AIS |
| **Windward / Pole Star** | Inteligencia marítima para riesgo | Enfocados en riesgo regulatorio/financiero, no en emisiones verificadas |
| **Watershed / Persefoni** | Plataformas de gestión de huella de carbono | Consolidan datos que el cliente les da. No verifican. NAEVCO puede integrarse como la capa de verificación |
| **Bloomberg ESG / MSCI** | Ratings ESG de empresas | Basados en divulgaciones de empresas, no en observación independiente |
| **Planet Labs / Maxar** | Imágenes satelitales | Datos crudos. No tienen el modelo de correlación con emisiones logísticas |

**El gap que NAEVCO llena:** Nadie conecta datos satelitales atmosféricos con la cadena de suministro logística para producir scores de emisiones verificados y accionables. Ese gap existe y tiene un mercado urgente.

---

## Riesgos y cómo los mitiga NAEVCO

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| GEE cambia su política de acceso gratuito | Media | Diversificar: Microsoft Planetary Computer y AWS Open Data también tienen Sentinel-5P |
| Competitor grande (Palantir, Esri) entra al mercado | Media | Construir el moat de metodología validada y dataset histórico antes de que lleguen |
| Los clientes prefieren seguir con datos propios (inercia) | Alta al inicio | Regulación los fuerza. Cada nueva ley es un empujón de mercado |
| Limitaciones de precisión del satélite (nubes, resolución) | Media-Alta | Comunicar limitaciones con transparencia. Combinar NO₂ + VIIRS + AIS aumenta robustez |
| Ciclos de venta largos que estresan el cash flow | Alta | Cobrar por reports transaccionales desde el día 1 para generar caja mientras se cierran enterprise |

---

## Lo que NAEVCO necesita ahora (post-hackathon)

### En los próximos 30 días
1. **Contactar 3 puertos latinoamericanos** para proponer piloto (Cartagena, Santos, Panamá)
2. **Publicar la metodología** como white paper técnico (credibilidad gratuita)
3. **Aplicar a Google for Startups** para créditos de GCP (reduce costo de infraestructura a casi cero)
4. **Buscar acercamiento a CAF o BID** — tienen programas de innovación para startups de impacto

### En los próximos 90 días
1. Piloto activo con al menos 1 cliente
2. Versión beta del dashboard disponible
3. Metodología auditada en proceso
4. Primeros ingresos (aunque sean modestos)

---

## La visión a 5 años

NAEVCO se convierte en el **estándar global de verificación de emisiones en corredores logísticos**, del mismo modo que LEED es el estándar de edificios sostenibles o como Bureau Veritas es el estándar de calidad industrial.

Cada green bond emitido para un puerto lleva el sello "NAEVCO Verified".
Cada naviera que quiera demostrar cumplimiento de IMO CII usa datos NAEVCO.
Cada shipper que reporte Scope 3 ante la SEC cita NAEVCO como fuente.

Ese es el destino. La hackathon es el punto de partida.
