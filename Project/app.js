class Quarto {
    constructor(capacidade, preco, comodidades) {
        this.capacidade = capacidade;
        this.preco = preco;
        this.comodidades = comodidades;
    }
    
    detalhes() {
        return `${this.constructor.name} - Capacidade: ${this.capacidade}, Preço: R$${this.preco}, Comodidades: ${this.comodidades.join(", ")}`;
    }
}

class QuartoSimples extends Quarto {
    constructor() {
        super(2, 100.0, ["Wi-Fi"]);
    }
}

class QuartoLuxo extends Quarto {
    constructor() {
        super(3, 200.0, ["Wi-Fi", "Café da manhã", "Ar condicionado"]);
    }
}

class Suite extends Quarto {
    constructor() {
        super(4, 350.0, ["Wi-Fi", "Café da manhã", "Ar condicionado", "Banheira"]);
    }
}

const QuartoFactory = {
    criarQuartoSimples: () => new QuartoSimples(),
    criarQuartoLuxo: () => new QuartoLuxo(),
    criarSuite: () => new Suite()
};


class ReservaStorage {
    salvarReserva(reserva) {}
    listarReservas() {}
}

class ArmazenamentoMemoria extends ReservaStorage {
    constructor() {
        super();
        this.reservas = [];
    }

    salvarReserva(reserva) {
        this.reservas.push(reserva);
        this.atualizarUI();
    }

    listarReservas() {
        return this.reservas;
    }

    atualizarUI() {
        const listaReservas = document.getElementById('lista-reservas');
        listaReservas.innerHTML = '';
        this.reservas.forEach(reserva => {
            const li = document.createElement('li');
            li.textContent = `${reserva.nome} - ${reserva.quarto.detalhes()} (Check-in: ${reserva.checkin}, Check-out: ${reserva.checkout})`;
            listaReservas.appendChild(li);
        });
    }
}

const armazenamentoReserva = new ArmazenamentoMemoria();

class ReservaHistorico {
    constructor() {
        this.historico = [];
    }

    salvarEstado(estado) {
        this.historico.push(JSON.parse(JSON.stringify(estado)));
    }

    restaurarUltimoEstado() {
        if (this.historico.length === 0) return null;
        return this.historico.pop();
    }
}

function desfazerUltimaReserva() {
    const estadoAnterior = reservaHistorico.restaurarUltimoEstado();
    if (estadoAnterior) {
        armazenamentoReserva.reservas = estadoAnterior.map(e => ({
            nome: e.nome,
            quarto: new QuartoFactory[`criar${e.quarto.tipo}`](),
            checkin: e.checkin,
            checkout: e.checkout
        }));
        armazenamentoReserva.atualizarUI();
        alert("Última reserva desfeita.");
    } else {
        alert("Nenhum histórico encontrado para desfazer.");
    }
}
