<?php 

$host = 'localhost';
$dbname = 'Bates_Hotel';
$username = 'userhotel';
$password = 'bates321';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão com o Banco de Dados" . $e->getMessage());
}
