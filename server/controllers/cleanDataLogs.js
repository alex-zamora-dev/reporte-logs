const $cleanDataLogs = require('../models/cleanDataLogs');
const $LogMayo = require('../models/ProcessLogMayo');
const moment = require('moment');

exports.index = async (req, res) => {
    try {

        const logs = await $LogMayo.find({
            'request.qry_inv_req.array_obj': {
                $elemMatch: { producttype: 'SL' }
            },
            'ga.qry_inv_resp.array_obj': {
                $elemMatch: { error_code: '0' }
            }
        });

        console.log(logs);
        return;

        let cleanDataLogs = [];

        for (let i = 0; i < logs.length; i++) {
            console.log(i);
            for (let a = 0; a < logs[i].request.qry_inv_req.array_obj.length; a++) {
                if (logs[i].request.qry_inv_req.array_obj[a].producttype === 'SL' && 
                    logs[i].ga.qry_inv_resp.array_obj[a].error_code === '0') {
                    cleanDataLogs.push({
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

        cleanDataLogs.forEach(async (i) => {
            await $cleanDataLogs.create({
                sku: i.sku,
                clickCollect: i.clickCollect,
                zipCode: i.zipCode,
                edd1: i.edd1,
                edd2: i.edd2,
                fecConsulta: i.fecConsulta,
                ubicacion: i.ubicacion,
                piezas: i.piezas,
                apventa: i.apventa,
                bdubicacion: i.bdubicacion,
                fecbloqueo: i.fecbloqueo,
                finbloqueo: i.finbloqueo,
                factseguridad: i.factseguridad,
                capacidadtienda: i.capacidadtienda,
                dias: i.dias,
                rechazo: i.rechazo
            });
        });

        let total = cleanDataLogs.length;
    
        res.status(200).json({ success: true, cleanDataLogs, total });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}