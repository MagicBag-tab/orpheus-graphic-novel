// Distances are scene-local steps. X/Y are percentages of the stage, independent of its pixel size.
const sceneObjects = {
  rooftop: [
    { id: 'rooftop-note', name: 'Guitarra', depth: 1, x: 56, y: 52, clue: 'Canción sin terminar', text: 'Orfeo dejó una estrofa a medias. Eurídice le pidió que la terminara para ella.' },
    { id: 'rooftop-rail', name: 'Barandal', depth: 3, x: 24, y: 48, text: 'Eurídice había pegado aquí una calcomanía que decía: «vuelve a casa».' },
    { id: 'rooftop-phone', name: 'Fotografía', depth: 5, x: 77, y: 66, text: 'En la foto, Eurídice mira a Orfeo mientras él afina la guitarra.' },
  ],
  signal: [
    { id: 'signal-file', name: 'Abrigo de Eurídice', depth: 1, x: 24, y: 42, clue: 'Su abrigo', text: 'Orfeo aún conserva el abrigo que Eurídice llevaba cuando llovía.' },
    { id: 'signal-wave', name: 'Banco vacío', depth: 3, x: 52, y: 43, text: 'Aquí esperaban juntos el primer tren después de los conciertos.' },
    { id: 'signal-screen', name: 'Horario nocturno', depth: 5, x: 78, y: 63, text: 'El último tren sale antes de medianoche. Después, la estación queda desierta.' },
  ],
  gate: [
    { id: 'gate-map', name: 'Plano del metro', depth: 1, x: 21, y: 42, text: 'El plano termina en este andén. Las escaleras de abajo no están dibujadas.' },
    { id: 'gate-usb', name: 'Billete de Perséfone', depth: 3, x: 59, y: 54, clue: 'Billete de Perséfone', text: 'Perséfone entrega a Orfeo un billete de ida y vuelta. Le recuerda que no debe mirar atrás.' },
    { id: 'gate-door', name: 'Escaleras oscuras', depth: 5, x: 79, y: 40, text: 'Descienden por debajo de las vías. Perséfone conoce el camino.' },
  ],
  bargain: [
    { id: 'bargain-screen', name: 'Trono de Hades', depth: 1, x: 75, y: 35, text: 'Hades escucha a Orfeo sin interrumpirlo. No aparta la vista de Eurídice.' },
    { id: 'bargain-terms', name: 'Regla del regreso', depth: 3, x: 48, y: 53, clue: 'La regla de Hades', text: 'Orfeo no debe mirar atrás hasta que él y Eurídice hayan salido del inframundo al amanecer.' },
    { id: 'bargain-speaker', name: 'Antorcha', depth: 5, x: 22, y: 67, text: 'La llama ilumina a Eurídice al otro lado de la sala.' },
  ],
  descent: [
    { id: 'descent-light', name: 'Luz de emergencia', depth: 1, x: 23, y: 31, text: 'Se enciende una luminaria cada vez que Orfeo da un paso.' },
    { id: 'descent-steps', name: 'Pasos detrás', depth: 3, x: 51, y: 72, clue: 'Los pasos de Eurídice', text: 'Orfeo oye los pasos de Eurídice detrás de los suyos. No necesita volverse para saber que sigue ahí.' },
    { id: 'descent-phone', name: 'Pared húmeda', depth: 5, x: 76, y: 60, text: 'Orfeo apoya una mano en la pared y recuerda cómo Eurídice se burlaba de su miedo a la oscuridad.' },
  ],
  doubt: [
    { id: 'doubt-ghost', name: 'Sombra en el túnel', depth: 1, x: 76, y: 40, text: 'La sombra de Orfeo se alarga hacia la salida. Él sigue mirando al frente.' },
    { id: 'doubt-checksum', name: 'Pasamanos', depth: 3, x: 47, y: 53, clue: 'Palabras de Eurídice', text: 'Eurídice le pide que siga caminando. Hablarán cuando ambos estén fuera.' },
    { id: 'doubt-static', name: 'Eco', depth: 5, x: 21, y: 67, text: 'Durante un momento no oye pasos. Después escucha a Eurídice llamarlo por su nombre.' },
  ],
  voice: [
    { id: 'voice-timer', name: 'Escalón', depth: 1, x: 25, y: 43, text: 'Orfeo se detiene para escucharla sin darse la vuelta.' },
    { id: 'voice-message', name: 'Pañuelo de Eurídice', depth: 3, x: 74, y: 55, clue: 'La decisión de Eurídice', text: 'Eurídice quiere quedarse. Le pide a Orfeo que respete su decisión.' },
  ],
  climax: [
    { id: 'climax-exit', name: 'Señal de salida', depth: 1, x: 78, y: 35, text: 'Está a un paso. Afuera todavía llueve.' },
    { id: 'climax-key', name: 'Umbral de la calle', depth: 3, x: 51, y: 62, clue: 'El umbral', text: 'La regla termina solo cuando Orfeo y Eurídice estén fuera, al amanecer.' },
    { id: 'climax-shadow', name: 'Sombra detrás', depth: 5, x: 25, y: 46, text: 'Está ahí. Orfeo no necesita darse la vuelta para oírla.' },
  ],
  tragic: [{ id: 'tragic-screen', name: 'Escalera vacía', depth: 2, x: 53, y: 50, text: 'Orfeo se volvió antes de tiempo. Eurídice ya no está en la escalera.' }],
  ending: [{ id: 'ending-chair', name: 'Dos sombras', depth: 2, x: 28, y: 66, text: 'Las sombras de Orfeo y Eurídice se extienden juntas sobre la acera.' }],
  quiet: [{ id: 'quiet-bin', name: 'Salida del metro', depth: 2, x: 66, y: 54, text: 'Orfeo sale solo. Respeta la decisión de Eurídice de quedarse.' }],
  lost: [{ id: 'lost-doors', name: 'Entrada cerrada', depth: 2, x: 55, y: 42, text: 'La estación cierra. Orfeo no logra llegar hasta Hades.' }],
}

export function objectsFor(art) { return sceneObjects[art] ?? [] }
export function nearestObject(objects, depth, range = 1) {
  return objects.filter(object => Math.abs(object.depth - depth) <= range)
    .sort((a, b) => Math.abs(a.depth - depth) - Math.abs(b.depth - depth))[0] ?? null
}
