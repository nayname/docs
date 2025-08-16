export default function RPCMethodsViewerVersionA() {
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMethods, setExpandedMethods] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [rpcEndpoint, setRpcEndpoint] = useState('');
  const [isValidEndpoint, setIsValidEndpoint] = useState(false);
  const [isInvalidEndpoint, setIsInvalidEndpoint] = useState(false);
  const [requestResults, setRequestResults] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [copied, setCopied] = useState({});

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
          params: [{ name: 'data', type: 'string', description: 'The data to hash (hex encoded)', example: '0x68656c6c6f20776f726c64' }],
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
              name: 'Node is listening',
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
            { name: 'address', type: 'address', description: 'The account address', example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1' },
            { name: 'block', type: 'string', description: 'Block number or "latest", "earliest", "pending"', example: 'latest' }
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
            { name: 'hash', type: 'hash', description: 'Transaction hash', example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' }
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
            { name: 'data', type: 'bytes', description: 'Signed transaction data', example: '0xf86c0185046110...' }
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
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
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
            { name: 'passphrase', type: 'string', description: 'Passphrase for encryption', example: 'This is the passphrase' }
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
            { name: 'txHash', type: 'hash', description: 'Transaction hash', example: '0x4ed38df88f88...' },
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
    const endpoint = rpcEndpoint || 'http://localhost:8545';
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

    return examples;
  };

  const executeRpcRequest = async (methodName, params = []) => {
    if (!rpcEndpoint) {
      alert('Please enter an RPC endpoint URL');
      return;
    }

    setIsLoading(prev => ({ ...prev, [methodName]: true }));

    try {
      const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: methodName,
          params: params
        })
      });

      const data = await response.json();
      setRequestResults(prev => ({ ...prev, [methodName]: data }));
    } catch (error) {
      setRequestResults(prev => ({
        ...prev,
        [methodName]: { error: { message: error.message, code: -1 } }
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [methodName]: false }));
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  const allMethods = useMemo(() => {
    const methods = [];
    Object.entries(namespaces).forEach(([key, namespace]) => {
      namespace.methods.forEach(method => {
        methods.push({ ...method, namespace: key, namespaceName: namespace.name });
      });
    });
    return methods;
  }, []);

  const filteredMethods = useMemo(() => {
    if (searchTerm) {
      return allMethods.filter(method =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedNamespace === 'all') return allMethods;
    const namespace = namespaces[selectedNamespace];
    if (!namespace) return [];
    return namespace.methods.map(method => ({
      ...method,
      namespace: selectedNamespace,
      namespaceName: namespace.name
    }));
  }, [selectedNamespace, searchTerm, allMethods]);

  const validateEndpoint = async () => {
    if (rpcEndpoint && rpcEndpoint.match(/^https?:\/\//)) {
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
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 not-prose">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-zinc-950 dark:bg-zinc-950 border-b border-zinc-800 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Title and RPC Endpoint Section - Same Level */}
          <div className="px-6 pt-8 pb-4">
            <div className="flex gap-6 items-start">
              {/* Title Section - Left Half */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white dark:text-white mb-2">
                  Ethereum JSON-RPC Methods
                </h1>
                <p className="text-zinc-400 dark:text-zinc-400">
                  Complete reference for Cosmos EVM implementation
                </p>
              </div>

              {/* RPC Endpoint Section - Right Half */}
              <div className="flex-1 max-w-xl">
                <div className="bg-zinc-900 dark:bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-zinc-300 dark:text-zinc-300 whitespace-nowrap">
                      RPC Endpoint:
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="http://localhost:8545"
                        className={`w-full px-3 py-1.5 text-sm bg-zinc-800 dark:bg-zinc-800/50 text-white rounded border ${
                          isValidEndpoint
                            ? 'border-green-500'
                            : isInvalidEndpoint
                            ? 'border-red-500'
                            : 'border-zinc-700 dark:border-white/20'
                        } focus:outline-none focus:border-blue-500`}
                        value={rpcEndpoint}
                        onChange={(e) => {
                          setRpcEndpoint(e.target.value);
                          setIsValidEndpoint(false);
                          setIsInvalidEndpoint(false);
                        }}
                        onBlur={validateEndpoint}
                      />
                    </div>
                    {isValidEndpoint && (
                      <span className="text-green-400 text-xs whitespace-nowrap">✓ Connected</span>
                    )}
                    {isInvalidEndpoint && (
                      <span className="text-red-400 text-xs whitespace-nowrap">✗ Failed</span>
                    )}
                  </div>
                  {isValidEndpoint && (
                    <p className="mt-1.5 text-xs text-blue-400">
                      Interactive mode active - Click "Execute" to test
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Enter endpoint for interactive testing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search methods..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 dark:bg-zinc-900/50 text-white rounded-lg border border-zinc-800 dark:border-white/10 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Namespace Tabs - Constrained Width */}
          <div className="bg-zinc-900/50 dark:bg-zinc-900/30 border-t border-zinc-800 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-2 py-3 overflow-x-auto">
                <button
                  onClick={() => setSelectedNamespace('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedNamespace === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  All
                </button>
                {Object.entries(namespaces).map(([key, namespace]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedNamespace(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      selectedNamespace === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    {namespace.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methods List - Constrained Width */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {filteredMethods.map((method) => (
            <div
              key={method.name}
              className="bg-zinc-900 dark:bg-zinc-900/50 rounded-lg border border-zinc-800 dark:border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setExpandedMethods(prev => ({
                  ...prev,
                  [method.name]: !prev[method.name]
                }))}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <code className="text-sm font-mono text-blue-400">
                    {method.name}
                  </code>
                  {method.namespace && selectedNamespace === 'all' && (
                    <span className="px-2 py-1 text-xs bg-zinc-800 dark:bg-zinc-800/50 text-zinc-400 rounded">
                      {method.namespaceName}
                    </span>
                  )}
                  {method.private && (
                    <span className="px-2 py-1 text-xs bg-yellow-900/50 text-yellow-400 rounded">
                      Private
                    </span>
                  )}
                  {!method.implemented && (
                    <span className="px-2 py-1 text-xs bg-zinc-800 dark:bg-zinc-800/50 text-zinc-500 rounded">
                      Not implemented
                    </span>
                  )}
                  <p className="text-zinc-400 text-left">{method.description}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-zinc-400 transform transition-transform flex-shrink-0 ${
                    expandedMethods[method.name] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedMethods[method.name] && (
                <div className="px-6 py-4 border-t border-zinc-800 dark:border-white/10">
                  {/* Parameters */}
                  {method.params && method.params.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {method.params.map((param, i) => (
                          <div key={i} className="bg-zinc-800 dark:bg-zinc-800/50 p-3 rounded">
                            <div className="flex items-start justify-between">
                              <div>
                                <code className="text-sm text-blue-400">{param.name}</code>
                                <span className="ml-2 text-xs text-zinc-500">{param.type}</span>
                              </div>
                              {param.example && (
                                <code className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                                  {param.example}
                                </code>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">{param.description}</p>
                            {param.fields && (
                              <div className="mt-2 ml-4 space-y-1">
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
                  {method.examples && method.examples.map((example, exampleIndex) => {
                    const exampleKey = `${method.name}-${exampleIndex}`;
                    const currentLang = selectedLanguage[exampleKey] || 'curl';

                    return (
                      <div key={exampleIndex} className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-zinc-300">
                            Example: {example.name}
                          </h5>
                          {rpcEndpoint && (
                            <button
                              onClick={() => executeRpcRequest(method.name, example.params)}
                              disabled={isLoading[method.name]}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded disabled:opacity-50 flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {isLoading[method.name] ? 'Loading...' : 'Execute'}
                            </button>
                          )}
                        </div>

                        {/* Language Tabs */}
                        <div className="flex gap-1 mb-3 flex-wrap">
                          {languages.map(lang => (
                            <button
                              key={lang.id}
                              onClick={() => setSelectedLanguage(prev => ({
                                ...prev,
                                [exampleKey]: lang.id
                              }))}
                              className={`px-3 py-1 text-xs rounded transition-colors ${
                                currentLang === lang.id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-zinc-800 dark:bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 dark:hover:bg-zinc-700/50'
                              }`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>

                        {/* Code Example */}
                        <div className="relative bg-zinc-950 dark:bg-black rounded-lg p-4">
                          <button
                            onClick={() => handleCopy(
                              generateCodeExamples(method.name, example.params)[currentLang],
                              exampleKey
                            )}
                            className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white"
                          >
                            {copied[exampleKey] ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                          <pre className="text-xs text-zinc-300 overflow-x-auto">
                            <code>{generateCodeExamples(method.name, example.params)[currentLang]}</code>
                          </pre>
                        </div>

                        {/* Response */}
                        {requestResults[method.name] ? (
                          <div className="mt-4">
                            <h6 className="text-xs font-medium text-blue-400 mb-2">
                              Live Response
                            </h6>
                            <pre className="bg-zinc-950 dark:bg-black p-4 rounded-lg text-xs overflow-x-auto">
                              <code className={requestResults[method.name].error ? 'text-red-400' : 'text-green-400'}>
                                {JSON.stringify(requestResults[method.name], null, 2)}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <h6 className="text-xs font-medium text-zinc-500 mb-2">
                              Expected Response
                            </h6>
                            <pre className="bg-zinc-950 dark:bg-black p-4 rounded-lg text-xs overflow-x-auto">
                              <code className={example.response.error ? 'text-red-400' : 'text-green-400'}>
                                {JSON.stringify({ jsonrpc: '2.0', id: 1, ...example.response }, null, 2)}
                              </code>
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}