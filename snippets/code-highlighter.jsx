// Reusable syntax highlighter component for various programming languages
export default function CodeHighlighter({ code, language, className = '' }) {
  const getLanguageClass = () => {
    const languageMap = {
      curl: 'bash',
      shell: 'bash',
      bash: 'bash',
      javascript: 'javascript',
      js: 'javascript',
      typescript: 'javascript',
      ts: 'javascript',
      python: 'python',
      py: 'python',
      go: 'go',
      golang: 'go',
      rust: 'rust',
      rs: 'rust',
      csharp: 'csharp',
      'c#': 'csharp',
      cs: 'csharp',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      solidity: 'solidity',
      sol: 'solidity'
    };
    return languageMap[language?.toLowerCase()] || 'plaintext';
  };

  // Enhanced syntax highlighting with better regex patterns
  const highlightCode = (text, lang) => {
    if (!text) return '';

    // Escape HTML
    let highlighted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply language-specific highlighting
    if (lang === 'bash') {
      // Commands
      highlighted = highlighted.replace(/^(curl|wscat|echo|cat|grep|sed|awk|npm|yarn|pnpm|node|python|pip|go|cargo|git|docker|kubectl)/gm, '<span class="text-orange-400">$1</span>');
      // URLs
      highlighted = highlighted.replace(/(https?:\/\/[^\s'"]+)/g, '<span class="text-cyan-400">$1</span>');
      // Flags
      highlighted = highlighted.replace(/(\s|^)(-+[A-Za-z][\w-]*)/g, '$1<span class="text-blue-400">$2</span>');
      // Strings
      highlighted = highlighted.replace(/(['"])([^'"]*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      // Line continuation
      highlighted = highlighted.replace(/\\\\/g, '<span class="text-zinc-500">\\\\</span>');
      // Variables
      highlighted = highlighted.replace(/\$\{?(\w+)\}?/g, '<span class="text-purple-300">$&</span>');
    } else if (lang === 'javascript') {
      // Template literals first (to avoid conflict with regular strings)
      highlighted = highlighted.replace(/`([^`]*)`/g, '<span class="text-green-400">`$1`</span>');
      // Keywords
      highlighted = highlighted.replace(/\b(const|let|var|function|async|await|return|import|from|export|default|if|else|for|while|try|catch|finally|throw|class|extends|new|this|super|static|typeof|instanceof|in|of|break|continue|switch|case|default|do|with|yield)\b/g, '<span class="text-purple-400">$1</span>');
      // Built-in objects
      highlighted = highlighted.replace(/\b(console|JSON|Math|Date|Array|Object|String|Number|Boolean|Promise|Map|Set|Symbol|Error|fetch|window|document|process|Buffer|require|module|exports|global|__dirname|__filename)\b/g, '<span class="text-cyan-400">$1</span>');
      // Strings (after template literals)
      highlighted = highlighted.replace(/(['"])([^'"\n]*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d+\.?\d*[eE][+-]?\d+|\d+\.\d+|\d+)\b/g, '<span class="text-yellow-400">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, '<span class="text-blue-300">$1</span>(');
      // Arrow functions
      highlighted = highlighted.replace(/=&gt;/g, '<span class="text-purple-400">=&gt;</span>');
    } else if (lang === 'python') {
      // Triple quotes strings (docstrings) - must come first
      highlighted = highlighted.replace(/("""|\'\'\')([\s\S]*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      // f-strings
      highlighted = highlighted.replace(/f(['"])([^'"]*?)\1/g, '<span class="text-green-400">f$1$2$1</span>');
      // Keywords
      highlighted = highlighted.replace(/\b(import|from|as|def|class|if|elif|else|for|while|return|try|except|finally|with|async|await|yield|lambda|pass|break|continue|raise|assert|del|global|nonlocal|is|not|and|or|in|True|False|None)\b/g, '<span class="text-purple-400">$1</span>');
      // Built-in functions
      highlighted = highlighted.replace(/\b(print|len|range|enumerate|zip|map|filter|sorted|reversed|open|input|int|str|float|bool|list|dict|set|tuple|type|isinstance|hasattr|getattr|setattr|super|property|staticmethod|classmethod|abs|all|any|bin|hex|oct|chr|ord|min|max|sum|round)\b/g, '<span class="text-cyan-400">$1</span>');
      // Regular strings
      highlighted = highlighted.replace(/(['"])([^'"\n]*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      // Comments
      highlighted = highlighted.replace(/(#[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d+\.?\d*[eE][+-]?\d+|\d+\.\d+|\d+)\b/g, '<span class="text-yellow-400">$1</span>');
      // Decorators
      highlighted = highlighted.replace(/(@\w+)/g, '<span class="text-orange-400">$1</span>');
      // Self
      highlighted = highlighted.replace(/\bself\b/g, '<span class="text-red-400">self</span>');
    } else if (lang === 'go') {
      // Keywords
      highlighted = highlighted.replace(/\b(package|import|func|var|const|type|struct|interface|map|chan|if|else|for|range|switch|case|default|break|continue|goto|return|defer|go|select|fallthrough|nil|true|false|iota|make|new|cap|len|append|copy|delete|panic|recover)\b/g, '<span class="text-purple-400">$1</span>');
      // Built-in types
      highlighted = highlighted.replace(/\b(bool|string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|byte|rune|float32|float64|complex64|complex128|error|any|comparable)\b/g, '<span class="text-cyan-400">$1</span>');
      // Strings and runes
      highlighted = highlighted.replace(/`([^`]*)`/g, '<span class="text-green-400">`$1`</span>');
      highlighted = highlighted.replace(/"([^"\n]*)"/g, '<span class="text-green-400">"$1"</span>');
      highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-400">\'$1\'</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d+\.\d+|\d+)\b/g, '<span class="text-yellow-400">$1</span>');
      // Functions
      highlighted = highlighted.replace(/\b([a-zA-Z_][\w]*)\s*\(/g, '<span class="text-blue-300">$1</span>(');
      // fmt package common functions
      highlighted = highlighted.replace(/\b(fmt\.(Print|Printf|Println|Sprint|Sprintf|Sprintln|Fprint|Fprintf|Fprintln|Scan|Scanf|Scanln))\b/g, '<span class="text-blue-300">$1</span>');
    } else if (lang === 'rust') {
      // Macros (must come before functions)
      highlighted = highlighted.replace(/\b(\w+!)\s*\(/g, '<span class="text-orange-400">$1</span>(');
      highlighted = highlighted.replace(/\b(\w+!)\s*\[/g, '<span class="text-orange-400">$1</span>[');
      highlighted = highlighted.replace(/\b(\w+!)\s*\{/g, '<span class="text-orange-400">$1</span>{');
      // Keywords
      highlighted = highlighted.replace(/\b(use|fn|let|mut|const|static|struct|enum|trait|impl|where|type|pub|crate|mod|self|super|as|if|else|match|for|while|loop|break|continue|return|async|await|move|dyn|ref|in|extern|unsafe|box|Self)\b/g, '<span class="text-purple-400">$1</span>');
      // Built-in types
      highlighted = highlighted.replace(/\b(bool|char|str|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|String|Vec|Option|Result|Box|Rc|Arc|Cell|RefCell|Mutex|RwLock|HashMap|HashSet|BTreeMap|BTreeSet|VecDeque|LinkedList)\b/g, '<span class="text-cyan-400">$1</span>');
      // Some and None, Ok and Err
      highlighted = highlighted.replace(/\b(Some|None|Ok|Err)\b/g, '<span class="text-cyan-300">$1</span>');
      // Lifetimes
      highlighted = highlighted.replace(/('\w+)/g, '<span class="text-orange-300">$1</span>');
      // Strings
      highlighted = highlighted.replace(/"([^"\n]*)"/g, '<span class="text-green-400">"$1"</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+(_[0-9a-fA-F]+)*|0o[0-7]+(_[0-7]+)*|0b[01]+(_[01]+)*|\d+(_\d+)*\.?\d*([eE][+-]?\d+)?[fiu]?\d*)\b/g, '<span class="text-yellow-400">$1</span>');
      // Attributes
      highlighted = highlighted.replace(/(#\[[^\]]*\])/g, '<span class="text-zinc-400">$1</span>');
    } else if (lang === 'csharp') {
      // Keywords
      highlighted = highlighted.replace(/\b(using|namespace|class|struct|interface|enum|delegate|public|private|protected|internal|static|readonly|const|virtual|override|abstract|sealed|partial|async|await|void|var|dynamic|if|else|switch|case|default|for|foreach|while|do|break|continue|return|throw|try|catch|finally|lock|yield|new|this|base|null|true|false|is|as|typeof|sizeof|checked|unchecked|fixed|unsafe|volatile|extern|ref|out|in|params|get|set|value|where|select|from|group|into|orderby|join|let|on|equals|by|ascending|descending|nameof|when)\b/g, '<span class="text-purple-400">$1</span>');
      // Built-in types
      highlighted = highlighted.replace(/\b(bool|byte|sbyte|char|decimal|double|float|int|uint|long|ulong|short|ushort|object|string|dynamic|void|Task|List|Dictionary|Array|IEnumerable|IList|ICollection|IDictionary|HashSet|Queue|Stack|LinkedList|Tuple|DateTime|TimeSpan|Guid|Exception|Action|Func|Predicate|EventHandler)\b/g, '<span class="text-cyan-400">$1</span>');
      // Attributes
      highlighted = highlighted.replace(/(\[[^\]]+\])/g, '<span class="text-zinc-400">$1</span>');
      // Verbatim strings
      highlighted = highlighted.replace(/@"([^"]*)"/g, '<span class="text-green-400">@"$1"</span>');
      // Interpolated strings
      highlighted = highlighted.replace(/\$"([^"]*)"/g, '<span class="text-green-400">$"$1"</span>');
      // Regular strings
      highlighted = highlighted.replace(/"([^"\n]*)"/g, '<span class="text-green-400">"$1"</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+|\d+\.?\d*[fFdDmM]?|\d+[lLuU]?)\b/g, '<span class="text-yellow-400">$1</span>');
      // Generics
      highlighted = highlighted.replace(/&lt;([^&]*)&gt;/g, '<span class="text-orange-300">&lt;$1&gt;</span>');
    } else if (lang === 'solidity') {
      // Keywords
      highlighted = highlighted.replace(/\b(pragma|contract|interface|library|struct|enum|function|modifier|event|error|constructor|receive|fallback|external|public|internal|private|view|pure|payable|virtual|override|abstract|immutable|constant|if|else|for|while|do|break|continue|return|throw|require|assert|revert|try|catch|unchecked|assembly|import|is|as|using|new|delete|emit)\b/g, '<span class="text-purple-400">$1</span>');
      // Types
      highlighted = highlighted.replace(/\b(bool|string|address|bytes|byte|int|uint|int8|int16|int24|int32|int40|int48|int56|int64|int72|int80|int88|int96|int104|int112|int120|int128|int136|int144|int152|int160|int168|int176|int184|int192|int200|int208|int216|int224|int232|int240|int248|int256|uint8|uint16|uint24|uint32|uint40|uint48|uint56|uint64|uint72|uint80|uint88|uint96|uint104|uint112|uint120|uint128|uint136|uint144|uint152|uint160|uint168|uint176|uint184|uint192|uint200|uint208|uint216|uint224|uint232|uint240|uint248|uint256|bytes1|bytes2|bytes3|bytes4|bytes5|bytes6|bytes7|bytes8|bytes9|bytes10|bytes11|bytes12|bytes13|bytes14|bytes15|bytes16|bytes17|bytes18|bytes19|bytes20|bytes21|bytes22|bytes23|bytes24|bytes25|bytes26|bytes27|bytes28|bytes29|bytes30|bytes31|bytes32|mapping|msg|block|tx)\b/g, '<span class="text-cyan-400">$1</span>');
      // Special variables
      highlighted = highlighted.replace(/\b(msg\.(sender|value|data|sig)|block\.(timestamp|number|difficulty|gaslimit|chainid|coinbase)|tx\.(origin|gasprice)|now|this|super)\b/g, '<span class="text-orange-300">$1</span>');
      // Strings
      highlighted = highlighted.replace(/(['"])([^'"]*?)\1/g, '<span class="text-green-400">$1$2$1</span>');
      // Comments
      highlighted = highlighted.replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers (including ether units)
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\s*(ether|wei|gwei|finney|szabo)\b/g, '<span class="text-yellow-400">$1</span> <span class="text-orange-400">$2</span>');
      highlighted = highlighted.replace(/\b(0x[0-9a-fA-F]+|\d+\.?\d*)\b/g, '<span class="text-yellow-400">$1</span>');
      // Hex literals
      highlighted = highlighted.replace(/\bhex"([0-9a-fA-F]*)"/g, '<span class="text-yellow-400">hex"$1"</span>');
    } else if (lang === 'json') {
      // Property names
      highlighted = highlighted.replace(/"([^"]+)"\s*:/g, '<span class="text-blue-400">"$1"</span>:');
      // String values
      highlighted = highlighted.replace(/:( *)"([^"]*)"/g, ':$1<span class="text-green-400">"$2"</span>');
      // Numbers
      highlighted = highlighted.replace(/:( *)(-?\d+\.?\d*([eE][+-]?\d+)?)([,\s\}\]])/g, ':$1<span class="text-yellow-400">$2</span>$4');
      // Booleans
      highlighted = highlighted.replace(/\b(true|false)\b/g, '<span class="text-orange-400">$1</span>');
      // Null
      highlighted = highlighted.replace(/\bnull\b/g, '<span class="text-zinc-400">null</span>');
      // Arrays and objects brackets
      highlighted = highlighted.replace(/([\[\]{}])/g, '<span class="text-zinc-500">$1</span>');
    } else if (lang === 'yaml') {
      // Keys
      highlighted = highlighted.replace(/^(\s*)([a-zA-Z_][\w]*)\s*:/gm, '$1<span class="text-blue-400">$2</span>:');
      // Strings
      highlighted = highlighted.replace(/:\s*(['"])([^'"]*)\1/g, ': <span class="text-green-400">$1$2$1</span>');
      highlighted = highlighted.replace(/:\s*([^#\n]+)/g, function(match, value) {
        if (!value.match(/^['"]/) && !value.match(/^\d+/) && !value.match(/^(true|false|null|~)$/)) {
          return ': <span class="text-green-400">' + value + '</span>';
        }
        return match;
      });
      // Comments
      highlighted = highlighted.replace(/(#[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
      // Numbers
      highlighted = highlighted.replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-yellow-400">$1</span>');
      // Booleans and null
      highlighted = highlighted.replace(/:\s*(true|false|null|~)/g, ': <span class="text-orange-400">$1</span>');
      // Arrays
      highlighted = highlighted.replace(/^(\s*)-\s*/gm, '$1<span class="text-zinc-500">-</span> ');
    }

    return highlighted;
  };

  const lang = getLanguageClass();
  const highlightedCode = highlightCode(code, lang);

  return (
    <pre className={`bg-zinc-900 dark:bg-black p-4 rounded-lg text-xs overflow-x-auto ${className}`}>
      <code
        className="text-zinc-300 font-mono leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
}

// Export additional utility for inline code highlighting
export function InlineCode({ children, language = 'plaintext' }) {
  const highlighter = new CodeHighlighter({ code: children, language });
  return (
    <code
      className="px-1.5 py-0.5 bg-zinc-800 dark:bg-zinc-800/50 text-zinc-300 rounded text-sm font-mono"
      dangerouslySetInnerHTML={{ __html: highlighter.highlightCode(children, highlighter.getLanguageClass()) }}
    />
  );
}