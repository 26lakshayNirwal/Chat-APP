import React from 'react'
import{Line , Doughnut} from "react-chartjs-2"
import { Chart as ChartJS ,
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend,
    plugins,
    scales,
} from 'chart.js'
import { getLast7Days } from '../../lib/features'
import { Orange } from '../../constants/color';

const labels=getLast7Days();

const lineChartOptions={
    responsive :true,
    plugins:{
        legend :{
            display : false,
        },
        title :{
            display:false,
        }
    },

    scales:{
        x:{
            grid:{
                display:false,
            }
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false,
            }
        },

    },
}

ChartJS.register(
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend
);

const Linechart = ({value=[]}) => {
    const data ={
        labels,
        datasets:[
            {
                data:value,
                label:"Revenue",
                fill:false,
                backgroundColor : "rgba(75,192,192,0.2)",
                borderColor:"rgba(75,192,192,1)",
            }
        ]
    }
  return <Line data={data} options={lineChartOptions}/>
}

const doughnutChartOptions={
    responsive :true,
    plugins:{
        legend :{
            display : false,
        },
        title :{
            display:false,
        }
    },
    cutout:100,

    
}

const DoughnutChart = ({value=[],labels=[]}) => {
    const data ={
        labels,
        datasets:[
            {
                data:value,
                label:"Total Chats vs Group Chats",
                backgroundColor : ["rgba(75,192,192,0.2)",Orange],
                hoverBackgroundColor :["rgba(75,192,192,1)","red"],
                borderColor:["rgba(75,192,192,1)",Orange],
                offset:10,
            }
        ]
    }
    return <Doughnut  style={{zIndex:10}} data={data} options={doughnutChartOptions}/>
  }

export  {Linechart, DoughnutChart};
