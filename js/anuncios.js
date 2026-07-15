// ===============================
// TROCAFÁCIL - ANUNCIOS.JS
// ===============================

// Recupera o usuário logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// Verifica se o usuário está logado
function verificarLogin() {

    const pagina = window.location.pathname;

    if (!usuarioLogado && !pagina.includes("login.html") && !pagina.includes("cadastro.html")) {

        window.location.href = "login.html";

    }

}

verificarLogin();


// ===============================
// Exibe o nome do usuário
// ===============================

const nomeUsuario = document.getElementById("nomeUsuario");

if (nomeUsuario && usuarioLogado) {

    nomeUsuario.innerHTML = `Bem-vindo, ${usuarioLogado.nome}!`;

}


// ===============================
// Campo Valor
// ===============================

const tipo = document.getElementById("tipo");
const campoValor = document.getElementById("campoValor");

if (tipo && campoValor) {

    campoValor.style.display = "none";

    tipo.addEventListener("change", () => {

        if (tipo.value === "Venda") {

            campoValor.style.display = "block";

        } else {

            campoValor.style.display = "none";
            document.getElementById("valor").value = "";

        }

    });

}


// ===============================
// Cadastro de anúncios
// ===============================

const formAnuncio = document.getElementById("formAnuncio");

if (formAnuncio) {

    formAnuncio.addEventListener("submit", async function (e) {

        e.preventDefault();

        const titulo = document.getElementById("titulo").value;
        const categoria = document.getElementById("categoria").value;
        const tipo = document.getElementById("tipo").value;
        const valor = document.getElementById("valor").value;
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        const telefone = document.getElementById("telefone").value;
        const descricao = document.getElementById("descricao").value;

        const arquivos = document.getElementById("imagens").files;

        if (arquivos.length > 5) {

            alert("Você pode selecionar no máximo 5 imagens.");

            return;

        }

        let imagens = [];

        // Converte as imagens para Base64
        for (let arquivo of arquivos) {

            const imagem64 = await converterBase64(arquivo);

            imagens.push(imagem64);

        }

        // Recupera anúncios existentes
        let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

        // Cria objeto do anúncio
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

const anunciante = usuario.nome;

const data = new Date().toLocaleDateString("pt-BR");

const anuncio = {

    id: Date.now(),

    usuarioId: usuario.id,

    titulo,

    descricao,

    categoria,

    tipo,

    valor,

    estado,

    cidade,

    telefone,

    anunciante,

    data,

    imagens

};

        anuncios.push(anuncio);

        localStorage.setItem("anuncios", JSON.stringify(anuncios));

        alert("Anúncio publicado com sucesso!");

        window.location.href="index.html";

    });

}


// ===============================
// Converter imagem para Base64
// ===============================

function converterBase64(arquivo) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.readAsDataURL(arquivo);

        reader.onload = () => resolve(reader.result);

        reader.onerror = erro => reject(erro);

    });

}

carregarAnuncios();
// ===============================
// CRIAR CARD DO ANÚNCIO
// ===============================

function criarCard(anuncio, mostrarBotoes = false) {

    let valorHTML = "";

    if (anuncio.tipo === "Venda") {
        valorHTML = `
            <p class="preco">
                R$ ${Number(anuncio.valor).toFixed(2)}
            </p>
        `;
    }

    const imagem =
        anuncio.imagens && anuncio.imagens.length > 0
            ? anuncio.imagens[0]
            : "https://via.placeholder.com/300x220?text=Sem+Imagem";

    let botoes = "";

    if (mostrarBotoes) {

        botoes = `
            <div class="acoes-anuncio">
                <button
                    class="btn-excluir"
                    onclick="excluirAnuncio(${anuncio.id})">

                    Excluir

                </button>

            </div>
        `;

    }

    return `

        <div class="card-anuncio">

            <img src="${imagem}" alt="${anuncio.titulo}">

            <div class="conteudo-card">

                <h3>${anuncio.titulo}</h3>

                <p><strong>Categoria:</strong> ${anuncio.categoria}</p>

                <p><strong>Tipo:</strong> ${anuncio.tipo}</p>

                <p><strong>Estado:</strong> ${anuncio.estado}</p>

                <p><strong>Cidade:</strong> ${anuncio.cidade}</p>

                ${valorHTML}

                <button
                    class="btn-detalhes"
                    onclick="verDetalhes(${anuncio.id})">

                    Ver detalhes

                </button>

                ${botoes}

            </div>

        </div>

    `;

}
// ===============================
// LISTAR ANÚNCIOS
// ===============================

function carregarAnuncios() {

    const lista = document.getElementById("listaAnuncios");

    // Se a página não possui essa div, não faz nada
    if (!lista) return;

    // Busca os anúncios salvos
    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    // Limpa a lista
    lista.innerHTML = "";

    // Caso não exista nenhum anúncio
    if (anuncios.length === 0) {

        lista.innerHTML = `
            <div class="sem-anuncios">
                <h2>Nenhum anúncio cadastrado.</h2>
                <p>Seja o primeiro a publicar um anúncio!</p>
            </div>
        `;

        return;

    }

    // Mostra os anúncios mais recentes primeiro
    anuncios.reverse().forEach(anuncio => {

        let valorHTML = "";

        if (anuncio.tipo === "Venda") {

            valorHTML = `
                <p class="preco">
                    R$ ${Number(anuncio.valor).toFixed(2)}
                </p>
            `;

        }

        const imagem = anuncio.imagens.length > 0
            ? anuncio.imagens[0]
            : "https://via.placeholder.com/300x220?text=Sem+Imagem";

        lista.innerHTML += criarCard(anuncio);
        
    });
    
}

// ===============================
// PESQUISA E FILTROS
// ===============================

// Campos da pesquisa
const campoPesquisa = document.getElementById("pesquisa");
const filtroCategoria =
document.getElementById("filtroCategoria");

const filtroTipo =
document.getElementById("filtroTipo");

// Eventos
if (campoPesquisa) {
    campoPesquisa.addEventListener("input", filtrarAnuncios);
}

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", filtrarAnuncios);
}

if (filtroTipo) {
    filtroTipo.addEventListener("change", filtrarAnuncios);
}


// ===============================
// Filtrar anúncios
// ===============================

function filtrarAnuncios() {

    const lista = document.getElementById("listaAnuncios");

    if (!lista) return;

    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    const textoPesquisa =
    campoPesquisa ? campoPesquisa.value.toLowerCase() : "";

    const categoriaSelecionada = filtroCategoria.value;

    const tipoSelecionado = filtroTipo.value;

    lista.innerHTML = "";

    let encontrados = 0;

    anuncios.slice().reverse().forEach(anuncio => {

        const correspondePesquisa =
            anuncio.titulo.toLowerCase().includes(textoPesquisa);

        const correspondeCategoria =
            categoriaSelecionada === "" ||
            anuncio.categoria === categoriaSelecionada;

        const correspondeTipo =
            tipoSelecionado === "" ||
            anuncio.tipo === tipoSelecionado;

        if (
            correspondePesquisa &&
            correspondeCategoria &&
            correspondeTipo
        ) {

            encontrados++;

            let valorHTML = "";

            if (anuncio.tipo === "Venda") {

                valorHTML = `
                    <p class="preco">
                        R$ ${Number(anuncio.valor).toFixed(2)}
                    </p>
                `;

            }

            const imagem =
                anuncio.imagens.length > 0
                    ? anuncio.imagens[0]
                    : "https://via.placeholder.com/300x220?text=Sem+Imagem";

            lista.innerHTML += criarCard(anuncio);
        }

    });

 
}
// ===============================
// PERFIL DO USUÁRIO
// ===============================

function carregarPerfil() {

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) return;

    const nome = document.getElementById("perfilNome");
    const email = document.getElementById("perfilEmail");
    const quantidade = document.getElementById("perfilQuantidade");
    const id = document.getElementById("perfilId");

    if (!nome) return;

    nome.textContent = usuario.nome;
    email.textContent = usuario.email;
    id.textContent = usuario.id;

    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    const meus = anuncios.filter(a => a.usuarioId === usuario.id);

    quantidade.textContent = meus.length;

}

carregarPerfil();


// ===============================
// BOTÃO SAIR DO PERFIL
// ===============================

function sair(){

    localStorage.removeItem("usuarioLogado");

    window.location.href="login.html";

}

document.getElementById("btnSair")?.addEventListener("click", sair);

document.getElementById("btnSairPerfil")?.addEventListener("click", sair);


// ===============================
// EDITAR PERFIL
// ===============================

const btnEditarPerfil = document.getElementById("btnEditarPerfil");

if (btnEditarPerfil) {

    btnEditarPerfil.addEventListener("click", () => {

        alert("Esta funcionalidade será implementada em breve.");

    });

}
// ===============================
// MEUS ANÚNCIOS
// Parte 4
// ===============================

function carregarMeusAnuncios() {

    const lista = document.getElementById("listaMeusAnuncios");

    if (!lista) return;

    const quantidade = document.getElementById("quantidadeAnuncios");

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario) {

        window.location.href = "login.html";
        return;

    }

    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    const meusAnuncios =
    anuncios.filter(
    anuncio => anuncio.usuarioId === usuario.id
);

    quantidade.textContent = `Você possui ${meusAnuncios.length} anúncio(s).`;

    lista.innerHTML = "";

    if (meusAnuncios.length === 0) {

        lista.innerHTML = `
            <div class="sem-anuncios">

                <h2>Você ainda não publicou nenhum anúncio.</h2>

                <a href="novo-anuncio.html">
                    Publicar meu primeiro anúncio
                </a>

            </div>
        `;

        return;

    }

    meusAnuncios.reverse().forEach(anuncio => {

        lista.innerHTML += criarCard(anuncio, true);

    });

}

carregarMeusAnuncios();


// ===============================
// EXCLUIR ANÚNCIO
// ===============================

function excluirAnuncio(id) {

    const confirmar = confirm("Deseja realmente excluir este anúncio?");

    if (!confirmar) return;

    let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    anuncios = anuncios.filter(anuncio => anuncio.id !== id);

    localStorage.setItem("anuncios", JSON.stringify(anuncios));

    alert("Anúncio excluído com sucesso!");

    carregarMeusAnuncios();

    if (document.getElementById("listaAnuncios")) {

        carregarAnuncios();

    }

}

// ===============================
// DETALHES DO ANÚNCIO
// ===============================

function carregarDetalhes() {

    const detalhes = document.getElementById("detalhesProduto");

    if (!detalhes) return;

    const id = Number(localStorage.getItem("anuncioSelecionado"));

    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

    const anuncio = anuncios.find(a => a.id === id);

    if (!anuncio) {

        detalhes.innerHTML = "<h2>Anúncio não encontrado.</h2>";

        return;

    }

    let imagensHTML = "";
    if(anuncio.imagens.length === 0){

        imagensHTML = `
            <img
            src="img/sem-imagem.png"
            class="imagem-detalhe">
    `;

}
    if(anuncio.imagens){
    anuncio.imagens.forEach(imagem => {

        imagensHTML += `

            <img
                src="${imagem}"
                class="imagem-detalhe"
            >

        `;

    });
    }

    let valorHTML = "";

    if (anuncio.tipo === "Venda") {

        valorHTML = `

            <h3>

                Valor: R$ ${Number(anuncio.valor).toFixed(2)}

            </h3>

        `;

    }

    detalhes.innerHTML = `

        <div class="detalhes-card">

            <h2>${anuncio.titulo}</h2>

            <div class="galeria">

                ${imagensHTML}

            </div>

            <h3>Descrição</h3>

            <p>

                ${anuncio.descricao}

            </p>

            ${valorHTML}

            <p>

                <strong>Categoria:</strong>

                ${anuncio.categoria}

            </p>

            <p>

                <strong>Tipo:</strong>

                ${anuncio.tipo}

            </p>

            <p>

                <strong>Estado:</strong>

                ${anuncio.estado}

            </p>

            <p>

                <strong>Cidade:</strong>

                ${anuncio.cidade}

            </p>

            <p>

                <strong>Telefone:</strong>

                ${anuncio.telefone}

            </p>

            <p>

                <strong>Anunciante:</strong>

                ${anuncio.anunciante}

            </p>

            <p>

                <strong>Publicado em:</strong>

                ${anuncio.data}

            </p>

            <a href="index.html">

                <button>

                    Voltar

                </button>

            </a>

        </div>

    `;

}
function verDetalhes(id) {

    localStorage.setItem("anuncioSelecionado", id);

    window.location.href = "detalhes.html";

}
carregarDetalhes();
