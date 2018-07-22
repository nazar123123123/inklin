db.transactions.aggregate([
    { $match: { 'to': "0xa3e785ee490e1102fe32512973c96dc7dc876348" } },
    {
        $group: {
            '_id': {
                'year': { '$year': "$block_time" },
                'month': { '$month': "$block_time" },
                'day': { '$dayOfMonth': "$block_time" }
            },
            count: { $sum: 1 }

        }
    }
])