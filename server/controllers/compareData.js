const  XLSX = require('xlsx');
const fs = require('fs');
const $cleanDataLogs = require('../models/cleanDataLogs');
const $SterlingSomsDashboard = require('../models/SterlingSomsDashboard');
const rangeDate = require('../helper/rangeDate');

exports.index = async (req, res) => {
    try {
        let Logs = await $cleanDataLogs.find({
            // fecConsulta: {"$lte": "01/03/2019"},
            // 'sku': '1056399875',
            // 'fecConsulta': '04/03/2019'
        }).sort({fecConsulta: 1});
        let SterlingSomsDashboard = await $SterlingSomsDashboard.find({
            // 'ID_de_articulo': '1056399875'
        });

        let result = [];

        for (let i = 0; i < Logs.length ; i++) {
            console.log(i);
            for (let k = 0; k < SterlingSomsDashboard.length; k++) {
                if (Logs[i].edd1 === SterlingSomsDashboard[k].fechaEstimada_1
                    && Logs[i].edd2 === SterlingSomsDashboard[k].fechaEstimada_2 
                    && Logs[i].sku === SterlingSomsDashboard[k].ID_de_articulo 
                    && Logs[i].zipCode === SterlingSomsDashboard[k].cp
                    ) {

                    let lengthResult = result.length;

                    if (lengthResult > 0) {
                        for (let r = 0; r < result.length; r++) {
                            if (Logs[i].sku === result[r].sku_Log && 
                                Logs[i].fecConsulta >= result[r].fecConsulta_Log){
                                console.log("SKU DUPLICADO");
                                // console.log(Logs[i].fecConsulta, result[r].fecConsulta_Log);
                                // console.log(Logs[i].fecConsulta > result[r].fecConsulta_Log ? true : false);
                                result.splice(r, 1);
                                // r--;
                            }
                        }
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
                            // Sterling Soms Dashboard
                            sku_SSD: SterlingSomsDashboard[k].ID_de_articulo,
                            fecha_prom_1_SSD: SterlingSomsDashboard[k].fecha_prom_1,
                            remision_SSD: SterlingSomsDashboard[k].remision,
                            fechaEstimada_1_SSD: SterlingSomsDashboard[k].fechaEstimada_1,
                            fechaEstimada_2_SSD: SterlingSomsDashboard[k].fechaEstimada_2,
                            cp_SSD: SterlingSomsDashboard[k].cp,
                            fecha_SSD: SterlingSomsDashboard[k].fecha,
                            canal_SSD: SterlingSomsDashboard[k].canal,
                            piezas_Linea_SSD: SterlingSomsDashboard[k].Piezas_Linea,
                            cantidad_SSD: SterlingSomsDashboard[k].cantidad,
                            Nombre_Alm_Aprovisiona_SSD: SterlingSomsDashboard[k].Nombre_Alm_Aprovisiona,
                            Zona_Alm_Aprovisiona_SSS: SterlingSomsDashboard[k].Zona_Alm_Aprovisiona,
                            NO_Alm_Entrega_C_and_C_SSD: SterlingSomsDashboard[k].NO_Alm_Entrega_C_and_C,
                            Proceso_de_Linea_SSD: SterlingSomsDashboard[k].Proceso_de_Linea
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
                            // Sterling Soms Dashboard
                            sku_SSD: SterlingSomsDashboard[k].ID_de_articulo,
                            fecha_prom_1_SSD: SterlingSomsDashboard[k].fecha_prom_1,
                            remision_SSD: SterlingSomsDashboard[k].remision,
                            fechaEstimada_1_SSD: SterlingSomsDashboard[k].fechaEstimada_1,
                            fechaEstimada_2_SSD: SterlingSomsDashboard[k].fechaEstimada_2,
                            cp_SSD: SterlingSomsDashboard[k].cp,
                            fecha_SSD: SterlingSomsDashboard[k].fecha,
                            canal_SSD: SterlingSomsDashboard[k].canal,
                            piezas_Linea_SSD: SterlingSomsDashboard[k].Piezas_Linea,
                            cantidad_SSD: SterlingSomsDashboard[k].cantidad,
                            Nombre_Alm_Aprovisiona_SSD: SterlingSomsDashboard[k].Nombre_Alm_Aprovisiona,
                            Zona_Alm_Aprovisiona_SSS: SterlingSomsDashboard[k].Zona_Alm_Aprovisiona,
                            NO_Alm_Entrega_C_and_C_SSD: SterlingSomsDashboard[k].NO_Alm_Entrega_C_and_C,
                            Proceso_de_Linea_SSD: SterlingSomsDashboard[k].Proceso_de_Linea
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

        fs.appendFile(`./reports/Reporte_Logs_Soms_Sterling_Marzo_Final.csv`, excelBuffer, function (err) {
            if (err) throw err;
            console.log('Thanks, It\'s saved to the file!');
        });
        
        res.status(200).json({ success: true, lengthResutl, result});

    } catch (err) {
        res.status(500).json({ success: false, res })
    }
}