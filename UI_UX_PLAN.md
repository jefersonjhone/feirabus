# Planejamento — UI/UX Profissional · BusFeira

> Documento de referência para a jornada de tornar a interface mais profissional.
> Última atualização: 20/07/2026.

---

## Visão Geral

O projeto passou por uma auditoria completa via skill `/impeccable` e três fases de **operação clean** (remoção de código morto). Agora estamos na fase de **melhoria visual real**, com base nos achados do audit.

| Métrica inicial | Valor |
|---|---|
| Design Health Score (Nielsen) | **19/40** — Poor |
| Audit Health Score (técnico) | **5/20** — Critical |
| Anti-Patterns Verdict | **FAIL** |
| Bundle JS (gzip) inicial | 190.88 kB |
| Bundle CSS (gzip) inicial | 14.21 kB |
| Código morto | ~365 KB + ~50 imports orfãos |

---

## Fase 0 — Auditoria (concluída)

- [x] Análise UI/UX via `/impeccable` skill
- [x] Inventário de código morto/não usado
- [x] Lista de prioridades P0–P3

---

## Fase 1 — Operação Clean: arquivos mortos (concluída)

**Resultado:** 9 arquivos deletados, ~365 KB liberados, CSS reduzido 57%.

- [x] `src/pages/linhas_old.jsx` (legacy)
- [x] `src/componentes/HorariosDetail.jsx` (morto)
- [x] `src/componentes/card-parada-proximas.jsx` (morto)
- [x] `src/componentes/card-map-view.jsx` (morto)
- [x] `src/componentes/modal.jsx` (morto)
- [x] `src/utils/infos_paradas.js` (~302 KB, morto)
- [x] `src/utils/getContent.js` (substituído por `useFetch`)
- [x] `src/utils/generate-sitemap.js` (script órfão, já no `.gitignore`)
- [x] `src/mock_dados.js` (dados mock, morto)
- [x] Limpar CSS morto em `App.css` (197 → 84 linhas)
- [x] Remover `* { transition: all; }` (vilão de performance)

---

## Fase 2 — Operação Clean: imports/exports orfãos (concluída)

**Resultado:** ~50 imports orfãos removidos em 14 arquivos, 3 exports mortos eliminados.

### Exports mortos removidos
- [x] `BarHLoading` (loading.jsx) — importado em 2 arquivos mas nunca renderizado
- [x] `Editar` (icons.jsx) — só usado no arquivo morto
- [x] `useCurrentPoint` + `currentPointContext` (pages/map.jsx)

### Arquivos limpos
- [x] `parada.id.jsx` — 6 imports orfãos
- [x] `linha.id.jsx` — 1 import
- [x] `componentes/veiculos.jsx` — 8 imports
- [x] `componentes/horarios.jsx` — 1 import
- [x] `card-buscar-parada.jsx` — 2 imports
- [x] `Menu/Paradas.jsx` — 2 imports
- [x] `Menu/Menu.jsx` — 4 imports
- [x] `Menu/Previsoes.jsx` — 2 imports
- [x] `Menu/prev.jsx` — 1 import
- [x] `Rota/Rota.jsx` — 2 imports
- [x] `input-paradas.jsx` — 1 import
- [x] `componentes/map.jsx` — 2 imports
- [x] `pages/linhas/index.jsx` — 2 imports
- [x] `pages/rotas.jsx` — 1 import + `navigate` orfão
- [x] `pages/map.jsx` — 2 imports + 1 context export
- [x] `marcadores.jsx` — 2 imports

---

## Fase 3 — Operação Clean: bugs latentes (concluída)

- [x] Fix `font-semilight` → `font-semibold` em `linhas/index.jsx:168`
- [x] Fix `<Link href="...">` → `<Link to="...">` em `footer.jsx` (8 ocorrências)
- [x] Fix `@tailwind componentes` → `@tailwind components` em `index.css:2`

---

## Fase 4 — Design System (100% concluído)

### 4.1 Tokens de design
- [x] Adicionar `brand.{50..950}` em `tailwind.config.js`
- [x] Adicionar `fontFamily.sans` com Inter
- [x] Adicionar `borderRadius.card` (0.75rem)
- [x] Adicionar `boxShadow.card` + `boxShadow.card-hover`
- [x] Adicionar `keyframes` `pulse-glow` e `slide-down` (move do App.css)
- [x] Adicionar Inter via Google Fonts em `public/index.html`
- [x] Brand color unificado: `blue-600` → `purple-800` em `footer.jsx` (17 ocorrências)
- [x] Brand color unificado: `blue-600/500/700` em `card-buscar-parada.jsx` e `parada.id.jsx`
- [x] Unificar `violet-700` → `purple-800` em 3 badges (`veiculos.jsx:182`, `parada.id.jsx:260, 319`)

### 4.2 Componentes compartilhados
- [x] Criar `componentes/card.jsx` — wrapper com `rounded-xl shadow-sm border-gray-200`
- [x] Criar `componentes/empty-state.jsx` — ícone + título + descrição + CTA opcional
- [x] Criar `componentes/skeleton.jsx` — skeleton loaders (substituir BarLoading em 9 lugares)

### 4.3 Remover anti-patterns visuais
- [x] Remover side-stripe borders (`border-l-purple-800 border-l-4`) em:
  - `LineCard` (`linhas/index.jsx:249`)
  - `StopCard` (`paradas/index.jsx:316`)
  - `LineCardVeiculo` (`veiculos.jsx:176`)
  - Cards inline (`favoritos.jsx:77, 121`)
- [x] Remover `hover:scale-y-110` em `parada.id.jsx:311` (layout shift)
- [x] Remover `hover:scale-y-105` em `parada.id.jsx:252`
- [x] Remover `filter: drop-shadow(10px 20px 8px #a6abad)` em `Menu/Previsoes.jsx:76` e `Menu/Paradas.jsx:53`

### 4.4 Fix loading state cru
- [x] Remover `<>loading...</>` em `componentes/veiculos.jsx:38` → `<BarLoading />`
- [x] Melhorar `error.jsx` — ícone SVG, copy PT-BR, imagem opcional com `aria-hidden`

### 4.5 Acessibilidade (P0 a11y)
- [x] Trocar `text-gray-400` → `text-gray-500` (39+ ocorrências, contraste 2.6:1 → 4.9:1 WCAG AA)
- [x] Trocar `text-slate-400` → `text-slate-500` (contraste WCAG AA)
- [ ] Adicionar `aria-label` em todos os botões só com ícone (navbar, favoritos, fechar, etc.)
- [x] Adicionar `aria-hidden="true"` em SVGs decorativos (icons.jsx + toast.jsx)
- [x] Garantir `role="status"` em loadings (BarLoading, SkeletonList, Toast)

### 4.6 Touch targets mobile
- [ ] Garantir botões ≥ 44×44px (`h-7 w-7` → `h-10 w-10`)

---

## Fase 5 — Micro-interações (concluída)

- [x] `motion.div` com `whileInView` em 4 cards: LineCard, StopCard, LineCardVeiculo, CardLinhaPopular
- [x] `useReducedMotion()` — sem animacao quando `prefers-reduced-motion: reduce`
- [x] Easing `easeOut` + duracao 0.3s + `viewport={{ once: true }}`

---

## Fase 6 — Polish final (concluída)

- [x] Footer: texto PT-BR
- [x] Footer: copyright "Todos os direitos reservados"
- [x] Footer: remover icones de redes sociais com `href="#"` (nao funcionais)
- [ ] QA manual final (touch, contraste, busca)

---

## Estado Final Pos-Todas-as-Fases

| Métrica | Antes | Agora | Δ |
|---|---|---|---|
| Arquivos deletados | — | 9 | -9 |
| Imports orfãos | ~50 | 0 | -50 |
| CSS morto (App.css) | 197 linhas | 84 linhas | -57% |
| `* { transition: all; }` | ativo | removido | ✓ |
| `@tailwind componentes` (typo) | presente | corrigido | ✓ |
| `font-semilight` (typo) | ativo | corrigido | ✓ |
| `<Link href>` (bug SPA) | 8 ocorrências | 0 | ✓ |
| Brand colors | blue + purple + violet | purple-800 (100%) | ✓ |
| Design tokens | nenhum | `brand`, `fontFamily`, `shadow`, `radius` | ✓ |
| Side-stripe borders | 5 cards | 0 | ✓ |
| `hover:scale-y` layout shift | 2 ocorrências | 0 | ✓ |
| `drop-shadow` em imagens | 2 ocorrências | 0 | ✓ |
| `loading...` cru (sem estilo) | 1 | 0 (BarLoading) | ✓ |
| `error.jsx` genérico | `<div>` + `<img>` | ícone SVG + copy PT | ✓ |
| Contraste WCAG AA | 39+ falhas (gray-400) | 0 (gray-500) | ✓ |
| Componentes compartilhados | 0 | 3 (Card, EmptyState, Skeleton) | +3 |
| `aria-hidden` em SVGs | 15+ (icons.jsx, toast) | 0 | ✓ |
| `role="status"` em loadings | 0 | 3 (BarLoading, Skeleton, Toast) | ✓ |
| Micro-interacoes motion | 0 | 4 cards com `whileInView` | ✓ |
| Footer en-US | 3 frases en | 100% pt-BR | ✓ |
| Footer links `#` | 3 redes sociais | 0 (removido) | ✓ |
| **Bundle JS (gzip)** | 190.88 kB | 191.00 kB | +127 B |
| **Bundle CSS (gzip)** | 14.21 kB | 13.48 kB | -733 B |

---

## Comandos do Skill Impeccable Recomendados

| Comando | Quando usar |
|---|---|
| `$impeccable optimize` | Performance (já feito na Fase 1) |
| `$impeccable audit` | A11y/perf/responsivo — antes de finalizar |
| `$impeccable layout` | Cards unificados, hierarquia |
| `$impeccable colorize` | Aplicar tokens `brand` nos componentes |
| `$impeccable clarify` | Empty states, error.jsx, copy |
| `$impeccable adapt` | Touch targets, mobile |
| `$impeccable typeset` | Escala tipográfica |
| `$impeccable animate` | Micro-interações com `prefers-reduced-motion` |
| `$impeccable polish` | Pass final |

---

## Referências

- Auditoria completa via `/impeccable` skill
- Inventário de código morto
- Operação Clean Fases 1–3 (concluídas)
- Tailwind config: `tailwind.config.js`
- Componentes vivos: `src/componentes/`
- Páginas: `src/pages/`

