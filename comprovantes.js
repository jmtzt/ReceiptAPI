const cheerio = require("cheerio");
const fileUpload = require("express-fileupload");
var xlsx = require("xlsx");
var _ = require("lodash");
var extenso = require("numero-por-extenso");
var path = require("path");

function titulosF(file) {
  let titulos = [];
  const $ = cheerio.load(file);
  const numberOfCompr = $("li[id*=id147]").length;
  const infosAfter = $("ul.list_infos.after");
  for (let index = 0; index < numberOfCompr; index++) {
    let controle = $("li[id*=id120]")
      .find("span.infoCabeca")
      .get(index * 2).children[0].data;
    let documento = $("li[id*=id120]")
      .find("span.infoCabeca")
      .get(index * 2 + 1).children[0].data;
    let contaDebito =
      infosAfter
        .find("li[id*=id138] span[class*=Bradesco]")
        .get(0)
        .children[0].data.split("|")[0] +
      infosAfter
        .find("li[id*=id138] span[class*=Bradesco]")
        .get(0)
        .children[0].data.split("|")[1];
    let codBarras = $("li[id*=id157]").get(index).children[0].data;
    let razaoSoc;
    if ($("li[id*=id167]").get(index).children.length !== 0) {
      razaoSoc = $("li[id*=id167]").get(index).children[0].data;
    } else {
      razaoSoc = "";
    }

    let dataDebito = $("li[id*=id227]").get(index).children[0].data;
    let valorTotal = $("li[id*=id273]").get(index).children[0].data;
    let desc = $("li[id*=id279]").get(index).children[0].data;

    let titulo = {
      controle: controle,
      documento: documento,
      contaDebito: contaDebito,
      codBarras: codBarras,
      razaoSoc: razaoSoc,
      dataDebito: dataDebito,
      valorTotal: valorTotal,
      desc: desc,
    };
    titulos.push(titulo);
  }
  return titulos;
}

function daemsF(file) {
  let daems = [];

  const $ = cheerio.load(file);
  const infosAfter = $("ul.list_infos.after");
  // const numberOfCompr = infosAfter.find("p.lh15").length;

  const numberOfCompr = $('#conteudo > div > div.conteudo_linha.pt20.after.mt0.bb0.mt0.alignCenter.after.alignCenter > h2').length + $('#boxPrint01 > div.box_grayLine_bottom > div:nth-child(1) > h3 > b').length;

  // for (let index = 0; index < numberOfCompr; index++) {
  //   let tipo = $('#conteudo > div > div:nth-child(1) > div.box_grayLine_bottom.pb0.comprovante > table > tbody > tr > td > ul > li.item.pb20 > img').get(index);

  //   console.log(typeof tipo === "object" ? true : false);
  // }

  // let countObject = 0;
  let countUndef = 0;

  for (let index = 0; index < numberOfCompr; index++) {
    let tipo = $('#conteudo > div > div:nth-child(1) > div.box_grayLine_bottom.pb0.comprovante > table > tbody > tr > td > ul > li.item.pb20 > img').get(index);

    if (typeof tipo === "object") {
      // countObject++;
      let controle = $("li[class*=info]")
        .find("p.lh15")
        .get(index)
        .children[0].next.data.split("|")[0];
      let autBanc = $("li[class*=info]").find("p.lh15").get(index).children[1]
        .next.next.data;
      let agencia = infosAfter
        .find('li.info:contains("Conta")')
        .get(index)
        .children[0].data.split("|")[0];
      let conta = infosAfter
        .find('li.info:contains("Conta")')
        .get(index)
        .children[0].data.split("|")[1];
      let codBarras = infosAfter.find('li.item:contains("Código")').get(index)
        .next.children[0].data;
      let empresa = infosAfter
        .find('li.item:contains("Empresa / Órgão:")')
        .get(index).next.children[0].data;
      let desc = infosAfter.find('li.item:contains("Descrição:")').get(index).next
        .children[0].data;
      let ref = $('#conteudo > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr > td > ul > li:nth-child(11)').get(index).children[0].data;
      let valor = infosAfter
        .find('li.item:contains("Valor do pagamento:")')
        .get(index).next.children[0].data;
      let data = infosAfter.find('li.item:contains("Data de débito:")').get(index)
        .next.children[0].data;

      let daem = {
        controle: controle,
        autBanc: autBanc,
        agencia: agencia,
        conta: conta,
        codBarras: codBarras,
        empresa: empresa,
        desc: desc,
        ref: ref,
        valor: valor,
        data: data,
      };
      daems.push(daem);
    } else if (typeof tipo === "undefined") {

      // console.log(index);
      let controle = $("#boxPrint01 > div.ptb10.comprovante.pb10.pl10 > table > tbody > tr > td:nth-child(2) > ul > li").get(countUndef).children[0].next.next.next.data.split(' ')[3];
      let agConta = $("#boxPrint01 > div.ptb10.comprovante.pb10.pl10 > table > tbody > tr > td:nth-child(2) > ul > li").get(countUndef).children[0].next.next.next.next.next.data;
      let codBarras = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(5)').get(countUndef).children[0].data;
      let dataPag = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(8)').get(countUndef).children[0].data;
      let periodoAp = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(11)').get(countUndef).children[0].data;
      let cpf = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(14)').get(countUndef).children[0].data;
      let codReceita = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(17)').get(countUndef).children[0].data;
      let dataVenc = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(20)').get(countUndef).children[0].data;
      let valor = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(23)').get(countUndef).children[0].data;
      let aut = $('#boxPrint01 > div.box_grayLine_bottom > table > tbody > tr > td > ul > li:nth-child(26)').get(countUndef).children[0].data;

      let daem = {
        controle: controle,
        ac: agConta,
        codBarras: codBarras,
        dataPag: dataPag,
        periodoAp: periodoAp,
        cpf: cpf,
        codReceita: codReceita,
        dataVenc: dataVenc,
        valor: valor,
        aut: aut
      }
      daems.push(daem);
      countUndef++;
    }
  }


  return daems;
}

function tedF(file) {
  let teds = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos.after");
  const numberOfCompr = infosAfter.find("p.lh15").length;

  console.log(numberOfCompr);

  // console.log(infosAfter.find('li.item:contains("Data de débito:")').get(index).next.children[0].data);

  for (let index = 0; index < numberOfCompr; index++) {
    let controle = $("li[class*=info]")
      .find("p.lh15")
      .get(index)
      .children[0].next.data.split("|")[0];
    let documento = $("li[class*=info]").find("p.lh15").get(index).children[1]
      .next.next.data;
    let contaDebito =
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[0] +
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[1];
    let favorecido = infosAfter
      .find('li.item:contains("Nome do favorecido:")')
      .get(index).next.children[0].data;
    let cpf = infosAfter.find('li.item:contains("CPF:")').get(index).next
      .children[0].data;
    let contaCredito = infosAfter
      .find('li.item:contains("Conta de crédito:")')
      .get(index).next.children[0].data;
    let finalidade = infosAfter
      .find('li.item:contains("Finalidade:")')
      .get(index).next.children[0].data;
    let valor = infosAfter.find('li.item:contains("Valor total:")').get(index)
      .next.children[0].data;
    let tipo = infosAfter
      .find('li.item:contains("Tipo de transferência:")')
      .get(index).next.children[0].data;
    let data = infosAfter.find('li.item:contains("Data de débito:")').get(index)
      .next.children[0].data;

    let ted = {
      controle: controle,
      documento: documento,
      contaDebito: contaDebito,
      favorecido: favorecido,
      cpf: cpf,
      contaCredito: contaCredito,
      finalidade: finalidade,
      valor: valor,
      tipo: tipo,
      data: data,
    };
    teds.push(ted);
  }

  return teds;
}

function tcbF(file) {
  let tcbs = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos.after");
  const numberOfCompr = infosAfter.find("li.pb15").length;

  console.log(numberOfCompr);
  for (let index = 0; index < numberOfCompr; index++) {
    let controle = $("li[class*=info]")
      .find("p.lh15")
      .get(index)
      .children[0].next.data.split("|")[0];
    let documento = $("li[class*=info]").find("p.lh15").get(index).children[1]
      .next.next.data;
    let contaDebito =
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[0] +
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[1];
    let contaCredito = infosAfter
      .find('li.item:contains("Conta de crédito:")')
      .get(index).next.children[0].data;
    let favorecido = infosAfter
      .find('li.item:contains("Nome do favorecido:")')
      .get(index).next.children[0].data;
    let valor = infosAfter.find('li.item:contains("Valor:")').get(index).next
      .children[0].data;
    let data = infosAfter.find('li.item:contains("Data de débito:")').get(index)
      .next.children[0].data;
    let desc;

    if (
      infosAfter.find("li.item.last").get(index).children[0].data ===
      "Descrição:"
    ) {
      desc = infosAfter.find('li.item:contains("Descrição:")').get(index).next
        .children[0].data;
    } else if (
      infosAfter.find("li.item.last").get(index).children[0].data ===
      "Data de débito:"
    ) {
      desc = "";
    }

    let tcb = {
      controle: controle,
      documento: documento,
      contaDebito: contaDebito,
      contaCredito: contaCredito,
      favorecido: favorecido,
      valor: valor,
      data: data,
      desc: desc,
    };
    tcbs.push(tcb);
  }
  return tcbs;
}

function telF(file) {
  let tels = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos.after");
  const numberOfCompr = infosAfter.find("li.pb15").length;

  console.log(numberOfCompr);

  for (let index = 0; index < numberOfCompr; index++) {
    let controle = $("li[class*=info]")
      .find("p.lh15")
      .get(index)
      .children[0].next.data.split("|")[0];
    let autBanc = $("li[class*=info]").find("p.lh15").get(index).children[1]
      .next.next.data;
    let contaDebito =
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[0] +
      infosAfter
        .find('li.item:contains("Conta de débito:")')
        .get(index)
        .next.children[0].data.split("|")[1];
    let codBarras = infosAfter.find('li.item:contains("Código")').get(index)
      .next.children[0].data;
    let ref = infosAfter.find('li.item:contains("REFERENCIA:")').get(index).next
      .children[0].data;
    let conces = infosAfter
      .find('li.item:contains("Concessionária:")')
      .get(index).next.children[0].data;
    let valor = infosAfter.find('li.item:contains("Valor:")').get(index).next
      .children[0].data;
    let data = infosAfter.find('li.item:contains("Data de débito:")').get(index)
      .next.children[0].data;
    let desc;
    if (
      infosAfter.find("li.item.last").get(index).children[0].data ===
      "Descrição:"
    ) {
      desc = infosAfter.find('li.item:contains("Descrição:")').get(index).next
        .children[0].data;
    } else if (
      infosAfter.find("li.item.last").get(index).children[0].data ===
      "Data de débito:"
    ) {
      desc = "";
    }

    let tel = {
      controle: controle,
      autBanc: autBanc,
      contaDebito: contaDebito,
      codBarras: codBarras,
      ref: ref,
      conces: conces,
      valor: valor,
      data: data,
      desc: desc,
    };
    tels.push(tel);
  }
  return tels;
}

function daesF(file) {
  let daes = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos.after");
  const numberOfCompr = $('h2.pb15:contains("Autenticação")').length;
  console.log(numberOfCompr);

  // console.log($("ul.cabecalho > li[class*=info]").find('br'));

  for (let index = 0; index < numberOfCompr; index++) {
    let tipo = infosAfter.find("li.info.pb15 h2").get(index);

    if (typeof tipo !== "undefined") {
      let controle = $("li[class*=info]")
        .find("p.lh15")
        .get(index)
        .children[0].next.data.split("|")[0];
      let autBanc = $("li[class*=info]").find("p.lh15").get(index).children[1]
        .next.next.data;
      let contaDebito =
        infosAfter
          .find('li.item:contains("Conta de débito:")')
          .get(index)
          .next.children[0].data.split("|")[0] +
        infosAfter
          .find('li.item:contains("Conta de débito:")')
          .get(index)
          .next.children[0].data.split("|")[1];
      let codBarras = infosAfter
        .find('li.item:contains("Código de barras")')
        .get(index).next.children[0].data;
      let empresa = infosAfter.find('li.item:contains("Empresa")').get(index)
        .next.children[0].data;
      let cnpj = infosAfter.find('li.item:contains("CNPJ")').get(index).next
        .children[0].data;
      let compet = infosAfter.find('li.item:contains("Competência")').get(index)
        .next.children[0].data;
      let valor = infosAfter.find('li.item:contains("Valor")').get(index).next
        .children[0].data;
      let data = infosAfter
        .find('li.item:contains("Data de débito:")')
        .get(index).next.children[0].data;
      let dae = {
        controle: controle,
        autBanc: autBanc,
        contaDebito: contaDebito,
        codBarras: codBarras,
        empresa: empresa,
        cnpj: cnpj,
        compet: compet,
        valor: valor,
        data: data,
      };
      daes.push(dae);
    } else {
      // let cabecalho = $("ul.cabecalho > li[class*=info]").find('br').get(index).next.next.next;
      // let controle = cabecalho.data;
      // let contaDebito = cabecalho.next.next.data;
      let esocial = "Comprovante de Pagamento do Esocial";
      let codBarras = infosAfter
        .find('li.item:contains("Código de barras")')
        .get(index).next.children[0].data;
      let data = $(
        "div.box_grayLine_bottom > table.tabela_comprovante.pb10 > tbody > tr > td > ul.list_infos.after"
      ).get(index).children[7].children[0].data;
      let nroDocumento = $(
        "div.box_grayLine_bottom > table.tabela_comprovante.pb10 > tbody > tr > td > ul.list_infos.after"
      ).get(index).children[10].children[0].data;
      let valor = $(
        "div.box_grayLine_bottom > table.tabela_comprovante.pb10 > tbody > tr > td > ul.list_infos.after"
      ).get(index).children[13].children[0].data;
      let autBanc = $(
        "div.box_grayLine_bottom > table.tabela_comprovante.pb10 > tbody > tr > td > ul.list_infos.after"
      ).get(index).children[16].children[0].data;

      let dae = {
        // controle: controle,
        // contaDebito: contaDebito,
        esocial: esocial,
        codBarras: codBarras,
        data: data,
        nroDocumento: nroDocumento,
        valor: valor,
        autBanc: autBanc,
      };

      daes.push(dae);
    }
  }
  return daes;
}

function darfF(file) {
  let darfs = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos");
  const numberOfCompr = $("img#foco_mensagem").length;
  console.log(numberOfCompr);

  for (let index = 0; index < numberOfCompr; index++) {
    let controle = $(
      "#boxPrint01 > div.ptb0.comprovante.pb0 > table > tbody > tr > td.tdCentral > ul > li > p:nth-child(2)"
    )
      .get(index)
      .children[0].data.replace(/\t/g, "")
      .replace(/\n/g, "");
    let contaDebito = $(
      "#boxPrint01 > div.ptb0.comprovante.pb0 > table > tbody > tr > td.tdCentral > ul > li > p:nth-child(3)"
    )
      .get(index)
      .children[0].data.replace(/\t/g, "")
      .replace(/\n/g, "")
      .replace("Ag�ncia", "Agencia");
    let dataPag = infosAfter
      .find('li.item:contains("Data do Pagamento")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let dataApu = infosAfter
      .find('li.item:contains("de Apura")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let cnpj = infosAfter
      .find('li.item:contains("CNPJ")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let codReceita = infosAfter
      .find('li.item:contains("digo de Receita:")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let ref = infosAfter
      .find('li.item:contains("mero de Referencia:")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let dataVenc = infosAfter
      .find('li.item:contains("Data do Vencimento:")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let valor = infosAfter
      .find('li.item:contains("Valor Total:")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let autBanc = infosAfter
      .find('li.item:contains("Autentica")')
      .get(index)
      .next.next.children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");

    let darf = {
      controle: controle,
      contaDebito: contaDebito,
      dataPag: dataPag,
      dataApu: dataApu,
      cnpj: cnpj,
      codReceita: codReceita,
      ref: ref,
      dataVenc: dataVenc,
      valor: valor,
      autBanc: autBanc,
    };
    darfs.push(darf);
  }
  return darfs;
}

function gpsF(file) {
  let gps_arr = [];

  const $ = cheerio.load(file);

  const infosAfter = $("ul.list_infos.after");
  const numberOfCompr = $("img.logoComprovante").length;
  console.log(numberOfCompr);

  for (let index = 0; index < numberOfCompr; index++) {
    let contaDebito =
      $(
        "#conteudo > div > div > div > div.box_grayLine_bottom.bb0.pb0.ptb0.comprovante > table > tbody > tr > td > ul > li:nth-child(5)"
      )
        .get(index)
        .children[0].data.split("|")[0] +
      $(
        "#conteudo > div > div > div > div.box_grayLine_bottom.bb0.pb0.ptb0.comprovante > table > tbody > tr > td > ul > li:nth-child(5)"
      )
        .get(index)
        .children[0].data.split("|")[1];
    let nome = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(4) > td:nth-child(1) > font > br:nth-child(1)"
    )
      .get(index)
      .next.data.replace(/\n/g, "")
      .replace(/\t/g, "");
    let endereco = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(4) > td:nth-child(1) > font > br:nth-child(3)"
    )
      .get(index)
      .next.data.replace(/\n/g, "")
      .replace(/\t/g, "");
    let codPag = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(1) > td:nth-child(3) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let compet = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(2) > td:nth-child(2) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let ident = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(3) > td:nth-child(2) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let inss = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(4) > td:nth-child(3) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let outrasEnt = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(7) > td:nth-child(4) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let multa = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(8) > td:nth-child(3) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let total = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(1) > tbody > tr > td > table.tp5.tableBorderColor > tbody > tr:nth-child(9) > td:nth-child(2) > font"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let controle = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(3) > tbody > tr > td:nth-child(1) > font:nth-child(1) > i"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");
    let autBanc = $(
      "#conteudo > div > div > div > div.print-bb0.mt15 > table:nth-child(3) > tbody > tr > td:nth-child(1) > font:nth-child(4) > i"
    )
      .get(index)
      .children[0].data.replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/ /g, "");

    let gps = {
      contaDebito: contaDebito,
      nome: nome,
      endereco: endereco,
      codPag: codPag,
      compet: compet,
      ident: ident,
      inss: inss,
      outrasEnt: outrasEnt,
      multa: multa,
      total: total,
      controle: controle,
      autBanc: autBanc,
    };
    gps_arr.push(gps);
  }
  return gps_arr;
}

function bbpjF(file) {
  let bb_arr_final = [];

  let bb_arr = [];

  let words = [
    "AGENCIA",
    "CONTA:",
    "NR. DOCUMENTO",
    "DATA DO PAGAMENTO",
    "VALOR COBRADO",
    "NR.AUTENTICACAO",
    "AUTENTICACAO",
    "CODIGO DE BARRAS",
    "DOCUMENTO",
    "Convenio  FGTS ARRECADACAO GRF",
    "Codigo de Barras",
    "Data do pagamento",
    "CNPJ/CEI/CPF",
    "COMPETENCIA",
    "CODIGO RECOLHIMENTO",
    "VENCIMENTO",
    "Valor Total",
    "DOCUMENTO:",
    "AUTENTICACAO SISBB:",
    "FINALIDADE:",
    "REMETENTE",
    "BANCO",
    "FAVORECIDO",
    "CPF/CNPJ:",
    "VALOR",
    "DEBITO",
    "PERIODO DE APURACAO",
    "NUMERO DO CPF",
    "CODIGO DA RECEITA",
    "DATA DO VENCIMENTO",
    "VALOR DO PRINCIPAL",
    "VALOR DA MULTA",
    "VALOR DOS JUROS",
    "VALOR TOTAL",
    "CODIGO DO PAGAMENTO",
    "IDENTIFICADOR",
    "VALOR DO INSS",
    "VALOR OUTRAS ENTIDADES",
    "VALOR ATM/JUROS/MULTA",
    "DATA DA TRANSFERENCIA",
    "TRANSFERIDO PARA:",
    "CLIENTE:",
    "CONVENIO",
    "NR.REMESSA:",
  ];
  let w1 = ["BENEFICIARIO", "Codigo de Barras"];
  let w2 = ["NR.AUTENTICACAO", "AUTENTICACAO"];

  let text = file.split(
    "================================================================================================================================================================"
  );

  let bb_arr_temp = [];

  text.forEach(function (compr) {
    let lines = compr.split("\n");
    if (lines.length > 2) {
      lines.forEach(function (line, index) {
        words.forEach(function (word) {
          if (line.includes(word)) {
            bb_arr_temp.push(line);
          }
          if (
            line.includes("BENEFICIARIO") ||
            line.includes("Codigo de Barras")
          ) {
            bb_arr_temp.push(lines[index - 1]);
            bb_arr_temp.push(lines[index + 1]);
          }
        });
      });
      let compr_n = bb_arr_temp.join("--");
      bb_arr_temp = [];
      bb_arr.push(compr_n);
    }
  });

  bb_arr.forEach(function (compr) {
    let unique = [...new Set(compr.split("--"))];
    bb_arr_final.push(unique);
  });

  bb_arr_temp = [];

  bb_arr_final.forEach(function (compr) {
    //compr
    //.filter((line) => line !== "")
    //.filter((line) => line !== "- ")
    //bb_arr_temp.push(compr);
    let compr2 = compr
      .filter((line) => line !== "- ")
      .filter((line) => line !== "")
      .filter((line) => line !== "-\n")
      .filter((line) => {
        return !line.includes("-  BANCO  DO  BRASIL  -");
      })
      .filter((line) => {
        return !line.includes(
          "SISBB  -  SISTEMA DE INFORMACOES BANCO DO BRASIL"
        );
      });
    bb_arr_temp.push(compr2);
  });

  //console.log(bb_arr_temp[15]);

  return bb_arr_temp;
}

function chequeBradescoF(file) {
  var wb = xlsx.read(file.data, { cellDates: true });

  var ws = wb.Sheets[wb.SheetNames[0]];

  var data = xlsx.utils.sheet_to_json(ws);

  function formatDate(date) {
    var data = new Date(date);
    var extenso;
    // console.log(data);
    var day = data.getDate();
    var month = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ][data.getMonth()];
    var year = data.getFullYear();

    return [day, month, year];
  }

  let dataFilter = data
    .filter((obj) => {
      return obj.Tipo === "cheque";
    })
    .map((obj) => {
      return _.omit(obj, ["codigo", "Tipo", "memo", "categoria"]);
    });

  let newData = dataFilter.map((obj) => ({
    ...obj,
    valorExtenso: extenso
      .porExtenso(obj.Valor, extenso.estilo.monetario)
      .toUpperCase(),
    dia: formatDate(obj.data)[0],
    mes: formatDate(obj.data)[1],
    ano: formatDate(obj.data)[2],
  }));
  return newData;
}

module.exports = {
  titulosF,
  daemsF,
  tedF,
  tcbF,
  telF,
  daesF,
  darfF,
  gpsF,
  bbpjF,
  chequeBradescoF,
};
