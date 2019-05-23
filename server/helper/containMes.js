const ContainMes = (fechaEstimada) => {
    const marzo = fechaEstimada.includes("marzo");

    if (marzo) {
        return "marzo";
    } else {
        return "abril";
    }
}

module.exports = ContainMes;