// Quando a página é carregada
document.addEventListener("DOMContentLoaded", function () {
    carregarReservasDoLocalStorage();
    armazenamentoReserva.atualizarUI();
});

// Quando uma reserva é realizada ou desfeita
function realizarReserva() {
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const tipoQuarto = document.getElementById("planos").value;
  const dataCheckin = document.getElementById("datacheckin").value;
  const dataCheckout = document.getElementById("datacheckout").value;

  // Validação básica antes de enviar a solicitação
  if (!nome || !cpf || !email || !telefone || !tipoQuarto || !dataCheckin || !dataCheckout) {
      alert("Por favor, preencha todos os campos.");
      return;
  }

  // Antes de realizar a reserva, salvar o estado atual das reservas
  reservaHistorico.salvarEstado(armazenamentoReserva.reservas);

  // Envio da requisição POST
  fetch("ReservationController.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `nome=${encodeURIComponent(nome)}&cpf=${encodeURIComponent(cpf)}&email=${encodeURIComponent(email)}&telefone=${encodeURIComponent(telefone)}&tipo_quarto=${encodeURIComponent(tipoQuarto)}&datacheckin=${encodeURIComponent(dataCheckin)}&datacheckout=${encodeURIComponent(dataCheckout)}`
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === "success") {
          alert(data.message);
          carregarReservas();
      } else {
          alert("Erro: " + data.message);
      }
  })
  .catch(error => console.error("Erro:", error));

    // Salvar as reservas no localStorage
    salvarReservasNoLocalStorage();
}

function desfazerUltimaReserva() {
    const estadoAnterior = reservaHistorico.restaurarUltimoEstado();
    if (estadoAnterior && estadoAnterior.length > 0) {
        // Restaura o estado anterior com a reserva removida
        armazenamentoReserva.reservas = estadoAnterior.slice(0, -1); // Remove a última reserva

        armazenamentoReserva.atualizarUI();
        alert("Última reserva desfeita.");
    } else {
        alert("Nenhuma reserva para desfazer.");
    }

    // Salvar as reservas no localStorage
    salvarReservasNoLocalStorage();
}
