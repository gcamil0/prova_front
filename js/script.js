'use strict';

//armazena as necessidades
let necessidades = [];

//carrega necessidades do localStorage
function carregarNecessidades() {
    const necessidadesStorage = localStorage.getItem('necessidades');
    if (necessidadesStorage) {
        necessidades = JSON.parse(necessidadesStorage);
    } else {
        necessidades = []; // Garante que 'necessidades' é um array vazio se não houver nada no localStorage
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

// --- FUNÇÕES DE CEP ATUALIZADAS E MELHORADAS ---
const eNumero = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length == 8 && eNumero(cep); // Usada para validar o formato numérico/tamanho

// Nova função para validar CEP (formato 00000-000 ou 00000000)
function validarCEP(cep) {
    // Remove qualquer coisa que não seja dígito para validação
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8 && eNumero(cepLimpo);
}

// Função para formatar o CEP (adiciona o hífen)
function formatarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cepLimpo.length > 5) {
        return cepLimpo.substring(0, 5) + '-' + cepLimpo.substring(5, 8);
    }
    return cepLimpo;
}

// Função para buscar endereço por CEP na API ViaCEP
const buscarEnderecoPorCEP = async (cep) => {
    limparCamposEndereco(); // Limpa antes de buscar para evitar dados antigos
    const cepLimpo = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    if (validarCEP(cepLimpo)) { // Usa a nova função validarCEP
        const dados = await fetch(url);
        const address = await dados.json();

        if (address.hasOwnProperty('erro')) {
            throw new Error("CEP não encontrado."); // Lança um erro para ser pego pelo catch
        } else {
            return {
                rua: address.logradouro,
                bairro: address.bairro,
                cidade: address.localidade,
                estado: address.uf
            };
        }
    } else {
        throw new Error("CEP inválido."); // Lança um erro se o CEP não for válido
    }
}

// Função para limpar os campos de endereço preenchidos pelo CEP
const limparCamposEndereco = () => {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

// Função para exibir mensagem de sucesso
function exibirMensagemSucesso() {
    const mensagem = document.getElementById('mensagemSucesso');
    if (mensagem) { // Garante que a mensagem existe na página atual
        mensagem.style.display = 'block';
        mensagem.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            mensagem.style.display = 'none';
        }, 4000);
    }
}

// Função para criar card de necessidade
function criarCardNecessidade(necessidade) {
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
            <span class="data-cadastro">Cadastrado em: ${new Date(necessidade.dataCadastro).toLocaleDateString('pt-BR')}</span>
        </div>
    `;
}

// Função para exibir necessidades na página viewnc.html
function exibirNecessidades(necessidadesParaExibir = necessidades) {
    const listaNecessidades = document.getElementById('listaNecessidades');
    const mensagemVazia = document.getElementById('mensagemVazia');

    if (!listaNecessidades) return; // Retorna se não estiver na página viewnc.html

    if (necessidadesParaExibir.length === 0) {
        listaNecessidades.innerHTML = ''; // Limpa qualquer card existente
        mensagemVazia.style.display = 'block';
    } else {
        mensagemVazia.style.display = 'none';
        listaNecessidades.innerHTML = necessidadesParaExibir
            .map(necessidade => criarCardNecessidade(necessidade))
            .join('');
    }
}

// Função para pesquisar e filtrar necessidades
function pesquisarNecessidades() {
    const campoPesquisa = document.getElementById('campoPesquisa');
    const filtroTipo = document.getElementById('filtroTipo');

    // Garante que estamos na página com esses elementos
    if (!campoPesquisa || !filtroTipo) return;

    const termoPesquisa = campoPesquisa.value.toLowerCase();
    const tipoSelecionado = filtroTipo.value;

    let necessidadesFiltradas = necessidades.filter(necessidade => {
        const correspondePesquisa = !termoPesquisa ||
                                   necessidade.titulo.toLowerCase().includes(termoPesquisa) ||
                                   necessidade.descricao.toLowerCase().includes(termoPesquisa) ||
                                   necessidade.nomeInstituicao.toLowerCase().includes(termoPesquisa);

        const correspondeTipo = !tipoSelecionado || necessidade.tipoAjuda === tipoSelecionado;

        return correspondePesquisa && correspondeTipo;
    });

    exibirNecessidades(necessidadesFiltradas);
}

// Função para limpar TODO o formulário de cadastro (incluindo campos não de endereço)
function limparFormulario() {
    const formulario = document.getElementById('necessidadeForm');
    if (formulario) {
        formulario.reset();
        // Opcional: esconder mensagens de erro após limpar
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.classList.remove('invalid'));
    }
}

// === Event Listeners para quando o DOM estiver completamente carregado ===
document.addEventListener('DOMContentLoaded', function() {
    carregarNecessidades(); // Sempre tenta carregar as necessidades ao carregar qualquer página

    // Lógica específica para a página 'viewnc.html'
    if (window.location.pathname.includes('viewnc.html')) {
        exibirNecessidades(); // Exibe as necessidades assim que a página é carregada

        // Configura event listeners para os campos de pesquisa e filtro
        const campoPesquisa = document.getElementById('campoPesquisa');
        if (campoPesquisa) {
            campoPesquisa.addEventListener('input', pesquisarNecessidades);
        }

        const filtroTipo = document.getElementById('filtroTipo');
        if (filtroTipo) {
            filtroTipo.addEventListener('change', pesquisarNecessidades); // Chama pesquisarNecessidades que já filtra por tipo
        }
    }

    // Lógica específica para a página 'cadastro.html'
    const formulario = document.getElementById('necessidadeForm');
    if (formulario) {
        const campoCEP = document.getElementById('cep');
        if (campoCEP) {
            campoCEP.addEventListener('input', function(e) {
                e.target.value = formatarCEP(e.target.value);
            });

            campoCEP.addEventListener('blur', async function(e) {
                const cepValue = e.target.value;
                try {
                    const endereco = await buscarEnderecoPorCEP(cepValue);
                    document.getElementById('rua').value = endereco.rua;
                    document.getElementById('bairro').value = endereco.bairro;
                    document.getElementById('cidade').value = endereco.cidade;
                    document.getElementById('estado').value = endereco.estado;
                } catch (error) {
                    alert('Erro ao buscar CEP: ' + error.message);
                    limparCamposEndereco(); // Limpa se der erro
                }
            });
        }

        // Listener para o botão de limpar formulário
        const btnLimpar = document.querySelector('.btn-secondary[onclick="limparFormulario()"]');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', limparFormulario);
        }

        // Listener para o envio do formulário de cadastro
        formulario.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão

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

            let erros = [];

            // Validações (mantidas do seu código original)
            if (!necessidade.nomeInstituicao.trim()) {
                erros.push('Nome da instituição é obrigatório');
                document.getElementById('nomeInstituicao').classList.add('invalid');
                document.getElementById('errorNomeInstituicao').textContent = 'O nome da instituição é obrigatório.';
                document.getElementById('errorNomeInstituicao').style.display = 'block';
            } else {
                document.getElementById('nomeInstituicao').classList.remove('invalid');
                document.getElementById('errorNomeInstituicao').style.display = 'none';
            }

            if (!necessidade.tipoAjuda) {
                erros.push('Tipo de ajuda é obrigatório');
                document.getElementById('tipoAjuda').classList.add('invalid');
                document.getElementById('errorTipoAjuda').textContent = 'Selecione um tipo de ajuda.';
                document.getElementById('errorTipoAjuda').style.display = 'block';
            } else {
                document.getElementById('tipoAjuda').classList.remove('invalid');
                document.getElementById('errorTipoAjuda').style.display = 'none';
            }

            if (!necessidade.titulo.trim()) {
                erros.push('Título da necessidade é obrigatório');
                document.getElementById('titulo').classList.add('invalid');
                document.getElementById('errorTitulo').textContent = 'O título da necessidade é obrigatório.';
                document.getElementById('errorTitulo').style.display = 'block';
            } else {
                document.getElementById('titulo').classList.remove('invalid');
                document.getElementById('errorTitulo').style.display = 'none';
            }

            if (!necessidade.descricao.trim()) {
                erros.push('Descrição é obrigatória');
                document.getElementById('descricao').classList.add('invalid');
                document.getElementById('errorDescricao').textContent = 'A descrição detalhada é obrigatória.';
                document.getElementById('errorDescricao').style.display = 'block';
            } else {
                document.getElementById('descricao').classList.remove('invalid');
                document.getElementById('errorDescricao').style.display = 'none';
            }

            // Validação do CEP usando a nova função
            if (!validarCEP(necessidade.cep)) {
                erros.push('CEP inválido');
                document.getElementById('cep').classList.add('invalid');
                document.getElementById('errorCep').textContent = 'CEP inválido. Formato esperado: 00000-000 ou 00000000.';
                document.getElementById('errorCep').style.display = 'block';
            } else {
                document.getElementById('cep').classList.remove('invalid');
                document.getElementById('errorCep').style.display = 'none';
            }

            // Campos de endereço (rua, bairro, cidade, estado) são preenchidos pelo CEP, então só verifica se não estão vazios após o preenchimento automático
            if (!necessidade.rua.trim()) {
                erros.push('Rua deve ser preenchida automaticamente via CEP');
                document.getElementById('rua').classList.add('invalid');
                document.getElementById('errorRua').textContent = 'Este campo é preenchido automaticamente ao inserir o CEP.';
                document.getElementById('errorRua').style.display = 'block';
            } else {
                document.getElementById('rua').classList.remove('invalid');
                document.getElementById('errorRua').style.display = 'none';
            }
            if (!necessidade.bairro.trim()) {
                erros.push('Bairro deve ser preenchido automaticamente via CEP');
                document.getElementById('bairro').classList.add('invalid');
                document.getElementById('errorBairro').textContent = 'Este campo é preenchido automaticamente ao inserir o CEP.';
                document.getElementById('errorBairro').style.display = 'block';
            } else {
                document.getElementById('bairro').classList.remove('invalid');
                document.getElementById('errorBairro').style.display = 'none';
            }
            if (!necessidade.cidade.trim()) {
                erros.push('Cidade deve ser preenchida automaticamente via CEP');
                document.getElementById('cidade').classList.add('invalid');
                document.getElementById('errorCidade').textContent = 'Este campo é preenchido automaticamente ao inserir o CEP.';
                document.getElementById('errorCidade').style.display = 'block';
            } else {
                document.getElementById('cidade').classList.remove('invalid');
                document.getElementById('errorCidade').style.display = 'none';
            }
            if (!necessidade.estado.trim()) {
                erros.push('Estado deve ser preenchido automaticamente via CEP');
                document.getElementById('estado').classList.add('invalid');
                document.getElementById('errorEstado').textContent = 'Este campo é preenchido automaticamente ao inserir o CEP.';
                document.getElementById('errorEstado').style.display = 'block';
            } else {
                document.getElementById('estado').classList.remove('invalid');
                document.getElementById('errorEstado').style.display = 'none';
            }

            if (!validarEmail(necessidade.email)) {
                erros.push('E-mail inválido');
                document.getElementById('email').classList.add('invalid');
                document.getElementById('errorEmail').textContent = 'Por favor, insira um e-mail válido.';
                document.getElementById('errorEmail').style.display = 'block';
            } else {
                document.getElementById('email').classList.remove('invalid');
                document.getElementById('errorEmail').style.display = 'none';
            }

            if (necessidade.telefone && !validarTelefone(necessidade.telefone)) {
                erros.push('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
                document.getElementById('telefone').classList.add('invalid');
                document.getElementById('errorTelefone').textContent = 'Telefone inválido. Use o formato (XX) XXXXX-XXXX.';
                document.getElementById('errorTelefone').style.display = 'block';
            } else {
                document.getElementById('telefone').classList.remove('invalid');
                document.getElementById('errorTelefone').style.display = 'none';
            }

            // Se houver erros, para a execução e as mensagens de erro já estão visíveis
            if (erros.length > 0) {
                return;
            }

            // Se não há erros, salva a necessidade
            necessidades.push(necessidade);
            salvarNecessidades();

            // Limpa o formulário e exibe mensagem de sucesso
            formulario.reset();
            // A linha abaixo foi removida pois formulario.reset() já limpa tudo, incluindo campos de endereço
            // limparCamposEndereco();
            exibirMensagemSucesso();
        });
    }
});