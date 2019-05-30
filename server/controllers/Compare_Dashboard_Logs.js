const  XLSX = require('xlsx');
const fs = require('fs');
const $cleanDataLogs = require('../models/cleanDataLogs');
const $dashboardMayo = require('../models/dashboardMayo');

exports.index = async (req, res) => {
    try {
        let Logs = await $cleanDataLogs.find({}).sort({fecConsulta: 1});
        let dashboardMayo = await $dashboardMayo.find({});

        let result = [];
        const lengthLogs = Logs.length;

        for (let i = 0; i < lengthLogs; i++) {
            console.log(i, Logs[i].sku);
            for (let d = 0; d < dashboardMayo.length; d++) {
                if (Logs[i].edd1 === dashboardMayo[d].fechaEstimada_1
                    && Logs[i].edd2 === dashboardMayo[d].fechaEstimada_2 
                    && Logs[i].sku === dashboardMayo[d].sku 
                    && Logs[i].zipCode === dashboardMayo[d].cp
                    ) {
                    console.log("ENTRO IF");
                    let lengthResult = result.length;

                    if (lengthResult > 0) {
                        // for (let r = 0; r < lengthResult; r++) {
                        //     if (Logs[i].sku === result[r].sku_Log 
                        //         && Logs[i].fecConsulta >= result[r].fecConsulta_Log
                        //         ){
                        //         console.log("SKU DUPLICADO");
                        //         console.log(result);
                        //         result.splice(r, 1);
                        //         // r--;
                        //     }
                        // }
                        result.push({
                            // LOGS
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
                            rechazo_Log: Logs[i].rechazo,
                            // DASHBOARD
                            sku_D: dashboardMayo[d].sku,
                            remision_D: dashboardMayo[d].noPedido,
                            fechaEstimada_1_D: dashboardMayo[d].fechaEstimada_1,
                            fechaEstimada_2_D: dashboardMayo[d].fechaEstimada_2,
                            fecha_consulta_D: dashboardMayo[d].fecha,
                            cp_D: dashboardMayo[d].cp,
                            cantidad_D: dashboardMayo[d].cantidad,
                            canal_D: dashboardMayo[d].canal,
                            tipoPago_D: dashboardMayo[d].tipoPago

                        })
                    } else {
                        result.push({
                            // LOGS
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
                            rechazo_Log: Logs[i].rechazo,
                            // DASHBOARD
                            sku_D: dashboardMayo[d].sku,
                            remision_D: dashboardMayo[d].noPedido,
                            fechaEstimada_1_D: dashboardMayo[d].fechaEstimada_1,
                            fechaEstimada_2_D: dashboardMayo[d].fechaEstimada_2,
                            fecha_consulta_D: dashboardMayo[d].fecha,
                            cp_D: dashboardMayo[d].cp,
                            cantidad_D: dashboardMayo[d].cantidad,
                            canal_D: dashboardMayo[d].canal,
                            tipoPago_D: dashboardMayo[d].tipoPago
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

        fs.appendFile(`./reports/Dashboard_Logs_Mayo_2.csv`, excelBuffer, function (err) {
            if (err) throw err;
            console.log('Thanks, It\'s saved to the file!');
        });
        
        res.status(200).json({ success: true, lengthResutl, result});

    } catch (err) {
        res.status(500).json({ success: false, res })
    }
}