// These memories add character detail. None changes Hades's rule or gates a choice.
export const objectReactions = {
  'rooftop-note': { speaker: 'ORFEO', text: 'La canción aún no tiene final. Le prometí que lo escribiría.', light: 'warm' },
  'rooftop-phone': { speaker: 'EURÍDICE · RECUERDO', text: 'Esa foto salió movida. Guárdala igual.', light: 'warm' },
  'signal-file': { speaker: 'ORFEO', text: 'Todavía huele a lluvia. No he podido guardarlo.', light: 'cold' },
  'signal-wave': { speaker: 'ORFEO', text: 'Aquí esperábamos el tren después de tocar hasta tarde.', light: 'cold' },
  'gate-map': { speaker: 'PERSÉFONE', text: 'El plano de arriba no muestra este camino. Sígueme.', light: 'violet' },
  'gate-usb': { speaker: 'PERSÉFONE', text: 'Recuerda: no mires atrás hasta que los dos hayan salido al amanecer.', light: 'violet' },
  'bargain-screen': { speaker: 'HADES', text: 'He oído tu petición. Ahora escucha mi respuesta.', light: 'cold' },
  'bargain-terms': { speaker: 'HADES', text: 'Una sola regla. Ni siquiera tú puedes cambiarla.', light: 'cold' },
  'bargain-speaker': { speaker: 'EURÍDICE', text: 'Estoy aquí, Orfeo. También quiero decidir.', light: 'warm' },
  'descent-steps': { speaker: 'ORFEO', text: 'Oigo sus pasos. Seguiré caminando.', light: 'violet' },
  'doubt-checksum': { speaker: 'EURÍDICE', text: 'Estoy aquí. No te detengas por miedo.', light: 'violet' },
  'voice-message': { speaker: 'EURÍDICE', text: 'Te quiero, pero quiero quedarme. Escúchame.', light: 'warm' },
  'climax-key': { speaker: 'EURÍDICE', text: 'Sal primero. Cuando esté fuera, te lo diré.', light: 'warm' },
}

export const combinations = [
  { id: 'rooftop-memory', art: 'rooftop', requires: ['rooftop-note', 'rooftop-phone'], title: 'La promesa de la canción', clue: 'La foto y la guitarra recuerdan una noche feliz. Eurídice quería oír la canción terminada.', speaker: 'ORFEO', text: 'La foto y la guitarra. Esa noche le prometí terminar la canción.', light: 'warm' },
  { id: 'signal-pattern', art: 'signal', requires: ['signal-file', 'signal-wave'], title: 'Los viajes de vuelta', clue: 'Orfeo y Eurídice esperaban juntos el primer tren después de tocar. Ahora él espera solo.', speaker: 'ORFEO', text: 'Su abrigo, este banco... Siempre volvíamos juntos en el primer tren.', light: 'cold' },
  { id: 'gate-route', art: 'gate', requires: ['gate-map', 'gate-usb'], title: 'El camino de Perséfone', clue: 'Perséfone conoce la escalera bajo el andén y recuerda a Orfeo la única regla: no mirar atrás hasta que ambos salgan al amanecer.', speaker: 'PERSÉFONE', text: 'Ya sabes por dónde bajar. Recuerda la regla al regresar.', light: 'violet' },
  { id: 'hades-condition', art: 'bargain', requires: ['bargain-screen', 'bargain-terms'], title: 'El trato de Hades', clue: 'Hades permite que Eurídice siga a Orfeo. Él no debe mirar atrás hasta que ambos hayan salido del inframundo al amanecer.', speaker: 'HADES', text: 'La dejaré seguirte. No mires atrás hasta que los dos hayan salido al amanecer.', light: 'cold' },
]

