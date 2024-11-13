class Quarto {
    constructor(tipo, capacidade, preco, comodidades) {
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.preco = preco;
        this.comodidades = comodidades;
    }

    detalhes() {
        return `${this.tipo} - Capacidade: ${this.capacidade} Hóspedes, Preço: R$${this.preco}, Comodidades: ${this.comodidades.join(", ")}`;
    }
}

const QuartoFactory = {
    criarQuartoSimples: () => new Quarto("Simples", 2, 250, ["Internet e TV a cabo grátis"]),
    criarQuartoLuxo: () => new Quarto("Luxo", 3, 200.0, ["Internet e TV a cabo grátis", "Café da manhã", "Ar condicionado", "Banheira"]),
    criarSuite: () => new Quarto("Suíte", 4, 350.0, ["Internet e TV a cabo grátis", "Café da manhã", "Ar condicionado", "Banheira", "Frigobar grátis"])
};

class ArmazenamentoReserva {
    constructor() {
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
            li.className = 'list-group-item';
            li.textContent =`${reserva.nome} - ${reserva.quarto.detalhes()}`;
            listaReservas.appendChild(li);
        });
    }
}

class ReservaHistorico {
    constructor() {
        this.historico = [];
    }

    salvarEstado(estado) {
        this.historico.push(JSON.stringify(estado));
    }

    restaurarUltimoEstado() {
        if (this.historico.length === 0) return null;
        return JSON.parse(this.historico.pop());
    }
}

const armazenamentoReserva = new ArmazenamentoReserva();
const reservaHistorico = new ReservaHistorico();

function desfazerUltimaReserva() {
    const estadoAnterior = reservaHistorico.restaurarUltimoEstado();
    if (estadoAnterior) {
        armazenamentoReserva.reservas = estadoAnterior.map(e => ({
            nome: e.nome,
            quarto: new Quarto(e.quarto.tipo, e.quarto.capacidade, e.quarto.preco, e.quarto.comodidades)
        }));

        armazenamentoReserva.atualizarUI();
        alert("Última reserva desfeita.");
    } else {
        alert("Nenhum histórico encontrado para desfazer.");
    }
}

async function realizarReserva() {
    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const tipoQuarto = document.getElementById('tipoQuarto').value;
    const capacidade = document.getElementById('capacidade').value;
    const preco = document.getElementById('preco').value;
    const comodidades = document.getElementById('comodidades').value;

    try {
        const response = await fetch('ReservationController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome_usuario: nomeUsuario,
                tipo_quarto: tipoQuarto,
                capacidade: capacidade,
                preco: preco,
                comodidades: comodidades
            })
        });

        if (response.ok) {
            alert('Reserva realizada com sucesso!');
            // Após realizar a reserva, recarrega a lista de reservas
            carregarReservas();
        } else {
            alert('Erro ao realizar a reserva.');
        }
    } catch (error) {
        console.error("Erro ao realizar reserva:", error);
        alert('Erro ao realizar reserva');
    }
}


async function carregarReservas() {
    try {
        const response = await fetch('ListarReservas.php');
        
        if (!response.ok) {
            throw new Error("Erro na resposta da API: " + response.statusText);
        }

        const reservas = await response.json();

        console.log("Reservas carregadas:", reservas); // Verifique se os dados estão sendo carregados corretamente

        if (Array.isArray(reservas) && reservas.length > 0) {
            const listaReservas = document.getElementById('lista-reservas');
            listaReservas.innerHTML = ''; // Limpa a lista de reservas

            reservas.forEach(reserva => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${reserva.nome_usuario} - Tipo de Quarto: ${reserva.tipo_quarto} | Capacidade: ${reserva.capacidade} Hóspedes | Preço: R$${reserva.preco} | Comodidades: ${reserva.comodidades} | Data: ${new Date(reserva.data_reserva).toLocaleString()}`;
                listaReservas.appendChild(li);
            });
        } else {
            console.error("Nenhuma reserva encontrada ou formato incorreto", reservas);
            alert("Nenhuma reserva encontrada.");
        }

    } catch (error) {
        console.error("Erro ao carregar reservas:", error);
        alert("Erro ao carregar reservas: " + error.message);
    }
}


document.addEventListener('DOMContentLoaded', carregarReservas); 
