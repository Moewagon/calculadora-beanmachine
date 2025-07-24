const { calcularTotal } = require('./productos');

describe('calcularTotal', () => {
  test('calculates total without discount', () => {
    const items = [
      { precio: 10, cantidad: 2 },
      { precio: 5, cantidad: 1 }
    ];
    expect(calcularTotal(items)).toBeCloseTo(25);
  });

  test('calculates total with discount', () => {
    const items = [
      { precio: 10, cantidad: 2 },
      { precio: 5, cantidad: 1 }
    ];
    expect(calcularTotal(items, 10)).toBeCloseTo(22.5);
  });
});
