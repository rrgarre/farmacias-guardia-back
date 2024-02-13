const farmaciasRouter = require('express').Router()
const puppeteer = require('puppeteer')


farmaciasRouter.get('/', async (request, response) => {

    const browser = await puppeteer.launch({
        headless: false,
        // slowMo:300
    })
    const page = await browser.newPage()
    await page.goto('https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=13&mes=02&ano=2024&diaf=17&mesf=02&anof=2024')
    const data = await page.evaluate(() => {
        // const contenido = document.querySelector('body').innerText
        const contenido = [...document.querySelectorAll('div.supercontenedor')]
            .map(fila => {
                const fecha = fila.querySelector('div.fecha').innerText
                const horarioDia = fila.querySelector('div.dia').innerText
                const pijamaOscuroDia = fila.querySelector('div.fondodia').querySelector('tr.pijamaoscuro').innerText
                const pijamaClaroDia = fila.querySelector('div.fondodia').querySelector('tr.pijamaclaro').innerText
                const pijamaOscuroNoche = fila.querySelector('div.fondonoche').querySelector('tr.pijamaoscuro').innerText

                return {
                    fecha,
                    horarioDia,
                    pijamaOscuroDia,
                    pijamaClaroDia,
                    pijamaOscuroNoche
                }
                // return fila.querySelector('.dia').innerText
                // return 'x'
            })
        return contenido
    })
    console.log(data)
    await browser.close()

    return response.send(data)
    // return response.send(JSON.stringify(data))
})

module.exports = farmaciasRouter