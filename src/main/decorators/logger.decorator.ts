export function Logger(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]): Promise<unknown> {
    const startTime = Date.now();
    console.log(`[${propertyKey}] Iniciando...`);

    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - startTime;
      console.log(`[${propertyKey}] Concluído em ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${propertyKey}] Erro após ${duration}ms:`, error);
      throw error;
    }
  };

  return descriptor;
}
