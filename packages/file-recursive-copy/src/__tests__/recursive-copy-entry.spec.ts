describe('recursive-copy', () => {
  it('Should export a function', async () => {
    const copy = await import('../index.js');
    expect(copy.recursiveCopy).toBeTypeOf('function');
  });
});
