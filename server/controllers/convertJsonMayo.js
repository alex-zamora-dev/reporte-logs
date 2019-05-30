const path = require('path');
const csv = require('csvtojson');
const $JsonMayo = require('../models/jsonMayo');

exports.index = async (req, res) => {
    try {
        console.log('Convert csv to json');

        let dataMayo = path.join(__dirname, `../excels/dataMayo.csv`);
        const dayaMayoJson = await csv({}).fromFile(dataMayo);
    
        let reportedayaMayoJson = [];

        let lengthSomsFull = dayaMayoJson.length;
    
        for (let i = 0; i < lengthSomsFull; i++) {  
            console.log(i);
            if (dayaMayoJson[i].fecha_em >= '06/05/2019' 
                && dayaMayoJson[i].fecha_em <= '06/05/2019') {
                await $JsonMayo.create({
                    mesaevento: dayaMayoJson[i].mesaevento,
                    fecha_em: dayaMayoJson[i].fecha_em,
                    remision: dayaMayoJson[i].remision,
                    sku: dayaMayoJson[i].sku,
                    edo_reng: dayaMayoJson[i].edo_reng,
                    fecha_prom_1: dayaMayoJson[i].fecha_prom_1,
                    fecha_prom_2: dayaMayoJson[i].fecha_prom_2,
                    fecha_fin: dayaMayoJson[i].fecha_fin,
                    no_tienda: dayaMayoJson[i].no_tienda,
                    comentario: dayaMayoJson[i].comentario
                });
            }

            // reportedayaMayoJson.push({
            //     mesaevento: dayaMayoJson[i].mesaevento,
            //     fecha_em: dayaMayoJson[i].fecha_em,
            //     remision: dayaMayoJson[i].remision,
            //     sku: dayaMayoJson[i].sku,
            //     edo_reng: dayaMayoJson[i].edo_reng,
            //     fecha_prom_1: dayaMayoJson[i].fecha_prom_1,
            //     fecha_prom_2: dayaMayoJson[i].fecha_prom_2,
            //     fecha_fin: dayaMayoJson[i].fecha_fin,
            //     no_tienda: dayaMayoJson[i].no_tienda,
            //     comentario: dayaMayoJson[i].comentario
            // });
        }

        // reportedayaMayoJson.forEach(async (i) => {
        //     await $JsonMayo.create({
        //         mesaevento: i.mesaevento,
        //         fecha_em: i.fecha_em,
        //         remision: i.remision,
        //         sku: i.sku,
        //         edo_reng: i.edo_reng,
        //         fecha_prom_1: i.fecha_prom_1,
        //         fecha_prom_2: i.fecha_prom_2,
        //         fecha_fin: i.fecha_fin,
        //         no_tienda: i.no_tienda,
        //         comentario: i.comentario
        //     });
        // });

        // const total = reportedayaMayoJson.length;
    
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }

}