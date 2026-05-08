# Leve Saúde - Agenda Médica API

API REST para agendamento de consultas médicas com triagem inteligente por IA.

## 🚀 Características

- ✅ **Endpoints REST** com AWS Lambda
- ✅ **Triagem de Pacientes** com IA (Mock, OpenAI ou Anthropic)
- ✅ **Validação de Dados** com Zod
- ✅ **Clean Architecture** com SOLID principles
- ✅ **Testes Unitários e de Integração** com Jest (42 testes)
- ✅ **TypeScript** com tipagem explícita
- ✅ **Logging e Tratamento de Erros** com Higher-Order Functions
- ✅ **Variáveis de Ambiente** com dotenv

## 📋 Requisitos

- Node.js 20+
- npm ou yarn
- (Opcional) Chave de API OpenAI ou Anthropic

## 🔧 Instalação

```bash
# Clonar repositório
git clone git@github.com:Brenod3v/teste-tecnico-leve-saude.git
cd teste-tecnico-leve-saude

# Instalar dependências
npm install

# Copiar arquivo de configuração
cp .env.example .env
```

**Nota:** Se receber erro de dependência durante `npm install`, use:
```bash
npm install --legacy-peer-deps
```

## 🏃 Executar Localmente

### Com Mock (padrão, sem API key necessária)

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

> **Nota:** O Serverless Framework adiciona automaticamente o stage (`/dev`) às rotas. As URLs reais serão `http://localhost:3000/dev/api/v1/...`

### Com OpenAI

1. Obter chave de API em https://platform.openai.com/api-keys
2. Atualizar `.env`:
```env
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-3.5-turbo
```
3. Executar:
```bash
npm run dev
```

### Com Anthropic

1. Obter chave de API em https://console.anthropic.com/
2. Atualizar `.env`:
```env
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...
AI_MODEL=claude-3-haiku-20240307
```
3. Executar:
```bash
npm run dev
```

## 📡 Endpoints

### GET /api/v1/agendas
Lista todos os médicos com horários disponíveis.

```bash
curl http://localhost:3000/dev/api/v1/agendas
```

**Resposta (200):**
```json
{
  "medicos": [
    {
      "id": "1",
      "nome": "Dr. João Silva",
      "especialidade": "Cardiologista",
      "horarios_disponiveis": ["2026-06-10 09:00", "2026-06-10 10:00"]
    }
  ]
}
```

### POST /api/v1/agendamento
Cria um novo agendamento de consulta.

```bash
curl -X POST http://localhost:3000/dev/api/v1/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "agendamento": {
      "medico_id": "1",
      "paciente": "João Silva",
      "data_horario": "2026-06-10 09:00"
    }
  }'
```

**Resposta (201):**
```json
{
  "mensagem": "Agendamento realizado com sucesso",
  "agendamento": {
    "id": "uuid-gerado",
    "medico": "Dr. João Silva",
    "paciente": "João Silva",
    "data_horario": "2026-06-10 09:00"
  }
}
```

**Erros:**
- `400`: Validação falhou
- `404`: Médico não encontrado
- `409`: Horário indisponível

### POST /api/v1/triagem
Analisa sintomas e sugere especialidade médica.

```bash
curl -X POST http://localhost:3000/dev/api/v1/triagem \
  -H "Content-Type: application/json" \
  -d '{"sintomas": "Tenho dor no peito e palpitações"}'
```

**Resposta (200):**
```json
{
  "especialidadeSugerida": "Cardiologia",
  "confianca": 0.95,
  "justificativa": "Detectados sintomas relacionados a Cardiologia: coração, peito, palpitação."
}
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm test -- --coverage

# Executar em modo watch
npm test -- --watch
```

**Cobertura:**
- 42 testes passando
- 10 suites de testes
- Testes unitários e de integração

## 🏗️ Arquitetura

```
src/
├── application/          # Lógica de negócio
│   ├── errors/          # Erros tipados
│   └── use-cases/       # Casos de uso
├── domain/              # Entidades e interfaces
│   ├── entities/        # Modelos de domínio
│   ├── repositories/    # Interfaces de repositório
│   └── services/        # Interfaces de serviço
├── infra/               # Implementações
│   ├── ai/              # Serviços de IA
│   └── persistence/     # Repositórios
├── main/                # Camada de apresentação
│   ├── factories/       # Factory pattern
│   ├── handlers/        # Handlers Lambda com logging e tratamento de erros
│   └── types.ts         # Tipos HTTP
└── config/              # Configuração
```

## 🔐 Variáveis de Ambiente

Veja `.env.example` para todas as opções disponíveis.

```env
# Provider de IA: 'mock', 'openai', 'anthropic'
AI_PROVIDER=mock

# OpenAI (opcional)
AI_API_KEY=sk-...
AI_MODEL=gpt-3.5-turbo

# Anthropic (opcional)
AI_API_KEY=sk-ant-...
AI_MODEL=claude-3-haiku-20240307
```

## 📦 Deploy

### Deploy para AWS

```bash
# Build
npm run build

# Deploy (requer AWS credentials configuradas)
serverless deploy
```

### Variáveis de Ambiente em Produção

Configure as variáveis de ambiente no AWS Lambda:

```bash
serverless deploy --param="aiProvider=openai" --param="aiApiKey=sk-..."
```

## 🛠️ Desenvolvimento

### Logging e Tratamento de Erros

Os handlers usam **Higher-Order Functions** para logging e tratamento de erros:

```typescript
// src/main/handlers/handler-service.ts
export const listarAgendasHandler = withLogging(
  'ListarAgendas',
  withErrorHandling(handleListarAgendas),
);
```

**Funcionalidades:**
- Logs de início e fim com tempo de execução
- Tratamento automático de erros (Zod, AppError, genéricos)
- Respostas HTTP formatadas

### Lint

```bash
npm run lint
npm run lint:fix
```

### Formatação

```bash
npm run format
```

## 📚 Tecnologias

- **Runtime:** Node.js 20
- **Framework:** AWS Lambda + Serverless Framework
- **Linguagem:** TypeScript
- **Validação:** Zod
- **Testes:** Jest
- **IA:** OpenAI / Anthropic (opcional)
- **Ambiente:** dotenv

## 🎯 Princípios Aplicados

- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **SOLID Principles** - Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- ✅ **Dependency Injection** - Injeção de dependências via factory
- ✅ **Error Handling** - Erros tipados e tratamento explícito
- ✅ **Type Safety** - TypeScript com tipagem explícita, sem `any`

