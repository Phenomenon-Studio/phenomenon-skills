/**
 * TextMate grammar for Claude Code session input (slash commands), used in
 * ```claude fences. Scopes are chosen so standard themes colour them like a
 * shell: command = function, subcommand = keyword, refs = string, flags = constant.
 */
export const claudeGrammar = {
  name: 'claude',
  scopeName: 'source.claude',
  patterns: [
    { include: '#comment' },
    { include: '#command' },
  ],
  repository: {
    comment: {
      match: '(^|\\s)(#.*)$',
      captures: { 2: { name: 'comment.line.number-sign.claude' } },
    },
    command: {
      begin: '^\\s*(/[\\w:-]+)',
      beginCaptures: { 1: { name: 'entity.name.function.slash-command.claude' } },
      end: '$',
      patterns: [
        { include: '#comment' },
        {
          match: '(?<=\\s)(marketplace|add|install|uninstall|update|remove|list|enable|disable)(?=\\s|$)',
          name: 'keyword.other.subcommand.claude',
        },
        { match: '(?<=\\s)--?[\\w-]+', name: 'constant.other.option.claude' },
        { match: '<[^>\\s]+>', name: 'variable.parameter.placeholder.claude' },
        { match: '[\\w.-]+(@|/)[\\w./-]+', name: 'string.unquoted.reference.claude' },
        { match: '"[^"]*"|\'[^\']*\'', name: 'string.quoted.claude' },
      ],
    },
  },
};
