# Broken Street — Arquivo Oficial

Site oficial do universo **Broken Street** — série cyberpunk original ambientada em SynthCity e demais cidades do mundo pós-impacto.

> Atmosfera: madrugada digital, neon quebrado, C.E. pulsando no asfalto molhado.

---

## Funcionalidades Implementadas

- **Página Principal** (`index.html`) — Hero com sinopse cyberpunk/madrugada, Cards dos 4 Agentes (Philip→Aidem→Anny→Scott), Sistema de Patentes C.E., Player de áudio integrado, Seção da organização Broken Street, Governo Galáctico (3 comandantes misteriosos), SynthCity, Ameaça Suprema (Apocalypse + Fragmentos Primordiais com emojis em roxo), Preview do Worldbook
- **Worldbook** (`wordbook.html`) — Sidebar navegável com busca em tempo real. Entradas completas por seção, ordenação Philip→Aidem→Anny→Scott. Inclui:
  - **As 7 Eras** (conforme Worldbook PDF)
  - **Cidades Principais** com slots de imagem placeholder (para inserção futura)
  - **Cavaleiros do Apocalipse** em estilo CIANO (#00e5ff)
  - **Apocalypse** em estilo VERMELHO (#ff1744)
  - **Governo Galáctico** — 3 comandantes de poder imensurável, identidades desconhecidas
  - **Armas/Equipamentos** descritos como C.E. cristalizada — obsidiana preta de dureza extrema
  - Emojis de localidades com cor roxa (#b026ff)
- **Fichas de Personagem** (4 páginas com dados fiéis aos PDFs):
  - `personagens/philip.html` — Philip Stills / Black Knuckles / Aspecto: Ego / Nível E→S
  - `personagens/aidem.html` — Aidem Stewart / Stygian Thorns / Aspecto: Angústia / Nível D→S
  - `personagens/anny.html` — Anny Pewter / Ignis / Aspecto: Orgulho / Nível D→S
  - `personagens/scott.html` — Scott Smith / Ironbound / Aspecto: Resiliência / Nível B→S
- **CSS Compartilhado** (`css/char.css`) — Estilos base para todas as páginas de personagem com variáveis CSS por personagem

---

## Estrutura de Arquivos

```
index.html              ← Página principal
wordbook.html           ← Worldbook completo
css/
  char.css              ← CSS compartilhado dos personagens
personagens/
  philip.html           ← Ficha do Philip Stills (001)
  aidem.html            ← Ficha do Aidem Stewart (002)
  anny.html             ← Ficha do Anny Pewter (003)
  scott.html            ← Ficha do Scott Smith (004)
```

---

## Dados dos Personagens (Fichas PDF)

| ID | Nome | Apelido | Signo | Idade | Altura | Aspecto C.E. | Nível | Equipamento | Nacionalidade |
|----|------|---------|-------|-------|--------|--------------|-------|-------------|---------------|
| 001 | Philip Stills | Ph | Câncer | 17 anos | 1,73 m | Ego | E→S | Black Knuckles | Astralis |
| 002 | Aidem Stewart | Aidy | Escorpião | 16 anos | 1,74 m | Angústia | D→S | Stygian Thorns | Astralis |
| 003 | Anny Pewter | Any | Câncer | 18 anos | 1,69 m | Orgulho | D→S | Ignis | Astralis |
| 004 | Scott Smith | — | Capricórnio | 19 anos | 1,72 m | Resiliência | B→S | Ironbound | SynthCity |

### Aparência (dos PDFs)
- **Philip** — Olhos roxos intensos (ficam mais intensos ao usar C.E.), cabelo preto bagunçado, pele morena
- **Aidem** — Olhos vermelhos profundos, expressão de cansaço/reflexão, cabelo preto bagunçado
- **Anny** — Olhos rosas com brilho intenso e calculista, cabelo rosa corte bob curto
- **Scott** — Olhos castanho-escuros marcantes, sempre atentos, cabelo castanho-escuro levemente bagunçado

### Quotes (dos PDFs)
- **Philip**: *"O garoto que transformou vazio em combustível."*
- **Aidem**: *"O garoto silencioso que carrega o abismo dentro de si."*
- **Anny**: *"A mente brilhante que transforma informação em vitória."*
- **Scott**: *"O sobrevivente que transformou cada cicatriz em força."*

---

## Worldbook — Entradas Implementadas

### As 7 Eras (conforme PDF do Worldbook)
1. **Era Primordial** — antes do impacto
2. **Era do Impacto** — o dia que partiu o mundo
3. **Era do Caos** — os séculos escuros
4. **Era da Reconstrução** — ordem sobre as cinzas
5. **Era da Expansão** — as cidades que não param
6. **Era do Domínio** — quando as corporações venceram
7. **Era Atual** — o limiar

### Cidades Principais (com slots de imagem placeholder)
- SynthCity, Astralis e demais cidades do PDF — cada uma com `<div class="city-img-placeholder">` para inserção futura de imagens

### Cavaleiros do Apocalipse
- Seção inteira estilizada em **CIANO** (#00e5ff / rgba(0,229,255,...))
- Tags, títulos, caixas de info e destaques todos em ciano

### Apocalypse
- Seção mantida em **VERMELHO** (#ff1744)

### Governo Galáctico
- Estrutura de poder supremo do mundo
- **3 Comandantes** de poder imensurável — identidades e paradeiro desconhecidos
- Seção dedicada no Worldbook (`id="entry-governo"`) e menção na página principal

### Armas / Equipamentos
- Todos os equipamentos descritos como **C.E. cristalizada** — material semelhante a obsidiana preta de dureza extrema
- Lista por personagem: Black Knuckles (Philip), Stygian Thorns (Aidem), Ignis (Anny), Ironbound (Scott)

---

## Funcionalidades Visuais

| Recurso | Implementação |
|---------|--------------|
| Emojis roxos | `<span style="color:#b026ff;">emoji</span>` |
| Cavaleiros ciano | Cor #00e5ff em todos os elementos da seção |
| Apocalypse vermelho | Cor #ff1744 em todos os elementos da seção |
| Slots de imagem (cidades) | `<div class="city-img-placeholder">` com borda tracejada |
| Scroll fade-in | IntersectionObserver com `.fade-in` + `.visible` |
| Barras de atributo | CSS animado com `data-val` via JS |
| Player de áudio | Fila com controles play/pause/seek por personagem |
| Sidebar busca | Busca em tempo real no Worldbook |
| Elementos angulares | `clip-path: polygon()` cyberpunk |

---

## Ordem dos Personagens (em todo o site)

**Philip → Aidem → Anny → Scott**

Esta ordem é seguida em:
- Cards da página principal
- Nav de personagens em todas as fichas
- Sidebar e seções de referência do Worldbook

---

## Funcionalidades não implementadas

- Imagens das cidades (slots preparados, aguardando upload)
- Expansão das seções de relacionamentos (deixadas rasas intencionalmente para edição futura)
- Página de login / área exclusiva
- Timeline visual interativa
- Mapa do mundo interativo
- Entradas expandidas do Worldbook: Economia, Religião, Estrutura Social, Fauna completa

---

## Próximos Passos Recomendados

1. **Inserir imagens das cidades** nos slots placeholder do Worldbook (já estão preparados)
2. **Expandir seções de relacionamentos** de cada personagem conforme definição da história
3. **Revelar os 3 Comandantes** do Governo Galáctico quando tiver os nomes/identidades
4. **Adicionar mais músicas** ao player da página principal
5. **Criar entradas adicionais** no Worldbook (Economia, Religião, Profissões)
6. **Expandir Fauna & Flora** com criaturas do Worldbook PDF

---

## Notas Técnicas

- Site 100% estático (HTML/CSS/JS) — sem frameworks ou build system
- Fontes via Google Fonts: Orbitron, Share Tech Mono, Rajdhani, Exo 2
- Variáveis CSS por personagem (`:root { --accent, --accent-rgb, --accent-glow, --accent-dim }`)
- Sem dependências externas além das fontes
- Responsivo para mobile (breakpoint 900px)
- Player de áudio integrado com fila e controles completos
- Cor roxa principal: `#b026ff` / `rgba(176,38,255,...)`
- Cor ciano (Cavaleiros): `#00e5ff` / `rgba(0,229,255,...)`
- Cor vermelha (Apocalypse): `#ff1744`
