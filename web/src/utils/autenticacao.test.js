import { renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useAutenticacao } from './autenticacao.js'

test('useAutenticacao lança erro claro quando usado fora do ProvedorAutenticacao', () => {
  expect(() => renderHook(() => useAutenticacao())).toThrowError(
    'useAutenticacao deve ser usado dentro de ProvedorAutenticacao',
  )
})
