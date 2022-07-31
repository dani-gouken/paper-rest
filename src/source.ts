import fs from "fs/promises";

export interface CodeInterface  {
  getContent(): string;
  getLines(): string[];
};

export class Code implements CodeInterface {
  private lines: string[];
  constructor(private content: string){
    this.lines = this.content.split("\n"); 
  }
  getContent(): string {
    return this.content;
  }
  
  getLines(): string[] {
    return this.lines;
  }
}
export interface SourceInterface {
  getCode(): Promise<CodeInterface>;
}

export class StringSource implements SourceInterface {
  constructor(private code: string) {}
  async getCode(): Promise<CodeInterface> {
    return new Code(this.code);
  }
}

export class FileSource implements SourceInterface {
  constructor(private filePath: string) {}
  async getCode(): Promise<CodeInterface> {
    const buffer = await fs.readFile(this.filePath, {
      encoding: "utf-8",
    });
    return new Code(buffer);
  }
}
