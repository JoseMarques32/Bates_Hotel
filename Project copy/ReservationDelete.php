<?php
require './Database/Database.php';

try {
    
    $stmtSelect = $pdo->prepare("SELECT MAX(id) AS ultimo_id FROM reservas");
    $stmtSelect->execute();
    $resultado = $stmtSelect->fetch(PDO::FETCH_ASSOC);

   
    if ($resultado && $resultado['ultimo_id']) {
        $ultimoId = $resultado['ultimo_id'];

        
        $stmtDelete = $pdo->prepare("DELETE FROM reservas WHERE id = ?");
        $stmtDelete->execute([$ultimoId]);

        echo json_encode(['status' => 'success', 'message' => 'Última reserva excluída com sucesso!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Não há reservas para excluir']);
    }
} catch (Exception $e) {
    error_log("Erro ao excluir reserva: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir a reserva']);
}
?>
