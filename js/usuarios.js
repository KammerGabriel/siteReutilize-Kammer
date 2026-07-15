document.addEventListener("DOMContentLoaded", () => {

    const formCadastro = document.getElementById("formCadastro");

    formCadastro.addEventListener("submit", function (e) {

        e.preventDefault();

        // Campos do formulário
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        // Verifica se as senhas são iguais
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        // Recupera os usuários cadastrados
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verifica se o e-mail já existe
        const emailExistente = usuarios.find(usuario => usuario.email === email);

        if (emailExistente) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        // Cria o objeto do novo usuário
        const novoUsuario = {
            id: Date.now(), // ID único
            nome: nome,
            email: email,
            senha: senha
        };

        // Adiciona o usuário à lista
        usuarios.push(novoUsuario);

        // Salva no LocalStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Cadastro realizado com sucesso!");

        // Limpa o formulário
        formCadastro.reset();

        // Redireciona para o login
        window.location.href = "login.html";

    });

});