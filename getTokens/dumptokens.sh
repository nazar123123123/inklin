
python /dumptokens.py
cd ethereum-etl
python export_tokens.py --token-addresses ../token_addresses.txt --provider-uri https://mainnet.infura.io --output ../tokens.csv