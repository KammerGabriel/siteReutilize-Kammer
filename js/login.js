// Aguarda o carregamento da página
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formLogin");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        // Busca os usuários cadastrados
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Procura um usuário com e-mail e senha informados
        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.email === email &&
            usuario.senha === senha
        );

        if (usuarioEncontrado) {

            // Salva o usuário logado
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

            alert("Login realizado com sucesso!");

            // Vai para a página principal
            window.location.href = "index.html";

        } else {

            alert("E-mail ou senha inválidos.");

        }

    });

});