'use strict';

//armazena as necessidades
let necessidades = [];

//carrega necessidades do localStorage
function carregarNecessidades() {
    const necessidadesStorage = localStorage.getItem('necessidades');
    if (necessidadesStorage) {
        necessidades = JSON.parse(necessidadesStorage);
    }
}

//localStorage
function salvarNecessidades() {
    localStorage.setItem('necessidades', JSON.stringify(necessidades));
}

// Função para validar email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar telefone
function validarTelefone(telefone) {
    if (!telefone) return true; // Telefone é opcional
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return telefoneRegex.test(telefone);
}

// Função para validar CPF    
const eNumero = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length == 8 && eNumero(cep);

// Função para validar CPF
const pesquisarCEP = async () => {
    limparFormulario();
    const url = `https://viacep.com.br/ws/${cep.value}/json/`;

    if(cepValido(cep.value)){
        const dados     = await fetch(url);
        const address   = await dados.json();

        if(address.hasOwnProperty('erro')) {
            alert("CEP não encontrado.");
        } else {
            preencherFormulario(address);
        }
    } else {
        alert("CEP inválido.");
    }
}
// Função para preencher o formulário com os dados do CEP
const preencherFormulario = (endereco) => {
    document.getElementById('rua').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('estado').value = endereco.uf;
}
// Função para limpar o formulário
const limparFormulario = () => {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}
// Evento para pesquisar CEP ao perder o foco
document.getElementById('cep').addEventListener('focusout', pesquisarCEP);

// Função para exibir mensagem de sucesso
function exibirMensagemSucesso() {
    const mensagem = document.getElementById('mensagemSucesso');
    mensagem.style.display = 'block';
    
    mensagem.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 4000);
}

// Função para criar card de necessidade
function criarCardNecessidade(necessidade, index) {
    return `
        <div class="necessidade-card">
            <h3>${necessidade.titulo}</h3>
            <div class="instituicao">${necessidade.nomeInstituicao}</div>
            <div class="tipo">${necessidade.tipoAjuda}</div>
            <div class="descricao">${necessidade.descricao}</div>
            <div class="endereco">
                ${necessidade.rua}, ${necessidade.bairro} - ${necessidade.cidade}/${necessidade.estado}
                <br>CEP: ${necessidade.cep}
            </div>
            <div class="contato">
                ${necessidade.email}
                ${necessidade.telefone ? `<br>${necessidade.telefone}` : ''}
            </div>
        </div>
    `;
}

// Função para exibir necessidades
function exibirNecessidades(necessidadesParaExibir = necessidades) {
    const listaNecessidades = document.getElementById('listaNecessidades');
    const mensagemVazia = document.getElementById('mensagemVazia');
    
    if (!listaNecessidades) return; 
    
    if (necessidadesParaExibir.length === 0) {
        listaNecessidades.innerHTML = '';
        mensagemVazia.style.display = 'block';
    } else {
        mensagemVazia.style.display = 'none';
        listaNecessidades.innerHTML = necessidadesParaExibir
            .map((necessidade, index) => criarCardNecessidade(necessidade, index))
            .join('');
    }
}

// Função para pesquisar necessidades
function pesquisarNecessidades() {
    const termoPesquisa = document.getElementById('campoPesquisa').value.toLowerCase();
    const filtroTipo = document.getElementById('filtroTipo').value;
    
    let necessidadesFiltradas = necessidades;
    
    if (termoPesquisa) {
        necessidadesFiltradas = necessidadesFiltradas.filter(necessidade =>
            necessidade.titulo.toLowerCase().includes(termoPesquisa) ||
            necessidade.descricao.toLowerCase().includes(termoPesquisa)
        );
    }
    
    if (filtroTipo) {
        necessidadesFiltradas = necessidadesFiltradas.filter(necessidade =>
            necessidade.tipoAjuda === filtroTipo
        );
    }
    
    exibirNecessidades(necessidadesFiltradas);
}

// Função para filtrar por tipo
function filtrarPorTipo() {
    pesquisarNecessidades();
}

// Event listeners para quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarNecessidades();
    
    // Se estiver na página de necessidades, exibe as necessidades
    if (document.getElementById('listaNecessidades')) {
        exibirNecessidades();
        
        const campoPesquisa = document.getElementById('campoPesquisa');
        if (campoPesquisa) {
            campoPesquisa.addEventListener('input', pesquisarNecessidades);
        }
    }
    
    // Se estiver na página de cadastro, configura o formulário
    const formulario = document.getElementById('necessidadeForm');
    if (formulario) {
        
        const campoCEP = document.getElementById('cep');
        if (campoCEP) {
            campoCEP.addEventListener('input', function(e) {
                e.target.value = formatarCEP(e.target.value);
            });
            
            campoCEP.addEventListener('blur', async function(e) {
                const cep = e.target.value;
                
                if (validarCEP(cep)) {
                    try {
                        const endereco = await buscarEnderecoPorCEP(cep);
                        
                        document.getElementById('rua').value = endereco.rua;
                        document.getElementById('bairro').value = endereco.bairro;
                        document.getElementById('cidade').value = endereco.cidade;
                        document.getElementById('estado').value = endereco.estado;
                    } catch (error) {
                        alert('Erro ao buscar CEP: ' + error.message);
                        
                        document.getElementById('rua').value = '';
                        document.getElementById('bairro').value = '';
                        document.getElementById('cidade').value = '';
                        document.getElementById('estado').value = '';
                    }
                }
            });
        }
        
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(formulario);
            const necessidade = {
                nomeInstituicao: formData.get('nomeInstituicao'),
                tipoAjuda: formData.get('tipoAjuda'),
                titulo: formData.get('titulo'),
                descricao: formData.get('descricao'),
                cep: formData.get('cep'),
                rua: formData.get('rua'),
                bairro: formData.get('bairro'),
                cidade: formData.get('cidade'),
                estado: formData.get('estado'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                dataCadastro: new Date().toISOString()
            };
            
            // Validação dos campos
            let erros = [];
            
            if (!necessidade.nomeInstituicao.trim()) {
                erros.push('Nome da instituição é obrigatório');
            }
            
            if (!necessidade.tipoAjuda) {
                erros.push('Tipo de ajuda é obrigatório');
            }
            
            if (!necessidade.titulo.trim()) {
                erros.push('Título da necessidade é obrigatório');
            }
            
            if (!necessidade.descricao.trim()) {
                erros.push('Descrição é obrigatória');
            }
            
            if (!validarCEP(necessidade.cep)) {
                erros.push('CEP inválido');
            }
            
            if (!necessidade.rua.trim()) {
                erros.push('Endereço deve ser preenchido automaticamente via CEP');
            }
            
            if (!validarEmail(necessidade.email)) {
                erros.push('E-mail inválido');
            }
            
            if (necessidade.telefone && !validarTelefone(necessidade.telefone)) {
                erros.push('Telefone inválido. Use o formato (11) 99999-9999');
            }
            
            // Verifica se há erros
            if (erros.length > 0) {
                alert('Erros encontrados:\n' + erros.join('\n'));
                return;
            }
            
            necessidades.push(necessidade);
        
            salvarNecessidades();
            limparFormulario();
            exibirMensagemSucesso();
        });
    }
});