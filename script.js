// Função para exibir uma seção específica e ocultar as outras
function showSection(sectionId) {
    // Oculta todas as seções
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Mostra a seção selecionada
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    // Fecha o menu suspenso após selecionar uma opção
    document.getElementById("myDropdown").classList.remove("show");
}

// Alterna entre ocultar e mostrar o conteúdo do menu suspenso
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Fecha o menu suspenso se o usuário clicar fora dele
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



// Adicionei um evento linear para o input da imagem, pra tipo exibir uma pré-visualização
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Mostra o primeiro arquivo selecionado pelo usuário
    const fileNameDisplay = document.getElementById('file-name'); // aqui é a parte onde o nome do arquivo será exibido
    const uploadedImage = document.getElementById('uploaded-image'); // Aqui é tag <img> para a pré-visualização

    if (file) { // Se um arquivo foi selecionado
        fileNameDisplay.textContent = file.name; // Depois que adiciona a imagem mostra o nome do arquivo
        const reader = new FileReader(); // Cria um objeto FileReader para ler o conteúdo do arquivo
        reader.onload = function(e) { // Quando a leitura do arquivo terminar
            uploadedImage.src = e.target.result; // Define o src da imagem como o resultado da leitura (Base64)
            uploadedImage.style.display = 'block'; // Torna a imagem visível
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados (Base64)
    } else { // Se nenhum arquivo foi selecionado (ou a seleção foi cancelada)
        fileNameDisplay.textContent = 'Nenhum arquivo escolhido'; // Reseta o texto
        uploadedImage.src = '#'; // Limpa o src da imagem
        uploadedImage.style.display = 'none'; // Esconde a imagem
    }
});

/* Funções de Gerenciamento de Produto (simulação básica no lado do cliente)
Em um aplicativo real, essas operações interagiriam com um servidor de backend.
*/

document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const imageInput = document.getElementById('imageUpload');
    const imageFile = imageInput.files[0]; // Pega o primeiro arquivo selecionado

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value).toFixed(2);
    const deliveryTime = document.getElementById('delivery-time').value;

    // Determinar a URL da imagem para o novo item de produto
    let imageUrl = 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Sem+Foto'; // Placeholder padrão
    if (imageFile) {
        // Se um novo arquivo foi selecionado, cria uma URL temporária para ele (apenas para exibição no cliente)
        imageUrl = URL.createObjectURL(imageFile);
    } else if (document.getElementById('uploaded-image').src && document.getElementById('uploaded-image').style.display === 'block') {
        // Se já existe uma imagem na pré-visualização (ex: ao editar um produto existente)
        imageUrl = document.getElementById('uploaded-image').src;
    }

    // Validação simples
    if (!name || !price || isNaN(price)) {
        alert('Nome e Preço do produto são obrigatórios e o preço deve ser um número válido!');
        return;
    }

    const productList = document.getElementById('product-list');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product-item');

    newProductDiv.innerHTML = `
        <img src="${imageUrl}" alt="${name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Erro+Foto';">
        <h3>${name}</h3>
        <p>${description}</p>
        <p class="price">R$ ${price.replace('.', ',')}</p>
        <p>Prazo: ${deliveryTime || 'Não informado'}</p>
        <div class="actions">
            <button onclick="editProduct(this)">Alterar</button>
            <button class="delete" onclick="deleteProduct(this)">Excluir</button>
        </div>
    `;
    productList.appendChild(newProductDiv);

    // Limpa o formulário e reseta a pré-visualização da imagem
    this.reset(); // Limpa todos os campos do formulário
    document.getElementById('file-name').textContent = 'Nenhum arquivo escolhido'; // Reseta o texto do nome do arquivo
    document.getElementById('uploaded-image').src = '#'; // Limpa o src da pré-visualização
    document.getElementById('uploaded-image').style.display = 'none'; // Esconde a pré-visualização
});


// Limpeza da pré-visualização da imagem quando o form é limpo.
function clearProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('file-name').textContent = 'Nenhum arquivo escolhido';
    document.getElementById('uploaded-image').src = '#';
    document.getElementById('uploaded-image').style.display = 'none';
}


// Carregar a imagem existente na aréa de pré visualização e para lidar com a limidação de não poder preencher o campo de input type="file"
function editProduct(button) {
    const productItem = button.closest('.product-item');
    // Extrai os dados do produto do DOM
    const name = productItem.querySelector('h3').textContent;
    const description = productItem.querySelector('p:nth-of-type(1)').textContent; // Primeiro p tag
    const price = productItem.querySelector('.price').textContent.replace('R$ ', '').replace(',', '.');
    const photoSrc = productItem.querySelector('img').src; // Pega o src atual da imagem do produto
    const deliveryTime = productItem.querySelector('p:nth-of-type(2)').textContent.replace('Prazo: ', '');

    // Preenche o formulário para edição
    document.getElementById('product-name').value = name;
    document.getElementById('product-description').value = description;
    document.getElementById('product-price').value = price;
    document.getElementById('delivery-time').value = deliveryTime === 'Não informado' ? '' : deliveryTime;

    // Exibir a imagem atual do produto na área de pré-visualização
    const uploadedImage = document.getElementById('uploaded-image');
    const fileNameDisplay = document.getElementById('file-name');

    // Se a imagem existente não é um placeholder
    if (!photoSrc.includes('placeholder.com') && photoSrc !== '#') {
        uploadedImage.src = photoSrc; // Define o src da pré-visualização para a imagem existente
        uploadedImage.style.display = 'block'; // Mostra a pré-visualização
        fileNameDisplay.textContent = 'Imagem atual carregada'; // Indica que é a imagem já existente
    } else {
        // Se não há imagem ou é um placeholder, reseta a pré-visualização
        uploadedImage.src = '#';
        uploadedImage.style.display = 'none';
        fileNameDisplay.textContent = 'Nenhum arquivo escolhido';
    }

    /* IMPORTANTE: Por segurança, você NÃO pode preencher programaticamente o valor de um input type="file".
    O usuário terá que selecionar a imagem novamente se quiser alterá-la. 
    */
    document.getElementById('imageUpload').value = ''; // Limpa o campo de upload de arquivo

    /* Em um cenário real, você acompanharia qual produto está sendo editado (talvez por um ID).
     Ao clicar em "Adicionar Produto", você atualizaria esse produto específico,
     em vez de adicionar um novo. Para esta demonstração simples no lado do cliente,
     vamos apenas remover o item antigo e "recriá-lo" após a edição. 
    */

    alert('Produto carregado no formulário para alteração. Se quiser alterar a foto, escolha um novo arquivo. Após editar, clique em "Adicionar Produto" para salvar as alterações (isso irá recriar o item).');
}

function deleteProduct(button) {
    // Substitua confirm() por uma modal personalizada em um ambiente de produção
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        button.closest('.product-item').remove();
    }
}

// Validações de Formulário para Consumidor e Vendedor

document.getElementById('consumer-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputs = this.querySelectorAll('input[required]');
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    if (allFilled) {
        // Substitua alert() por uma modal personalizada em um ambiente de produção
        alert('Cadastro de Consumidor realizado com sucesso!');
        this.reset();
    } else {
        // Substitua alert() por uma modal personalizada em um ambiente de produção
        alert('Por favor, preencha todos os campos obrigatórios para o Cadastro de Consumidor.');
    }
});

document.getElementById('seller-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputs = this.querySelectorAll('input[required]');
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    if (allFilled) {
        // Substitua alert() por uma modal personalizada em um ambiente de produção
        alert('Cadastro de Vendedor realizado com sucesso!');
        this.reset();
    } else {
        // Substitua alert() por uma modal personalizada em um ambiente de produção
        alert('Por favor, preencha todos os campos obrigatórios para o Cadastro de Vendedor, incluindo os dados de depósito.');
    }
});

// Mostra uma seção padrão ao carregar a página (ex: gerenciamento de produtos)
document.addEventListener('DOMContentLoaded', () => {
    showSection('product-management');
});
