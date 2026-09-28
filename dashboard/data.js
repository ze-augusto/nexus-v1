/* Protótipo — Dashboard do psicólogo (Nexus)
 *
 * Dados mock da Visão geral. Tudo é por DIA ÚTIL, nas últimas nove
 * semanas (22/06 a 18/08, 42 dias); os períodos da tela (10 dias,
 * 30 dias e bimestre) são recortes que dashboard.js faz daqui.
 *
 * Alunos e adesão: os ÚLTIMOS 10 valores de cada série são os do Figma
 * (366:8164); os 32 de antes foram inventados. Turmas: tudo inventado,
 * a partir dos níveis inteiros do Figma — o Figma só tinha o ano, e com
 * número inteiro. Médias e variações não estão aqui: saem da conta.
 *
 * `null` numa série de níveis é "sem dados" (célula tracejada).
 * ------------------------------------------------------------------ */

window.NEXUS_DASHBOARD = {
  /* Dias úteis, fins de semana ocultos. `week` agrupa o bimestre; o
     último dia é hoje. */
  days: [
    { weekday: "seg", date: "22/06", month: "jun", week: 0 },
    { weekday: "ter", date: "23/06", month: "jun", week: 0 },
    { weekday: "qua", date: "24/06", month: "jun", week: 0 },
    { weekday: "qui", date: "25/06", month: "jun", week: 0 },
    { weekday: "sex", date: "26/06", month: "jun", week: 0 },
    { weekday: "seg", date: "29/06", month: "jun", week: 1 },
    { weekday: "ter", date: "30/06", month: "jun", week: 1 },
    { weekday: "qua", date: "01/07", month: "jul", week: 1 },
    { weekday: "qui", date: "02/07", month: "jul", week: 1 },
    { weekday: "sex", date: "03/07", month: "jul", week: 1 },
    { weekday: "seg", date: "06/07", month: "jul", week: 2 },
    { weekday: "ter", date: "07/07", month: "jul", week: 2 },
    { weekday: "qua", date: "08/07", month: "jul", week: 2 },
    { weekday: "qui", date: "09/07", month: "jul", week: 2 },
    { weekday: "sex", date: "10/07", month: "jul", week: 2 },
    { weekday: "seg", date: "13/07", month: "jul", week: 3 },
    { weekday: "ter", date: "14/07", month: "jul", week: 3 },
    { weekday: "qua", date: "15/07", month: "jul", week: 3 },
    { weekday: "qui", date: "16/07", month: "jul", week: 3 },
    { weekday: "sex", date: "17/07", month: "jul", week: 3 },
    { weekday: "seg", date: "20/07", month: "jul", week: 4 },
    { weekday: "ter", date: "21/07", month: "jul", week: 4 },
    { weekday: "qua", date: "22/07", month: "jul", week: 4 },
    { weekday: "qui", date: "23/07", month: "jul", week: 4 },
    { weekday: "sex", date: "24/07", month: "jul", week: 4 },
    { weekday: "seg", date: "27/07", month: "jul", week: 5 },
    { weekday: "ter", date: "28/07", month: "jul", week: 5 },
    { weekday: "qua", date: "29/07", month: "jul", week: 5 },
    { weekday: "qui", date: "30/07", month: "jul", week: 5 },
    { weekday: "sex", date: "31/07", month: "jul", week: 5 },
    { weekday: "seg", date: "03/08", month: "ago", week: 6 },
    { weekday: "ter", date: "04/08", month: "ago", week: 6 },
    { weekday: "qua", date: "05/08", month: "ago", week: 6 },
    { weekday: "qui", date: "06/08", month: "ago", week: 6 },
    { weekday: "sex", date: "07/08", month: "ago", week: 6 },
    { weekday: "seg", date: "10/08", month: "ago", week: 7 },
    { weekday: "ter", date: "11/08", month: "ago", week: 7 },
    { weekday: "qua", date: "12/08", month: "ago", week: 7 },
    { weekday: "qui", date: "13/08", month: "ago", week: 7 },
    { weekday: "sex", date: "14/08", month: "ago", week: 7 },
    { weekday: "seg", date: "17/08", month: "ago", week: 8 },
    { weekday: "ter", date: "18/08", month: "ago", week: 8 }
  ],

  /* Nível emocional por turma: média diária dos check-ins, com uma
     casa. A visão por ano é a média das turmas do ano, feita em
     dashboard.js — as duas nunca desencontram. Clima espalhado de
     propósito (28/09): 9º ano triste; 7º ano e 2ª série acima de 4;
     6º acima de 3,5; 8º pouco acima de 3 — nos três períodos. 10/08
     é um dia ruim para todos, sem ser trágico: quem estava de 2,8 para
     cima caiu para 2,2–2,8; quem já estava abaixo ficou como estava. Não segue
     mais as cores do Figma.
     A escola começa no 6º ano; `stage` é o segmento. No E.M. o nome é
     série (1ª a 3ª), não ano.

     `checkins` é quantos alunos da turma fizeram check-in no dia —
     inventado. É a fonte da adesão (ver adherence) e do "12/15" do
     hover do heatmap. Dia sem nível é 0. Em 18/08 a escola soma 190 de
     232, o do card Hoje. Também em 18/08 o 9º ano A tem a menor
     média, 1,0, sozinho — o 9º ano C fica em 1,1 para não empatar. */
  classes: [
    { name: "6º ano A", year: "6º ano", stage: "E.F.", students: 16, levels: [3.9, 3.9, 4.1, 3.9, 4.0, 3.9, 2.9, 4.1, 3.9, 4.2, 3.7, 3.9, 3.0, 3.9, 4.0, 3.8, 5.0, 4.3, 4.7, 3.2, 3.9, 3.0, 3.9, 3.9, 3.8, 3.0, 3.6, 4.0, 4.0, 4.8, 3.8, 3.4, 3.9, 3.3, 3.2, 2.6, 5.0, 3.5, 4.1, 4.3, 3.2, 3.9], checkins: [13, 16, 16, 15, 15, 16, 16, 15, 16, 16, 16, 16, 14, 13, 14, 15, 14, 15, 16, 16, 14, 15, 15, 13, 15, 15, 14, 16, 13, 13, 16, 15, 16, 15, 14, 14, 13, 14, 13, 16, 16, 14] },
    { name: "6º ano B", year: "6º ano", stage: "E.F.", students: 15, levels: [4.0, 4.1, 4.3, 4.0, 3.9, 4.1, 3.3, 3.8, 4.2, 4.0, 3.8, 3.8, 3.1, 4.3, 4.1, 3.5, 4.8, 4.2, 4.7, 3.4, 3.6, 2.9, 4.0, 3.5, 3.8, 3.2, 3.8, 3.8, 3.8, 4.8, 4.1, 3.3, 4.0, 3.4, 3.3, 2.4, 4.7, 3.6, 4.2, 3.8, 3.1, 3.7], checkins: [13, 13, 13, 13, 13, 13, 13, 12, 13, 12, 12, 12, 12, 12, 13, 11, 12, 13, 12, 12, 12, 12, 12, 12, 11, 11, 11, 11, 12, 12, 12, 11, 12, 12, 11, 11, 10, 9, 11, 9, 11, 10] },
    { name: "7º ano A", year: "7º ano", stage: "E.F.", students: 16, levels: [5.0, 4.9, 4.8, 5.0, 4.9, 4.9, 5.0, 4.6, 5.0, 4.9, 5.0, 4.8, 4.7, 5.0, 4.5, 4.4, 4.4, 4.4, null, 4.5, 4.4, 4.4, 4.7, 5.0, 4.5, 5.0, 5.0, null, 4.4, 4.0, 4.7, 4.6, null, 4.1, 4.7, 2.8, 4.0, null, 4.4, 4.6, 4.4, 4.8], checkins: [13, 16, 15, 14, 15, 16, 16, 14, 16, 16, 16, 14, 15, 14, 14, 16, 14, 16, 0, 16, 14, 14, 15, 14, 14, 15, 15, 0, 14, 14, 16, 16, 0, 14, 14, 13, 13, 0, 12, 16, 15, 15] },
    { name: "7º ano B", year: "7º ano", stage: "E.F.", students: 15, levels: [5.0, 4.9, 4.9, 5.0, 4.8, 4.9, 5.0, 4.7, 5.0, 4.9, 5.0, 4.9, 4.9, 5.0, 4.4, 4.2, 4.3, 4.5, null, 4.6, 4.3, 4.5, 4.6, 5.0, 4.6, 5.0, 5.0, null, 4.3, 4.2, 4.9, 4.7, null, 4.2, 4.7, 2.5, 4.2, null, 4.5, 4.6, 4.5, 4.6], checkins: [12, 12, 12, 13, 12, 12, 13, 12, 12, 12, 11, 11, 12, 11, 12, 11, 12, 12, 0, 12, 11, 11, 12, 11, 11, 10, 11, 0, 11, 11, 10, 10, 0, 11, 11, 10, 10, 0, 9, 9, 11, 9] },
    { name: "8º ano A", year: "8º ano", stage: "E.F.", students: 15, levels: [3.7, 3.6, 3.1, 3.9, 3.5, null, null, 3.2, 3.5, 3.5, 3.4, 3.5, 3.0, 3.9, 3.3, 3.8, 3.5, 2.5, 3.3, 2.4, 3.7, 3.5, 3.5, 3.3, 3.0, 3.7, 3.5, 2.6, 3.4, 3.2, 2.4, 3.5, null, 3.5, 2.6, 2.2, 2.6, 2.8, 3.5, 3.5, 3.8, 3.3], checkins: [13, 15, 15, 14, 14, 0, 0, 14, 15, 14, 15, 14, 14, 12, 13, 14, 13, 15, 15, 15, 13, 14, 14, 13, 14, 13, 13, 15, 13, 13, 15, 15, 0, 14, 13, 12, 12, 13, 12, 15, 14, 14] },
    { name: "8º ano B", year: "8º ano", stage: "E.F.", students: 16, levels: [3.6, 3.2, 3.4, 3.9, 3.8, null, null, 3.1, 3.5, 3.4, 3.2, 3.6, 3.3, 3.9, 3.5, 4.0, 3.6, 2.7, 3.2, 2.5, 3.3, 3.2, 3.4, 3.7, 2.8, 3.6, 3.5, 2.5, 3.4, 3.3, 2.5, 3.4, null, 3.6, 2.5, 2.3, 2.6, 2.8, 3.4, 3.5, 3.4, 3.4], checkins: [14, 16, 15, 14, 14, 0, 0, 15, 16, 15, 16, 16, 15, 13, 14, 15, 14, 15, 16, 16, 13, 14, 15, 14, 15, 15, 14, 16, 14, 15, 16, 15, 0, 15, 15, 14, 13, 14, 12, 16, 14, 15] },
    { name: "9º ano A", year: "9º ano", stage: "E.F.", students: 15, levels: [3.3, 3.0, 1.9, 3.1, 1.7, 3.3, 3.0, 2.4, 2.3, 1.7, null, 2.2, 1.3, 1.8, 2.1, 2.5, 1.7, 2.1, 1.0, 2.8, 3.3, 1.5, 2.0, 1.6, 1.7, 3.1, 2.1, 1.8, 1.6, 1.9, null, 1.0, 2.0, 1.0, 1.1, 1.1, 1.0, 1.8, 1.8, 1.0, 1.7, 1.0], checkins: [12, 15, 14, 14, 14, 15, 15, 13, 15, 14, 0, 14, 15, 13, 13, 15, 13, 14, 15, 15, 12, 14, 14, 14, 13, 14, 13, 15, 13, 14, 0, 14, 15, 14, 13, 13, 11, 13, 11, 15, 14, 13] },
    { name: "9º ano B", year: "9º ano", stage: "E.F.", students: 16, levels: [3.7, 3.6, 2.2, 3.6, 2.2, 3.2, 3.4, 3.0, 2.5, 2.0, null, 2.3, 2.4, 2.4, 2.7, 2.6, 2.5, 2.1, 1.6, 3.7, 3.7, 1.9, 2.4, 1.9, 2.2, 3.0, 2.5, 2.2, 2.2, 2.5, null, 1.6, 2.6, 1.6, 1.4, 1.4, 1.7, 2.6, 2.3, 1.5, 2.1, 1.3], checkins: [13, 16, 14, 14, 14, 16, 16, 13, 16, 14, 0, 14, 15, 14, 14, 15, 14, 13, 16, 16, 13, 14, 16, 14, 14, 14, 14, 16, 14, 14, 0, 15, 16, 14, 13, 14, 12, 14, 12, 16, 14, 14] },
    { name: "9º ano C", year: "9º ano", stage: "E.F.", students: 15, levels: [2.7, 2.6, 1.9, 2.8, 1.1, 2.6, 2.4, 1.8, 2.3, 1.8, null, 1.5, 1.4, 1.6, 2.0, 1.9, 1.8, 1.3, 1.0, 2.8, 3.0, 1.6, 2.2, 1.4, 1.3, 2.3, 1.9, 1.6, 1.9, 1.8, null, 1.0, 1.9, 1.0, 1.0, 1.0, 1.0, 1.7, 1.7, 1.0, 2.0, 1.1], checkins: [14, 14, 13, 13, 13, 13, 12, 12, 12, 12, 0, 13, 13, 13, 12, 13, 12, 13, 12, 12, 12, 13, 12, 13, 11, 12, 12, 12, 12, 12, 0, 12, 12, 12, 12, 12, 11, 10, 11, 10, 11, 11] },
    { name: "1ª série A", year: "1ª série", stage: "E.M.", students: 16, levels: [2.9, 1.7, 3.2, 2.7, 2.6, 3.1, 2.5, 3.1, 3.3, 2.4, 3.3, 3.4, 3.4, 4.5, 2.7, 3.3, 3.4, 2.9, 3.4, null, 2.8, 3.0, 2.7, 3.2, 3.2, 3.8, 3.5, 2.0, 2.8, 4.3, 4.1, 4.1, 4.2, 3.1, 2.8, 2.2, 3.1, 2.4, 4.1, null, 2.8, 1.9], checkins: [11, 16, 14, 14, 13, 16, 16, 13, 16, 14, 16, 15, 15, 14, 14, 14, 13, 14, 16, 0, 13, 14, 15, 13, 13, 14, 13, 16, 13, 12, 16, 15, 16, 13, 13, 12, 12, 13, 11, 0, 14, 14] },
    { name: "1ª série B", year: "1ª série", stage: "E.M.", students: 15, levels: [2.9, 1.6, 2.3, 3.1, 2.7, 2.5, 2.1, 3.0, 2.7, 2.3, 2.8, 3.4, 2.8, 4.0, 2.6, 2.9, 3.0, 2.4, 3.3, null, 2.7, 2.9, 2.7, 2.8, 3.0, 3.5, 3.2, 1.9, 3.2, 3.9, 3.7, 3.6, 4.0, 3.0, 2.8, 2.2, 2.6, 2.8, 3.5, null, 2.5, 1.6], checkins: [11, 15, 14, 13, 13, 15, 15, 12, 15, 14, 15, 13, 13, 12, 13, 13, 12, 14, 15, 0, 12, 12, 13, 12, 12, 13, 13, 14, 12, 12, 15, 13, 15, 13, 12, 12, 12, 12, 11, 0, 13, 13] },
    { name: "2ª série A", year: "2ª série", stage: "E.M.", students: 16, levels: [3.5, null, 4.7, 3.7, 4.7, null, 4.1, 4.4, null, 4.0, 3.9, 4.0, 4.6, 4.3, 3.7, 4.7, 4.9, 4.8, 4.6, 3.8, 5.0, 3.8, 4.8, 4.2, 4.5, 4.0, 4.9, 3.6, 4.7, 4.0, 4.2, 4.3, 3.7, 4.7, 4.4, 2.7, 4.5, 3.8, 4.1, 4.7, 4.1, 4.7], checkins: [13, 0, 14, 14, 14, 0, 16, 14, 0, 15, 16, 14, 14, 12, 13, 14, 12, 14, 16, 16, 13, 14, 15, 12, 14, 14, 13, 15, 13, 13, 16, 14, 16, 13, 13, 13, 12, 13, 11, 16, 14, 14] },
    { name: "2ª série B", year: "2ª série", stage: "E.M.", students: 15, levels: [3.8, null, 4.7, 3.7, 4.6, null, 4.1, 4.4, null, 3.7, 4.0, 4.1, 4.3, 4.6, 3.5, 4.7, 5.0, 5.0, 4.5, 3.8, 5.0, 3.5, 4.5, 4.4, 4.2, 3.8, 5.0, 3.7, 4.7, 4.0, 4.5, 4.4, 3.7, 4.7, 4.5, 2.6, 4.7, 4.0, 4.0, 4.8, 4.0, 4.3], checkins: [11, 0, 13, 13, 13, 0, 15, 12, 0, 13, 15, 13, 13, 11, 12, 13, 12, 13, 15, 15, 12, 13, 14, 11, 12, 12, 13, 14, 12, 12, 15, 13, 15, 13, 12, 12, 11, 12, 10, 15, 13, 13] },
    { name: "3ª série A", year: "3ª série", stage: "E.M.", students: 15, levels: [4.2, 5.0, 4.2, 4.6, 3.5, 4.0, 3.9, 4.1, 4.5, 3.7, 4.1, 4.3, 3.0, 5.0, 3.9, 4.5, 4.2, 2.9, null, 3.9, 3.8, 2.8, 3.5, 4.4, 4.3, 3.6, 4.4, 3.2, 3.7, 4.8, 4.1, 4.5, 4.5, 3.2, 3.4, 2.5, 3.5, 3.6, 4.2, null, 4.4, 4.3], checkins: [12, 15, 14, 12, 14, 15, 15, 13, 15, 13, 15, 13, 13, 12, 12, 13, 12, 13, 0, 15, 12, 12, 13, 12, 13, 13, 13, 15, 12, 12, 15, 13, 15, 13, 12, 12, 11, 13, 11, 0, 13, 13] },
    { name: "3ª série B", year: "3ª série", stage: "E.M.", students: 16, levels: [3.1, 4.7, 3.2, 3.7, 3.0, 3.4, 3.4, 3.8, 3.6, 2.9, 3.1, 3.1, 2.5, 4.4, 3.7, 3.9, 3.9, 2.7, null, 3.6, 3.8, 2.7, 2.9, 3.3, 3.7, 2.9, 3.6, 2.4, 2.9, 3.9, 3.6, 3.6, 4.2, 2.7, 2.1, 2.3, 3.2, 2.9, 3.6, null, 3.6, 3.7], checkins: [13, 12, 13, 12, 13, 13, 12, 13, 12, 12, 13, 12, 13, 12, 12, 12, 11, 12, 0, 11, 12, 11, 11, 12, 11, 12, 11, 11, 12, 11, 11, 11, 12, 11, 10, 9, 9, 8, 8, 0, 8, 8] }
  ],


  /* Alunos para acompanhar. A ordem da tela (maior queda primeiro) é
     feita em dashboard.js, por período. `waiting` é o marcador de
     "Aguardando conversa". */
  students: [
    { name: "Beatriz Nogueira", group: "9º A", waiting: true, levels: [4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 5, 3, 4, 4, 3, 4, 3, 4, 4, 4, 5, 4, 4, 4, 4, 3, 2, 2, 2, 1, 1, 1] },
    { name: "Caio Bittencourt", group: "7º B", waiting: true, levels: [3, 3, 4, 4, 3, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 3, 3, 3, null, 1, 1, 1] },
    { name: "Rafael Queiroz", group: "8º A", waiting: false, levels: [4, 5, 4, 5, 5, 4, 5, 4, 4, 5, 4, 5, 4, 5, 4, 5, 5, 5, 5, 5, 5, 4, 5, 4, 5, 4, 4, 5, 5, 5, 4, 5, 5, 4, 4, 3, 4, 3, 3, 2, 2, 2] },
    { name: "Helena Vasconcelos", group: "9º C", waiting: false, levels: [4, 3, 3, 4, 4, 4, 4, 4, 3, 4, 3, 4, 5, 4, 3, 4, 4, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, null, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1] },
    { name: "Marina Sampaio", group: "6º A", waiting: false, levels: [4, 4, 3, 5, 4, 3, 4, 3, 3, 3, 4, 4, 4, 4, 4, 5, 4, 5, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 3, 5, 4, 3, 4, 4, 3, 3, 3, 3, 2, 2] }
  ],

  /* Adesão ao check-in. Não tem série própria: sai de classes[].checkins
     (check-ins do dia / alunos). O mínimo esperado é o do Figma.

     Por ser conta, 05/08 fica em 69% e não nos 88% do Figma: lá o 7º e
     o 8º ano aparecem sem check-in nesse dia, e sem esses 62 alunos a
     escola não passa de 73%. Os outros nove dias do Figma batem. */
  adherence: {
    threshold: 70
  },

  /* Espera por conversa. Estado de agora, não muda com período.
     `width` é a largura da barra no Figma, em % do trilho — e NÃO é
     proporcional a `count`: 3 alunos ocupam 76% e 1 aluno ocupa 32%,
     não 25%. */
  queue: [
    { label: "Hoje", count: 3, width: 76 },
    { label: "1–2 dias", count: 2, width: 54 },
    { label: "3–4 dias", count: 1, width: 32 },
    { label: "5 dias ou mais", count: 1, width: 32, overdue: true }
  ]
};
