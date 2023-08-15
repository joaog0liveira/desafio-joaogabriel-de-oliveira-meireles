class Cardapio {
    constructor(codigo, descricao, value, itemExtra = null) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.value = value;
        this.itemExtra = itemExtra;
    }
}

class formaPagamento {
    constructor(descricao) {
        this.descricao = descricao;
    }
}

class CaixaDaLanchonete {
    static ITENS_CARDAPIO = [
        new Cardapio("cafe", "Café", 3.00),
        new Cardapio("chantily", "Chantily (extra do Café)", 1.50, "cafe"),
        new Cardapio("suco", "Suco Natural", 6.20),
        new Cardapio("sanduiche", "Sanduíche", 6.50),
        new Cardapio("queijo", "Queijo (extra do Sanduíche)", 2.00, "sanduiche"),
        new Cardapio("salgado", "Salgado", 7.25),
        new Cardapio("combo1", "1 Suco e 1 Sanduíche", 9.50),
        new Cardapio("combo2", "1 Café e 1 Sanduíche", 7.50),
    ];

    static METODOS_PAGAMENTO = [
        new formaPagamento('dinheiro'),
        new formaPagamento('credito'),
        new formaPagamento('debito'),
    ];

    calcularValorDaCompra(metodoDePagamento, itens) {
        if (itens.length === 0) {
            return "Não há itens no carrinho de compra!";
        }

        let valorTotal = 0;

        for (const item of itens) {
            const quantAndItens = this.divideItens(item);

            if (typeof quantAndItens === "string") {
                return 'Item inválido!';
            }

            const [tipoDeItem, quantidadeItens] = quantAndItens;

            if (quantidadeItens < 1 || isNaN(quantidadeItens)) {
                return "Quantidade inválida!";
            }

            const itemCalculatedValue = this.calcItemValue(tipoDeItem, quantidadeItens, itens);

            if (typeof itemCalculatedValue === "string") {
                return itemCalculatedValue;
            }

            valorTotal += itemCalculatedValue;
        }

        valorTotal = this.calcTaxaOuDesconto(metodoDePagamento, valorTotal);

        if (typeof valorTotal === 'string') {
            return valorTotal;
        }

        return `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    divideItens(item) {
        const ItemDividido = item.split(",");

        if (ItemDividido.length !== 2) {
            return "Item inválido!";
        }

        return ItemDividido;
    }

    calcTaxaOuDesconto(formaPagamento, valorTotal) {
        if (formaPagamento === 'dinheiro') {
            valorTotal *= 0.95;
        } else if (formaPagamento === 'credito') {
            valorTotal *= 1.03;
        } else if (formaPagamento !== 'debito') {
            return "Forma de pagamento inválida!";
        }

        return valorTotal;
    }

    calcItemValue(tipoDeItem, quantidade, itens) {
        const Cardapio = CaixaDaLanchonete.ITENS_CARDAPIO.find(item => item.codigo === tipoDeItem);

        if (!Cardapio) {
            return "Item inválido!";
        }

        if (Cardapio.itemExtra && !this.temItemExtra(itens, Cardapio.itemExtra)) {
            return 'Item extra não pode ser pedido sem o principal';
        }

        return Cardapio.value * quantidade;
    }

    temItemExtra(itens, itemExtra) {
        return itens.some(item => this.divideItens(item)[0] === itemExtra);
    }
}

export { CaixaDaLanchonete };
