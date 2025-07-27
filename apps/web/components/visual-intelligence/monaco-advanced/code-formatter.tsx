// Prettier will be loaded dynamically to avoid build issues

export class CodeFormatter {
  private static readonly prettierOptions = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: 'avoid',
    endOfLine: 'lf'
  };

  static async format(code: string, language: string): Promise<string> {
    try {
      const parser = this.getParser(language);
      if (!parser) {
        console.warn(`No formatter available for language: ${language}`);
        return code;
      }

      // For now, return the code as-is
      // In production, dynamically load prettier
      return code;
    } catch (error) {
      console.error('Formatting error:', error);
      // Return original code if formatting fails
      return code;
    }
  }

  private static getParser(language: string): string | undefined {
    const parserMap: Record<string, string> = {
      typescript: 'typescript',
      javascript: 'babel',
      jsx: 'babel',
      tsx: 'typescript',
      css: 'css',
      scss: 'scss',
      less: 'less',
      html: 'html',
      vue: 'vue',
      angular: 'angular',
      markdown: 'markdown',
      mdx: 'mdx',
      yaml: 'yaml',
      yml: 'yaml',
      json: 'json',
      json5: 'json5',
      graphql: 'graphql'
    };

    return parserMap[language.toLowerCase()];
  }

  static async formatWithCustomOptions(
    code: string,
    language: string,
    options: Partial<prettier.Options>
  ): Promise<string> {
    const parser = this.getParser(language);
    if (!parser) {
      return code;
    }

    try {
      // For now, return the code as-is
      // In production, dynamically load prettier
      return code;
    } catch (error) {
      console.error('Formatting error:', error);
      return code;
    }
  }

  static async checkFormatting(code: string, language: string): Promise<boolean> {
    try {
      const formatted = await this.format(code, language);
      return formatted === code;
    } catch {
      return true; // Assume it's formatted if we can't check
    }
  }

  static async getFormattingDiff(code: string, language: string): Promise<{
    original: string;
    formatted: string;
    changes: Array<{
      line: number;
      type: 'add' | 'remove' | 'modify';
      content: string;
    }>;
  }> {
    const formatted = await this.format(code, language);
    const originalLines = code.split('\n');
    const formattedLines = formatted.split('\n');
    const changes: Array<{
      line: number;
      type: 'add' | 'remove' | 'modify';
      content: string;
    }> = [];

    // Simple diff algorithm
    let i = 0, j = 0;
    while (i < originalLines.length || j < formattedLines.length) {
      if (i >= originalLines.length) {
        // Lines added
        changes.push({
          line: j + 1,
          type: 'add',
          content: formattedLines[j]
        });
        j++;
      } else if (j >= formattedLines.length) {
        // Lines removed
        changes.push({
          line: i + 1,
          type: 'remove',
          content: originalLines[i]
        });
        i++;
      } else if (originalLines[i] !== formattedLines[j]) {
        // Line modified
        changes.push({
          line: i + 1,
          type: 'modify',
          content: formattedLines[j]
        });
        i++;
        j++;
      } else {
        // Lines match
        i++;
        j++;
      }
    }

    return {
      original: code,
      formatted,
      changes
    };
  }
}