# UnirMãos

Olá! Meu nome é Guilherme e este é o projeto "UnirMãos".

## Visão Geral do Projeto

UnirMãos é uma plataforma web desenvolvida para conectar, de forma eficiente e transparente, instituições sociais (ONGs) a indivíduos e organizações que desejam oferecer apoio. Nosso objetivo é simplificar o processo de captação de voluntários e doações, ampliando o impacto social das causas.

## Funcionalidades Principais

* **Cadastro de Necessidades (Para ONGs)**: Permite que instituições registrem suas demandas por voluntariado ou doações de forma detalhada e intuitiva. O sistema facilita o preenchimento de endereços através da integração com a API de CEP.
* **Visualização e Busca de Oportunidades (Para Voluntários/Doadores)**: Usuários interessados podem explorar as necessidades cadastradas, utilizando filtros por tipo de ajuda e uma barra de pesquisa para encontrar oportunidades alinhadas aos seus interesses.
* **Gestão de Dados Local**: As informações são persistidas localmente no navegador do usuário, ideal para prototipagem e demonstrações.

## Como Acessar e Utilizar

1.  **Página Principal**: Navegue até `home.html` para uma visão geral da plataforma e de seus objetivos.
2.  **Cadastrar uma Necessidade**: Para registrar uma nova demanda, acesse `cadastro.html`. Preencha os campos obrigatórios; o endereço será preenchido automaticamente ao inserir um CEP válido.
3.  **Visualizar Oportunidades**: Em `viewnc.html`, explore as oportunidades de voluntariado e doação. Utilize a barra de pesquisa para termos específicos ou o filtro por tipo para refinar sua busca.

## Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web padrão, visando simplicidade e facilidade de manutenção:

* **HTML**: Estruturação e semântica do conteúdo das páginas.
* **CSS**: Estilização e responsividade da interface do usuário.
* **JavaScript**: Lógica de front-end, incluindo manipulação do DOM, validação de formulários, persistência de dados via `localStorage` e integração com a API ViaCEP para busca de endereços.

## Configuração do Ambiente de Desenvolvimento

Para executar e inspecionar o projeto localmente:

1.  **Clone o Repositório**:
    `git clone https://github.com/gcamil0/prova_front.git`
2.  **Navegue até o Diretório**:
    `cd prova_front`
3.  **Abra os Arquivos**: Simplesmente abra o arquivo `home.html` em seu navegador web preferido. Não há necessidade de servidor web, pois é um projeto front-end puro.

## Contato

Para dúvidas, sugestões ou interesse em colaborar, por favor, entre em contato:

* **Guilherme Camilo da Silva**
* **GitHub**: [https://github.com/gcamil0/prova_front](https://github.com/gcamil0/prova_front)

---

**Nota:** Este projeto é uma demonstração de uma aplicação web simples. Para um ambiente de produção ou corporativo, seriam necessárias camadas adicionais de backend, banco de dados, segurança, autenticação e gerenciamento de usuários.