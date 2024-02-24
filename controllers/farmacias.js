const farmaciasRouter = require('express').Router()
const puppeteer = require('puppeteer')
const farmacias = require('../utils/farmacias').farmacias_lucena


farmaciasRouter.get('/:dia', async (request, response) => {

    const DIAI = 4
    const DIAF = 4
    const dia = request.params.dia
    console.log('dia: ', dia)
    
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo:300
    })
    const page = await browser.newPage()
    // await page.goto('https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=1&mes=02&ano=2024&diaf=4&mesf=02&anof=2024')
    await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${DIAI}&mes=02&ano=2024&diaf=${DIAF}&mesf=02&anof=2024`)
    // await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${dia}&mes=02&ano=2024&diaf=${dia}&mesf=02&anof=2024`)
    const data = await page.evaluate(() => {
      try {
        const contenido = [...document.querySelectorAll('div.supercontenedor')]
          .map(fila => {
            const fecha = fila.querySelector('div.fecha').innerText
            const horarioDia = fila.querySelector('div.dia').innerText
            const fondoDia = [...fila
              .querySelector('div.fondodia, div.fondodiadomingo')
              .querySelectorAll('td.farmacia')]
              .map(elem=>elem.innerText.replaceAll(' ', '').replaceAll(',','').toUpperCase())
            
            const horarioNoche = fila.querySelector('div.noche').innerText
            const fondoNoche = [...fila
              .querySelector('div.fondonoche, div.fondonochedomingo')
              .querySelectorAll('td.farmacia')]
              .map(elem=>elem.innerText.replaceAll(' ', '').replaceAll(',','').toUpperCase())
            
            return {
              fecha,
              horarioDia,
              fondoDia,
              horarioNoche,
              fondoNoche
            }
          })

        return contenido
      } catch (error) {
        return {
          'message':'no se pudo calcular resultados'
        }
      }
        
    })
    await browser.close()

    
    // console.log('XXX: ', data[0].tablaDia)
    // const farmacia = farmacias.find(elem => {
    //   return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === data[0].pijamaOscuroDia
    // })
    
    // const result = data.map(elem => {
    //   const farmacia1 = farmacias.find(elem => {
    //     return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === data[0].pijamaOscuroDia
    //   })
    //   const farmacia2 = farmacias.find(elem => {
    //     return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === data[0].pijamaClaroDia
    //   })
    //   const farmacia3 = farmacias.find(elem => {
    //     return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === data[0].pijamaOscuroNoche
    //   })
    //   return {
    //     ...elem, 
    //     pijamaOscuroDia: farmacia1,
    //     pijamaClaroDia: farmacia2,
    //     pijamaOscuroNoche: farmacia3
    //   }
    // })


    // console.log('result: ', result)
    // console.log(farmacias)
    
    
    console.log(data)
    // console.log('--------------')
    // console.log(farmacias)
    
    

    return response.send(data)
    // return response.send(result)
    // return response.send(JSON.stringify(data))
})

module.exports = farmaciasRouter