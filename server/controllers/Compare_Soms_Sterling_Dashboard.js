const path = require('path');
const csv = require('csvtojson');
const $SrterlingSomsDashboard = require('../models/SterlingSomsDashboard');
const $ReportSterlingSoms = require('../models/ReportSterlingSoms');
const ContainMes = require('../helper/containMes');

exports.index = async (req, res) => {
    try {
        console.log('Convert csv to json');

        let csvFileDashboard = path.join(__dirname, `../excels/dashboard-2da-semana-marzo.csv`);
        const jsonDashboard = await csv({}).fromFile(csvFileDashboard);

        let SterlingSoms = await $ReportSterlingSoms.find({});

        let reporteSterlingSomsDashboard = [];
    
        for (let i = 0; i < SterlingSoms.length; i++) {
            console.log(i);
            for (let k = 0; k < jsonDashboard.length; k++) {
                if (SterlingSoms[i].remision === jsonDashboard[k].noPedido &&
                    SterlingSoms[i].ID_de_articulo === jsonDashboard[k].sku) {
                        console.log("ENTRO IF")
                    reporteSterlingSomsDashboard.push({
                        // STERLING SOMS
                        No_Orden_PQ: SterlingSoms[i].No_Orden_PQ,
                        ID_de_articulo: SterlingSoms[i].ID_de_articulo,
                        Nombre_Alm_Aprovisiona: SterlingSoms[i].Nombre_Alm_Aprovisiona,
                        Zona_Alm_Aprovisiona: SterlingSoms[i].Zona_Alm_Aprovisiona,
                        NO_Alm_Entrega_C_and_C: SterlingSoms[i].NO_Alm_Entrega_C_and_C,
                        Enviar_a_Codigo_Postal: SterlingSoms[i].Enviar_a_Codigo_Postal,
                        Piezas_Linea: SterlingSoms[i].Piezas_Linea,
                        Proceso_de_Linea: SterlingSoms[i].Proceso_de_Linea,
                        remision: SterlingSoms[i].remision,
                        fecha_prom_1: SterlingSoms[i].fecha_prom_1,
                        // Dashboard
                        fechaEstimada_1: ContainMes(jsonDashboard[k].fechaEstimada) === 'marzo' 
                            ? jsonDashboard[k].fechaEstimada.substr(0, 2) + '/03/2019' 
                            : jsonDashboard[k].fechaEstimada.substr(0, 2) + '/04/2019',
                        fechaEstimada_2: ContainMes(jsonDashboard[k].fechaEstimada) === 'marzo' 
                            ? jsonDashboard[k].fechaEstimada.slice(12, 14) + '/03/2019' 
                            : jsonDashboard[k].fechaEstimada.slice(12, 14) + '/04/2019',
                        fecha: jsonDashboard[k].fecha,
                        noPedido: jsonDashboard[k].noPedido,
                        sku: jsonDashboard[k].sku,
                        cp: jsonDashboard[k].cp,
                        canal: jsonDashboard[k].canal,
                        cantidad: jsonDashboard[k].cantidad
                    });
                } 
            }
        }

        reporteSterlingSomsDashboard.forEach(async (i) => {
            await $SrterlingSomsDashboard.create({
                // STERLING SOMS
                No_Orden_PQ: i.No_Orden_PQ,
                ID_de_articulo: i.ID_de_articulo,
                Nombre_Alm_Aprovisiona: i.Nombre_Alm_Aprovisiona,
                Zona_Alm_Aprovisiona: i.Zona_Alm_Aprovisiona,
                NO_Alm_Entrega_C_and_C: i.NO_Alm_Entrega_C_and_C,
                Enviar_a_Codigo_Postal: i.Enviar_a_Codigo_Postal,
                Piezas_Linea: i.Piezas_Linea,
                Proceso_de_Linea: i.Proceso_de_Linea,
                remision: i.remision,
                fecha_prom_1: i.fecha_prom_1,
                // Dashboard
                canal: i.canal,
                fechaEstimada_1: i. fechaEstimada_1,
                fechaEstimada_2: i. fechaEstimada_2,
                fecha: i.fecha,
                noPedido: i.noPedido,
                sku: i.sku,
                cp: i.cp,
                cantidad: i.cantidad
            });
        });

        const total = reporteSterlingSomsDashboard.length;
    
        res.status(200).json({ success: true, total });
    } catch(error) {
        res.status(500).json({ success: false, error });
    }

}