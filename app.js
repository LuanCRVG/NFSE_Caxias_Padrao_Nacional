
(() => {
  const D = window.NFSE_DATA;
  const $ = id => document.getElementById(id);
  const E = {
    servSearch:$('servSearch'), servMun:$('servMun'), munInfo:$('munInfo'),
    tribNacWrap:$('tribNacWrap'), tribNac:$('tribNac'),
    nbs:$('nbs'), validarNbs:$('validarNbs'), verNbs:$('verNbs'),
    nbsStatus:$('nbsStatus'), nbsInfo:$('nbsInfo'), nbsPermitidos:$('nbsPermitidos'),
    classe:$('classe'), classeAviso:$('classeAviso'),
    indOp:$('indOp'), indInfo:$('indInfo'),
    emCaxias:$('emCaxias'), outraCidade:$('outraCidade'), cidade:$('cidade'), ibge:$('ibge'),
    simples:$('simples'), retISS:$('retISS'), indDest:$('indDest'),
    vazio:$('vazio'), resultado:$('resultado'), badge:$('badge'), validacao:$('validacao'),
    rMun:$('rMun'), rNac:$('rNac'), rNbs:$('rNbs'), rCst:$('rCst'), rClass:$('rClass'),
    rInd:$('rInd'), rLoc:$('rLoc'), rSimples:$('rSimples'), rRet:$('rRet'), rDest:$('rDest'),
    copiar:$('copiar'), baixar:$('baixar'),
    copiarXml:$('copiarXml'), baixarXml:$('baixarXml')
  };

  const norm = s => (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const esc = s => (s??'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uniq = (arr,key) => [...new Map(arr.map(x=>[key(x),x])).values()];

  const services = uniq(D.municipal, r=>r.cTribMun)
    .sort((a,b)=>a.cTribMun.localeCompare(b.cTribMun,'pt-BR',{numeric:true}));

  function serviceMatchesSearch(service, nq){
    if(!nq) return true;

    // Pesquisa pelo próprio código/descrição municipal.
    if(norm(service.cTribMun).includes(nq) || norm(service.xTribMun).includes(nq)) return true;

    // Também pesquisa pelos códigos/descrições nacionais relacionados àquele serviço municipal.
    // Ex.: digitar 140101 deve encontrar o cTribMun 1401 de Duque de Caxias.
    return D.municipal.some(r =>
      r.cTribMun === service.cTribMun &&
      (norm(r.cTribNac).includes(nq) || norm(r.xTribNac).includes(nq))
    );
  }

  function nationalHints(cTribMun){
    const rows = D.municipal.filter(r=>r.cTribMun===cTribMun);
    const nats = [...new Set(rows.map(r=>r.cTribNac).filter(Boolean))];
    return nats.length ? ` [Nacional: ${nats.join(', ')}]` : '';
  }

  function renderServices(q=''){
    const nq=norm(q);
    const rows=services.filter(r=>serviceMatchesSearch(r,nq));
    const old=E.servMun.value;

    E.servMun.innerHTML='<option value="">Selecione...</option>'+
      rows.map(r=>`<option value="${esc(r.cTribMun)}">${esc(r.cTribMun)} — ${esc(r.xTribMun)}${esc(nationalHints(r.cTribMun))}</option>`).join('');

    if(rows.some(r=>r.cTribMun===old)) E.servMun.value=old;
  }

  function munRows(){ return D.municipal.filter(r=>r.cTribMun===E.servMun.value); }
  function corrNac(){ return D.correlation.filter(r=>r.cTribNac===E.tribNac.value); }
  function nbsValido(){
    const code=E.nbs.value.trim();
    return /^\d{9}$/.test(code) && corrNac().some(r=>r.cNBS===code);
  }

  function resetAfterService(){
    E.nbs.value=''; E.nbs.disabled=true; E.validarNbs.disabled=true; E.verNbs.disabled=true;
    E.nbsStatus.className='status neutral'; E.nbsStatus.textContent='Aguardando o serviço municipal.';
    E.nbsInfo.classList.add('hidden'); E.nbsPermitidos.classList.add('hidden');
    E.classe.disabled=true; E.classe.innerHTML='<option value="">Aguardando NBS válido...</option>';
    E.classeAviso.classList.add('hidden');
    E.indOp.disabled=true; E.indOp.innerHTML='<option value="">Aguardando classificação...</option>';
    E.indInfo.classList.add('hidden');
  }

  function onService(){
    resetAfterService();
    const rows=munRows();
    if(!rows.length){
      E.munInfo.classList.add('hidden'); E.tribNacWrap.classList.add('hidden'); update(); return;
    }
    const r=rows[0];
    E.munInfo.innerHTML=`<strong>cTribMun:</strong> ${esc(r.cTribMun)} &nbsp;•&nbsp; <strong>Alíquota:</strong> ${esc(r.aliquota||'—')}<br>${esc(r.xTribMun)}`;
    E.munInfo.classList.remove('hidden');

    const nats=uniq(rows,x=>x.cTribNac);
    E.tribNac.innerHTML='<option value="">Selecione...</option>'+nats.map(x=>`<option value="${esc(x.cTribNac)}">${esc(x.cTribNac)} — ${esc(x.xTribNac)}</option>`).join('');
    E.tribNacWrap.classList.remove('hidden');
    if(nats.length===1){ E.tribNac.value=nats[0].cTribNac; onNac(); }
    update();
  }

  function onNac(){
    E.nbs.value='';
    E.nbs.disabled=!E.tribNac.value;
    E.validarNbs.disabled=!E.tribNac.value;
    E.verNbs.disabled=!E.tribNac.value;
    E.nbsInfo.classList.add('hidden'); E.nbsPermitidos.classList.add('hidden');
    E.classe.disabled=true; E.classe.innerHTML='<option value="">Aguardando NBS válido...</option>';
    E.indOp.disabled=true; E.indOp.innerHTML='<option value="">Aguardando classificação...</option>';
    if(E.tribNac.value){
      E.nbsStatus.className='status neutral';
      E.nbsStatus.textContent='Digite o NBS de 9 dígitos informado pelo cliente.';
    }
    update();
  }

  function validarNbs(){
    const code=E.nbs.value.trim();
    E.nbsPermitidos.classList.add('hidden');
    if(!/^\d{9}$/.test(code)){
      E.nbsStatus.className='status bad';
      E.nbsStatus.textContent='O NBS deve conter exatamente 9 dígitos.';
      E.nbsInfo.classList.add('hidden'); renderClasses(); update(); return;
    }
    const rows=corrNac().filter(r=>r.cNBS===code);
    if(!rows.length){
      E.nbsStatus.className='status bad';
      E.nbsStatus.textContent='NBS incompatível com o serviço/tributação selecionados. Confirme o código com o cliente.';
      E.nbsInfo.classList.add('hidden'); renderClasses(); update(); return;
    }
    E.nbsStatus.className='status ok';
    E.nbsStatus.textContent='NBS compatível com o serviço selecionado.';
    E.nbsInfo.innerHTML=`<strong>${esc(code)}</strong> — ${esc(D.nbs[code]||rows[0].xNBS||'')}`;
    E.nbsInfo.classList.remove('hidden');
    renderClasses(); update();
  }

  function verNbs(){
    const rows=uniq(corrNac(),r=>r.cNBS).sort((a,b)=>a.cNBS.localeCompare(b.cNBS,'pt-BR',{numeric:true}));
    E.nbsPermitidos.innerHTML=
      '<strong>NBS compatíveis com esta tributação:</strong>'+
      '<span class="nbsHelp">Clique em um NBS para preencher e validar automaticamente.</span>'+
      rows.map(r=>`<button type="button" class="nbsRow" data-nbs="${esc(r.cNBS)}"><code>${esc(r.cNBS)}</code>${esc(D.nbs[r.cNBS]||r.xNBS||'')}</button>`).join('');
    E.nbsPermitidos.classList.remove('hidden');

    E.nbsPermitidos.querySelectorAll('[data-nbs]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        E.nbs.value=btn.dataset.nbs;
        E.nbsPermitidos.classList.add('hidden');
        validarNbs();
        E.nbs.scrollIntoView({behavior:'smooth',block:'center'});
      });
    });
  }

  function renderClasses(){
    E.classe.innerHTML='<option value="">Aguardando NBS válido...</option>';
    E.indOp.innerHTML='<option value="">Aguardando classificação...</option>';
    E.indOp.disabled=true; E.indInfo.classList.add('hidden');
    if(!nbsValido()){ E.classe.disabled=true; E.classeAviso.classList.add('hidden'); return; }

    const rows=corrNac().filter(r=>r.cNBS===E.nbs.value.trim());
    const opts=uniq(rows,r=>`${r.CST}|${r.cClassTrib}`);
    E.classe.innerHTML='<option value="">Selecione...</option>'+opts.map(r=>`<option value="${esc(r.CST+'|'+r.cClassTrib)}">${esc(r.CST)} / ${esc(r.cClassTrib)} — ${esc(r.xST)} — ${esc(r.xClassTrib)}</option>`).join('');
    E.classe.disabled=false;
    E.classeAviso.classList.toggle('hidden',opts.length<=1);
    if(opts.length===1){ E.classe.value=`${opts[0].CST}|${opts[0].cClassTrib}`; renderIndOps(); }
  }

  function renderIndOps(){
    E.indInfo.classList.add('hidden');
    if(!E.classe.value){ E.indOp.disabled=true; return update(); }
    const [cst,cl]=E.classe.value.split('|');
    const rows=corrNac().filter(r=>r.cNBS===E.nbs.value.trim()&&r.CST===cst&&r.cClassTrib===cl);
    const opts=uniq(rows,r=>r.cIndOp);
    E.indOp.innerHTML='<option value="">Selecione...</option>'+opts.map(r=>{
      const i=D.indop[r.cIndOp]||{};
      return `<option value="${esc(r.cIndOp)}">${esc(r.cIndOp)} — ${esc(i.localFornecimento||'')} — ${esc(i.xOp||r.xIndOp||'')}</option>`;
    }).join('');
    E.indOp.disabled=false;
    if(opts.length===1){ E.indOp.value=opts[0].cIndOp; showInd(); }
    update();
  }

  function showInd(){
    const i=D.indop[E.indOp.value];
    if(i){
      E.indInfo.innerHTML=`<strong>${esc(E.indOp.value)} — ${esc(i.localFornecimento)}</strong><br>${esc(i.xOp)}<br><small>${esc(i.localOperacao)}</small>`;
      E.indInfo.classList.remove('hidden');
    } else E.indInfo.classList.add('hidden');
    update();
  }

  function location(){
    return E.emCaxias.checked ? {nome:'Duque de Caxias/RJ',ibge:'3301702'} : {nome:E.cidade.value.trim(),ibge:E.ibge.value.trim()};
  }

  function codes(){
    const [cst,cl]=(E.classe.value||'|').split('|');
    return {mun:E.servMun.value,nac:E.tribNac.value,nbs:E.nbs.value.trim(),cst:cst||'',cl:cl||'',ind:E.indOp.value,loc:location()};
  }

  function validateAll(){
    const c=codes();
    if(!c.mun||!c.nac||!c.nbs||!c.cst||!c.cl||!c.ind||!/^\d{7}$/.test(c.loc.ibge||'')) return {s:'neutral',t:'Preencha todos os campos necessários.'};
    const mapOk=D.municipal.some(r=>r.cTribMun===c.mun&&r.cTribNac===c.nac);
    const corrOk=D.correlation.some(r=>r.cTribNac===c.nac&&r.cNBS===c.nbs&&r.CST===c.cst&&r.cClassTrib===c.cl&&r.cIndOp===c.ind);
    if(!mapOk||!corrOk) return {s:'bad',t:'A combinação informada não existe nas tabelas carregadas.'};
    return {s:'ok',t:'Combinação encontrada nas tabelas carregadas.'};
  }

  function update(){
    const c=codes(), has=!!c.mun;
    E.vazio.classList.toggle('hidden',has); E.resultado.classList.toggle('hidden',!has);
    if(!has){E.badge.className='pill';E.badge.textContent='Incompleta';return;}
    E.rMun.textContent=c.mun||'—'; E.rNac.textContent=c.nac||'—'; E.rNbs.textContent=c.nbs||'—';
    E.rCst.textContent=c.cst||'—'; E.rClass.textContent=c.cl||'—'; E.rInd.textContent=c.ind||'—';
    E.rLoc.textContent=c.loc.ibge||'CONFIRMAR'; E.rSimples.textContent=E.simples.value||'CONFIRMAR';
    E.rRet.textContent=E.retISS.value; E.rDest.textContent=E.indDest.value;
    const v=validateAll(); E.validacao.className='status '+v.s; E.validacao.textContent=v.t;
    E.badge.className='pill '+(v.s==='neutral'?'':v.s); E.badge.textContent=v.s==='ok'?'Válida':v.s==='bad'?'Inválida':'Incompleta';
  }

  function summary(){
    const c=codes(), v=validateAll();
    return [
      'FICHA NFS-e — DUQUE DE CAXIAS/RJ',
      '================================',
      `cTribMun: ${c.mun}`,
      `cTribNac: ${c.nac}`,
      `NBS informado pelo cliente: ${c.nbs}`,
      `CST: ${c.cst}`,
      `cClassTrib: ${c.cl}`,
      `cIndOp: ${c.ind}`,
      `Município da prestação: ${c.loc.nome||'Não informado'}`,
      `cLocPrestacao: ${c.loc.ibge||'CONFIRMAR'}`,
      'finNFSe: 0',
      `opSimpNac: ${E.simples.value||'CONFIRMAR'}`,
      `tpRetISSQN: ${E.retISS.value}`,
      `indDest: ${E.indDest.value}`,
      '',
      `Validação: ${v.t}`
    ].join('\\n');
  }

  function xmlEscape(s){
    return (s??'').toString()
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&apos;');
  }

  function xmlBlock(){
    const c=codes();
    const row=corrNac().find(r=>r.cNBS===c.nbs) || {};
    const desc=D.nbs[c.nbs] || row.xNBS || 'SERVICO PRESTADO';

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!--',
      '  BLOCO DE APOIO PARA PARAMETRIZACAO NFS-e / IBS-CBS.',
      '  Nao e uma DPS completa para transmissao.',
      '-->',
      '<ParametrizacaoNFSe xmlns="http://www.sped.fazenda.gov.br/nfse">',
      '  <serv>',
      '    <locPrest>',
      `      <cLocPrestacao>${xmlEscape(c.loc.ibge || 'CODIGO_IBGE')}</cLocPrestacao>`,
      '    </locPrest>',
      '    <cServ>',
      `      <cTribNac>${xmlEscape(c.nac || 'CTRIBNAC')}</cTribNac>`,
      `      <cTribMun>${xmlEscape(c.mun || 'CTRIBMUN')}</cTribMun>`,
      `      <xDescServ>${xmlEscape(desc)}</xDescServ>`,
      `      <cNBS>${xmlEscape(c.nbs || 'CNBS')}</cNBS>`,
      '    </cServ>',
      '  </serv>',
      '  <IBSCBS>',
      '    <finNFSe>0</finNFSe>',
      `    <cIndOp>${xmlEscape(c.ind || 'CINDOP')}</cIndOp>`,
      `    <indDest>${xmlEscape(E.indDest.value || '0')}</indDest>`,
      '    <valores>',
      '      <trib>',
      '        <gIBSCBS>',
      `          <CST>${xmlEscape(c.cst || 'CST')}</CST>`,
      `          <cClassTrib>${xmlEscape(c.cl || 'CCLASSTRIB')}</cClassTrib>`,
      '        </gIBSCBS>',
      '      </trib>',
      '    </valores>',
      '  </IBSCBS>',
      '</ParametrizacaoNFSe>'
    ].join('\\n');
  }

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(e){
      const ta=document.createElement('textarea');
      ta.value=text;
      document.body.appendChild(ta);
      ta.select();
      const ok=document.execCommand('copy');
      ta.remove();
      return ok;
    }
  }

  function downloadText(filename, text, mime){
    const b=new Blob([text],{type:mime});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(b);
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  E.servSearch.addEventListener('input',()=>renderServices(E.servSearch.value));
  E.servMun.addEventListener('change',onService);
  E.tribNac.addEventListener('change',onNac);
  E.nbs.addEventListener('input',()=>{E.nbs.value=E.nbs.value.replace(/\\D/g,'').slice(0,9);E.nbsStatus.className='status neutral';E.nbsStatus.textContent='Clique em “Validar NBS”.';E.nbsInfo.classList.add('hidden');renderClasses();update();});
  E.validarNbs.addEventListener('click',validarNbs);
  E.verNbs.addEventListener('click',verNbs);
  E.classe.addEventListener('change',renderIndOps);
  E.indOp.addEventListener('change',showInd);
  E.emCaxias.addEventListener('change',()=>{E.outraCidade.classList.toggle('hidden',E.emCaxias.checked);update();});
  [E.cidade,E.ibge,E.simples,E.retISS,E.indDest].forEach(x=>x.addEventListener('input',update));
  [E.simples,E.retISS,E.indDest].forEach(x=>x.addEventListener('change',update));

  E.copiar.addEventListener('click',async()=>{
    if(await copyToClipboard(summary())){
      const old=E.copiar.textContent;E.copiar.textContent='Copiado!';setTimeout(()=>E.copiar.textContent=old,1200);
    }
  });
  E.baixar.addEventListener('click',()=>{
    downloadText('ficha_nfse_duque_caxias.txt',summary(),'text/plain;charset=utf-8');
  });
  E.copiarXml.addEventListener('click',async()=>{
    if(await copyToClipboard(xmlBlock())){
      const old=E.copiarXml.textContent;E.copiarXml.textContent='XML copiado!';setTimeout(()=>E.copiarXml.textContent=old,1200);
    }
  });
  E.baixarXml.addEventListener('click',()=>{
    downloadText('parametrizacao_nfse_duque_caxias.xml',xmlBlock(),'application/xml;charset=utf-8');
  });

  renderServices();
  update();
})();
