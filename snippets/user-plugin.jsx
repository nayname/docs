import {loadContractAddress, signAndBroadcast} from "./walletUtils.jsx";

export const NLQueryPlugin = () => {
    // Use React.useState since React is globally available in this environment
    const [query, setQuery] = React.useState("Query transaction history for my address")//"Send 10 NTRN from my default wallet to Bob's address ntrn1bobaddressxx");
    const [response, setResponse] = React.useState(null);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [isMarkedLoaded, setIsMarkedLoaded] = React.useState(false);
    const [expandedSteps, setExpandedSteps] = React.useState(new Set());

    // A list of example intents with their implementation status
    const intents = [
        { text: "Query a wallet’s bank balances via the REST API", implemented: true },
//         { text: "Deposit 3 eBTC into the maxBTC/eBTC Supervault", implemented: true },
//         { text: "Execute an emergency withdrawal for the user's Amber trading position", implemented: true },
//         { text: "Increase the user's deposit in the WBTC/USDC Supervault by 0.2 WBTC and 12 000 USDC", implemented: true },
//         { text: "Enable USDC gas payments for my next transaction", implemented: true },
    ];

    // This effect runs once when the component mounts to load the marked.js script
    React.useEffect(() => {
        // Check if the script is already loaded to avoid duplicates
        if (window.marked) {
            setIsMarkedLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        script.async = true;

        // When the script finishes loading, update the state
        script.onload = () => {
            setIsMarkedLoaded(true);
        };

        // Add the script to the document's body
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component is unmounted
        return () => {
            document.body.removeChild(script);
        };
    }, []); // The empty array ensures this effect runs only once

    // Function to safely parse and render Markdown
    const renderMarkdown = (markdownText) => {
        // Check if the 'marked' library is available on the window, like in the original script
        if (window.marked) {
            return { __html: window.marked.parse(markdownText) };
        }
        return { __html: markdownText }; // Fallback to plain text if marked.js is not found
    };

    const handleSubmit = async (queryToExecute = query) => {
        setLoading(true);
        setResponse(null);
        setError('');
        setExpandedSteps(new Set());

        try {
            const result = await fetch('https://api.thousandmonkeystypewriter.org/generate_reponse', {
                method: 'POST',
                body: JSON.stringify({ text: queryToExecute }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await result.json();

            if (queryToExecute === "Query a wallet’s bank balances via the REST API") {
                const executedSteps = [];
                const baseWorkflow = data.workflow;

                const address = await getNeutronAddress();//step: 1 Tool: collect_target_address Desciption: Obtain the bech32 address whose balances you want to query.
                executedSteps.push({ ...baseWorkflow[0], output: "Address: "+address });

                const rawJson = await fetchNtrnBalance(address);//step: 2 Tool: rest_get_request Desciption: Send an HTTP GET to \"http://localhost:1317/cosmos/bank/v1beta1/balances/<address>\" using curl or
                executedSteps.push({ ...baseWorkflow[1], output: "Balance metadata: "+JSON.stringify(rawJson) });

                const parsed = await fetch('https://api.thousandmonkeystypewriter.org/generate', {
                    method: 'POST',
                    body: JSON.stringify({ text: queryToExecute, balance: rawJson }),
                    headers: { 'Content-Type': 'application/json' }
                });

                let res = await parsed.json();
                executedSteps.push({ ...baseWorkflow[2], output: "Parsed balance: "+JSON.stringify(res) });

                setResponse({ label: data.label, params: {}, workflow: executedSteps });
            }
//              else if (queryToExecute === "Deposit 3 eBTC into the maxBTC/eBTC Supervault") {
//                 const executedSteps = [];
//                 const baseWorkflow = data.workflow;
//
//                 const signer = await ensureWalletConnected();//step: 1 Tool: ensure_wallet_connected Desciption: Confirm the user\u2019s wallet session is active.",
//                 executedSteps.push({ ...baseWorkflow[0], output: signer ? '✅ Signer object received' : '❌ Failed to get signer' });
//
//                 const senderAddress = await getWalletAddress(signer);//step: 2 Tool: get_sender_address Desciption: Retrieve the depositor\u2019s Neutron address.",
//                 executedSteps.push({ ...baseWorkflow[1], output: "User address:"+senderAddress });
//
//                 const amount = await checkEbtcBalance(senderAddress, '3000000')//step: 2 Tool: check_token_balance Desciption: Ensure the wallet has at least 3 eBTC available on Neutron."
//                 executedSteps.push({ ...baseWorkflow[2], output: "User has "+amount.amountMicro+" eBTC" });
//
//                 const result = await fetch('https://api.thousandmonkeystypewriter.org/generate', {
//                     method: 'POST',
//                     body: JSON.stringify({ text: queryToExecute, address: senderAddress }),
//                     headers: { 'Content-Type': 'application/json' }
//                 });
//
//                 const res = await result.json();
//
//                 let i = 3
//                 for (const item of res) {
//                     executedSteps.push({ ...baseWorkflow[i], output: item });
//                     i += 1
//                 }
//
//                 setResponse({ label: data.label, params: {}, workflow: executedSteps });
//             } else if (queryToExecute === "Execute an emergency withdrawal for the user's Amber trading position") {
//                 const executedSteps = [];
//                 const baseWorkflow = data.workflow;
//
//                 const signer = await ensureWalletConnected();//step: 1 Tool: ensure_wallet_connected Desciption: Confirm the user\u2019s wallet session is active.",
//                 executedSteps.push({ ...baseWorkflow[0], output: signer ? '✅ Signer object received' : '❌ Failed to get signer' });
//
//                 const senderAddress = await getWalletAddress(signer);//step: 2 Tool: get_sender_address Desciption: Retrieve the depositor\u2019s Neutron address.",
//                 executedSteps.push({ ...baseWorkflow[1], output: senderAddress });
//
//                 const positions = await fetch('https://api.thousandmonkeystypewriter.org/generate', {
//                     method: 'POST',
//                     body: JSON.stringify({ text: queryToExecute, address: senderAddress }),
//                     headers: { 'Content-Type': 'application/json' }
//                 });
//
//                 let res = await positions.json();
//                 executedSteps.push({ ...baseWorkflow[2], output: "positions: "+JSON.stringify(res) });
//
//                 let position_id = 1
//                 const txMsg = constructTxWasmExecute(senderAddress, loadContractAddress(), { emergency_withdraw: { position_id } }, []);//step: 3 Tool: construct_tx_amber_emergency_withdraw Desciption: Build the emergency_withdraw transaction message with the selected position_id.",
//                 executedSteps.push({ ...baseWorkflow[3], output: "Transaction message:"+JSON.stringify(txMsg) });
//
//                 const txHash = await signAndBroadcast(signer, senderAddress, [txMsg], 'auto');//step: 6 Tool: sign_and_broadcast_tx Desciption: Prompt the wallet to sign and broadcast the execution transaction."
//                 executedSteps.push({ ...baseWorkflow[4], output: 'Transaction hash: '+txHash });
//
//                 setResponse({ label: data.label, params: {}, workflow: executedSteps });
//             } else if (queryToExecute === "Increase the user's deposit in the WBTC/USDC Supervault by 0.2 WBTC and 12 000 USDC") {
//                 const executedSteps = [];
//                 const baseWorkflow = data.workflow;
//
//                 const signer = await ensureWalletConnected();//step: 1 Tool: ensure_wallet_connected Desciption: Confirm the user\u2019s wallet session is active.",
//                 executedSteps.push({ ...baseWorkflow[0], output: signer ? '✅ Signer object received' : '❌ Failed to get signer' });
//
//                 const senderAddress = await getWalletAddress(signer);//step: 2 Tool: get_sender_address Desciption: Retrieve the depositor\u2019s Neutron address.",
//                 executedSteps.push({ ...baseWorkflow[1], output: "User address:"+senderAddress });
//
//                 const amount = await checkEbtcBalance(senderAddress, '3000000')//step: 2 Tool: check_token_balance Desciption: Ensure the wallet has at least 3 eBTC available on Neutron."
//                 executedSteps.push({ ...baseWorkflow[2], output: "User has "+amount.amountMicro+" eBTC" });
//
//                 const result = await fetch('https://api.thousandmonkeystypewriter.org/generate', {
//                     method: 'POST',
//                     body: JSON.stringify({ text: queryToExecute, address: senderAddress }),
//                     headers: { 'Content-Type': 'application/json' }
//                 });
//
//                 const res = await result.json();
//
//                 let i = 3
//                 for (const item of res) {
//                     executedSteps.push({ ...baseWorkflow[i], output: item });
//                     i += 1
//                 }
//
//                 setResponse({ label: data.label, params: {}, workflow: executedSteps });
//             }  else if (queryToExecute === "Enable USDC gas payments for my next transaction") {
//                 const executedSteps = [];
//                 const baseWorkflow = data.workflow;
//
//                 const { eligible } = await isFeeDenomEligible('uusdc');//step: 1 Tool: query_dynamic_fees_supported_assets Desciption: Call `/neutron/dynamicfees/params` to confirm that \"uusdc\" (USDC-denom) is in `ntrn_prices` and thus fee-eligible.",
//                 executedSteps.push({ ...baseWorkflow[0], output: "Confirm that denom in `ntrn_prices` is "+eligible });
//
//                 const minGasPrice = await getMinGasPrice('uusdc');//step: 2 Tool: query_global_fee_minimum Desciption: Query `/neutron/globalfee/min_gas_prices` to fetch the minimum gas price required for the \"uusdc\" denom.",
//                 // setDefaultFeeDenom('uusdc');//step: 3 Tool: set_wallet_default_fee_denom Desciption: Configure the local wallet/CLI to default to \"uusdc\" fees (e.g., `export NEUTRON_FEE_DENOM=uusdc`)."
//                 executedSteps.push({ ...baseWorkflow[1], output: " Minimum gas price "+minGasPrice });
//
//                 const result = await fetch('https://api.thousandmonkeystypewriter.org/generate', {
//                     method: 'POST',
//                     body: JSON.stringify({ text: queryToExecute }),
//                     headers: { 'Content-Type': 'application/json' }
//                 });
//
//                 const res = await result.json();
//
//                 let i = 2
//                 for (const item of res) {
//                     executedSteps.push({ ...baseWorkflow[i], output: item });
//                     i += 1
//                 }
//                 setResponse({ label: data.label, params: {}, workflow: executedSteps });
//             }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleIntentClick = async (intentText) => {
        // Set the text in the textarea
        await setQuery(intentText);
        // Immediately execute the query
        await handleSubmit(intentText);
    };

    const handleExecuteClick = () => {

    };

    const toggleStep = (index) => {
        setExpandedSteps(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const handleQuery = async () => {
        setLoading(true);
        setResponse(null);
        setError('');

        try {

            // const signer = await ensureWalletConnected()
            // const address = await getWalletAddress(signer)
            //
            // const balance = await fetch('https://api.thousandmonkeystypewriter.org/queryBankBalance?address='+address, {
            //   method: 'GET',
            //   headers: { 'Content-Type': 'application/json' }
            // });
            //
            // if (!balance.ok) {
            //   const errorData = await result.json();
            //   throw new Error(errorData.error || `HTTP error! Status: ${result.status}`);
            // }
            // const blnc = await balance.json();
            //
            // const result = await fetch('https://api.thousandmonkeystypewriter.org/formatAmount?address='
            //     +address+'&untrn_balance='+blnc.raw_balance, {
            //   method: 'GET',
            //   headers: { 'Content-Type': 'application/json' }
            // });
            //
            // if (!result.ok) {
            //   const errorData = await result.json();
            //   throw new Error(errorData.error || `HTTP error! Status: ${result.status}`);
            // }
            //
            // const data = await result.json();
            // alert(data.balance+", "+data.address);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white font-sans text-gray-800">

            <h4 className="text-lg font-semibold mb-2">Natural Language Execution Module</h4>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your natural language query"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleExecuteClick}
                disabled={loading}
                className="w-full mt-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg disabled:bg-blue-300 flex items-center justify-center cursor-not-allowed"
            >
                {loading ? (
                    <>
                        {/* Simple spinner for loading state */}
                        <div style={{
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            animation: 'spin 1s linear infinite'
                        }} className="mr-2"></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <span>Processing...</span>
                    </>
                ) : 'Execute'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
                Manual queries are currently disabled. Please select an intent from the list below to execute a workflow.
            </p>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
                    {error}
                </div>
            )}

            {response && (
                <div className="mt-6 border-t pt-6 space-y-4">
                    <div className="flex items-center gap-x-4">
                        <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Intent / Label</h5>
                        <p className="text-lg font-semibold text-blue-700 bg-blue-50 py-2 px-3 rounded-md">{response.label}</p>
                    </div>
                    {/*        <div>*/}
                    {/*            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Extracted Parameters</h5>*/}
                    {/*            <pre className="mt-1 text-sm bg-gray-100 p-4 rounded-md overflow-x-auto">*/}
                    {/*  <code>{JSON.stringify(response.params, null, 2)}</code>*/}
                    {/*</pre>*/}
                    {/*        </div>*/}
                    {/* --- NEW: Workflow Steps Section --- */}

                    {response.workflow && response.workflow.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Execution Workflow (Code Examples)</h5>
                            <div className="mt-1 border rounded-md">
                                {response.workflow.map((step, index) => (
                                    <div key={index} className={`p-3 ${index < response.workflow.length - 1 ? 'border-b' : ''}`}>
                                        <div className="flex items-center gap-x-3">
                                            <span className="font-semibold text-gray-800">{step.tool}</span>
                                            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${step.type === 'Frontend' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {step.type}
                                    </span>
                                            <button onClick={() => toggleStep(index)} className="text-sm text-blue-600 hover:underline">
                                                {expandedSteps.has(index) ? 'Hide Code' : 'Show Code'}
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                                        {step.output && (
                                            <div className="mt-3">
                                                <h6 className="text-xs font-semibold text-green-600 uppercase">Output (terminal)</h6>
                                                <pre className="mt-1 text-xs bg-gray-900 text-white p-3 rounded-md overflow-x-auto">
                                          <code>{step.output}</code>
                                        </pre>
                                            </div>
                                        )}

                                        {expandedSteps.has(index) && (
                                            <div className="mt-3">
                                                <h6 className="text-xs font-semibold text-gray-500 uppercase">Code</h6>
                                                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
                           <code>{step.code}</code>
                         </pre>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/*           <div> */}
                    {/*             <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">What the User Sees</h5> */}
                    {/*              */}{/* FIX: Use a <pre> tag to respect newlines and formatting without needing a Markdown parser */}
                    {/*             <div */}
                    {/*               className="mt-1 text-sm bg-gray-100 p-4 rounded-md overflow-x-auto prose" */}
                    {/*               dangerouslySetInnerHTML={{ __html: (isMarkedLoaded && window.marked) ? window.marked.parse(response.ui_mesages) : response.ui_mesages }} */}
                    {/*             /> */}
                    {/*           </div> */}
                </div>
            )}

            {/* List of clickable intents */}
            <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Or try one of these:</h5>
                <div className="flex flex-wrap gap-2">
                    {intents.map((intent, index) => (
                        <button
                            key={index}
                            onClick={() => handleIntentClick(intent.text)}
                            disabled={!intent.implemented || loading}
                            title={intent.implemented ? 'Click to run' : 'This feature is not yet implemented'}
                            className="flex items-center gap-2 text-sm px-3 py-1 border rounded-full transition-colors hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <span>{intent.implemented ? '✅' : '❌'}</span>
                            <span>{intent.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};