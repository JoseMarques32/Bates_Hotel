<?php
include './ReservationController.php'
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bates Hotel</title>
    <link rel="stylesheet" href="assets/bootstrap.min.css">
</head>
<body style="padding-top: 70px;">

<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
        <a class="navbar-brand" href="#">Bates Hotel</a>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="planos.html">Planos</a></li>
                <li class="nav-item"><a class="nav-link" href="sobre.html">Sobre Nós</a></li>
            </ul>
        </div>
    </div>
</nav>

<div class="container mt-5">
    <h1>Gerenciamento de Reservas de Hotel</h1>
    <h2>Faça sua Reserva</h2>
    <div class="border border-dark p-4 shadow bg-white rounded">
        <form id="reservaForm" method="POST">
            <div class="row">
                <div class="col-md-6">
                    <label for="nome" class="form-label">Nome do Usuário</label>
                    <input type="text" class="form-control" id="nome" name="nome" placeholder="Insira seu nome" required>
                </div>
                <div class="col-md-4">
                    <label for="cpf" class="form-label">CPF do Usuário</label>
                    <input type="text" class="form-control" id="cpf" name="cpf" placeholder="Insira seu CPF" required>
                </div>
                <div class="col-md-3 mt-3">
                    <label for="tipo_quarto" class="form-label">Plano de Quarto</label>
                    <select class="form-select" id="tipo_quarto" name="tipo_quarto" required>
                        <option selected disabled>Escolha...</option>
                        <option value="simples">Simples</option>
                        <option value="luxo">Luxo</option>
                        <option value="suite">Suíte</option>
                    </select>
                </div>
                <div class="col-md-2 mt-3">
                    <label for="checkin" class="form-label">Data de Check-in</label>
                    <input type="date" class="form-control" id="checkin" name="checkin" required>
                </div>
                <div class="col-md-2 mt-3">
                    <label for="checkout" class="form-label">Data de Check-out</label>
                    <input type="date" class="form-control" id="checkout" name="checkout" required>
                </div>
            </div>
            <div class="mt-4">
                <button class="btn btn-primary" type="button" onclick="realizarReserva()">Realizar Reserva</button>
            </div>
        </form>
    </div>
</div>

<div id="reservas-container" class="container mt-5">
    <h2>Reservas Atuais</h2>
    <ul id="lista-reservas" class="list-group"></ul>
    <button class="btn btn-danger mt-3" onclick="desfazerUltimaReserva()">Desfazer Última Reserva</button>
</div>
<script src="app.js"></script>
</body>
</html>
