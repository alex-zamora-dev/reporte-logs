const $cleanDataLogs = require('../models/cleanDataLogs');
// const $cleanDataLogsMarzo = require('../models/cleanDataLogsMarzo');
const $Logs = require('../models/ProcessLogs');
const $LogsMarzo = require('../models/processlogs_marzo');
const moment = require('moment');

exports.index = async (req, res) => {
    try {

        const logs = await $Logs.find({
            'ga.qry_inv_resp.array_obj': {
                $elemMatch: { error_code: '0' }
            },
            'request.qry_inv_req.array_obj': {
                $elemMatch: { producttype: 'SL' }
            },
            'sterling.dataset': {
                $elemMatch: { 
                    fecconsulta: {
                        '$gte': '06-05-2019 00:00:00', 
                        '$lte': '07-05-2019 00:00:00'            
                    }
                }
            }
        });

        let cleanDataLogs = [];

        let lengthLogs = logs.length;

        for (let i = 0; i < lengthLogs; i++) {
            console.log(i);
            for (let a = 0; a < logs[i].request.qry_inv_req.array_obj.length; a++) {
                if (logs[i].request.qry_inv_req.array_obj[a].producttype === 'SL' && 
                    logs[i].ga.qry_inv_resp.array_obj[a].error_code === '0') {
                    
                    await $cleanDataLogs.create({
                        sku: logs[i].request.qry_inv_req.array_obj[a].skuid,
                        clickCollect: logs[i].soms.info.storenum,
                        zipCode: logs[i].soms.info.zipcode,
                        edd1: moment(logs[i].ga.qry_inv_resp.array_obj[a].edd1, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        edd2: moment(logs[i].ga.qry_inv_resp.array_obj[a].edd2, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        // fecConsulta: moment(logs[i].sterling.dataset[a].fecconsulta, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
                        fecConsulta: logs[i].sterling.dataset[a].fecconsulta,
                        ubicacion: logs[i].ga1.dataset[a].resultados[0].ubicacion,
                        piezas: logs[i].ga1.dataset[a].resultados[0].piezas,
                        apventa: logs[i].ga1.dataset[a].resultados[0].apventa,
                        bdubicacion: logs[i].ga1.dataset[a].resultados[0].bdubicacion,
                        fecbloqueo: logs[i].ga1.dataset[a].resultados[0].fecbloqueo,
                        finbloqueo: logs[i].ga1.dataset[a].resultados[0].finbloqueo,
                        factseguridad: logs[i].ga1.dataset[a].resultados[0].factseguridad,
                        capacidadtienda: logs[i].ga1.dataset[a].resultados[0].capacidadtienda,
                        dias: logs[i].ga1.dataset[a].resultados[0].dias,
                        rechazo: logs[i].ga1.dataset[a].resultados[0].rechazo
                    });
                }
            }
        }
    
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}