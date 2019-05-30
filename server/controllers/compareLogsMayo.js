const  XLSX = require('xlsx');
const fs = require('fs');
const $JsonMayo = require('../models/jsonMayo');
const $CleanDataLogs = require('../models/cleanDataLogs');

exports.index = async (req, res) => {
    try {
        let Logs = await $CleanDataLogs.find({}).sort({fecConsulta: 1});
        let JsonMayo = await $JsonMayo.find({});

        let result = [];

        for (let i = 0; i < Logs.length ; i++) {
            console.log(i);
            for (let k = 0; k < JsonMayo.length; k++) {
                if (Logs[i].edd1 === JsonMayo[k].fecha_prom_1
                    && Logs[i].edd2 === JsonMayo[k].fecha_prom_2 
                    && Logs[i].sku === JsonMayo[k].sku
                    ) {

                    let lengthResult = result.length;

                    if (lengthResult > 0) {
                        for (let r = 0; r < result.length; r++) {
                            if (Logs[i].sku === result[r].sku_Log && 
                                Logs[i].fecConsulta >= result[r].fecConsulta_Log){
                                console.log("SKU DUPLICADO");
                                result.splice(r, 1);
                            }
                        }
                        result.push({
                            // Json Mayo
                            mesaevento: JsonMayo[k].mesaevento,
                            fecha_em: JsonMayo[k].fecha_em,
                            remision: JsonMayo[k].remision,
                            sku: JsonMayo[k].sku,
                            edo_reng: JsonMayo[k].edo_reng,
                            fecha_prom_1: JsonMayo[k].fecha_prom_1,
                            fecha_prom_2: JsonMayo[k].fecha_prom_2,
                            fecha_fin: JsonMayo[k].fecha_fin,
                            no_tienda: JsonMayo[k].no_tienda,
                            comentario: JsonMayo[k].comentario,
                            // Logs
                            sku_Log: Logs[i].sku,
                            edd1_Log: Logs[i].edd1,
                            edd2_Log: Logs[i].edd2,
                            clickCollect_Log: Logs[i].clickCollect,
                            zipCode_Log: Logs[i].zipCode,
                            fecConsulta_Log: Logs[i].fecConsulta,
                            ubicacion_Log: Logs[i].ubicacion,
                            piezas_Log: Logs[i].piezas,
                            apventa_Log: Logs[i].apventa,
                            bdubicacion_Log: Logs[i].bdubicacion,
                            factseguridad_Log: Logs[i].factseguridad,
                            capacidadtienda_Log: Logs[i].capacidadtienda,
                            dias_Log: Logs[i].dias,
                            rechazo_Log: Logs[i].rechazo
                        })
                    } else {
                        result.push({
                            // Json Mayo
                            mesaevento: JsonMayo[k].mesaevento,
                            fecha_em: JsonMayo[k].fecha_em,
                            remision: JsonMayo[k].remision,
                            sku: JsonMayo[k].sku,
                            edo_reng: JsonMayo[k].edo_reng,
                            fecha_prom_1: JsonMayo[k].fecha_prom_1,
                            fecha_prom_2: JsonMayo[k].fecha_prom_2,
                            fecha_fin: JsonMayo[k].fecha_fin,
                            no_tienda: JsonMayo[k].no_tienda,
                            comentario: JsonMayo[k].comentario,
                            // Logs
                            sku_Log: Logs[i].sku,
                            edd1_Log: Logs[i].edd1,
                            edd2_Log: Logs[i].edd2,
                            clickCollect_Log: Logs[i].clickCollect,
                            zipCode_Log: Logs[i].zipCode,
                            fecConsulta_Log: Logs[i].fecConsulta,
                            ubicacion_Log: Logs[i].ubicacion,
                            piezas_Log: Logs[i].piezas,
                            apventa_Log: Logs[i].apventa,
                            bdubicacion_Log: Logs[i].bdubicacion,
                            factseguridad_Log: Logs[i].factseguridad,
                            capacidadtienda_Log: Logs[i].capacidadtienda,
                            dias_Log: Logs[i].dias,
                            rechazo_Log: Logs[i].rechazo
                        })
                    }
                } // PRIMER IF
            } // SEGUNDO FOR
        } // PRIMER FOR

        const lengthResutl = result.length;

        // JSON TO SHEET
        const worksheet = XLSX.utils.json_to_sheet(result);
        const workbook = { Sheets: { 'FEE': worksheet }, SheetNames: ['FEE'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'buffer' });

        fs.appendFile(`./reports/Reporte_Logs_Mayo.csv`, excelBuffer, function (err) {
            if (err) throw err;
            console.log('Thanks, It\'s saved to the file!');
        });
        
        res.status(200).json({ success: true, lengthResutl, result});

    } catch (err) {
        res.status(500).json({ success: false, res })
    }
}