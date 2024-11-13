<?php

require '../Database/Database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
       
        $nome = $_POST['nome'];
        $cpf = $_POST['cpf'];  
        $tipoQuarto = $_POST['tipo_quarto'];
        $checkin = $_POST['checkin'];  
        $checkout = $_POST['checkout'];  

        $sql = "SELECT id, tipo, capacidade, preco, comodidades FROM quartos WHERE tipo = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$tipoQuarto]);
        $quarto = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($quarto) {
            $sqlReserva = "INSERT INTO reservas (nome_usuario, cpf_usuario, id_quarto, data_checkin, data_checkout) 
                           VALUES (?, ?, ?, ?, ?)";
            $stmtReserva = $pdo->prepare($sqlReserva);
            $stmtReserva->execute([$nome, $cpf, $quarto['id'], $checkin, $checkout]);

            echo json_encode(['status' => 'success', 'message' => 'Reserva realizada com sucesso!', 'quarto' => $quarto]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Quarto não encontrado']);
        }
    }
} catch (\Throwable $e) {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitação inválido']);
}
?>