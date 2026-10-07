# BROKEN STREET — Arquivo Oficial

Site fictício de universo cyberpunk para a série **Broken Street**, com estética neon/distópica.

## Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Página principal (hero, sinopse, agentes, cyber energy, trilha, apocalypse, worldbook) |
| `personagens.html` | Galeria geral de personagens com imagem, nome e descrição básica |
| `worldbook.html` | Enciclopédia do universo com sidebar de navegação e busca |
| `chars/philip.html` | Arquivo do personagem Philip Stills (Tipo-P / Percepção) |
| `chars/aidem.html` | Arquivo do personagem Aidem Stewart (Tipo-K / Cinética) |
| `chars/anny.html` | Arquivo do personagem Anny Pewter (Tipo-E / Empatia) |
| `chars/scott.html` | Arquivo do personagem Scott Smith (Tipo-D / Dados) |
| `css/char.css` | Folha de estilos compartilhada para páginas de personagem |

## Estrutura de Pastas

```
index.html
worldbook.html
README.md
css/
  char.css
chars/
  philip.html
  aidem.html
  anny.html
  scott.html
```

## Tecnologias

- HTML5 + CSS3 puro (sem frameworks)
- Google Fonts: Orbitron, Share Tech Mono, Rajdhani, Exo 2
- CSS custom properties para temas por personagem
- Animações CSS (grid drift, bar grow, fade in)
- JavaScript vanilla para navegação do Worldbook

## Personagens

| Agente | Cor | Tipo CE | Codename |
|---|---|---|---|
| Philip Stills | #b026ff (Roxo) | Tipo-P Percepção | STATIC |
| Aidem Stewart | #ff1744 (Vermelho) | Tipo-K Cinética | BURNWIRE |
| Anny Pewter | #ff1493 (Pink) | Tipo-E Empatia | SIGNAL |
| Scott Smith | #2693ff (Azul) | Tipo-D Dados | CIPHER |

## Reações dos capítulos

Cada capítulo usa a mesma interação, com pergunta, opções e respostas configuradas por capítulo em `js/chapter-reactions.js`. Para mudar uma reação, edite o texto e a resposta da opção correspondente; os identificadores (`moon`, `spark`, `uneasy`, `next`) devem permanecer iguais para que a contagem continue associada ao símbolo certo.

As reações são registradas no Supabase sem login do leitor. A tabela guarda somente o número do capítulo, a opção escolhida e o horário; não grava nome, e-mail ou identificador do leitor. Cada envio é contado como uma reação, portanto não representa necessariamente uma pessoa única.

### Configuração do Supabase

1. Crie um projeto no Supabase e execute `supabase/reader-reactions.sql` pelo SQL Editor.
2. Em Authentication, desative o cadastro público de usuários e crie manualmente a conta do criador. O painel permite a leitura das contagens a qualquer conta autenticada; manter o cadastro público desativado faz com que somente a conta criada por você possa entrar.
3. Copie a Project URL e a chave pública `anon`/publishable do projeto para `url` e `anonKey` em `js/supabase-config.js`. Essa chave é feita para uso no navegador; nunca coloque a chave `service_role` nesse arquivo.
4. Publique o site normalmente. Os visitantes poderão enviar reações; você pode entrar em `reaction-admin.html` com a conta do criador para ver a quantidade de cada opção em cada capítulo.

Sem URL/chave configuradas, a interação visual continua funcionando, mas os envios não são contabilizados e o leitor verá um aviso. O painel de administração também informa quando falta configuração.
