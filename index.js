const core = require('@actions/core');
const fsPath = require('path');
const fs = require('fs');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const IPFSHttpClient = require('ipfs-http-client');
const { globSource } = IPFSHttpClient;
const { checkSeeds, sendTx } = require('./util');

async function main() {
    // 1. Get all inputs
    let path = core.getInput('path');
    const seeds = core.getInput('seeds');
    const cidVersion = core.getInput('cid-version');
    const chainEndpoint = core.getInput('crust-endpoint');
    const gwEndpoinnt = core.getInput('ipfs-gateway');

    // 2. Check seeds and path
    const workspace = process.env.GITHUB_WORKSPACE.toString();
    if (!fsPath.isAbsolute(path)) {
        path = fsPath.join(workspace, path);
    }
    path = fsPath.resolve(__dirname, path);
    if (!fs.existsSync(path)) {
        throw new Error(`File/directory not exist: ${path}`);
    }
    if (!checkSeeds(seeds)) {
        throw new Error('Illegal Crust seeds');
    }

    // 3. Upload folder to IPFS gateway
    const keyring = new Keyring();
    const pair = keyring.addFromUri(seeds);
    const sig = pair.sign(pair.address);
    const sigHex = '0x' + Buffer.from(sig).toString('hex');

    const authHeader = Buffer.from(`${pair.address}:${sigHex}`).toString('base64');

    // 4. Create ipfs http client
    const ipfs = IPFSHttpClient({
        url: gwEndpoinnt + '/api/v0',
        headers: {
            authorization: 'Basic ' + authHeader
        }
    });

    const {cid, size} = await ipfs.add(globSource(path, {recursive: true}), { cidVersion });
    console.log(`📦  Upload to IPFS gateway success: (${cid}, ${size})`)

    // 4. Try to connect to Crust chain
    const chain = new ApiPromise({
        provider: new WsProvider(chainEndpoint),
        typesBundle: typesBundleForPolkadot
    });
    await chain.isReadyOrError;

    // 5. Construct tx
    const tx = chain.tx.market.placeStorageOrder(cid.toString(), size, 0, '');

    // 6. Send tx and disconnect chain
    const txRes = await sendTx(tx, seeds);
    chain.disconnect();

    if (txRes) {
        core.setOutput('cid', cid);
    } else {
        throw new Error('Place storage order to Crust failed');
    }
}

main().catch(error => {
    core.setFailed(error.message);
});
