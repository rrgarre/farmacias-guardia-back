const puppeteer = require('puppeteer')
const farmacias = require('../utils/farmacias-Lucena-14900').farmacias_lucena

const getYear = async () => {
  return 'getYear(): farmacias de guardia del año XXXX'
}

const getSinceToday = async (extraDays) => {
  const DIAI = 1
  const DIAF = 31
  const HOUR_OF_CHANGE = 20
  const MINUTES_OF_CHANGE = 30
  const currentDate = new Date()
  console.log('current date: ', currentDate)
  if(currentDate.getHours() <= HOUR_OF_CHANGE)
    if(currentDate.getMinutes() < MINUTES_OF_CHANGE)
      currentDate.setDate(currentDate.getDate() - 1)
  //Ajuste del día por horario de madrugada
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()+1
  // const moreDays = 6
  const moreDays = extraDays
  // const dia = request.params.dia
  // console.log('dia: ', dia)
  
  const browser = await puppeteer.launch({
      // headless: false,
      // slowMo:300
  })
  const page = await browser.newPage()
  // await page.goto('https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=1&mes=02&ano=2024&diaf=4&mesf=02&anof=2024')
  // await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${DIAI}&mes=02&ano=2024&diaf=${DIAF}&mesf=02&anof=2024`)
  await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${currentDay}&mes=${currentMonth}&ano=2024&diaf=${currentDay+moreDays}&mesf=${currentMonth}&anof=2024`)
  // await page.goto(`https://www.cofco.org/aplicaciones/guardias/imprime2024.php?sltCiudad=13&resultado=1&dia=${dia}&mes=02&ano=2024&diaf=${dia}&mesf=02&anof=2024`)
  const data = await page.evaluate(() => {
    try {
      const contenido = [...document.querySelectorAll('div.supercontenedor')]
        .map(fila => {
          const ciudad = fila.querySelectorAll('td')[2].innerText
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
            ciudad,
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
  

  const resultadoMix = data.map(elem => { 

    const fondoDiaMixed = elem.fondoDia.map(farmacia => {
      return farmacias.find(elem => {
        return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
      })
    })
    const fondoNocheMixed = elem.fondoNoche.map(farmacia => {
      return farmacias.find(elem => {
        return elem.matcher.replaceAll(' ','').replaceAll(',','').toUpperCase() === farmacia
      })
    })

    // creamos la fecha en formato para ordenar consultas posteriores
    // aaaa-mm-dd
    // nos quedamos con la fecha y descartamos 'CORDOBA '
    let fechaTemp = elem.fecha.split(' ')[1]
    // tenemos un array con el dia, mes y año
    fechaTemp = fechaTemp.split('-')
    // Aseguramos longitudes correctas en la fecha aaaa-mm-dd
    fechaTemp[1] = fechaTemp[1].padStart(2, '0')
    const fechaFormateada = fechaTemp.reverse().join('-')
    // const fechaFormateada = elem.fecha.split(' ')[1].split('-').reverse().join('-')

    // Formateamos las horas de apertura y cierre
    const horaAperturaDia = elem.horarioDia.split(' ')[1]
    const horaCierreDia = elem.horarioDia.split(' ')[6]
    const horaAperturaNoche = elem.horarioNoche.split(' ')[1]
    const horaCierreNoche = elem.horarioNoche.split(' ')[6]

    return {
      ...elem,
      fondoDia: fondoDiaMixed,
      fondoNoche: fondoNocheMixed,
      fechaFormateada: fechaFormateada,
      horaAperturaDia: horaAperturaDia,
      horaCierreDia: horaCierreDia,
      horaAperturaNoche: horaAperturaNoche,
      horaCierreNoche: horaCierreNoche
    }
  })
  // console.log('NUEVA EJEC: ', new Date().getDate())
  // console.log(`El día actual es: ${currentDay}`)
  // console.log(`La hora actual es: ${currentDate.getHours()}`)
  // return 'getSinceToday(): farmacias de guardia desde hoy'
  return resultadoMix
}

module.exports = {
  getYear,
  getSinceToday
}