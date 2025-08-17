export default function RPCMethodsViewerVersionB() {
  // Namespace color scheme - works in both light and dark modes
  const namespaceColors = {
    web3: '#9333ea', // Purple
    net: '#0891b2', // Cyan
    eth: '#2563eb', // Blue
    personal: '#dc2626', // Red
    debug: '#ea580c', // Orange
    txpool: '#16a34a', // Green
    miner: '#a21caf' // Fuchsia
  };

  // Cosmos Icon for Cosmos-specific methods
  const CosmosIcon = ({ size = 12, className = "" }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <ellipse cx="12" cy="12" rx="6" ry="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
      <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
      <ellipse cx="12" cy="12" rx="8" ry="8" transform="rotate(45 12 12)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  );

  // Simple code display component
  const CodeHighlighter = ({ code, language, className = '' }) => {
    return (
      <pre className={`bg-gray-100 dark:bg-black p-4 rounded-lg text-xs overflow-x-auto border border-gray-300 dark:border-zinc-800 ${className}`}>
        <code className="text-gray-800 dark:text-zinc-300 font-mono leading-relaxed">
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
  const [hideUnsupported, setHideUnsupported] = useState(false);

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
          name: 'eth_getTransactionCount',
          description: 'Returns transaction count (nonce)',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Address', example: '0x407d73d8a49eeb85d32cf465507dd71d507100c1' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_getBlockTransactionCountByNumber',
          description: 'Returns transaction count in block by number',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number or tag', example: '0xe8' }
          ]
        },
        {
          name: 'eth_getBlockTransactionCountByHash',
          description: 'Returns transaction count in block by hash',
          implemented: true,
          params: [
            { name: 'blockHash', type: 'hash', description: 'Block hash', example: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238' }
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
          name: 'eth_sign',
          description: 'Sign data with account',
          implemented: true,
          private: true,
          params: [
            { name: 'address', type: 'address', description: 'Signing address', example: '0x9b2055d370f73ec7d8a03e965129118dc8f5bf83' },
            { name: 'data', type: 'hex', description: 'Data to sign', example: '0xdeadbeef' }
          ]
        },
        {
          name: 'eth_signTransaction',
          description: 'Sign transaction without sending',
          implemented: true,
          private: true,
          params: [
            { name: 'transaction', type: 'object', description: 'Transaction object' }
          ]
        },
        {
          name: 'eth_sendTransaction',
          description: 'Create and send transaction',
          implemented: true,
          private: true,
          params: [
            { name: 'transaction', type: 'object', description: 'Transaction object' }
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
          name: 'eth_getTransactionByBlockHashAndIndex',
          description: 'Returns transaction by block hash and index',
          implemented: true,
          params: [
            { name: 'blockHash', type: 'hash', description: 'Block hash', example: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b' },
            { name: 'index', type: 'hex', description: 'Transaction index', example: '0x0' }
          ]
        },
        {
          name: 'eth_getTransactionByBlockNumberAndIndex',
          description: 'Returns transaction by block number and index',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number or tag', example: '0x29c' },
            { name: 'index', type: 'hex', description: 'Transaction index', example: '0x0' }
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
          name: 'eth_getUncleByBlockHashAndIndex',
          description: 'Returns uncle by block hash and index (always null in Cosmos)',
          implemented: true,
          params: [
            { name: 'blockHash', type: 'hash', description: 'Block hash', example: '0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b' },
            { name: 'index', type: 'hex', description: 'Uncle index', example: '0x0' }
          ]
        },
        {
          name: 'eth_getUncleByBlockNumberAndIndex',
          description: 'Returns uncle by block number and index (always null in Cosmos)',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number or tag', example: '0x29c' },
            { name: 'index', type: 'hex', description: 'Uncle index', example: '0x0' }
          ]
        },
        {
          name: 'eth_getUncleCountByBlockHash',
          description: 'Returns uncle count by block hash (always 0 in Cosmos)',
          implemented: true,
          params: [
            { name: 'blockHash', type: 'hash', description: 'Block hash', example: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238' }
          ]
        },
        {
          name: 'eth_getUncleCountByBlockNumber',
          description: 'Returns uncle count by block number (always 0 in Cosmos)',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number or tag', example: '0xe8' }
          ]
        },
        {
          name: 'eth_newFilter',
          description: 'Creates new filter',
          implemented: true,
          params: [
            { name: 'filterOptions', type: 'object', description: 'Filter parameters' }
          ]
        },
        {
          name: 'eth_newBlockFilter',
          description: 'Creates new block filter',
          implemented: true,
          params: []
        },
        {
          name: 'eth_newPendingTransactionFilter',
          description: 'Creates pending transaction filter',
          implemented: true,
          params: []
        },
        {
          name: 'eth_uninstallFilter',
          description: 'Removes filter',
          implemented: true,
          params: [
            { name: 'filterId', type: 'hex', description: 'Filter ID', example: '0xb' }
          ]
        },
        {
          name: 'eth_getFilterChanges',
          description: 'Polls filter for changes',
          implemented: true,
          params: [
            { name: 'filterId', type: 'hex', description: 'Filter ID', example: '0x16' }
          ]
        },
        {
          name: 'eth_getFilterLogs',
          description: 'Returns filter logs',
          implemented: true,
          params: [
            { name: 'filterId', type: 'hex', description: 'Filter ID', example: '0x16' }
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
          name: 'eth_getWork',
          description: 'Returns mining work (stub - returns empty)',
          implemented: true,
          params: []
        },
        {
          name: 'eth_submitWork',
          description: 'Submit mining work (stub - always false)',
          implemented: true,
          params: [
            { name: 'nonce', type: 'hex', description: 'Nonce', example: '0x0000000000000001' },
            { name: 'powHash', type: 'hash', description: 'PoW hash', example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' },
            { name: 'mixDigest', type: 'hash', description: 'Mix digest', example: '0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000' }
          ]
        },
        {
          name: 'eth_submitHashrate',
          description: 'Submit mining hashrate (stub)',
          implemented: true,
          params: [
            { name: 'hashrate', type: 'hex', description: 'Hashrate', example: '0x500000' },
            { name: 'id', type: 'hex', description: 'Client ID', example: '0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c' }
          ]
        },
        {
          name: 'eth_mining',
          description: 'Returns if client is mining (always false)',
          implemented: true,
          params: []
        },
        {
          name: 'eth_hashrate',
          description: 'Returns hashrate (always 0)',
          implemented: true,
          params: []
        },
        {
          name: 'eth_coinbase',
          description: 'Returns coinbase address',
          implemented: true,
          params: []
        },
        {
          name: 'eth_getProof',
          description: 'Returns Merkle proof for account',
          implemented: true,
          params: [
            { name: 'address', type: 'address', description: 'Account address', example: '0x7F0d15C7FAae65896648C8273B6d7E43f58Fa842' },
            { name: 'storageKeys', type: 'array', description: 'Storage keys', example: ['0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'] },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_feeHistory',
          description: 'Returns fee history (EIP-1559)',
          implemented: true,
          params: [
            { name: 'blockCount', type: 'hex', description: 'Number of blocks', example: '0x5' },
            { name: 'newestBlock', type: 'string', description: 'Newest block', example: 'latest' },
            { name: 'rewardPercentiles', type: 'array', description: 'Percentiles', example: [25, 50, 75] }
          ]
        },
        {
          name: 'eth_maxPriorityFeePerGas',
          description: 'Returns max priority fee per gas (EIP-1559)',
          implemented: true,
          params: []
        },
        {
          name: 'eth_chainId',
          description: 'Returns chain ID',
          implemented: true,
          params: []
        },
        {
          name: 'eth_getBlockReceipts',
          description: 'Returns all receipts for block',
          implemented: true,
          params: [
            { name: 'block', type: 'string', description: 'Block number, hash or tag', example: '0x1' }
          ]
        },
        {
          name: 'eth_createAccessList',
          description: 'Creates EIP-2930 access list',
          implemented: false,
          params: [
            { name: 'transaction', type: 'object', description: 'Transaction object' },
            { name: 'block', type: 'string', description: 'Block number or tag', example: 'latest' }
          ]
        },
        {
          name: 'eth_fillTransaction',
          description: 'Fills transaction defaults (nonce, gas, gasPrice)',
          implemented: true,
          params: [
            { name: 'transaction', type: 'object', description: 'Unsigned transaction object' }
          ]
        },
        {
          name: 'eth_getTransactionLogs',
          description: 'Returns logs for a transaction (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          params: [
            { name: 'txHash', type: 'hash', description: 'Transaction hash', example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' }
          ]
        },
        {
          name: 'eth_resend',
          description: 'Resend transaction with new gas price',
          implemented: true,
          params: [
            { name: 'transaction', type: 'object', description: 'Original transaction' },
            { name: 'gasPrice', type: 'hex', description: 'New gas price', example: '0x3b9aca00' },
            { name: 'gasLimit', type: 'hex', description: 'New gas limit', example: '0x5208' }
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
        },
        {
          name: 'personal_importRawKey',
          description: 'Import a private key into the keystore',
          implemented: true,
          private: true,
          params: [
            {
              name: 'privateKey',
              type: 'string',
              description: 'Private key to import (hex)',
              example: '0x...'
            },
            {
              name: 'passphrase',
              type: 'string',
              description: 'Passphrase for encryption',
              example: 'mypassword'
            }
          ]
        },
        {
          name: 'personal_listAccounts',
          description: 'List all accounts in the keystore',
          implemented: true,
          private: true,
          params: [],
          examples: [
            {
              name: 'List accounts',
              params: [],
              response: {
                result: ['0x...', '0x...']
              }
            }
          ]
        },
        {
          name: 'personal_lockAccount',
          description: 'Lock an account',
          implemented: true,
          private: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'Account address to lock',
              example: '0x...'
            }
          ]
        },
        {
          name: 'personal_unlockAccount',
          description: 'Unlock an account for signing',
          implemented: true,
          private: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'Account address to unlock',
              example: '0x...'
            },
            {
              name: 'passphrase',
              type: 'string',
              description: 'Account passphrase',
              example: 'mypassword'
            },
            {
              name: 'duration',
              type: 'number',
              description: 'Unlock duration in seconds (0 = indefinite)',
              example: 300
            }
          ]
        },
        {
          name: 'personal_sendTransaction',
          description: 'Sign and send transaction',
          implemented: true,
          private: true,
          params: [
            {
              name: 'transaction',
              type: 'object',
              description: 'Transaction object',
              fields: [
                { name: 'from', type: 'address', description: 'Sender address' },
                { name: 'to', type: 'address', description: 'Recipient address' },
                { name: 'value', type: 'hex', description: 'Value in wei' },
                { name: 'gas', type: 'hex', description: 'Gas limit' },
                { name: 'gasPrice', type: 'hex', description: 'Gas price' }
              ]
            },
            {
              name: 'passphrase',
              type: 'string',
              description: 'Account passphrase',
              example: 'mypassword'
            }
          ]
        },
        {
          name: 'personal_sign',
          description: 'Sign data with account',
          implemented: true,
          private: true,
          params: [
            {
              name: 'data',
              type: 'string',
              description: 'Data to sign',
              example: '0xdeadbeef'
            },
            {
              name: 'address',
              type: 'address',
              description: 'Signing account',
              example: '0x...'
            },
            {
              name: 'passphrase',
              type: 'string',
              description: 'Account passphrase',
              example: 'mypassword'
            }
          ]
        },
        {
          name: 'personal_ecRecover',
          description: 'Recover address from signed message',
          implemented: true,
          private: true,
          params: [
            {
              name: 'data',
              type: 'string',
              description: 'Signed data',
              example: '0xdeadbeef'
            },
            {
              name: 'signature',
              type: 'string',
              description: 'Signature',
              example: '0x...'
            }
          ]
        },
        {
          name: 'personal_initializeWallet',
          description: 'Initialize hardware wallet',
          implemented: true,
          private: true,
          params: [
            {
              name: 'url',
              type: 'string',
              description: 'Wallet URL',
              example: 'ledger://...'
            }
          ]
        },
        {
          name: 'personal_unpair',
          description: 'Unpair hardware wallet',
          implemented: true,
          private: true,
          params: [
            {
              name: 'url',
              type: 'string',
              description: 'Wallet URL',
              example: 'ledger://...'
            },
            {
              name: 'pin',
              type: 'string',
              description: 'Wallet PIN',
              example: '1234'
            }
          ]
        },
        {
          name: 'personal_listWallets',
          description: 'List all wallets',
          implemented: true,
          private: true,
          params: [],
          examples: [
            {
              name: 'List wallets',
              params: [],
              response: {
                result: []
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
        },
        {
          name: 'debug_traceBlockByNumber',
          description: 'Trace all transactions in block by number',
          implemented: true,
          private: true,
          params: [
            {
              name: 'blockNumber',
              type: 'string',
              description: 'Block number',
              example: '0x1b4'
            },
            {
              name: 'config',
              type: 'object',
              description: 'Trace config (optional)',
              fields: [
                { name: 'tracer', type: 'string', description: 'Tracer type' },
                { name: 'timeout', type: 'string', description: 'Execution timeout' }
              ]
            }
          ]
        },
        {
          name: 'debug_traceBlockByHash',
          description: 'Trace all transactions in block by hash',
          implemented: true,
          private: true,
          params: [
            {
              name: 'blockHash',
              type: 'hash',
              description: 'Block hash',
              example: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae'
            },
            {
              name: 'config',
              type: 'object',
              description: 'Trace config (optional)',
              fields: [
                { name: 'tracer', type: 'string', description: 'Tracer type' },
                { name: 'timeout', type: 'string', description: 'Execution timeout' }
              ]
            }
          ]
        },
        {
          name: 'debug_blockProfile',
          description: 'Turns on block profiling for duration',
          implemented: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Profile output file', example: 'block.prof' },
            { name: 'nsec', type: 'number', description: 'Duration in seconds', example: 30 }
          ]
        },
        {
          name: 'debug_cpuProfile',
          description: 'Turns on CPU profiling for duration',
          implemented: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Profile output file', example: 'cpu.prof' },
            { name: 'nsec', type: 'number', description: 'Duration in seconds', example: 30 }
          ]
        },
        {
          name: 'debug_gcStats',
          description: 'Returns GC statistics (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: []
        },
        {
          name: 'debug_goTrace',
          description: 'Turns on Go runtime tracing',
          implemented: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Trace output file', example: 'trace.out' },
            { name: 'nsec', type: 'number', description: 'Duration in seconds', example: 5 }
          ]
        },
        {
          name: 'debug_memStats',
          description: 'Returns detailed runtime memory statistics (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: []
        },
        {
          name: 'debug_setBlockProfileRate',
          description: 'Sets the rate of goroutine block profile data collection (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'rate', type: 'number', description: 'Profile rate', example: 1 }
          ]
        },
        {
          name: 'debug_stacks',
          description: 'Returns a printed representation of the stacks',
          implemented: true,
          private: true,
          params: []
        },
        {
          name: 'debug_startCPUProfile',
          description: 'Starts CPU profiling',
          implemented: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Profile output file', example: 'cpu.prof' }
          ]
        },
        {
          name: 'debug_stopCPUProfile',
          description: 'Stops an ongoing CPU profile',
          implemented: true,
          private: true,
          params: []
        },
        {
          name: 'debug_writeBlockProfile',
          description: 'Writes block profile to file (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Output file path', example: 'block.prof' }
          ]
        },
        {
          name: 'debug_writeMemProfile',
          description: 'Writes memory profile to file (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Output file path', example: 'mem.prof' }
          ]
        },
        {
          name: 'debug_mutexProfile',
          description: 'Turns on mutex profiling for duration',
          implemented: true,
          private: true,
          params: [
            { name: 'file', type: 'string', description: 'Profile output file', example: 'mutex.prof' },
            { name: 'nsec', type: 'number', description: 'Duration in seconds', example: 10 }
          ]
        },
        {
          name: 'debug_setMutexProfileFraction',
          description: 'Sets mutex profile fraction (Cosmos-specific)',
          implemented: true,
          cosmosSpecific: true,
          private: true,
          params: [
            { name: 'rate', type: 'number', description: 'Profile fraction (0 to disable)', example: 1 }
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
        },
        {
          name: 'debug_getHeaderRlp',
          description: 'Returns RLP encoded header',
          implemented: true,
          private: true,
          params: [
            { name: 'number', type: 'number', description: 'Block number', example: 100 }
          ]
        },
        {
          name: 'debug_getBlockRlp',
          description: 'Returns RLP encoded block',
          implemented: true,
          private: true,
          params: [
            { name: 'number', type: 'number', description: 'Block number', example: 100 }
          ]
        },
        {
          name: 'debug_printBlock',
          description: 'Returns formatted block information',
          implemented: true,
          private: true,
          params: [
            { name: 'number', type: 'number', description: 'Block number', example: 100 }
          ]
        },
        {
          name: 'debug_intermediateRoots',
          description: 'Returns intermediate state roots for transaction',
          implemented: true,
          private: true,
          params: [
            { name: 'hash', type: 'hash', description: 'Transaction hash', example: '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b' },
            { name: 'config', type: 'object', description: 'Trace config (optional)' }
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
        },
        {
          name: 'txpool_content',
          description: 'Get all pending and queued transactions',
          implemented: true,
          params: [],
          examples: [
            {
              name: 'Get pool content',
              params: [],
              response: {
                result: {
                  pending: {},
                  queued: {}
                }
              }
            }
          ]
        },
        {
          name: 'txpool_contentFrom',
          description: 'Get pending and queued transactions from a specific address',
          implemented: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'Address to get transactions from',
              example: '0x1234567890abcdef1234567890abcdef12345678'
            }
          ],
          examples: [
            {
              name: 'Get transactions from address',
              params: ['0x1234567890abcdef1234567890abcdef12345678'],
              response: {
                result: {
                  pending: {},
                  queued: {}
                }
              }
            }
          ]
        },
        {
          name: 'txpool_inspect',
          description: 'Get summary of all pending and queued transactions',
          implemented: true,
          params: [],
          examples: [
            {
              name: 'Inspect pool',
              params: [],
              response: {
                result: {
                  pending: {},
                  queued: {}
                }
              }
            }
          ]
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
          params: [
            {
              name: 'threads',
              type: 'number',
              description: 'Number of threads (optional)',
              example: 1
            }
          ],
          examples: [
            {
              name: 'Start mining',
              params: [1],
              response: {
                result: true
              }
            }
          ]
        },
        {
          name: 'miner_stop',
          description: 'Stop mining (stub implementation)',
          implemented: false,
          private: true,
          params: [],
          examples: [
            {
              name: 'Stop mining',
              params: [],
              response: {
                result: true
              }
            }
          ]
        },
        {
          name: 'miner_setEtherbase',
          description: 'Set coinbase address (stub implementation)',
          implemented: true,
          private: true,
          params: [
            {
              name: 'address',
              type: 'address',
              description: 'Coinbase address',
              example: '0x...'
            }
          ],
          examples: [
            {
              name: 'Set etherbase',
              params: ['0x1234567890abcdef1234567890abcdef12345678'],
              response: {
                result: true
              }
            }
          ]
        },
        {
          name: 'miner_setGasPrice',
          description: 'Set minimum gas price (stub implementation)',
          implemented: true,
          private: true,
          params: [
            {
              name: 'gasPrice',
              type: 'hex',
              description: 'Minimum gas price in wei',
              example: '0x3b9aca00'
            }
          ],
          examples: [
            {
              name: 'Set gas price',
              params: ['0x3b9aca00'],
              response: {
                result: true
              }
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
          ],
          examples: [
            {
              name: 'Set gas limit',
              params: ['0x1c9c380'],
              response: {
                result: true
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
    
    // Build JavaScript example as array to avoid template literal issues
    const jsLines = [
      '// Using Fetch API (modern browsers, Node 18+)',
      'const response = await fetch(\'' + endpoint + '\', {',
      '  method: \'POST\',',
      '  headers: { \'Content-Type\': \'application/json\' },',
      '  body: JSON.stringify({',
      '    jsonrpc: \'2.0\',',
      '    id: 1,',
      '    method: \'' + method + '\',',
      '    params: ' + JSON.stringify(params),
      '  })',
      '});',
      'const data = await response.json();',
      'console.log(data.result);',
      '',
      '// Using ethers.js v6 (recommended)',
      'import { JsonRpcProvider } from \'ethers\';',
      'const provider = new JsonRpcProvider(\'' + endpoint + '\');',
      'const result = await provider.send(\'' + method + '\', ' + JSON.stringify(params) + ');',
      'console.log(result);',
      '',
      '// Using web3.js v4',
      'import { Web3 } from \'web3\';',
      'const web3 = new Web3(\'' + endpoint + '\');',
      'const result = await web3.currentProvider.request({',
      '  method: \'' + method + '\',',
      '  params: ' + JSON.stringify(params),
      '});',
      'console.log(result);',
      '',
      '// Using viem',
      'import { createPublicClient, http } from \'viem\';',
      'const client = createPublicClient({',
      '  transport: http(\'' + endpoint + '\')',
      '});',
      'const result = await client.request({',
      '  method: \'' + method + '\',',
      '  params: ' + JSON.stringify(params),
      '});',
      'console.log(result);'
    ];

    const examples = {
      curl: 'curl -X POST ' + endpoint + ' \\\n' +
        '  -H "Content-Type: application/json" \\\n' +
        '  -d \'' + JSON.stringify(jsonRpcBody, null, 2) + '\'',

      javascript: jsLines.join('\n'),

      python: [
        'import json',
        'import requests',
        '',
        '# Using requests library',
        'url = "' + endpoint + '"',
        'headers = {"Content-Type": "application/json"}',
        'payload = {',
        '    "jsonrpc": "2.0",',
        '    "id": 1,',
        '    "method": "' + method + '",',
        '    "params": ' + JSON.stringify(params),
        '}',
        '',
        'response = requests.post(url, json=payload, headers=headers)',
        'data = response.json()',
        "print(data.get('result'))",
        '',
        '# Using web3.py v6 (recommended)',
        'from web3 import Web3',
        '',
        'w3 = Web3(Web3.HTTPProvider("' + endpoint + '"))',
        'result = w3.provider.make_request("' + method + '", ' + JSON.stringify(params) + ')',
        "print(result['result'])",
        '',
        '# Using asyncio with aiohttp',
        'import asyncio',
        'import aiohttp',
        '',
        'async def make_request():',
        '    async with aiohttp.ClientSession() as session:',
        '        async with session.post(url, json=payload) as response:',
        '            data = await response.json()',
        "            return data.get('result')",
        '',
        'result = asyncio.run(make_request())',
        'print(result)'
      ].join('\n'),

      go: [
        'package main',
        '',
        'import (',
        '    "bytes"',
        '    "encoding/json"',
        '    "fmt"',
        '    "log"',
        '    "net/http"',
        ')',
        '',
        'type JSONRPCRequest struct {',
        '    JSONRPC string        `json:"jsonrpc"`',
        '    ID      int           `json:"id"`',
        '    Method  string        `json:"method"`',
        '    Params  []interface{} `json:"params"`',
        '}',
        '',
        'type JSONRPCResponse struct {',
        '    JSONRPC string          `json:"jsonrpc"`',
        '    ID      int             `json:"id"`',
        '    Result  json.RawMessage `json:"result"`',
        '    Error   *JSONRPCError   `json:"error,omitempty"`',
        '}',
        '',
        'type JSONRPCError struct {',
        '    Code    int    `json:"code"`',
        '    Message string `json:"message"`',
        '}',
        '',
        'func main() {',
        '    request := JSONRPCRequest{',
        '        JSONRPC: "2.0",',
        '        ID:      1,',
        '        Method:  "' + method + '",',
        '        Params:  []interface{}{' + params.map(p => {
          if (typeof p === 'string') return '"' + p + '"';
          if (typeof p === 'object') return JSON.stringify(p);
          return p;
        }).join(', ') + '},',
        '    }',
        '',
        '    jsonData, err := json.Marshal(request)',
        '    if err != nil {',
        '        log.Fatal("Failed to marshal request:", err)',
        '    }',
        '',
        '    resp, err := http.Post("' + endpoint + '", "application/json", bytes.NewBuffer(jsonData))',
        '    if err != nil {',
        '        log.Fatal("Failed to send request:", err)',
        '    }',
        '    defer resp.Body.Close()',
        '',
        '    var response JSONRPCResponse',
        '    if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {',
        '        log.Fatal("Failed to decode response:", err)',
        '    }',
        '',
        '    if response.Error != nil {',
        '        log.Fatalf("RPC Error %d: %s", response.Error.Code, response.Error.Message)',
        '    }',
        '',
        '    // Pretty print the result',
        '    var result interface{}',
        '    if err := json.Unmarshal(response.Result, &result); err != nil {',
        '        fmt.Printf("Result: %s\\n", response.Result)',
        '    } else {',
        '        output, _ := json.MarshalIndent(result, "", "  ")',
        '        fmt.Printf("Result:\\n%s\\n", output)',
        '    }',
        '}'
      ].join('\n'),

      rust: `use serde::{Deserialize, Serialize};
use serde_json::json;
use anyhow::Result;

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
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<serde_json::Value>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let client = reqwest::Client::new();

    let request = JsonRpcRequest {
        jsonrpc: "2.0".to_string(),
        id: 1,
        method: "' + method + '".to_string(),
        params: vec![' + params.map(p => {
          if (typeof p === 'string') return 'json!("' + p + '")';
          return 'json!(' + JSON.stringify(p) + ')';
        }).join(', ') + '],
    };

    let response = client
        .post("' + endpoint + '")
        .json(&request)
        .send()
        .await?
        .json::<JsonRpcResponse>()
        .await?;

    match response.error {
        Some(error) => {
            eprintln!("RPC Error {}: {}", error.code, error.message);
            if let Some(data) = error.data {
                eprintln!("Error data: {}", serde_json::to_string_pretty(&data)?);
            }
            std::process::exit(1);
        }
        None => {
            if let Some(result) = response.result {
                println!("Result:\\n{}", serde_json::to_string_pretty(&result)?);
            } else {
                println!("Empty result");
            }
        }
    }

    Ok(())
}

// Cargo.toml dependencies:
// [dependencies]
// reqwest = { version = "0.11", features = ["json"] }
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0"
// tokio = { version = "1", features = ["full"] }
// anyhow = "1.0"`,

      csharp: `using System;
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

    [JsonPropertyName("data")]
    public object Data { get; set; }
}

class Program
{
    static async Task Main(string[] args)
    {
        using var httpClient = new HttpClient();
        httpClient.Timeout = TimeSpan.FromSeconds(30);

        var request = new JsonRpcRequest
        {
            Method = "' + method + '",
            Params = new object[] { ' + params.map(p => {
              if (typeof p === 'string') return '"' + p + '"';
              if (typeof p === 'object') return JSON.stringify(p);
              return p;
            }).join(', ') + ' }
        };

        var options = new JsonSerializerOptions
        {
            WriteIndented = false,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        var json = JsonSerializer.Serialize(request, options);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await httpClient.PostAsync("' + endpoint + '", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonRpcResponse<JsonElement>>(
                responseBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (jsonResponse?.Error != null)
            {
                Console.Error.WriteLine($"RPC Error {jsonResponse.Error.Code}: {jsonResponse.Error.Message}");
                if (jsonResponse.Error.Data != null)
                {
                    Console.Error.WriteLine($"Error data: {jsonResponse.Error.Data}");
                }
                Environment.Exit(1);
            }
            else if (jsonResponse?.Result != null)
            {
                var prettyJson = JsonSerializer.Serialize(jsonResponse.Result, new JsonSerializerOptions { WriteIndented = true });
                Console.WriteLine($"Result:\\n{prettyJson}");
            }
            else
            {
                Console.WriteLine("Empty result");
            }
        }
        catch (HttpRequestException ex)
        {
            Console.Error.WriteLine($"HTTP request failed: {ex.Message}");
            Environment.Exit(1);
        }
        catch (TaskCanceledException)
        {
            Console.Error.WriteLine("Request timed out");
            Environment.Exit(1);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Unexpected error: {ex.Message}");
            Environment.Exit(1);
        }
    }
}

// NuGet packages required:
// dotnet add package System.Text.Json
// dotnet add package System.Net.Http`
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

    if (hideUnsupported) {
      methods = methods.filter(method => method.implemented !== false);
    }

    return methods;
  }, [selectedNamespace, searchTerm, allMethods, hideUnsupported]);

  // Mobile navigation
  const MobileNav = () => (
    <div className="lg:hidden bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-zinc-800 z-30 flex-shrink-0">
      <div className="flex">
        <button
          onClick={() => setShowMobilePanel('list')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'list' ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-zinc-800/50' : 'text-gray-600 dark:text-zinc-400'
          }`}
        >
          Methods
        </button>
        <button
          onClick={() => setShowMobilePanel('details')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'details' ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-zinc-800/50' : 'text-gray-600 dark:text-zinc-400'
          }`}
          disabled={!selectedMethod}
        >
          Details
        </button>
        <button
          onClick={() => setShowMobilePanel('execute')}
          className={`flex-1 py-3 text-sm font-medium ${
            showMobilePanel === 'execute' ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-zinc-800/50' : 'text-gray-600 dark:text-zinc-400'
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
      ${isMobile ? 'w-full' : 'w-80'} border-r border-gray-200 dark:border-zinc-800 flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden`}>

      {/* Search & Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search methods..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <button
            onClick={() => setSelectedNamespace('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedNamespace === 'all'
                ? 'bg-gray-700 dark:bg-zinc-600 text-white'
                : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 hover:bg-gray-300 dark:hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {Object.entries(namespaces).map(([key, namespace]) => (
            <button
              key={key}
              onClick={() => setSelectedNamespace(key)}
              className={`px-3 py-1 text-xs rounded-full transition-colors text-white ${
                selectedNamespace === key
                  ? 'brightness-100'
                  : 'brightness-75 hover:brightness-90'
              }`}
              style={{ backgroundColor: namespaceColors[key] }}
            >
              {namespace.name}
            </button>
          ))}
        </div>

        {/* Cosmos EVM Filter */}
        <div className="flex items-center gap-2">
          <label className="flex items-center cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={hideUnsupported}
              onChange={(e) => setHideUnsupported(e.target.checked)}
              className="mr-2 w-3.5 h-3.5 rounded bg-white dark:bg-zinc-800 border-gray-400 dark:border-zinc-600 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <CosmosIcon size={14} className="text-purple-400" />
              Show only Cosmos EVM supported methods
            </span>
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
            className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors ${
              selectedMethod?.name === method.name ? 'bg-gray-100 dark:bg-zinc-800/50' : ''
            }`}
            style={{
              border: `2px solid ${namespaceColors[method.namespace]}`,
              borderLeft: selectedMethod?.name === method.name ? `4px solid ${namespaceColors[method.namespace]}` : `2px solid ${namespaceColors[method.namespace]}`,
              marginBottom: '2px'
            }}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400 truncate">
                    {method.name}
                  </code>
                  {method.implemented === false && (
                    <span className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">
                      Stub
                    </span>
                  )}
                  {method.cosmosSpecific && (
                    <span className="inline-flex items-center gap-1 text-xs bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded" title="Cosmos-specific">
                      <CosmosIcon size={10} />
                    </span>
                  )}
                  {method.private && (
                    <span className="text-xs bg-yellow-900/50 text-yellow-400 px-1.5 py-0.5 rounded">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-500 mt-1 line-clamp-2">
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
      ${isMobile ? 'w-full' : 'flex-1'} flex flex-col h-full overflow-y-auto bg-white dark:bg-black`}>

      {selectedMethod ? (
        <>
          {/* Method Header */}
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h2 className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                  {selectedMethod.name}
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 mt-1">
                  {selectedMethod.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  {selectedMethod.implemented === false && (
                    <span className="px-2 py-1 bg-zinc-700 text-zinc-400 rounded text-xs">
                      Stub Implementation
                    </span>
                  )}
                  {selectedMethod.cosmosSpecific && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-xs">
                      <CosmosIcon size={12} />
                      <span>Cosmos-specific</span>
                    </span>
                  )}
                </div>
              </div>
              <div 
                className="h-1 w-full mt-3" 
                style={{ backgroundColor: namespaceColors[selectedMethod.namespace] }}
              />
            </div>
          </div>

          {/* Parameters */}
          {selectedMethod.params && selectedMethod.params.length > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Parameters
              </h3>
              <div className="space-y-3">
                {selectedMethod.params.map((param, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {param.name}
                        </code>
                        <span className="ml-2 text-xs bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 px-2 py-1 rounded">
                          {param.type}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                      {param.description}
                    </p>
                    {param.example && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 dark:text-zinc-500">Example: </span>
                        <code className="text-xs text-gray-700 dark:text-zinc-300 bg-gray-200 dark:bg-zinc-900 px-2 py-1 rounded">
                          {param.example}
                        </code>
                      </div>
                    )}
                    {param.fields && (
                      <div className="mt-3 space-y-1 pl-4 border-l-2 border-zinc-700">
                        {param.fields.map((field, j) => (
                          <div key={j} className="text-xs">
                            <code className="text-gray-700 dark:text-zinc-300">{field.name}</code>
                            <span className="text-gray-500 dark:text-zinc-500"> ({field.type})</span>
                            <span className="text-gray-600 dark:text-zinc-400"> - {field.description}</span>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Examples
              </h3>
              {selectedMethod.examples.map((example, i) => (
                <div key={i} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    {example.name}
                  </h4>
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
                    <div className="text-xs text-gray-500 dark:text-zinc-500 mb-2">Request:</div>
                    <CodeHighlighter
                      code={JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: selectedMethod.name,
                        params: example.params
                      }, null, 2)}
                      language="json"
                    />
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4 mt-2">
                    <div className="text-xs text-gray-500 dark:text-zinc-500 mb-2">Expected Response:</div>
                    <CodeHighlighter
                      code={JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        ...example.response
                      }, null, 2)}
                      language="json"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-zinc-500">
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
      ${isMobile ? 'w-full' : 'w-96'} border-l border-gray-200 dark:border-zinc-800 flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden`}>

      {selectedMethod ? (
        <div className="flex-1 overflow-y-auto">
          {/* Parameters Form */}
          {selectedMethod.params && selectedMethod.params.length > 0 && (
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Parameters</h3>
              <div className="space-y-3">
                {selectedMethod.params.map((param) => (
                  <div key={param.name}>
                    <label className="text-xs text-gray-600 dark:text-zinc-400 block mb-1">
                      {param.name} ({param.type})
                    </label>
                    <input
                      type="text"
                      placeholder={param.example || `Enter ${param.name}`}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded text-sm border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
            <button
              onClick={executeRpcRequest}
              disabled={isLoading || !isValidEndpoint}
              className="w-full py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 hover:bg-gray-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <CodeHighlighter
              code={generateCodeExamples(
                selectedMethod.name,
                selectedMethod.params.map(p => paramValues[p.name] || p.example || '')
              )}
              language={selectedLanguage}
            />
          </div>

          {/* Response */}
          {requestResult && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Response</h3>
              <CodeHighlighter
                code={JSON.stringify(requestResult, null, 2)}
                language="json"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-zinc-500">
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
    <div className="min-h-[600px] h-[80vh] bg-white dark:bg-black text-gray-900 dark:text-white not-prose flex flex-col relative">
      {/* Header - Fixed/Pinned at top */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Ethereum JSON-RPC Explorer</h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
              Interactive method testing for Cosmos EVM
            </p>
          </div>

          {/* RPC Endpoint Config */}
          <div className="w-[40%] max-w-md">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600 dark:text-zinc-500">RPC URL - Enter a valid EVM endpoint to test methods</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="http://localhost:8545"
                    className={`w-full px-3 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm border ${
                      isValidEndpoint
                        ? 'border-green-500'
                        : isInvalidEndpoint
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-zinc-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={rpcEndpoint}
                    onChange={(e) => {
                      setRpcEndpoint(e.target.value);
                      setIsValidEndpoint(false);
                      setIsInvalidEndpoint(false);
                    }}
                    onBlur={validateEndpoint}
                  />
                </div>
                <div className="flex items-center gap-3">
                  {isValidEndpoint && (
                    <span className="text-sm text-green-400 flex items-center gap-1 whitespace-nowrap">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Connected
                    </span>
                  )}
                  {isInvalidEndpoint && (
                    <span className="text-sm text-red-400 whitespace-nowrap">✗ Failed</span>
                  )}
                  <span className="text-xs text-gray-600 dark:text-zinc-500 whitespace-nowrap">
                    {filteredMethods.length} methods
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container with padding */}
      <div className="flex-1 p-2 overflow-hidden">
        <div className="h-full bg-white dark:bg-black rounded-lg overflow-hidden flex flex-col">
          {/* Panels Container - Scrollable */}
          <div className="flex-1 flex overflow-hidden">
            <MethodsList />
            <MethodDetails />
            {!isMobile && <ExecutePanel />}
          </div>
          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <div className={`${showMobilePanel === 'execute' ? 'block' : 'hidden'} flex-1 overflow-hidden`}>
                <ExecutePanel />
              </div>
              <MobileNav />
            </>
          )}
        </div>
      </div>
    </div>
  );
}