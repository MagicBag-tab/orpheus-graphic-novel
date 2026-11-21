import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { pages } from './story'
import { objectsFor, nearestObject } from './exploration'
import { combinations, objectReactions } from './reactions'
import './styles.css'
import './scene-art.css'

const MAX_DEPTH = 5
const RANGE = 1
const SAVE_KEY = 'orfeo-exploration-v4'
const propTypes = {
  'rooftop-note': 'guitar', 'rooftop-phone': 'photo',
  'signal-file': 'coat', 'signal-wave': 'bench',
  'gate-map': 'map', 'gate-usb': 'ticket',
  'bargain-screen': 'throne', 'bargain-terms': 'tablet',
  'descent-light': 'lamp', 'voice-message': 'scarf',
  'climax-exit': 'sign', 'quiet-bin': 'door',
}
function savedGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')
    return {
      current: pages[saved.current] ? saved.current : 'start',
      depth: Number.isInteger(saved.depth) ? Math.max(0, Math.min(MAX_DEPTH, saved.depth)) : 0,
      examined: Array.isArray(saved.examined) ? saved.examined : [],
      found: Array.isArray(saved.found) ? saved.found.filter(item => item && typeof item.title === 'string') : [],
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      archived: saved.archived === true,
    }
  } catch { return { current: 'start', depth: 0, examined: [], found: [], completed: [], archived: false } }
}

function Character({ type, name }) {
  return <div className={`character character--${type}`} aria-hidden="true">
    <div className="character__hair"/><div className="character__head"/>
    <div className="character__body"/><span>{name}</span>
  </div>
}

function Stage({ page, depth, objects, examined, nearby, onInspect, archived, onMove, reaction }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const lastTouch = useRef(null)
  const onPointerMove = event => {
    if (event.pointerType === 'mouse') {
      const bounds = event.currentTarget.getBoundingClientRect()
      setPointer({ x: ((event.clientX - bounds.left) / bounds.width - .5) * 2, y: ((event.clientY - bounds.top) / bounds.height - .5) * 2 })
    }
  }
  const onTouchStart = event => { lastTouch.current = event.touches[0]?.clientY ?? null }
  const onTouchEnd = event => {
    if (lastTouch.current === null) return
    const delta = lastTouch.current - (event.changedTouches[0]?.clientY ?? lastTouch.current)
    if (Math.abs(delta) > 45) onMove(delta > 0 ? 1 : -1)
    lastTouch.current = null
  }
  return <div className={`stage stage--${page.art} ${reaction?.light ? `stage--lit-${reaction.light}` : ''}`} style={{ '--depth': depth, '--px': pointer.x, '--py': pointer.y }} onPointerMove={onPointerMove} onPointerLeave={() => setPointer({ x: 0, y: 0 })} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-label={`Escenario: ${page.title}`}>
    <div className="stage__back" aria-hidden="true"><span className="scenery scenery--far-a"/><span className="scenery scenery--far-b"/></div>
    <div className="stage__architecture" aria-hidden="true"><span className="scenery scenery--arch-a"/><span className="scenery scenery--arch-b"/></div>
    <div className="stage__middle" aria-hidden="true">
      <span className="scenery scenery--mid-a"/><span className="scenery scenery--mid-b"/>
      {page.art === 'rooftop' && <><Character type="orpheus" name="ORFEO"/><Character type="euridice" name="EURÍDICE"/></>}
      {page.art === 'signal' && <Character type="orpheus" name="ORFEO"/>}
      {page.art === 'gate' && <Character type="persephone" name="PERSÉFONE"/>}
      {page.art === 'bargain' && <><Character type="hades" name="HADES"/><Character type="orpheus" name="ORFEO"/><Character type="euridice" name="EURÍDICE"/></>}
      {page.art === 'descent' && <><Character type="orpheus" name="ORFEO"/><Character type="euridice ghost" name="EURÍDICE"/></>}
      {page.art === 'doubt' && <Character type="orpheus" name="ORFEO"/>}
      {['voice', 'climax', 'tragic'].includes(page.art) && <Character type="euridice ghost" name="EURÍDICE"/>}
      {page.art === 'ending' && <><Character type="orpheus" name="ORFEO"/><Character type="euridice" name="EURÍDICE"/></>}
      {page.art === 'quiet' && <><Character type="orpheus" name="ORFEO"/><Character type="euridice" name="EURÍDICE"/></>}
      {page.art === 'lost' && <Character type="orpheus" name="ORFEO"/>}
    </div>
    <div className="stage__props" aria-hidden="true">
      {objects.filter(object => propTypes[object.id]).map(object => <span key={object.id} className={`stage-prop stage-prop--${propTypes[object.id]}`} style={{ left: `${object.x}%`, top: `${object.y}%` }}/>) }
    </div>
    <div className="stage__objects">
      {objects.map(object => {
        const distance = Math.abs(depth - object.depth)
        const inRange = distance <= RANGE
        return <button key={object.id} type="button" className={`stage-object ${examined.includes(object.id) ? 'is-examined' : ''} ${nearby?.id === object.id ? 'is-nearby' : ''}`} style={{ '--object-x': `${object.x}%`, '--object-y': `${object.y}%`, '--object-distance': distance }} disabled={!inRange} onClick={() => onInspect(object)} aria-label={`${object.name}, ${distance} pasos de distancia${examined.includes(object.id) ? ', examinado' : ''}`}>
          <span className="stage-object__symbol">{examined.includes(object.id) ? '✓' : object.clue ? '◇' : '○'}</span>
          <span className="stage-object__name">{object.name}</span>
        </button>
      })}
    </div>
    {archived && page.art === 'signal' && <span className="archive-badge">✓ FOTO GUARDADA</span>}
    {reaction && <span className="scene-change" aria-live="polite">{reaction.title || 'El entorno responde'}</span>}
    <div className="stage__front" aria-hidden="true"><span className="scenery scenery--front-a"/><span className="scenery scenery--front-b"/></div>
  </div>
}

function StoryPage({ page, depth, objects, examined, nearby, inspection, onInspect, onMove, onChoose, onRestart, archived }) {
  return <main className="game">
    <div className="game__chapter"><span>{page.chapter}</span><strong>{page.title}</strong></div>
    <div className="game__stage"><Stage page={page} depth={depth} objects={objects} examined={examined} nearby={nearby} onInspect={onInspect} onMove={onMove} archived={archived} reaction={inspection?.reaction}/></div>
    <div className="scene-readout" aria-live="polite">
      <span>{nearby ? `${nearby.name} · ${Math.abs(nearby.depth - depth)} ${Math.abs(nearby.depth - depth) === 1 ? 'paso' : 'pasos'} · ${examined.includes(nearby.id) ? 'examinar otra vez' : 'E / Espacio para investigar'}` : 'No hay objetos al alcance · acércate con W/S'}</span>
      <button type="button" onClick={() => nearby && onInspect(nearby)} disabled={!nearby} aria-label={nearby ? `Investigar ${nearby.name}` : 'No hay objeto cercano'}>Investigar <kbd>E</kbd></button>
    </div>
    <div className="dialogue" aria-live="polite"><p className="dialogue__context">{page.caption}</p><small>{inspection ? inspection.speaker : page.speaker}</small><p>{inspection ? inspection.text : page.dialogue}</p><em>{inspection ? inspection.note : page.action}</em></div>
    {page.ending ? <div className="ending"><small>FINAL</small><h1>{page.title}</h1><p>{page.ending}</p><button type="button" onClick={onRestart}>Volver a empezar</button></div> : <div className="decisions"><span>¿Qué hace Orfeo?</span>{page.choices.map(([label, hint, next], index) => <button type="button" key={`${index}-${label}`} onClick={() => onChoose(next, label)}><b>{label}</b><small>{hint}</small><i aria-hidden="true">→</i></button>)}</div>}
    <div className="movement"><button type="button" onClick={() => onMove(-1)} disabled={depth === 0} aria-label="Retroceder un paso">−</button><span>Profundidad {depth}/{MAX_DEPTH}</span><button type="button" onClick={() => onMove(1)} disabled={depth === MAX_DEPTH} aria-label="Avanzar un paso">+</button></div>
  </main>
}

function Modal({ title, onClose, children }) {
  const closeRef = useRef(null)
  const previousFocus = useRef(document.activeElement)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const controls = [...closeRef.current.closest('[role="dialog"]').querySelectorAll('button:not(:disabled),a[href]')]
        if (controls.length === 1) { event.preventDefault(); controls[0].focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); previousFocus.current?.focus?.() }
  }, [])
  return <div className="modal" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-label={title} className="panel"><button ref={closeRef} type="button" onClick={onClose}>Cerrar ×</button><h2>{title}</h2>{children}</section></div>
}

const justification = 'Elegí el mito de Orfeo y Eurídice porque muestra cómo el amor y el duelo pueden enfrentarnos al deseo de recuperar lo que hemos perdido. Lo adapté a una ciudad actual: Orfeo desciende por una estación de metro convertida en inframundo para pedirle a Hades que permita volver a Eurídice. La regla de no mirar atrás conserva la tensión del mito y representa la dificultad de confiar y aceptar la incertidumbre. Elegí un videojuego narrativo con exploración porque permite recorrer ese mundo, descubrir recuerdos y tomar decisiones junto a Orfeo. También quise que Eurídice pudiera expresar lo que desea, en vez de ser solo alguien a quien rescatar. Crear esta adaptación me ayudó a ver que los mitos antiguos siguen hablando de temas actuales, como el duelo, los límites del amor y el respeto por las decisiones de los demás.'

function AboutPage({ onBack }) {
  const headingRef = useRef(null)
  useEffect(() => { headingRef.current?.focus() }, [])
  return <main className="about-page" aria-labelledby="about-heading">
    <div className="about-page__content">
      <small>SOBRE EL PROYECTO</small>
      <h1 id="about-heading" ref={headingRef} tabIndex={-1}>Justificación</h1>
      <p>{justification}</p>
      <button type="button" onClick={onBack}>← Volver al juego</button>
    </div>
  </main>
}

function App() {
  const initial = useRef(savedGame()).current
  const [current, setCurrent] = useState(initial.current)
  const [depth, setDepth] = useState(initial.depth)
  const [examined, setExamined] = useState(initial.examined)
  const [found, setFound] = useState(initial.found)
  const [completed, setCompleted] = useState(initial.completed)
  const [inspection, setInspection] = useState(null)
  const [archived, setArchived] = useState(initial.archived)
  const [panel, setPanel] = useState(null)
  const [view, setView] = useState('game')
  const gameButtonRef = useRef(null)
  const showGame = () => { setView('game'); requestAnimationFrame(() => gameButtonRef.current?.focus()) }
  const page = pages[current]
  const objects = objectsFor(page.art)
  const nearby = nearestObject(objects, depth, RANGE)
  const move = delta => setDepth(value => Math.max(0, Math.min(MAX_DEPTH, value + delta)))
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ current, depth, examined, found, completed, archived }))
  }, [current, depth, examined, found, completed, archived])
  const inspect = object => {
    if (!object || Math.abs(object.depth - depth) > RANGE) return
    const alreadyExamined = examined.includes(object.id)
    const combination = combinations.find(item => item.art === page.art && !completed.includes(item.id) && item.requires.every(id => id === object.id || examined.includes(id)))
    const response = combination || objectReactions[object.id]
    setInspection({ speaker: alreadyExamined ? object.name.toUpperCase() : response?.speaker || object.name.toUpperCase(), text: alreadyExamined ? 'Ya lo examinaste. Los detalles siguen en tu cuaderno si encontraste una pista.' : response?.text || object.text, note: combination ? `Nueva pista: ${combination.title}. Guardada en el cuaderno.` : object.clue && !alreadyExamined ? 'Pista guardada en el cuaderno.' : alreadyExamined ? 'Objeto examinado.' : 'Detalle del entorno examinado.', reaction: alreadyExamined ? null : response ? { light: response.light, title: combination ? `Conexión: ${combination.title}` : `${object.name} responde` } : { title: `${object.name} examinado` } })
    setExamined(previous => previous.includes(object.id) ? previous : [...previous, object.id])
    if (object.clue) setFound(previous => previous.some(item => item.title === object.clue) ? previous : [...previous, { title: object.clue, text: object.text }])
    if (combination) {
      setCompleted(previous => [...previous, combination.id])
      setFound(previous => previous.some(item => item.title === combination.title) ? previous : [...previous, { title: combination.title, text: combination.clue }])
    }
  }
  useEffect(() => {
    const onKey = event => {
      const focused = document.activeElement
      if (view !== 'game' || panel || ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused?.tagName) || focused?.isContentEditable) return
      if (event.key === ' ' && focused?.tagName === 'BUTTON') return
      if (['ArrowDown', 's', 'S', 'ArrowUp', 'w', 'W', 'e', 'E', ' '].includes(event.key)) event.preventDefault()
      if (['ArrowDown', 's', 'S'].includes(event.key)) move(1)
      if (['ArrowUp', 'w', 'W'].includes(event.key)) move(-1)
      if (['e', 'E', ' '].includes(event.key)) inspect(nearby)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, panel, nearby, depth])
  const choose = (next, label) => {
    if (current === 'start') setArchived(label === 'Guardar la foto')
    setCurrent(next); setDepth(0); setInspection(null); setPanel(null)
  }
  const restart = () => { setCurrent('start'); setDepth(0); setExamined([]); setFound([]); setCompleted([]); setInspection(null); setArchived(false); setPanel(null); setView('game') }
  return <div className="app">
    <header className="hud"><button type="button" onClick={restart} aria-label="Reiniciar historia">ORFEO <i>—</i> NO MIRES ATRÁS</button><span>{view === 'game' ? page.chapter : 'SOBRE EL PROYECTO'}</span><nav aria-label="Navegación principal"><button ref={gameButtonRef} type="button" onClick={showGame} aria-current={view === 'game' ? 'page' : undefined}>Juego</button>{view === 'game' && <><button type="button" onClick={() => setPanel('book')}>Cuaderno <b>{found.length}</b></button><button type="button" onClick={() => setPanel('cast')}>Personajes</button><button type="button" onClick={() => setPanel('explore')}>Explorar</button></>}<button type="button" onClick={() => { setPanel(null); setView('about') }} aria-current={view === 'about' ? 'page' : undefined}>Sobre el proyecto</button></nav></header>
    {view === 'game' ? <StoryPage key={current} page={page} depth={depth} objects={objects} examined={examined} nearby={nearby} inspection={inspection} onInspect={inspect} onMove={move} onChoose={choose} onRestart={restart} archived={archived}/> : <AboutPage onBack={showGame}/>}
    {panel === 'book' && <Modal title="Cuaderno" onClose={() => setPanel(null)}>{found.length ? <ul className="clue-list">{found.map(item => <li key={item.title}><strong>{item.title}</strong><p>{item.text}</p></li>)}</ul> : <p>Aún no has encontrado pistas.</p>}{archived && <p className="archive-note">✓ Orfeo guardó la foto de la azotea.</p>}</Modal>}
    {panel === 'cast' && <Modal title="Personajes" onClose={() => setPanel(null)}><ul className="clue-list"><li><strong>Orfeo</strong><p>Músico. Desciende al inframundo por Eurídice y lucha contra el miedo de perderla otra vez.</p></li><li><strong>Eurídice</strong><p>Murió en un accidente. Tiene voz propia y decide si quiere regresar.</p></li><li><strong>Perséfone</strong><p>Conoce la entrada bajo la estación y explica el camino de regreso.</p></li><li><strong>Hades</strong><p>Señor del inframundo. Permite el regreso con una sola regla: no mirar atrás hasta que ambos salgan al amanecer.</p></li></ul></Modal>}
    {panel === 'explore' && <Modal title={`Explorar: ${page.title}`} onClose={() => setPanel(null)}><p>Acércate a los objetos con W/S o ↑/↓. Cuando estén al alcance, pulsa E o Espacio.</p><ul>{objects.map(object => <li key={object.id}>{object.name} · profundidad {object.depth} {examined.includes(object.id) ? '✓ examinado' : ''}</li>)}</ul></Modal>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
