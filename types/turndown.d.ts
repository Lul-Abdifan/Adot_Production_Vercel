declare module 'turndown' {
    interface Options {
      headingStyle?: 'setext' | 'atx';
      hr?: string;
      bulletListMarker?: '-' | '*' | '+';
      codeBlockStyle?: 'indented' | 'fenced';
      fence?: string;
      emDelimiter?: '_' | '*';
      strongDelimiter?: '**' | '__';
      linkStyle?: 'inlined' | 'referenced';
      linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
    }
  
    class TurndownService {
      constructor(options?: Options);
      turndown(html: string): string;
    }
  
    export = TurndownService;
  }
  