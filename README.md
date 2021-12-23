# Crust Action

Decentralized pin your site to Crust IPFS Network with Github Action

## Inputs

### `path`

**Required** Path to uploading directory

### `seeds`

**Required**, Crust secret seeds, consist of 12/24 words. And you need to make sure you have CRUs in your account for sending the transaction

> Seeds is the private key of Crust Account, you can:
> 1. Get 1 by refering this [doc](https://wiki.crust.network/docs/en/crustAccount)
> 2. Then, join Crust [Discord Channel](https://discord.gg/D97GGQndmx) and can get free storage quota on `📦 free-storage` channel

### `cid-version`

*Optional*, IPFS CID version(0/1). Default is `0`

### `crust-endpoint`

*Optional*, Crust chain websocket endpoint. Default is `'wss://rpc.crust.network'`. You can find all usable chain endpoint [here](https://github.com/crustio/crust-apps/blob/master/packages/apps-config/src/endpoints/production.ts#L9)

### `ipfs-gateway`

*Optional*, [IPFS W3Authed gateway](https://docs.ipfs.io/concepts/ipfs-gateway/#authenticated-gateways). Default is `'https://crustwebsites.net/'`. You can find all FREE usable gateway [here](https://github.com/crustio/ipfsscan/blob/main/lib/constans.ts#L29)

## Outputs

### `cid`

**string**, IPFS CID.

## Example usage

```yaml
uses: crustio/crust-action@v1.0.0
with:
  path: ./build
  seeds: ${{ secrets.CRUST_SEEDS }}
  cid-version: 1
```

## Contribution

Feel free to dive in! [Open an issue](https://github.com/crustio/crust-action/issues/new) or send a PR.

To contribute to Crust in general, see the [Contribution Guide](https://github.com/crustio/crust/blob/master/docs/CONTRIBUTION.md)

## License

[MIT](https://github.com/crustio/ipfs-crust-action/blob/main/LICENSE) @Crust Network
