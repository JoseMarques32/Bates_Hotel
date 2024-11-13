
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
    criarQuartoSimples: () => new Quarto("Simples", 2, 250, ["Internet e TV a cabo grátis."]),
    criarQuartoLuxo: () => new Quarto("Luxo", 3, 200.0, ["Internet e TV a cabo grátis", "Café da manhã", "Ar condicionado", "Banheira."]),
    criarSuite: () => new Quarto("Suíte", 4, 350.0, ["Internet e TV a cabo grátis", "Café da manhã", "Ar condicionado", "Banheira", "Frigobar grátis."])
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
            li.textContent = `${reserva.nome} - ${reserva.quarto.detalhes()}`;
            listaReservas.appendChild(li);
        });
    }

    removerReserva(indice) {
        this.reservas.splice(indice, 1); 
        this.atualizarUI(); 
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


function carregarReservas() {
    fetch("ListarReservas.php")
        .then(response => response.json())
        .then(data => {
            const listaReservas = document.getElementById('lista-reservas');
            listaReservas.innerHTML = '';  

            data.forEach(reserva => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${reserva.nome_usuario} - Quarto: ${reserva.tipo_quarto}, Comodidades: ${reserva.comodidades.join(", ")}`;
                listaReservas.appendChild(li);
            });
        })
        .catch(error => console.log('Erro ao listar reservas:', error));
}


function realizarReserva() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value; 
    const tipoQuarto = document.getElementById("tipo_quarto").value;
    const checkin = document.getElementById("checkin").value; 
    const checkout = document.getElementById("checkout").value;

    console.log("Tipo de quarto selecionado:", tipoQuarto); 

    let quartoSelecionado;

    
    if (tipoQuarto === "Simples") {
        quartoSelecionado = QuartoFactory.criarQuartoSimples();
    } else if (tipoQuarto === "Luxo") {
        quartoSelecionado = QuartoFactory.criarQuartoLuxo();
    } else if (tipoQuarto === "Suíte") {
        quartoSelecionado = QuartoFactory.criarSuite();
    } else {
        alert("Tipo de quarto inválido.");
        console.log("Erro: Tipo de quarto inválido.", tipoQuarto);  
        return;
    }

    const reserva = {
        nome: nome,
        cpf: cpf,
        quarto: quartoSelecionado,  
        checkin: checkin,
        checkout: checkout
    };

    reservaHistorico.salvarEstado(armazenamentoReserva.reservas);
    armazenamentoReserva.salvarReserva(reserva);

   
    fetch("Reserva.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `nome=${encodeURIComponent(nome)}&cpf=${encodeURIComponent(cpf)}&tipo_quarto=${encodeURIComponent(tipoQuarto)}&checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}`
    })
    .then(response => response.json())
    .then(data => {
        const listaReservas = document.getElementById("lista-reservas");
        listaReservas.innerHTML = '';
        data.reservas.forEach(reserva => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${reserva.nome_usuario} - ${reserva.tipo_quarto} - Check-in: ${reserva.data_checkin} - Check-out: ${reserva.data_checkout}, Comodidades: ${reserva.comodidades.join(", ")}`;
            listaReservas.appendChild(li);
        });
    })
    .catch(error => console.log("Erro ao realizar reserva:", error));
}

function desfazerReserva() {
    if (armazenamentoReserva.reservas.length > 0) {
        
        const ultimaReserva = armazenamentoReserva.reservas[armazenamentoReserva.reservas.length - 1];

        
        fetch("ReservationDelete.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id_reserva=${encodeURIComponent(ultimaReserva.id)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                
                armazenamentoReserva.reservas.pop();
                armazenamentoReserva.atualizarUI();  
                alert("Reserva desfeita com sucesso.");
            } else {
                alert("Erro ao excluir reserva no banco de dados.");
            }
        })
        .catch(error => {
            console.log("Erro ao excluir reserva:", error);
            alert("Erro ao excluir reserva.");
        });
    } else {
        alert("Não há reservas para desfazer.");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    carregarReservas(); 
});
