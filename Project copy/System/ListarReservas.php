<?php
require '../Database/Database.php';

$stmt = $pdo->query("SELECT r.nome_usuario, r.cpf_usuario, q.tipo AS tipo_quarto, q.capacidade, q.preco, q.comodidades, 
                             r.data_checkin, r.data_checkout 
                     FROM reservas r
                     JOIN quartos q ON r.id_quarto = q.id
                     ORDER BY r.data_checkin DESC");
$reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reservas);
?>
