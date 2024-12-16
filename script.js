function calcularCompatibilidade() {
    const nome1 = document.getElementById("name1").value.trim();
    const nome2 = document.getElementById("name2").value.trim();

    if (nome1 === "" || nome2 === "") {
        alert("Por favor, insira os nomes!");
        return;
    }

    const compatibilidade = calcularPercentual(nome1, nome2);
    const resultDiv = document.getElementById("result");
    const compatibilidadeP = document.getElementById("compatibilidade");
    const fraseP = document.getElementById("frase");
    const imagem = document.getElementById("imagem");
    const tryAgainButton = document.getElementById("try-again");

    compatibilidadeP.innerText = `Compatibilidade: ${compatibilidade}%`; 
    const { frase, imagemSrc } = obterMensagem(compatibilidade);
    fraseP.innerText = frase;
    imagem.src = imagemSrc;

    resultDiv.classList.remove("hidden");
    imagem.classList.remove("hidden");
    void resultDiv.offsetWidth; 
    resultDiv.classList.add("show");

    tryAgainButton.classList.remove("hidden");
}

function calcularPercentual(nome1, nome2) {
    let somaLetras = 0;
    for (const letra of nome1) somaLetras += letra.charCodeAt(0);
    for (const letra of nome2) somaLetras += letra.charCodeAt(0);
    return (somaLetras % 100) + 1; 
}

function obterMensagem(compatibilidade) {
    if (compatibilidade > 80) {
        return {
            frase: "Vocês são perfeitos juntos! 🥰",
            imagemSrc: "https://i.pinimg.com/736x/1a/2e/21/1a2e21598971b431b01b9355f3ea303a.jpg" 
        };
    } else if (compatibilidade > 50) {
        return {
            frase: "Há uma boa conexão entre vocês, mas não prometo nada... 💞",
            imagemSrc: "https://i.pinimg.com/736x/1a/39/70/1a39703c17c4d347076d90edc7d01d92.jpg" 
        };
    } else {
        return {
            frase: "Talvez amigos sejam a melhor opção! 💔",
            imagemSrc: "https://i.pinimg.com/736x/0c/22/2b/0c222b3ddbe6b4d09fc79398b15222cb.jpg" 
        };
    }
}

function tentarNovamente() {
    document.getElementById("name1").value = "";
    document.getElementById("name2").value = "";
    document.getElementById("result").classList.add("hidden");
    document.getElementById("result").classList.remove("show");
    document.getElementById("try-again").classList.add("hidden");
}

function criarCoracao() {
    const container = document.getElementById("hearts-container");
    const heart = document.createElement("div");
    heart.classList.add("heart");

    const posX = Math.random() * 100;
    heart.style.left = `${posX}%`; 

    const size = Math.random() * 10 + 10; 
    heart.style.width = `${size}px`; 
    heart.style.height = `${size}px`; 

    const duration = Math.random() * 3 + 3; 
    heart.style.animationDuration = `${duration}s`; 

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

setInterval(criarCoracao, 300); 

const clientId = 'fd1e5d8ec6034f68b4d0423545786444'; 
const redirectUri = 'http://127.0.0.1:5500/callback'; 

function autenticarSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=playlist-read-private`;
    window.location.href = authUrl; 
}

function obterToken() {
    const hash = window.location.hash; // Pega a parte da URL após o "#"
    if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1)); // Remove o '#'
        const accessToken = params.get('access_token'); // Pega o access_token
        console.log('Token obtido:', accessToken); // Exibe o token no console

        // Armazenar o token no localStorage para uso posterior
        localStorage.setItem('access_token', accessToken);

        // Opcionalmente, redirecionar para a página principal após obter o token
        window.location.hash = ''; // Limpa o hash da URL
    }
}


window.onload = obterToken;

const accessToken = localStorage.getItem('access_token');

window.onload = function() {
    obterToken();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        buscarMusicas();
    } else {
        console.log('Token não encontrado!');
    }
};

function buscarMusicas() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        console.log('Token não encontrado!');
        return;
    }

    fetch('https://api.spotify.com/v1/me/top/artists', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Artistas mais tocados:', data);
        // Exibir os artistas ou músicas no seu site
    })
    .catch(error => console.error('Erro ao obter dados do Spotify:', error));
}
