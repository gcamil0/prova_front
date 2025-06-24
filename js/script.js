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