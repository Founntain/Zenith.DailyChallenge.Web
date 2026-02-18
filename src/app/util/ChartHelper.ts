export class ChartHelper{
  public getChartData(
    datasets: any[],
    labels: any[],
    borderColors: any[],
    pointBackgroundColors: any[],
    pointBorderColor: any[],
    xAxisIds: any[],
    yAxisIds: any[]): any[]{
    let result = [];

    for (let i = 0; i < datasets.length; i++) {
      let dataset = datasets[i];
      let label = labels[i];
      let borderColor = borderColors[i];
      let pointBackgroundColor = borderColors[i];
      let pointBorderColor = pointBackgroundColors[i];
      let xAxisId = xAxisIds[i];
      let yAxisId = yAxisIds[i];

      result.push({
        data: dataset,
        label: label,
        borderColor: borderColor,
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointHitRadius: 20,
        fill: 'origin',
        xAxisId: xAxisId,
        yAxisId: yAxisId,
      })
    }

    return result;
  }

  public getRecentDaysChartData(data: any[]){
    return [
      {
        data: data.map(x => {return x.apm.avg}),
        label: 'Average APM',
        borderColor: 'rgb(129,205,252)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(129,205,252)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yLeft',
      },
      {
        data: data.map(x => {return x.apm.max}),
        label: 'Peak APM',
        borderColor: 'rgb(50,142,234)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(50,142,234)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yLeft',
      },

      {
        data: data.map(x => {return x.vs.avg}),
        label: 'Average VS',
        borderColor: 'rgb(255,206,142)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(255,206,142)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yLeft',
      },
      {
        data: data.map(x => {return x.vs.max}),
        label: 'Peak VS',
        borderColor: 'rgb(255,155,84)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(255,155,84)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yLeft',
      },

      {
        data: data.map(x => {return x.altitude.avg}),
        label: 'Average Altitude',
        borderColor:'rgb(187,136,253)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(150,28,248)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yRight',
      },
      {
        data: data.map(x => {return x.altitude.max}),
        label: 'Peak Altitude',
        borderColor: 'rgb(124,71,215)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(150,28,248)',
        pointHitRadius: 20,
        fill: 'origin',
        yAxisID: 'yRight',
      },
    ]
  }

  public getModBasedChartData(data: any){
    let hitradius = 10;

    return [
      {
        data: data.noMod.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'No Mod',
        borderColor: 'rgb(255,255,255)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgba(255,255,255,1)',
        pointBorderColor: 'rgb(150,150,150)',
        pointHitRadius: hitradius,
        fill: 'origin',
      },
      {
        data: data.expert.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Expert',
        borderColor: 'rgb(255,235,12)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(255,235,12)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.noHold.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'No Hold',
        borderColor: 'rgb(255,12,178)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(255,12,178)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.messy.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Messy',
        borderColor: 'rgb(231, 102, 71)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(231, 102, 71)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.gravity.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Gravity',
        borderColor: 'rgb(246, 164, 62)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(246, 164, 62)',
        pointBorderColor: 'rgb(255,255,255)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.volatile.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Volatile',
        borderColor: 'rgb(226, 67, 93)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(226, 67, 93)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.doubleHole.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Double Hole',
        borderColor: 'rgb(73, 153, 233)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(73, 153, 233)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.invisible.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Invisible',
        borderColor: 'rgb(133, 68, 226)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(133, 68, 226)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.allSpin.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'All Spin',
        borderColor: 'rgb(66, 217, 157)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(66, 217, 157)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },

      {
        data: data.reverseExpert.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'The Tyrant',
        // borderDash: [1, 1],
        borderColor: 'rgb(217,199,18)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(217,199,18)',
        pointBorderColor: 'rgb(255,255,255)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseNoHold.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Asceticism',
        // borderDash: [1, 1],
        borderColor: 'rgb(210,14,148)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(210,14,148)',
        pointBorderColor: 'rgb(255,255,255)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseMessy.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Loaded Dice',
        // borderDash: [1, 1],
        borderColor: 'rgb(189,83,58)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(189,83,58)',
        pointBorderColor: 'rgb(255,255,255)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseGravity.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Freefall',
        // borderDash: [1, 1],
        borderColor: 'rgb(213,143,55)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(213,143,55)',
        pointBorderColor: 'rgb(255,255,255)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseVolatile.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Last Stand',
        // borderDash: [1, 1],
        borderColor: 'rgb(148,44,61)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(148,44,61)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseDoubleHole.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'Damnation',
        // borderDash: [1, 1],
        borderColor: 'rgb(57, 119, 181)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(57, 119, 181)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseInvisible.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'The Exile',
        // borderDash: [1, 1],
        borderColor: 'rgb(102, 52, 175)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(102, 52, 175)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
      {
        data: data.reverseAllspin.map((y: number, i: number) => ({ x: i + 1, y })),
        label: 'The Warlock',
        // borderDash: [1, 1],
        borderColor: 'rgb(48, 158, 114)',
        backgroundColor: 'rgba(0,0,0,0)',
        pointBackgroundColor: 'rgb(48, 158, 114)',
        pointBorderColor: 'rgba(255,255,255,1)',
        pointHitRadius: 20,
        fill: 'origin',
      },
    ]
  }

  public getModChartAnnotations(): any{
    let annotationFont = {
      family: 'Space Grotesk',
      weight: 'bold',
      size: 14,
    }

    return {
      annotations: {
        floor10: {
          type: 'line',
          yMin: 1650,
          yMax: 1650,
          borderColor: 'rgb(131, 78, 166)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Platform of the Gods',
            position: 'center',
            font: annotationFont
          }
        },
        floor9: {
          type: 'line',
          yMin: 1350,
          yMax: 1350,
          borderColor: 'rgb(117, 196, 141)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Corruption',
            position: 'center',
            annotationFont
          }
        },
        floor8: {
          type: 'line',
          yMin: 1100,
          yMax: 1100,
          borderColor: 'rgb(192, 5, 90)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'The Core',
            position: 'center',
            annotationFont
          }
        },
        floor7: {
          type: 'line',
          yMin: 850,
          yMax: 850,
          borderColor: 'rgb(3, 166, 194)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Laboratory',
            position: 'center',
            annotationFont
          }
        },
        floor6: {
          type: 'line',
          yMin: 650,
          yMax: 650,
          borderColor: 'rgb(191, 112, 98)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Offices',
            // position: 'center',
            annotationFont
          }
        },
        floor5: {
          type: 'line',
          yMin: 450,
          yMax: 450,
          borderColor: 'rgb(188, 140, 56)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Museum',
            position: 'center',
            annotationFont
          }
        },
        floor4: {
          type: 'line',
          yMin: 300,
          yMax: 300,
          borderColor: 'rgb(192, 140, 151)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Arena',
            position: 'center',
            annotationFont
          }
        },
        floor3: {
          type: 'line',
          yMin: 150,
          yMax: 150,
          borderColor: 'rgb(189, 150, 107)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Casino',
            position: 'center',
            annotationFont
          }
        },
        floor2: {
          type: 'line',
          yMin: 50,
          yMax: 50,
          borderColor: 'rgb(186, 171, 113)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            // content: 'Hotel',
            position: 'center',
            annotationFont
          }
        },
      }
    }
  }
}
