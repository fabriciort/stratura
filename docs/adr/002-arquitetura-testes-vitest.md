# ADR-002: Arquitetura de Testes com Vitest

## Status
Aprovado - 28/01/2025

## Contexto
A aplicação carece de uma estratégia de testes consistente:
- 0% de cobertura de testes automatizados
- Dificuldade em validar fluxos complexos de UI
- Lentidão no feedback durante o desenvolvimento
- Falta de padrões para mocks de API

## Decisão
Implementar pipeline de testes com:
- **Vitest** para execução rápida em Vite
- **Testing Library** para testes de integração
- **MSW** para mock de APIs
- **Cypress** para testes E2E (futura fase)

## Estratégia de Implementação
1. Testes Unitários:
   - Lógica de negócio pura
   - Utilitários e helpers

2. Testes de Integração:
   - Componentes com interações complexas
   - Fluxos entre múltiplos componentes

3. Testes E2E (Fase 2):
   - Fluxos críticos de negócio
   - Testes cross-browser

```typescript
// Exemplo de teste para EscalasList
test('exibe loading e dados da API', async () => {
  server.use(
    rest.get('/api/escalas', (req, res, ctx) => {
      return res(
        ctx.delay(150),
        ctx.json([...])
      )
    })
  )

  render(<EscalasList />)
  
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  
  await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
  
  expect(screen.getAllByRole('row')).toHaveLength(5)
})
```

## Métricas de Sucesso
- 80% cobertura em componentes críticos
- Tempo de execução < 30s para suite unitária
- Redução de 40% em bugs reportados

## Riscos Mitigados
- Falsos positivos: Review manual inicial
- Manutenção custosa: Pattern de page objects
- Performance: Execução paralela e caching

## Cronograma
```mermaid
gantt
  title Cronograma de Implementação
  section Fase 1
  Configuração Ambiente :done, 2025-02-01, 3d
  Testes Core Components :active, 2025-02-05, 10d
  section Fase 2
  Integração CI/CD :2025-02-15, 5d
  Monitoramento Coverage :2025-02-20, 3d