export type MaybePromise<T> = T | Promise<T>;

export const defineConfig = <Options>(
  options:
    | Options
    | Options[]
    | ((
        /** The options derived from CLI flags */
        overrideOptions: Options
      ) => MaybePromise<Options | Options[]>)
) => options;
