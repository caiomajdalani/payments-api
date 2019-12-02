<div align="center">
  <a href="https://github.com/posquit0/koa-rest-api-boilerplate" title="Projeto 822 HTTP Patterns">
    <img alt="Projeto 822" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/US_822_%281961%29.svg/1024px-US_822_%281961%29.svg.png" width="240px" />
  </a>
  <br />
  <h1>Projeto 822 - Patterns</h1>
</div>

<p align="center">
  Definições de Padrões de Projeto de APIs do Projeto 822
</p>

---

# Routes Patterns

### PATH

- Padronização de nomes de recursos devem estar sempre no plural

    ```zsh
    # Rota de usuários
    "/v1/users"
    ```

- Padronização de variáveis de chave única para recursos -> `{recurso}Id`

    ```zsh
    Exemplos:

    # Rota de busca de usuário X
    "/v1/users/{userId}"

    # Rota de busca de endereço Y de usuário X
    "/v1/users/{userId}/addresses/{addressId}"

    ...
    ```

### QUERY

- Paginação

    - Paginação via Query
        - Devem ser atributos de query com 2 campos:
            - "pageNumber" -> numero da página a ser buscada
            - "pageSize" -> máximo de registros a serem retornados na página
        - Deve estar sempre disponível em rotas de GETs que retornem mais de 1 registro

### HEADERS

- A definir..

# Verbos Http

- Serão utilizados os verbos abaixo no primeiro momento:

    - GET -> O método GET solicita a representação de um recurso específico. Requisições utilizando o método GET devem retornar apenas dados.
    - POST -> O método POST é utilizado para submeter uma entidade a um recurso específico, frequentemente causando uma mudança no estado do recurso ou efeitos colaterais no servidor.
    - PUT -> O método PUT substitui todas as atuais representações do recurso de destino pela carga de dados da requisição.
    - PATCH -> O método PATCH é utilizado para aplicar modificações parciais em um recurso.
    - DELETE -> O método DELETE remove um recurso específico.
    - OPTIONS -> O método OPTIONS é usado para descrever as opções de comunicação com o recurso de destino.

# Request Patterns

## StatusCode

### Família 200

-  200 (OK) -> Retorno de GETs que tenham conteúdo de retorno.

    ```zsh
    # Request
    curl -X GET "http://localhost:8080/v1/users/1534" -H "Content-Type: application/json"

    # Response Code
    200 - Indica a ação solicitada pelo cliente foi recebida, compreendida, aceita e processada com êxito.

    # Response Body
    {
        "nome": "Caio Majdalani",
        "email": "caio.majdalani@gmail.com",
        ...
    }
    ```

- 201 (Created) -> Retorno de POSTs que criem dados em banco de dados. 

- 202 (Accepted) -> Retorno de PUT/PATCH/DELETE quando os dados de entrada forem aceitos.

- 204 (No Content) -> Retorno de qualquer requisição que não vá retornar dados (Filtros que não tenham match). 

    ```zsh
    # Request
    curl -X GET "http://localhost:8080/v1/users?name=caio&email=caio.majdalani%40gmail.com&cpf=05678945644" -H "Content-Type: application/json"

    # Response Code
    204 - O servidor processou a solicitação com sucesso, mas não é necessário nenhuma resposta.

    # Response Body
    {}
    ```   

- 206 (Partial Content) -> Utilizado para retorno de GETs com filtros que tenham conteúdo para retornar.

    ```zsh
    # Request
    curl -X GET "http://localhost:8080/v1/users?pageNumber=2&pageSize=10" -H "Content-Type: application/json"

    # Response Code
    206 - O servidor está entregando apenas parte do recurso devido a um cabeçalho intervalo enviados pelo cliente.

    # Response Body
    {
        "page": {
            "size": 10,
            "totalElements": 100,
            "totalPages": 5,
            "number": 2
        }
        "items": [
            {
                ...
            },
            {
                ...
            },
            ...
        ]
    }
    ```  

### Família 400

- 400 (Bad Request) -> Requisição com parâmetros de entrada inválidos.

    ```zsh
    # Request
    curl -X POST "http://localhost:8080/v1/users" -H "Content-Type: application/json"
    {
        "nome": "Caio Majdalani",
        "email": "123",
        ...
    }

    # Response Code
    400 - O pedido não pôde ser entregue devido à sintaxe incorreta.

    # Response Body
    {
        "code": 005,
        "message": "Email inválido."
    }
    ```

- 401 (Unauthorized) -> Requisição não autorizada. Será utilizado quando for implementado nossa camada de OAuth.

- 403 (Forbidden) -> O pedido é reconhecido pelo servidor mas este recusa-se a executá-lo. Ao contrário resposta "401 Não Autorizado", autenticação não fará diferença e o pedido não deve ser requisitado novamente.

- 404 (Not Found) -> O recurso requisitado não foi encontrado. 

    ```zsh
    # Request
    curl -X GET "http://localhost:8080/v1/userssss" -H "Content-Type: application/json"

    # Response Code
    404 - O recurso requisitado não foi encontrado, mas pode ser disponibilizado novamente no futuro. As solicitações subsequentes pelo cliente são permitidas.

    # Response Body
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Error</title>
        </head>
        <body>
            <pre>Cannot GET /v1/userssss</pre>
        </body>
    </html>
    ```

- 409 (Conflict) -> Retorno para erros de negócio.

    ```zsh
    # Request
    curl -X POST "http://localhost:8080/v1/users" -H "Content-Type: application/json"

    # Request Body
    {
        "nome": "Caio Majdalani",
        "email": "caio.majdalani@gmail.com",
        ...
    }

    # Response Code
    409 - Indica que a solicitação não pôde ser processada por causa do conflito no pedido.

    # Response Body
    {
        "code": 010,
        "message": "Este email já existe para um usuário."
    }
    ```

- 422 (Unprocessable Entity) -> Retorno para dados aceitos pelo servidor, porém com alguma inconsistência para persistir os dados. 

### Família 500

- 500 (Internal Server Error) -> Retorno para erros não mapeados e/ou tratados pelo servidor. 
    
    ```zsh
    Pode ser utilizado quando o banco de dados chegou ao seu limite de pools de conexão 
    e a exceção não foi tratada pelo micro serviço.
    ``` 

- 502 (Bad Gateway) -> Retorno para falha de comunicação entre micro serviços ou outros softwares. 
    
    ```zsh
    Pode ser utilizado quando o software não responde ao tempo máximo 
    estabelecido pelo framework de Load Balance.
    ```

# Response Patterns

- GET /v1/users/{userId} -> Retorna um objeto com o usuário buscado

    ```zsh
    # Request
    curl -X GET "http://localhost:8080/v1/users/1534" -H "Content-Type: application/json"

    # Response Body
    {
        "nome": "Caio Majdalani",
        "email": "caio.majdalani@gmail.com",
        ...
    }
    ```

- GET /v1/users?querystring.. -> Retorna um objeto com um objeto filho de paginação chamado "page" e um objeto filho que retorna um array de registros que estão dentro dos match de filtros chamado "items". 

    - Paginação
        - Deve ser um objeto chamado "page" que inclue 4 campos:
            - "size" -> tamanho da página exibida (vinculado ao "pageSize" do request)
            - "totalElements" -> total de registros encontrados baseados no filtro
            - "totalPages" -> total de paginas encontradas baseados no filtro
            - "number" -> número da página exibida (vinculado ao "pageNumber" do request)

    ```zsh
    # Request 
    curl -X GET "http://localhost:8080/v1/users?nome=caio&pageNumber=2&pageSize=10" -H "Content-Type: application/json"

    # Response 
    {
        "page": {
            "size": 10,
            "totalElements": 100,
            "totalPages": 5,
            "number": 2
        },
        "items": [
            {
                ...
            },
            {
                ...
            },
            ...
        ]
    }
    ```

- POST /v1/users -> Deve retornar o "id" do recurso criado e os dados inseridos mapeados.

    ```zsh
    # Request
    curl -X POST "http://localhost:8080/v1/users" -H "Content-Type: application/json"
    {
        "nome": "Caio Majdalani",
        "email": "caio.majdalani@gmail.com",
        "senha": "abcde"
    }

    # Response Code
    201

    # Response Body
    {
        "id": `{a definir formatação}`,
        "nome": "Caio Majdalani",
        "email": "caio.majdalani@gmail.com"
    }

    OBS: Não retornar dados sensíveis.
    ```

- PUT /v1/users/{userId} -> Segue o mesmo padrão do POST

- PATCH /v1/users/{userId} -> Deve retornar APENAS o "id" do recurso e o dado que foi modificado.

    ```zsh
    # Request
    curl -X PATCH "http://localhost:8080/v1/users/1234" -H "Content-Type: application/json"
    {
        "nome": "Caio Majdalani"
    }

    # Response Code
    202

    # Response Body
    {
        "id": `{a definir formatação}`,
        "nome": "Caio Majdalani"
    }

    OBS: Não retornar dados sensíveis.
    ```

- DELETE /v1/users/{userId} -> Deve retornar apenas a confirmação. Sem corpo de retorno. 

    - OBS: Lembrando que, devemos criar apenas remoção lógica. Não devemos apagar nenhum registro. 
        
    ```zsh
    # Request
    curl -X DELETE "http://localhost:8080/v1/users/1234" -H "Content-Type: application/json"

    # Response Code
    202

    # Response Body
    {}
    ```

    - A nível de persistência (banco de dados), devemos usar um tipo de flag ("true" e "false") para validar o recurso como ativo ou inativo. (Ainda a definir, baseado no tipo de banco)

# Swagger

## Resources Groups

- Se houver mais de um recurso por micro-serviço, devem ser separados na documentação

<div align="left">
  <a title="Projeto 822 HTTP Patterns">
    <img alt="Projeto 822" src="http://imagizer.imageshack.us/a/img922/6501/gWudkr.png"/>
  </a>
  <br/>
</div>

## Schemas/Models Patterns

- O nome da model deve fazer menção à operação e ao recurso.
- Deve ser mostrado quais propriedades são obrigatórias.
- Deve haver uma breve descrição de cada propriedade do objeto do schema.

<div align="center">
  <a title="Projeto 822 HTTP Patterns">
    <img alt="Projeto 822" src="https://imageshack.com/a/img923/2893/s3xQzY.png"/>
  </a>
  <br/>
</div>




