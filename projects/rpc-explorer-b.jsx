export default function RPCMethodsViewerVersionB() {
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          params: [],
          examples: [
            {
              name: 'Standard Request',
              params: [],
              response: {
                result: 'Cosmos/0.1.3+/linux/go1.18'
              }
            }
          ]
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
          }],
          examples: [
            {
              name: 'Hash "hello world"',
              params: ['0x68656c6c6f20776f726c64'],
              response: {
                result: '0x1b84adea42d5b7d192fd8a61a85b25abe0757e9a65cab1da470258914053823f'
              }
            }
          ]
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
          params: [],
          examples: [
            {
              name: 'Get Network ID',
              params: [],
              response: { result: '1' }
            }
          ]
        },
        {
          name: 'net_peerCount',
          description: 'Returns the number of connected peers',
          implemented: true,
          params: [],
          examples: [
            {
              name: 'Standard Request',
              params: [],
              response: { result: '0x17' }
            }
          ]
        },
        {
          name: 'net_listening',
          description: 'Check if client is listening for connections',
          implemented: true,
          params: [],
          examples: [
            {
              name: 'Check listening status',
              params: [],
              response: { result: true }
            }
          ]
        }
      ]
    },
    eth: {
      name: 'Eth',
      methods: [
        {
          name: 'eth_blockNumber',
          description: 'Get current block number',
          implemented: true,
          params: [],
          examples: [
            {
              name: 'Current Block',
              params: [],
              response: { result: '0x5bad55' }
            }
          ]
        },
        {
          name: 'eth_getBalance',
          description: 'Get account balance',
          implemented: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'The account address',
              example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1'
            },
            {
              name: 'block',
              type: 'string',
              description: 'Block number or "latest", "earliest", "pending"',
              example: 'latest'
            }
          ],
          examples: [
            {
              name: 'Get balance at latest block',
              params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
              response: { result: '0x0234c8a3397aab58' }
            }
          ]
        },
        {
          name: 'eth_getTransactionByHash',
          description: 'Get transaction details by hash',
          implemented: true,
          params: [
            {
              name: 'hash',
              type: 'hash',
              description: 'Transaction hash',
              example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'
            }
          ],
          examples: [
            {
              name: 'Existing transaction',
              params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
              response: {
                result: {
                  blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
                  blockNumber: '0x5daf3b',
                  from: '0xa7d9ddbe1f17865597fbd27ec712455208b6b76d',
                  gas: '0xc350',
                  gasPrice: '0x4a817c800',
                  hash: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
                  nonce: '0x15',
                  to: '0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb',
                  value: '0xf3dbb76162000'
                }
              }
            }
          ]
        },
        {
          name: 'eth_sendRawTransaction',
          description: 'Submit a signed transaction',
          implemented: true,
          params: [
            {
              name: 'data',
              type: 'bytes',
              description: 'Signed transaction data',
              example: '0xf86c0185046110...'
            }
          ],
          examples: [
            {
              name: 'Valid transaction',
              params: ['0xf86c01850465...'],
              response: { result: '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331' }
            }
          ]
        },
        {
          name: 'eth_call',
          description: 'Execute a call without creating a transaction',
          implemented: true,
          params: [
            {
              name: 'transaction',
              type: 'object',
              description: 'Transaction call object',
              fields: [
                { name: 'from', type: 'address', description: 'Address to call from (optional)' },
                { name: 'to', type: 'address', description: 'Contract address' },
                { name: 'gas', type: 'quantity', description: 'Gas limit (optional)' },
                { name: 'gasPrice', type: 'quantity', description: 'Gas price (optional)' },
                { name: 'value', type: 'quantity', description: 'Value to send (optional)' },
                { name: 'data', type: 'bytes', description: 'Call data' }
              ]
            },
            {
              name: 'block',
              type: 'string',
              description: 'Block number or tag',
              example: 'latest'
            }
          ],
          examples: [
            {
              name: 'Call balanceOf',
              params: [
                {
                  to: '0x08d68b6d693a685126f823bc7787e4078b3d35e3',
                  data: '0x70a08231000000000000000000000000b60e8dd61c5d32be8058bb8eb970870f07233155'
                },
                'latest'
              ],
              response: { result: '0x00000000000000000000000000000000000000000000000000000000000186a0' }
            }
          ]
        },
        {
          name: 'eth_getLogs',
          description: 'Get logs matching filter criteria',
          implemented: true,
          params: [
            {
              name: 'filter',
              type: 'object',
              description: 'Filter object',
              fields: [
                { name: 'fromBlock', type: 'string', description: 'Starting block' },
                { name: 'toBlock', type: 'string', description: 'Ending block' },
                { name: 'address', type: 'address', description: 'Contract address(es)' },
                { name: 'topics', type: 'array', description: 'Topic filters' }
              ]
            }
          ],
          examples: [
            {
              name: 'Get Transfer events',
              params: [{
                fromBlock: '0x1',
                toBlock: 'latest',
                address: '0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907',
                topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
              }],
              response: {
                result: [{
                  address: '0xb59f67a8bff5d8cd03f6ac17265c550ed8f33907',
                  topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
                  data: '0x00000000000000000000000000000000000000000000000000000000000186a0',
                  blockNumber: '0x1b4',
                  transactionHash: '0x67....',
                  transactionIndex: '0x0',
                  blockHash: '0x78....',
                  logIndex: '0x0',
                  removed: false
                }]
              }
            }
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
          ],
          examples: [
            {
              name: 'Create account',
              params: ['This is the passphrase'],
              response: {
                result: '0xf0e4086ad1c6aab5d42161d5baaae2f9ad0571c0'
              }
            }
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
            },
            {
              name: 'config',
              type: 'object',
              description: 'Trace config (optional)',
              fields: [
                { name: 'tracer', type: 'string', description: 'Tracer type (callTracer, prestateTracer)' },
                { name: 'timeout', type: 'string', description: 'Execution timeout' }
              ]
            }
          ],
          examples: [
            {
              name: 'Basic trace',
              params: ['0x4ed38df88f88...', {}],
              response: {
                result: {
                  gas: 21000,
                  failed: false,
                  returnValue: '0x',
                  structLogs: []
                }
              }
            }
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
          params: [],
          examples: [
            {
              name: 'Get pool status',
              params: [],
              response: {
                result: {
                  pending: '0x0',
                  queued: '0x0'
                }
              }
            }
          ]
        }
      ]
    }
  };

  const generateCodeExamples = (method, params = []) => {
    const endpoint = rpcEndpoint;
    const jsonRpcBody = {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params
    };

    const examples = {
      curl: `curl -X POST -H "Content-Type: application/json" \\
  --data '${JSON.stringify(jsonRpcBody, null, 2)}' \\
  ${endpoint}`,

      javascript: `// Using native fetch API
const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(jsonRpcBody, null, 2).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')})
});

const data = await response.json();
console.log(data.result);

// Using ethers.js v6
import { JsonRpcProvider } from 'ethers';
const provider = new JsonRpcProvider('${endpoint}');
const result = await provider.send('${method}', ${JSON.stringify(params)});
console.log(result);

// Using web3.js v4
import { Web3 } from 'web3';
const web3 = new Web3('${endpoint}');
const result = await web3.provider.request({
  method: '${method}',
  params: ${JSON.stringify(params)}
});
console.log(result);`,

      python: `import json
import requests

# Using requests library
url = "${endpoint}"
headers = {"Content-Type": "application/json"}
payload = ${JSON.stringify(jsonRpcBody, null, 2).split('\n').map((line, i) => i === 0 ? line : line).join('\n')}

response = requests.post(url, headers=headers, data=json.dumps(payload))
result = response.json()
print(result)

# Using web3.py v6
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("${endpoint}"))
result = w3.provider.make_request("${method}", ${JSON.stringify(params)})
print(result)`,

      go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type JSONRPCRequest struct {
    JSONRPC string        \`json:"jsonrpc"\`
    ID      int           \`json:"id"\`
    Method  string        \`json:"method"\`
    Params  []interface{} \`json:"params"\`
}

type JSONRPCResponse struct {
    JSONRPC string          \`json:"jsonrpc"\`
    ID      int             \`json:"id"\`
    Result  json.RawMessage \`json:"result"\`
    Error   *JSONRPCError   \`json:"error,omitempty"\`
}

type JSONRPCError struct {
    Code    int    \`json:"code"\`
    Message string \`json:"message"\`
}

func main() {
    request := JSONRPCRequest{
        JSONRPC: "2.0",
        ID:      1,
        Method:  "${method}",
        Params:  []interface{}{${params.map(p => {
          if (typeof p === 'string') return `"${p}"`;
          if (typeof p === 'object') return JSON.stringify(p);
          return p;
        }).join(', ')}},
    }

    jsonData, err := json.Marshal(request)
    if err != nil {
        panic(err)
    }

    resp, err := http.Post("${endpoint}", "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    var response JSONRPCResponse
    err = json.Unmarshal(body, &response)
    if err != nil {
        panic(err)
    }

    if response.Error != nil {
        fmt.Printf("Error: %s\\n", response.Error.Message)
    } else {
        fmt.Printf("Result: %s\\n", response.Result)
    }
}`,

      rust: `use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
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
    #[serde(skip_serializing_if = "Option::is_none")]
    result: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
        params: vec![${params.map(p => {
          if (typeof p === 'string') return `json!("${p}")`;
          return `json!(${JSON.stringify(p)})`;
        }).join(', ')}],
    };

    let response = client
        .post("${endpoint}")
        .json(&request)
        .send()
        .await?;

    let json_response: JsonRpcResponse = response.json().await?;

    match json_response.error {
        Some(error) => eprintln!("Error {}: {}", error.code, error.message),
        None => {
            if let Some(result) = json_response.result {
                println!("Result: {}", serde_json::to_string_pretty(&result)?);
            }
        }
    }

    Ok(())
}`,

      csharp: `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class JsonRpcRequest
{
    public string jsonrpc { get; set; } = "2.0";
    public int id { get; set; } = 1;
    public string method { get; set; }
    public object[] @params { get; set; }
}

public class JsonRpcResponse<T>
{
    public string jsonrpc { get; set; }
    public int id { get; set; }
    public T result { get; set; }
    public JsonRpcError error { get; set; }
}

public class JsonRpcError
{
    public int code { get; set; }
    public string message { get; set; }
}

class Program
{
    static async Task Main(string[] args)
    {
        using var httpClient = new HttpClient();

        var request = new JsonRpcRequest
        {
            method = "${method}",
            @params = new object[] { ${params.map(p => {
              if (typeof p === 'string') return `"${p}"`;
              if (typeof p === 'object') return JSON.stringify(p);
              return p;
            }).join(', ')} }
        };

        var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await httpClient.PostAsync("${endpoint}", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            var jsonResponse = JsonSerializer.Deserialize<JsonRpcResponse<object>>(
                responseBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (jsonResponse.error != null)
            {
                Console.Error.WriteLine($"Error {jsonResponse.error.code}: {jsonResponse.error.message}");
            }
            else
            {
                Console.WriteLine($"Result: {JsonSerializer.Serialize(jsonResponse.result)}");
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Request failed: {ex.Message}");
        }
    }
}`
    };

    return examples[selectedLanguage] || examples.curl;
  };

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

    return methods;
  }, [selectedNamespace, searchTerm, allMethods]);

  // Mobile navigation
  const MobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 dark:bg-zinc-900/50 border-t border-zinc-800 dark:border-white/10 z-30">
      <div className="flex">
        <button
          onClick={() => setShowMobilePanel('list')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'list' ? 'text-blue-400 bg-zinc-800/50' : 'text-zinc-400'
          }`}
        >
          Methods
        </button>
        <button
          onClick={() => setShowMobilePanel('details')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'details' ? 'text-blue-400 bg-zinc-800/50' : 'text-zinc-400'
          }`}
          disabled={!selectedMethod}
        >
          Details
        </button>
        <button
          onClick={() => setShowMobilePanel('execute')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'execute' ? 'text-blue-400 bg-zinc-800/50' : 'text-zinc-400'
          }`}
          disabled={!selectedMethod}
        >
          Execute
        </button>
      </div>
    </div>
  );

  // Left Panel - Methods List
  const MethodsList = () => (
    <div className={`${isMobile && showMobilePanel !== 'list' ? 'hidden' : ''}
      ${isMobile ? 'w-full' : 'w-80'} border-r border-zinc-800 dark:border-white/10 flex flex-col h-full bg-zinc-950`}>

      {/* Search & Filters */}
      <div className="p-4 border-b border-zinc-800 dark:border-white/10">
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search methods..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-800 dark:bg-zinc-800/50 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-700 dark:border-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedNamespace('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedNamespace === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {Object.entries(namespaces).map(([key, namespace]) => (
            <button
              key={key}
              onClick={() => setSelectedNamespace(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedNamespace === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {namespace.name}
            </button>
          ))}
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
            className={`w-full px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-900 dark:border-zinc-900/50 ${
              selectedMethod?.name === method.name ? 'bg-zinc-800/50 border-l-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-blue-400 truncate">
                    {method.name}
                  </code>
                  {!method.implemented && (
                    <span className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">
                      Not impl
                    </span>
                  )}
                  {method.private && (
                    <span className="text-xs bg-yellow-900/50 text-yellow-400 px-1.5 py-0.5 rounded">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Center Panel - Method Details
  const MethodDetails = () => (
    <div className={`${isMobile && showMobilePanel !== 'details' ? 'hidden' : ''}
      ${isMobile ? 'w-full' : 'flex-1'} flex flex-col h-full overflow-y-auto bg-zinc-950`}>

      {selectedMethod ? (
        <>
          {/* Method Header */}
          <div className="p-6 border-b border-zinc-800 dark:border-white/10">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h2 className="text-2xl font-mono font-bold text-white">
                  {selectedMethod.name}
                </h2>
                <p className="text-zinc-400 mt-1">
                  {selectedMethod.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-2 py-1 bg-zinc-800 dark:bg-zinc-800/50 text-zinc-300 rounded text-xs">
                    {selectedMethod.namespaceName}
                  </span>
                  {selectedMethod.implemented ? (
                    <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                      ✓ Implemented
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-xs">
                      Not Implemented
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parameters */}
          {selectedMethod.params && selectedMethod.params.length > 0 && (
            <div className="p-6 border-b border-zinc-800 dark:border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Parameters
              </h3>
              <div className="space-y-3">
                {selectedMethod.params.map((param, i) => (
                  <div key={i} className="bg-zinc-800 dark:bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <code className="text-sm font-mono text-blue-400">
                          {param.name}
                        </code>
                        <span className="ml-2 text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                          {param.type}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">
                      {param.description}
                    </p>
                    {param.example && (
                      <div className="mt-2">
                        <span className="text-xs text-zinc-500">Example: </span>
                        <code className="text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded">
                          {param.example}
                        </code>
                      </div>
                    )}
                    {param.fields && (
                      <div className="mt-3 space-y-1 pl-4 border-l-2 border-zinc-700">
                        {param.fields.map((field, j) => (
                          <div key={j} className="text-xs">
                            <code className="text-zinc-300">{field.name}</code>
                            <span className="text-zinc-500"> ({field.type})</span>
                            <span className="text-zinc-400"> - {field.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {selectedMethod.examples && selectedMethod.examples.length > 0 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Examples
              </h3>
              {selectedMethod.examples.map((example, i) => (
                <div key={i} className="mb-6">
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">
                    {example.name}
                  </h4>
                  <div className="bg-zinc-800 dark:bg-zinc-800/50 rounded-lg p-4">
                    <div className="text-xs text-zinc-500 mb-2">Request:</div>
                    <pre className="text-xs text-zinc-300 overflow-x-auto">
                      <code>{JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: selectedMethod.name,
                        params: example.params
                      }, null, 2)}</code>
                    </pre>
                  </div>
                  <div className="bg-zinc-800 dark:bg-zinc-800/50 rounded-lg p-4 mt-2">
                    <div className="text-xs text-zinc-500 mb-2">Expected Response:</div>
                    <pre className="text-xs overflow-x-auto">
                      <code className={example.response.error ? 'text-red-400' : 'text-green-400'}>
                        {JSON.stringify({
                          jsonrpc: '2.0',
                          id: 1,
                          ...example.response
                        }, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>Select a method to view details</p>
          </div>
        </div>
      )}
    </div>
  );

  // Right Panel - Interactive Execute
  const ExecutePanel = () => (
    <div className={`${isMobile && showMobilePanel !== 'execute' ? 'hidden' : ''}
      ${isMobile ? 'w-full' : 'w-96'} border-l border-zinc-800 dark:border-white/10 flex flex-col h-full bg-zinc-950`}>

      {/* RPC Endpoint Config */}
      <div className="p-4 border-b border-zinc-800 dark:border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          RPC Endpoint
        </h3>
        <input
          type="text"
          placeholder="http://localhost:8545"
          className={`w-full px-3 py-2 bg-zinc-800 dark:bg-zinc-800/50 text-white rounded-lg text-sm border ${
            isValidEndpoint
              ? 'border-green-500'
              : isInvalidEndpoint
              ? 'border-red-500'
              : 'border-zinc-700 dark:border-white/20'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={rpcEndpoint}
          onChange={(e) => {
            setRpcEndpoint(e.target.value);
            setIsValidEndpoint(false);
            setIsInvalidEndpoint(false);
          }}
          onBlur={validateEndpoint}
        />
        <div className="mt-2 text-xs">
          {isValidEndpoint && <span className="text-green-400">✓ Connected</span>}
          {isInvalidEndpoint && <span className="text-red-400">✗ Connection failed</span>}
        </div>
      </div>

      {selectedMethod ? (
        <>
          {/* Parameters Form */}
          {selectedMethod.params && selectedMethod.params.length > 0 && (
            <div className="p-4 border-b border-zinc-800 dark:border-white/10">
              <h3 className="text-sm font-semibold text-white mb-3">Parameters</h3>
              <div className="space-y-3">
                {selectedMethod.params.map((param) => (
                  <div key={param.name}>
                    <label className="text-xs text-zinc-400 block mb-1">
                      {param.name} ({param.type})
                    </label>
                    <input
                      type="text"
                      placeholder={param.example || `Enter ${param.name}`}
                      className="w-full px-3 py-2 bg-zinc-800 dark:bg-zinc-800/50 text-white rounded text-sm border border-zinc-700 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="p-4 border-b border-zinc-800 dark:border-white/10">
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
          <div className="p-4 border-b border-zinc-800 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Code Example</h3>
              <button
                onClick={() => handleCopy(generateCodeExamples(
                  selectedMethod.name,
                  selectedMethod.params.map(p => paramValues[p.name] || p.example || '')
                ))}
                className="text-zinc-400 hover:text-white p-1"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
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
                      : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <pre className="bg-zinc-900 dark:bg-black p-3 rounded-lg text-xs text-zinc-300 overflow-x-auto">
              <code>
                {generateCodeExamples(
                  selectedMethod.name,
                  selectedMethod.params.map(p => paramValues[p.name] || p.example || '')
                )}
              </code>
            </pre>
          </div>

          {/* Response */}
          {requestResult && (
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white mb-3">Response</h3>
              <pre className="bg-zinc-900 dark:bg-black p-3 rounded-lg text-xs overflow-x-auto">
                <code className={requestResult.error ? 'text-red-400' : 'text-green-400'}>
                  {JSON.stringify(requestResult, null, 2)}
                </code>
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p>Select a method to execute</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-zinc-950 dark:bg-zinc-950 text-white flex flex-col not-prose">
      {/* Header */}
      <div className="bg-zinc-900 dark:bg-zinc-900/50 border-b border-zinc-800 dark:border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ethereum JSON-RPC Explorer</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Interactive method testing for Cosmos EVM
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isValidEndpoint && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            )}
            <span className="text-xs text-zinc-500">
              {filteredMethods.length} methods available
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <MethodsList />
        <MethodDetails />
        {!isMobile && <ExecutePanel />}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <div className={`${showMobilePanel === 'execute' ? '' : 'hidden'} flex-1 overflow-hidden`}>
            <ExecutePanel />
          </div>
          <MobileNav />
        </>
      )}
    </div>
  );
}