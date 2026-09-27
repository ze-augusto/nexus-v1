# Nexus — contrato de tokens

Este diretório é o espelho em código das variáveis do Figma
(`TWZKEZ7m2DMtRaGAIlw06L`, página `DS - Foundations`).

**O Figma é a fonte da verdade. Este diretório é derivado dele.**
Quando os dois discordarem, o Figma está certo e o código está desatualizado.

---

## Arquivos

| Arquivo | Collection no Figma | Modes |
|---|---|---|
| `primitives.css` | `Primitives` | `Default` |
| `semantic.css` | `Semantic` | `Light` |
| `typography-dashboard.css` | `Typography · Dashboard` | `Default` |
| `typography-app.css` | `Typography · App` | `Default` |
| `illustration.css` | `Illustration` | `Default` |

`illustration.css` é o único que **não** faz parte do contrato de interface —
ver "A exceção" abaixo.


---

## As duas superfícies

O Nexus são dois produtos com o mesmo sistema de cor e espaçamento,
e **tipografias diferentes**:

| | App | Dashboard |
|---|---|---|
| Quem | aluno e pais | psicólogo |
| Onde | celular nativo + webapp | web responsivo |
| Fonte | **Nunito** | **Inter** |
| Escala | única | única |

Nunca carregue os dois arquivos de tipografia no mesmo bundle.
São produtos separados.

---

## Como a cor está organizada

Três grupos, e o grupo é escolhido pelo **que a cor pinta**:

| grupo | pinta |
|---|---|
| `surface/` | o que preenche |
| `text/` | o que escreve |
| `border/` | o que contorna |

A intenção (`brand`, `critical`, `success`, `warning`) é **modificador dentro
do grupo**, nunca um grupo próprio. Modificadores: `-hover`/`-active` para
estados de superfície sólida, `-subtle` para um degrau mais leve da mesma
intenção, `-strong` para um mais forte.

**Não existe grupo `action/`.** Ele existiu até 08/08/2026 e era um grupo de
*componente*, não de papel — por isso duplicava onze tokens que já existiam:
o fundo do botão secundário já era `--surface-default`, o hover do terciário
já era `--surface-subtle`, o texto do primário já era `--text-inverse`.
Token nomeado por componente sempre termina assim. Se aparecer a vontade de
criar `--button-*` ou `--card-*`, é sinal de que falta um papel, não um
componente.

**Um vermelho de texto só.** `--text-critical` (red/700) serve mensagem de
erro *e* botão crítico. Eram dois porque o de mensagem (600) não aguentava o
botão pressionado — 4,37:1. O 700 aguenta os dois. `--text-success` e
`--text-warning` seguem em 600 porque ainda não têm controle; **se um intent
virar ação, o texto dele sobe para 700.**

---

## Como o espaçamento está organizado

Três grupos, e o grupo é escolhido pelo **que a medida faz** — nunca pelo valor:

| grupo | faz |
|---|---|
| `inset/` | padding: borda do bloco até o conteúdo dentro |
| `stack/` | gap de empilhamento **vertical** |
| `inline/` | gap de enfileiramento **horizontal** |

Os três repetem os mesmos números de propósito. Trocar `inset/md` por
`stack/md` não muda um pixel hoje — muda o dia em que a escala de padding
precisar andar sem levar a de gap junto.

**A rampa desceu um degrau em 16/08/2026.** `inset` e `stack` iam 8 → 16
direto, e o degrau era largo demais: com a tipografia menor, todo bloco que
pedia 12 pegava 16 e a tela ficou frouxa. O 12 entrou como `md` e todo mundo
desceu:

| | antes | agora |
|---|---|---|
| `xs` | 4 | 4 |
| `sm` | 8 | 8 |
| `md` | 16 | **12** |
| `lg` | 24 | **16** |
| `xl` | 32 | **24** |
| `2xl` | — | **32** (novo) |

`inline` não mudou: já era 4 / 8 / 12 / 16. Agora os três grupos batem.
Até 07/08/2026 o 12 era exclusivo de `inline`, com a justificativa de que
12 seria medida de gap na mesma linha — a justificativa não sobreviveu ao uso.

O que **não** é espaçamento e não vira token daqui: alinhamento geométrico
(centralizar um ponto sob um knob) e safe area do aparelho (em código é
`env(safe-area-inset-*)`, não um número nosso).

---

## A escala de tipografia do dashboard

Onze estilos, escala única, teto de 32px. O dashboard mostra muita informação
por tela; a escala é feita para densidade, não para impacto.

| papel | vai de | até |
|---|---|---|
| `heading/` | 14 | 32 |
| `body/` | 14 | 16 |
| `caption/` | 12 | 12 |

**12/16 no dashboard é caption, e caption é uma família só** — `md`,
`md-semibold`, `md-bold`, separadas por peso. Texto denso de tabela usa
`caption/md`; cabeçalho de tabela usa `caption/md-semibold`.

Três estilos foram apagados em 16/08/2026, todos pela mesma razão — eram
12/16 com outro nome:

| apagado | virou o quê |
|---|---|
| `caption/sm` | existia em 10, subiu para 11 e depois 12: `caption/md` repetido |
| `body/sm` | desceu 14 → 13 → 12/16: `caption/md` com 0,25% a menos de tracking |
| `body/sm-semibold` | mesma história contra `caption/md-semibold` |

**Não recriar `body/sm`.** `body` começa em 14 (`body/md`) e é isso. O salto
de 14 para 12 atravessa a fronteira body/caption de propósito.

O app (Nunito) tem escala própria e não segue nada disto — ver
`typography-app.css`.

---

## Regras de nome

1. **Caminho do Figma com `/` virando `-`. Nada é renomeado, nada é inventado.**
   `size/h1` → `--size-h1`. `body/md-semibold` → `.body-md-semibold`.

2. **Quando o mesmo caminho existe em duas collections, a superfície entra na frente.**
   `size/body-md` existe no app e no dashboard, e namespace de CSS var é global —
   então viram `--app-size-body-md` e `--dashboard-size-body-md`.
   `Primitives` e `Semantic` seguem sem prefixo: não colidem com ninguém.

3. **Dev nunca consome `Primitives`.** A camada de consumo é `Semantic` e as duas
   de tipografia. `--brand-500` num componente é bug, mesmo quando dá a cor certa.

4. **Nada de valor cru em componente.** Hex ou px solto no lugar de `var()` é bug.
   Esta é a regra que mais precisa de lint — é a que quebra primeiro sem ele.

---

## As transformações (e são só quatro)

Tudo o mais é cópia literal. Estas quatro são as únicas conversões, e é onde
o erro humano entra:

1. **Peso**: no Figma o valor é o nome do estilo — `Light`, `Semi Bold`,
   `ExtraBold`. No CSS vira número: 300, 600, 800.
   Cuidado: a Inter chama `Semi Bold` (com espaço) e a Nunito chama `SemiBold`
   (sem). Por isso os pesos são variáveis separadas por collection.

2. **Tracking**: no Figma é `PERCENT`, no CSS é `em`. `−1,5%` → `-0.015em`.
   CSS não aceita `%` em `letter-spacing`.
   Tracking negativo é correção óptica de tamanho grande: ele afrouxou junto
   com a escala quando o teto caiu de 52px para 32px.

3. **Unidade**: no Figma tamanho e entrelinha são número absoluto (px),
   no CSS do dashboard são `rem` a 1rem = 16px. `24` → `1.5rem`.
   É o que faz o dashboard respeitar o corpo de texto que o usuário
   configurou no browser; com px, não respeitava.
   `typography-app.css` ainda está em px — é dívida, não decisão.

   *Não existe mais transformação de mode.* O dashboard tinha `Desktop` e
   `Mobile` virando `@media (min-width: 1024px)` até 16/08/2026. A escala
   nova tem teto de 32px e já cabe em 375px, então virou única e a media
   query saiu. Nenhuma collection tem mais de um mode hoje.

4. **Caixa**: no Figma é `textCase`, no CSS é `text-transform`. `UPPER` →
   `uppercase`. Só um estilo usa: `app/label/sm`. A caixa alta é do **token**,
   nunca do conteúdo — texto escrito já em maiúscula no markup quebra leitor
   de tela e impede desfazer a decisão em um lugar só.

---

## Ao mexer no Figma

Alterar uma variável no Figma sem atualizar este diretório deixa o código
mentindo em silêncio. A ordem é: mexe no Figma → atualiza aqui → PR.
