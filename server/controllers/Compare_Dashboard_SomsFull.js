const $Dashboard = require('../models/dashboardMayo');
const $SomsFull = require('../models/jsonMayo');
const $DashboardSomsFull = require('../models/Dashboard_SomsFull');

exports.index = async (req, res) => {
    try {

        let dashboard = await $Dashboard.find({});
        let somsFull = await $SomsFull.find({});

        const lengthSomsFull = somsFull.length;
        const lengthDashboard = dashboard.length;

        for (let s = 0; s < lengthSomsFull; s++) {
            console.log(s);
            for (let d = 0; d < lengthDashboard; d++) {
                if (somsFull[s].remision === dashboard[d].noPedido &&
                    somsFull[s].sku === dashboard[d].sku) {
                    
                    console.log("ENTRO IF");
                    await $DashboardSomsFull.create({
                        // Soms Full
                        sku: somsFull[s].sku,
                        remision: somsFull[s].remision,
                        fecha_prom_1: somsFull[s].fecha_prom_1,
                        fecha_prom_2: somsFull[s].fecha_prom_2,
                        fecha_em: somsFull[s].fecha_em,
                        fecha_fin: somsFull[s].fecha_fin,
                        no_tienda: somsFull[s].no_tienda,
                        comentario: somsFull[s].comentario,
                        mesaevento: somsFull[s].mesaevento,
                        // Dashboard
                        sku_dash: dashboard[d].sku,
                        remision_dash: dashboard[d].noPedido,
                        fechaEstimada_1_dash: dashboard[d].fechaEstimada_1,
                        fechaEstimada_2_dash: dashboard[d].fechaEstimada_2,
                        fecha_consulta_dash: dashboard[d].fecha,
                        cp_dash: dashboard[d].cp,
                        cantidad_dash: dashboard[d].cantidad,
                        canal_dash: dashboard[d].canal,
                        tipoPago_dash: dashboard[d].tipoPago
                    });
                }
            }
        }
    
        res.status(200).json({ success: true });
    } catch(error) {
        res.status(500).json({ success: false, error });
    }

}