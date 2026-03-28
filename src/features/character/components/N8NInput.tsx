import { useState, useRef, useCallback } from 'react'
import type { SatelliteMessage } from '../hooks/useSatelliteMessages'

interface N8NInputProps {
  onMessageReceived?: (message: SatelliteMessage) => void
  onAudioPlay?: (isPlaying: boolean) => void
  n8nWebhookUrl?: string // La URL que te van a pasar
  showDebug?: boolean // Mostrar panel de debug
}

// Función para convertir texto a audio usando Google Translate TTS
async function textToSpeech(text: string): Promise<Blob> {
  console.log('🔊 Iniciando TTS (Text-to-Speech)...')

  try {
    // Usar Google Translate TTS (sin API key, funcionna para idiomas comunes)
    console.log('🌐 Usando Google Translate TTS...')
    const encodedText = encodeURIComponent(text)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=es&client=tw-ob`

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })
    const blob = await response.blob()

    if (blob.size > 0) {
      console.log(
        '✅ Audio obtenido de Google Translate TTS:',
        blob.size,
        'bytes',
      )
      return blob
    } else {
      throw new Error('Blob vacío de Google Translate')
    }
  } catch (e) {
    console.error('Error con Google Translate TTS:', e)
  }

  // FALLBACK: Web Speech API (sin descarga, pero reproduce localmente)
  if ('speechSynthesis' in window) {
    console.log('🔊 Fallback: Usando Web Speech API del navegador')
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      utterance.lang = 'es-ES'

      // Para casos donde no podemos grabar, simplemente usar el TTS del navegador
      // Crear un Blob "fake" que al menos contiene algo
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )()
      const mediaStreamAudioDestinationNode =
        audioContext.createMediaStreamDestination()
      const mediaRecorder = new MediaRecorder(
        mediaStreamAudioDestinationNode.stream,
      )
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        if (chunks.length > 0) {
          resolve(new Blob(chunks, { type: 'audio/webm' }))
        } else {
          // Si no se grabó nada, al menos retornar un blob para que no falle
          resolve(new Blob([''], { type: 'audio/mp3' }))
        }
      }

      mediaRecorder.start()
      window.speechSynthesis.speak(utterance)

      utterance.onend = () => {
        mediaRecorder.stop()
      }

      // Timeout por si acaso
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
      }, 8000)
    })
  }

  // Si todo falla, crear un blob silencioso
  console.warn('⚠️ No se pudo generar audio')
  return new Blob([''], { type: 'audio/mp3' })
}

export function N8NInput({
  onMessageReceived,
  onAudioPlay,
  n8nWebhookUrl,
  showDebug = true,
}: N8NInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<{
    lastResponse?: {
      status: number
      contentType: string | null
      contentLength: string | null
      blobSize: number
      blobType: string
      wasJsonConverted?: boolean
    }
    lastError?: string
  }>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!inputText.trim() || !n8nWebhookUrl) return

      setIsLoading(true)
      setError(null)

      try {
        console.log('📤 Enviando a n8n:', inputText)

        // POST a n8n con el texto del usuario
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputText }),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        // Debug: Ver qué devuelve n8n exactamente
        const debugData = {
          status: response.status,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
        }
        console.log('📋 Response Headers:', debugData)

        // IMPORTANTE: No consumir el response dos veces
        // Si es JSON, usar text(). Si es binario, usar blob()
        let audioBlob: Blob
        let responseText =
          response.headers.get('x-response-text') ||
          'Respuesta desde el Asistente Virtual'
        let wasJsonConverted = false

        // Verificar el tipo de contenido ANTES de consumir
        if (debugData.contentType?.includes('application/json')) {
          console.warn(
            '⚠️ Response es JSON. Extrayendo texto e intentando TTS...',
          )
          wasJsonConverted = true

          try {
            // Leer como texto (una sola vez)
            const text = await response.text()
            console.log('📦 Contenido JSON:', text)
            const json = JSON.parse(text)

            // Extraer texto según la estructura
            if (json.candidates && json.candidates[0]?.content?.parts) {
              responseText =
                json.candidates[0].content.parts[0].text || 'Respuesta recibida'
              console.log('✅ Texto extraído de Gemini:', responseText)
            } else if (json.text) {
              responseText = json.text
              console.log('✅ Texto extraído de "text":', responseText)
            } else if (json.message) {
              responseText = json.message
              console.log('✅ Texto extraído de "message":', responseText)
            } else if (typeof json === 'string') {
              responseText = json
              console.log('✅ Texto extraído (string):', responseText)
            } else {
              console.warn('⚠️ Estructura no reconocida:', json)
              responseText = JSON.stringify(json).substring(0, 100)
            }

            // Convertir texto a audio
            if (responseText && responseText !== '') {
              console.log('🔊 Convirtiendo texto a audio...')
              audioBlob = await textToSpeech(responseText)
              console.log('✅ Audio generado via TTS:', audioBlob.size, 'bytes')
            } else {
              throw new Error('No se pudo extraer texto')
            }
          } catch (parseErr) {
            console.error('Parse error:', parseErr)
            throw new Error(
              parseErr instanceof Error
                ? parseErr.message
                : 'No se pudo procesar JSON',
            )
          }
        } else {
          // Audio binario directo
          console.log('🔊 Respondiendo como audio binario')
          audioBlob = await response.blob()
          console.log('📥 Audio binario recibido:', {
            type: audioBlob.type,
            size: audioBlob.size,
          })

          if (audioBlob.size === 0) {
            throw new Error('Audio binario vacío recibido de n8n')
          }
        }

        // Guardar debug
        setDebugInfo((prev) => ({
          ...prev,
          lastResponse: {
            ...debugData,
            blobSize: audioBlob.size,
            blobType: audioBlob.type,
            wasJsonConverted,
          },
        }))

        // Convertir el binario a URL para reproducir
        const audioUrl = URL.createObjectURL(audioBlob)

        // Crear mensaje para mostrar en la burbuja
        const newMessage: SatelliteMessage = {
          id: `n8n-${Date.now()}`,
          title: '[SAT-Response]',
          content: responseText,
          type: 'info',
          timestamp: 0,
          icon: '',
        }

        // Notificar al padre que hay un nuevo mensaje
        if (onMessageReceived) {
          onMessageReceived(newMessage)
        }

        // Reproducir el audio
        if (!audioRef.current) {
          audioRef.current = new Audio()
        }
        audioRef.current.src = audioUrl
        audioRef.current.volume = 0.6

        if (onAudioPlay) {
          onAudioPlay(true)
        }

        // Intentar reproducir
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Audio iniciado correctamente')
            })
            .catch((err) => {
              console.warn('❌ Error al reproducir audio:', err.message)
              setError(`Error de audio: ${err.message}`)
            })
        }

        // Cuando termina el audio
        audioRef.current.onended = () => {
          console.log('✅ Audio terminado')
          if (onAudioPlay) {
            onAudioPlay(false)
          }
        }

        // Si falla después de 2 segundos, mostrar error
        audioRef.current.onerror = (e) => {
          console.error('❌ Error en reproducción de audio:', e)
          setError('Error: El audio no es válido')
        }

        // Limpiar inputs y cerrar modal
        setInputText('')
        setIsOpen(false)
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Error desconocido'
        console.error('❌ Error:', errorMsg)
        setError(errorMsg)
        setDebugInfo((prev) => ({
          ...prev,
          lastError: errorMsg,
        }))
      } finally {
        setIsLoading(false)
      }
    },
    [inputText, n8nWebhookUrl, onMessageReceived, onAudioPlay],
  )

  // Si no hay URL de n8n, mostrar solo un placeholder
  if (!n8nWebhookUrl) {
    return (
      <button
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 900,
          padding: '12px 20px',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          color: 'white',
          border: '2px solid rgb(59, 130, 246)',
          borderRadius: '8px',
          cursor: 'not-allowed',
          fontSize: '14px',
          fontWeight: 'bold',
          opacity: 0.5,
        }}
        disabled
        title="Se requiere URL de n8n"
      >
        💬 (Esperando n8n URL)
      </button>
    )
  }

  return (
    <>
      {/* Panel de Debug (esquina inferior izquierda) */}
      {showDebug && debugInfo.lastResponse && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            zIndex: 800,
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            borderRadius: '8px',
            padding: '12px',
            border: '1px solid rgb(75, 85, 99)',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'rgb(107, 114, 128)',
            maxWidth: '280px',
          }}
        >
          <div
            style={{ marginBottom: '8px', color: 'white', fontWeight: 'bold' }}
          >
            🔧 N8N Debug
          </div>
          {debugInfo.lastResponse && (
            <>
              <div
                style={{
                  color:
                    debugInfo.lastResponse.blobSize > 0
                      ? 'rgb(74, 222, 128)'
                      : 'rgb(248, 113, 113)',
                }}
              >
                ✓ Status: {debugInfo.lastResponse.status}
              </div>
              <div>Type: {debugInfo.lastResponse.contentType || 'N/A'}</div>
              <div>
                Size: {debugInfo.lastResponse.blobSize} bytes{' '}
                {debugInfo.lastResponse.blobSize === 0 && (
                  <span style={{ color: 'rgb(248, 113, 113)' }}>❌ VACÍO</span>
                )}
              </div>
              <div>Blob Type: {debugInfo.lastResponse.blobType || 'N/A'}</div>
              {debugInfo.lastResponse.wasJsonConverted && (
                <div style={{ marginTop: '4px', color: 'rgb(251, 146, 60)' }}>
                  📝 JSON → TTS (convertido)
                </div>
              )}
            </>
          )}
          {debugInfo.lastError && (
            <div style={{ marginTop: '8px', color: 'rgb(248, 113, 113)' }}>
              ❌ Error: {debugInfo.lastError.substring(0, 40)}...
            </div>
          )}
        </div>
      )}

      {/* Botón flotante para abrir modal */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 900,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
          fontWeight: 'bold',
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget
          btn.style.transform = 'scale(1.1)'
          btn.style.backgroundColor = 'rgba(59, 130, 246, 1)'
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget
          btn.style.transform = 'scale(1)'
          btn.style.backgroundColor = 'rgba(59, 130, 246, 0.9)'
        }}
      >
        💬
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal */}
          <div
            style={{
              backgroundColor: 'rgb(17, 24, 39)',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              borderRadius: '16px 16px 0 0',
              padding: '24px',
              boxShadow: '0 -10px 40px -10px rgba(0, 0, 0, 0.8)',
              borderTop: '2px solid rgb(59, 130, 246)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>
                💬 Enviar Mensaje
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu pregunta..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  backgroundColor: 'rgb(31, 41, 55)',
                  color: 'white',
                  border: '2px solid rgb(55, 65, 81)',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  marginBottom: '12px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                disabled={isLoading}
              />

              {/* Error */}
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(127, 29, 29, 0.5)',
                    color: 'rgb(248, 113, 113)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '12px',
                    border: '1px solid rgb(248, 113, 113)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgb(55, 65, 81)',
                    color: 'white',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isLoading
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'rgb(59, 130, 246)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {isLoading ? '⏳ Procesando...' : '📤 Enviar'}
                </button>
              </div>
            </form>

            {/* Info */}
            <p
              style={{
                color: 'rgb(107, 114, 128)',
                fontSize: '12px',
                marginTop: '12px',
              }}
            >
              El asistente procesará tu mensaje, generará una respuesta con
              audio y la reproducirá automáticamente.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
