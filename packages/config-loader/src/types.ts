export interface ConfigBundler {
  bundle(fileName: string): Promise<{ code: string }>;
}
