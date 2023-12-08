ssb message format

```js
{
  "key": "%vhP8tyeB+7cVLbIHd6wEd36AVEcUsZgwTYigpcx6Qn0=.sha256",
  "value": {
    "previous": "%NA/4By9K3L0OmVS2eD8le05uUW94ukDNbX16V3ZApi8=.sha256",
    "author": "@hxGxqPrplLjRG2vtjQL87abX4QKqeLgCwQpS730nNwE=.ed25519",
    "sequence": 2,
    "timestamp": 1439158769923,
    "hash": "sha256",
    "content": {
      "type": "post",
      "text": "Hello, world!"
    },
    "signature": "EQngCchOejwfWAcZ2Xgr5QR6iquBQVlF++1/ZOLlRJQfyj4TxHk6MHRUKV/o7L35h2zfL1K+Il991JxrxCT+BA==.sig.ed25519"
  }
}
```

[See bamboo](https://github.com/AljoschaMeyer/bamboo)

Conceptually, an entry in the log is a tuple of:

* the author of the entry, a public key of the digital signature scheme that is used for the log
* the log id, a 64 bit integer
* the sequence number of the entry (i.e. the offset in the log)
* the backlink, a cryptographically secure hash of the previous entry in the log
* the lipmaalink, a cryptographically secure hash of some older entry in the log, chosen such that there are short paths between any pair of entries
* the hash of the actual payload of the entry
* the size of the payload in bytes
* a boolean that indicates whether this is a regular entry or an end-of-log marker
* the digital signature of all the previous data, issued with the log's public key
