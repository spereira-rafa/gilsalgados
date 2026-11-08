(() => {
  // Valores por unidade, confirmados pela Gil a partir da tabela enviada.
  // Centavos inteiros evitam diferenças de arredondamento nos subtotais.
  const groups = [
    { name: 'Fritos', items: [
      ['Camarão na tapioca', 210], ['Coxinha', 130], ['Risole', 130],
      ['Camarão encapotado', 190], ['Boliviano', 130], ['Bolinha de queijo', 130],
      ['Kibe', 150], ['Pastel frito', 150], ['Banana real', 200],
      ['Charque com queijo', 190], ['Bolinho de bacalhau', 190]
    ] },
    { name: 'Assados e outras delícias', items: [
      ['Pãozinho delícia', 150], ['Trouxinha', 190], ['Saltenha', 190],
      ['Pastel de forno', 170], ['Empada doce', 150], ['Empada de frango', 150],
      ['Mini pizza', 230], ['Mini donuts', 350], ['Tortelete', 900], ['Tropical', 190],
      ['Mini quiche', 190], ['Empada de camarão/bacalhau — P', 200],
      ['Empada de camarão/bacalhau — M', 250],
      ['Quiche de geleia de damasco com queijo brie', 190], ['Mini hambúrguer', 500]
    ] }
  ];
  const MINIMUM = 100;
  const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const dialog = document.querySelector('#salgados-valores');
  const form = document.querySelector('#priced-menu-form');
  const container = document.querySelector('#priced-menu-groups');
  const selection = document.querySelector('#priced-selection');
  const button = document.querySelector('#priced-order');
  const entries = [];
  let trigger;

  groups.forEach((group, groupIndex) => {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    heading.id = `priced-group-${groupIndex}`;
    heading.textContent = group.name;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);
    group.items.forEach(([name, cents]) => {
      const row = document.createElement('div'); row.className = 'priced-menu-row';
      const info = document.createElement('div');
      const title = document.createElement('strong'); title.textContent = name;
      const price = document.createElement('span'); price.textContent = `${money(cents)} / unidade`;
      info.append(title, price);
      const label = document.createElement('label'); label.textContent = 'Quantidade';
      const input = document.createElement('input'); input.type = 'number';
      input.min = '0'; input.step = '1'; input.value = '0'; input.inputMode = 'numeric';
      input.setAttribute('aria-label', `Quantidade de ${name}`);
      input.name = `item-${entries.length}`;
      label.append(input); row.append(info, label); section.append(row);
      entries.push({ name, cents, input });
      input.addEventListener('input', updateSummary);
    });
    container.append(section);
  });

  function getOrder() {
    let quantity = 0; let cents = 0; let valid = true;
    const items = [];
    entries.forEach(item => {
      const amount = item.input.value === '' ? 0 : item.input.valueAsNumber;
      if (!item.input.validity.valid || !Number.isSafeInteger(amount) || amount < 0) { valid = false; return; }
      quantity += amount; cents += amount * item.cents;
      if (amount) items.push({ ...item, amount });
    });
    if (!Number.isSafeInteger(quantity) || !Number.isSafeInteger(cents)) valid = false;
    return { quantity, cents, valid, items };
  }

  function updateSummary() {
    const order = getOrder();
    selection.replaceChildren();
    if (!order.items.length) {
      const li = document.createElement('li'); li.textContent = 'Nenhum item selecionado.'; selection.append(li);
    } else order.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.amount} × ${item.name} — ${money(item.cents * item.amount)}`;
      selection.append(li);
    });
    document.querySelector('#priced-count').textContent = `${order.quantity} ${order.quantity === 1 ? 'unidade' : 'unidades'}`;
    document.querySelector('#priced-subtotal').textContent = `Subtotal: ${money(order.cents)}`;
    document.querySelector('#priced-minimum').textContent = !order.valid ? 'Use quantidades inteiras e não negativas.' : order.quantity < MINIMUM ? `Faltam ${MINIMUM - order.quantity} unidades para o pedido mínimo.` : 'Pedido mínimo atingido. Revise sua seleção.';
    button.disabled = !order.valid || order.quantity < MINIMUM;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const order = getOrder();
    if (!form.reportValidity() || !order.valid || order.quantity < MINIMUM) { updateSummary(); return; }
    const message = [
      'Olá, Gil! Gostaria de consultar esta encomenda:',
      ...order.items.map(item => `${item.amount} × ${item.name} (${money(item.cents)} por unidade) — ${money(item.amount * item.cents)}`),
      `Total: ${order.quantity} unidades`, `Subtotal dos produtos: ${money(order.cents)}`,
      'Podemos combinar a data, os sabores, a disponibilidade e a entrega?'
    ].join('\n');
    window.location.assign(`https://wa.me/5571985281777?text=${encodeURIComponent(message)}`);
  });

  function openMenu(link) {
    trigger = link;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
  }
  document.querySelectorAll('a[href="#salgados-valores"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openMenu(link); }));
  // A categoria Salgados Tradicionais também abre a lista com os valores confirmados.
  const traditional = document.querySelector('.product[data-type="salgados"]');
  if (traditional) {
    traditional.href = '#salgados-valores'; traditional.removeAttribute('target');
    traditional.setAttribute('aria-label', 'Salgados Tradicionais: consultar variedades, preços unitários e montar encomenda.');
    traditional.addEventListener('click', event => { event.preventDefault(); openMenu(traditional); });
  }
  dialog.querySelector('.priced-menu-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    if (trigger && trigger.getClientRects().length) trigger.focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled),input')];
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  window.addEventListener('hashchange', () => { if (location.hash === '#salgados-valores') openMenu(); });
  if (location.hash === '#salgados-valores') openMenu();
  updateSummary();
})();
