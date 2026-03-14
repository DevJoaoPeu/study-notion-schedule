# Middleware, Guards & Interceptors Study

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Um projeto educacional para estudar e praticar os conceitos de **Middleware**, **Guards** e **Interceptors** no NestJS.

## 📋 Objetivo do Projeto

Este projeto é um estudo prático sobre os componentes essenciais de uma aplicação NestJS:

- **Middleware**: Processamento de requisições antes de chegarem ao controller
- **Guards**: Controle de acesso e autenticação
- **Interceptors**: Transformação e logging de requisições e respostas

É uma aplicação de aprendizado que demonstra como esses três componentes trabalham juntos no ciclo de vida de uma requisição HTTP.

---

## 🏗️ Arquitetura

### Fluxo de uma Requisição

```
Cliente (HTTP Request)
    ↓
Middleware (LoggerMiddleware) → Registra entrada
    ↓
Guard (AuthGuard) → Valida autorização
    ↓
Interceptor (LogInterceptor) → Inicia logging
    ↓
Controller (AppController)
    ↓
Service (AppService)
    ↓
Interceptor (LogInterceptor) → Finaliza logging e calcula tempo
    ↓
Cliente (HTTP Response)
```

### Estrutura de Diretórios

```
src/
├── main.ts                          # Entrada da aplicação
├── app.module.ts                    # Módulo raiz
├── app.controller.ts                # Controller principal
├── app.service.ts                   # Service com lógica de negócio
├── middlewares/
│   └── logger.middleware.ts         # Middleware de logging
├── guards/
│   └── auth.guard.ts               # Guard de autenticação
└── interceptor/
    └── log.interceptor.ts           # Interceptor de logging
```

### Componentes Principais

#### 1. **Middleware** (`src/middlewares/logger.middleware.ts`)
- Executa antes do Guard
- Tem acesso à requisição original do Express
- Usado para logging, parsing de dados, etc.
- Neste projeto: Registra "Passou no middle"

#### 2. **Guard** (`src/guards/auth.guard.ts`)
- Determina se a requisição deve ser processada
- Implementa `CanActivate`
- Pode fazer validações, autenticação, autorização
- Neste projeto: Sempre retorna `true` (permitindo acesso)

#### 3. **Interceptor** (`src/interceptor/log.interceptor.ts`)
- Wrappa o handler da rota
- Tem acesso à requisição e resposta
- Implementa `NestInterceptor`
- Neste projeto: Calcula tempo de execução do request

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 16
- **Yarn** (ou npm)

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd study-notion-schedule
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Inicie a aplicação**
```bash
yarn start:dev
```

A aplicação estará disponível em `http://localhost:3000`

---

## 📝 Como Usar

### Fazer uma Requisição

```bash
curl http://localhost:3000/hello
```

**Resposta esperada:**
```
Hello World!
```

### Observar o Fluxo nos Logs

Ao fazer a requisição, você verá no console:

```
passou no middle
passou no guard
date now 0 ms
entrou no service
date now 1 ms
```

Isso demonstra a ordem de execução:
1. Middleware executa primeiro
2. Depois o Guard
3. Depois o Interceptor (antes do handler)
4. Service executa
5. Interceptor finaliza (depois do handler)

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `yarn start` | Inicia em modo produção |
| `yarn start:dev` | Inicia em modo desenvolvimento (com watch) |
| `yarn start:debug` | Inicia com debug (port 9229) |
| `yarn build` | Compila o projeto TypeScript |
| `yarn test` | Executa testes unitários |
| `yarn test:watch` | Executa testes em modo watch |
| `yarn test:cov` | Executa testes com cobertura |
| `yarn test:e2e` | Executa testes e2e |
| `yarn lint` | Executa ESLint com fix automático |
| `yarn format` | Formata código com Prettier |

---

## 📚 Entendendo os Componentes

### Middleware
```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Passou no middle');
    next(); // Continua para o próximo middleware/guard
  }
}
```

**Quando usar:**
- Logging de requisições
- Parsing de corpos de requisição
- Manipulação de headers

### Guard
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('passou no guard');
    return true; // true = permitir, false = bloquear
  }
}
```

**Quando usar:**
- Autenticação
- Autorização baseada em roles
- Validação de permissões

### Interceptor
```typescript
@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    console.log(`date now ${Date.now() - now} ms`);

    return next.handle().pipe(
      tap(() => console.log(`date now ${Date.now() - now} ms`))
    );
  }
}
```

**Quando usar:**
- Logging de requisições/respostas
- Transformação de dados
- Tratamento de erros
- Cálculo de performance

---

## 🔍 Aplicação na Rota

A rota `/hello` está configurada para usar todos os componentes:

```typescript
@Controller()
@UseGuards(AuthGuard)              // Guard aplicado
@UseInterceptors(LogInterceptor)   // Interceptor aplicado
export class AppController {
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
```

E o middleware está configurado no módulo:

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'hello', method: RequestMethod.GET });
  }
}
```

---

## 🧪 Testando

### Executar testes unitários
```bash
yarn test
```

### Executar testes com cobertura
```bash
yarn test:cov
```

### Executar testes e2e
```bash
yarn test:e2e
```

---

## 📖 Recursos Úteis

- [NestJS Documentation - Middleware](https://docs.nestjs.com/middleware)
- [NestJS Documentation - Guards](https://docs.nestjs.com/guards)
- [NestJS Documentation - Interceptors](https://docs.nestjs.com/interceptors)
- [Express Middleware Documentation](https://expressjs.com/en/guide/using-middleware.html)

---

## 📄 Licença

MIT

---

## 💡 Próximos Passos

Para aprofundar seu aprendizado, você pode:

1. Implementar autenticação real no `AuthGuard`
2. Adicionar tratamento de erros no `LogInterceptor`
3. Criar um middleware de validação de CORS
4. Implementar rate limiting com Guards
5. Adicionar mais rotas para testar diferentes cenários
