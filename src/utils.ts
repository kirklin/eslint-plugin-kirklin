import type { RuleListener, RuleWithMeta, RuleWithMetaAndName } from "@typescript-eslint/utils/eslint-utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import type { Rule } from "eslint";

// @keep-sorted
const hasDocs = [
  "consistent-chaining",
  "consistent-list-newline",
  "curly",
  "if-newline",
  "import-dedupe",
  "indent-unindent",
  "top-level-function",
];

const blobUrl = "https://github.com/kirklin/eslint-plugin-kirklin/blob/main/src/rules/";

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T;
}

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string) {
  // This function will get much easier to call when this is merged https://github.com/Microsoft/TypeScript/pull/26349
  // TODO - when the above PR lands; add type checking for the context.report `data` property
  return function createNamedRule<
    TOptions extends readonly unknown[],
    TMessageIds extends string,
  >({
    name,
    meta,
    ...rule
  }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>): RuleModule<TOptions> {
    return createRule<TOptions, TMessageIds>({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name),
        },
      },
      ...rule,
    });
  };
}

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 * @remarks It is generally better to provide a docs URL function to RuleCreator.
 */
function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>({
  create,
  defaultOptions,
  meta,
}: Readonly<RuleWithMeta<TOptions, TMessageIds>>): RuleModule<TOptions> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>,
    ): RuleListener => {
      const optionsWithDefault = context.options.map((options, index) => {
        return {
          ...defaultOptions[index] || {},
          ...options || {},
        };
      }) as unknown as TOptions;
      return create(context, optionsWithDefault);
    }) as any,
    defaultOptions,
    meta: meta as any,
  };
}

export const createEslintRule = RuleCreator(
  ruleName => hasDocs.includes(ruleName)
    ? `${blobUrl}${ruleName}.md`
    : `${blobUrl}${ruleName}.test.ts`,
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>;

const warned = new Set<string>();

export function warnOnce(message: string): void {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  console.warn(message);
}

const _reFullWs = /^\s*$/;

/**
 * Remove common leading whitespace from a template string.
 * Will also remove empty lines at the beginning and end.
 * @category string
 * @example
 * ```ts
 * const str = unindent`
 *   if (a) {
 *     b()
 *   }
 * `
 */
export function unindent(str: TemplateStringsArray | string): string {
  const lines = (typeof str === "string" ? str : str[0]).split("\n");
  const whitespaceLines = lines.map(line => _reFullWs.test(line));

  const commonIndent = lines
    .reduce((min, line, idx) => {
      if (whitespaceLines[idx]) {
        return min;
      }
      const indent = line.match(/^\s*/)?.[0].length;
      return indent === undefined ? min : Math.min(min, indent);
    }, Number.POSITIVE_INFINITY);

  let emptyLinesHead = 0;
  while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead]) {
    emptyLinesHead++;
  }
  let emptyLinesTail = 0;
  while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1]) {
    emptyLinesTail++;
  }

  return lines
    .slice(emptyLinesHead, lines.length - emptyLinesTail)
    .map(line => line.slice(commonIndent))
    .join("\n");
}
