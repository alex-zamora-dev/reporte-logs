const path = require('path');
const csv = require('csvtojson');
const ContainMes = require('../helper/containMes');
const $DashboardMayo = require('../models/dashboardMayo');

exports.index = async (req, res) => {
    try {
        console.log('Convert csv to json');

        let dataMayo = path.join(__dirname, `../excels/dashboard_mayo_06.csv`);
        const dataDashMayo = await csv({}).fromFile(dataMayo);
    
        // let dashboardMayoJson = [];
    
        for (let i = 0; i < dataDashMayo.length; i++) {
            console.log(i);
            await $DashboardMayo.create({
                // Dashboard
                fechaEstimada_1: dataDashMayo[i].fechaEstimada.substr(0, 2) + '/05/2019',
                fechaEstimada_2: dataDashMayo[i].fechaEstimada.slice(11, 13) + '/05/2019',
                fecha: dataDashMayo[i].fecha,
                noPedido: dataDashMayo[i].noPedido,
                sku: dataDashMayo[i].sku,
                cp: dataDashMayo[i].cp,
                canal: dataDashMayo[i].canal,
                cantidad: dataDashMayo[i].cantidad,
                tipoPago: dataDashMayo[i].tipoPago
            });
        }

        // dashboardMayoJson.forEach(async (i) => {
        //     await $DashboardMayo.create({
        //         fechaEstimada_1: i.fechaEstimada_1,
        //         fechaEstimada_2: i.fechaEstimada_2,
        //         fecha: i.fecha,
        //         noPedido: i.noPedido,
        //         sku: i.sku,
        //         cp: i.cp,
        //         canal: i.canal,
        //         cantidad: i.cantidad,
        //         tipoPago: i.tipoPago
        //     });
        // });

        // const total = dashboardMayoJson.length;
    
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}