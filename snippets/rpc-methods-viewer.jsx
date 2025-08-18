import { CosmosIcon } from '/snippets/icons.mdx';

export default function RPCMethodsViewerVersionB() {
  const [theme, setTheme] = useState('dark');

  // Detect theme changes
  useEffect(() => {
    const detectTheme = () => {
      // Mintlify uses 'dark' class on html element for dark mode
      // When in light mode, the 'dark' class is absent
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    detectTheme();

    // Listen for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectTheme);
    };
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme-aware namespace colors
  const namespaceColors = theme === 'dark' ? {
    web3: '#CF00A6', // Magenta
    net: '#0891b2', // Cyan
    eth: '#2563eb', // Blue
    personal: '#dc2626', // Red
    debug: '#CFB800', // Gold
    txpool: '#16a34a', // Green
    miner: '#4B0080' // Purple
  } : {
    web3: '#9333ea', // Purple
    net: '#0891b2', // Cyan
    eth: '#3b82f6', // Blue
    personal: '#ef4444', // Red
    debug: '#f59e0b', // Amber
    txpool: '#22c55e', // Green
    miner: '#a855f7' // Purple
  };

  // Simple code display component
  const CodeHighlighter = ({ code, language, className = '', theme }) => {
    return (
      <pre className={`p-4 rounded-lg text-xs overflow-x-auto border ${className} ${
        theme === 'dark'
          ? 'bg-black border-zinc-800'
          : 'bg-gray-900 border-gray-700'
      }`}>
        <code className="text-zinc-300 font-mono leading-relaxed">
          {code}
        </code>
      </pre>
    );
  };

  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [rpcEndpoint, setRpcEndpoint] = useState('http://localhost:8545');
  const [isValidEndpoint, setIsValidEndpoint] = useState(false);
  const [isInvalidEndpoint, setIsInvalidEndpoint] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState('list');
  const [paramValues, setParamValues] = useState({});
  const [debouncedParamValues, setDebouncedParamValues] = useState({});
  const [hideUnsupported, setHideUnsupported] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounce param values to prevent code regeneration on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParamValues(paramValues);
    }, 300);
    return () => clearTimeout(timer);
  }, [paramValues]);

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
    { id: 'csharp', name: 'C#' }
  ];

  const namespaces = {
    web3: {
      name: 'Web3',
      methods: [
        {
          name: 'web3_clientVersion',
          description: 'Get the web3 client version',
          implemented: true,
          params: []
        },
        {
          name: 'web3_sha3',
          description: 'Returns Keccak-256 hash of the given data',
          implemented: true,
          params: [{
            name: 'data',
            type: 'string',
            description: 'The data to hash (hex encoded)',
            example: '0x68656c6c6f20776f726c64'
          }]
        }
      ]
    },
    net: {
      name: 'Net',
      methods: [
        {
          name: 'net_version',
          description: 'Returns the current network id',
          implemented: true,
          params: []
        },
        {
          name: 'net_peerCount',
          description: 'Returns the number of connected peers',
          implemented: true,
          params: []
        },
        {
          name: 'net_listening',
          description: 'Check if client is listening for connections',
          implemented: true,
          params: []
        }
      ]
    },
    eth: {
      name: 'Eth',
      methods: [
        {
          name: 'eth_protocolVersion',
          description: 'Returns the current Ethereum protocol version',
          implemented: true,
          params: []
        },
        {
          name: 'eth_syncing',
          description: 'Returns sync status or false',
          implemented: true,
          params: []
        },
        {
          name: 'eth_gasPrice',
          description: 'Returns current gas price',
          implemented: true,
          params: []
        },
        {
          name: 'eth_accounts',
          description: 'Returns list of addresses owned by client',
          implemented: true,
          params: []
        },
        {
          name: 'eth_blockNumber',
          description: 'Returns the current block number',
          implemented: true,
          params: []
        },
        {
          name: 'eth_getBalance',
          description: 'Returns account balance',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Address to check', example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_getTransactionCount',
          description: 'Returns transaction count (nonce)',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Address', example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_sendRawTransaction',
          description: 'Send signed transaction',
          implemented: true,
          params: [
            { name: 'data', type: 'hex', description: 'Signed transaction data', example: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675' }
          ]
        },
        {
          name: 'eth_call',
          description: 'Execute call without creating transaction',
          implemented: true,
          params: [
            { name: 'callObject', type: 'object', description: 'Call data' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_estimateGas',
          description: 'Estimate gas for transaction',
          implemented: true,
          params: [
            { name: 'callObject', type: 'object', description: 'Transaction data' }
          ]
        },
        {
          name: 'eth_getStorageAt',
          description: 'Returns storage value at position',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Storage address', example: '0x295a70b2de5e3953354a6a8344e616ed314d7251' },
            { name: 'position', type: 'hex', description: 'Storage position', example: '0x0' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_getCode',
          description: 'Returns code at address',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Contract address', example: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_getBlockByNumber',
          description: 'Returns block by number',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number or tag', example: '0x1b4' },
            { name: 'fullTx', type: 'boolean', description: 'Return full transactions', example: true }
          ]
        },
        {
          name: 'eth_getBlockByHash',
          description: 'Returns block by hash',
          implemented: true,
          params: [
            { name: 'blockHash', type: 'hash', description: 'Block hash', example: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae' },
            { name: 'fullTx', type: 'boolean', description: 'Return full transactions', example: false }
          ]
        },
        {
          name: 'eth_getTransactionByHash',
          description: 'Returns transaction by hash',
          implemented: true,
          params: [
            { name: 'txHash', type: 'hash', description: 'Transaction hash', example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' }
          ]
        },
        {
          name: 'eth_getTransactionReceipt',
          description: 'Returns transaction receipt',
          implemented: true,
          params: [
            { name: 'txHash', type: 'hash', description: 'Transaction hash', example: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238' }
          ]
        },
        {
          name: 'eth_getLogs',
          description: 'Returns logs matching filter',
          implemented: true,
          params: [
            { name: 'filterOptions', type: 'object', description: 'Filter parameters' }
          ]
        },
        {
          name: 'eth_chainId',
          description: 'Returns chain ID',
          implemented: true,
          params: []
        },
        {
          name: 'eth_getTransactionLogs',
          description: 'Returns logs for a transaction (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          params: [
            { name: 'txHash', type: 'hash', description: 'Transaction hash', example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' }
          ]
        }
      ]
    },
    personal: {
      name: 'Personal',
      methods: [
        {
          name: 'personal_newAccount',
          description: 'Generate new private key and store in key store',
          implemented: true,
          private: true,
          params: [
            {
              name: 'passphrase',
              type: 'string',
              description: 'Passphrase for encryption',
              example: 'This is the passphrase'
            }
          ]
        },
        {
          name: 'personal_listAccounts',
          description: 'List all accounts in the keystore',
          implemented: true,
          private: true,
          params: []
        },
        {
          name: 'personal_unlockAccount',
          description: 'Unlock an account for signing',
          implemented: true,
          private: true,
          params: [
            { name: 'address', type: 'address', description: 'Account address to unlock', example: '0x...' },
            { name: 'passphrase', type: 'string', description: 'Account passphrase', example: 'mypassword' },
            { name: 'duration', type: 'number', description: 'Unlock duration in seconds (0 = indefinite)', example: 300 }
          ]
        },
        {
          name: 'personal_sign',
          description: 'Sign data with account',
          implemented: true,
          private: true,
          params: [
            { name: 'data', type: 'string', description: 'Data to sign', example: '0xdeadbeef' },
            { name: 'address', type: 'address', description: 'Signing account', example: '0x...' },
            { name: 'passphrase', type: 'string', description: 'Account passphrase', example: 'mypassword' }
          ]
        }
      ]
    },
    debug: {
      name: 'Debug',
      methods: [
        {
          name: 'debug_traceTransaction',
          description: 'Trace transaction execution',
          implemented: true,
          private: true,
          params: [
            {
              name: 'txHash',
              type: 'hash',
              description: 'Transaction hash',
              example: '0x4ed38df88f88...'
            }
          ]
        },
        {
          name: 'debug_freeOSMemory',
          description: 'Forces garbage collection and frees OS memory (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: []
        },
        {
          name: 'debug_setGCPercent',
          description: 'Sets garbage collector percentage (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'percent', type: 'number', description: 'GC percentage', example: 100 }
          ]
        },
        {
          name: 'debug_writeMutexProfile',
          description: 'Writes mutex profile to file (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Output file path', example: '/tmp/mutex.prof' }
          ]
        }
      ]
    },
    txpool: {
      name: 'TxPool',
      methods: [
        {
          name: 'txpool_status',
          description: 'Get number of pending and queued transactions',
          implemented: true,
          params: []
        },
        {
          name: 'txpool_content',
          description: 'Get all pending and queued transactions',
          implemented: true,
          params: []
        },
        {
          name: 'txpool_contentFrom',
          description: 'Get pending and queued transactions from a specific address',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Address to get transactions from', example: '0x1234567890abcdef1234567890abcdef12345678' }
          ]
        },
        {
          name: 'txpool_inspect',
          description: 'Get summary of all pending and queued transactions',
          implemented: true,
          params: []
        }
      ]
    },
    miner: {
      name: 'Miner',
      methods: [
        {
          name: 'miner_start',
          description: 'Start mining (stub implementation)',
          implemented: false,
          private: true,
          params: []
        },
        {
          name: 'miner_stop',
          description: 'Stop mining (stub implementation)',
          implemented: false,
          private: true,
          params: []
        },
        {
          name: 'miner_setEtherbase',
          description: 'Set coinbase address (stub implementation)',
          implemented: false,
          private: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'Coinbase address',
              example: '0x...'
            }
          ]
        },
        {
          name: 'miner_setGasPrice',
          description: 'Set minimum gas price (stub implementation)',
          implemented: false,
          private: true,
          params: [
            {
              name: 'gasPrice',
              type: 'hex',
              description: 'Minimum gas price in wei',
              example: '0x3b9aca00'
            }
          ]
        },
        {
          name: 'miner_setGasLimit',
          description: 'Set gas limit (stub implementation)',
          implemented: false,
          private: true,
          params: [
            {
              name: 'gasLimit',
              type: 'hex',
              description: 'Gas limit',
              example: '0x1c9c380'
            }
          ]
        }
      ]
    }
  };

  // Optimized to only generate code for the selected language
  const generateCodeExample = useCallback((method, params = [], language = 'curl') => {
    const endpoint = rpcEndpoint;
    const jsonRpcBody = {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params
    };

    // Only generate code for the requested language to avoid unnecessary computation
    if (language === 'javascript') {
      return [
        '// Using Fetch API',
        `const response = await fetch('${endpoint}', {`,
        `  method: 'POST',`,
        `  headers: { 'Content-Type': 'application/json' },`,
        `  body: JSON.stringify({`,
        `    jsonrpc: '2.0',`,
        `    id: 1,`,
        `    method: '${method}',`,
        `    params: ${JSON.stringify(params)}`,
        `  })`,
        `});`,
        `const data = await response.json();`,
        `console.log(data.result);`,
        '',
        '// Using ethers.js v6',
        `import { JsonRpcProvider } from 'ethers';`,
        `const provider = new JsonRpcProvider('${endpoint}');`,
        `const result = await provider.send('${method}', ${JSON.stringify(params)});`,
        `console.log(result);`,
        '',
        '// Using web3.js v4',
        `import { Web3 } from 'web3';`,
        `const web3 = new Web3('${endpoint}');`,
        `const result = await web3.currentProvider.request({`,
        `  method: '${method}',`,
        `  params: ${JSON.stringify(params)}`,
        `});`,
        `console.log(result);`
      ].join('\n');
    }

    if (language === 'python') {
      return [
        '# Using requests library',
        'import requests',
        'import json',
        '',
        `url = "${endpoint}"`,
        `headers = {"Content-Type": "application/json"}`,
        `payload = {`,
        `    "jsonrpc": "2.0",`,
        `    "id": 1,`,
        `    "method": "${method}",`,
        `    "params": ${JSON.stringify(params)}`,
        `}`,
        '',
        `response = requests.post(url, json=payload, headers=headers)`,
        `data = response.json()`,
        `print(data.get('result'))`,
        '',
        '# Using web3.py',
        'from web3 import Web3',
        '',
        `w3 = Web3(Web3.HTTPProvider("${endpoint}"))`,
        `result = w3.provider.make_request("${method}", ${JSON.stringify(params)})`,
        `print(result['result'])`
      ].join('\n');
    }

    if (language === 'go') {
      return [
        'package main',
        '',
        'import (',
        '    "bytes"',
        '    "encoding/json"',
        '    "fmt"',
        '    "net/http"',
        ')',
        '',
        'func main() {',
        '    payload := map[string]interface{}{',
        '        "jsonrpc": "2.0",',
        '        "id":      1,',
        '        "method":  "' + method + '",',
        '        "params":  []interface{}{' + params.map(p => {
          if (typeof p === 'string') return '"' + p + '"';
          return JSON.stringify(p);
        }).join(', ') + '},',
        '    }',
        '',
        '    jsonData, _ := json.Marshal(payload)',
        '    resp, _ := http.Post("' + endpoint + '", "application/json", bytes.NewBuffer(jsonData))',
        '    defer resp.Body.Close()',
        '',
        '    var result map[string]interface{}',
        '    json.NewDecoder(resp.Body).Decode(&result)',
        '    fmt.Printf("Result: %+v\\n", result["result"])',
        '}'
      ].join('\n');
    }

    if (language === 'rust') {
      return `use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize)]
struct JsonRpcRequest {
    jsonrpc: String,
    id: u64,
    method: String,
    params: Vec<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
struct JsonRpcResponse {
    jsonrpc: String,
    id: u64,
    result: Option<serde_json::Value>,
    error: Option<JsonRpcError>,
}

#[derive(Debug, Deserialize)]
struct JsonRpcError {
    code: i32,
    message: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let request = JsonRpcRequest {
        jsonrpc: "2.0".to_string(),
        id: 1,
        method: "${method}".to_string(),
        params: vec![${params.map(p =>
          typeof p === 'string' ? `json!("${p}")` : `json!(${JSON.stringify(p)})`
        ).join(', ')}],
    };

    let response = client
        .post("${endpoint}")
        .json(&request)
        .send()
        .await?
        .json::<JsonRpcResponse>()
        .await?;

    match response.error {
        Some(error) => eprintln!("Error {}: {}", error.code, error.message),
        None => println!("Result: {:#?}", response.result),
    }

    Ok(())
}

// Cargo.toml dependencies:
// [dependencies]
// reqwest = { version = "0.11", features = ["json"] }
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"
// tokio = { version = "1", features = ["full"] }`;
    }

    if (language === 'csharp') {
      return `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public class JsonRpcRequest
{
    [JsonPropertyName("jsonrpc")]
    public string JsonRpc { get; set; } = "2.0";

    [JsonPropertyName("id")]
    public int Id { get; set; } = 1;

    [JsonPropertyName("method")]
    public string Method { get; set; }

    [JsonPropertyName("params")]
    public object[] Params { get; set; }
}

public class JsonRpcResponse<T>
{
    [JsonPropertyName("jsonrpc")]
    public string JsonRpc { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("result")]
    public T Result { get; set; }

    [JsonPropertyName("error")]
    public JsonRpcError Error { get; set; }
}

public class JsonRpcError
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }
}

class Program
{
    static async Task Main(string[] args)
    {
        using var httpClient = new HttpClient();

        var request = new JsonRpcRequest
        {
            Method = "${method}",
            Params = new object[] { ${params.map(p =>
              typeof p === 'string' ? `"${p}"` : JSON.stringify(p)
            ).join(', ')} }
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await httpClient.PostAsync("${endpoint}", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonRpcResponse<JsonElement>>(responseBody);

            if (jsonResponse?.Error != null)
            {
                Console.Error.WriteLine($"Error {jsonResponse.Error.Code}: {jsonResponse.Error.Message}");
            }
            else
            {
                Console.WriteLine($"Result: {jsonResponse?.Result}");
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Request failed: {ex.Message}");
        }
    }
}`;
    }

    // Default to curl
    return `curl -X POST ${endpoint} \\\n` +
      `  -H "Content-Type: application/json" \\\n` +
      `  -d '${JSON.stringify(jsonRpcBody, null, 2)}'`;
  }, [rpcEndpoint]);

  const executeRpcRequest = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);
    setRequestResult(null);

    // Build params from form values
    const params = selectedMethod.params.map(param =>
      paramValues[param.name] || param.example || ''
    );

    try {
      const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: selectedMethod.name,
          params: params
        })
      });

      const data = await response.json();
      setRequestResult(data);
    } catch (error) {
      setRequestResult({
        error: {
          message: error.message,
          code: -1
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEndpoint = async () => {
    try {
      const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'web3_clientVersion',
          params: []
        })
      });
      setIsValidEndpoint(response.ok);
      setIsInvalidEndpoint(!response.ok);
    } catch {
      setIsValidEndpoint(false);
      setIsInvalidEndpoint(true);
    }
  };

  useEffect(() => {
    validateEndpoint();
  }, []);

  const allMethods = useMemo(() => {
    const methods = [];
    Object.entries(namespaces).forEach(([key, namespace]) => {
      namespace.methods.forEach(method => {
        methods.push({
          ...method,
          namespace: key,
          namespaceName: namespace.name
        });
      });
    });
    return methods;
  }, []);

  const filteredMethods = useMemo(() => {
    let methods = allMethods;

    if (searchTerm) {
      methods = methods.filter(method =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedNamespace !== 'all') {
      methods = methods.filter(method => method.namespace === selectedNamespace);
    }

    if (hideUnsupported) {
      methods = methods.filter(method => method.implemented !== false);
    }

    return methods;
  }, [selectedNamespace, searchTerm, allMethods, hideUnsupported]);

  // Generate code example using debounced values
  const codeExample = useMemo(() => {
    if (!selectedMethod) return '';
    const params = selectedMethod.params.map(p => debouncedParamValues[p.name] || p.example || '');
    return generateCodeExample(selectedMethod.name, params, selectedLanguage);
  }, [selectedMethod, debouncedParamValues, selectedLanguage, generateCodeExample]);

  return (
    <div className={`min-h-[600px] h-[80vh] not-prose flex flex-col relative ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full p-4">
      {/* Header */}
      <div className={`rounded-t-lg px-6 py-4 flex-shrink-0 ${
        theme === 'dark'
          ? 'bg-black border-b border-zinc-800'
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Ethereum JSON-RPC Explorer</h1>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
            }`}>
              Interactive method testing for Cosmos EVM
            </p>
          </div>

          {/* RPC Endpoint Config */}
          <div className={`${isMobile ? 'w-full' : 'w-[40%] max-w-md'}`}>
            <div className="flex flex-col gap-1">
              <label className={`text-xs ${
                theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'
              }`}>RPC URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="http://localhost:8545"
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                  value={rpcEndpoint}
                  onChange={(e) => {
                    setRpcEndpoint(e.target.value);
                    setIsValidEndpoint(false);
                    setIsInvalidEndpoint(false);
                  }}
                  onBlur={validateEndpoint}
                />
                {isValidEndpoint && (
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Connected
                  </span>
                )}
                {isInvalidEndpoint && (
                  <span className="text-xs text-red-500">Failed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden rounded-b-lg">
        {/* Left Panel - Methods List */}
        <div className={`${isMobile ? 'w-full' : 'w-80'} ${
          isMobile && showMobilePanel !== 'list' ? 'hidden' : ''
        } flex flex-col h-full overflow-hidden ${
          theme === 'dark'
            ? 'border-r border-zinc-800 bg-black'
            : 'border-r border-gray-200 bg-white'
        }`}>
          {/* Search & Filters */}
          <div className={`p-4 ${
            theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
          }`}>
            <div className="relative">
              <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search methods..."
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              <button
                onClick={() => setSelectedNamespace('all')}
                style={{
                  boxShadow: selectedNamespace === 'all'
                    ? `0 0 0 2px ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`
                    : 'none'
                }}
                className={`px-3 py-1 text-xs rounded-full transition-all font-medium ${
                  selectedNamespace === 'all'
                    ? theme === 'dark'
                      ? 'bg-zinc-500 text-white'
                      : 'bg-gray-500 text-white'
                    : theme === 'dark'
                      ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                All
              </button>
              {Object.entries(namespaces).map(([key, namespace]) => (
                <button
                  key={key}
                  onClick={() => setSelectedNamespace(key)}
                  style={{
                    backgroundColor: theme === 'dark'
                      ? (selectedNamespace === key ? namespaceColors[key] : 'transparent')
                      : namespaceColors[key],
                    borderColor: namespaceColors[key],
                    borderWidth: '2px',
                    color: theme === 'dark'
                      ? (selectedNamespace === key ? 'white' : namespaceColors[key])
                      : 'white',
                    opacity: theme === 'light' ? (selectedNamespace === key ? 1 : 0.7) : 1,
                    boxShadow: selectedNamespace === key
                      ? `0 0 0 2px ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`
                      : 'none'
                  }}
                  className="px-3 py-1 text-xs rounded-full transition-all font-medium hover:opacity-100"
                >
                  {namespace.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3">
              <label className="flex items-center cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={!hideUnsupported}
                  onChange={(e) => setHideUnsupported(!e.target.checked)}
                  className="mr-2"
                />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>Show all methods (Including unsupported)</span>
              </label>
            </div>
          </div>

          {/* Methods */}
          <div className="flex-1 overflow-y-auto">
            {filteredMethods.map((method) => (
              <button
                key={method.name}
                onClick={() => {
                  setSelectedMethod(method);
                  setParamValues({});
                  setRequestResult(null);
                  if (isMobile) setShowMobilePanel('details');
                }}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  selectedMethod?.name === method.name
                    ? theme === 'dark' ? 'bg-zinc-800/50' : 'bg-gray-100'
                    : ''
                } ${
                  theme === 'dark' ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'
                }`}
                style={{
                  borderLeft: `3px solid ${namespaceColors[method.namespace]}`,
                  borderTop: `1px solid ${namespaceColors[method.namespace]}33`,
                  borderRight: `1px solid ${namespaceColors[method.namespace]}33`,
                  borderBottom: `1px solid ${namespaceColors[method.namespace]}33`,
                  borderRadius: '0 4px 4px 0',
                  marginBottom: '2px'
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-blue-400 truncate">
                        {method.name}
                      </code>
                      {method.implemented === false && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/30 text-gray-400">
                          stub
                        </span>
                      )}
                      {method.cosmosSpecific && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30">
                          <CosmosIcon size={10} color={theme === 'dark' ? '#c084fc' : '#9333ea'} />
                          <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}>Cosmos</span>
                        </span>
                      )}
                      {method.private && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          theme === 'dark'
                            ? 'bg-amber-500/30 text-amber-400'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          Private
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 line-clamp-2 ${
                      theme === 'dark' ? 'text-zinc-500' : 'text-gray-600'
                    }`}>
                      {method.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel - Method Details */}
        <div className={`${
          isMobile && showMobilePanel !== 'details' ? 'hidden' : ''
        } flex-1 flex flex-col overflow-y-auto ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }`}>
          {selectedMethod ? (
            <>
              <div className={`p-6 ${
                theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
              }`}>
                <div className="flex items-center">
                  <h2 className={`text-2xl font-mono font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedMethod.name}
                  </h2>
                  <div
                    className="flex-1 ml-4 h-0.5"
                    style={{ backgroundColor: namespaceColors[selectedMethod.namespace] }}
                  />
                </div>
                <p className={`mt-1 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                }`}>
                  {selectedMethod.description}
                </p>
              </div>

              {/* Parameters */}
              {selectedMethod.params && selectedMethod.params.length > 0 && (
                <div className={`p-6 ${
                  theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Parameters
                  </h3>
                  <div className="space-y-3">
                    {selectedMethod.params.map((param, i) => (
                      <div key={i} className={`rounded-lg p-4 ${
                    theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-100'
                  }`}>
                        <code className="text-sm font-mono text-blue-400">
                          {param.name}
                        </code>
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          theme === 'dark'
                            ? 'bg-zinc-700 text-zinc-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {param.type}
                        </span>
                        <p className={`mt-2 text-sm ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                        }`}>
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${
              theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'
            }`}>
              <p>Select a method to view details</p>
            </div>
          )}
        </div>

        {/* Right Panel - Interactive Execute */}
        <div className={`${
          isMobile ? 'w-full' : 'w-96'
        } ${
          isMobile && showMobilePanel !== 'execute' ? 'hidden' : ''
        } flex flex-col h-full overflow-hidden ${
          theme === 'dark'
            ? 'border-l border-zinc-800 bg-black'
            : 'border-l border-gray-200 bg-white'
        }`}>
          {selectedMethod ? (
            <div className="flex-1 overflow-y-auto">
              {/* Parameters Form */}
              {selectedMethod.params && selectedMethod.params.length > 0 && (
                <div className={`p-4 ${
                  theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
                }`}>
                  <h3 className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Parameters</h3>
                  <div className="space-y-3">
                    {selectedMethod.params.map((param) => (
                      <div key={param.name}>
                        <label className={`text-xs block mb-1 ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                        }`}>
                          {param.name} ({param.type})
                        </label>
                        <input
                          type="text"
                          placeholder={param.example || `Enter ${param.name}`}
                          className={`w-full px-3 py-2 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-zinc-800 text-white border-zinc-700'
                              : 'bg-gray-100 text-gray-900 border-gray-300'
                          }`}
                          value={paramValues[param.name] || ''}
                          onChange={(e) => setParamValues(prev => ({
                            ...prev,
                            [param.name]: e.target.value
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className={`p-4 ${
                theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
              }`}>
                <button
                  onClick={executeRpcRequest}
                  disabled={isLoading || !isValidEndpoint}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isLoading ? 'Executing...' : 'Execute Request'}
                </button>
              </div>

              {/* Code Examples */}
              <div className={`p-4 ${
                theme === 'dark' ? 'border-b border-zinc-800' : 'border-b border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Code Example</h3>
                  <button
                    onClick={() => handleCopy(codeExample)}
                    className={`p-1 ${
                      theme === 'dark'
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                {/* Language Tabs */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        selectedLanguage === lang.id
                          ? 'bg-blue-600 text-white'
                          : theme === 'dark'
                            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <CodeHighlighter
                  code={codeExample}
                  language={selectedLanguage}
                  theme={theme}
                />
              </div>

              {/* Response */}
              {requestResult && (
                <div className="p-4">
                  <h3 className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Response</h3>
                  <CodeHighlighter
                    code={JSON.stringify(requestResult, null, 2)}
                    language="json"
                    theme={theme}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center ${
              theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'
            }`}>
              <p>Select a method to execute</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className={`border-t flex-shrink-0 ${
          theme === 'dark' ? 'border-zinc-800 bg-black' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex">
            <button
              onClick={() => setShowMobilePanel('list')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                showMobilePanel === 'list'
                  ? theme === 'dark' ? 'text-blue-400 bg-zinc-800/50' : 'text-blue-600 bg-gray-100'
                  : theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
              }`}
            >
              Methods
            </button>
            <button
              onClick={() => setShowMobilePanel('details')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                showMobilePanel === 'details'
                  ? theme === 'dark' ? 'text-blue-400 bg-zinc-800/50' : 'text-blue-600 bg-gray-100'
                  : theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
              }`}
              disabled={!selectedMethod}
            >
              Details
            </button>
            <button
              onClick={() => setShowMobilePanel('execute')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                showMobilePanel === 'execute'
                  ? theme === 'dark' ? 'text-blue-400 bg-zinc-800/50' : 'text-blue-600 bg-gray-100'
                  : theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
              }`}
              disabled={!selectedMethod}
            >
              Execute
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}