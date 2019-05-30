const $Tiendas = require('../models/tiendas');
const $Logs = require('../models/ProcessLogs');
const  XLSX = require('xlsx');
const fs = require('fs');

exports.index = async (req, res) => {
    try {

        const query = await $Logs.aggregate([
            { 
                $match: { 
                    'request.qry_inv_req.array_obj': {  
                        $elemMatch: { 
                            skuid: '1051232239', 
                            zipcode: '52950' 
                        }
                    } 
                } 
            },
            {
                "$project": { 
                    "tiendas": "$soms.dataset",
                    "_id": 0,
                    "createdAt": 1
                }
            },
            { $sort: { 'createdAt': -1 } },
            { $limit : 1 }
        ]);

        let lengthTiendas = query.length;

        for (let i = 0; i < lengthTiendas; i++) {
            console.log(i);
            for (let t = 0; t < query[i].tiendas.length; t++) {
                if (query[i].tiendas[t].sku === '1051232239') {
                    tiendasArray = query[i].tiendas[t].resultados.map((item) => {
                        return {
                            tienda: item.ubicacion,
                            piezas: item.piezas,
                            sku: query[i].tiendas[t].sku
                        }                        
                    })
                }
            }
        }

        // JSON TO SHEET
        const worksheet = XLSX.utils.json_to_sheet(tiendasArray);
        const workbook = { Sheets: { 'FEE': worksheet }, SheetNames: ['FEE'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'buffer' });

        fs.appendFile(`./reports/tiendas_piezas_1051232239.csv`, excelBuffer, function (err) {
            if (err) throw err;
            console.log('Thanks, It\'s saved to the file!');
        });
        
        res.status(200).json({ success: true, tiendasArray });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}