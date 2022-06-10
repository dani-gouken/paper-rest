import fs from "fs/promises";

export type Code = {
  content: string;
};
export interface SourceInterface {
  getCode(): Promise<Code>;
}

export class StringSource implements SourceInterface {
  constructor(private code: string) {}
  async getCode(): Promise<Code> {
    return {
      content: this.code,
    };
  }
}

export class FileSource implements SourceInterface {
  constructor(private filePath: string) {}
  async getCode(): Promise<Code> {
    const buffer = await fs.readFile(this.filePath, {
      encoding: "utf-8",
    });
    return {
      content: buffer,
    };
  }
}
