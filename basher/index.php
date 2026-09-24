<?php

$correct_user = "Rabix33";
$correct_pass = "123456";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $user = $_POST["username"] ?? "";
    $pass = $_POST["password"] ?? "";

    if ($user === $correct_user && $pass === $correct_pass) {
        $message = "Login successful";
    } else {
        $message = "Username or password is incorrect";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hydra Lab</title>

    <style>
        body {
            background: #111;
            color: white;
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .box {
            background: #222;
            padding: 30px;
            width: 300px;
            border-radius: 10px;
        }

        input {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            box-sizing: border-box;
        }

        button {
            width: 100%;
            padding: 10px;
            background: #00aa55;
            color: white;
            border: 0;
            cursor: pointer;
        }

        .message {
            margin-top: 15px;
            text-align: center;
        }
    </style>
</head>

<body>

<div class="box">

    <h2>Hydra Lab</h2>

    <form method="POST" action="/login.php">

        <input
            type="text"
            name="username"
            placeholder="Username"
        >

        <input
            type="password"
            name="password"
            placeholder="Password"
        >

        <button type="submit">
            Login
        </button>

    </form>

    <?php if ($message !== ""): ?>
        <div class="message">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

</div>

</body>
</html>
