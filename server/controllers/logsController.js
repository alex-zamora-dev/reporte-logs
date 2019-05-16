const mongoose = require('mongoose');
const moment = require('moment');
const path = require('path');
const csv = require('csvtojson');

// Load log model
const Logs = require('../models/ProcessLogs');

// Load validations
const validateFile = require('../validation/file');
const validateDate = require('../validation/date');

exports.upload = (req, res) => {

    // Destructuring Validation
    const { errors, isValid } = validateFile(req);

    // Check Validation
    if (!isValid) {
        return res.status(422).json({ success: false, errors });
    }

    res.status(200).json({ success: true, filename: req.file.filename });
};

exports.index = async (req, res) => {
    try {

        const { errors, isValid } = validateDate(req);

        if (!isValid) {
            return res.status(422).json({ success: false, errors });
        }

        // const logs = await Logs.findById("5c78c724ce44651eccd1df71");

        // const logs = await Logs.find({ '_id': '5c78c724ce44651eccd1df71' });

        // console.log(logs.length);

        const logs = await Logs.find({ 
            'ga.qry_inv_resp.array_obj': {
                $elemMatch: { error_code: '0' }
            },
            'request.qry_inv_req.array_obj': {
                $elemMatch: { producttype: 'SL' }
            },
            'sterling.dataset': {
                $elemMatch: { 
                    fecconsulta: {
                        '$gte': `${req.params.fechaInicio.replace('_', ' ')}`, 
                        '$lte': `${req.params.fechaFin.replace('_', ' ')}`            
                    }
                }
            }
        });

        // const logs = await Logs.find({ 
        //     'request.qry_inv_req.array_obj': {
        //         $elemMatch: { producttype: 'SL' }
        //     },
        //     'sterling.dataset': {
        //         $elemMatch: { 
        //             fecconsulta: {
        //                 '$gte': `${req.params.fechaInicio.replace('_', ' ')}`, 
        //                 '$lte': `${req.params.fechaFin.replace('_', ' ')}`            
        //             }
        //         }
        //     }
        // });

        const logsLengthOne = logs.length;
        let dataLogs = [];

        // console.log(logs[1].ga.qry_inv_resp.array_obj[1].error_code);
        // console.log("dataLogs", dataLogs.length);

        for (let i = 0; i < logsLengthOne; i++) {
            for (let a = 0; a < logs[i].request.qry_inv_req.array_obj.length; a++) {
                console.log("IF", i, a);
                console.log("ID", logs[i]._id);
                if (logs[i].ga.qry_inv_resp.array_obj[a].error_code === '0') {
                dataLogs.push({ 
                    sku: logs[i].request.qry_inv_req.array_obj[a].skuid,
                    producttype: logs[i].request.qry_inv_req.array_obj[a].producttype,
                    clickCollect: logs[i].soms.info.storenum,
                    zipCode: logs[i].soms.info.zipcode,
                    edd1: moment(logs[i].ga.qry_inv_resp.array_obj[a].edd1, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                    edd2: moment(logs[i].ga.qry_inv_resp.array_obj[a].edd2, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                    fecConsulta: moment(logs[i].sterling.dataset[a].fecconsulta, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
                });
                }
            }
        }

        // let dataLogsArray = logs.map(item => {
        //     return (
        //         item.sterling.dataset.map(element => ({
        //             sku: item.request.qry_inv_req.array_obj[0].skuid,
        //             fechaConsulta: moment(element.fecconsulta).format('DD/MM/YYYY')
        //         }))
        //     )
        // });

        // res.status(200).json({success: true, dataLogsArray });
    
        // let dataLogs2 = logs.map(item => ({
        //     // SKU
        //     sku: item.request.qry_inv_req.array_obj[0].skuid,
        //     // FECHA CONSULTA
        //     fechaConsulta: moment(item.soms.dataset[0].fecconsulta).format('DD/MM/YYYY'),
        //     // TIPO PRODUCTO
        //     tipoProducto: item.request.qry_inv_req.array_obj[0].producttype,
        //     // ZIP CODE
        //     zipCode: typeof(item.request.qry_inv_req.array_obj[0].zipcode) === 'string' ? item.request.qry_inv_req.array_obj[0].zipcode : 'N/A',
        //     // CLICK AND COLLECT
        //     clickCollect: typeof(item.request.qry_inv_req.array_obj[0].storenum) === 'string' ? item.request.qry_inv_req.array_obj[0].storenum : 'N/A',
        //     // PIEZAS
        //     piezas: typeof(item.ga1.dataset[0].resultados[0].piezas) === 'string' ? item.ga1.dataset[0].resultados[0].piezas : 'N/A',
        //     // APP VENTA
        //     apVenta: typeof(item.ga1.dataset[0].resultados[0].apventa) === 'string' ? item.ga1.dataset[0].resultados[0].apventa : 'N/A',
        //     // BD UBICACIÓN
        //     bdUbicacion: typeof(item.ga1.dataset[0].resultados[0].bdubicacion) === 'number' ? item.ga1.dataset[0].resultados[0].bdubicacion.toString() : 'N/A',
        //     // FEC BLOQUEO
        //     fecBloqueo: typeof(item.ga1.dataset[0].resultados[0].fecbloqueo) === 'string' && item.ga1.dataset[0].resultados[0].fecbloqueo.length > 0
        //         ? item.ga1.dataset[0].resultados[0].fecbloqueo
        //         : 'N/A',
        //     // FIN BLOQUEO
        //     finBloqueo: typeof(item.ga1.dataset[0].resultados[0].finbloqueo) === 'string' && item.ga1.dataset[0].resultados[0].finbloqueo > 0
        //         ? item.ga1.dataset[0].resultados[0].finbloqueo
        //         : 'N/A',
        //     // CAPACIDAD TIENDA
        //     capacidadTienda: typeof(item.ga1.dataset[0].resultados[0].capacidadtienda) === 'string' ? item.ga1.dataset[0].resultados[0].capacidadtienda : 'N/A',
        //     // DIAS
        //     dias: typeof(item.ga1.dataset[0].resultados[0].dias) === 'string'
        //         ? item.ga1.dataset[0].resultados[0].dias
        //         : 'N/A',
        //     // RECHAZO 
        //     rechazo: typeof(item.ga1.dataset[0].resultados[0].rechazo) === 'string'
        //         ? item.ga1.dataset[0].resultados[0].rechazo
        //         : 'N/A',
        //     // EDD1
        //     edd1: typeof(item.ga.qry_inv_resp.array_obj[0].edd1) === 'string'
        //         ? item.ga.qry_inv_resp.array_obj[0].edd1
        //         : 'N/A',
        //     edd2: typeof(item.ga.qry_inv_resp.array_obj[0].edd2) === 'string'
        //         ? item.ga.qry_inv_resp.array_obj[0].edd2
        //         : 'N/A'
        // }));

        // CONVERT CSV TO JSON
        console.log('Convert csv to json');
        let csvFilePath = path.join(__dirname, `../public/csv/${req.params.filename.replace('_', '.')}`);
        const dataSterling = await csv({
            flatKeys: true,
            // headers: [
            //     "Mes", "Quincena", "Click_And_Collect_mismo_Almacen",
            //     "Marca_Almacen", "Zona_Alm_Aprovisiona", "No_Alm_No_Orden_ID",
            //     "No_ Alm_Aprovisiona", "No_Orden PQ", " ID_de_articulo", "Importe",
            //     "Section", "Piezas_(linea)", "Direccion_de_entrega", "No_Alm_Entrega_C_and_C",
            //     "Enviar_a_Codigo_Postal", "Proceso_de_Linea", "Motivo_de_Rechazo", "Usuario_Rechazo",
            //     "Fecha_Asignacion", "Fecha_CONF_o_Rechazo", "Fecha_VALM", "Fecha_RALM",
            //     "Tiempo_Asignada", "Tiempo_en_CONF", "Tiempo_en_VALM", "Tiempo_en_Asignada_a_RALM"
            // ]
        }).fromFile(csvFilePath);

        const logsLength = dataLogs.length;
        const sterlingLength = dataSterling.length;

        console.log("LOGS", logsLength);
        console.log("STERLING", sterlingLength);

        let excelMaster = [];

        for (let x = 0; x < logsLength; x++) {
            // if (dataSterling[x].Enviar_a_Codigo_Postal.length <= 4) {
            //     dataSterling[x].Enviar_a_Codigo_Postal = '0' + dataSterling[x].Enviar_a_Codigo_Postal;
            // }   
            for (let y = 0; y < sterlingLength; y++) {
                console.log("LOGS", x);
                console.log("STERLING", y);
                console.log("FECHA STERLING", dataSterling[y].Mes);
                console.log("FECHA LOGS", dataLogs[x].fecConsulta);
                if ( // dataLogs[x].fecConsulta === dataSterling[y].Mes && 
                    dataLogs[x].sku === dataSterling[y].ID_de_articulo
                    // dataLogs[y].zipCode === dataSterling[x].Enviar_a_Codigo_Postal
                    ) {
                    excelMaster.push({
                        //ProcessLogs
                        fechaConsulta: dataLogs[x].fechaConsulta,
                        sku: dataLogs[x].sku,
                        zipCode: dataLogs[x].zipCode,
                        tipoProducto: dataLogs[x].tipoProducto,
                        // rechazo: dataLogs[x].rechazo,
                        // piezas: dataLogs[x].piezas,
                        // finBloqueo: dataLogs[x].finBloqueo,
                        // fecBloqueo: dataLogs[x].fecBloqueo,
                        edd1: dataLogs[x].edd1,
                        edd2: dataLogs[x].edd2,
                        // dias: dataLogs[x].dias,
                        clickCollect: dataLogs[x].clickCollect,
                        // capacidadTienda: dataLogs[x].capacidadTienda,
                        // bdUbicacion: dataLogs[x].bdUbicacion,
                        // apVenta: dataLogs[x].apVenta,
                        //Sterling
                        Mes: dataSterling[y].Mes,
                        ID_de_articulo: dataSterling[y].ID_de_articulo,
                        Enviar_a_Codigo_Postal: dataSterling[y].Enviar_a_Codigo_Postal,
                        // Fecha_Asignacion: dataSterling[y].Fecha_Asignacion,
                        // Fecha_CONF_o_Rechazo: dataSterling[y].Fecha_CONF_o_Rechazo,
                        // Fecha_RALM: dataSterling[y].Fecha_RALM,
                        // Fecha_VALM: dataSterling[y].Fecha_VALM,
                        // Importe: dataSterling[y].Importe,
                        // Marca_Almacen: dataSterling[y].Marca_Almacen,
                        // Motivo_de_Rechazo: dataSterling[y].Motivo_de_Rechazo,
                        // NO_Alm_Entrega_C_and_C: dataSterling[y].NO_Alm_Entrega_C_and_C,
                        // No_Alm_Aprovisiona: dataSterling[y].No_Alm_Aprovisiona,
                        // No_Alm_No_Orden_ID: dataSterling[y].No_Alm_No_Orden_ID,
                        // No_Orden_PQ: dataSterling[y].No_Orden_PQ,
                        // Nombre_Alm_Aprovisiona: dataSterling[y].Nombre_Alm_Aprovisiona,
                        // Piezas_Linea: dataSterling[y].Piezas_Linea,
                        // Proceso_de_Linea: dataSterling[y].Proceso_de_Linea,
                        // Quincena: dataSterling[y].Quincena,
                        // Section: dataSterling[y].Section,
                        // Tiempo_Asignada: dataSterling[y].Tiempo_Asignada,
                        // Tiempo_en_Asignada_a_RALM: dataSterling[y].Tiempo_en_Asignada_a_RALM,
                        // Tiempo_en_CONF: dataSterling[y].Tiempo_en_CONF,
                        // Tiempo_en_VALM: dataSterling[y].Tiempo_en_VALM,
                        // Usuario_Rechazo: dataSterling[y].Usuario_Rechazo,
                        // Zona_Alm_Aprovisiona: dataSterling[y].Zona_Alm_Aprovisiona
                        }
                    )
                }
            }
        }

        res.status(200).json({success: true, dataLogs, dataSterling, excelMaster });

    } catch (errors) {
        console.log(errors);
        res.status(500).json(errors);
    }
};
