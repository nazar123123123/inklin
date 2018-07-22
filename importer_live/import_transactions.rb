#!/usr/local/bin/ruby

# Used to export Blocks from a Web3 compatible endpoint
# I use:
# geth --rpc --rpccorsdomain http://localhost:8080 --fast

# Need to add a unique index for tx 
# db.transactions.createIndex({"hash":1},{unique:1})
# Last imported block:
#
# db.transactions.find().sort({"block_number": 1}).limit(1)

require 'web3/eth'
require 'mongoid'

sync_mode = ARGV[0]
mode = ARGV[1]

if sync_mode == "force"
    force_sync = true
else
    force_sync = false
end

$stdout.sync = true

 
if mode == "production"
    Mongoid.load!("./mongoid.yml", :production)
    parity_host = "parity-service"
else
    Mongoid.load!("./mongoid.yml", :development)
    parity_host = "localhost"
end

#force_sync = "yes"

# Lazy initialise the Transaction class

class Transaction
    include Mongoid::Document
    include Mongoid::Attributes::Dynamic
end



web3 = Web3::Eth::Rpc.new host: parity_host

begin
    syncing = web3.eth.syncing
    last_block = syncing["currentBlock"].to_i(16)
rescue => exception
    last_block = web3.eth.blockNumber
end

#last_block = 5131094

puts(last_block)


all_transactions = []

until last_block == 0

    begin

        block = web3.eth.getBlockByNumber(last_block, true)
        transactions = []
        for tx in block.transactions
        # Is this a token contract?
        if tx.input.match(/^0xa9059cbb/) 
            type = "token"
        else
            type = ""
        end

        transactions << {:type => type, :partition => last_block % 20, :hash => tx.hash, :block_number => last_block, :block_time => block.timestamp_time, :from => tx.from, :to => tx.to, :value => tx.value_eth, :data => tx.input}
        end
    rescue => exception
        puts(exception)
        last_block-=1            
        next
    end

    begin
        last_block-=1            
        Transaction.collection.insert_many(transactions)  
        puts("Block #{last_block} at #{block.timestamp_time}")
  
    rescue Mongo::Error::BulkWriteError => exception
        if !force_sync
            puts("Hitting existing block...retrying")
            sleep(5)
    
            begin
                web3 = Web3::Eth::Rpc.new host: parity_host

                syncing = web3.eth.syncing
                last_block = syncing["currentBlock"].to_i(16)
                puts("Syncing - #{last_block}")

            rescue => exception
                web3 = Web3::Eth::Rpc.new host: parity_host

                last_block = web3.eth.blockNumber 
                puts("Latest - #{last_block}")
            end
        else
            puts "Skipping #{last_block+1}"
        end
    end
end
