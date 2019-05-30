const  XLSX = require('xlsx');
const fs = require('fs');
const $CleanDataLogs = require('../models/cleanDataLogs');
const $DashboardSomsFull = require('../models/Dashboard_SomsFull');

exports.index = async (req, res) => {
    try {
        let Logs = await $CleanDataLogs.find({}).sort({fecConsulta: 1});
        let DashboardSomsFull = await $DashboardSomsFull.find({});

        let result = [];

        const lengthLog = Logs.length;

        for (let l = 0; l < lengthLog; l++) {
            console.log(l);
            for (let d = 0; d < DashboardSomsFull.length; d++) {
                if (Logs[l].edd1 === DashboardSomsFull[d].fechaEstimada_1_dash
                    && Logs[l].edd2 === DashboardSomsFull[d].fechaEstimada_2_dash 
                    && Logs[l].sku === DashboardSomsFull[d].sku 
                    && Logs[l].zipCode === DashboardSomsFull[d].cp_dash
                    ) {
                    console.log("ENTRO", DashboardSomsFull[d].fecha_consulta_dash);

                    let lengthResult = result.length;

                    if (lengthResult > 0) {
                        for (let r = 0; r < result.length; r++) {
                            if (Logs[l].sku === result[r].sku_Log && 
                                Logs[l].fecConsulta >= result[r].fecConsulta_Log){
                                console.log("SKU DUPLICADO");
                                result.splice(r, 1);
                            }
                        }
                        result.push({
                            // LOGS
                            sku_Log: Logs[l].sku,
                            edd1_Log: Logs[l].edd1,
                            edd2_Log: Logs[l].edd2,
                            fecConsulta_Log: Logs[l].fecConsulta,
                            ubicacion_Log: Logs[l].ubicacion,
                            zipCode_Log: Logs[l].zipCode,
                            clickCollect_Log: Logs[l].clickCollect,
                            piezas_Log: Logs[l].piezas,
                            capacidadtienda_Log: Logs[l].capacidadtienda,
                            dias_Log: Logs[l].dias,
                            rechazo_Log: Logs[l].rechazo,
                            apventa_Log: Logs[l].apventa,
                            bdubicacion_Log: Logs[l].bdubicacion,
                            factseguridad_Log: Logs[l].factseguridad,
                            // SOMS FULL DASHBOARD
                            sku_S: DashboardSomsFull[d].sku,
                            fecha_prom_1_S: DashboardSomsFull[d].fecha_prom_1,
                            fecha_prom_2_S: DashboardSomsFull[d].fecha_prom_2,
                            remision_S: DashboardSomsFull[d].remision,
                            remision_S: DashboardSomsFull[d].remision,
                            fecha_em_S: DashboardSomsFull[d].fecha_em,
                            fecha_fin_S: DashboardSomsFull[d].fecha_fin,
                            tienda_S: DashboardSomsFull[d].no_tienda,
                            comentario_S: DashboardSomsFull[d].comentario,
                            mesaevento_S: DashboardSomsFull[d].mesaevento,
                            // DASHBOARD
                            sku_D: DashboardSomsFull[d].sku_dash,
                            remision_D: DashboardSomsFull[d].remision_dash,
                            fechaEstimada_1_D: DashboardSomsFull[d].fechaEstimada_1_dash,
                            fechaEstimada_2_D: DashboardSomsFull[d].fechaEstimada_2_dash,
                            fecha_consulta_D: DashboardSomsFull[d].fecha_consulta_dash,
                            cp_D: DashboardSomsFull[d].cp_dash,
                            cantidad_D: DashboardSomsFull[d].cantidad_dash,
                            canal_D: DashboardSomsFull[d].canal_dash,
                            tipoPago_D: DashboardSomsFull[d].tipoPago_dash
                        })
                    } else {
                        result.push({
                            // LOGS
                            sku_Log: Logs[l].sku,
                            edd1_Log: Logs[l].edd1,
                            edd2_Log: Logs[l].edd2,
                            fecConsulta_Log: Logs[l].fecConsulta,
                            ubicacion_Log: Logs[l].ubicacion,
                            zipCode_Log: Logs[l].zipCode,
                            clickCollect_Log: Logs[l].clickCollect,
                            piezas_Log: Logs[l].piezas,
                            capacidadtienda_Log: Logs[l].capacidadtienda,
                            dias_Log: Logs[l].dias,
                            rechazo_Log: Logs[l].rechazo,
                            apventa_Log: Logs[l].apventa,
                            bdubicacion_Log: Logs[l].bdubicacion,
                            factseguridad_Log: Logs[l].factseguridad,
                            // SOMS FULL DASHBOARD
                            sku_S: DashboardSomsFull[d].sku,
                            fecha_prom_1_S: DashboardSomsFull[d].fecha_prom_1,
                            fecha_prom_1_S: DashboardSomsFull[d].fecha_prom_2,
                            remision_S: DashboardSomsFull[d].remision,
                            remision_S: DashboardSomsFull[d].remision,
                            fecha_em_S: DashboardSomsFull[d].fecha_em,
                            fecha_fin_S: DashboardSomsFull[d].fecha_fin,
                            tienda_S: DashboardSomsFull[d].tienda,
                            comentario_S: DashboardSomsFull[d].comentario,
                            mesaevento_S: DashboardSomsFull[d].mesaevento,
                            // DASHBOARD
                            sku_D: DashboardSomsFull[d].sku_dash,
                            remision_D: DashboardSomsFull[d].remision_dash,
                            fechaEstimada_1_D: DashboardSomsFull[d].fechaEstimada_1_dash,
                            fechaEstimada_2_D: DashboardSomsFull[d].fechaEstimada_2_dash,
                            fecha_consulta_D: DashboardSomsFull[d].fecha_consulta_dash,
                            cp_D: DashboardSomsFull[d].cp_dash,
                            cantidad_D: DashboardSomsFull[d].cantidad_dash,
                            canal_D: DashboardSomsFull[d].canal_dash,
                            tipoPago_D: DashboardSomsFull[d].tipoPago_dash
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

        fs.appendFile(`./reports/Reporte_Logs_Dashboard_SomsFull_06_Mayo.csv`, excelBuffer, function (err) {
            if (err) throw err;
            console.log('Thanks, It\'s saved to the file!');
        });
        
        res.status(200).json({ success: true, lengthResutl, result});

    } catch (err) {
        res.status(500).json({ success: false, res })
    }
}