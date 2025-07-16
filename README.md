# My Tickets
Aplicação de back-end utilizada para a administração de eventos e tickets.

## Rodando os testes

Antes de rodar os testes, certifique-se que o ambiente de teste está configurado corretamente:

1. **Carregar variáveis de ambiente de teste**

O comando `test:load-envs` carrega o arquivo `.env.test` com as variáveis necessárias para o banco de dados de teste.

2. **Executar migrações no banco de teste**

O comando `test:migration:run` aplica as migrações necessárias para preparar o banco de dados para os testes.

3. **Rodar os testes com Jest**

O comando `test` executa os testes com Jest usando as variáveis carregadas do `.env.test`.

---

