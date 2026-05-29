
function actualizarPlaceholder() {
    const tipo = document.getElementById('tipoCalculo').value;
    const label = document.getElementById('labelValor');
    if (tipo === 'usdt') label.innerText = 'Cantidad USDT a comprar:';
    else if (tipo === 'bolivares') label.innerText = 'Monto en Bolívares a invertir:';
    else label.innerText = 'Monto en Dólares a invertir:';
}

function calcularOperacion() {
    const tb = parseFloat(document.getElementById('tasaBanco').value);
    const ti = parseFloat(document.getElementById('tasaBinance').value);
    const valorInput = parseFloat(document.getElementById('valorInput').value);
    const tipo = document.getElementById('tipoCalculo').value;

    // Validación básica
    if (isNaN(tb) || isNaN(ti) || isNaN(valorInput)) {
        alert("Por favor, rellene todos los campos con valores numéricos.");
        return;
    }

    let usdt, montoBase, comisionBinance, comisionBanco, totalDebitar, invBs;
    const pctBinance = 0.036; 
    const pctBanco = 0.024548;

    if (tipo === 'usdt') {
        usdt = valorInput;
        montoBase = usdt / (1 - pctBinance);
        totalDebitar = montoBase / (1 - pctBanco);
        comisionBinance = montoBase * pctBinance;
        comisionBanco = totalDebitar * pctBanco;
        invBs = totalDebitar * tb;
    } else if (tipo === 'bolivares') {
        invBs = valorInput;
        totalDebitar = invBs / tb;
        comisionBanco = totalDebitar * pctBanco;
        montoBase = totalDebitar - comisionBanco;
        comisionBinance = montoBase * pctBinance;
        usdt = montoBase - comisionBinance;
    } else {
        totalDebitar = valorInput;
        comisionBanco = totalDebitar * pctBanco;
        montoBase = totalDebitar - comisionBanco;
        comisionBinance = montoBase * pctBinance;
        usdt = montoBase - comisionBinance;
        invBs = totalDebitar * tb;
    }

    const totalComisiones = comisionBinance + comisionBanco;
    const ventaBrutaBs = usdt * ti;
    const gananciaNetaBs = ventaBrutaBs - invBs;
    const gananciaTotalUsd = (ventaBrutaBs / tb) - totalDebitar;
    const margen = (gananciaTotalUsd / totalDebitar) * 100;

    document.getElementById('resultadoFinal').innerHTML = `
    <div style="border:1px solid #ddd; padding:15px; background:#f0f9ff; border-radius:5px;">
        <p>Monto total a pagar: <b>${totalDebitar.toFixed(2)} $</b></p>
        <p class="comision">Comisión Banco (2.45%): <b>${comisionBanco.toFixed(2)} $</b></p>
        <p>Monto base tarjeta: <b>${montoBase.toFixed(2)} $</b></p>
        <p class="comision">Comisión Binance (3.6%): <b>${comisionBinance.toFixed(2)} $</b></p>
        <p>USDT Netos: <b>${usdt.toFixed(2)} USDT</b></p>
        <p>Total comisiones: <b>${totalComisiones.toFixed(2)} $</b></p>
        <hr>
        <p>Inversión inicial (Bs): <b>${invBs.toFixed(2)} Bs</b></p>
        <p>Ganancia total en Bs: <span class="ganancia">${ventaBrutaBs.toFixed(2)} Bs</span></p>
        <p>Ganancia neta (Bs): <span class="ganancia">${gananciaNetaBs.toFixed(2)} Bs</span></p>
        <p>Ganancia total en $: <span class="ganancia">${gananciaTotalUsd.toFixed(2)} $</span></p>
        <p>Margen de ganancia: <span class="ganancia">${margen.toFixed(2)}%</span></p>
        <p class="ganancia">✅ RENTABLE</p>
    </div>`;
}


