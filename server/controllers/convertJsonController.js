const path = require('path');
const csv = require('csvtojson');
const $ReportSterlingSoms = require('../models/ReportSterlingSoms');

exports.index = async (req, res) => {
    try {
        console.log('Convert csv to json');

        let csvFileSoms = path.join(__dirname, `../excels/dataSomsMarzo.csv`);
        const jsonSoms = await csv({}).fromFile(csvFileSoms);
    
        let csvFileSterling = path.join(__dirname, `../excels/dataSterling.csv`);
        const jsonSterling = await csv({}).fromFile(csvFileSterling);
    
        let reporteSterlingSoms = [];
    
        for (let i = 0; i < jsonSoms.length; i++) {
            for (let k = 0; k < jsonSterling.length; k++) {
                if (jsonSoms[i].remision === jsonSterling[k].No_Orden_PQ) {
                    console.log(i);
                    reporteSterlingSoms.push({
                        // STERLING
                        No_Orden_PQ: jsonSterling[k].No_Orden_PQ,
                        ID_de_articulo: jsonSterling[k].ID_de_articulo,
                        Nombre_Alm_Aprovisiona: jsonSterling[k].Nombre_Alm_Aprovisiona,
                        Zona_Alm_Aprovisiona: jsonSterling[k].Zona_Alm_Aprovisiona,
                        NO_Alm_Entrega_C_and_C: jsonSterling[k].NO_Alm_Entrega_C_and_C,
                        Enviar_a_Codigo_Postal: jsonSterling[k].Enviar_a_Codigo_Postal,
                        Piezas_Linea: jsonSterling[k].Piezas_Linea,
                        Proceso_de_Linea: jsonSterling[k].Proceso_de_Linea,
                        // SOMS
                        remision: jsonSoms[i].remision,
                        fecha_prom_1: jsonSoms[i].fecha_prom_1
                    });
                } 
            }
        }

        reporteSterlingSoms.forEach(async (i) => {
            await $ReportSterlingSoms.create({
                No_Orden_PQ: i.No_Orden_PQ,
                ID_de_articulo: i.ID_de_articulo,
                Nombre_Alm_Aprovisiona: i.Nombre_Alm_Aprovisiona,
                Zona_Alm_Aprovisiona: i.Zona_Alm_Aprovisiona,
                NO_Alm_Entrega_C_and_C: i.NO_Alm_Entrega_C_and_C,
                Enviar_a_Codigo_Postal: i.Enviar_a_Codigo_Postal,
                Piezas_Linea: i.Piezas_Linea,
                remision: i.remision,
                fecha_prom_1: i.fecha_prom_1,
                Proceso_de_Linea: i.Proceso_de_Linea
            });
        });

        const sterlingSomsArray = reporteSterlingSoms.length;
    
        res.status(200).json({ success: true, sterlingSomsArray });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}