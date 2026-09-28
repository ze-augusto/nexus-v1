/* Protótipo — Dashboard do psicólogo (Nexus)
 *
 * Heatmap, barras e listas saem de dados (data.js), não de markup
 * escrito à mão. O que já reage: o período de cada card (10 dias,
 * 30 dias, bimestre), Ano/Turma no nível emocional, a gaveta de
 * navegação abaixo de 1024px, o hover das barras de adesão e o hover
 * das células do heatmap. Personalizado e "Ocultar fins de semana"
 * ainda são só desenho.
 * ------------------------------------------------------------------ */

(function () {
  "use strict";

  var DATA = window.NEXUS_DASHBOARD;

  /* Períodos. Dias: as últimas N colunas de data.js. Bimestre: as nove
     semanas, cada coluna é a média da semana. `compact` troca o
     cabeçalho "qua / 05/08" por só o dia, com o mês marcado quando
     muda — 22 colunas não cabem com data completa. */
  var PERIODS = {
    "10d": { kind: "day", count: 10 },
    "30d": { kind: "day", count: 22, compact: true },
    bim: { kind: "week" }
  };

  /* ---------------------------------------------------------------
   * Colunas e contas
   * --------------------------------------------------------------- */

  /* Cada coluna sabe quais dias de data.js ela cobre (`indices`) e
     como se escreve no cabeçalho, no eixo das barras e no balão. */
  function columnsFor(periodKey) {
    var period = PERIODS[periodKey];
    var last = DATA.days.length - 1;
    var columns = [];

    if (period.kind === "day") {
      var first = DATA.days.length - period.count;
      DATA.days.slice(first).forEach(function (day, i) {
        var prev = i > 0 ? DATA.days[first + i - 1] : null;
        var dd = day.date.slice(0, 2);
        columns.push({
          indices: [first + i],
          top: period.compact ? (!prev || prev.month !== day.month ? day.month : "") : day.weekday,
          bottom: period.compact ? dd : day.date,
          axis: period.compact ? dd : day.date,
          label: day.weekday + ", " + day.date,
          current: first + i === last,
          currentType: "date"
        });
      });
      return columns;
    }

    DATA.days.forEach(function (day, i) {
      var column = columns[day.week];
      if (!column) {
        var prev = columns[day.week - 1];
        column = columns[day.week] = {
          indices: [],
          top: !prev || prev.month !== day.month ? day.month : "",
          month: day.month,
          start: day.date,
          axis: day.date,
          label: "semana de " + day.date,
          current: false,
          currentType: "true",
          weekly: true
        };
      }
      column.indices.push(i);
      column.bottom = column.start.slice(0, 2) + "–" + day.date.slice(0, 2);
      if (i === last) column.current = true;
    });
    return columns;
  }

  function mean(values) {
    var sum = 0;
    var n = 0;
    values.forEach(function (v) {
      if (v !== null) {
        sum += v;
        n += 1;
      }
    });
    return n ? sum / n : null;
  }

  function pick(values, indices) {
    return indices.map(function (i) {
      return values[i];
    });
  }

  function decimal(value) {
    return value.toFixed(1).replace(".", ",");
  }

  /* Tom de um nível escrito (coluna Média e balão), sempre em negrito:
     abaixo do 3 (neutro) é alerta, vermelho, mesmo que arredonde para
     3; de 4 para cima é destaque positivo, verde de sucesso. A cor da
     célula tem régua própria — só pinta o que arredonda para 1 ou 2. */
  function toneOf(value) {
    if (value === null) return "";
    if (value < 3) return "critical";
    if (value >= 4) return "positive";
    return "";
  }

  /* Nas pontas, o balão encosta na borda em vez de centralizar, para
     não vazar do card. */
  function edgeClass(i, count) {
    if (i < count * 0.2) return " tooltip--start";
    if (i >= count * 0.8) return " tooltip--end";
    return "";
  }

  function sum(values) {
    return values.reduce(function (total, v) {
      return total + (v || 0);
    }, 0);
  }

  /* ---------------------------------------------------------------
   * Balão — um só desenho para barra de adesão e célula do heatmap.
   * `sections` é [{ label, items: [{ label, value, tone }], empty }];
   * `tone` pinta o valor. Seção sem item mostra `empty`, ou some.
   * --------------------------------------------------------------- */
  function tooltipInner(options) {
    /* Título e subtítulo em duas linhas, com pesos diferentes, em vez
       de uma linha partida por ponto. */
    var html =
      '<span class="tooltip__header">' +
      '<span class="tooltip__title dashboard-caption-md-semibold">' + options.title + "</span>" +
      (options.subtitle ? "<span>" + options.subtitle + "</span>" : "") +
      "</span>";

    options.sections.forEach(function (section) {
      if (!section.items.length) {
        if (section.empty) html += '<span class="tooltip__label">' + section.empty + "</span>";
        return;
      }
      html +=
        (section.label ? '<span class="tooltip__label">' + section.label + "</span>" : "") +
        '<ul class="tooltip__list">' +
        section.items
          .map(function (item) {
            return (
              "<li><span>" + item.label + "</span>" +
              '<span class="tooltip__value' + (item.tone ? " tooltip__value--" + item.tone : "") +
              (item.tone === "critical" || item.tone === "positive" ? " dashboard-caption-md-bold" : "") + '">' +
              item.value + "</span></li>"
            );
          })
          .join("") +
        "</ul>";
    });

    return html;
  }

  function tooltipMarkup(options) {
    return (
      '<span class="tooltip' + options.edge + ' dashboard-caption-md" role="tooltip" id="' + options.id + '">' +
      tooltipInner(options) +
      "</span>"
    );
  }

  /* ---------------------------------------------------------------
   * Grade — heatmap de ano e de aluno
   * --------------------------------------------------------------- */

  /* Célula de nível. O número está sempre escrito — a cor nunca diz o
     nível sozinha. Sem dado é outra coisa, não um degrau da rampa.
     A cor vai numa caixa dentro do <td>, não no <td>: a coluna estica
     com a tela, a caixa não passa do tamanho máximo.

     Média (de turma, de ano, ou de semana) vai com uma casa; o nível
     de um aluno num dia é inteiro, é um check-in só. A cor sai do valor
     escrito (ver levelClass). O detalhe fica no hover (ver setupGridHover). */
  /* Degrau de cor de uma célula, pelo valor escrito nela (uma casa):
     abaixo de 2 é o vermelho escuro (1), de 2 a 2,9 o claro (2), de 3
     para cima o neutro. 2,5 é vermelho claro, não 3. */
  function levelClass(value) {
    var shown = Math.round(value * 10) / 10;
    if (shown < 2) return 1;
    if (shown < 3) return 2;
    return Math.round(shown);
  }

  function cellMarkup(levels, column, averaged) {
    var value = mean(pick(levels, column.indices));

    if (value === null) {
      return '<td class="cell"><span class="cell__box cell--empty"><span class="visually-hidden">Sem dados</span></span></td>';
    }

    return (
      '<td class="cell"><span class="cell__box cell--' + levelClass(value) + ' dashboard-caption-md">' +
      (column.weekly || averaged ? decimal(value) : String(value)) +
      "</span></td>"
    );
  }

  function colgroupMarkup(columns) {
    return (
      '<col class="grid__col-label" />' +
      '<col span="' + columns.length + '" />' +
      '<col class="grid__col-end" />'
    );
  }

  /* O cabeçalho visível é abreviado (só "05" nos 30 dias); o nome
     inteiro da coluna vai escondido para o leitor de tela. */
  function headMarkup(columns, corner, end) {
    var html = '<tr><th scope="col" class="grid__corner dashboard-caption-md-semibold">' + corner + "</th>";
    columns.forEach(function (column) {
      html +=
        '<th scope="col" class="grid__day' + (column.current ? " grid__day--today" : "") + '"' +
        (column.current ? ' aria-current="' + column.currentType + '"' : "") + ">" +
        '<span class="' + (column.current ? "dashboard-caption-md-semibold" : "dashboard-caption-md") + '" aria-hidden="true">' +
        (column.top || " ") + "</span>" +
        '<span class="dashboard-caption-md-semibold" aria-hidden="true">' + column.bottom + "</span>" +
        '<span class="visually-hidden">' + column.label + "</span>" +
        "</th>";
    });
    html += '<th scope="col" class="grid__end dashboard-caption-md-semibold">' + end + "</th></tr>";
    return html;
  }

  function periodLevels(levels, columns) {
    var indices = [];
    columns.forEach(function (column) {
      indices = indices.concat(column.indices);
    });
    return pick(levels, indices);
  }

  /* Linhas do nível emocional. Por turma, direto de data.js. Por ano,
     a média das turmas do ano, dia a dia (dia sem dado em nenhuma
     turma continua sem dado). */
  function seriesRows(group) {
    if (group === "class") {
      return DATA.classes.map(function (c) {
        return {
          name: c.name,
          meta: c.stage + " · " + c.students + " alunos",
          levels: c.levels,
          checkins: c.checkins,
          students: c.students
        };
      });
    }

    var years = [];
    var byYear = {};
    DATA.classes.forEach(function (c) {
      var key = c.year + " " + c.stage;
      if (!byYear[key]) {
        byYear[key] = [];
        years.push(key);
      }
      byYear[key].push(c);
    });

    return years.map(function (key) {
      var classes = byYear[key];
      return {
        name: key,
        meta: classes.length + " turmas",
        levels: DATA.days.map(function (_, d) {
          return mean(
            classes.map(function (c) {
              return c.levels[d];
            })
          );
        }),
        checkins: DATA.days.map(function (_, d) {
          return sum(
            classes.map(function (c) {
              return c.checkins[d];
            })
          );
        }),
        students: sum(
          classes.map(function (c) {
            return c.students;
          })
        )
      };
    });
  }

  /* 22 colunas com "2,4" dentro não cabem em tela estreita. A grade
     ganha rolagem lateral só nesse caso, com os nomes presos à
     esquerda; --columns dá a largura mínima. */
  function setScroll(table, columns, averaged) {
    var wrap = table.parentNode;
    var scroll = averaged && columns.length > 10;
    wrap.toggleAttribute("data-scroll", scroll);
    table.style.setProperty("--columns", columns.length);
  }

  function renderSeries(card, state) {
    var table = card.querySelector(".grid");
    var columns = columnsFor(state.period);
    var byClass = state.group === "class";

    var rows = seriesRows(state.group);
    var body = rows
      .map(function (row) {
        var average = mean(periodLevels(row.levels, columns));
        var tone = toneOf(average);
        return (
          "<tr>" +
          '<th scope="row" class="grid__label grid__label--series">' +
          '<span class="dashboard-body-md-semibold">' + row.name + "</span>" +
          '<span class="dashboard-caption-md">' + row.meta + "</span>" +
          "</th>" +
          columns
            .map(function (column) {
              return cellMarkup(row.levels, column, true);
            })
            .join("") +
          '<td class="grid__average' +
          (tone ? " grid__average--" + tone + " dashboard-caption-md-bold" : " dashboard-caption-md-semibold") +
          '">' + decimal(average) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    table.querySelector("colgroup").innerHTML = colgroupMarkup(columns);
    table.tHead.innerHTML = headMarkup(columns, byClass ? "Turma" : "Ano/série", "Média");
    table.tBodies[0].innerHTML = body;
    setScroll(table, columns, true);
    gridViews.set(table, { tip: seriesTip, rows: rows, columns: columns });

    card.querySelector("[data-subtitle]").textContent =
      "Média " + (PERIODS[state.period].kind === "week" ? "semanal" : "diária") +
      " do nível emocional informado nos check-ins de cada " + (byClass ? "turma" : "ano ou série") + ".";
  }

  /* Variação = último valor do período menos o primeiro (na semana,
     última média menos primeira). Ordem: maior queda primeiro. */
  function renderStudents(card, state) {
    var table = card.querySelector(".grid");
    var columns = columnsFor(state.period);
    var weekly = PERIODS[state.period].kind === "week";

    var rows = DATA.students.map(function (row) {
      var values = columns
        .map(function (column) {
          return mean(pick(row.levels, column.indices));
        })
        .filter(function (v) {
          return v !== null;
        });
      return { row: row, delta: values[values.length - 1] - values[0] };
    });
    rows.sort(function (a, b) {
      return a.delta - b.delta;
    });

    var body = rows
      .map(function (item) {
        var row = item.row;
        /* O marcador vazio ocupa o mesmo espaço: sem ele, os nomes de
           quem não está esperando andariam 10px para a esquerda. */
        var marker = row.waiting
          ? '<span class="marker"><span class="visually-hidden">Aguardando conversa</span></span>'
          : '<span class="marker marker--empty" aria-hidden="true"></span>';
        var size = Math.abs(item.delta);
        var delta = (item.delta < 0 ? "−" : item.delta > 0 ? "+" : "") + (weekly ? decimal(size) : String(size));

        return (
          "<tr>" +
          '<th scope="row" class="grid__label">' +
          '<span class="grid__student">' + marker +
          '<span class="grid__names">' +
          '<span class="dashboard-body-md-semibold">' + row.name + "</span>" +
          '<span class="grid__group dashboard-caption-md">' + row.group + "</span>" +
          "</span></span>" +
          "</th>" +
          columns
            .map(function (column) {
              return cellMarkup(row.levels, column, false);
            })
            .join("") +
          '<td class="grid__delta dashboard-body-md-semibold">' + delta + "</td>" +
          "</tr>"
        );
      })
      .join("");

    table.querySelector("colgroup").innerHTML = colgroupMarkup(columns);
    table.tHead.innerHTML = headMarkup(columns, "Aluno", "Variação");
    table.tBodies[0].innerHTML = body;
    setScroll(table, columns, false);
    gridViews.set(table, {
      tip: studentTip,
      rows: rows.map(function (item) {
        return item.row;
      }),
      columns: columns
    });
  }

  /* ---------------------------------------------------------------
   * Hover do heatmap
   *
   * Para se localizar e conferir rápido, sem interpretar: a célula
   * ganha contorno, o dia e o nome da linha se destacam (a mira), e o
   * balão traz só números que a tela já sabe — o valor, quantos
   * check-ins formam a média, a diferença para o dia (ou a semana)
   * anterior e a referência ao lado (escola, ou turma do aluno).
   *
   * Um balão só, flutuante (position: fixed), montado no hover: não
   * é cortado pela rolagem da grade, e não são 330 balões no DOM. É
   * aria-hidden — o leitor de tela fica com o número da célula, e 330
   * células focáveis seriam mais obstáculo que ajuda.
   * --------------------------------------------------------------- */
  var gridViews = new WeakMap();

  /* Média da escola por dia: média das turmas, como a do ano. */
  var schoolLevels = DATA.days.map(function (_, d) {
    return mean(
      DATA.classes.map(function (c) {
        return c.levels[d];
      })
    );
  });

  /* "9º A" (como o aluno escreve a turma) → "9º ano A" (data.js). */
  function classOf(student) {
    var name = student.group.replace("º ", "º ano ");
    return DATA.classes.filter(function (c) {
      return c.name === name;
    })[0];
  }

  /* Dia anterior sai de data.js, mesmo fora do período (o dia antes do
     primeiro dos 10 existe); semana anterior, da coluna ao lado. */
  function previousIndices(columns, i) {
    var column = columns[i];
    if (column.weekly) return i > 0 ? columns[i - 1].indices : null;
    return column.indices[0] > 0 ? [column.indices[0] - 1] : null;
  }

  function previousItem(levels, columns, i, value, averaged) {
    var indices = previousIndices(columns, i);
    if (!indices || value === null) return [];
    var prev = mean(pick(levels, indices));
    var label = columns[i].weekly ? "Semana anterior" : "Dia anterior";
    if (prev === null) return [{ label: label, value: "sem dados" }];
    return [{
      label: label,
      value: averaged ? decimal(prev) : String(prev),
      tone: toneOf(prev)
    }];
  }

  /* Na semana, os dias que formam a média vêm numa segunda seção. */
  function daysSection(levels, column, averaged) {
    if (!column.weekly) return { items: [] };
    return {
      label: "Dias",
      items: column.indices.map(function (d) {
        var level = levels[d];
        return {
          label: DATA.days[d].weekday + ", " + DATA.days[d].date,
          value: level === null ? "sem dados" : averaged ? decimal(level) : String(level),
          tone: toneOf(level)
        };
      })
    };
  }

  function seriesTip(view, r, i) {
    var row = view.rows[r];
    var column = view.columns[i];
    var value = mean(pick(row.levels, column.indices));
    var school = mean(pick(schoolLevels, column.indices));

    return tooltipInner({
      title: row.name,
      subtitle: column.label,
      sections: [
        {
          items: [
            {
              label: "Média",
              value: value === null ? "sem check-ins" : decimal(value),
              tone: toneOf(value)
            },
            {
              label: "Check-ins",
              /* Na semana, o total é aluno × dia. */
              value: sum(pick(row.checkins, column.indices)) + "/" + row.students * column.indices.length
            }
          ]
            .concat(previousItem(row.levels, view.columns, i, value, true))
            .concat(school === null ? [] : [{ label: "Média da escola", value: decimal(school), tone: toneOf(school) }])
        },
        daysSection(row.levels, column, true)
      ]
    });
  }

  function studentTip(view, r, i) {
    var row = view.rows[r];
    var column = view.columns[i];
    var weekly = column.weekly;
    var value = mean(pick(row.levels, column.indices));
    var group = classOf(row);
    var classValue = group ? mean(pick(group.levels, column.indices)) : null;

    return tooltipInner({
      title: row.name,
      subtitle: column.label,
      sections: [
        {
          items: [
            {
              label: weekly ? "Média" : "Nível",
              value: value === null ? "sem check-in" : weekly ? decimal(value) : String(value),
              tone: toneOf(value)
            }
          ]
            .concat(previousItem(row.levels, view.columns, i, value, weekly))
            .concat(classValue === null ? [] : [{ label: "Média da turma " + row.group, value: decimal(classValue), tone: toneOf(classValue) }])
        },
        daysSection(row.levels, column, false)
      ]
    });
  }

  function setupGridHover() {
    var tip = document.createElement("div");
    tip.className = "tooltip tooltip--floating dashboard-caption-md";
    tip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tip);

    var marked = [];

    function clear() {
      marked.forEach(function (el) {
        el.classList.remove("is-hover");
      });
      marked = [];
    }

    function hide() {
      clear();
      tip.removeAttribute("data-open");
    }

    /* Acima da célula e centrado; encosta na janela se faltar espaço
       dos lados e desce para baixo se faltar em cima. */
    function place(box) {
      var gap = 8;
      var r = box.getBoundingClientRect();
      var t = tip.getBoundingClientRect();
      var left = Math.max(gap, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - gap));
      var top = r.top - gap - t.height;
      if (top < gap) top = r.bottom + gap;
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    }

    document.querySelectorAll(".grid").forEach(function (table) {
      table.tBodies[0].addEventListener("mouseover", function (event) {
        var box = event.target.closest(".cell__box");
        if (!box) return hide();

        var td = box.parentNode;
        var tr = td.parentNode;
        var view = gridViews.get(table);
        var col = td.cellIndex - 1;

        clear();
        marked = [box, tr.cells[0], table.tHead.rows[0].cells[td.cellIndex]];
        marked.forEach(function (el) {
          el.classList.add("is-hover");
        });

        tip.innerHTML = view.tip(view, tr.sectionRowIndex, col);
        tip.setAttribute("data-open", "");
        place(box);
      });
      table.addEventListener("mouseleave", hide);
    });

    /* Rolar a página ou a grade tira a célula de baixo do balão. */
    window.addEventListener("scroll", hide, true);
  }

  /* ---------------------------------------------------------------
   * Adesão ao check-in
   *
   * O comentário do dia (ou da semana) abre no hover e no foco — a
   * barra é focável para quem navega pelo teclado.
   * --------------------------------------------------------------- */
  function renderAdherence(card, state) {
    var plot = card.querySelector(".bars__plot");
    var labels = card.querySelector(".bars__days");
    var threshold = DATA.adherence.threshold;
    var columns = columnsFor(state.period);
    var bars = "";
    var days = "";

    /* Adesão = check-ins / alunos, no dia ou somada na semana. */
    function rate(checkins, students, indices) {
      return Math.round((sum(pick(checkins, indices)) / (students * indices.length)) * 100);
    }

    var total = sum(
      DATA.classes.map(function (c) {
        return c.students;
      })
    );
    var schoolCheckins = DATA.days.map(function (_, d) {
      return sum(
        DATA.classes.map(function (c) {
          return c.checkins[d];
        })
      );
    });

    columns.forEach(function (column, i) {
      var value = rate(schoolCheckins, total, column.indices);
      var below = value < threshold;
      var id = "adherence-tip-" + i;
      var groups = DATA.classes
        .map(function (c) {
          return {
            label: c.name,
            value: rate(c.checkins, c.students, column.indices)
          };
        })
        .filter(function (g) {
          return g.value < threshold;
        })
        .sort(function (a, b) {
          return a.value - b.value;
        })
        .map(function (g) {
          return { label: g.label, value: g.value + "%", tone: "warning" };
        });

      bars +=
        '<span class="bars__bar' + (below ? " bars__bar--below" : "") + '"' +
        ' style="height: ' + value + '%" tabindex="0" role="img"' +
        ' aria-label="' + column.label + ": " + value + '%" aria-describedby="' + id + '">' +
        tooltipMarkup({
          id: id,
          edge: edgeClass(i, columns.length),
          title: column.label,
          sections: [
            { items: [{ label: "Adesão", value: value + "%", tone: below ? "warning" : "" }] },
            { label: "Abaixo do mínimo", items: groups, empty: "Todas as turmas acima do mínimo" }
          ]
        }) +
        "</span>";
      days +=
        '<span class="bars__day' + (below ? " bars__day--below" : "") + '">' + column.axis + "</span>";
    });

    plot.style.setProperty("--threshold", threshold + "%");
    plot.querySelectorAll(".bars__bar").forEach(function (bar) {
      bar.remove();
    });
    plot.insertAdjacentHTML("beforeend", bars);
    labels.innerHTML = days;

    card.querySelector("[data-subtitle]").textContent =
      "Parcela dos alunos que fez o check-in em cada " +
      (PERIODS[state.period].kind === "week" ? "semana" : "dia") +
      ". A linha tracejada marca o mínimo esperado.";
  }

  function renderQueue(list) {
    list.innerHTML = DATA.queue
      .map(function (row) {
        return (
          '<li class="queue__row' + (row.overdue ? " queue__row--overdue" : "") + '">' +
          '<span class="queue__label dashboard-body-md">' + row.label + "</span>" +
          '<span class="queue__track"><span class="queue__bar" style="width: ' + row.width + '%"></span></span>' +
          '<span class="queue__count dashboard-body-md-semibold">' + row.count + "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  /* ---------------------------------------------------------------
   * Estado por card: período e, no nível emocional, Ano/Turma. Cada
   * card tem o seu; trocar um não mexe nos outros. O peso da fonte
   * acompanha o estado (semibold no marcado), como no markup inicial.
   * Personalizado não tem data-period e por enquanto não faz nada.
   * --------------------------------------------------------------- */
  var RENDER = {
    series: renderSeries,
    students: renderStudents,
    adherence: renderAdherence
  };

  function press(group, option) {
    group.querySelectorAll(".segmented__option").forEach(function (other) {
      var on = other === option;
      other.setAttribute("aria-pressed", String(on));
      other.classList.toggle("dashboard-caption-md-semibold", on);
      other.classList.toggle("dashboard-caption-md", !on);
    });
  }

  function setupCards() {
    document.querySelectorAll("[data-card]").forEach(function (card) {
      var render = RENDER[card.getAttribute("data-card")];
      var state = { period: "10d", group: "year" };

      card.querySelector(".controls").addEventListener("click", function (event) {
        var option = event.target.closest("[data-period], [data-group]");
        if (!option || option.getAttribute("aria-pressed") === "true") return;

        press(option.closest(".segmented"), option);
        if (option.hasAttribute("data-period")) state.period = option.getAttribute("data-period");
        if (option.hasAttribute("data-group")) state.group = option.getAttribute("data-group");
        render(card, state);
      });

      render(card, state);
    });
  }

  /* Gaveta de navegação, abaixo de 1024px. Fecha pelo véu, pelo Esc e
     sozinha se a janela voltar para a largura de desktop. O foco entra
     no primeiro link ao abrir e volta para o botão ao fechar. */
  function setupDrawer(button, sidebar, scrim) {
    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      scrim.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      if (open) sidebar.querySelector(".nav__item").focus();
    }

    function close() {
      if (!sidebar.classList.contains("is-open")) return;
      setOpen(false);
      button.focus();
    }

    button.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("is-open"));
    });
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
  }

  setupDrawer(
    document.querySelector(".topbar__menu"),
    document.getElementById("sidebar"),
    document.querySelector(".scrim")
  );
  setupCards();
  setupGridHover();
  renderQueue(document.getElementById("queue"));
})();
