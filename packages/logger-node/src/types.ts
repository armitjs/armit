export interface CustomizedStdWriteStream {
  stderr?: {
    write: (data: string) => void;
  };
  stdout?: {
    write: (data: string) => void;
  };
}
