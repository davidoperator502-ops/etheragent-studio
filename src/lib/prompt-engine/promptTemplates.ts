import { LabType } from './types';

// Bloques de contexto inyectados en generateVideoPrompt según el lab.
// 'social' = '' → el prompt se comporta EXACTAMENTE como antes (retrocompatibilidad).
export const LAB_PROMPT_CONTEXT: Record<LabType, string> = {
  social: '',

  ooh: `Este guion es para PUBLICIDAD EXTERIOR DIGITAL DE GRAN FORMATO (vallas y pantallas monumentales tipo Times Square / Shibuya Crossing).
- El espectador pasa a distancia y con poca atención: el impacto visual debe leerse en 1-3 segundos.
- NO dependas del audio (el entorno es ruidoso y normalmente sin sonido): la narrativa se cuenta con imagen y texto mínimo, grande y legible.
- Prioriza loops cortos de alto contraste, escala monumental, movimiento llamativo y un único mensaje dominante.
- Considera el dayparting (mañana/tarde/noche) y el dwell-time corto. El CTA debe ser memorable, no clickable.`,

  commercial: `Este guion es para un ACTIVO CINEMATOGRÁFICO de calidad broadcast (Streaming / OTT / Connected TV / cine).
- Aspecto 16:9, gradación de color HDR, profundidad cinematográfica y producción premium.
- Diseña AUDIO ESPACIAL (5.1 / Dolby Atmos): música, diálogo y SFX posicionados en el campo sonoro.
- Permite un arco narrativo completo con ritmo de spot de TV; sin elementos de UI de redes sociales.
- El CTA es de marca (brand recall), apto para pantalla grande y sistemas de sonido envolvente.`,
};
